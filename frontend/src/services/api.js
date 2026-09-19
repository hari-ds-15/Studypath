import axios from 'axios';
import {
  FALLBACK_COURSES,
  FALLBACK_ELECTIVES,
  FALLBACK_PROFILE,
  FALLBACK_ANALYTICS,
  FALLBACK_QUIZZES,
  FALLBACK_QUIZ_HISTORY,
  FALLBACK_NOTIFICATIONS,
  FALLBACK_STUDY_METHOD
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

// Determine if we should run in fast standalone client mode
export const isStandaloneMode = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return false;
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('vercel.app') || hostname === 'localhost' || hostname === '127.0.0.1') {
      return true;
    }
  }
  return true;
};

// Compute API base URL
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl;
  }
  return 'http://localhost:8000/api';
};

// Course state helpers for persistent enrollments and bookmarks
const getStoredCourses = () => {
  try {
    const saved = localStorage.getItem('studypath_courses');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse stored courses:', e);
  }
  return FALLBACK_COURSES;
};

const saveStoredCourses = (courses) => {
  try {
    localStorage.setItem('studypath_courses', JSON.stringify(courses));
  } catch (e) {
    console.warn('Failed to save courses:', e);
  }
};

const getStoredElectives = () => {
  try {
    const saved = localStorage.getItem('studypath_electives');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse stored electives:', e);
  }
  return FALLBACK_ELECTIVES;
};

const saveStoredElectives = (electives) => {
  try {
    localStorage.setItem('studypath_electives', JSON.stringify(electives));
  } catch (e) {
    console.warn('Failed to save electives:', e);
  }
};

const getStoredNotifications = () => {
  try {
    const saved = localStorage.getItem('studypath_notifications');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse stored notifications:', e);
  }
  return FALLBACK_NOTIFICATIONS;
};

const saveStoredNotifications = (notifs) => {
  try {
    localStorage.setItem('studypath_notifications', JSON.stringify(notifs));
  } catch (e) {
    console.warn('Failed to save notifications:', e);
  }
};

// Comprehensive local router that handles all 34 API endpoints instantly
export const handleLocalRoute = async (config) => {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();
  let reqData = {};

  try {
    reqData = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
  } catch {
    reqData = {};
  }

  // 1. Electives Recommendations
  if (url.includes('/recommendations/electives')) {
    const electives = getStoredElectives();
    return { data: electives, status: 200, statusText: 'OK', headers: {}, config };
  }

  // 2. Study Method Recommendation
  if (url.includes('/recommendations/study-method')) {
    const profile = getStoredProfile();
    const customMethod = {
      ...FALLBACK_STUDY_METHOD,
      preferred_content_type: profile.preferred_content_type || 'Interactive & Practice',
      learning_speed: profile.learning_speed || 'Balanced',
      suitable_session_length: profile.session_length_preference || 45,
    };
    return { data: customMethod, status: 200, statusText: 'OK', headers: {}, config };
  }

  // 3. Courses Recommendations & Details
  if (url.includes('/recommendations/courses') || url.includes('/courses')) {
    const courses = getStoredCourses();

    // Saved list
    if (url.includes('/courses/saved/list')) {
      const saved = courses.filter((c) => c.is_saved);
      return { data: saved.length > 0 ? saved : [courses[1]], status: 200, statusText: 'OK', headers: {}, config };
    }

    // Toggle Save / Bookmark
    if (url.includes('/save')) {
      const parts = url.split('/');
      const saveIdx = parts.indexOf('save');
      const courseId = parseInt(parts[saveIdx - 1], 10);
      let isSaved = true;

      // Update courses
      const updatedCourses = courses.map((c) => {
        if (c.course_id === courseId || c.id === courseId) {
          isSaved = !c.is_saved;
          return { ...c, is_saved: isSaved };
        }
        return c;
      });
      saveStoredCourses(updatedCourses);

      // Also update electives if present
      const electives = getStoredElectives();
      const updatedElectives = electives.map((e) => {
        if (e.course_id === courseId || e.id === courseId) {
          return { ...e, is_saved: isSaved };
        }
        return e;
      });
      saveStoredElectives(updatedElectives);

      return { data: { saved: isSaved, message: isSaved ? 'Bookmarked' : 'Bookmark removed' }, status: 200, statusText: 'OK', headers: {}, config };
    }

    // Toggle Enroll
    if (url.includes('/enroll')) {
      const parts = url.split('/');
      const enrollIdx = parts.indexOf('enroll');
      const courseId = parseInt(parts[enrollIdx - 1], 10);

      const updatedCourses = courses.map((c) => {
        if (c.course_id === courseId || c.id === courseId) {
          return { ...c, is_enrolled: true };
        }
        return c;
      });
      saveStoredCourses(updatedCourses);

      return { data: { enrolled: true, message: 'Enrolled successfully' }, status: 200, statusText: 'OK', headers: {}, config };
    }

    // Update Progress
    if (url.includes('/progress')) {
      const parts = url.split('/');
      const progIdx = parts.indexOf('progress');
      const courseId = parseInt(parts[progIdx - 1], 10);

      const updatedCourses = courses.map((c) => {
        if (c.course_id === courseId || c.id === courseId) {
          return {
            ...c,
            progress: reqData.progress ?? c.progress,
            current_module_index: reqData.current_module_index ?? c.current_module_index,
            current_lesson_index: reqData.current_lesson_index ?? c.current_lesson_index
          };
        }
        return c;
      });
      saveStoredCourses(updatedCourses);

      return { data: { success: true, progress: reqData.progress }, status: 200, statusText: 'OK', headers: {}, config };
    }

    // Single course detail
    if (url.match(/\/courses\/\d+$/)) {
      const id = parseInt(url.split('/').pop(), 10);
      const course = courses.find((c) => c.course_id === id || c.id === id) ||
        getStoredElectives().find((c) => c.course_id === id || c.id === id) ||
        courses[0];
      return { data: course, status: 200, statusText: 'OK', headers: {}, config };
    }

    // Refresh recommendations
    if (url.includes('/recommendations/refresh')) {
      return { data: { success: true, message: 'Recommendation models recalibrated' }, status: 200, statusText: 'OK', headers: {}, config };
    }

    return { data: courses, status: 200, statusText: 'OK', headers: {}, config };
  }

  // 4. Student Profile & Settings (Persistent)
  if (url.includes('/student/profile') || url.includes('/auth/me')) {
    if (method === 'put' || method === 'post' || method === 'patch') {
      const savedProfile = saveStoredProfile(reqData);
      generateAiStudyPlan(savedProfile);
      return { data: savedProfile, status: 200, statusText: 'OK', headers: {}, config };
    }
    const profile = getStoredProfile();
    return { data: profile, status: 200, statusText: 'OK', headers: {}, config };
  }

  if (url.includes('/student/onboarding')) {
    const savedProfile = saveStoredProfile({ ...reqData, onboarding_completed: true });
    generateAiStudyPlan(savedProfile);
    return { data: savedProfile, status: 200, statusText: 'OK', headers: {}, config };
  }

  if (url.includes('/student/reset-profile')) {
    const reset = saveStoredProfile({
      education_level: "Undergraduate",
      branch_major: "Computer Science & Engineering",
      learning_speed: "Balanced",
      preferred_content_type: "Interactive & Video",
      average_study_hours: 3.5,
      weekly_target_hours: 20,
      strong_subjects: ["Python Programming"],
      weak_subjects: ["Data Structures & Algorithms"],
      career_interests: ["AI Engineer"],
      onboarding_completed: false
    });
    return { data: reset, status: 200, statusText: 'OK', headers: {}, config };
  }

  // 5. Analytics
  if (url.includes('/analytics')) {
    const profile = getStoredProfile();
    const analyticsData = {
      ...FALLBACK_ANALYTICS,
      target_study_hours: profile.weekly_target_hours || 20.0,
      learning_efficiency_score: profile.learning_efficiency_score || 84.5,
      strong_subjects: profile.strong_subjects?.length ? profile.strong_subjects : FALLBACK_ANALYTICS.strong_subjects,
      weak_subjects: profile.weak_subjects?.length ? profile.weak_subjects : FALLBACK_ANALYTICS.weak_subjects,
    };
    return { data: analyticsData, status: 200, statusText: 'OK', headers: {}, config };
  }

  // 6. Study Plan (Dynamic AI Generation & CRUD)
  if (url.includes('/study-plan')) {
    if (url.includes('/study-plan/generate')) {
      const newPlan = generateAiStudyPlan();
      return { data: newPlan, status: 200, statusText: 'OK', headers: {}, config };
    }

    if (url.includes('/toggle-complete')) {
      const parts = url.split('/');
      const toggleIndex = parts.indexOf('toggle-complete');
      const id = parseInt(parts[toggleIndex - 1], 10);
      const res = toggleSessionCompleted(id);
      return { data: res, status: 200, statusText: 'OK', headers: {}, config };
    }

    if (method === 'delete') {
      const id = parseInt(url.split('/').pop(), 10);
      const res = deleteStudySession(id);
      return { data: res, status: 200, statusText: 'OK', headers: {}, config };
    }

    if (method === 'put') {
      const id = parseInt(url.split('/').pop(), 10);
      const res = updateStudySession(id, reqData);
      return { data: res, status: 200, statusText: 'OK', headers: {}, config };
    }

    if (method === 'post') {
      const res = addStudySession(reqData);
      return { data: res, status: 200, statusText: 'OK', headers: {}, config };
    }

    const plan = computeWeeklyPlan();
    return { data: plan, status: 200, statusText: 'OK', headers: {}, config };
  }

  // 7. Diagnostic Quizzes & Submissions
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
      return { data: historyList, status: 200, statusText: 'OK', headers: {}, config };
    }

    // Quiz Submit
    if (url.includes('/submit')) {
      const quizId = parseInt(url.split('/')[2] || url.split('/').slice(-2)[0], 10);
      const targetQuiz = FALLBACK_QUIZZES.find((q) => q.id === quizId) || FALLBACK_QUIZZES[0];
      const userAnswers = reqData.answers || [];
      let correct = 0;

      targetQuiz.questions.forEach((q) => {
        const given = userAnswers.find((a) => a.question_id === q.id);
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
        feedback: passed
          ? "Outstanding work! You demonstrated strong conceptual understanding."
          : "Good effort! Review the question explanations to strengthen your knowledge."
      };

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

      return { data: resultData, status: 200, statusText: 'OK', headers: {}, config };
    }

    // Single Quiz Detail
    if (url.match(/\/quizzes\/\d+$/)) {
      const id = parseInt(url.split('/').pop(), 10);
      const quiz = FALLBACK_QUIZZES.find((q) => q.id === id) || FALLBACK_QUIZZES[0];
      return { data: quiz, status: 200, statusText: 'OK', headers: {}, config };
    }

    return { data: FALLBACK_QUIZZES, status: 200, statusText: 'OK', headers: {}, config };
  }

  // 8. Notifications
  if (url.includes('/notifications')) {
    let notifs = getStoredNotifications();

    if (url.includes('/mark-all-read')) {
      notifs = notifs.map((n) => ({ ...n, is_read: true }));
      saveStoredNotifications(notifs);
      return { data: { success: true, message: 'All notifications marked as read' }, status: 200, statusText: 'OK', headers: {}, config };
    }

    if (url.includes('/read')) {
      const parts = url.split('/');
      const readIdx = parts.indexOf('read');
      const id = parseInt(parts[readIdx - 1], 10);
      notifs = notifs.map((n) => (n.id === id ? { ...n, is_read: true } : n));
      saveStoredNotifications(notifs);
      return { data: { success: true }, status: 200, statusText: 'OK', headers: {}, config };
    }

    if (method === 'delete') {
      const id = parseInt(url.split('/').pop(), 10);
      notifs = notifs.filter((n) => n.id !== id);
      saveStoredNotifications(notifs);
      return { data: { success: true }, status: 200, statusText: 'OK', headers: {}, config };
    }

    return { data: notifs, status: 200, statusText: 'OK', headers: {}, config };
  }

  // 9. Intelligent AI Chatbot Engine
  if (url.includes('/chat/suggestions')) {
    return {
      data: [
        {
          id: "sug-1",
          category: "DSA & Coding",
          title: "What is an Array & List Data Structure",
          prompt: "Explain what an Array is with Python code examples, time complexity, and memory structure"
        },
        {
          id: "sug-2",
          category: "DSA & Sorting",
          title: "QuickSort vs MergeSort in Python",
          prompt: "Explain QuickSort vs MergeSort with Python code and time complexity comparison"
        },
        {
          id: "sug-3",
          category: "Database & SQL",
          title: "ACID Properties & SQL Aggregation",
          prompt: "Explain ACID properties with real-world examples and SQL query"
        },
        {
          id: "sug-4",
          category: "Machine Learning",
          title: "Bias-Variance Tradeoff Intuitively",
          prompt: "Explain the Bias-Variance tradeoff and how to fix overfitting"
        }
      ],
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  if (url.includes('/chat/message') || url.includes('/chat')) {
    const msg = reqData.message || '';
    const savedUser = localStorage.getItem('studypath_user');
    const userObj = savedUser ? JSON.parse(savedUser) : null;
    const firstName = userObj?.full_name?.split(' ')[0] || (userObj?.email ? userObj.email.split('@')[0] : 'Student');

    const geminiRes = await askGemini(msg, firstName);
    return {
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
      statusText: 'OK',
      headers: {},
      config
    };
  }

  // 10. Auth Endpoints
  if (url.includes('/auth/supabase-sync') || url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/forgot-password')) {
    const email = reqData.email || 'student@studypath.edu';
    let fullName = reqData.full_name;
    if (!fullName || fullName === 'StudyPath Student') {
      const raw = email.split('@')[0].replace(/[._0-9-]+/g, ' ').trim();
      fullName = raw ? raw.split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : 'Student';
    }

    const fallbackToken = {
      access_token: 'sb_vercel_active_token',
      token_type: 'bearer',
      user_id: reqData.supabase_id || 1,
      email: email,
      full_name: fullName,
      onboarding_completed: true,
      message: 'Password reset link sent to your registered email'
    };
    return { data: fallbackToken, status: 200, statusText: 'OK', headers: {}, config };
  }

  // Default empty object
  return { data: {}, status: 200, statusText: 'OK', headers: {}, config };
};

// Create Axios Instance
const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3500,
});

// Request interceptor: attach token AND immediately resolve for standalone client mode
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('studypath_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // In standalone/Vercel mode (no remote backend configured), handle directly with zero latency
    if (isStandaloneMode()) {
      config.adapter = async (cfg) => {
        return await handleLocalRoute(cfg);
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: graceful fallback for remote failures
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (originalRequest) {
      console.info(`[StudyPath Fallback Engine] Handling request: ${originalRequest.url}`);
      return await handleLocalRoute(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default api;
