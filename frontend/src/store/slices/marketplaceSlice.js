import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import * as marketplaceAPI from "../api/marketplaceAPI"

// Async thunks for API calls
export const fetchPosts = createAsyncThunk("marketplace/fetchPosts", async (filters = {}) => {
  const response = await marketplaceAPI.getAllAvailabilityPosts(filters)
  return response.data
})

export const fetchPostById = createAsyncThunk("marketplace/fetchPostById", async (postId) => {
  const response = await marketplaceAPI.getAvailabilityPostById(postId)
  return response.data
})

export const createPost = createAsyncThunk(
  "marketplace/createPost", 
  async (postData, { rejectWithValue, getState }) => {
    try {
      const response = await marketplaceAPI.createAvailabilityPost(postData);
      return response.data;
    } catch (error) {
      // Handle different types of errors
      if (error.response?.status === 401) {
        return rejectWithValue("Authentication required. Please log in.");
      } else if (error.response?.status === 403) {
        return rejectWithValue("Only artists can create availability posts.");
      } else if (error.response?.data?.error) {
        return rejectWithValue(error.response.data.error);
      } else {
        return rejectWithValue("Failed to create post. Please try again.");
      }
    }
  }
);


export const updatePost = createAsyncThunk("marketplace/updatePost", async ({ postId, postData }) => {
  const response = await marketplaceAPI.updateAvailabilityPost(postId, postData)
  return response.data
})

export const deletePost = createAsyncThunk("marketplace/deletePost", async (postId) => {
  await marketplaceAPI.deleteAvailabilityPost(postId)
  return postId
})

export const fetchUserPosts = createAsyncThunk("marketplace/fetchUserPosts", async () => {
  const response = await marketplaceAPI.getMyAvailabilityPosts()
  return response.data
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
        state.posts = action.payload.posts || action.payload
        state.pagination = action.payload.pagination || state.pagination
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
        state.error = action.error.message
      })
      // Update post
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((post) => post.postId === action.payload.postId)
        if (index !== -1) {
          state.posts[index] = action.payload
        }
        const userIndex = state.userPosts.findIndex((post) => post.postId === action.payload.postId)
        if (userIndex !== -1) {
          state.userPosts[userIndex] = action.payload
        }
        if (state.currentPost?.postId === action.payload.postId) {
          state.currentPost = action.payload
        }
      })
      // Delete post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.postId !== action.payload)
        state.userPosts = state.userPosts.filter((post) => post.postId !== action.payload)
      })
      // Fetch user posts
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.userPosts = action.payload
      })
  },
})

export const { setFilters, clearFilters, setCurrentPost, clearCurrentPost, clearError } = marketplaceSlice.actions
export default marketplaceSlice.reducer
