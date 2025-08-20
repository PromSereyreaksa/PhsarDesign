// Application Constants
export const APP_ROUTES = {
  // Public routes
  HOME: '/',
  ABOUT: '/about',
  MARKETPLACE: '/marketplace',
  MARKETPLACE_DETAIL: '/marketplace/:slug',
  
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_OTP: '/verify-otp',
  CHANGE_PASSWORD: '/change-password',
  
  // Protected routes
  DASHBOARD: '/home',
  MARKETPLACE_CREATE: '/marketplace/create',
  MARKETPLACE_EDIT: '/marketplace/edit/:postId',
  MY_POSTS: '/dashboard/my-posts',
  
  // Profile routes
  PROFILE: '/profile',
  PROFILE_ARTIST: '/profile/artist/:userId',
  PROFILE_CLIENT: '/profile/client/:userId',
  PROFILE_EDIT: '/profile/edit',
};

export const API_ENDPOINTS = {
  AUTH: '/auth',
  MARKETPLACE: '/marketplace',
  USERS: '/users',
  POSTS: '/posts',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  THEME: 'theme',
};