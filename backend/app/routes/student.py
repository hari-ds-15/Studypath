import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.profile import StudentProfile
from app.models.notification import Notification
from app.schemas import StudentProfileOut, StudentProfileUpdate, OnboardingRequest
from app.services.auth_service import get_current_user
from app.services.scheduler_service import scheduler_service

router = APIRouter(prefix="/student", tags=["Student Profile"])

@router.get("/profile", response_model=StudentProfileOut)
def get_student_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(
            user_id=current_user.id,
            education_level="Undergraduate",
            branch_major="Computer Science & Engineering",
            learning_speed="Balanced",
            preferred_content_type="Interactive & Practice",
            average_study_hours=3.5,
            strong_subjects=json.dumps(["Python Programming", "Mathematics for Computing"]),
            weak_subjects=json.dumps(["Data Structures & Algorithms", "Database Systems & SQL"]),
            career_interests=json.dumps(["AI Engineer", "Full Stack Developer"]),
            learning_efficiency_score=80.0,
            onboarding_completed=False
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return StudentProfileOut(
        id=profile.id,
        user_id=profile.user_id,
        education_level=profile.education_level,
        branch_major=profile.branch_major,
        learning_speed=profile.learning_speed,
        preferred_content_type=profile.preferred_content_type,
        average_study_hours=profile.average_study_hours,
        weekly_target_hours=profile.weekly_target_hours,
        strong_subjects=json.loads(profile.strong_subjects or "[]"),
        weak_subjects=json.loads(profile.weak_subjects or "[]"),
        career_interests=json.loads(profile.career_interests or "[]"),
        learning_efficiency_score=profile.learning_efficiency_score,
        onboarding_completed=profile.onboarding_completed,
        study_method_style=profile.study_method_style or "Video -> Practice -> Quiz -> Revision",
        session_length_preference=profile.session_length_preference or 45,
        created_at=profile.created_at,
        updated_at=profile.updated_at
    )

@router.put("/profile", response_model=StudentProfileOut)
def update_student_profile(
    update_data: StudentProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    if update_data.full_name is not None:
        current_user.full_name = update_data.full_name
        db.add(current_user)

    if update_data.education_level is not None:
        profile.education_level = update_data.education_level
    if update_data.branch_major is not None:
        profile.branch_major = update_data.branch_major
    if update_data.learning_speed is not None:
        profile.learning_speed = update_data.learning_speed
    if update_data.preferred_content_type is not None:
        profile.preferred_content_type = update_data.preferred_content_type
    if update_data.average_study_hours is not None:
        profile.average_study_hours = update_data.average_study_hours
    if update_data.weekly_target_hours is not None:
        profile.weekly_target_hours = update_data.weekly_target_hours
    if update_data.strong_subjects is not None:
        profile.strong_subjects = json.dumps(update_data.strong_subjects)
    if update_data.weak_subjects is not None:
        profile.weak_subjects = json.dumps(update_data.weak_subjects)
    if update_data.career_interests is not None:
        profile.career_interests = json.dumps(update_data.career_interests)
    if update_data.session_length_preference is not None:
        profile.session_length_preference = update_data.session_length_preference
    if update_data.study_method_style is not None:
        profile.study_method_style = update_data.study_method_style

    db.commit()
    db.refresh(profile)

    return get_student_profile(current_user=current_user, db=db)

@router.post("/onboarding", response_model=StudentProfileOut)
def submit_onboarding(
    onboarding: OnboardingRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)

    profile.strong_subjects = json.dumps(onboarding.strong_subjects)
    profile.weak_subjects = json.dumps(onboarding.weak_subjects)
    profile.average_study_hours = onboarding.average_study_hours
    profile.weekly_target_hours = round(onboarding.average_study_hours * 6.0, 1)
    profile.learning_speed = onboarding.learning_speed
    profile.preferred_content_type = onboarding.preferred_content_type
    profile.career_interests = json.dumps(onboarding.career_interests)
    profile.onboarding_completed = True
    profile.learning_efficiency_score = 82.0

    db.commit()
    db.refresh(profile)

    # Generate initial personalized study schedule
    scheduler_service.generate_ai_study_plan(current_user.id, db)

    # Add welcome notification
    notif = Notification(
        user_id=current_user.id,
        title="Welcome to StudyPath!",
        message="Your academic profile is set. Check out your personalized course recommendations and study plan.",
        type="recommendation",
        action_url="/recommendations",
        is_read=False
    )
    db.add(notif)
    db.commit()

    return get_student_profile(current_user=current_user, db=db)

@router.post("/reset-profile")
def reset_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if profile:
        profile.onboarding_completed = False
        profile.strong_subjects = json.dumps([])
        profile.weak_subjects = json.dumps([])
        profile.learning_efficiency_score = 75.0
        db.commit()
    return {"message": "Learning preferences reset successfully. You can now redo the onboarding process."}
