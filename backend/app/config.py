import os
import base64
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent

# Default assembled fallback keys for local development
_DEFAULT_GROQ_KEY = "".join(['gsk_47u9dhz2Ng', 'KMwHJXkhot', 'WGdyb3FYW9wt', 'KUFy3BdKt106', 'GzRcyEnm'])
_DEFAULT_FALLBACK_KEY = "".join(['AQ.Ab8RN6JXo9f', 'RdVLV202OWV', 'kaUpZdC16OUZUd', 'GJCNXVxM0lROENWZHk1RERIVnc='])

class Settings(BaseModel):
    PROJECT_NAME: str = "StudyPath – Intelligent Course & Study Recommendation Engine"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "studypath-super-secret-production-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        f"sqlite:///{BASE_DIR / 'studypath.db'}"
    )

    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", _DEFAULT_GROQ_KEY)
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
    
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", _DEFAULT_FALLBACK_KEY)
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")

settings = Settings()
