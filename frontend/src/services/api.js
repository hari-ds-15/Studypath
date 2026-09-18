import axios from 'axios';
import {
  FALLBACK_COURSES,
  FALLBACK_PROFILE,
  FALLBACK_ANALYTICS,
  FALLBACK_STUDY_PLAN,
  FALLBACK_QUIZZES
} from './mockData';
import { askGemini } from './geminiService';

// Dynamically compute API base URL so mobile phones & cross-device laptops on LAN connect to the host backend
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl;
  }
  if (typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'localhost' && !window.location.hostname.includes('vercel.app')) {
    const hostname = window.location.hostname;
    return `http://${hostname}:8000/api`;
  }
  return 'http://localhost:8000/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 4000,
});

// Request interceptor: attach JWT bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('studypath_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 & provide intelligent Vercel fallback data for offline/standalone mode
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest?.url || '';

    // Handle 401 unauthorized
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        localStorage.removeItem('studypath_token');
        localStorage.removeItem('studypath_user');
      }
      return Promise.reject(error);
    }

    // If backend is unreachable (e.g. on Vercel deployment or mobile without local python backend), provide seamless fallback
    if (!error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      console.info(`[StudyPath Standalone/Vercel Mode] Serving fallback data for: ${url}`);

      if (url.includes('/recommendations/courses') || url.includes('/courses')) {
        if (url.match(/\/courses\/\d+$/)) {
          const id = parseInt(url.split('/').pop(), 10);
          const course = FALLBACK_COURSES.find((c) => c.course_id === id) || FALLBACK_COURSES[0];
          return Promise.resolve({ data: course, status: 200, statusText: 'OK' });
        }
        return Promise.resolve({ data: FALLBACK_COURSES, status: 200, statusText: 'OK' });
      }

      if (url.includes('/student/profile') || url.includes('/auth/me')) {
        const savedUser = localStorage.getItem('studypath_user');
        const userData = savedUser ? JSON.parse(savedUser) : null;
        const profile = {
          ...FALLBACK_PROFILE,
          full_name: userData?.full_name || 'StudyPath Student',
          email: userData?.email || 'student@studypath.edu',
        };
        return Promise.resolve({ data: profile, status: 200, statusText: 'OK' });
      }

      if (url.includes('/analytics')) {
        return Promise.resolve({ data: FALLBACK_ANALYTICS, status: 200, statusText: 'OK' });
      }

      if (url.includes('/study-plan')) {
        return Promise.resolve({ data: FALLBACK_STUDY_PLAN, status: 200, statusText: 'OK' });
      }

      if (url.includes('/quizzes')) {
        if (url.match(/\/quizzes\/\d+$/)) {
          const id = parseInt(url.split('/').pop(), 10);
          const quiz = FALLBACK_QUIZZES.find((q) => q.id === id) || FALLBACK_QUIZZES[0];
          return Promise.resolve({ data: quiz, status: 200, statusText: 'OK' });
        }
        return Promise.resolve({ data: FALLBACK_QUIZZES, status: 200, statusText: 'OK' });
      }

      // Intelligent AI Chatbot Engine for StudyPath (Standalone & Vercel)
      if (url.includes('/chat/suggestions')) {
        return Promise.resolve({
          data: [
            {
              id: "sug-1",
              category: "DSA & Coding",
              title: "QuickSort vs MergeSort in Python",
              prompt: "Explain QuickSort vs MergeSort with Python code and time complexity"
            },
            {
              id: "sug-2",
              category: "Database & SQL",
              title: "ACID Properties & SQL Aggregation",
              prompt: "Explain ACID properties with real-world examples and SQL query"
            },
            {
              id: "sug-3",
              category: "Machine Learning",
              title: "Bias-Variance Tradeoff",
              prompt: "Explain the Bias-Variance tradeoff and how to prevent overfitting"
            },
            {
              id: "sug-4",
              category: "Study Methods",
              title: "Active Recall Protocol",
              prompt: "Create a 45-minute Pomodoro study block for high retention"
            }
          ],
          status: 200,
          statusText: 'OK'
        });
      }

      if (url.includes('/chat/message') || url.includes('/chat')) {
        let reqData = {};
        try {
          reqData = typeof error.config?.data === 'string' ? JSON.parse(error.config.data) : (error.config?.data || {});
        } catch {
          reqData = {};
        }

        const msg = reqData.message || '';
        const savedUser = localStorage.getItem('studypath_user');
        const userObj = savedUser ? JSON.parse(savedUser) : null;
        const firstName = userObj?.full_name?.split(' ')[0] || (userObj?.email ? userObj.email.split('@')[0] : 'Student');

        // 1. Try Direct Google Gemini Flash API first!
        try {
          const geminiRes = await askGemini(msg, firstName);
          if (geminiRes && geminiRes.response) {
            return Promise.resolve({
              data: {
                response: geminiRes.response,
                reply: geminiRes.response,
                message: geminiRes.response,
                bot_reply: geminiRes.response,
                suggested_followups: geminiRes.suggested_followups,
                status: "success",
                model: geminiRes.model,
                interaction_id: `gemini_${Date.now()}`
              },
              status: 200,
              statusText: 'OK'
            });
          }
        } catch (geminiError) {
          console.warn('[StudyPath AI] Direct Gemini API failed, using intelligent offline knowledge base:', geminiError);
        }

        // 2. Offline / Knowledge Base Fallback
        const clean = msg.trim().toLowerCase();
        let botReply = '';
        let followups = [];

        if (/^(hi|hello|hey|howdy|good morning|good evening|yo)\b/i.test(clean)) {
          botReply = `👋 Hello **${firstName}**! Great to see you!\n\nI am your **StudyPath AI Tutor**. Here are a few things we can do together right now:\n* 🧠 **Master algorithms & data structures** (Binary Search, Trees, Graphs, DP)\n* 💻 **Write & debug clean code** in Python, JavaScript, SQL, or C++\n* 📅 **Build customized revision timetables** for your exams\n* 📝 **Generate rapid-fire diagnostic quiz questions**\n\nWhat subject or topic would you like to master today?`;
          followups = [
            'Explain QuickSort vs MergeSort with Python code',
            'How do database indexes speed up SQL queries?',
            'Create a 45-minute study plan for machine learning'
          ];
        } else if (clean.includes('quicksort') || clean.includes('mergesort') || clean.includes('sort')) {
          botReply = `### ⚡ QuickSort vs MergeSort Comparison\n\n| Algorithm | Best Time | Average Time | Worst Time | Space Complexity | In-Place? |\n|---|---|---|---|---|---|\n| **QuickSort** | $O(N \\log N)$ | $O(N \\log N)$ | $O(N^2)$ (poor pivot) | $O(\\log N)$ | ✅ Yes |\n| **MergeSort** | $O(N \\log N)$ | $O(N \\log N)$ | $O(N \\log N)$ | $O(N)$ auxiliary | ❌ No |\n\n#### 💡 When to use which?\n* **Use QuickSort** when cache locality is paramount and memory is tightly constrained.\n* **Use MergeSort** when guaranteed $O(N \\log N)$ worst-case performance is required or sorting linked lists.\n\n\`\`\`python\ndef quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)\n\`\`\``;
          followups = [
            'How does Big-O time complexity work for recursion?',
            'Give me 2 practice problems on sorting',
            'Explain Binary Search in Python'
          ];
        } else if (clean.includes('binary search')) {
          botReply = `### 🔍 Binary Search ($O(\\log N)$ Time Complexity)\n\nBinary Search repeatedly halves a **sorted search space** to locate a target element in logarithmic time.\n\n\`\`\`python\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = left + (right - left) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1  # Target not found\n\`\`\`\n\n> 💡 **Key Insight**: Computing \`mid = left + (right - left) // 2\` avoids arithmetic integer overflow in C++/Java.`;
          followups = [
            'How to search in a rotated sorted array?',
            'Explain Binary Search on answer spaces',
            'What is the difference between Lower Bound and Upper Bound?'
          ];
        } else if (clean.includes('sql') || clean.includes('database') || clean.includes('acid') || clean.includes('index')) {
          botReply = `### 🗄️ Database Systems & SQL Query Engineering\n\n#### 1. ACID Properties Explained:\n* **Atomicity**: Entire transaction succeeds or completely rolls back.\n* **Consistency**: All schema invariants and constraints are preserved.\n* **Isolation**: Concurrent transactions do not produce dirty/non-repeatable reads.\n* **Durability**: Committed data remains stored permanently even across power failures.\n\n#### 2. Practical SQL Example:\n\`\`\`sql\nSELECT \n    department_id, \n    COUNT(student_id) AS total_students,\n    ROUND(AVG(gpa), 2) AS average_gpa\nFROM students\nWHERE enrollment_status = 'Active'\nGROUP BY department_id\nHAVING AVG(gpa) >= 3.5\nORDER BY average_gpa DESC;\n\`\`\`\n\n> 🚀 **Optimization Tip**: Ensure composite indexes cover columns used in \`WHERE\` and \`ORDER BY\` clauses.`;
          followups = [
            'Explain INNER JOIN vs LEFT JOIN with examples',
            'How do B-Tree and Hash indexes differ?',
            'What is database normalization (1NF, 2NF, 3NF)?'
          ];
        } else if (clean.includes('machine learning') || clean.includes('neural') || clean.includes('bias') || clean.includes('variance') || clean.includes('gradient') || clean.includes('ai')) {
          botReply = `### 🤖 Machine Learning Core Principles\n\n#### 1. The Bias-Variance Tradeoff:\n* **High Bias (Underfitting)**: The model is overly simplistic to capture real patterns (e.g. fitting linear regression to non-linear data). **Remedy**: Increase capacity, add polynomial features, train longer.\n* **High Variance (Overfitting)**: The model memorizes training noise and fails on unseen validation data. **Remedy**: Apply L1/L2 Regularization (Weight Decay), Dropout, early stopping, and data augmentation.\n\n#### 2. Gradient Descent Optimization:\n\\[\n\\theta_{t+1} = \\theta_t - \\eta \\cdot \\nabla_\\theta L(\\theta_t)\n\\]\nwhere $\\eta$ is the learning rate and $\\nabla L$ represents the error surface gradients.`;
          followups = [
            'Explain the Adam optimizer vs SGD with momentum',
            'What is the difference between Precision and Recall?',
            'How does backpropagation calculate layer gradients?'
          ];
        } else if (clean.includes('study') || clean.includes('schedule') || clean.includes('plan') || clean.includes('pomodoro') || clean.includes('recall')) {
          botReply = `### 📅 High-Retention Study Protocol for ${firstName}\n\nHere is an evidence-based **Active Recall + Spaced Repetition Protocol**:\n\n1. **Concept Priming (15 mins)**: Review lecture summaries and outline 3 core learning objectives.\n2. **Deep Work Block (45 mins)**: Solve practice problems and code solutions with zero reference materials.\n3. **Feynman Retrieval (15 mins)**: Teach the concept out loud or write notes completely from memory.\n4. **Rest & Recovery (10 mins)**: Allow brain consolidation before starting the next block.\n\n> 🧠 **Spaced Repetition Schedule**: Revisit this material on **Day 1**, **Day 3**, **Day 7**, and **Day 21** for 90%+ long-term retention!`;
          followups = [
            'How can I maintain focus during 3-hour study blocks?',
            'Generate active recall flashcards for my growth areas',
            'Add this schedule to my StudyPath weekly planner'
          ];
        } else {
          botReply = `### 💡 StudyPath AI Tutor: **${msg || 'Learning Query'}**\n\nHello **${firstName}**! Here is a structured breakdown to master this concept:\n\n1. **Core Intuition**: Break the problem down into fundamental principles and identify edge cases.\n2. **Step-by-Step Approach**: Trace through small test inputs before writing full code.\n3. **Hands-On Application**: Implement the solution in a clean sandbox and verify time/space complexities.\n\n\`\`\`python\n# Example Implementation\ndef solve_problem(data):\n    \"\"\"Structured solution with clean time complexity.\"\"\"\n    processed = [x for x in data if x is not None]\n    return sorted(processed)\n\`\`\`\n\nWould you like a step-by-step code walkthrough or practice diagnostic questions?`;
          followups = [
            'Provide a step-by-step code walkthrough',
            'What are the most common edge cases to consider?',
            'Generate a diagnostic quiz on this topic'
          ];
        }

        return Promise.resolve({
          data: {
            response: botReply,
            reply: botReply,
            message: botReply,
            bot_reply: botReply,
            suggested_followups: followups,
            status: "success",
            model: "studypath-companion",
            interaction_id: `chat_${Date.now()}`
          },
          status: 200,
          statusText: 'OK'
        });
      }

      if (url.includes('/auth/supabase-sync') || url.includes('/auth/login') || url.includes('/auth/register')) {
        let reqData = {};
        try {
          reqData = typeof error.config?.data === 'string' ? JSON.parse(error.config.data) : (error.config?.data || {});
        } catch {
          reqData = {};
        }

        const email = reqData.email || 'student@studypath.edu';
        let fullName = reqData.full_name;
        if (!fullName || fullName === 'StudyPath Student') {
          const raw = email.split('@')[0].replace(/[._0-9-]+/g, ' ').trim();
          fullName = raw ? raw.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : 'Student';
        }

        const fallbackToken = {
          access_token: 'sb_vercel_active_token',
          token_type: 'bearer',
          user_id: reqData.supabase_id || 1,
          email: email,
          full_name: fullName,
          onboarding_completed: true,
        };
        return Promise.resolve({ data: fallbackToken, status: 200, statusText: 'OK' });
      }

      if (url.includes('/recommendations/refresh') || url.includes('/enroll') || url.includes('/save') || url.includes('/progress')) {
        return Promise.resolve({ data: { success: true, message: 'Updated successfully' }, status: 200, statusText: 'OK' });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
