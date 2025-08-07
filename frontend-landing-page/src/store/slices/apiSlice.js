import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projects: [],
  jobPosts: [], // Add jobPosts array
  artists: [],
  freelancers: [], // Legacy field for backward compatibility
  clients: [],
  portfolios: [],
  reviews: [],
  applications: [],
  messages: [],
  uploads: [],
  payments: [],
  paymentMethods: [],
  paymentHistory: [],
  currentArtist: null,
  currentClient: null,
  loading: false,
  error: null,
};

const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      const { type, data } = action.payload;
      state[type] = data;
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addItem: (state, action) => {
      const { type, data } = action.payload;
      // Ensure the array exists before pushing
      if (!state[type]) {
        state[type] = [];
      }
      state[type].push(data);
    },
    updateItem: (state, action) => {
      const { type, id, data } = action.payload;
      
      // Handle special cases for current profile objects
      if (type === 'currentArtist') {
        state.currentArtist = { ...state.currentArtist, ...data };
        return;
      }
      if (type === 'currentClient') {
        state.currentClient = { ...state.currentClient, ...data };
        return;
      }
      
      // Handle array types
      if (!Array.isArray(state[type])) {
        return;
      }
      
      // Handle different ID field names based on type
      const idField = getIdField(type);
      const index = state[type].findIndex(item => item[idField] === id);
      if (index !== -1) {
        state[type][index] = { ...state[type][index], ...data };
      }
    },
    deleteItem: (state, action) => {
      const { type, id } = action.payload;
      const idField = getIdField(type);
      state[type] = state[type].filter(item => item[idField] !== id);
    },
    setItems: (state, action) => {
      const { type, data } = action.payload;
      state[type] = data;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Helper function to get the correct ID field for each type
const getIdField = (type) => {
  const idMap = {
    users: 'userId',
    clients: 'clientId',
    artists: 'artistId',
    freelancers: 'artistId', // Legacy mapping
    projects: 'projectId',
    jobPosts: 'jobId', // Add jobPosts mapping
    portfolios: 'portfolioId',
    reviews: 'reviewId',
    applications: 'applicationId',
    messages: 'messageId',
    uploads: 'public_id',
    payments: 'paymentIntentId'
  };
  return idMap[type] || 'id';
};

export const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  addItem,
  updateItem,
  deleteItem,
  setItems,
  clearError,
} = apiSlice.actions;

export default apiSlice.reducer;