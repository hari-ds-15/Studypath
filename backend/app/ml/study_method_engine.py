import json
from typing import Dict, Any, List
from app.models.profile import StudentProfile
from app.schemas import StudyMethodOut, StudyMethodStep

class StudyMethodEngine:
    def recommend_study_method(self, profile: StudentProfile) -> StudyMethodOut:
        pref = profile.preferred_content_type or "Interactive & Practice"
        speed = profile.learning_speed or "Balanced"
        session_length = profile.session_length_preference or 45
        efficiency = profile.learning_efficiency_score or 78.5

        # Determine optimal step breakdown based on profile attributes
        if "Video" in pref:
            pipeline = "Video Lecture → Hands-on Practice → Checkpoint Quiz → Spaced Revision"
            why = f"Tailored for visual comprehension at a {speed.lower()} pace. Research shows 20-30 min video chunks followed by instant application increases 30-day concept retention by up to 42%."
            steps = [
                StudyMethodStep(
                    step_number=1,
                    name="Concept Priming & Video Lecture",
                    duration_minutes=int(session_length * 0.40),
                    icon="Video",
                    description="Watch focused 10-15 minute conceptual lectures with active note-taking.",
                    tips="Pause after major definitions and annotate code snippets in your notebook."
                ),
                StudyMethodStep(
                    step_number=2,
                    name="Guided Hands-on Practice",
                    duration_minutes=int(session_length * 0.30),
                    icon="Code",
                    description="Apply the video concepts on code sandboxes or structured problem sets.",
                    tips="Implement the algorithm from scratch without referring back to the video."
                ),
                StudyMethodStep(
                    step_number=3,
                    name="Micro-Quiz & Error Analysis",
                    duration_minutes=int(session_length * 0.18),
                    icon="HelpCircle",
                    description="Take a quick 5-question timed quiz to test retrieval strength.",
                    tips="Pay special attention to the detailed answer explanations for missed items."
                ),
                StudyMethodStep(
                    step_number=4,
                    name="Spaced Summary Revision",
                    duration_minutes=max(5, session_length - int(session_length * 0.88)),
                    icon="RefreshCw",
                    description="Review cheat sheets and flashcards for next-session recall.",
                    tips="Summarize 3 core takeaways in your own words."
                )
            ]
        elif "Interactive" in pref or "Practice" in pref:
            pipeline = "Interactive Coding → Concept Deep-Dive → Knowledge Check → Active Recall"
            why = f"Optimized for kinesthetic learners who learn best through active problem solving. Combining coding challenges with structured checkpoints maximizes active neural encoding."
            steps = [
                StudyMethodStep(
                    step_number=1,
                    name="Interactive Problem Solving",
                    duration_minutes=int(session_length * 0.45),
                    icon="Terminal",
                    description="Start directly with interactive exercises and unit-test challenges.",
                    tips="Write unit tests first to verify edge cases before finalizing code."
                ),
                StudyMethodStep(
                    step_number=2,
                    name="Targeted Theory & Docs",
                    duration_minutes=int(session_length * 0.25),
                    icon="BookOpen",
                    description="Consult official documentation and architectural diagrams.",
                    tips="Look up time and space complexity trade-offs for your solution."
                ),
                StudyMethodStep(
                    step_number=3,
                    name="Rapid-Fire Quiz",
                    duration_minutes=int(session_length * 0.18),
                    icon="CheckCircle2",
                    description="Test theoretical principles behind the code you just wrote.",
                    tips="Identify the theoretical edge cases where naive solutions break."
                ),
                StudyMethodStep(
                    step_number=4,
                    name="Synthesis & Spaced Card",
                    duration_minutes=max(5, session_length - int(session_length * 0.88)),
                    icon="RotateCcw",
                    description="Log one reusable pattern or algorithmic template to memory.",
                    tips="Add new code patterns to your personal quick-reference repository."
                )
            ]
        elif "Text" in pref or "Docs" in pref:
            pipeline = "Structured Reading → Worked Examples → Self-Quiz → Synthesis Notes"
            why = f"Designed for text-first learners who absorb dense technical specifications quickly. High emphasis on documentation synthesis and conceptual mapping."
            steps = [
                StudyMethodStep(
                    step_number=1,
                    name="Deep Documentation Reading",
                    duration_minutes=int(session_length * 0.40),
                    icon="FileText",
                    description="Read official guides, specs, and conceptual breakdowns.",
                    tips="Highlight key invariants and state transitions as you read."
                ),
                StudyMethodStep(
                    step_number=2,
                    name="Walkthrough of Worked Examples",
                    duration_minutes=int(session_length * 0.30),
                    icon="Layers",
                    description="Trace step-by-step example executions line by line.",
                    tips="Draw memory diagrams or call stacks to visualize execution flow."
                ),
                StudyMethodStep(
                    step_number=3,
                    name="Self-Assessment Quiz",
                    duration_minutes=int(session_length * 0.18),
                    icon="Award",
                    description="Verify retention of syntax rules and core theorems.",
                    tips="Retake any questions you hesitated on to build speed."
                ),
                StudyMethodStep(
                    step_number=4,
                    name="Synthesis Notes & Flashcards",
                    duration_minutes=max(5, session_length - int(session_length * 0.88)),
                    icon="BookMarked",
                    description="Condense the reading into an executive summary outline.",
                    tips="Group related concepts into mind maps."
                )
            ]
        else:
            pipeline = "Visual Mapping → Video Lecture → Guided Quiz → Spaced Revision"
            why = f"Balanced multi-modal workflow leveraging dual-coding theory to stimulate both verbal and visual processing centers."
            steps = [
                StudyMethodStep(
                    step_number=1,
                    name="Visual Architecture Overview",
                    duration_minutes=int(session_length * 0.25),
                    icon="Layout",
                    description="Study flowcharts and entity relationship diagrams.",
                    tips="Trace data flow across system boundaries."
                ),
                StudyMethodStep(
                    step_number=2,
                    name="Core Video Lecture",
                    duration_minutes=int(session_length * 0.35),
                    icon="PlayCircle",
                    description="Watch structured walkthrough of the mechanism.",
                    tips="Adjust playback speed to 1.25x if concept is already familiar."
                ),
                StudyMethodStep(
                    step_number=3,
                    name="Interactive Quiz Assessment",
                    duration_minutes=int(session_length * 0.25),
                    icon="HelpCircle",
                    description="Complete timed module quiz with immediate grading.",
                    tips="Note down weak topics for priority scheduling in your weekly planner."
                ),
                StudyMethodStep(
                    step_number=4,
                    name="Memory Reinforcement",
                    duration_minutes=max(5, session_length - int(session_length * 0.85)),
                    icon="Flame",
                    description="Fast 5-minute flashcard drill for spaced retention.",
                    tips="Schedule your next session within 48 hours for optimal memory consolidation."
                )
            ]

        boost = "+34% Memory Retention" if speed == "Fast Paced" else "+42% Conceptual Mastery"

        return StudyMethodOut(
            recommended_pipeline=pipeline,
            why_selected=why,
            suitable_session_length=session_length,
            preferred_content_type=pref,
            learning_speed=speed,
            expected_retention_boost=boost,
            steps=steps
        )

study_method_engine = StudyMethodEngine()
