import json
from typing import List, Dict, Any, Tuple
import numpy as np
import math
import re
from collections import Counter

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
except Exception:
    ENGLISH_STOP_WORDS = {
        "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
        "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but",
        "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from",
        "further", "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him",
        "himself", "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself", "me", "more",
        "most", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other",
        "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "should", "so",
        "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves", "then",
        "there", "these", "they", "this", "those", "through", "to", "too", "under", "until", "up",
        "very", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why",
        "with", "would", "you", "your", "yours", "yourself", "yourselves"
    }

    class TfidfVectorizer:  # type: ignore
        def __init__(self, stop_words='english', max_features=1000):
            self.stop_words = ENGLISH_STOP_WORDS if stop_words == 'english' else set()
            self.max_features = max_features
            self.vocabulary_ = {}
            self.idf_ = None

        def _tokenize(self, text: str) -> List[str]:
            tokens = re.findall(r'(?u)\b\w\w+\b', text.lower())
            return [t for t in tokens if t not in self.stop_words]

        def fit_transform(self, raw_documents: List[str]) -> np.ndarray:
            tokenized_docs = [self._tokenize(doc) for doc in raw_documents]
            doc_count = len(tokenized_docs)
            df = Counter()
            for doc in tokenized_docs:
                df.update(set(doc))

            most_common = [w for w, _ in df.most_common(self.max_features)]
            self.vocabulary_ = {w: idx for idx, w in enumerate(most_common)}
            num_features = len(self.vocabulary_)

            if num_features == 0:
                return np.zeros((doc_count, 1))

            self.idf_ = np.array([
                math.log((1 + doc_count) / (1 + df[w])) + 1.0
                for w in most_common
            ])

            matrix = np.zeros((doc_count, num_features), dtype=np.float64)
            for i, doc in enumerate(tokenized_docs):
                counts = Counter(doc)
                total = len(doc) or 1
                for w, idx in self.vocabulary_.items():
                    if w in counts:
                        matrix[i, idx] = (counts[w] / total) * self.idf_[idx]
                norm = np.linalg.norm(matrix[i])
                if norm > 0:
                    matrix[i] /= norm
            return matrix

    def cosine_similarity(a: np.ndarray, b: np.ndarray) -> np.ndarray:  # type: ignore
        a_norm = np.linalg.norm(a, axis=1, keepdims=True)
        b_norm = np.linalg.norm(b, axis=1, keepdims=True)
        a_norm[a_norm == 0] = 1e-9
        b_norm[b_norm == 0] = 1e-9
        return np.dot(a / a_norm, (b / b_norm).T)

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
