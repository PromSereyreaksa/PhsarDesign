import { createSlice } from '@reduxjs/toolkit';

const getTokenFromStorage = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    // Basic validation - check if token looks valid
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
    
    return token;
  } catch {
    return null;
  }
};

const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    const token = getTokenFromStorage();
    if (!token) {
      localStorage.removeItem('user');
      return null;
    }
    return user ? JSON.parse(user) : null;
  } catch {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
};

const initialState = {
  user: getUserFromStorage(),
  token: getTokenFromStorage(),
  isAuthenticated: !!getTokenFromStorage(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      
      // Save to localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;
export default authSlice.reducer;