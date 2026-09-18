import os
import base64
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent

# Default decoded fallback key for local development
_DEFAULT_FALLBACK_KEY = base64.b64decode("QVEuQWI4Uk42SlhvOWZSZFZLV202OWVkaUpZdC16OUZUdGJCNXVxM0lROENWZHk1RERIVnc=").decode('utf-8')

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
    
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", _DEFAULT_FALLBACK_KEY)
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")

settings = Settings()
