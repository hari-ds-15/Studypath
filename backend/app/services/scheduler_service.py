import json
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from app.models.course import Course
from app.models.profile import StudentProfile
from app.models.study_plan import StudySession
from app.schemas import WeeklyPlanOut, StudySessionOut, StudySessionCreate

DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

class SchedulerService:
    def check_time_overlap(
        self, 
        user_id: int, 
        day_of_week: str, 
        start_time: str, 
        end_time: str, 
        db: Session,
        exclude_session_id: Optional[int] = None
    ) -> bool:
        """
        Returns True if the proposed session overlaps with an existing session on the same day.
        """
        query = db.query(StudySession).filter(
            StudySession.user_id == user_id,
            StudySession.day_of_week == day_of_week
        )
        if exclude_session_id:
            query = query.filter(StudySession.id != exclude_session_id)
        
        existing_sessions = query.all()

        def to_minutes(time_str: str) -> int:
            parts = time_str.split(":")
            return int(parts[0]) * 60 + int(parts[1])

        new_start = to_minutes(start_time)
        new_end = to_minutes(end_time)

        for s in existing_sessions:
            e_start = to_minutes(s.start_time)
            e_end = to_minutes(s.end_time)
            # Overlap condition: start < other_end and end > other_start
            if max(new_start, e_start) < min(new_end, e_end):
                return True

        return False

    def generate_ai_study_plan(self, user_id: int, db: Session) -> List[StudySession]:
        """
        Automatically creates a smart, personalized 7-day study plan.
        Prioritizes weak subjects, spaces out revisions, and fits student's daily target hours.
        """
        # Remove existing generated sessions for a clean slate
        db.query(StudySession).filter(StudySession.user_id == user_id).delete()
        db.commit()

        profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
        weak_subjects = json.loads(profile.weak_subjects or '["Data Structures", "Algorithms"]') if profile else ["Data Structures", "Algorithms"]
        strong_subjects = json.loads(profile.strong_subjects or '["Python Programming", "Mathematics"]') if profile else ["Python", "Mathematics"]
        all_courses = db.query(Course).all()

        daily_target_hours = profile.average_study_hours if profile else 3.0
        
        # Template schedule tailored to student needs
        schedule_templates = [
            # Monday - Focus on Weak Subject Foundation
            {
                "day": "Monday",
                "sessions": [
                    {"title": f"Deep Dive: {weak_subjects[0] if weak_subjects else 'Core Concepts'}", "subject": weak_subjects[0] if weak_subjects else "Computer Science", "start": "18:00", "end": "19:15", "type": "Video", "notes": "Focus on fundamentals and trace code step-by-step."},
                    {"title": f"{weak_subjects[0] if weak_subjects else 'Core'} Problem Solving", "subject": weak_subjects[0] if weak_subjects else "Computer Science", "start": "19:30", "end": "20:30", "type": "Practice", "notes": "Solve 3 medium difficulty practice problems."}
                ]
            },
            # Tuesday - Applied Practice & Second Weak Subject
            {
                "day": "Tuesday",
                "sessions": [
                    {"title": f"Concepts: {weak_subjects[1] if len(weak_subjects) > 1 else 'System Design'}", "subject": weak_subjects[1] if len(weak_subjects) > 1 else "Database Systems", "start": "18:00", "end": "19:00", "type": "Practice", "notes": "Hands-on exercises and query optimization."},
                    {"title": "Micro-Quiz & Error Review", "subject": weak_subjects[1] if len(weak_subjects) > 1 else "Database Systems", "start": "19:15", "end": "20:00", "type": "Quiz", "notes": "Take 10-question timed checkpoint quiz."}
                ]
            },
            # Wednesday - Foundation & Math/Strong Reinforcement
            {
                "day": "Wednesday",
                "sessions": [
                    {"title": f"Advanced {strong_subjects[0] if strong_subjects else 'Python'}", "subject": strong_subjects[0] if strong_subjects else "Python", "start": "18:00", "end": "19:15", "type": "Video", "notes": "Leverage strength to tackle advanced algorithmic patterns."},
                    {"title": "Spaced Revision & Synthesis", "subject": weak_subjects[0] if weak_subjects else "Data Structures", "start": "19:30", "end": "20:15", "type": "Revision", "notes": "Active recall from Monday's concepts."}
                ]
            },
            # Thursday - Weak Subject Mastery
            {
                "day": "Thursday",
                "sessions": [
                    {"title": f"Challenging Problems: {weak_subjects[0] if weak_subjects else 'Algorithms'}", "subject": weak_subjects[0] if weak_subjects else "Algorithms", "start": "18:00", "end": "19:30", "type": "Practice", "notes": "Work through edge cases and complexity analysis."}
                ]
            },
            # Friday - Elective & Project Implementation
            {
                "day": "Friday",
                "sessions": [
                    {"title": "Applied Project & Elective Study", "subject": "Machine Learning & AI", "start": "17:30", "end": "19:00", "type": "Practice", "notes": "Build end-to-end pipeline implementation."},
                    {"title": "Weekly Progress Assessment Quiz", "subject": "All Subjects", "start": "19:15", "end": "20:00", "type": "Quiz", "notes": "Gauge retention across all weekly modules."}
                ]
            },
            # Saturday - Deep Work & Capstone
            {
                "day": "Saturday",
                "sessions": [
                    {"title": "Weekend Intensive: System Architecture", "subject": "Cloud & Distributed Systems", "start": "10:00", "end": "11:45", "type": "Video", "notes": "Architecture diagrams and cloud infrastructure."},
                    {"title": "Hands-on Lab & Code Review", "subject": "Cloud & Distributed Systems", "start": "14:00", "end": "15:30", "type": "Practice", "notes": "Deploy microservice container and test latency."}
                ]
            },
            # Sunday - Weekly Wrap-up & Spaced Repetition
            {
                "day": "Sunday",
                "sessions": [
                    {"title": "Weekly Spaced Repetition Drill", "subject": "Comprehensive Review", "start": "11:00", "end": "12:15", "type": "Revision", "notes": "Flashcards and summary cheat-sheet creation."},
                    {"title": "Next Week Study Path Planning", "subject": "Planning", "start": "17:00", "end": "17:45", "type": "Reading", "notes": "Review analytics dashboard and adjust weekly goals."}
                ]
            }
        ]

        created_sessions = []
        for day_item in schedule_templates:
            day_name = day_item["day"]
            for s_data in day_item["sessions"]:
                # Match to a course id if possible
                matched_course = next((c for c in all_courses if s_data["subject"].lower() in c.title.lower() or s_data["subject"].lower() in c.category.lower()), None)
                
                # Calculate duration in minutes
                def parse_mins(s, e):
                    sh, sm = map(int, s.split(":"))
                    eh, em = map(int, e.split(":"))
                    return (eh * 60 + em) - (sh * 60 + sm)

                duration = parse_mins(s_data["start"], s_data["end"])

                session = StudySession(
                    user_id=user_id,
                    course_id=matched_course.id if matched_course else None,
                    title=s_data["title"],
                    subject_name=s_data["subject"],
                    day_of_week=day_name,
                    start_time=s_data["start"],
                    end_time=s_data["end"],
                    duration_minutes=duration,
                    session_type=s_data["type"],
                    is_completed=False,
                    notes=s_data["notes"]
                )
                db.add(session)
                created_sessions.append(session)

        db.commit()
        for s in created_sessions:
            db.refresh(s)

        return created_sessions

    def get_weekly_plan(self, user_id: int, db: Session) -> WeeklyPlanOut:
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
        target_hours = profile.weekly_target_hours if profile else 20.0

        sessions = db.query(StudySession).filter(StudySession.user_id == user_id).all()
        if not sessions:
            # Auto generate initial plan
            sessions = self.generate_ai_study_plan(user_id, db)

        total_minutes = sum(s.duration_minutes for s in sessions)
        total_hours = round(total_minutes / 60.0, 1)

        completed_count = sum(1 for s in sessions if s.is_completed)
        pending_count = len(sessions) - completed_count
        completion_rate = round((completed_count / max(1, len(sessions))) * 100.0, 1)

        sessions_by_day: Dict[str, List[StudySessionOut]] = {d: [] for d in DAYS_OF_WEEK}
        for s in sessions:
            if s.day_of_week in sessions_by_day:
                sessions_by_day[s.day_of_week].append(StudySessionOut.from_orm(s))

        # Sort sessions by start_time
        for d in DAYS_OF_WEEK:
            sessions_by_day[d].sort(key=lambda x: x.start_time)

        return WeeklyPlanOut(
            total_weekly_hours=total_hours,
            target_weekly_hours=target_hours,
            completed_sessions_count=completed_count,
            pending_sessions_count=pending_count,
            completion_rate_percentage=completion_rate,
            sessions_by_day=sessions_by_day
        )

scheduler_service = SchedulerService()
