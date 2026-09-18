from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import *
from app.services.seed_service import seed_database
from app.routes import (
    auth_router,
    student_router,
    courses_router,
    recommendations_router,
    study_plan_router,
    quizzes_router,
    analytics_router,
    notifications_router,
    chat_router,
)

from sqlalchemy import text

def ensure_sqlite_schema():
    try:
        with engine.connect() as conn:
            res = conn.execute(text("PRAGMA table_info(courses)"))
            columns = [row[1] for row in res.fetchall()]
            if columns and "free_resources" not in columns:
                conn.execute(text("ALTER TABLE courses ADD COLUMN free_resources TEXT DEFAULT '[]'"))
                conn.commit()
    except Exception as e:
        print("Schema verification notice:", e)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables and seed initial catalog
    Base.metadata.create_all(bind=engine)
    ensure_sqlite_schema()
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
    # Shutdown logic if any

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Intelligent Course & Study Recommendation Engine API",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers under /api
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(student_router, prefix=settings.API_V1_STR)
app.include_router(courses_router, prefix=settings.API_V1_STR)
app.include_router(recommendations_router, prefix=settings.API_V1_STR)
app.include_router(study_plan_router, prefix=settings.API_V1_STR)
app.include_router(quizzes_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(notifications_router, prefix=settings.API_V1_STR)
app.include_router(chat_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "status": "online",
        "docs_url": "/docs",
        "api_prefix": settings.API_V1_STR,
        "features": [
            "Content-Based Course Recommendations (TF-IDF)",
            "Collaborative Filtering (SVD Matrix Factorization)",
            "K-Nearest Neighbors Academic Profile Matching",
            "Adaptive Study Method Recommender",
            "AI 7-Day Personalized Study Schedule Generator",
            "Interactive Timed Quiz Module with Real-time Adaptation",
            "Analytics & Learning Efficiency Tracking"
        ]
    }

@app.get("/api/health")
def health():
    return {"status": "healthy", "service": "StudyPath Backend API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
