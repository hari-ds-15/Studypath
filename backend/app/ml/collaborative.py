import json
from typing import List, Dict, Tuple, Optional
import numpy as np
from sklearn.decomposition import TruncatedSVD
from sqlalchemy.orm import Session

from app.models.course import Course, Enrollment, SavedCourse
from app.models.quiz import QuizAttempt
from app.models.user import User

class CollaborativeRecommender:
    def __init__(self, n_components: int = 2):
        self.n_components = n_components

    def get_user_item_matrix(self, db: Session, courses: List[Course]) -> Tuple[np.ndarray, List[int], Dict[int, int]]:
        """
        Builds interaction matrix (users x courses) with values based on enrollment, completion, and quiz scores.
        """
        all_users = db.query(User).all()
        if not all_users or not courses:
            return np.zeros((1, 1)), [], {}

        user_ids = [u.id for u in all_users]
        user_idx_map = {uid: i for i, uid in enumerate(user_ids)}
        course_ids = [c.id for c in courses]
        course_idx_map = {cid: j for j, cid in enumerate(course_ids)}

        matrix = np.zeros((len(user_ids), len(courses)))

        # Enrollments
        enrollments = db.query(Enrollment).all()
        for en in enrollments:
            if en.user_id in user_idx_map and en.course_id in course_idx_map:
                u_idx = user_idx_map[en.user_id]
                c_idx = course_idx_map[en.course_id]
                # Weight based on completion/progress (1.0 to 3.0)
                matrix[u_idx, c_idx] = max(matrix[u_idx, c_idx], 1.0 + (en.progress / 50.0))

        # Saved courses
        saved = db.query(SavedCourse).all()
        for s in saved:
            if s.user_id in user_idx_map and s.course_id in course_idx_map:
                u_idx = user_idx_map[s.user_id]
                c_idx = course_idx_map[s.course_id]
                matrix[u_idx, c_idx] = max(matrix[u_idx, c_idx], 1.5)

        # Quiz attempts
        quiz_attempts = db.query(QuizAttempt).all()
        for qa in quiz_attempts:
            if qa.quiz and qa.quiz.course_id in course_idx_map and qa.user_id in user_idx_map:
                u_idx = user_idx_map[qa.user_id]
                c_idx = course_idx_map[qa.quiz.course_id]
                matrix[u_idx, c_idx] = max(matrix[u_idx, c_idx], (qa.score_percentage / 30.0))

        return matrix, user_ids, course_idx_map

    def get_recommendations(
        self, 
        user_id: int, 
        courses: List[Course], 
        db: Session
    ) -> List[Tuple[Course, float, str]]:
        """
        Returns collaborative recommendations for user_id using SVD matrix factorization.
        """
        matrix, user_ids, course_idx_map = self.get_user_item_matrix(db, courses)
        
        if user_id not in user_ids or len(user_ids) < 2 or matrix.shape[1] < 2:
            # Cold-start fallback: rating-based baseline
            return [
                (c, round(min(95.0, 75.0 + (c.rating * 4.0)), 1), "Popular among students with similar academic pathways.")
                for c in courses
            ]

        try:
            u_idx = user_ids.index(user_id)
            n_comp = min(self.n_components, matrix.shape[0] - 1, matrix.shape[1] - 1)
            if n_comp < 1:
                n_comp = 1

            svd = TruncatedSVD(n_components=n_comp, random_state=42)
            u_features = svd.fit_transform(matrix)
            c_features = svd.components_.T
            predicted_ratings = np.dot(u_features[u_idx], c_features.T)

            # Normalize to 60-95 scale
            min_r = np.min(predicted_ratings)
            max_r = np.max(predicted_ratings)
            span = max(max_r - min_r, 1e-5)

            results = []
            for course in courses:
                c_idx = course_idx_map[course.id]
                norm_score = (predicted_ratings[c_idx] - min_r) / span
                match_score = round(65.0 + (norm_score * 30.0), 1)
                reason = f"High affinity with study sequences of {max(1, course.enrolled_count)} peer learners."
                results.append((course, match_score, reason))

            results.sort(key=lambda x: x[1], reverse=True)
            return results
        except Exception:
            return [
                (c, round(min(95.0, 70.0 + (c.rating * 5.0)), 1), "Recommended based on overall cohort engagement patterns.")
                for c in courses
            ]

collaborative_recommender = CollaborativeRecommender()
