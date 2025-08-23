import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token (if needed)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Category API endpoints
const categoryAPI = {
  // Get all categories
  getAllCategories: async () => {
    const response = await API.get('/categories');
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (categoryId) => {
    const response = await API.get(`/api/categories/${categoryId}`);
    return response.data;
  },

  // Filter categories (with query params)
  filterCategories: async (filters) => {
    const response = await API.get('/api/categories/filter', { params: filters });
    return response.data;
  },

  // Admin routes
  createCategory: async (categoryData) => {
    const response = await API.post('/categories', categoryData);
    return response.data;
  },

  updateCategory: async (categoryId, categoryData) => {
    const response = await API.put(`/api/categories/${categoryId}`, categoryData);
    return response.data;
  },

  deleteCategory: async (categoryId) => {
    const response = await API.delete(`/api/categories/${categoryId}`);
    return response.data;
  },
};

export default categoryAPI;