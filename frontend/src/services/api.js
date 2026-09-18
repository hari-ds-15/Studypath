import axios from 'axios';
import {
  FALLBACK_COURSES,
  FALLBACK_PROFILE,
  FALLBACK_ANALYTICS,
  FALLBACK_STUDY_PLAN,
  FALLBACK_QUIZZES
} from './mockData';

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
  (error) => {
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

      if (url.includes('/chat/message') || url.includes('/chat')) {
        return Promise.resolve({
          data: {
            reply: "Hello! I am your StudyPath AI Tutor. You can ask me anything about Python, Data Structures, Machine Learning algorithms, or how to organize your daily study schedule!",
            topic: "Study Guidance",
            timestamp: new Date().toISOString()
          },
          status: 200,
          statusText: 'OK'
        });
      }

      if (url.includes('/auth/supabase-sync') || url.includes('/auth/login') || url.includes('/auth/register')) {
        const fallbackToken = {
          access_token: 'sb_vercel_active_token',
          token_type: 'bearer',
          user_id: 1,
          email: 'student@studypath.edu',
          full_name: 'StudyPath Student',
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
