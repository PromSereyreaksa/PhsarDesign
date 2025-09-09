import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { availabilityPostsAPI, jobPostsAPI, getAllJobPosts, getAllAvailabilityPosts } from '../api/marketplaceAPI';


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
    const { page = 1, limit = 6, ...otherParams } = params;
    
    // Clean up undefined or null values to prevent API issues
    const cleanParams = Object.entries(otherParams).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== 'undefined' && value !== 'null' && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    console.log('[fetchAvailabilityPosts] Original params:', otherParams);
    console.log('[fetchAvailabilityPosts] Cleaned params:', cleanParams);
    
    const response = await getAllAvailabilityPosts({
      page,
      limit,
      isActive: true,
      ...cleanParams
    });
    
    console.log('API availability response:', response.data);
    
    return {
      posts: normalizeResponse(response.data, 'posts'),
      pagination: {
        currentPage: response.data.currentPage || page,
        totalPages: response.data.totalPages || 1,
        totalCount: response.data.totalCount || response.data.total || 0,
        limit: response.data.limit || limit
      }
    };
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

// NEW: Fetch posts specifically by artist ID (more efficient)
export const fetchPostsByArtistId = createAsyncThunk(
  'posts/fetchPostsByArtistId',
  async (artistId, { rejectWithValue }) => {
    try {
      console.log('🎯 Fetching posts for specific artist ID:', artistId);
      const response = await availabilityPostsAPI.getByArtist(artistId, {
        isActive: true
      });
      console.log('✅ API response for artist posts:', response.data);
      return normalizeResponse(response.data, 'posts');
    } catch (error) {
      console.error('❌ Failed to fetch posts for artist:', artistId, error);
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
    const { page = 1, limit = 6, ...otherParams } = params;
    
    // Clean up undefined or null values to prevent API issues
    const cleanParams = Object.entries(otherParams).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== 'undefined' && value !== 'null' && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    console.log('[fetchJobPosts] Original params:', otherParams);
    console.log('[fetchJobPosts] Cleaned params:', cleanParams);
    
    const response = await getAllJobPosts({ 
      page,
      limit, 
      isActive: true, 
      ...cleanParams 
    });
    
    console.log('API job posts response:', response.data);
    
    return {
      posts: normalizeResponse(response.data, 'jobPosts'),
      pagination: {
        currentPage: response.data.currentPage || page,
        totalPages: response.data.totalPages || 1,
        totalCount: response.data.totalCount || response.data.total || 0,
        limit: response.data.limit || limit
      }
    };
  }
);



export const fetchMyJobPosts = createAsyncThunk(
  'posts/fetchMyJobPosts',
  async (params = {}) => {
    const response = await jobPostsAPI.getMyPosts(params);
    return normalizeResponse(response.data.data, 'jobPosts');
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

// Legacy thunk for backward compatibility
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (params = {}) => {
    // Default to availability posts for backward compatibility
    const response = await availabilityPostsAPI.getAll({
      limit: 6,
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
  availabilityPostsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 6
  },
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
  jobPostsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 6
  },
  myJobPosts: [],
  myJobPostsLoading: false,
  myJobPostsError: null,
  
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
    // Pagination action creators
    setAvailabilityPostsPage: (state, action) => {
      state.availabilityPostsPagination.currentPage = action.payload;
    },
    setJobPostsPage: (state, action) => {
      state.jobPostsPagination.currentPage = action.payload;
    },
    resetAvailabilityPostsPagination: (state) => {
      state.availabilityPostsPagination = {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 6,
        isLoading: false
      };
    },
    resetJobPostsPagination: (state) => {
      state.jobPostsPagination = {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 6,
        isLoading: false
      };
    }
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
        state.availabilityPostsPagination.isLoading = true;
        state.availabilityPostsError = null;
      })
      .addCase(fetchAvailabilityPosts.fulfilled, (state, action) => {
        state.availabilityPostsPagination.isLoading = false;
        
        // Handle the new response structure: { posts: [...], pagination: {...} }
        if (action.payload.posts) {
          state.availabilityPosts = action.payload.posts;
          
          // Update pagination metadata
          const pagination = action.payload.pagination;
          if (pagination) {
            state.availabilityPostsPagination.currentPage = pagination.currentPage || 1;
            state.availabilityPostsPagination.totalPages = pagination.totalPages || 1;
            state.availabilityPostsPagination.totalCount = pagination.totalCount || 0;
            state.availabilityPostsPagination.limit = pagination.limit || 6;
          }
        } else {
          // Fallback for old response structure
          state.availabilityPosts = action.payload.data || action.payload;
        }
      })
      .addCase(fetchAvailabilityPosts.rejected, (state, action) => {
        state.availabilityPostsPagination.isLoading = false;
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
      
      // Fetch posts by artist ID (specific endpoint)
      .addCase(fetchPostsByArtistId.pending, (state) => {
        state.userPostsLoading = true;
        state.userPostsError = null;
      })
      .addCase(fetchPostsByArtistId.fulfilled, (state, action) => {
        state.userPostsLoading = false;
        state.userPosts = action.payload;
      })
      .addCase(fetchPostsByArtistId.rejected, (state, action) => {
        state.userPostsLoading = false;
        state.userPostsError = action.payload || 'Failed to fetch artist posts';
      })
      
      // Create availability post
      .addCase(createAvailabilityPost.pending, (state) => {
        state.availabilityPostsPagination.isLoading = true;
        state.availabilityPostsError = null;
      })
      .addCase(createAvailabilityPost.fulfilled, (state, action) => {
        state.availabilityPostsPagination.isLoading = false;
        state.availabilityPosts.unshift(action.payload);
        state.myAvailabilityPosts.unshift(action.payload);
        // Update total count if pagination is active
        if (state.availabilityPostsPagination.totalCount > 0) {
          state.availabilityPostsPagination.totalCount += 1;
        }
      })
      .addCase(createAvailabilityPost.rejected, (state, action) => {
        state.availabilityPostsPagination.isLoading = false;
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
        // Update total count if pagination is active
        if (state.availabilityPostsPagination.totalCount > 0) {
          state.availabilityPostsPagination.totalCount -= 1;
        }
      })
      
      // Fetch job posts
      .addCase(fetchJobPosts.pending, (state) => {
        state.jobPostsPagination.isLoading = true;
        state.jobPostsError = null;
      })
      .addCase(fetchJobPosts.fulfilled, (state, action) => {
        state.jobPostsPagination.isLoading = false;
        
        // Handle the new response structure: { posts: [...], pagination: {...} }
        if (action.payload.posts) {
          state.jobPosts = action.payload.posts;
          
          // Update pagination metadata
          const pagination = action.payload.pagination;
          if (pagination) {
            state.jobPostsPagination.currentPage = pagination.currentPage || 1;
            state.jobPostsPagination.totalPages = pagination.totalPages || 1;
            state.jobPostsPagination.totalCount = pagination.totalCount || 0;
            state.jobPostsPagination.limit = pagination.limit || 6;
          }
        } else {
          // Fallback for old response structure
          state.jobPosts = action.payload.data || action.payload;
        }
      })
      .addCase(fetchJobPosts.rejected, (state, action) => {
        state.jobPostsPagination.isLoading = false;
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
        state.jobPostsPagination.isLoading = true;
        state.jobPostsError = null;
      })
      .addCase(createJobPost.fulfilled, (state, action) => {
        state.jobPostsPagination.isLoading = false;
        state.jobPosts.unshift(action.payload);
        state.myJobPosts.unshift(action.payload);
        // Update total count if pagination is active
        if (state.jobPostsPagination.totalCount > 0) {
          state.jobPostsPagination.totalCount += 1;
        }
      })
      .addCase(createJobPost.rejected, (state, action) => {
        state.jobPostsPagination.isLoading = false;
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
        // Update total count if pagination is active
        if (state.jobPostsPagination.totalCount > 0) {
          state.jobPostsPagination.totalCount -= 1;
        }
      });
  },
});

export const { 
  clearError, 
  clearPosts, 
  clearMyPosts, 
  setActiveTab,
  setAvailabilityPostsPage,
  setJobPostsPage,
  resetAvailabilityPostsPagination,
  resetJobPostsPagination
} = postsSlice.actions;

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

// Pagination selectors
export const selectAvailabilityPostsPagination = (state) => state.posts.availabilityPostsPagination;
export const selectJobPostsPagination = (state) => state.posts.jobPostsPagination;
export const selectAvailabilityPostsLoading = (state) => state.posts.availabilityPostsPagination.isLoading;
export const selectJobPostsLoading = (state) => state.posts.jobPostsPagination.isLoading;
export const selectAvailabilityPostsError = (state) => state.posts.availabilityPostsError;
export const selectJobPostsError = (state) => state.posts.jobPostsError;

// Legacy selectors for backward compatibility
export const selectPosts = (state) => state.posts.posts;
export const selectLoading = (state) => state.posts.loading;
export const selectError = (state) => state.posts.error;

export default postsSlice.reducer;