import json
from typing import List, Dict, Any, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.models.course import Course
from app.models.profile import StudentProfile

class ContentBasedRecommender:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)

    def _build_course_document(self, course: Course) -> str:
        tags = " ".join(json.loads(course.tags or "[]"))
        prereqs = " ".join(json.loads(course.prerequisites or "[]"))
        return f"{course.title} {course.category} {course.difficulty} {course.description} {tags} {prereqs} {course.career_track} {course.learning_format}"

    def _build_user_query(self, profile: StudentProfile) -> str:
        strong = " ".join(json.loads(profile.strong_subjects or "[]"))
        weak = " ".join(json.loads(profile.weak_subjects or "[]"))
        careers = " ".join(json.loads(profile.career_interests or "[]"))
        return f"{profile.branch_major} {profile.education_level} {strong} {weak} {careers} {profile.preferred_content_type} {profile.learning_speed}"

    def get_recommendations(
        self, 
        profile: StudentProfile, 
        courses: List[Course]
    ) -> List[Tuple[Course, float, str]]:
        """
        Returns list of (Course, match_score_0_to_100, reason_explanation)
        """
        if not courses:
            return []

        user_query = self._build_user_query(profile)
        course_docs = [self._build_course_document(c) for c in courses]
        
        all_corpus = [user_query] + course_docs
        try:
            tfidf_matrix = self.vectorizer.fit_transform(all_corpus)
            user_vec = tfidf_matrix[0:1]
            course_vecs = tfidf_matrix[1:]
            
            sim_scores = cosine_similarity(user_vec, course_vecs).flatten()
        except Exception:
            # Fallback if vocabulary is too sparse
            sim_scores = np.ones(len(courses)) * 0.5

        results = []
        strong_list = json.loads(profile.strong_subjects or "[]")
        weak_list = json.loads(profile.weak_subjects or "[]")
        career_list = json.loads(profile.career_interests or "[]")

        for i, course in enumerate(courses):
            raw_score = float(sim_scores[i])
            # Scale to 65% - 98% range for realistic EdTech match score
            match_score = round(min(98.0, max(55.0, (raw_score * 45.0) + 55.0)), 1)
            
            # Generate personalized reasoning
            matched_weak = [s for s in weak_list if s.lower() in course.title.lower() or s.lower() in course.category.lower() or s.lower() in (course.tags or "").lower()]
            matched_career = [c for c in career_list if c.lower() in course.career_track.lower() or c.lower() in course.title.lower()]
            matched_strong = [s for s in strong_list if s.lower() in (course.prerequisites or "").lower() or s.lower() in course.description.lower()]

            if matched_weak:
                reason = f"Targets your growth area in {matched_weak[0]} with structured hands-on modules."
                match_score = min(98.0, match_score + 6.0)
            elif matched_career:
                reason = f"Directly aligns with your career interest in {matched_career[0]}."
                match_score = min(98.0, match_score + 4.0)
            elif matched_strong:
                reason = f"Builds upon your strong foundation in {matched_strong[0]}."
            else:
                reason = f"High affinity with your {profile.branch_major} track and learning format."

            results.append((course, match_score, reason))

        # Sort descending by match score
        results.sort(key=lambda x: x[1], reverse=True)
        return results

content_recommender = ContentBasedRecommender()
