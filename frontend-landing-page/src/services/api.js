import axios from 'axios';
import store from '../store/store';
import { logout, loginSuccess } from '../store/slices/authSlice';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.phsardesign.com';

console.log('API Base URL being used:', API_BASE_URL);
console.log('Environment VITE_API_URL:', import.meta.env.VITE_API_URL);

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
    console.log('API Error:', error.response?.status, error.response?.data);
    
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('401 error detected, attempting token refresh...');
      originalRequest._retry = true;
      
      // Try to refresh token first
      try {
        console.log('Attempting token refresh...');
        const refreshResponse = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, {
          withCredentials: true // Include cookies for refresh token
        });
        
        if (refreshResponse.data.token) {
          console.log('Token refresh successful, retrying original request...');
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
        console.error('Token refresh failed:', refreshError);
        // Only logout if refresh token is invalid and user was previously authenticated
        const state = store.getState();
        if (state.auth.isAuthenticated) {
          console.log('Logging out due to refresh token failure');
          store.dispatch(logout());
          // Don't redirect automatically - let the user stay on the current page
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

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

// Users API
export const usersAPI = {
  getAll: () => api.get('/api/users'),
  getById: (id) => api.get(`/api/users/${id}`),
  getByEmail: (email) => api.get(`/api/users/email/${email}`),
  getByRole: (role) => api.get(`/api/users/role/${role}`),
  create: (userData) => api.post('/api/users', userData),
  update: (id, userData) => api.put(`/api/users/${id}`, userData),
  delete: (id) => api.delete(`/api/users/${id}`),
};

// Clients API
export const clientsAPI = {
  getAll: () => api.get('/api/clients'),
  getById: (id) => api.get(`/api/clients/id/${id}`),
  getByUserId: (userId) => api.get(`/api/clients/user/${userId}`),
  getBySlug: (slug) => api.get(`/api/clients/${slug}`),
  getByName: (name) => api.get(`/api/clients/name/${name}`),
  create: (clientData) => api.post('/api/clients', clientData),
  update: (id, clientData) => api.put(`/api/clients/id/${id}`, clientData),
  updateBySlug: (slug, clientData) => api.put(`/api/clients/${slug}`, clientData),
  delete: (id) => api.delete(`/api/clients/id/${id}`),
  deleteBySlug: (slug) => api.delete(`/api/clients/${slug}`),
};

// Artists API (formerly Freelancers)
export const artistsAPI = {
  getAll: () => api.get('/api/artists'),
  getById: (id) => api.get(`/api/artists/${id}`),
  getByUserId: (userId) => api.get(`/api/artists/user/${userId}`),
  getByCategory: (category) => api.get(`/api/artists/category/${category}`),
  getBySlug: (slug) => api.get(`/api/artists/slug/${slug}`),
  search: (params) => api.get('/api/artists/search', { params }),
  create: (artistData) => api.post('/api/artists', artistData),
  update: (id, artistData) => api.put(`/api/artists/${id}`, artistData),
  updateBySlug: (slug, artistData) => api.put(`/api/artists/slug/${slug}`, artistData),
  delete: (id) => api.delete(`/api/artists/${id}`),
  deleteBySlug: (slug) => api.delete(`/api/artists/slug/${slug}`),
};

// Legacy alias for backward compatibility
export const freelancersAPI = artistsAPI;

// Projects API
export const projectsAPI = {
  getAll: (params) => api.get('/api/projects', { params }),
  getById: (id) => api.get(`/api/projects/${id}`),
  getByClientId: (clientId, params) => api.get(`/api/projects/client/${clientId}`, { params }),
  getByStatus: (status) => api.get(`/api/projects/status/${status}`),
  search: (params) => api.get('/api/projects/search', { params }),
  searchArtists: (params) => api.get('/api/projects/search/artists', { params }),
  create: (projectData) => api.post('/api/projects', projectData),
  update: (id, projectData) => api.put(`/api/projects/${id}`, projectData),
  updateStatus: (id, status) => api.patch(`/api/projects/${id}/status`, { status }),
  delete: (id) => api.delete(`/api/projects/${id}`),
};

// Portfolio API
export const portfolioAPI = {
  getAll: (params) => api.get('/api/portfolio', { params }),
  getById: (id) => api.get(`/api/portfolio/${id}`),
  getByArtistId: (artistId, params) => api.get(`/api/portfolio/artist/${artistId}`, { params }),
  getByFreelancerId: (freelancerId, params) => api.get(`/api/portfolio/artist/${freelancerId}`, { params }), // Legacy alias
  getCategories: () => api.get('/api/portfolio/categories'),
  create: (portfolioData) => api.post('/api/portfolio', portfolioData),
  update: (id, portfolioData) => api.put(`/api/portfolio/${id}`, portfolioData),
  delete: (id) => api.delete(`/api/portfolio/${id}`),
  like: (id) => api.post(`/api/portfolio/${id}/like`),
};

// Reviews API
export const reviewsAPI = {
  getAll: () => api.get('/api/reviews'),
  getById: (id) => api.get(`/api/reviews/${id}`),
  getByProjectId: (projectId) => api.get(`/api/reviews/project/${projectId}`),
  getByArtistId: (artistId) => api.get(`/api/reviews/artist/${artistId}`),
  getByFreelancerId: (freelancerId) => api.get(`/api/reviews/artist/${freelancerId}`), // Legacy alias
  getByClientId: (clientId) => api.get(`/api/reviews/client/${clientId}`),
  create: (reviewData) => api.post('/api/reviews', reviewData),
  update: (id, reviewData) => api.put(`/api/reviews/${id}`, reviewData),
  delete: (id) => api.delete(`/api/reviews/${id}`),
};

// Applications API
export const applicationsAPI = {
  getAll: (params) => api.get('/api/applications', { params }),
  getById: (id) => api.get(`/api/applications/${id}`),
  getByProjectId: (projectId, params) => api.get(`/api/applications/project/${projectId}`, { params }),
  getByArtistId: (artistId, params) => api.get(`/api/applications/artist/${artistId}`, { params }),
  getByFreelancerId: (freelancerId, params) => api.get(`/api/applications/artist/${freelancerId}`, { params }), // Legacy alias
  getByType: (type, params) => api.get(`/api/applications/type/${type}`, { params }),
  create: (applicationData) => api.post('/api/applications', applicationData),
  applyToService: (applicationData) => api.post('/api/applications/service', applicationData),
  convertToProject: (applicationId, projectData) => api.post(`/api/applications/${applicationId}/convert-to-project`, projectData),
  update: (id, applicationData) => api.put(`/api/applications/${id}`, applicationData),
  delete: (id) => api.delete(`/api/applications/${id}`),
  updateStatus: (id, statusData) => api.patch(`/api/applications/${id}/status`, statusData),
};

// Upload API
export const uploadAPI = {
  uploadImage: (formData) => api.post('/api/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadImages: (formData) => api.post('/api/upload/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadAvatar: (formData) => api.post('/api/upload/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadPortfolio: (formData) => api.post('/api/upload/portfolio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getImage: (publicId) => api.get(`/api/upload/image/${encodeURIComponent(publicId)}`),
  listImages: (params) => api.get('/api/upload/images', { params }),
  updateImageMetadata: (publicId, metadata) => api.put(`/api/upload/image/${encodeURIComponent(publicId)}`, metadata),
  transformImage: (publicId, transformations) => api.post(`/api/upload/transform/${encodeURIComponent(publicId)}`, transformations),
  deleteImage: (publicId) => api.delete(`/api/upload/image/${encodeURIComponent(publicId)}`),
  deleteImages: (publicIds) => api.delete('/api/upload/images', { data: { publicIds } }),
  generateSignature: (params) => api.post('/api/upload/signature', params),
};

// Payments API
export const paymentsAPI = {
  createPaymentIntent: (paymentData) => api.post('/api/payments/create-intent', paymentData),
  confirmPayment: (confirmationData) => api.post('/api/payments/confirm', confirmationData),
  createSetupIntent: () => api.post('/api/payments/setup-intent'),
  getPaymentMethods: () => api.get('/api/payments/payment-methods'),
  deletePaymentMethod: (paymentMethodId) => api.delete(`/api/payments/payment-methods/${paymentMethodId}`),
  getPaymentHistory: (params) => api.get('/api/payments/history', { params }),
};

// Messages API
export const messagesAPI = {
  getConversations: (params) => api.get('/api/messages', { params }),
  getConversation: (otherUserId, params) => api.get(`/api/messages/conversation/${otherUserId}`, { params }),
  getUnreadCount: () => api.get('/api/messages/unread-count'),
  send: (messageData) => api.post('/api/messages', messageData),
  markAsRead: (otherUserId) => api.patch(`/api/messages/conversation/${otherUserId}/read`),
  delete: (messageId) => api.delete(`/api/messages/${messageId}`),
};

// Availability Posts API (Artist Services)
export const availabilityPostsAPI = {
  getAll: (params) => api.get('/api/availability-posts', { params }),
  getById: (id) => api.get(`/api/availability-posts/${id}`),
  getBySlug: (slug) => api.get(`/api/availability-posts/slug/${slug}`),
  getByArtist: (artistId, params) => api.get(`/api/availability-posts/artist/${artistId}`, { params }),
  getMyPosts: (params) => api.get('/api/availability-posts/my-posts', { params }),
  search: (params) => api.get('/api/availability-posts/search', { params }),
  create: (postData) => api.post('/api/availability-posts', postData),
  update: (id, postData) => api.put(`/api/availability-posts/${id}`, postData),
  updateBySlug: (slug, postData) => api.put(`/api/availability-posts/slug/${slug}`, postData),
  delete: (id) => api.delete(`/api/availability-posts/${id}`),
  deleteBySlug: (slug) => api.delete(`/api/availability-posts/slug/${slug}`),
};

// Job Posts API (Client Jobs)
export const jobPostsAPI = {
  getAll: (params) => api.get('/api/job-posts', { params }),
  getById: (id) => api.get(`/api/job-posts/${id}`),
  search: (params) => api.get('/api/job-posts/search', { params }),
  create: (clientId, postData) => api.post(`/api/job-posts/client/${clientId}`, postData),
  update: (id, postData) => api.put(`/api/job-posts/${id}`, postData),
  delete: (id) => api.delete(`/api/job-posts/${id}`),
  apply: (jobId, applicationData) => api.post(`/api/job-posts/${jobId}/apply`, applicationData),
};

// Analytics API
export const analyticsAPI = {
  getArtistAnalytics: (artistId, params) => api.get(`/api/analytics/artist/${artistId}`, { params }),
  getClientAnalytics: (clientId, params) => api.get(`/api/analytics/client/${clientId}`, { params }),
  track: (eventData) => api.post('/api/analytics/track', eventData),
};

// Notifications API
export const notificationsAPI = {
  getAll: (params) => api.get('/api/notifications', { params }),
  getUnreadCount: () => api.get('/api/notifications/unread-count'),
  getTypes: () => api.get('/api/notifications/types'),
  markAsRead: (notificationId) => api.patch(`/api/notifications/${notificationId}/read`),
  markAllAsRead: () => api.patch('/api/notifications/mark-all-read'),
  delete: (notificationId) => api.delete(`/api/notifications/${notificationId}`),
  create: (notificationData) => api.post('/api/notifications', notificationData),
};

export default api;