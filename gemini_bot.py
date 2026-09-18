#!/usr/bin/env python3
"""
===================================================================
StudyPath AI - Intelligent Gemini 3.5/3.6 Flash Terminal Chatbot
Powered by Google Gemini Interactions API
===================================================================
"""

import os
import sys
import io
import time
import base64

# Ensure UTF-8 output on Windows
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

try:
    from google import genai
except ImportError:
    print("Error: 'google-genai' library is required. Install it using: pip install google-genai")
    sys.exit(1)

_FALLBACK_KEY = base64.b64decode("QVEuQWI4Uk42SlhvOWZSZFZLV202OWVkaUpZdC16OUZUdGJCNXVxM0lROENWZHk1RERIVnc=").decode('utf-8')
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", _FALLBACK_KEY)
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")

SYSTEM_INSTRUCTION = """You are StudyPath AI — a warm, friendly, encouraging, and expert academic tutor & coding mentor.
GREETINGS: When greeted with 'hi', 'hello', 'hey', respond warmly, ask how the user's day/studies are going, and offer helpful learning topics.
ACADEMICS & CODE: Provide crystal-clear explanations with Markdown formatting, practical examples, and well-commented code snippets.
Encourage deep understanding, problem-solving intuition, and efficient study techniques."""

def print_banner():
    banner = f"""
===================================================================
   🤖 StudyPath AI - Gemini Intelligent Chatbot
   Powered by Google GenAI Interactions Engine
===================================================================
   • Model:   {MODEL_NAME}
   • Status:  Online & Connected
   • Type:    Multi-turn Stateful Conversation
   ----------------------------------------------------------------
   Commands:
     /help   - Display instructions and tips
     /clear  - Reset conversation memory
     /exit   - Quit the chatbot
===================================================================
"""
    print(banner)

def main():
    print_banner()

    client = genai.Client(api_key=GEMINI_API_KEY)
    previous_interaction_id = None
    turn_count = 0

    while True:
        try:
            user_input = input("\n👤 You > ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\n\nGoodbye! Happy learning with StudyPath AI! 🚀")
            break

        if not user_input:
            continue

        # Command handling
        if user_input.lower() in ["/exit", "exit", "quit", ":q"]:
            print("\nGoodbye! Happy learning with StudyPath AI! 🚀")
            break

        if user_input.lower() in ["/clear", "/reset"]:
            previous_interaction_id = None
            turn_count = 0
            print("🔄 Conversation memory reset. Starting a fresh session!")
            continue

        if user_input.lower() in ["/help", "help"]:
            print("""
💡 StudyPath AI Chatbot Commands & Tips:
   - Ask any Computer Science, Math, AI, or Engineering question.
   - Request Python/JavaScript code examples and step-by-step walkthroughs.
   - Ask for customized study schedules, active recall flashcards, and exam prep.
   - /clear  : Reset memory to start a new topic.
   - /exit   : Exit the terminal chat.
""")
            continue

        turn_count += 1
        print("\n✨ StudyPath AI thinking...", end="", flush=True)

        prompt = f"System Instruction:\n{SYSTEM_INSTRUCTION}\n\nUser Question:\n{user_input}"

        start_time = time.time()
        try:
            interaction_kwargs = {
                "model": MODEL_NAME,
                "input": prompt,
                "timeout": 30.0
            }
            if previous_interaction_id:
                interaction_kwargs["previous_interaction_id"] = previous_interaction_id

            interaction = client.interactions.create(**interaction_kwargs)
            previous_interaction_id = interaction.id
            elapsed = time.time() - start_time

            # Clear 'thinking...' line
            print(f"\r🤖 StudyPath AI [{elapsed:.2f}s | Turn #{turn_count}]:\n")
            print(interaction.output_text)
            print("-" * 67)

        except Exception as e:
            print(f"\n❌ Error interacting with Gemini API: {e}")
            print("Tip: Check network connection or verify API Key.")

if __name__ == "__main__":
    main()
