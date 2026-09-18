import json
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.profile import StudentProfile
from app.models.quiz import Quiz, QuizQuestion, QuizAttempt
from app.models.course import Course
from app.models.notification import Notification
from app.schemas import (
    QuizOut, QuizQuestionOut, QuizAttemptSubmit, 
    QuizResultOut, QuizQuestionReview, QuizAttemptHistoryOut
)
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])

@router.get("", response_model=List[QuizOut])
def get_all_quizzes(db: Session = Depends(get_db)):
    quizzes = db.query(Quiz).all()
    results = []
    for q in quizzes:
        results.append(QuizOut(
            id=q.id,
            course_id=q.course_id,
            course_title=q.course.title if q.course else "General Course Quiz",
            title=q.title,
            description=q.description,
            time_limit_minutes=q.time_limit_minutes,
            passing_score=q.passing_score,
            total_questions=len(q.questions)
        ))
    return results

@router.get("/{quiz_id}", response_model=QuizOut)
def get_quiz_by_id(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    questions_out = []
    for q in quiz.questions:
        questions_out.append(QuizQuestionOut(
            id=q.id,
            quiz_id=q.quiz_id,
            question_text=q.question_text,
            options=json.loads(q.options or "[]"),
            subject_tag=q.subject_tag,
            difficulty=q.difficulty
        ))

    return QuizOut(
        id=quiz.id,
        course_id=quiz.course_id,
        course_title=quiz.course.title if quiz.course else "",
        title=quiz.title,
        description=quiz.description,
        time_limit_minutes=quiz.time_limit_minutes,
        passing_score=quiz.passing_score,
        total_questions=len(quiz.questions),
        questions=questions_out
    )

@router.post("/{quiz_id}/submit", response_model=QuizResultOut)
def submit_quiz_attempt(
    quiz_id: int,
    submission: QuizAttemptSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    questions_map = {q.id: q for q in quiz.questions}
    total_q = len(quiz.questions)
    correct_count = 0
    review_list: List[QuizQuestionReview] = []
    answers_log = []

    for ans in submission.answers:
        q_obj = questions_map.get(ans.question_id)
        if q_obj:
            is_correct = (ans.selected_option_index == q_obj.correct_option_index)
            if is_correct:
                correct_count += 1
            
            review_list.append(QuizQuestionReview(
                id=q_obj.id,
                quiz_id=quiz.id,
                question_text=q_obj.question_text,
                options=json.loads(q_obj.options or "[]"),
                subject_tag=q_obj.subject_tag,
                difficulty=q_obj.difficulty,
                correct_option_index=q_obj.correct_option_index,
                explanation=q_obj.explanation,
                selected_option_index=ans.selected_option_index,
                is_correct=is_correct
            ))
            answers_log.append({
                "question_id": q_obj.id,
                "selected": ans.selected_option_index,
                "is_correct": is_correct
            })

    score_pct = round((correct_count / max(1, total_q)) * 100.0, 1)
    passed = (score_pct >= quiz.passing_score)

    # Save attempt
    attempt = QuizAttempt(
        user_id=current_user.id,
        quiz_id=quiz.id,
        score_percentage=score_pct,
        total_questions=total_q,
        correct_count=correct_count,
        answers_payload=json.dumps(answers_log),
        time_spent_seconds=submission.time_spent_seconds,
        completed_at=datetime.utcnow()
    )
    db.add(attempt)

    # Dynamic feedback loop: Update Student Profile learning efficiency & mastery
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    new_eff = 80.0
    if profile:
        # Boost/adjust efficiency score dynamically
        delta = (score_pct - 70.0) * 0.1
        profile.learning_efficiency_score = round(min(98.0, max(50.0, profile.learning_efficiency_score + delta)), 1)
        new_eff = profile.learning_efficiency_score

        # If score is low (< 65%), add the quiz topic to weak subjects if not already there
        if score_pct < 65.0 and quiz.course:
            weak_list = json.loads(profile.weak_subjects or "[]")
            if quiz.course.title not in weak_list and quiz.course.category not in weak_list:
                weak_list.append(quiz.course.category)
                profile.weak_subjects = json.dumps(weak_list)

        db.add(profile)

    # Add notification about quiz completion
    notif = Notification(
        user_id=current_user.id,
        title=f"Quiz Complete: {quiz.title}",
        message=f"You scored {int(score_pct)}% ({correct_count}/{total_q} correct). Your learning recommendation engine has adapted accordingly.",
        type="quiz_alert",
        action_url="/recommendations",
        is_read=False
    )
    db.add(notif)
    db.commit()
    db.refresh(attempt)

    feedback = (
        f"Outstanding mastery! You scored {score_pct}% and passed this module."
        if passed
        else f"You scored {score_pct}%. Review the detailed answers below to bridge your knowledge gaps."
    )

    return QuizResultOut(
        attempt_id=attempt.id,
        quiz_id=quiz.id,
        quiz_title=quiz.title,
        score_percentage=score_pct,
        total_questions=total_q,
        correct_count=correct_count,
        time_spent_seconds=submission.time_spent_seconds,
        passed=passed,
        feedback_message=feedback,
        review=review_list,
        profile_updated=True,
        new_efficiency_score=new_eff
    )

@router.get("/history/list", response_model=List[QuizAttemptHistoryOut])
def get_quiz_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    attempts = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.user_id == current_user.id)
        .order_by(QuizAttempt.completed_at.desc())
        .all()
    )
    return [
        QuizAttemptHistoryOut(
            id=a.id,
            quiz_id=a.quiz_id,
            quiz_title=a.quiz.title if a.quiz else "Quiz",
            course_title=a.quiz.course.title if (a.quiz and a.quiz.course) else "General",
            score_percentage=a.score_percentage,
            total_questions=a.total_questions,
            correct_count=a.correct_count,
            time_spent_seconds=a.time_spent_seconds,
            completed_at=a.completed_at
        )
        for a in attempts
    ]
