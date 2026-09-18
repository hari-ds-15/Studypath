import json
from typing import List, Dict, Tuple, Any
from sqlalchemy.orm import Session

from app.models.course import Course, Enrollment, SavedCourse
from app.models.profile import StudentProfile
from app.models.quiz import QuizAttempt, Quiz
from app.models.user import User
from app.ml.content_based import content_recommender
from app.ml.collaborative import collaborative_recommender
from app.ml.knn_recommender import knn_recommender
from app.schemas import CourseRecommendationOut, ElectiveRecommendationOut

class HybridRecommendationEngine:
    def __init__(self, w_cb: float = 0.40, w_cf: float = 0.30, w_knn: float = 0.30):
        self.w_cb = w_cb
        self.w_cf = w_cf
        self.w_knn = w_knn

    def get_course_recommendations(
        self, 
        user_id: int, 
        db: Session
    ) -> List[CourseRecommendationOut]:
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
        courses = db.query(Course).filter(Course.is_elective == False).all()
        
        if not courses:
            return []
        
        # If profile doesn't exist, create a default one
        if not profile:
            profile = StudentProfile(
                user_id=user_id,
                education_level="Undergraduate",
                branch_major="Computer Science & Engineering",
                learning_speed="Balanced",
                preferred_content_type="Interactive & Practice",
                average_study_hours=3.5,
                strong_subjects='["Python Programming", "Mathematics"]',
                weak_subjects='["Data Structures", "Database Systems"]',
                career_interests='["AI Engineer", "Full Stack Developer"]'
            )
            db.add(profile)
            db.commit()
            db.refresh(profile)

        # 1. Content-Based recommendations
        cb_recs = content_recommender.get_recommendations(profile, courses)
        cb_map = {c.id: (score, reason) for c, score, reason in cb_recs}

        # 2. Collaborative Filtering recommendations
        cf_recs = collaborative_recommender.get_recommendations(user_id, courses, db)
        cf_map = {c.id: (score, reason) for c, score, reason in cf_recs}

        # 3. KNN recommendations
        knn_recs = knn_recommender.get_recommendations(profile, courses, db)
        knn_map = {c.id: (score, reason) for c, score, reason in knn_recs}

        # Query user saved & enrolled courses
        saved_course_ids = {s.course_id for s in db.query(SavedCourse).filter(SavedCourse.user_id == user_id).all()}
        enrolled_course_ids = {e.course_id for e in db.query(Enrollment).filter(Enrollment.user_id == user_id).all()}

        # Recent quiz attempts by user to adjust scores adaptively
        quiz_attempts = (
            db.query(QuizAttempt)
            .filter(QuizAttempt.user_id == user_id)
            .order_by(QuizAttempt.completed_at.desc())
            .all()
        )
        quiz_course_scores: Dict[int, float] = {}
        for qa in quiz_attempts:
            if qa.quiz and qa.quiz.course_id:
                if qa.quiz.course_id not in quiz_course_scores:
                    quiz_course_scores[qa.quiz.course_id] = qa.score_percentage

        output: List[CourseRecommendationOut] = []

        for course in courses:
            cb_score, cb_reason = cb_map.get(course.id, (70.0, ""))
            cf_score, cf_reason = cf_map.get(course.id, (70.0, ""))
            knn_score, knn_reason = knn_map.get(course.id, (70.0, ""))

            # Ensemble weighted score
            blended_score = (cb_score * self.w_cb) + (cf_score * self.w_cf) + (knn_score * self.w_knn)

            # Adaptive dynamic adjustments from recent quiz performance
            final_reason = cb_reason
            if course.id in quiz_course_scores:
                last_score = quiz_course_scores[course.id]
                if last_score < 70.0:
                    blended_score = min(98.5, blended_score + 6.0)
                    final_reason = f"High Priority: Reinforces foundational concepts where recent quiz score was {int(last_score)}%."
                else:
                    blended_score = max(60.0, blended_score - 4.0)
                    final_reason = f"Completed with {int(last_score)}% quiz mastery. Recommended for advanced revision."
            elif any(s.lower() in course.title.lower() for s in json.loads(profile.weak_subjects or "[]")):
                blended_score = min(97.0, blended_score + 5.0)
                final_reason = f"Addresses identified weakness in {course.title.split(':')[0]} based on learning diagnostics."

            final_score = round(min(99.0, max(50.0, blended_score)), 1)
            
            tags = json.loads(course.tags or "[]")

            output.append(CourseRecommendationOut(
                course_id=course.id,
                course_name=course.title,
                code=course.code,
                category=course.category,
                difficulty=course.difficulty,
                estimated_duration=course.estimated_duration,
                learning_format=course.learning_format,
                description=course.description,
                match_score=final_score,
                explanation=final_reason or "Recommended based on your academic profile and peer learning pathways.",
                algorithm="Hybrid (Content 40% + CF 30% + KNN 30%)",
                tags=tags,
                is_saved=course.id in saved_course_ids,
                is_enrolled=course.id in enrolled_course_ids,
                image_url=course.image_url or "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
                free_resources=json.loads(course.free_resources or "[]")
            ))

        output.sort(key=lambda x: x.match_score, reverse=True)
        return output

    def get_elective_recommendations(
        self, 
        user_id: int, 
        db: Session
    ) -> List[ElectiveRecommendationOut]:
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
        electives = db.query(Course).filter(Course.is_elective == True).all()

        if not electives:
            # Fallback to all courses if no specific electives flagged
            electives = db.query(Course).all()

        saved_course_ids = {s.course_id for s in db.query(SavedCourse).filter(SavedCourse.user_id == user_id).all()}
        career_list = json.loads(profile.career_interests or "[]") if profile else []
        strong_list = json.loads(profile.strong_subjects or "[]") if profile else []

        output: List[ElectiveRecommendationOut] = []

        for elective in electives:
            prereqs = json.loads(elective.prerequisites or "[]")
            syllabus = json.loads(elective.syllabus or "[]")
            syllabus_preview = [m.get("title", "") for m in syllabus[:3]] if isinstance(syllabus, list) and syllabus and isinstance(syllabus[0], dict) else ["Module 1: Foundations", "Module 2: Applied Architecture", "Module 3: Capstone"]

            # Match calculation based on career track & prerequisites
            match = 80.0
            reasons = []

            for career in career_list:
                if career.lower() in elective.career_track.lower() or career.lower() in elective.title.lower():
                    match += 10.0
                    reasons.append(f"Directly accelerates your target career path as a {career}")

            for strong in strong_list:
                if any(strong.lower() in p.lower() for p in prereqs):
                    match += 6.0
                    reasons.append(f"Your strong performance in {strong} fulfills prerequisites")

            if not reasons:
                reasons.append(f"Highly valued specialization track in industry for {elective.category} engineering")

            match_score = round(min(98.0, max(65.0, match)), 1)

            output.append(ElectiveRecommendationOut(
                course_id=elective.id,
                course_name=elective.title,
                category=elective.category,
                match_score=match_score,
                why_recommended=". ".join(reasons) + ".",
                prerequisites=prereqs,
                difficulty=elective.difficulty,
                career_relevance=elective.career_track,
                syllabus_preview=syllabus_preview,
                is_saved=elective.id in saved_course_ids,
                free_resources=json.loads(elective.free_resources or "[]")
            ))

        output.sort(key=lambda x: x.match_score, reverse=True)
        return output

hybrid_engine = HybridRecommendationEngine()
