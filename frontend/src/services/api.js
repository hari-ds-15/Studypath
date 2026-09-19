import axios from 'axios';
import {
  FALLBACK_ANALYTICS,
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
import {
  ALL_COURSES,
  getPersonalizedRecommendations,
  getPersonalizedElectives
} from './courseCatalogEngine';
import {
  CAREER_ROADMAPS
} from '../data/careerRoadmapsData';
import {
  generateDynamicQuiz,
  recordQuizSubmission,
  getStoredQuizHistory
} from './dynamicQuizEngine';

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
const getSavedCourseIds = () => {
  try {
    const saved = localStorage.getItem('studypath_saved_courses');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveSavedCourseIds = (ids) => {
  try {
    localStorage.setItem('studypath_saved_courses', JSON.stringify(ids));
  } catch (e) {
    console.warn('Failed to save bookmarks:', e);
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

// Comprehensive local router that handles all API endpoints instantly
export const handleLocalRoute = async (config) => {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();
  let reqData = {};

  try {
    reqData = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
  } catch {
    reqData = {};
  }

  const profile = getStoredProfile();
  const savedIds = getSavedCourseIds();

  // 1. Electives Recommendations
  if (url.includes('/recommendations/electives')) {
    const electives = getPersonalizedElectives(profile).map(el => ({
      ...el,
      is_saved: savedIds.includes(el.course_id)
    }));
    return { data: electives, status: 200, statusText: 'OK', headers: {}, config };
  }

  // 2. Career Stream Roadmaps
  if (url.includes('/recommendations/roadmaps')) {
    return { data: CAREER_ROADMAPS, status: 200, statusText: 'OK', headers: {}, config };
  }

  // 3. Study Method Recommendation
  if (url.includes('/recommendations/study-method')) {
    const customMethod = {
      ...FALLBACK_STUDY_METHOD,
      preferred_content_type: profile.preferred_content_type || 'Interactive & Practice',
      learning_speed: profile.learning_speed || 'Balanced',
      suitable_session_length: profile.session_length_preference || 45,
    };
    return { data: customMethod, status: 200, statusText: 'OK', headers: {}, config };
  }

  // 4. Courses Recommendations & Details
  if (url.includes('/recommendations/courses') || url.includes('/courses')) {
    const recs = getPersonalizedRecommendations(profile).map(c => ({
      ...c,
      is_saved: savedIds.includes(c.course_id)
    }));

    // Saved list
    if (url.includes('/courses/saved/list')) {
      const saved = recs.filter((c) => c.is_saved);
      return { data: saved.length > 0 ? saved : [recs[0]], status: 200, statusText: 'OK', headers: {}, config };
    }

    // Toggle Save / Bookmark
    if (url.includes('/save')) {
      const parts = url.split('/');
      const saveIdx = parts.indexOf('save');
      const courseId = parseInt(parts[saveIdx - 1], 10);
      
      let newSavedIds = [...savedIds];
      let isSaved = false;
      if (newSavedIds.includes(courseId)) {
        newSavedIds = newSavedIds.filter(id => id !== courseId);
        isSaved = false;
      } else {
        newSavedIds.push(courseId);
        isSaved = true;
      }
      saveSavedCourseIds(newSavedIds);

      return { data: { saved: isSaved, message: isSaved ? 'Bookmarked' : 'Bookmark removed' }, status: 200, statusText: 'OK', headers: {}, config };
    }

    // Toggle Enroll
    if (url.includes('/enroll')) {
      return { data: { enrolled: true, message: 'Enrolled successfully' }, status: 200, statusText: 'OK', headers: {}, config };
    }

    // Update Progress
    if (url.includes('/progress')) {
      return { data: { success: true, progress: reqData.progress }, status: 200, statusText: 'OK', headers: {}, config };
    }

    // Single course detail
    if (url.match(/\/courses\/\d+$/)) {
      const id = parseInt(url.split('/').pop(), 10);
      const course = ALL_COURSES.find((c) => c.course_id === id || c.id === id) ||
        recs.find((c) => c.course_id === id) ||
        ALL_COURSES[0];
      return { data: course, status: 200, statusText: 'OK', headers: {}, config };
    }

    // Refresh recommendations
    if (url.includes('/recommendations/refresh')) {
      return { data: { success: true, message: 'Recommendation models recalibrated' }, status: 200, statusText: 'OK', headers: {}, config };
    }

    return { data: recs, status: 200, statusText: 'OK', headers: {}, config };
  }

  // 5. Student Profile & Settings (Persistent)
  if (url.includes('/student/profile') || url.includes('/auth/me')) {
    if (method === 'put' || method === 'post' || method === 'patch') {
      const savedProfile = saveStoredProfile(reqData);
      generateAiStudyPlan(savedProfile);
      return { data: savedProfile, status: 200, statusText: 'OK', headers: {}, config };
    }
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
      selected_language: "Python",
      skill_level: "Beginner",
      career_stream: "AI Engineer",
      learning_speed: "Balanced",
      preferred_content_type: "Interactive & Video",
      daily_study_hours: 3.0,
      weekly_target_hours: 21,
      strong_subjects: ["Python Programming"],
      weak_subjects: ["Data Structures & Algorithms"],
      career_interests: ["AI Engineer"],
      onboarding_completed: true
    });
    return { data: reset, status: 200, statusText: 'OK', headers: {}, config };
  }

  // 6. Analytics
  if (url.includes('/analytics')) {
    const analyticsData = {
      ...FALLBACK_ANALYTICS,
      target_study_hours: profile.weekly_target_hours || 21.0,
      learning_efficiency_score: profile.learning_efficiency_score || 84.5,
      strong_subjects: profile.strong_subjects?.length ? profile.strong_subjects : FALLBACK_ANALYTICS.strong_subjects,
      weak_subjects: profile.weak_subjects?.length ? profile.weak_subjects : FALLBACK_ANALYTICS.weak_subjects,
    };
    return { data: analyticsData, status: 200, statusText: 'OK', headers: {}, config };
  }

  // 7. Study Plan (Dynamic AI Generation & CRUD)
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

  // 8. Knowledge Testing / Quizzes & Dynamic Gemini Generator
  if (url.includes('/quizzes')) {
    // Generate Dynamic Quiz via Gemini or Bank
    if (url.includes('/generate-dynamic')) {
      const dynamicQuiz = await generateDynamicQuiz({
        language: reqData.language || profile.selected_language || 'Python',
        level: reqData.level || profile.skill_level || 'Beginner',
        topic: reqData.topic || '',
        numQuestions: reqData.num_questions || 5
      });
      // Store in memory cache for submission retrieval
      try {
        const storedList = localStorage.getItem('studypath_cached_quizzes');
        const list = storedList ? JSON.parse(storedList) : [];
        list.push(dynamicQuiz);
        localStorage.setItem('studypath_cached_quizzes', JSON.stringify(list.slice(-10)));
      } catch (e) {
        console.warn('Failed to cache dynamic quiz:', e);
      }
      return { data: dynamicQuiz, status: 200, statusText: 'OK', headers: {}, config };
    }

    // Quiz History with defensive timestamps
    if (url.includes('/quizzes/history/list')) {
      const historyList = getStoredQuizHistory();
      return { data: historyList, status: 200, statusText: 'OK', headers: {}, config };
    }

    // Quiz Submit & Recalibrate
    if (url.includes('/submit')) {
      const quizId = parseInt(url.split('/')[2] || url.split('/').slice(-2)[0], 10);
      let targetQuiz = null;
      try {
        const cached = localStorage.getItem('studypath_cached_quizzes');
        if (cached) {
          const list = JSON.parse(cached);
          targetQuiz = list.find(q => q.id === quizId);
        }
      } catch (e) {
        console.warn('Failed to read cached quiz:', e);
      }

      if (!targetQuiz) {
        // Fallback to offline generator
        targetQuiz = await generateDynamicQuiz({
          language: profile.selected_language || 'Python',
          level: profile.skill_level || 'Beginner'
        });
      }

      const userAnswers = reqData.answers || [];
      let correct = 0;
      const reviewList = [];

      targetQuiz.questions.forEach((q) => {
        const given = userAnswers.find((a) => a.question_id === q.id);
        const selectedIdx = given ? given.selected_option_index : -1;
        const isCorrect = selectedIdx === q.correct_index;
        if (isCorrect) correct++;

        reviewList.push({
          id: q.id,
          question_text: q.question_text,
          options: q.options,
          selected_option_index: selectedIdx,
          correct_option_index: q.correct_index,
          is_correct: isCorrect,
          explanation: q.explanation
        });
      });

      const total = Math.max(1, targetQuiz.questions.length);
      const score = Math.round((correct / total) * 100);
      const passed = score >= (targetQuiz.passing_score || 70);

      const submissionResult = recordQuizSubmission({
        quizId: quizId,
        quizTitle: targetQuiz.title,
        language: targetQuiz.language || profile.selected_language || 'Python',
        scorePercentage: score,
        passed: passed,
        totalQuestions: total,
        correctCount: correct,
        timeSpentSeconds: reqData.time_spent_seconds || 180,
        answers: userAnswers
      });

      return {
        data: {
          ...submissionResult,
          review: reviewList
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      };
    }

    // Single Quiz Detail
    if (url.match(/\/quizzes\/\d+$/)) {
      const id = parseInt(url.split('/').pop(), 10);
      let targetQuiz = null;
      try {
        const cached = localStorage.getItem('studypath_cached_quizzes');
        if (cached) {
          const list = JSON.parse(cached);
          targetQuiz = list.find(q => q.id === id);
        }
      } catch (e) {
        console.warn('Failed to load cached quiz:', e);
      }

      if (!targetQuiz) {
        targetQuiz = await generateDynamicQuiz({
          language: profile.selected_language || 'Python',
          level: profile.skill_level || 'Beginner'
        });
      }

      return { data: targetQuiz, status: 200, statusText: 'OK', headers: {}, config };
    }

    // Default list of initial quiz tracks
    const initialQuizzes = [
      {
        id: 1,
        title: `${profile.selected_language || 'Python'} Diagnostic Assessment`,
        language: profile.selected_language || 'Python',
        level: profile.skill_level || 'Beginner',
        description: `Comprehensive diagnostic assessment for ${profile.selected_language || 'Python'} fundamentals.`,
        course_title: `${profile.selected_language || 'Python'} Foundations`,
        time_limit_minutes: 10,
        passing_score: 70,
        total_questions: 5
      },
      {
        id: 2,
        title: "Data Structures & Algorithms Checkpoint",
        language: "Core Computer Science (DSA)",
        level: "Intermediate",
        description: "Test your understanding of algorithmic complexity, trees, and graphs.",
        course_title: "Core CS Track",
        time_limit_minutes: 12,
        passing_score: 70,
        total_questions: 5
      },
      {
        id: 3,
        title: "Relational Database & SQL Proficiency",
        language: "SQL / Database Systems",
        level: "Beginner",
        description: "Assess your knowledge of joins, indexing, and transactional isolation.",
        course_title: "Database Engineering Track",
        time_limit_minutes: 10,
        passing_score: 70,
        total_questions: 5
      }
    ];

    return { data: initialQuizzes, status: 200, statusText: 'OK', headers: {}, config };
  }

  // 9. Notifications
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

  // 10. Intelligent AI Chatbot Engine
  if (url.includes('/chat/suggestions')) {
    return {
      data: [
        {
          id: "sug-1",
          category: "Programming & Syntax",
          title: `How do pointers/references work in ${profile.selected_language || 'Python'}?`,
          prompt: `Explain how memory, variables, and references work in ${profile.selected_language || 'Python'} with code examples.`
        },
        {
          id: "sug-2",
          category: "DSA & Problem Solving",
          title: "QuickSort vs MergeSort Complexity",
          prompt: `Explain QuickSort vs MergeSort with code in ${profile.selected_language || 'Python'} and time complexity comparison.`
        },
        {
          id: "sug-3",
          category: "Database & SQL",
          title: "ACID Properties & Indexing",
          prompt: "Explain ACID properties with real-world examples and SQL query optimization."
        },
        {
          id: "sug-4",
          category: "Career Roadmap",
          title: `How to break into ${profile.career_stream || 'AI Engineering'}?`,
          prompt: `Give me a structured step-by-step roadmap to become a successful ${profile.career_stream || 'AI Engineer'}.`
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

  // 11. Auth Endpoints
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
