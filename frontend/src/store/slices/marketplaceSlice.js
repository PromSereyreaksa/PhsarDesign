import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import categoryAPI from "../api/categoryAPI";
import * as marketplaceAPI from "../api/marketplaceAPI";

// Fetch posts with support for both job posts and availability posts
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

// Fetch post by ID with auto-detection of post type
export const fetchPostById = createAsyncThunk("marketplace/fetchPostById", async ({ postId, postType = "auto" }) => {
  // Validate postId
  console.log('fetchPostById called with raw input:', { postId, postType })
  
  if (!postId || postId === 'undefined' || postId === 'null') {
    console.error('Invalid post ID provided to fetchPostById:', postId)
    throw new Error('Invalid post ID provided')
  }
  
  console.log('fetchPostById proceeding with valid postId:', postId)
  
  // If postType is not specified, try availability post first, then job post
  if (postType === "auto") {
    try {
      console.log('Trying availability post API with ID:', postId)
      const response = await marketplaceAPI.getAvailabilityPostById(postId)
      console.log('Availability post API success:', response.data)
      return { ...response.data, postType: "availability" }
    } catch (availabilityError) {
      console.log('Availability post API failed:', availabilityError.message)
      try {
        console.log('Trying job post API with ID:', postId)
        const response = await marketplaceAPI.getJobPostById(postId)
        console.log('Job post API success:', response.data)
        return { ...response.data, postType: "job" }
      } catch (jobError) {
        console.log('Job post API also failed:', jobError.message)
        throw availabilityError // Return the first error
      }
    }
  } else if (postType === "availability") {
    console.log('Direct availability post API call with ID:', postId)
    const response = await marketplaceAPI.getAvailabilityPostById(postId)
    return { ...response.data, postType: "availability" }
  } else {
    console.log('Direct job post API call with ID:', postId)
    const response = await marketplaceAPI.getJobPostById(postId)
    return { ...response.data, postType: "job" }
  }
})

export const fetchPostBySlug = createAsyncThunk("marketplace/fetchPostBySlug", async (slug) => {
  const response = await marketplaceAPI.getJobPostBySlug(slug)
  return response.data
})

export const fetchPostsByClient = createAsyncThunk("marketplace/fetchPostsByClient", async (clientId) => {
  const response = await marketplaceAPI.getJobPostByClient(clientId)
  return response.data
})

// Create post with support for both job posts and availability posts
export const createPost = createAsyncThunk(
  "marketplace/createPost", 
  async (postData, { rejectWithValue, getState }) => {
    try {
      let response
      
      // Handle FormData vs regular object
      let postType
      if (postData instanceof FormData) {
        postType = postData.get("postType")
      } else {
        postType = postData.postType
      }
      
      console.log("=== REDUX CREATE POST DEBUG ===")
      console.log("postType extracted:", postType)
      console.log("postData instanceof FormData:", postData instanceof FormData)
      
      if (postType === "job") {
        console.log("Creating job post via jobPostsAPI.create")
        response = await marketplaceAPI.jobPostsAPI.create(postData)
      } else {
        console.log("Creating availability post via availabilityPostsAPI.create")
        response = await marketplaceAPI.availabilityPostsAPI.create(postData)
      }
      
      return response.data
    } catch (error) {
      console.error("=== REDUX CREATE POST ERROR ===")
      console.error("Error:", error)
      console.error("Error response:", error.response)
      
      // Handle different types of errors
      if (error.response?.status === 401) {
        return rejectWithValue("Authentication required. Please log in.")
      } else if (error.response?.status === 403) {
        return rejectWithValue("You don't have permission to create posts.")
      } else if (error.response?.data?.error) {
        return rejectWithValue(error.response.data.error)
      } else {
        return rejectWithValue("Failed to create post. Please try again.")
      }
    }
  }
)

// Update post with support for both post types
export const updatePost = createAsyncThunk("marketplace/updatePost", async ({ postId, postData, postType }, { rejectWithValue }) => {
  try {
    let response
    if (postType === "availability") {
      response = await marketplaceAPI.updateAvailabilityPost(postId, postData)
    } else {
      response = await marketplaceAPI.updateJobPost(postId, postData)
    }
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

// Delete post with support for both post types
export const deletePost = createAsyncThunk("marketplace/deletePost", async ({ postId, postType }, { rejectWithValue }) => {
  try {
    if (postType === "availability") {
      await marketplaceAPI.deleteAvailabilityPost(postId)
    } else {
      await marketplaceAPI.deleteJobPost(postId)
    }
    return { postId, postType }
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

// Fetch user posts for both job posts and availability posts
export const fetchUserPosts = createAsyncThunk("marketplace/fetchUserPosts", async (_, { rejectWithValue }) => {
  try {
    // Fetch both availability posts and job posts
    const [availabilityResponse, jobResponse] = await Promise.allSettled([
      marketplaceAPI.getMyAvailabilityPosts(),
      marketplaceAPI.getMyJobPosts()
    ])
    
    console.log('API Responses:', { availabilityResponse, jobResponse })
    
    const availabilityPosts = availabilityResponse.status === 'fulfilled' 
      ? (availabilityResponse.value.data || []).map(post => {
          console.log('Availability post structure:', post)
          console.log('Availability post ID fields:', {
            postId: post.postId,
            id: post.id,
            jobId: post.jobId,
            _id: post._id
          })
          return { ...post, postType: 'availability' }
        })
      : []
    
    const jobPosts = jobResponse.status === 'fulfilled' 
      ? (jobResponse.value.data || []).map(post => {
          console.log('Job post structure:', post)
          console.log('Job post ID fields:', {
            postId: post.postId,
            id: post.id,
            jobId: post.jobId,
            _id: post._id
          })
          return { ...post, postType: 'job' }
        })
      : []
    
    const allPosts = [...availabilityPosts, ...jobPosts]
    console.log('Combined posts:', allPosts)
    console.log('Combined posts ID summary:', allPosts.map(post => ({
      postId: post.postId,
      id: post.id,
      jobId: post.jobId,
      title: post.title,
      postType: post.postType
    })))
    
    return allPosts
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

// Category async thunks
export const fetchCategories = createAsyncThunk(
  "marketplace/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryAPI.getAllCategories();
      console.log("📂 Fetched categories:", response);
      return response;
    } catch (error) {
      console.error("❌ Failed to fetch categories:", error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  "marketplace/fetchCategoryById",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await categoryAPI.getCategoryById(categoryId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch category');
    }
  }
);

export const filterCategories = createAsyncThunk(
  "marketplace/filterCategories",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await categoryAPI.filterCategories(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to filter categories');
    }
  }
);

const initialState = {
  // Posts state
  posts: [],
  currentPost: null,
  userPosts: [],
  loading: false,
  error: null,
  filters: {
    category: "",
    section: "",
    search: "",
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
  
  // Categories state
  categories: [],
  filteredCategories: [],
  currentCategory: null,
  categoriesLoading: false,
  categoriesError: null,
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
    
    // Category reducers
    clearCategoriesError: (state) => {
      state.categoriesError = null
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null
    },
    setFilteredCategories: (state, action) => {
      state.filteredCategories = action.payload
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
        const updatedPost = action.payload
        const postId = updatedPost.postId || updatedPost.jobId || updatedPost.id
        
        // Update in posts array
        const index = state.posts.findIndex((post) => {
          const id = post.postId || post.jobId || post.id
          return id === postId
        })
        if (index !== -1) {
          state.posts[index] = updatedPost
        }
        
        // Update in userPosts array
        const userIndex = state.userPosts.findIndex((post) => {
          const id = post.postId || post.jobId || post.id
          return id === postId
        })
        if (userIndex !== -1) {
          state.userPosts[userIndex] = updatedPost
        }
        
        // Update currentPost if it matches
        const currentPostId = state.currentPost?.postId || state.currentPost?.jobId || state.currentPost?.id
        if (currentPostId === postId) {
          state.currentPost = updatedPost
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
        const { postId } = action.payload
        // Remove from both posts and userPosts arrays
        state.posts = state.posts.filter((post) => {
          const id = post.postId || post.jobId || post.id
          return id !== postId
        })
        state.userPosts = state.userPosts.filter((post) => {
          const id = post.postId || post.jobId || post.id
          return id !== postId
        })
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
      
      // Categories cases
      // Fetch all categories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true
        state.categoriesError = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false
        state.categories = action.payload
        state.categoriesError = null
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false
        state.categoriesError = action.payload
      })
      
      // Fetch category by ID
      .addCase(fetchCategoryById.pending, (state) => {
        state.categoriesLoading = true
        state.categoriesError = null
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.categoriesLoading = false
        state.currentCategory = action.payload
        state.categoriesError = null
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.categoriesLoading = false
        state.categoriesError = action.payload
      })
      
      // Filter categories
      .addCase(filterCategories.pending, (state) => {
        state.categoriesLoading = true
        state.categoriesError = null
      })
      .addCase(filterCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false
        state.filteredCategories = action.payload
        state.categoriesError = null
      })
      .addCase(filterCategories.rejected, (state, action) => {
        state.categoriesLoading = false
        state.categoriesError = action.payload
      })
  },
})

export const { 
  setFilters, 
  clearFilters, 
  setCurrentPost, 
  clearCurrentPost, 
  clearError,
  // Category actions
  clearCategoriesError,
  clearCurrentCategory,
  setFilteredCategories
} = marketplaceSlice.actions

export default marketplaceSlice.reducer