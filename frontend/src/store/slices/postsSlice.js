import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { availabilityPostsAPI, portfolioAPI } from '../../services/api';

// Async thunks
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (params = {}) => {
    const response = await availabilityPostsAPI.getAll({
      limit: 8,
      isActive: true,
      ...params
    });
    return response.data.posts || response.data || [];
  }
);

export const fetchCategories = createAsyncThunk(
  'posts/fetchCategories',
  async () => {
    const response = await portfolioAPI.getCategories();
    // Handle different API response structures
    const data = response.data;
    
    // If data is already an array, return it
    if (Array.isArray(data)) {
      return data;
    }
    
    // If data has a categories property, return that
    if (data && Array.isArray(data.categories)) {
      return data.categories;
    }
    
    // If data has other array properties, check for them
    if (data && typeof data === 'object') {
      const possibleArrays = Object.values(data).filter(Array.isArray);
      if (possibleArrays.length > 0) {
        return possibleArrays[0];
      }
    }
    
    // Fallback to empty array
    console.warn('Categories API returned unexpected format:', data);
    return [];
  }
);

const initialState = {
  posts: [],
  categories: [],
  loading: false,
  error: null,
  categoriesLoading: false,
  categoriesError: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.categoriesError = null;
    },
    clearPosts: (state) => {
      state.posts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch posts';
      })
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.error.message || 'Failed to fetch categories';
      });
  },
});

export const { clearError, clearPosts } = postsSlice.actions;
export default postsSlice.reducer;
