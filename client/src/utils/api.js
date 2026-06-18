import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
API.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const fetchProjects = (params) => API.get('/projects', { params });
export const fetchProject = (id) => API.get(`/projects/${id}`);
export const fetchSkills = () => API.get('/skills');
export const submitContact = (data) => API.post('/contact', data);
export const fetchBlogPosts = () => API.get('/blog');
export const trackVisitor = (data) => API.post('/analytics/track', data);
export const getStats = () => API.get('/analytics/stats');

export default API;