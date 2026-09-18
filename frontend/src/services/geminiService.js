/**
 * StudyPath Direct Gemini 3.5/3.6 Flash Integration
 * Powers both the AI Tutor Page & Floating AI Assistant with Google Gemini.
 */

// Fallback runtime key (Base64-decoded) if not provided in Vercel environment variables
const DEFAULT_FALLBACK_KEY = typeof atob !== 'undefined'
  ? atob('QVEuQWI4Uk42SlhvOWZSZFZLV202OWVkaUpZdC16OUZUdGJCNXVxM0lROENWZHk1RERIVnc=')
  : '';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || DEFAULT_FALLBACK_KEY;

const CANDIDATE_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.6-flash"
];

const SYSTEM_INSTRUCTION = `You are StudyPath AI — a warm, encouraging, and world-class AI Study Companion & Coding Mentor.
Guidelines:
1. GREETINGS: If greeted with 'hi', 'hello', 'hey', respond warmly, address the student by name if known, and suggest 3 high-impact learning areas.
2. CODE & CS: Give crystal-clear explanations with clean, commented Python/JavaScript/SQL/C++ code blocks and Big-O complexities.
3. STUDY PLANNING: Suggest active recall, Feynman technique, and spaced repetition schedules.
4. FORMATTING: Use clean Markdown (headers, bullet points, code blocks, bold keywords). Keep responses direct and structured.`;

export async function askGemini(prompt, studentName = 'Student') {
  const customSystemPrompt = `${SYSTEM_INSTRUCTION}\nStudent Name: ${studentName}`;

  for (const model of CANDIDATE_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: `${customSystemPrompt}\n\nStudent Question:\n${prompt}` }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500,
        }
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (outputText && outputText.trim()) {
          return {
            response: outputText.trim(),
            model: model,
            status: "success",
            suggested_followups: generateContextualFollowups(prompt, outputText)
          };
        }
      } else {
        const errText = await response.text();
        console.warn(`[Gemini API] Model ${model} returned status ${response.status}:`, errText);
      }
    } catch (err) {
      console.warn(`[Gemini API] Call to ${model} failed:`, err);
    }
  }

  throw new Error("All Gemini models were unavailable.");
}

export function generateContextualFollowups(userMsg, botReply) {
  const combined = `${userMsg} ${botReply}`.toLowerCase();

  if (/^(hi|hello|hey|howdy|good morning|yo)\b/i.test(userMsg.trim())) {
    return [
      'Explain QuickSort vs MergeSort with Python code',
      'How do database indexes speed up SQL queries?',
      'Create a 45-minute study plan for machine learning'
    ];
  }
  if (combined.includes('sort') || combined.includes('binary search') || combined.includes('algorithm') || combined.includes('tree') || combined.includes('graph')) {
    return [
      'Show the time and space complexity breakdown',
      'Give me 2 practice problems on this concept',
      'How does this compare to iterative vs recursive approaches?'
    ];
  }
  if (combined.includes('sql') || combined.includes('database') || combined.includes('acid') || combined.includes('index')) {
    return [
      'Show an example SQL query with GROUP BY and HAVING',
      'Explain ACID properties with real-world examples',
      'What is database normalization (1NF, 2NF, 3NF)?'
    ];
  }
  if (combined.includes('machine learning') || combined.includes('neural') || combined.includes('gradient') || combined.includes('ai')) {
    return [
      'Explain the Bias-Variance tradeoff intuitively',
      'What is the difference between Precision and Recall?',
      'How does Gradient Descent optimize neural weights?'
    ];
  }
  if (combined.includes('study') || combined.includes('exam') || combined.includes('plan') || combined.includes('pomodoro')) {
    return [
      'Break this down into a 45-minute Pomodoro study block',
      'What are the best active recall techniques for retention?',
      'Generate flashcard practice questions for this topic'
    ];
  }

  return [
    'Could you explain this with a practical analogy?',
    'Provide a step-by-step example with code',
    'What are the most common edge cases to watch out for?'
  ];
}
