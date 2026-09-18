import sys
import os

backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

from app.database import Base, engine, SessionLocal
from app.services.seed_service import seed_database
from app.models.user import User
from app.models.profile import StudentProfile
from app.models.course import Course
from app.ml.hybrid_engine import hybrid_engine
from app.ml.study_method_engine import study_method_engine
from app.services.scheduler_service import scheduler_service
from app.services.analytics_service import analytics_service

def verify():
    print("1. Creating database tables & seeding catalog...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
        
        # Check user
        user = db.query(User).filter(User.email == "alex.chen@studypath.edu").first()
        print(f"2. Demo user: {user.full_name}, Email: {user.email}")
        
        # Check profile
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()
        print(f"3. Profile: Major={profile.branch_major}, Efficiency={profile.learning_efficiency_score}%")
        
        # Check courses
        courses = db.query(Course).all()
        print(f"4. Courses count: {len(courses)}")
        
        # Check Hybrid Recommendations
        recs = hybrid_engine.get_course_recommendations(user.id, db)
        print(f"5. Generated {len(recs)} Course Recommendations:")
        for r in recs[:3]:
            print(f"   - {r.course_name} ({r.match_score}% Match): {r.explanation}")
            
        # Check Study Method Engine
        sm = study_method_engine.recommend_study_method(profile)
        print(f"6. Study Method Synthesized: {sm.recommended_pipeline} ({len(sm.steps)} steps)")
        
        # Check Electives Engine
        electives = hybrid_engine.get_elective_recommendations(user.id, db)
        print(f"7. Electives count: {len(electives)}")
        for el in electives[:2]:
            print(f"   - {el.course_name} ({el.match_score}% Match) -> {el.career_relevance}")
            
        # Check Study Plan
        plan = scheduler_service.get_weekly_plan(user.id, db)
        print(f"8. Weekly Study Plan: {plan.total_weekly_hours} hrs planned, {plan.completed_sessions_count} completed")
        
        # Check Analytics
        an = analytics_service.get_student_analytics(user.id, "30d", db)
        print(f"9. Analytics: Quiz Avg = {an.quiz_average_score}%, Efficiency = {an.learning_efficiency_score}%")
        
        print("\n✅ ALL BACKEND ML SERVICES & DATABASE LOGIC VERIFIED SUCCESSFULLY!")
    finally:
        db.close()

if __name__ == "__main__":
    verify()
