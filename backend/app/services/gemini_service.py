import re
import logging
from typing import Optional, List, Dict, Any
from google import genai
from app.config import settings

logger = logging.getLogger(__name__)

# Fast, high-quota models with fallback chain
CANDIDATE_MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.8-flash"
]

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.primary_model = "gemini-3.5-flash-lite"
        self._client = None
    
    @property
    def client(self) -> genai.Client:
        if self._client is None:
            self._client = genai.Client(api_key=self.api_key)
        return self._client

    def build_system_instruction(self, student_context: Optional[Dict[str, Any]] = None) -> str:
        ctx_str = ""
        student_name = "Student"
        if student_context:
            student_name = student_context.get("name", "Student")
            major = student_context.get("major", "Computer Science")
            strong_subjects = ", ".join(student_context.get("strong_subjects", []))
            weak_subjects = ", ".join(student_context.get("weak_subjects", []))
            learning_speed = student_context.get("learning_speed", "Balanced")
            content_type = student_context.get("preferred_content_type", "Interactive & Practice")
            daily_hours = student_context.get("average_study_hours", 3.5)
            
            ctx_str = f"""
Student Academic Profile:
- Name: {student_name}
- Major: {major}
- Strong Subjects: {strong_subjects or 'Computer Science'}
- Growth / Focus Areas: {weak_subjects or 'Algorithms, Databases'}
- Pace: {learning_speed}
- Daily Study Target: {daily_hours} hrs/day
"""

        system_instruction = f"""You are StudyPath AI — a warm, friendly, encouraging, and highly intelligent AI Study Companion & Academic Mentor.

Persona & Conversational Guidelines:
1. Be cheerful, approachable, and supportive (use a friendly tone and natural emojis like 👋, 🚀, 💡, 🧠).
2. GREETINGS: If the student says 'hi', 'hello', 'hey', 'good morning', or asks how you are, GREET THEM WARMLY AND CASUALLY by name ({student_name}), ask how their learning is going today, and suggest 2-3 fun or helpful things you can do together! DO NOT give a structured technical breakdown of the greeting word.
3. ACADEMIC & CODE QUESTIONS: When the student asks about a concept, exam, algorithm, or coding problem, give a clear, intuitive explanation with step-by-step guidance and clean, well-commented code snippets.
4. STUDY PLANNING: Suggest practical spaced-repetition schedules and active recall tips.
5. Be concise and format with clean Markdown (bullet points, bold keywords, headers, and code blocks).
{ctx_str}
"""
        return system_instruction.strip()

    def generate_response(
        self,
        message: str,
        student_context: Optional[Dict[str, Any]] = None,
        previous_interaction_id: Optional[str] = None,
        timeout: float = 25.0
    ) -> Dict[str, Any]:
        """
        Sends message to Gemini API with automatic model fallback and friendly greeting handling.
        """
        system_instruction = self.build_system_instruction(student_context)
        combined_prompt = f"System Instruction:\n{system_instruction}\n\nStudent Message:\n{message}"

        last_error = None

        # Try candidate models in sequence
        for model_name in CANDIDATE_MODELS:
            try:
                interaction_kwargs = {
                    "model": model_name,
                    "input": combined_prompt,
                    "timeout": timeout
                }
                if previous_interaction_id:
                    interaction_kwargs["previous_interaction_id"] = previous_interaction_id

                interaction = self.client.interactions.create(**interaction_kwargs)
                output_text = interaction.output_text
                
                if output_text and output_text.strip():
                    suggested_followups = self.generate_quick_followups(message, output_text)
                    return {
                        "response": output_text.strip(),
                        "interaction_id": interaction.id,
                        "model": model_name,
                        "status": "success",
                        "suggested_followups": suggested_followups
                    }
            except Exception as e:
                logger.warning(f"Gemini call failed on model {model_name}: {e}")
                last_error = e
                # Continue to next candidate model

        # If all cloud models fail, use intelligent, intent-aware local response
        logger.error(f"All Gemini models failed. Last error: {last_error}")
        fallback_response = self._generate_fallback(message, student_context)
        return {
            "response": fallback_response,
            "interaction_id": f"local_{id(fallback_response)}",
            "model": "studypath-companion",
            "status": "success",
            "suggested_followups": self.generate_quick_followups(message, fallback_response)
        }

    def generate_quick_followups(self, user_msg: str, bot_response: str) -> List[str]:
        """Generates smart contextual followup chips based on conversation intent."""
        lower = (user_msg + " " + bot_response).lower()
        
        # Greeting intent
        if any(w in lower for w in ["hello", "hi", "hey", "howdy", "good morning", "good evening", "how are you"]):
            return [
                "Help me practice Data Structures & Algorithms",
                "Create a 3-day revision timetable for my exams",
                "Explain a tricky Python concept with code"
            ]
        elif "dynamic programming" in lower or "dp" in lower or "algorithm" in lower or "recursion" in lower:
            return [
                "Show me a Python implementation of this algorithm",
                "What is the time and space complexity?",
                "Give me 2 practice problems on this topic"
            ]
        elif "sql" in lower or "database" in lower:
            return [
                "Show an example SQL query with JOIN and GROUP BY",
                "How do database indexes improve query speed?",
                "Explain ACID properties with real-world examples"
            ]
        elif "machine learning" in lower or "neural" in lower or "model" in lower:
            return [
                "Explain the bias-variance tradeoff intuitively",
                "What loss function should I use for classification?",
                "Give me a step-by-step model evaluation checklist"
            ]
        elif "study" in lower or "schedule" in lower or "exam" in lower or "plan" in lower:
            return [
                "Break this down into a 45-minute Pomodoro study block",
                "What are active recall techniques for this topic?",
                "Create a flashcard summary of key terms"
            ]
        else:
            return [
                "Could you explain this with a practical analogy?",
                "Provide a step-by-step example with code",
                "What are the most common mistakes to avoid?"
            ]

    def _generate_fallback(self, message: str, student_context: Optional[Dict[str, Any]] = None) -> str:
        """Friendly, conversational fallback if live network is momentarily unavailable."""
        name = student_context.get("name", "there") if student_context else "there"
        first_name = name.split()[0] if name else "there"
        clean_msg = message.strip().lower()

        # Check for greeting patterns
        if re.search(r'\b(hi|hello|hey|howdy|good morning|good afternoon|good evening|yo|sup)\b', clean_msg):
            return f"""Hello {first_name}! 👋 Great to see you!

I'm your **StudyPath AI Tutor & Study Companion**. How are your studies coming along today?

Here are a few things we can do together:
* 🧠 **Master a tricky algorithm or code problem** (Python, SQL, DSA, AI)
* 📅 **Build or refine your weekly study schedule**
* 📝 **Generate interactive diagnostic quiz questions**
* 💡 **Review your priority growth subjects**

What would you like to explore first?"""

        if re.search(r'\b(how are you|how do you do|who are you)\b', clean_msg):
            return f"""I'm doing great, {first_name}! 🚀 Ready and excited to help you learn and achieve your academic goals.

What subject or topic are you working on right now?"""

        # Technical question fallback
        return f"""### StudyPath AI Study Assistant

Hello {first_name}! Here is a structured overview to help you master **{message}**:

1. **Core Concept Overview**: Break the problem down into its fundamental invariants and sub-components.
2. **Active Recall Strategy**: Explain the core idea in your own words and write out test cases before implementing.
3. **Practice Next Step**: Schedule a 45-minute practice block in your StudyPath planner and test your understanding with a diagnostic quiz!"""

gemini_service = GeminiService()
