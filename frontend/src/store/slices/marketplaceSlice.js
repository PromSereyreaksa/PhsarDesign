import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import * as marketplaceAPI from "../api/marketplaceAPI"

// Async thunks for API calls
export const fetchPosts = createAsyncThunk("marketplace/fetchPosts", async (filters = {}) => {
  console.log("🔍 Fetching posts with filters:", filters)
  
  // Determine which API to call based on section filter
  const section = filters.section || "services"
  let response
  
  if (section === "jobs") {
    // Call job posts API for jobs section
    response = await marketplaceAPI.getAllJobPosts(filters)
  } else {
    // Call availability posts API for services section
    response = await marketplaceAPI.getAllAvailabilityPosts(filters)
  }
  
  console.log("📡 API Response:", response)
  console.log("📦 Response data:", response.data)
  return { ...response.data, section }
})

export const fetchPostById = createAsyncThunk("marketplace/fetchPostById", async (jobId) => {
  const response = await marketplaceAPI.getJobPostById(jobId)
  return response.data
})

export const fetchPostBySlug = createAsyncThunk("marketplace/fetchPostBySlug", async (slug) => {
  const response = await marketplaceAPI.getJobPostBySlug(slug)
  return response.data
})

export const fetchPostsByClient = createAsyncThunk("marketplace/fetchPostsByClient", async (clientId) => {
  const response = await marketplaceAPI.getJobPostByClient(clientId)
  return response.data
})

export const createPost = createAsyncThunk(
  "marketplace/createPost", 
  async (postData, { rejectWithValue, getState }) => {
    try {
      const response = await marketplaceAPI.createJobPost(postData);
      return response.data;
    } catch (error) {
      // Handle different types of errors
      if (error.response?.status === 401) {
        return rejectWithValue("Authentication required. Please log in.");
      } else if (error.response?.status === 403) {
        return rejectWithValue("You don't have permission to create job posts.");
      } else if (error.response?.data?.error) {
        return rejectWithValue(error.response.data.error);
      } else {
        return rejectWithValue("Failed to create post. Please try again.");
      }
    }
  }
);


export const updatePost = createAsyncThunk("marketplace/updatePost", async ({ jobId, postData }, { rejectWithValue }) => {
  try {
    const response = await marketplaceAPI.updateJobPost(jobId, postData)
    return response.data
  } catch (error) {
    if (error.response?.status === 401) {
      return rejectWithValue("Authentication required. Please log in.");
    } else if (error.response?.status === 403) {
      return rejectWithValue("You don't have permission to update this post.");
    } else if (error.response?.data?.error) {
      return rejectWithValue(error.response.data.error);
    } else {
      return rejectWithValue("Failed to update post. Please try again.");
    }
  }
})

export const deletePost = createAsyncThunk("marketplace/deletePost", async (jobId, { rejectWithValue }) => {
  try {
    await marketplaceAPI.deleteJobPost(jobId)
    return jobId
  } catch (error) {
    if (error.response?.status === 401) {
      return rejectWithValue("Authentication required. Please log in.");
    } else if (error.response?.status === 403) {
      return rejectWithValue("You don't have permission to delete this post.");
    } else if (error.response?.data?.error) {
      return rejectWithValue(error.response.data.error);
    } else {
      return rejectWithValue("Failed to delete post. Please try again.");
    }
  }
})

export const fetchUserPosts = createAsyncThunk("marketplace/fetchUserPosts", async (_, { rejectWithValue }) => {
  try {
    const response = await marketplaceAPI.getMyJobPosts()
    return response.data
  } catch (error) {
    if (error.response?.status === 401) {
      return rejectWithValue("Authentication required. Please log in.");
    } else if (error.response?.data?.error) {
      return rejectWithValue(error.response.data.error);
    } else {
      return rejectWithValue("Failed to fetch your posts. Please try again.");
    }
  }
})

const initialState = {
  posts: [],
  currentPost: null,
  userPosts: [],
  loading: false,
  error: null,
  filters: {
    category: "",
    priceRange: "",
    location: "",
    skills: [],
    sortBy: "newest",
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
  },
}

const marketplaceSlice = createSlice({
  name: "marketplace",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload
    },
    clearCurrentPost: (state) => {
      state.currentPost = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false
        // Handle different possible response structures
        if (Array.isArray(action.payload)) {
          state.posts = action.payload
        } else if (action.payload?.jobPosts && Array.isArray(action.payload.jobPosts)) {
          state.posts = action.payload.jobPosts
        } else if (action.payload?.availabilityPosts && Array.isArray(action.payload.availabilityPosts)) {
          state.posts = action.payload.availabilityPosts
        } else if (action.payload?.data && Array.isArray(action.payload.data)) {
          state.posts = action.payload.data
        } else if (action.payload?.posts && Array.isArray(action.payload.posts)) {
          state.posts = action.payload.posts
        } else {
          state.posts = []
        }
        // Update pagination from API response
        state.pagination = {
          currentPage: action.payload?.currentPage || 1,
          totalPages: action.payload?.totalPages || 1,
          totalPosts: action.payload?.totalCount || 0,
        }
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Fetch post by ID
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false
        state.currentPost = action.payload
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false
        state.posts.unshift(action.payload)
        state.userPosts.unshift(action.payload)
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
      // Fetch post by slug
      .addCase(fetchPostBySlug.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPostBySlug.fulfilled, (state, action) => {
        state.loading = false
        state.currentPost = action.payload
      })
      .addCase(fetchPostBySlug.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
      // Fetch posts by client
      .addCase(fetchPostsByClient.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPostsByClient.fulfilled, (state, action) => {
        state.loading = false
        state.posts = action.payload.posts || action.payload
      })
      .addCase(fetchPostsByClient.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
      // Update post
      .addCase(updatePost.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false
        const index = state.posts.findIndex((post) => post.jobId === action.payload.jobId)
        if (index !== -1) {
          state.posts[index] = action.payload
        }
        const userIndex = state.userPosts.findIndex((post) => post.jobId === action.payload.jobId)
        if (userIndex !== -1) {
          state.userPosts[userIndex] = action.payload
        }
        if (state.currentPost?.jobId === action.payload.jobId) {
          state.currentPost = action.payload
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false
        state.posts = state.posts.filter((post) => post.jobId !== action.payload)
        state.userPosts = state.userPosts.filter((post) => post.jobId !== action.payload)
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
      // Fetch user posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false
        state.userPosts = action.payload.posts || action.payload
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
  },
})

export const { setFilters, clearFilters, setCurrentPost, clearCurrentPost, clearError } = marketplaceSlice.actions
export default marketplaceSlice.reducer
