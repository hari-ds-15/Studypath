import json
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.profile import StudentProfile
from app.services.auth_service import get_current_user
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/chat", tags=["AI Tutor Chat"])

class ChatRequest(BaseModel):
    message: str
    previous_interaction_id: Optional[str] = None
    course_context: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    interaction_id: str
    model: str
    status: str
    timestamp: str
    suggested_followups: List[str]

class PromptSuggestion(BaseModel):
    id: str
    category: str
    title: str
    prompt: str

@router.post("", response_model=ChatResponse)
def chat_with_gemini(
    req: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not req.message or not req.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty."
        )

    # Fetch student profile for personalized context
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    
    strong_list = []
    weak_list = []
    if profile:
        try:
            strong_list = json.loads(profile.strong_subjects or "[]")
        except Exception:
            strong_list = [profile.strong_subjects] if profile.strong_subjects else []
        try:
            weak_list = json.loads(profile.weak_subjects or "[]")
        except Exception:
            weak_list = [profile.weak_subjects] if profile.weak_subjects else []

    student_ctx = {
        "name": current_user.full_name,
        "major": profile.branch_major if profile and profile.branch_major else "Computer Science & Engineering",
        "strong_subjects": strong_list,
        "weak_subjects": weak_list,
        "learning_speed": profile.learning_speed if profile else "Balanced",
        "preferred_content_type": profile.preferred_content_type if profile else "Interactive & Practice",
        "average_study_hours": profile.average_study_hours if profile else 3.5,
    }

    if req.course_context:
        student_ctx["current_active_course"] = req.course_context

    result = gemini_service.generate_response(
        message=req.message.strip(),
        student_context=student_ctx,
        previous_interaction_id=req.previous_interaction_id
    )

    return ChatResponse(
        response=result["response"],
        interaction_id=result["interaction_id"],
        model=result["model"],
        status=result["status"],
        timestamp=datetime.now(timezone.utc).isoformat(),
        suggested_followups=result.get("suggested_followups", [])
    )

@router.get("/suggestions", response_model=List[PromptSuggestion])
def get_chat_suggestions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    weak = profile.weak_subjects if profile and profile.weak_subjects else ["Data Structures & Algorithms"]
    primary_weak = weak[0] if len(weak) > 0 else "Data Structures & Algorithms"

    suggestions = [
        PromptSuggestion(
            id="1",
            category="Targeted Mastery",
            title=f"Master {primary_weak}",
            prompt=f"I need to improve in {primary_weak}. Can you break down the most critical foundational patterns and give me a 3-step active recall study routine?"
        ),
        PromptSuggestion(
            id="2",
            category="Code & Architecture",
            title="Algorithm Walkthrough & Python Code",
            prompt="Explain Dijkstra's shortest path algorithm step-by-step with ASCII diagram and an optimal Python implementation using heapq."
        ),
        PromptSuggestion(
            id="3",
            category="Study Planning",
            title="Spaced Repetition Schedule",
            prompt="Design a 5-day spaced repetition revision plan for an upcoming exam covering Machine Learning and Database Systems."
        ),
        PromptSuggestion(
            id="4",
            category="Practice & Quizzing",
            title="Interactive Diagnostic Problem",
            prompt="Give me a tricky conceptual question on Database Normalization & Indexing, wait for my answer, and then evaluate it."
        )
    ]
    return suggestions
