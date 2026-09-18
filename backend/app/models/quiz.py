import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    time_limit_minutes = Column(Integer, default=15)
    passing_score = Column(Float, default=70.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    course = relationship("Course", back_populates="quizzes")
    questions = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan")
    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    question_text = Column(Text, nullable=False)
    
    # JSON list of 4 options e.g. ["O(1)", "O(n)", "O(n log n)", "O(n^2)"]
    options = Column(Text, nullable=False)
    
    # 0-indexed correct option integer or exact text
    correct_option_index = Column(Integer, nullable=False)
    explanation = Column(Text, nullable=False)
    subject_tag = Column(String(100), default="General")
    difficulty = Column(String(50), default="Intermediate")

    quiz = relationship("Quiz", back_populates="questions")

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    score_percentage = Column(Float, nullable=False) # e.g. 85.0
    total_questions = Column(Integer, nullable=False)
    correct_count = Column(Integer, nullable=False)
    
    # JSON array of student answers: [{"question_id": 1, "selected": 2, "is_correct": true}]
    answers_payload = Column(Text, nullable=False)
    time_spent_seconds = Column(Integer, default=300)
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="quiz_attempts")
    quiz = relationship("Quiz", back_populates="attempts")
