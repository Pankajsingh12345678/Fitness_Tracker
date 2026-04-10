import axios from 'axios';

// API URL configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// Workout APIs
export const workoutAPI = {
  getAll: (params) => api.get('/workouts', { params }),
  getStats: (period) => api.get('/workouts/stats', { params: { period } }),
  getById: (id) => api.get(`/workouts/${id}`),
  create: (data) => api.post('/workouts', data),
  update: (id, data) => api.put(`/workouts/${id}`, data),
  delete: (id) => api.delete(`/workouts/${id}`)
};

// Calorie APIs
export const calorieAPI = {
  getAll: (params) => api.get('/calories', { params }),
  getStats: (period) => api.get('/calories/stats', { params: { period } }),
  create: (data) => api.post('/calories', data),
  update: (id, data) => api.put(`/calories/${id}`, data),
  delete: (id) => api.delete(`/calories/${id}`)
};

// Water APIs
export const waterAPI = {
  getAll: (params) => api.get('/water', { params }),
  getStats: (period) => api.get('/water/stats', { params: { period } }),
  create: (data) => api.post('/water', data),
  update: (id, data) => api.put(`/water/${id}`, data),
  delete: (id) => api.delete(`/water/${id}`)
};

// Profile APIs
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
  delete: () => api.delete('/profile')
};

export default api;
