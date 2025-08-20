import api from './apiConfig';

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  refresh: () => api.post('/api/auth/refresh'),
  logout: () => api.post('/api/auth/logout'),
  requestOtp: (data) => api.post('/api/auth/request-otp', data),
  verifyOtp: (data) => api.post('/api/auth/verifyOTP', data),
  changePassword: (data) => api.post('/api/auth/change-password', data),
  requestForgotPasswordOtp: (data) => api.post('/api/auth/request-forgot-password-otp', data),
  verifyForgotPasswordOtp: (data) => api.post('/api/auth/verify-forgot-password-otp', data),
};

export default authAPI;
