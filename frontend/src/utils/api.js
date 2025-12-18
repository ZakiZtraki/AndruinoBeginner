import axios from 'axios';

// Get API base URL from environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ==================== Auth API ====================

export const authAPI = {
  register: async (email, password, name) => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// ==================== Progress API ====================

export const progressAPI = {
  getUserProgress: async (userId) => {
    const response = await api.get(`/progress/${userId}`);
    return response.data;
  },

  updateActivity: async (lessonId, activityId) => {
    const response = await api.post(`/progress/${lessonId}/activity`, { activityId });
    return response.data;
  },

  submitQuiz: async (lessonId, answers) => {
    const response = await api.post(`/progress/${lessonId}/quiz`, { answers });
    return response.data;
  },

  saveCode: async (lessonId, code, editorId) => {
    const response = await api.post(`/progress/${lessonId}/code`, { code, editorId });
    return response.data;
  },

  markLessonComplete: async (lessonId) => {
    const response = await api.put(`/progress/${lessonId}/complete`);
    return response.data;
  },
};

// ==================== Analytics API ====================

export const analyticsAPI = {
  getUserAnalytics: async (userId) => {
    const response = await api.get(`/analytics/${userId}/overview`);
    return response.data;
  },
};

// ==================== Lessons API ====================

export const lessonsAPI = {
  getAllLessons: async () => {
    const response = await api.get('/lessons');
    return response.data;
  },

  getLessonById: async (dayId) => {
    const response = await api.get(`/lessons/${dayId}`);
    return response.data;
  },
};

export default api;
