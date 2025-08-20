// API Services Barrel Export
export { default as api } from './apiConfig';
export { authAPI } from './authApi';
export { usersAPI } from './usersApi';
export { clientsAPI } from './clientsApi';
export { artistsAPI, freelancersAPI, getArtists } from './artistsApi';
export { projectsAPI } from './projectsApi';
export { portfolioAPI } from './portfolioApi';
export { applicationsAPI } from './applicationsApi';
export { uploadAPI } from './uploadApi';
export { availabilityPostsAPI, jobPostsAPI } from './marketplaceApi';

// Export legacy marketplace functions
export * from './marketplaceApi';

// Re-export remaining APIs from services/api.js for backward compatibility
export { 
  reviewsAPI,
  paymentsAPI,
  messagesAPI,
  analyticsAPI,
  notificationsAPI 
} from '../services/api';
