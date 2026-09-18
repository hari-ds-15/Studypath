import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.course import Course, Enrollment, SavedCourse, Subject
from app.schemas import CourseOut, CourseDetailOut, SubjectOut, ProgressUpdate
from app.services.auth_service import get_current_user, get_optional_user

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.get("", response_model=List[CourseOut])
def get_courses(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    search: Optional[str] = None,
    is_elective: Optional[bool] = None,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    query = db.query(Course)
    if category and category != "All":
        query = query.filter(Course.category == category)
    if difficulty and difficulty != "All":
        query = query.filter(Course.difficulty == difficulty)
    if is_elective is not None:
        query = query.filter(Course.is_elective == is_elective)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (Course.title.ilike(s)) | (Course.description.ilike(s)) | (Course.career_track.ilike(s))
        )

    courses = query.all()

    saved_ids = set()
    enrollment_map = {}
    if current_user:
        saved = db.query(SavedCourse).filter(SavedCourse.user_id == current_user.id).all()
        saved_ids = {s.course_id for s in saved}
        
        enrollments = db.query(Enrollment).filter(Enrollment.user_id == current_user.id).all()
        enrollment_map = {e.course_id: e.progress for e in enrollments}

    results = []
    for c in courses:
        results.append(CourseOut(
            id=c.id,
            title=c.title,
            code=c.code,
            category=c.category,
            difficulty=c.difficulty,
            estimated_duration=c.estimated_duration,
            learning_format=c.learning_format,
            description=c.description,
            prerequisites=json.loads(c.prerequisites or "[]"),
            tags=json.loads(c.tags or "[]"),
            career_track=c.career_track,
            is_elective=c.is_elective,
            rating=c.rating,
            enrolled_count=c.enrolled_count,
            image_url=c.image_url,
            free_resources=json.loads(c.free_resources or "[]"),
            is_saved=(c.id in saved_ids),
            is_enrolled=(c.id in enrollment_map),
            progress=enrollment_map.get(c.id, 0.0)
        ))
    return results

@router.get("/subjects", response_model=List[SubjectOut])
def get_subjects(db: Session = Depends(get_db)):
    return db.query(Subject).all()

@router.get("/saved/list", response_model=List[CourseOut])
def get_saved_courses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    saved = db.query(SavedCourse).filter(SavedCourse.user_id == current_user.id).all()
    saved_ids = [s.course_id for s in saved]
    courses = db.query(Course).filter(Course.id.in_(saved_ids)).all() if saved_ids else []
    
    enrollments = db.query(Enrollment).filter(Enrollment.user_id == current_user.id).all()
    enrollment_map = {e.course_id: e.progress for e in enrollments}

    return [
        CourseOut(
            id=c.id,
            title=c.title,
            code=c.code,
            category=c.category,
            difficulty=c.difficulty,
            estimated_duration=c.estimated_duration,
            learning_format=c.learning_format,
            description=c.description,
            prerequisites=json.loads(c.prerequisites or "[]"),
            tags=json.loads(c.tags or "[]"),
            career_track=c.career_track,
            is_elective=c.is_elective,
            rating=c.rating,
            enrolled_count=c.enrolled_count,
            image_url=c.image_url,
            free_resources=json.loads(c.free_resources or "[]"),
            is_saved=True,
            is_enrolled=(c.id in enrollment_map),
            progress=enrollment_map.get(c.id, 0.0)
        )
        for c in courses
    ]

@router.get("/{course_id}", response_model=CourseDetailOut)
def get_course_detail(
    course_id: int,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    is_saved = False
    is_enrolled = False
    progress = 0.0

    if current_user:
        saved = db.query(SavedCourse).filter(
            SavedCourse.user_id == current_user.id,
            SavedCourse.course_id == course_id
        ).first()
        is_saved = bool(saved)

        enr = db.query(Enrollment).filter(
            Enrollment.user_id == current_user.id,
            Enrollment.course_id == course_id
        ).first()
        if enr:
            is_enrolled = True
            progress = enr.progress

    syllabus_data = json.loads(course.syllabus or "[]")
    free_res_data = json.loads(course.free_resources or "[]")

    return CourseDetailOut(
        id=course.id,
        title=course.title,
        code=course.code,
        category=course.category,
        difficulty=course.difficulty,
        estimated_duration=course.estimated_duration,
        learning_format=course.learning_format,
        description=course.description,
        prerequisites=json.loads(course.prerequisites or "[]"),
        tags=json.loads(course.tags or "[]"),
        career_track=course.career_track,
        is_elective=course.is_elective,
        rating=course.rating,
        enrolled_count=course.enrolled_count,
        image_url=course.image_url,
        free_resources=free_res_data,
        is_saved=is_saved,
        is_enrolled=is_enrolled,
        progress=progress,
        syllabus=syllabus_data
    )

@router.post("/{course_id}/save")
def toggle_save_course(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    saved = db.query(SavedCourse).filter(
        SavedCourse.user_id == current_user.id,
        SavedCourse.course_id == course_id
    ).first()

    if saved:
        db.delete(saved)
        db.commit()
        return {"saved": False, "message": f"Removed '{course.title}' from your saved courses."}
    else:
        new_saved = SavedCourse(user_id=current_user.id, course_id=course_id)
        db.add(new_saved)
        db.commit()
        return {"saved": True, "message": f"Saved '{course.title}' to your bookmarks."}

@router.post("/{course_id}/enroll")
def enroll_course(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    enr = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == course_id
    ).first()

    if not enr:
        enr = Enrollment(
            user_id=current_user.id,
            course_id=course_id,
            progress=0.0,
            completed=False
        )
        course.enrolled_count += 1
        db.add(enr)
        db.commit()
        db.refresh(enr)

    return {
        "enrolled": True,
        "course_id": course_id,
        "progress": enr.progress,
        "message": f"Successfully enrolled in '{course.title}'."
    }

@router.put("/{course_id}/progress")
def update_course_progress(
    course_id: int,
    prog: ProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    enr = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == course_id
    ).first()

    if not enr:
        enr = Enrollment(
            user_id=current_user.id,
            course_id=course_id,
            progress=min(100.0, max(0.0, prog.progress)),
            completed=(prog.progress >= 100.0)
        )
        db.add(enr)
    else:
        enr.progress = min(100.0, max(0.0, prog.progress))
        enr.completed = (prog.progress >= 100.0 or prog.completed)
        enr.current_module_index = prog.current_module_index or enr.current_module_index
        enr.current_lesson_index = prog.current_lesson_index or enr.current_lesson_index

    db.commit()
    db.refresh(enr)

    return {
        "course_id": course_id,
        "progress": enr.progress,
        "completed": enr.completed,
        "message": "Progress updated successfully."
    }
