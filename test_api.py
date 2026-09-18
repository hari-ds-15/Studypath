import sys
import os
import io

# Ensure UTF-8 output on Windows
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Add backend directory to path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.services.seed_service import seed_database

def run_tests():
    print("==================================================")
    print("[TEST] Running StudyPath Full-Stack Automated Tests...")
    print("==================================================")

    # 1. Initialize Test DB and seed
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

    with TestClient(app) as client:
        # 2. Test Root & Health Check
        res = client.get("/")
        assert res.status_code == 200, f"Root endpoint failed: {res.text}"
        print("[PASS] Root API metadata verified.")

        res = client.get("/api/health")
        assert res.status_code == 200 and res.json()["status"] == "healthy"
        print("[PASS] Backend health check passed.")

        # 3. Test Demo Login
        res = client.post("/api/auth/login", json={
            "email": "alex.chen@studypath.edu",
            "password": "StudyPath123!"
        })
        assert res.status_code == 200, f"Demo login failed: {res.text}"
        token = res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("[PASS] Authentication & JWT token issuance verified for demo student.")

        # 4. Test Student Profile Retrieval & Update
        res = client.get("/api/student/profile", headers=headers)
        assert res.status_code == 200
        profile_data = res.json()
        assert profile_data["education_level"] == "Undergraduate"
        print(f"[PASS] Student profile retrieved: {profile_data['branch_major']}.")

        res = client.put("/api/student/profile", headers=headers, json={
            "average_study_hours": 4.0,
            "learning_speed": "Fast Paced"
        })
        assert res.status_code == 200 and res.json()["average_study_hours"] == 4.0
        print("[PASS] Student profile update & persistence verified.")

        # 5. Test Course Catalog
        res = client.get("/api/courses")
        assert res.status_code == 200
        courses = res.json()
        assert len(courses) >= 6, f"Expected at least 6 courses, found {len(courses)}"
        print(f"[PASS] Courses catalog verified: {len(courses)} courses found.")

        # 6. Test Hybrid Recommendation Engine
        res = client.get("/api/recommendations/courses", headers=headers)
        assert res.status_code == 200
        recs = res.json()
        assert len(recs) > 0
        top_course = recs[0]
        print(f"[PASS] Hybrid recommendations generated: Top recommendation is '{top_course['course_name']}' ({top_course['match_score']}% Match, Algorithm: {top_course['algorithm']}).")

        # 7. Test Study Method Recommendation Engine
        res = client.get("/api/recommendations/study-method", headers=headers)
        assert res.status_code == 200
        sm = res.json()
        assert "steps" in sm and len(sm["steps"]) > 0
        print(f"[PASS] Study method synthesized: '{sm['recommended_pipeline']}'.")

        # 8. Test Electives Recommendation
        res = client.get("/api/recommendations/electives", headers=headers)
        assert res.status_code == 200
        electives = res.json()
        assert len(electives) > 0
        print(f"[PASS] Elective recommendations verified: {len(electives)} tracks mapped.")

        # 9. Test Study Plan Retrieval & Auto-Generation
        res = client.get("/api/study-plan", headers=headers)
        assert res.status_code == 200
        plan = res.json()
        assert "sessions_by_day" in plan
        print(f"[PASS] 7-Day study planner verified: {plan['total_weekly_hours']} hrs planned.")

        # 10. Test Quiz Diagnostic & Adaptive Feedback Loop
        res = client.get("/api/quizzes")
        assert res.status_code == 200
        quizzes = res.json()
        assert len(quizzes) > 0
        quiz_id = quizzes[0]["id"]

        res = client.get(f"/api/quizzes/{quiz_id}")
        assert res.status_code == 200
        quiz_detail = res.json()
        questions = quiz_detail["questions"]
        assert len(questions) > 0

        # Submit answers
        submission = {
            "answers": [{"question_id": q["id"], "selected_option_index": 1} for q in questions],
            "time_spent_seconds": 180
        }
        res = client.post(f"/api/quizzes/{quiz_id}/submit", headers=headers, json=submission)
        assert res.status_code == 200
        quiz_result = res.json()
        assert quiz_result["profile_updated"] is True
        print(f"[PASS] Quiz evaluation & adaptive learning profile update verified: Scored {quiz_result['score_percentage']}%.")

        # 11. Test Analytics
        for tf in ["7d", "30d", "90d", "all"]:
            res = client.get(f"/api/analytics?timeframe={tf}", headers=headers)
            assert res.status_code == 200
            an = res.json()
            assert "study_hours_trend" in an and "subject_mastery" in an
        print("[PASS] Analytics calculations verified across 7d, 30d, 90d, and all-time windows.")

        # 12. Test Notifications
        res = client.get("/api/notifications", headers=headers)
        assert res.status_code == 200
        notifs = res.json()
        assert len(notifs) > 0
        print(f"[PASS] Notifications verified: {len(notifs)} alerts in inbox.")

        # 13. Test Gemini AI Chatbot & Suggestions
        res = client.get("/api/chat/suggestions", headers=headers)
        assert res.status_code == 200
        suggs = res.json()
        assert len(suggs) > 0
        print(f"[PASS] Gemini AI Chat suggestions verified: {len(suggs)} adaptive prompt templates generated.")

        res = client.post("/api/chat", headers=headers, json={
            "message": "Give me a quick 1-sentence tip on study consistency."
        })
        assert res.status_code == 200
        chat_data = res.json()
        assert "response" in chat_data and len(chat_data["response"]) > 0
        print(f"[PASS] Gemini AI Live Chat verified with model '{chat_data['model']}': '{chat_data['response'][:60]}...'.")

    print("==================================================")
    print("🎉 ALL 13 END-TO-END AUTOMATED TEST SUITES PASSED!")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
