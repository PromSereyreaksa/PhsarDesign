import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projects: [],
  freelancers: [],
  clients: [],
  portfolios: [],
  reviews: [],
  applications: [],
  messages: [],
  uploads: [],
  payments: [],
  paymentMethods: [],
  paymentHistory: [],
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
      state[type].push(data);
    },
    updateItem: (state, action) => {
      const { type, id, data } = action.payload;
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
    freelancers: 'freelancerId',
    projects: 'projectId',
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