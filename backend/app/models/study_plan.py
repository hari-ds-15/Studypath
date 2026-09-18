import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="SET NULL"), nullable=True)
    
    title = Column(String(200), nullable=False)
    subject_name = Column(String(150), nullable=False)
    day_of_week = Column(String(50), nullable=False) # Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
    session_date = Column(String(50), nullable=True) # YYYY-MM-DD
    start_time = Column(String(20), nullable=False) # e.g. "18:00"
    end_time = Column(String(20), nullable=False) # e.g. "19:00"
    duration_minutes = Column(Integer, default=60)
    session_type = Column(String(50), default="Practice") # Video, Practice, Quiz, Revision, Reading
    
    is_completed = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="study_sessions")
    course = relationship("Course")

class RecommendationLog(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    
    match_score = Column(Float, nullable=False) # 0 to 100%
    reason = Column(Text, nullable=False)
    algorithm_used = Column(String(100), default="Hybrid (Content + KNN + Collaborative)")
    generated_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="recommendations")
    course = relationship("Course", back_populates="recommendations")
