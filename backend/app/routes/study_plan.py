from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.study_plan import StudySession
from app.schemas import StudySessionCreate, StudySessionUpdate, StudySessionOut, WeeklyPlanOut
from app.services.auth_service import get_current_user
from app.services.scheduler_service import scheduler_service

router = APIRouter(prefix="/study-plan", tags=["Personalized Study Plan"])

@router.get("", response_model=WeeklyPlanOut)
def get_weekly_study_plan(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return scheduler_service.get_weekly_plan(current_user.id, db)

@router.post("", response_model=StudySessionOut)
def create_study_session(
    session_in: StudySessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate start/end time
    if session_in.start_time >= session_in.end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End time must be later than start time."
        )

    # Check time slot collision
    if scheduler_service.check_time_overlap(
        current_user.id,
        session_in.day_of_week,
        session_in.start_time,
        session_in.end_time,
        db
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"This time slot ({session_in.start_time} - {session_in.end_time}) overlaps with an existing session on {session_in.day_of_week}."
        )

    # Compute duration
    sh, sm = map(int, session_in.start_time.split(":"))
    eh, em = map(int, session_in.end_time.split(":"))
    duration = (eh * 60 + em) - (sh * 60 + sm)

    session = StudySession(
        user_id=current_user.id,
        course_id=session_in.course_id,
        title=session_in.title,
        subject_name=session_in.subject_name,
        day_of_week=session_in.day_of_week,
        session_date=session_in.session_date,
        start_time=session_in.start_time,
        end_time=session_in.end_time,
        duration_minutes=duration,
        session_type=session_in.session_type or "Practice",
        is_completed=False,
        notes=session_in.notes
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return StudySessionOut.from_orm(session)

@router.put("/{session_id}", response_model=StudySessionOut)
def update_study_session(
    session_id: int,
    update_in: StudySessionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(StudySession).filter(
        StudySession.id == session_id,
        StudySession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Study session not found")

    new_day = update_in.day_of_week or session.day_of_week
    new_start = update_in.start_time or session.start_time
    new_end = update_in.end_time or session.end_time

    if (update_in.start_time or update_in.end_time or update_in.day_of_week):
        if new_start >= new_end:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="End time must be later than start time."
            )
        if scheduler_service.check_time_overlap(
            current_user.id,
            new_day,
            new_start,
            new_end,
            db,
            exclude_session_id=session_id
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"This time slot overlaps with another session on {new_day}."
            )
        sh, sm = map(int, new_start.split(":"))
        eh, em = map(int, new_end.split(":"))
        session.duration_minutes = (eh * 60 + em) - (sh * 60 + sm)

    if update_in.title is not None:
        session.title = update_in.title
    if update_in.subject_name is not None:
        session.subject_name = update_in.subject_name
    if update_in.day_of_week is not None:
        session.day_of_week = update_in.day_of_week
    if update_in.session_date is not None:
        session.session_date = update_in.session_date
    if update_in.start_time is not None:
        session.start_time = update_in.start_time
    if update_in.end_time is not None:
        session.end_time = update_in.end_time
    if update_in.session_type is not None:
        session.session_type = update_in.session_type
    if update_in.is_completed is not None:
        session.is_completed = update_in.is_completed
    if update_in.notes is not None:
        session.notes = update_in.notes
    if update_in.course_id is not None:
        session.course_id = update_in.course_id

    db.commit()
    db.refresh(session)
    return StudySessionOut.from_orm(session)

@router.post("/{session_id}/toggle-complete", response_model=StudySessionOut)
def toggle_session_completed(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(StudySession).filter(
        StudySession.id == session_id,
        StudySession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Study session not found")

    session.is_completed = not session.is_completed
    db.commit()
    db.refresh(session)
    return StudySessionOut.from_orm(session)

@router.delete("/{session_id}")
def delete_study_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(StudySession).filter(
        StudySession.id == session_id,
        StudySession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Study session not found")

    db.delete(session)
    db.commit()
    return {"deleted": True, "id": session_id, "message": "Study session deleted successfully."}

@router.post("/generate", response_model=WeeklyPlanOut)
def auto_generate_study_plan(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    scheduler_service.generate_ai_study_plan(current_user.id, db)
    return scheduler_service.get_weekly_plan(current_user.id, db)
