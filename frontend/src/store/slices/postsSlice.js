import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { availabilityPostsAPI, jobPostsAPI } from '../api/marketplaceAPI';


// so each thunk does not manually check for different response shapes
const normalizeResponse = (data, key) => {
  if (!data) return [];                     // No data -> return empty array
  if (Array.isArray(data)) return data;     // Already an array -> use as-is
  if (Array.isArray(data[key])) return data[key]; // Look for the specific key
  return [];                                // Fallback to empty array
};

// Async thunks for Availability Posts (Artist Posts)
export const fetchAvailabilityPosts = createAsyncThunk(
  'posts/fetchAvailabilityPosts',
  async (params = {}) => {
    const response = await availabilityPostsAPI.getAll({
      limit: 9,
      isActive: true,
      ...params
    });
         console.log('API avialbity response for job posts:', response.data.posts);

    return normalizeResponse(response.data, 'posts');
  }
);

export const fetchMyAvailabilityPosts = createAsyncThunk(
  'posts/fetchMyAvailabilityPosts',
  async (params = {}) => {
    const response = await availabilityPostsAPI.getMyPosts(params);
     console.log('API avialbity response for job posts:', response.data.posts);
    return normalizeResponse(response.data, 'posts');
  }
);

export const fetchAvailabilityPostsByUserId = createAsyncThunk(
  'posts/fetchAvailabilityPostsByUserId',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await availabilityPostsAPI.getAll({
        userId: userId,
        isActive: true
      });
      console.log('API availability posts by userId response:', response.data.posts);
      return normalizeResponse(response.data, 'posts');
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createAvailabilityPost = createAsyncThunk(
  'posts/createAvailabilityPost',
  async (postData) => {
    const response = await availabilityPostsAPI.create(postData);
    return normalizeResponse(response.data, 'posts')[0] || response.data;
  }
);

export const updateAvailabilityPost = createAsyncThunk(
  'posts/updateAvailabilityPost',
  async ({ id, postData }) => {
    const response = await availabilityPostsAPI.update(id, postData);
    return normalizeResponse(response.data, 'posts')[0] || response.data;
  }
);

export const deleteAvailabilityPost = createAsyncThunk(
  'posts/deleteAvailabilityPost',
  async (id) => {
    await availabilityPostsAPI.delete(id);
    return id;
  }
);

// Async thunks for Job Posts (Client Posts)
export const fetchJobPosts = createAsyncThunk(
  'posts/fetchJobPosts',
  async (params = {}) => {
    const response = await jobPostsAPI.getAll({ limit: 9, isActive: true, ...params });
    return normalizeResponse(response.data, 'jobPosts');
  }
);



export const fetchMyJobPosts = createAsyncThunk(
  'posts/fetchMyJobPosts',
  async (params = {}) => {
    const response = await jobPostsAPI.getMyPosts(params);
    return normalizeResponse(response.data, 'posts');
  }
);

export const createJobPost = createAsyncThunk(
  'posts/createJobPost',
  async (postData) => {
    const response = await jobPostsAPI.create(postData);
    return normalizeResponse(response.data, 'jobPosts')[0] || response.data;
  }
);

export const updateJobPost = createAsyncThunk(
  'posts/updateJobPost',
  async ({ id, postData }) => {
    const response = await jobPostsAPI.update(id, postData);
    return normalizeResponse(response.data, 'jobPosts')[0] || response.data;
  }
);

export const deleteJobPost = createAsyncThunk(
  'posts/deleteJobPost',
  async (id) => {
    await jobPostsAPI.delete(id);
    return id;
  }
);

// Categories thunk (shared for both post types)
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

// Legacy thunk for backward compatibility
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (params = {}) => {
    // Default to availability posts for backward compatibility
    const response = await availabilityPostsAPI.getAll({
      limit: 9,
      isActive: true,
      ...params
    });
    return normalizeResponse(response.data, 'posts');
  }
);

const initialState = {
  // Availability Posts (Artist Posts)
  availabilityPosts: [],
  availabilityPostsLoading: false,
  availabilityPostsError: null,
  myAvailabilityPosts: [],
  myAvailabilityPostsLoading: false,
  myAvailabilityPostsError: null,
  userPosts: [], // Posts for a specific user (public view)
  userPostsLoading: false,
  userPostsError: null,
  
  // Job Posts (Client Posts)
  jobPosts: [],
  jobPostsLoading: false,
  jobPostsError: null,
  myJobPosts: [],
  myJobPostsLoading: false,
  myJobPostsError: null,
  
  // Shared data
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  
  // Legacy support
  posts: [], // For backward compatibility
  loading: false,
  error: null,
  
  // UI state
  activeTab: 'availability', // 'availability' or 'jobs'
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.availabilityPostsError = null;
      state.jobPostsError = null;
      state.categoriesError = null;
      state.myAvailabilityPostsError = null;
      state.myJobPostsError = null;
    },
    clearPosts: (state) => {
      state.posts = [];
      state.availabilityPosts = [];
      state.jobPosts = [];
    },
    clearMyPosts: (state) => {
      state.myAvailabilityPosts = [];
      state.myJobPosts = [];
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Legacy fetch posts (for backward compatibility)
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
      
      // Fetch availability posts
      .addCase(fetchAvailabilityPosts.pending, (state) => {
        state.availabilityPostsLoading = true;
        state.availabilityPostsError = null;
      })
      .addCase(fetchAvailabilityPosts.fulfilled, (state, action) => {
        state.availabilityPostsLoading = false;
        state.availabilityPosts = action.payload;
      })
      .addCase(fetchAvailabilityPosts.rejected, (state, action) => {
        state.availabilityPostsLoading = false;
        state.availabilityPostsError = action.error.message || 'Failed to fetch availability posts';
      })
      
      // Fetch my availability posts
      .addCase(fetchMyAvailabilityPosts.pending, (state) => {
        state.myAvailabilityPostsLoading = true;
        state.myAvailabilityPostsError = null;
      })
      .addCase(fetchMyAvailabilityPosts.fulfilled, (state, action) => {
        state.myAvailabilityPostsLoading = false;
        state.myAvailabilityPosts = action.payload;
      })
      .addCase(fetchMyAvailabilityPosts.rejected, (state, action) => {
        state.myAvailabilityPostsLoading = false;
        state.myAvailabilityPostsError = action.error.message || 'Failed to fetch my availability posts';
      })
      
      // Fetch availability posts by user ID
      .addCase(fetchAvailabilityPostsByUserId.pending, (state) => {
        state.userPostsLoading = true;
        state.userPostsError = null;
      })
      .addCase(fetchAvailabilityPostsByUserId.fulfilled, (state, action) => {
        state.userPostsLoading = false;
        state.userPosts = action.payload;
      })
      .addCase(fetchAvailabilityPostsByUserId.rejected, (state, action) => {
        state.userPostsLoading = false;
        state.userPostsError = action.payload || 'Failed to fetch user posts';
      })
      
      // Create availability post
      .addCase(createAvailabilityPost.pending, (state) => {
        state.availabilityPostsLoading = true;
        state.availabilityPostsError = null;
      })
      .addCase(createAvailabilityPost.fulfilled, (state, action) => {
        state.availabilityPostsLoading = false;
        state.availabilityPosts.unshift(action.payload);
        state.myAvailabilityPosts.unshift(action.payload);
      })
      .addCase(createAvailabilityPost.rejected, (state, action) => {
        state.availabilityPostsLoading = false;
        state.availabilityPostsError = action.error.message || 'Failed to create availability post';
      })
      
      // Update availability post
      .addCase(updateAvailabilityPost.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        // Update in availabilityPosts array
        const index = state.availabilityPosts.findIndex(post => post.id === updatedPost.id);
        if (index !== -1) {
          state.availabilityPosts[index] = updatedPost;
        }
        // Update in myAvailabilityPosts array
        const myIndex = state.myAvailabilityPosts.findIndex(post => post.id === updatedPost.id);
        if (myIndex !== -1) {
          state.myAvailabilityPosts[myIndex] = updatedPost;
        }
      })
      
      // Delete availability post
      .addCase(deleteAvailabilityPost.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.availabilityPosts = state.availabilityPosts.filter(post => post.id !== deletedId);
        state.myAvailabilityPosts = state.myAvailabilityPosts.filter(post => post.id !== deletedId);
      })
      
      // Fetch job posts
      .addCase(fetchJobPosts.pending, (state) => {
        state.jobPostsLoading = true;
        state.jobPostsError = null;
      })
      .addCase(fetchJobPosts.fulfilled, (state, action) => {
        state.jobPostsLoading = false;
        state.jobPosts = action.payload;
      })
      .addCase(fetchJobPosts.rejected, (state, action) => {
        state.jobPostsLoading = false;
        state.jobPostsError = action.error.message || 'Failed to fetch job posts';
      })
      
      // Fetch my job posts
      .addCase(fetchMyJobPosts.pending, (state) => {
        state.myJobPostsLoading = true;
        state.myJobPostsError = null;
      })
      .addCase(fetchMyJobPosts.fulfilled, (state, action) => {
        state.myJobPostsLoading = false;
        state.myJobPosts = action.payload;
      })
      .addCase(fetchMyJobPosts.rejected, (state, action) => {
        state.myJobPostsLoading = false;
        state.myJobPostsError = action.error.message || 'Failed to fetch my job posts';
      })
      
      // Create job post
      .addCase(createJobPost.pending, (state) => {
        state.jobPostsLoading = true;
        state.jobPostsError = null;
      })
      .addCase(createJobPost.fulfilled, (state, action) => {
        state.jobPostsLoading = false;
        state.jobPosts.unshift(action.payload);
        state.myJobPosts.unshift(action.payload);
      })
      .addCase(createJobPost.rejected, (state, action) => {
        state.jobPostsLoading = false;
        state.jobPostsError = action.error.message || 'Failed to create job post';
      })
      
      // Update job post
      .addCase(updateJobPost.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        // Update in jobPosts array
        const index = state.jobPosts.findIndex(post => post.id === updatedPost.id);
        if (index !== -1) {
          state.jobPosts[index] = updatedPost;
        }
        // Update in myJobPosts array
        const myIndex = state.myJobPosts.findIndex(post => post.id === updatedPost.id);
        if (myIndex !== -1) {
          state.myJobPosts[myIndex] = updatedPost;
        }
      })
      
      // Delete job post
      .addCase(deleteJobPost.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.jobPosts = state.jobPosts.filter(post => post.id !== deletedId);
        state.myJobPosts = state.myJobPosts.filter(post => post.id !== deletedId);
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

export const { clearError, clearPosts, clearMyPosts, setActiveTab } = postsSlice.actions;

// Selectors
export const selectAvailabilityPosts = (state) => state.posts.availabilityPosts;
export const selectJobPosts = (state) => state.posts.jobPosts;
export const selectMyAvailabilityPosts = (state) => state.posts.myAvailabilityPosts;
export const selectMyJobPosts = (state) => state.posts.myJobPosts;
export const selectUserPosts = (state) => state.posts.userPosts;
export const selectUserPostsLoading = (state) => state.posts.userPostsLoading;
export const selectUserPostsError = (state) => state.posts.userPostsError;
export const selectCategories = (state) => state.posts.categories;
export const selectActiveTab = (state) => state.posts.activeTab;

// Legacy selectors for backward compatibility
export const selectPosts = (state) => state.posts.posts;
export const selectLoading = (state) => state.posts.loading;
export const selectError = (state) => state.posts.error;

export default postsSlice.reducer;