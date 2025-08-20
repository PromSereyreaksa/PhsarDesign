import axios from 'axios';
import store from '../store/store';
import { logout, loginSuccess } from '../store/slices/authSlice';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.phsardesign.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for refresh tokens
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Try to refresh token first
      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, {
          withCredentials: true // Include cookies for refresh token
        });
        
        if (refreshResponse.data.token) {
          // Update the store with new token
          const state = store.getState();
          const user = state.auth.user;
          
          store.dispatch(loginSuccess({
            user: user,
            token: refreshResponse.data.token
          }));
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Only logout if refresh token is invalid and user was previously authenticated
        const state = store.getState();
        if (state.auth.isAuthenticated) {
          store.dispatch(logout());
          // Don't redirect automatically - let the user stay on the current page
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
