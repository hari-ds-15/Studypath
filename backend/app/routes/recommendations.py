from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.profile import StudentProfile
from app.schemas import CourseRecommendationOut, StudyMethodOut, ElectiveRecommendationOut
from app.services.auth_service import get_current_user
from app.ml.hybrid_engine import hybrid_engine
from app.ml.study_method_engine import study_method_engine

router = APIRouter(prefix="/recommendations", tags=["Recommendations Engine"])

@router.get("/courses", response_model=List[CourseRecommendationOut])
def get_course_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns AI-generated course recommendations using hybrid (Content-Based + SVD Matrix Factorization + KNN).
    Includes dynamic match scores, personalized rationale, and adaptive quiz updates.
    """
    return hybrid_engine.get_course_recommendations(current_user.id, db)

@router.get("/study-method", response_model=StudyMethodOut)
def get_study_method_recommendation(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyzes student cognitive learning speed, session length preference, and format affinity
    to recommend an optimal study pipeline (e.g. Video → Practice → Quiz → Revision).
    """
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return study_method_engine.recommend_study_method(profile)

@router.get("/electives", response_model=List[ElectiveRecommendationOut])
def get_elective_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns tailored specialization elective tracks (AI, Big Data, Cloud, Cybersecurity)
    based on career relevance and prerequisite fulfillment.
    """
    return hybrid_engine.get_elective_recommendations(current_user.id, db)

@router.post("/refresh")
def refresh_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Triggers dynamic recalculation of recommendation matrix across Content, CF, and KNN algorithms.
    """
    recs = hybrid_engine.get_course_recommendations(current_user.id, db)
    return {
        "refreshed": True,
        "count": len(recs),
        "message": "Recommendations refreshed successfully based on your latest learning activity and quiz results."
    }
