import axios from 'axios';

// Vite environment variable with safe fallback to '/api'
// In Docker & K8s, Nginx will proxy '/api' to 'http://backend:5000/api'
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10s timeout
});

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(message));
  }
);

// API Service Methods
export const taskService = {
  // Check backend health
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  // Fetch all tasks
  getTasks: async () => {
    const response = await api.get('/tasks');
    return response.data; // { success: true, count: N, data: [...] }
  },

  // Create a new task
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Update an existing task
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete a task
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Toggle or set task status
  updateTaskStatus: async (id, completed) => {
    const response = await api.patch(`/tasks/${id}/status`, { completed });
    return response.data;
  }
};

export default api;
