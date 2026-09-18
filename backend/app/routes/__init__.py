from app.routes.auth import router as auth_router
from app.routes.student import router as student_router
from app.routes.courses import router as courses_router
from app.routes.recommendations import router as recommendations_router
from app.routes.study_plan import router as study_plan_router
from app.routes.quizzes import router as quizzes_router
from app.routes.analytics import router as analytics_router
from app.routes.notifications import router as notifications_router
from app.routes.chat import router as chat_router

__all__ = [
    "auth_router",
    "student_router",
    "courses_router",
    "recommendations_router",
    "study_plan_router",
    "quizzes_router",
    "analytics_router",
    "notifications_router",
    "chat_router",
]
