import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), unique=True, nullable=False)
    code = Column(String(50), unique=True, nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    code = Column(String(50), unique=True, nullable=False)
    category = Column(String(100), nullable=False, index=True) # AI & ML, Data Science, Web Development, Cloud & DevOps, Core CS, Cybersecurity, Mathematics
    difficulty = Column(String(50), default="Intermediate") # Beginner, Intermediate, Advanced
    estimated_duration = Column(String(100), default="6 weeks (24 hrs)")
    learning_format = Column(String(100), default="Interactive & Practice")
    description = Column(Text, nullable=False)
    
    # Prerequisites as JSON string list
    prerequisites = Column(Text, default="[]")
    
    # Curriculum modules/lessons as JSON string list
    syllabus = Column(Text, default="[]")
    
    # Tags as JSON string list for content-based matching
    tags = Column(Text, default="[]")
    
    # Career relevance track
    career_track = Column(String(150), default="Software Engineering")
    is_elective = Column(Boolean, default=False)
    rating = Column(Float, default=4.8)
    enrolled_count = Column(Integer, default=120)
    image_url = Column(String(255), default="")
    free_resources = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")
    saved_by = relationship("SavedCourse", back_populates="course", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="course", cascade="all, delete-orphan")
    recommendations = relationship("RecommendationLog", back_populates="course", cascade="all, delete-orphan")

class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    progress = Column(Float, default=0.0) # 0 to 100%
    completed = Column(Boolean, default=False)
    current_module_index = Column(Integer, default=0)
    current_lesson_index = Column(Integer, default=0)
    enrolled_at = Column(DateTime, default=datetime.datetime.utcnow)
    last_accessed_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")

class SavedCourse(Base):
    __tablename__ = "saved_courses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    saved_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="saved_courses")
    course = relationship("Course", back_populates="saved_by")
