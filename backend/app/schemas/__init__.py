from typing import List, Optional, Any, Dict
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

# ==================== AUTH SCHEMAS ====================
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str
    education_level: Optional[str] = "Undergraduate"
    branch_major: Optional[str] = "Computer Science & Engineering"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class SupabaseSyncRequest(BaseModel):
    supabase_id: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    full_name: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    email: str
    full_name: str
    onboarding_completed: bool

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: datetime
    onboarding_completed: Optional[bool] = False

    class Config:
        from_attributes = True

# ==================== PROFILE SCHEMAS ====================
class StudentProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    education_level: Optional[str] = None
    branch_major: Optional[str] = None
    learning_speed: Optional[str] = None
    preferred_content_type: Optional[str] = None
    average_study_hours: Optional[float] = None
    weekly_target_hours: Optional[float] = None
    strong_subjects: Optional[List[str]] = None
    weak_subjects: Optional[List[str]] = None
    career_interests: Optional[List[str]] = None
    session_length_preference: Optional[int] = None
    study_method_style: Optional[str] = None

class OnboardingRequest(BaseModel):
    strong_subjects: List[str]
    weak_subjects: List[str]
    average_study_hours: float
    learning_speed: str
    preferred_content_type: str
    current_courses: Optional[List[str]] = []
    career_interests: List[str]

class StudentProfileOut(BaseModel):
    id: int
    user_id: int
    education_level: str
    branch_major: str
    learning_speed: str
    preferred_content_type: str
    average_study_hours: float
    weekly_target_hours: float
    strong_subjects: List[str]
    weak_subjects: List[str]
    career_interests: List[str]
    learning_efficiency_score: float
    onboarding_completed: bool
    study_method_style: str
    session_length_preference: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ==================== COURSE & SUBJECT SCHEMAS ====================
class SubjectOut(BaseModel):
    id: int
    name: str
    code: str
    category: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

class LessonItem(BaseModel):
    id: str
    title: str
    duration: str
    type: str # video, text, practice, quiz
    completed: bool = False
    content: Optional[str] = None
    video_url: Optional[str] = None

class ModuleItem(BaseModel):
    id: str
    title: str
    lessons: List[LessonItem]

class FreeResourceItem(BaseModel):
    title: str
    type: str  # 'youtube', 'website', 'practice', 'docs', 'course'
    url: str
    provider: Optional[str] = None
    author: Optional[str] = None
    badge: Optional[str] = "Free Resource"
    description: Optional[str] = None

class CourseOut(BaseModel):
    id: int
    title: str
    code: str
    category: str
    difficulty: str
    estimated_duration: str
    learning_format: str
    description: str
    prerequisites: List[str]
    tags: List[str]
    career_track: str
    is_elective: bool
    rating: float
    enrolled_count: int
    image_url: str
    free_resources: Optional[List[FreeResourceItem]] = []
    is_saved: Optional[bool] = False
    match_score: Optional[float] = None
    match_reason: Optional[str] = None
    progress: Optional[float] = None
    is_enrolled: Optional[bool] = False

    class Config:
        from_attributes = True

class CourseDetailOut(CourseOut):
    syllabus: List[ModuleItem]
    free_resources: Optional[List[FreeResourceItem]] = []

class ProgressUpdate(BaseModel):
    progress: float
    current_module_index: Optional[int] = 0
    current_lesson_index: Optional[int] = 0
    completed: Optional[bool] = False

# ==================== QUIZ SCHEMAS ====================
class QuizQuestionOut(BaseModel):
    id: int
    quiz_id: int
    question_text: str
    options: List[str]
    subject_tag: str
    difficulty: str

    class Config:
        from_attributes = True

class QuizQuestionReview(QuizQuestionOut):
    correct_option_index: int
    explanation: str
    selected_option_index: Optional[int] = None
    is_correct: Optional[bool] = None

class QuizOut(BaseModel):
    id: int
    course_id: int
    course_title: Optional[str] = None
    title: str
    description: Optional[str] = None
    time_limit_minutes: int
    passing_score: float
    total_questions: int
    questions: Optional[List[QuizQuestionOut]] = None

    class Config:
        from_attributes = True

class AnswerItem(BaseModel):
    question_id: int
    selected_option_index: int

class QuizAttemptSubmit(BaseModel):
    answers: List[AnswerItem]
    time_spent_seconds: int

class QuizResultOut(BaseModel):
    attempt_id: int
    quiz_id: int
    quiz_title: str
    score_percentage: float
    total_questions: int
    correct_count: int
    time_spent_seconds: int
    passed: bool
    feedback_message: str
    review: List[QuizQuestionReview]
    profile_updated: bool
    new_efficiency_score: float

class QuizAttemptHistoryOut(BaseModel):
    id: int
    quiz_id: int
    quiz_title: str
    course_title: str
    score_percentage: float
    total_questions: int
    correct_count: int
    time_spent_seconds: int
    completed_at: datetime

    class Config:
        from_attributes = True

# ==================== RECOMMENDATION SCHEMAS ====================
class CourseRecommendationOut(BaseModel):
    course_id: int
    course_name: str
    code: str
    category: str
    difficulty: str
    estimated_duration: str
    learning_format: str
    description: str
    match_score: float # e.g. 92.5
    explanation: str
    algorithm: str
    tags: List[str]
    is_saved: bool = False
    is_enrolled: bool = False
    image_url: str
    free_resources: Optional[List[FreeResourceItem]] = []

class StudyMethodStep(BaseModel):
    step_number: int
    name: str # e.g. Video Lecture, Interactive Practice, Micro-Quiz, Spaced Revision
    duration_minutes: int
    icon: str
    description: str
    tips: str

class StudyMethodOut(BaseModel):
    recommended_pipeline: str # "Video → Practice → Quiz → Revision"
    why_selected: str
    suitable_session_length: int # in minutes, e.g. 45
    preferred_content_type: str
    learning_speed: str
    expected_retention_boost: str
    steps: List[StudyMethodStep]

class ElectiveRecommendationOut(BaseModel):
    course_id: int
    course_name: str
    category: str
    match_score: float
    why_recommended: str
    prerequisites: List[str]
    difficulty: str
    career_relevance: str
    syllabus_preview: List[str]
    is_saved: bool = False
    free_resources: Optional[List[FreeResourceItem]] = []

# ==================== STUDY PLAN SCHEMAS ====================
class StudySessionCreate(BaseModel):
    course_id: Optional[int] = None
    title: str
    subject_name: str
    day_of_week: str # Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
    session_date: Optional[str] = None
    start_time: str # "18:00"
    end_time: str # "19:00"
    duration_minutes: Optional[int] = 60
    session_type: Optional[str] = "Practice"
    notes: Optional[str] = None

class StudySessionUpdate(BaseModel):
    course_id: Optional[int] = None
    title: Optional[str] = None
    subject_name: Optional[str] = None
    day_of_week: Optional[str] = None
    session_date: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    duration_minutes: Optional[int] = None
    session_type: Optional[str] = None
    is_completed: Optional[bool] = None
    notes: Optional[str] = None

class StudySessionOut(BaseModel):
    id: int
    user_id: int
    course_id: Optional[int] = None
    title: str
    subject_name: str
    day_of_week: str
    session_date: Optional[str] = None
    start_time: str
    end_time: str
    duration_minutes: int
    session_type: str
    is_completed: bool
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class WeeklyPlanOut(BaseModel):
    total_weekly_hours: float
    target_weekly_hours: float
    completed_sessions_count: int
    pending_sessions_count: int
    completion_rate_percentage: float
    sessions_by_day: Dict[str, List[StudySessionOut]]

# ==================== ANALYTICS SCHEMAS ====================
class AnalyticsSummaryOut(BaseModel):
    timeframe: str
    total_study_hours: float
    target_study_hours: float
    quiz_average_score: float
    quizzes_taken_count: int
    learning_efficiency_score: float
    course_completion_rate: float
    enrolled_courses_count: int
    completed_courses_count: int
    strong_subjects: List[str]
    weak_subjects: List[str]
    study_hours_trend: List[Dict[str, Any]] # [{"day": "Mon", "hours": 3.5, "target": 4.0}]
    quiz_score_trend: List[Dict[str, Any]] # [{"date": "2026-09-10", "quiz": "Python Basics", "score": 90}]
    subject_mastery: List[Dict[str, Any]] # [{"subject": "Python", "score": 95, "status": "Strong"}]
    weekly_breakdown: List[Dict[str, Any]]

# ==================== NOTIFICATION SCHEMAS ====================
class NotificationOut(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    type: str
    action_url: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
