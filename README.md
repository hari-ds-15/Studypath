# StudyPath – Intelligent Course & Study Recommendation Engine

StudyPath is an AI-powered EdTech SaaS platform designed to eliminate academic failure risks and study inefficiency. Students often waste 10+ hours weekly on ineffective study methods, while academic course selection mismatches account for up to 20% of academic failures. 

StudyPath addresses this gap by analyzing past academic performance, learning pace, subject strengths, study durations, quiz diagnostic scores, and preferred content formats to deliver personalized course recommendations, study methods, adaptive weekly study plans, and elective suggestions.

> **Target/Claimed Metrics Notice**: The target performance benchmarks of **82–85% recommendation accuracy** and **20% → 5% failure reduction** represent claimed design targets until experimentally validated on longitudinal institutional datasets.

---

## 🚀 Key Features

1. **Premium EdTech Interface**: Glassmorphism aesthetic with interactive particle canvas, smooth Framer Motion transitions, responsive mobile drawer, and dark/light themes.
2. **6-Step Cognitive Onboarding**: Dynamic wizard analyzing subject strengths, growth areas, daily study targets, learning speed, content preferences, and career interests.
3. **Modular Hybrid Recommendation Engine**:
   - **Content-Based Filtering**: TF-IDF vectorization and cosine similarity matching course syllabi, tags, and prerequisites with student preferences.
   - **Collaborative Filtering**: Truncated SVD Matrix Factorization uncovering latent peer learner affinities.
   - **K-Nearest Neighbors (KNN)**: Nearest-neighbor clustering across student grade profiles, quiz averages, and study durations.
   - **Adaptive Dynamic Feedback Loop**: Recent quiz performance directly updates mastery scores and boosts remedial topics with transparent explainability tags.
4. **Cognitive Study Method Recommender**: Custom-tailored learning pipelines (e.g., *Video Lecture (30m) → Guided Practice (25m) → Micro-Quiz (15m) → Spaced Revision (10m)*) with custom parameter adjusters.
5. **Interactive Weekly Study Planner**: 7-day timetable with collision/overlap detection, full CRUD, completion tracking, and AI schedule auto-generation.
6. **Specialized Elective Tracks**: Career-aligned electives (AI & Generative LLMs, Big Data Engineering, Cloud Architecture, Cybersecurity Defense) with prerequisite checks.
7. **Timed Diagnostic Quiz System**: Module quizzes with live countdown timer, instant grading, solution reviews, and automatic profile calibration.
8. **Real-time Analytics Dashboard**: Recharts-powered telemetry tracking weekly study hours, quiz score progression, and subject competency radar charts across 7d, 30d, 90d, and all-time windows.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide React, Recharts, Axios, Canvas Confetti
- **Backend**: Python 3.14 / 3.11+, FastAPI, Uvicorn, SQLAlchemy, Pydantic v2
- **Machine Learning**: Scikit-Learn, Pandas, NumPy, TF-IDF Vectorizer, Truncated SVD, Nearest Neighbors
- **Database**: SQLite for zero-setup local development (structured for PostgreSQL migration)
- **Authentication**: JWT Bearer Tokens with salted PBKDF2-SHA256 password hashing

---

## 📦 Quick Start & Local Setup

### 1. Prerequisites
- Node.js (v18+) & npm
- Python (v3.10+)

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# (Optional) Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
*The database and initial rich catalog will be automatically created and seeded on first startup.*

### 3. Frontend Setup
```bash
# Navigate to frontend directory in a new terminal
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
*The frontend application will be live at `http://localhost:5173`.*

---

## 🔑 Demo Account Credentials

For instant demonstration and evaluation:
- **Email**: `alex.chen@studypath.edu`
- **Password**: `StudyPath123!`

*(You can also register a brand new account and experience the 6-step interactive onboarding flow).*

---

## 📡 REST API Documentation

Once the backend is running, interactive Swagger API docs are accessible at:
👉 **`http://localhost:8000/docs`**

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new student account |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token |
| `POST` | `/api/auth/forgot-password` | Request password reset instructions |
| `GET` | `/api/auth/me` | Fetch authenticated user information |
| `GET` | `/api/student/profile` | Retrieve student profile and preferences |
| `PUT` | `/api/student/profile` | Update profile, study hours, and subject strengths |
| `POST` | `/api/student/onboarding` | Submit 6-step onboarding wizard responses |
| `POST` | `/api/student/reset-profile` | Reset learning profile for recalibration |
| `GET` | `/api/courses` | Search & filter courses by category and difficulty |
| `GET` | `/api/courses/{id}` | Get course detail with full syllabus |
| `POST` | `/api/courses/{id}/save` | Toggle course bookmark |
| `POST` | `/api/courses/{id}/enroll` | Enroll in course track |
| `PUT` | `/api/courses/{id}/progress` | Update module progress & lesson completion |
| `GET` | `/api/recommendations/courses` | Fetch hybrid course recommendations with match % |
| `GET` | `/api/recommendations/study-method` | Get cognitive study pipeline recommendations |
| `GET` | `/api/recommendations/electives` | Get elective tracks mapped to career goals |
| `POST` | `/api/recommendations/refresh` | Trigger dynamic recommendation matrix recalculation |
| `GET` | `/api/study-plan` | Retrieve 7-day weekly schedule |
| `POST` | `/api/study-plan` | Add study session with time overlap checking |
| `PUT` | `/api/study-plan/{id}` | Edit scheduled study session |
| `DELETE` | `/api/study-plan/{id}` | Delete study session |
| `POST` | `/api/study-plan/{id}/toggle-complete` | Toggle session completion status |
| `POST` | `/api/study-plan/generate` | Auto-generate AI study schedule |
| `GET` | `/api/quizzes` | List available diagnostic course quizzes |
| `GET` | `/api/quizzes/{id}` | Fetch quiz questions |
| `POST` | `/api/quizzes/{id}/submit` | Submit quiz attempt, grade answers, and update profile |
| `GET` | `/api/quizzes/history/list` | Retrieve past quiz scores and history |
| `GET` | `/api/analytics` | Retrieve analytics telemetry for 7d, 30d, 90d, or all |
| `GET` | `/api/notifications` | Get system and study notifications |
| `PUT` | `/api/notifications/{id}/read` | Mark notification as read |
| `POST` | `/api/notifications/mark-all-read` | Mark all notifications as read |

---

## 🔬 How the Recommendation Engine Works

1. **Feature Extraction**:
   - Course text features (Title, Description, Category, Tags, Prerequisites, Career Track) are vectorized via **TF-IDF**.
   - Student profile (Major, Education Level, Strong Subjects, Weak Subjects, Career Interests) forms the query vector.
2. **Hybrid Blending**:
   $$\text{Final Score} = 0.40 \cdot S_{\text{Content}} + 0.30 \cdot S_{\text{Collaborative (SVD)}} + 0.30 \cdot S_{\text{KNN}}$$
3. **Adaptive Feedback Loop**:
   - When a student completes a quiz, their attempt score modifies their profile.
   - If a student scores below 70% in a subject (e.g., Data Structures), courses matching that subject receive an adaptive priority boost with the explanation: *"High Priority: Reinforces foundational concepts where recent quiz score was 60%"*.
   - If a student scores above 90%, follow-on advanced electives receive higher affinity scores.

---

## 🧪 Testing & Verification

### Automated Backend Tests
Run the automated test verification script:
```bash
python test_api.py
```
This tests authentication, profile CRUD, hybrid recommendation generation, quiz submission & adaptive profile updating, and study plan scheduling.

### Frontend Build Verification
```bash
cd frontend
npm run build
```
Verifies that all React components, icons, charts, and routes compile cleanly.
