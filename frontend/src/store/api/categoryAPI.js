import axios from 'axios';

// Create axios instance with base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/";
const API = axios.create({
  baseURL: API_BASE_URL,
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
    const response = await API.get('/api/categories');
    console.log("Categories fetched:", response.data);
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

  // Get posts by category
  getAvailabilityPostsByCategory: async (categoryId, filters = {}) => {
    const params = new URLSearchParams();
    
    // Add pagination parameters
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit || 10);
    
    // Add other filters
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.budget_min) params.append('budget_min', filters.budget_min);
    if (filters.budget_max) params.append('budget_max', filters.budget_max);
    
    const response = await API.get(`/api/categories/${categoryId}/availability-posts?${params.toString()}`);
    return response.data;
  },

  getJobPostsByCategory: async (categoryId, filters = {}) => {
    const params = new URLSearchParams();
    
    // Add pagination parameters
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit || 10);
    
    // Add other filters
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.budget_min) params.append('budget_min', filters.budget_min);
    if (filters.budget_max) params.append('budget_max', filters.budget_max);
    
    const response = await API.get(`/api/categories/${categoryId}/job-posts?${params.toString()}`);
    return response.data;
  },
};

export default categoryAPI;