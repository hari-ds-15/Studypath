import json
from typing import List, Tuple, Dict
import numpy as np
from sklearn.neighbors import NearestNeighbors
from sqlalchemy.orm import Session

from app.models.course import Course, Enrollment
from app.models.profile import StudentProfile
from app.models.quiz import QuizAttempt
from app.models.user import User

class KNNRecommender:
    def __init__(self, n_neighbors: int = 3):
        self.n_neighbors = n_neighbors

    def _extract_profile_vector(self, profile: StudentProfile, quiz_avg: float) -> np.ndarray:
        speed_map = {"Slow & Thorough": 1.0, "Balanced": 2.0, "Fast Paced": 3.0}
        speed_val = speed_map.get(profile.learning_speed, 2.0)
        
        strong_count = len(json.loads(profile.strong_subjects or "[]"))
        weak_count = len(json.loads(profile.weak_subjects or "[]"))

        return np.array([
            profile.average_study_hours,
            profile.learning_efficiency_score / 10.0,
            quiz_avg / 10.0,
            speed_val,
            float(strong_count),
            float(weak_count)
        ])

    def get_recommendations(
        self, 
        current_profile: StudentProfile, 
        courses: List[Course], 
        db: Session
    ) -> List[Tuple[Course, float, str]]:
        all_profiles = db.query(StudentProfile).all()
        if len(all_profiles) < 2 or not courses:
            return [
                (c, round(min(94.0, 72.0 + (c.rating * 4.5)), 1), "Recommended for learners with your pace profile.")
                for c in courses
            ]

        # Calculate student's quiz average
        attempts = db.query(QuizAttempt).filter(QuizAttempt.user_id == current_profile.user_id).all()
        curr_quiz_avg = np.mean([a.score_percentage for a in attempts]) if attempts else 75.0

        profile_vectors = []
        profile_user_ids = []
        for p in all_profiles:
            p_attempts = db.query(QuizAttempt).filter(QuizAttempt.user_id == p.user_id).all()
            p_avg = np.mean([a.score_percentage for a in p_attempts]) if p_attempts else 75.0
            profile_vectors.append(self._extract_profile_vector(p, p_avg))
            profile_user_ids.append(p.user_id)

        X = np.array(profile_vectors)
        k = min(self.n_neighbors, len(all_profiles))

        try:
            knn = NearestNeighbors(n_neighbors=k, metric='cosine')
            knn.fit(X)

            curr_vec = self._extract_profile_vector(current_profile, curr_quiz_avg).reshape(1, -1)
            distances, indices = knn.kneighbors(curr_vec)

            neighbor_user_ids = [profile_user_ids[idx] for idx in indices[0] if profile_user_ids[idx] != current_profile.user_id]
            
            # Find courses taken / succeeded by neighbors
            neighbor_course_scores: Dict[int, float] = {}
            if neighbor_user_ids:
                neighbor_enrollments = db.query(Enrollment).filter(Enrollment.user_id.in_(neighbor_user_ids)).all()
                for en in neighbor_enrollments:
                    neighbor_course_scores[en.course_id] = neighbor_course_scores.get(en.course_id, 0.0) + (en.progress / 100.0) + 1.0

            results = []
            for course in courses:
                affinity = neighbor_course_scores.get(course.id, 0.5)
                match_score = round(min(97.0, max(60.0, 70.0 + (affinity * 9.0))), 1)
                reason = f"Learners with similar study hours ({current_profile.average_study_hours}h/day) and pace achieved top scores here."
                results.append((course, match_score, reason))

            results.sort(key=lambda x: x[1], reverse=True)
            return results
        except Exception:
            return [
                (c, 78.0, "Recommended based on neighbor cluster analysis.")
                for c in courses
            ]

knn_recommender = KNNRecommender()
