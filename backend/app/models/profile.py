import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    education_level = Column(String(100), default="Undergraduate") # Undergraduate, Postgraduate, High School
    branch_major = Column(String(150), default="Computer Science & Engineering")
    learning_speed = Column(String(50), default="Balanced") # Slow & Thorough, Balanced, Fast Paced
    preferred_content_type = Column(String(100), default="Interactive & Practice") # Video, Interactive & Practice, Text & Docs, Visual & Diagrams, Quizzes
    average_study_hours = Column(Float, default=3.5)
    
    # Stored as JSON strings (e.g. '["Python", "Algorithms"]' or comma-separated)
    strong_subjects = Column(Text, default='["Python Programming", "Mathematics"]')
    weak_subjects = Column(Text, default='["Data Structures", "Database Systems"]')
    career_interests = Column(Text, default='["AI Engineer", "Full Stack Developer"]')
    
    # Target and tracked metrics
    learning_efficiency_score = Column(Float, default=78.5) # Dynamic 0-100 score
    weekly_target_hours = Column(Float, default=20.0)
    onboarding_completed = Column(Boolean, default=False)
    
    # Study method preferences
    study_method_style = Column(String(100), default="Video -> Practice -> Quiz -> Revision")
    session_length_preference = Column(Integer, default=45) # in minutes
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="profile")
