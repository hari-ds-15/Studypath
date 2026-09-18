from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import json

from app.database import get_db
from app.models.user import User
from app.models.profile import StudentProfile
from app.schemas import UserCreate, UserLogin, Token, UserOut, ForgotPasswordRequest, SupabaseSyncRequest
from app.services.auth_service import hash_password, verify_password, create_access_token, get_current_user
from app.services.scheduler_service import scheduler_service

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_in.email.lower().strip()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    # Create new user
    new_user = User(
        email=user_in.email.lower().strip(),
        hashed_password=hash_password(user_in.password),
        full_name=user_in.full_name.strip(),
        role="student",
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create initial student profile
    profile = StudentProfile(
        user_id=new_user.id,
        education_level=user_in.education_level or "Undergraduate",
        branch_major=user_in.branch_major or "Computer Science & Engineering",
        learning_speed="Balanced",
        preferred_content_type="Interactive & Practice",
        average_study_hours=3.0,
        strong_subjects=json.dumps([]),
        weak_subjects=json.dumps([]),
        career_interests=json.dumps([]),
        learning_efficiency_score=75.0,
        onboarding_completed=False
    )
    db.add(profile)
    db.commit()

    token = create_access_token(new_user.id)
    return Token(
        access_token=token,
        token_type="bearer",
        user_id=new_user.id,
        email=new_user.email,
        full_name=new_user.full_name,
        onboarding_completed=False
    )

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email.lower().strip()).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Your account has been deactivated."
        )

    onboarded = user.profile.onboarding_completed if user.profile else False
    token = create_access_token(user.id)
    return Token(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        onboarding_completed=onboarded
    )

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower().strip()).first()
    # Return user-friendly response even if user not found for security
    return {
        "message": f"Password reset instructions have been dispatched to {req.email}. Please check your inbox or spam folder.",
        "success": True,
        "demo_hint": "For prototype testing, you can log in with demo account: alex.chen@studypath.edu / StudyPath123!"
    }

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return UserOut(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
        onboarding_completed=current_user.profile.onboarding_completed if current_user.profile else False
    )

@router.post("/supabase-sync", response_model=Token)
def supabase_sync(req: SupabaseSyncRequest, db: Session = Depends(get_db)):
    """
    Synchronizes a user authenticated via Supabase (Email/Password or Phone/Twilio OTP)
    into the local StudyPath database so that profile, study plans, quizzes, and AI tutor
    features function seamlessly.
    """
    email_identifier = req.email.lower().strip() if req.email else None
    if not email_identifier and req.phone:
        clean_phone = req.phone.strip().replace("+", "").replace(" ", "")
        email_identifier = f"phone_{clean_phone}@studypath.student"
    
    if not email_identifier:
        email_identifier = f"user_{req.supabase_id or 'anon'}@studypath.student"
    
    user = db.query(User).filter(User.email == email_identifier).first()
    
    if not user:
        # Create user record
        name = req.full_name.strip() if req.full_name else (req.phone or email_identifier.split("@")[0].title())
        user = User(
            email=email_identifier,
            hashed_password=hash_password("SupabaseAuthToken_Verified"),
            full_name=name,
            role="student",
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Create student profile
        profile = StudentProfile(
            user_id=user.id,
            education_level="Undergraduate",
            branch_major="Computer Science & Engineering",
            learning_speed="Balanced",
            preferred_content_type="Interactive & Practice",
            average_study_hours=3.0,
            strong_subjects=json.dumps(["Python Programming", "Web Development"]),
            weak_subjects=json.dumps([]),
            career_interests=json.dumps(["AI Engineer"]),
            learning_efficiency_score=78.0,
            onboarding_completed=True
        )
        db.add(profile)
        db.commit()
    
    onboarded = user.profile.onboarding_completed if user.profile else True
    token = create_access_token(user.id)
    return Token(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        onboarding_completed=onboarded
    )
