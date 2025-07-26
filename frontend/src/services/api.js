import axios from 'axios';
import store from '../store/store';
import { logout } from '../store/slices/authSlice';

const API_BASE_URL = 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      store.dispatch(logout());
      window.location.href = '/login';
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
  getById: (id) => api.get(`/api/clients/${id}`),
  getByUserId: (userId) => api.get(`/api/clients/user/${userId}`),
  create: (clientData) => api.post('/api/clients', clientData),
  update: (id, clientData) => api.put(`/api/clients/${id}`, clientData),
  delete: (id) => api.delete(`/api/clients/${id}`),
};

// Artists API (formerly Freelancers)
export const artistsAPI = {
  getAll: () => api.get('/api/artists'),
  getById: (id) => api.get(`/api/artists/${id}`),
  getByUserId: (userId) => api.get(`/api/artists/user/${userId}`),
  getByCategory: (category) => api.get(`/api/artists/category/${category}`),
  create: (artistData) => api.post('/api/artists', artistData),
  update: (id, artistData) => api.put(`/api/artists/${id}`, artistData),
  delete: (id) => api.delete(`/api/artists/${id}`),
};

// Legacy alias for backward compatibility
export const freelancersAPI = artistsAPI;

// Projects API
export const projectsAPI = {
  getAll: () => api.get('/api/projects'),
  getById: (id) => api.get(`/api/projects/${id}`),
  getByClientId: (clientId) => api.get(`/api/projects/client/${clientId}`),
  getByStatus: (status) => api.get(`/api/projects/status/${status}`),
  search: (params) => api.get('/api/projects/search', { params }),
  create: (projectData) => api.post('/api/projects', projectData),
  update: (id, projectData) => api.put(`/api/projects/${id}`, projectData),
  delete: (id) => api.delete(`/api/projects/${id}`),
};

// Portfolio API
export const portfolioAPI = {
  getAll: () => api.get('/api/portfolio'),
  getById: (id) => api.get(`/api/portfolio/${id}`),
  getByArtistId: (artistId) => api.get(`/api/portfolio/artist/${artistId}`),
  getByFreelancerId: (freelancerId) => api.get(`/api/portfolio/artist/${freelancerId}`), // Legacy alias
  getByTag: (tag) => api.get(`/api/portfolio/tag/${tag}`),
  create: (portfolioData) => api.post('/api/portfolio', portfolioData),
  update: (id, portfolioData) => api.put(`/api/portfolio/${id}`, portfolioData),
  delete: (id) => api.delete(`/api/portfolio/${id}`),
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
  getAll: () => api.get('/api/applications'),
  getById: (id) => api.get(`/api/applications/${id}`),
  getByProjectId: (projectId) => api.get(`/api/applications/project/${projectId}`),
  getByArtistId: (artistId) => api.get(`/api/applications/artist/${artistId}`),
  getByFreelancerId: (freelancerId) => api.get(`/api/applications/artist/${freelancerId}`), // Legacy alias
  create: (applicationData) => api.post('/api/applications', applicationData),
  update: (id, applicationData) => api.put(`/api/applications/${id}`, applicationData),
  delete: (id) => api.delete(`/api/applications/${id}`),
  updateStatus: (id, status) => api.patch(`/api/applications/${id}/status`, { status }),
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

// Messages API (if implemented)
export const messagesAPI = {
  getAll: () => api.get('/api/messages'),
  getById: (id) => api.get(`/api/messages/${id}`),
  getConversation: (userId1, userId2) => api.get(`/api/messages/conversation/${userId1}/${userId2}`),
  getUserConversations: (userId) => api.get(`/api/messages/user/${userId}`),
  create: (messageData) => api.post('/api/messages', messageData),
  markAsRead: (id) => api.patch(`/api/messages/${id}/read`),
  delete: (id) => api.delete(`/api/messages/${id}`),
};

// Availability Posts API
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

export default api;