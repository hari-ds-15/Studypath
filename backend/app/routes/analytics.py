from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas import AnalyticsSummaryOut
from app.services.auth_service import get_current_user
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("", response_model=AnalyticsSummaryOut)
def get_analytics(
    timeframe: str = Query("30d", pattern="^(7d|30d|90d|all)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return analytics_service.get_student_analytics(current_user.id, timeframe, db)
