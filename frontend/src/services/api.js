import axios from 'axios';
import {
  FALLBACK_COURSES,
  FALLBACK_ELECTIVES,
  FALLBACK_PROFILE,
  FALLBACK_ANALYTICS,
  FALLBACK_QUIZZES,
  FALLBACK_QUIZ_HISTORY
} from './mockData';
import { askGemini } from './geminiService';
import {
  getStoredProfile,
  saveStoredProfile,
  generateAiStudyPlan,
  computeWeeklyPlan,
  toggleSessionCompleted,
  addStudySession,
  updateStudySession,
  deleteStudySession
} from './studyPlanEngine';

// Dynamically compute API base URL
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
  timeout: 3000,
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

// Response interceptor: provide seamless fallback for offline & Vercel deployment
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest?.url || '';
    const method = (originalRequest?.method || 'get').toLowerCase();

    // Handle 401 unauthorized
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        localStorage.removeItem('studypath_token');
        localStorage.removeItem('studypath_user');
      }
      return Promise.reject(error);
    }

    // Standalone / Vercel offline router
    if (!error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      console.info(`[StudyPath Standalone/Vercel Mode] Serving fallback for: [${method.toUpperCase()}] ${url}`);

      // 1. Recommendations & Courses
      if (url.includes('/recommendations/electives')) {
        return Promise.resolve({ data: FALLBACK_ELECTIVES, status: 200, statusText: 'OK' });
      }

      if (url.includes('/recommendations/courses') || url.includes('/courses')) {
        // Saved list
        if (url.includes('/courses/saved/list')) {
          const savedCourses = FALLBACK_COURSES.filter(c => c.is_saved);
          return Promise.resolve({ data: savedCourses.length > 0 ? savedCourses : [FALLBACK_COURSES[1]], status: 200, statusText: 'OK' });
        }

        // Toggle Save
        if (url.includes('/save')) {
          return Promise.resolve({ data: { saved: true, message: 'Bookmark updated' }, status: 200, statusText: 'OK' });
        }

        // Toggle Enroll
        if (url.includes('/enroll')) {
          return Promise.resolve({ data: { enrolled: true, message: 'Enrolled successfully' }, status: 200, statusText: 'OK' });
        }

        // Single course detail
        if (url.match(/\/courses\/\d+$/)) {
          const id = parseInt(url.split('/').pop(), 10);
          const course = FALLBACK_COURSES.find((c) => c.course_id === id) || FALLBACK_ELECTIVES.find((c) => c.course_id === id) || FALLBACK_COURSES[0];
          return Promise.resolve({ data: course, status: 200, statusText: 'OK' });
        }

        // Refresh recommendations
        if (url.includes('/recommendations/refresh')) {
          return Promise.resolve({ data: { success: true, message: 'Recommendation models recalibrated' }, status: 200, statusText: 'OK' });
        }

        return Promise.resolve({ data: FALLBACK_COURSES, status: 200, statusText: 'OK' });
      }

      // 2. Student Profile (Persistent)
      if (url.includes('/student/profile') || url.includes('/auth/me')) {
        if (method === 'put' || method === 'post' || method === 'patch') {
          let reqData = {};
          try {
            reqData = typeof originalRequest.data === 'string' ? JSON.parse(originalRequest.data) : (originalRequest.data || {});
          } catch {
            reqData = {};
          }
          const savedProfile = saveStoredProfile(reqData);
          generateAiStudyPlan(savedProfile);
          return Promise.resolve({ data: savedProfile, status: 200, statusText: 'OK' });
        }

        const profile = getStoredProfile();
        return Promise.resolve({ data: profile, status: 200, statusText: 'OK' });
      }

      // 3. Analytics
      if (url.includes('/analytics')) {
        return Promise.resolve({ data: FALLBACK_ANALYTICS, status: 200, statusText: 'OK' });
      }

      // 4. Study Plan (Dynamic AI Generation & CRUD)
      if (url.includes('/study-plan')) {
        if (url.includes('/study-plan/generate')) {
          const newPlan = generateAiStudyPlan();
          return Promise.resolve({ data: newPlan, status: 200, statusText: 'OK' });
        }

        if (url.includes('/toggle-complete')) {
          const parts = url.split('/');
          const toggleIndex = parts.indexOf('toggle-complete');
          const id = parseInt(parts[toggleIndex - 1], 10);
          const res = toggleSessionCompleted(id);
          return Promise.resolve({ data: res, status: 200, statusText: 'OK' });
        }

        if (method === 'delete') {
          const id = parseInt(url.split('/').pop(), 10);
          const res = deleteStudySession(id);
          return Promise.resolve({ data: res, status: 200, statusText: 'OK' });
        }

        if (method === 'put') {
          const id = parseInt(url.split('/').pop(), 10);
          let reqData = {};
          try {
            reqData = typeof originalRequest.data === 'string' ? JSON.parse(originalRequest.data) : (originalRequest.data || {});
          } catch {
            reqData = {};
          }
          const res = updateStudySession(id, reqData);
          return Promise.resolve({ data: res, status: 200, statusText: 'OK' });
        }

        if (method === 'post') {
          let reqData = {};
          try {
            reqData = typeof originalRequest.data === 'string' ? JSON.parse(originalRequest.data) : (originalRequest.data || {});
          } catch {
            reqData = {};
          }
          const res = addStudySession(reqData);
          return Promise.resolve({ data: res, status: 200, statusText: 'OK' });
        }

        const plan = computeWeeklyPlan();
        return Promise.resolve({ data: plan, status: 200, statusText: 'OK' });
      }

      // 5. Diagnostic Quizzes & Submissions
      if (url.includes('/quizzes')) {
        // Quiz History
        if (url.includes('/quizzes/history/list')) {
          let historyList = [];
          try {
            const savedHist = localStorage.getItem('studypath_quiz_history');
            historyList = savedHist ? JSON.parse(savedHist) : FALLBACK_QUIZ_HISTORY;
          } catch {
            historyList = FALLBACK_QUIZ_HISTORY;
          }
          return Promise.resolve({ data: historyList, status: 200, statusText: 'OK' });
        }

        // Quiz Submit
        if (url.includes('/submit')) {
          const quizId = parseInt(url.split('/')[2] || url.split('/').slice(-2)[0], 10);
          let reqData = {};
          try {
            reqData = typeof originalRequest.data === 'string' ? JSON.parse(originalRequest.data) : (originalRequest.data || {});
          } catch {
            reqData = {};
          }

          const targetQuiz = FALLBACK_QUIZZES.find(q => q.id === quizId) || FALLBACK_QUIZZES[0];
          const userAnswers = reqData.answers || [];
          let correct = 0;

          targetQuiz.questions.forEach((q) => {
            const given = userAnswers.find(a => a.question_id === q.id);
            if (given && given.selected_option_index === q.correct_index) {
              correct++;
            }
          });

          const total = targetQuiz.questions.length;
          const score = Math.round((correct / total) * 100);
          const passed = score >= (targetQuiz.passing_score || 70);

          const resultData = {
            quiz_id: quizId,
            score_percentage: score,
            passed: passed,
            total_questions: total,
            correct_count: correct,
            wrong_count: total - correct,
            time_spent_seconds: reqData.time_spent_seconds || 180,
            feedback: passed ? "Outstanding work! You demonstrated strong conceptual understanding." : "Good effort! Review the question explanations to strengthen your knowledge."
          };

          // Save to quiz history
          try {
            const savedHist = localStorage.getItem('studypath_quiz_history');
            const list = savedHist ? JSON.parse(savedHist) : [...FALLBACK_QUIZ_HISTORY];
            list.unshift({
              id: Date.now(),
              quiz_id: quizId,
              quiz_title: targetQuiz.title,
              score_percentage: score,
              passed: passed,
              total_questions: total,
              correct_count: correct,
              time_spent_seconds: reqData.time_spent_seconds || 180,
              created_at: new Date().toISOString()
            });
            localStorage.setItem('studypath_quiz_history', JSON.stringify(list));
          } catch (e) {
            console.error('Failed to save quiz attempt history:', e);
          }

          return Promise.resolve({ data: resultData, status: 200, statusText: 'OK' });
        }

        // Single Quiz Detail
        if (url.match(/\/quizzes\/\d+$/)) {
          const id = parseInt(url.split('/').pop(), 10);
          const quiz = FALLBACK_QUIZZES.find((q) => q.id === id) || FALLBACK_QUIZZES[0];
          return Promise.resolve({ data: quiz, status: 200, statusText: 'OK' });
        }

        return Promise.resolve({ data: FALLBACK_QUIZZES, status: 200, statusText: 'OK' });
      }

      // 6. Intelligent AI Chatbot Engine for StudyPath
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

        // 1. Try Live Google Gemini Flash API first!
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
          console.warn('[StudyPath AI] Direct Gemini API failed, using intelligent offline response:', geminiError);
        }

        // 2. Intelligent Topic-Specific Response Generator
        const clean = msg.trim().toLowerCase();
        let botReply = '';
        let followups = [];

        // Specific concept matching
        if (clean.includes('array') || clean.includes('list')) {
          botReply = `### 📦 What is an Array?\n\nAn **array** is a fundamental contiguous data structure that stores elements of the same data type in sequential memory locations.\n\n#### 🔑 Key Properties:\n* **$O(1)$ Constant Time Access**: You can access any element instantly via its index (e.g. \`arr[0]\`, \`arr[i]\`) because memory is contiguous: $\\text{Address} = \\text{Base} + i \\times \\text{ElementSize}$.\n* **$O(N)$ Insertion & Deletion**: Inserting or deleting elements at arbitrary positions requires shifting elements.\n* **$O(N)$ Search Time**: Linear scan unless the array is sorted (where Binary Search achieves $O(\\log N)$).\n\n\`\`\`python\n# Array (List) Operations in Python\nscores = [85, 92, 78, 96, 88]\n\n# 1. Constant-time index access O(1)\nfirst_score = scores[0]  # 85\n\n# 2. Append to end (Amortized O(1))\nscores.append(100)\n\n# 3. Iteration O(N)\nfor idx, score in enumerate(scores):\n    print(f"Student {idx + 1}: {score}")\n\`\`\``;
          followups = [
            'Explain Array vs Linked List with memory tradeoffs',
            'How does dynamic array resizing work in Python list?',
            'Give me 2 practice problems on arrays'
          ];
        } else if (/^(hi|hello|hey|howdy|good morning|good evening|yo)\b/i.test(clean)) {
          botReply = `👋 Hello **${firstName}**! Great to see you!\n\nI am your **StudyPath AI Tutor**. Here are a few things we can do together right now:\n* 🧠 **Master algorithms & data structures** (Arrays, Linked Lists, Trees, Graphs, DP)\n* 💻 **Write & debug clean code** in Python, JavaScript, SQL, or C++\n* 📅 **Build customized revision timetables** for your exams\n* 📝 **Generate rapid-fire diagnostic quiz questions**\n\nWhat subject or topic would you like to master today?`;
          followups = [
            'Explain what an Array is with Python code',
            'Explain QuickSort vs MergeSort with Python code',
            'How do database indexes speed up SQL queries?'
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
          botReply = `### 💡 StudyPath AI Tutor: **${msg || 'Learning Query'}**\n\nHello **${firstName}**! Here is a structured explanation to master this concept:\n\n1. **Fundamental Principle**: Break the problem down into core invariants and identify base cases.\n2. **Conceptual Trace**: Trace through small test inputs before writing full code.\n3. **Implementation**: Build a clean solution and analyze time/space complexities.\n\n\`\`\`python\n# Example Concept Demonstration\ndef example_solution(data):\n    \"\"\"Clean structured implementation with O(N) linear time.\"\"\"\n    return [item for item in data if item is not None]\n\`\`\`\n\nWhat specific part would you like to explore deeper?`;
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
            model: "studypath-tutor",
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
    }

    return Promise.reject(error);
  }
);

export default api;
