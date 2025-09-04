import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import categoryAPI from "../api/categoryAPI"
import * as marketplaceAPI from "../api/marketplaceAPI"

// Fetch posts with support for both job posts and availability posts
export const fetchPosts = createAsyncThunk("marketplace/fetchPosts", async (filters = {}) => {
  console.log("🔍 Fetching posts with filters:", filters)

  // Extract pagination parameters
  const { page = 1, limit = 6, ...otherFilters } = filters // Changed from 9 to 6 for marketplace
  const paginatedFilters = { ...otherFilters, page, limit }

  // Determine which API to call based on section filter
  const section = filters.section || "services"
  let response

  if (section === "jobs") {
    // Call job posts API for jobs section
    response = await marketplaceAPI.getAllJobPosts(paginatedFilters)
  } else {
    // Call availability posts API for services section
    response = await marketplaceAPI.getAllAvailabilityPosts(paginatedFilters)
  }

  console.log("📡 API Response:", response)
  console.log("📦 Response data:", response.data)
  return { ...response.data, section }
})

// Fetch post by ID with auto-detection of post type
export const fetchPostById = createAsyncThunk("marketplace/fetchPostById", async ({ postId, postType = "auto" }) => {
  // Validate postId
  console.log("fetchPostById called with raw input:", { postId, postType })

  if (!postId || postId === "undefined" || postId === "null") {
    console.error("Invalid post ID provided to fetchPostById:", postId)
    throw new Error("Invalid post ID provided")
  }

  console.log("fetchPostById proceeding with valid postId:", postId)

  // If postType is not specified, try availability post first, then job post
  if (postType === "auto") {
    try {
      console.log("Trying availability post API with ID:", postId)
      const response = await marketplaceAPI.getAvailabilityPostById(postId)
      console.log("Availability post API success:", response.data)
      return { ...response.data, postType: "availability" }
    } catch (availabilityError) {
      console.log("Availability post API failed:", availabilityError.message)
      try {
        console.log("Trying job post API with ID:", postId)
        const response = await marketplaceAPI.getJobPostById(postId)
        console.log("Job post API success:", response.data)
        return { ...response.data, postType: "job" }
      } catch (jobError) {
        console.log("Job post API also failed:", jobError.message)
        throw availabilityError // Return the first error
      }
    }
  } else if (postType === "availability") {
    console.log("Direct availability post API call with ID:", postId)
    const response = await marketplaceAPI.getAvailabilityPostById(postId)
    return { ...response.data, postType: "availability" }
  } else {
    console.log("Direct job post API call with ID:", postId)
    const response = await marketplaceAPI.getJobPostById(postId)
    return { ...response.data, postType: "job" }
  }
})

export const fetchPostBySlug = createAsyncThunk("marketplace/fetchPostBySlug", async (slug) => {
  // Try to find in both availability posts (services) first, then job posts
  try {
    console.log('Trying availability post API with slug:', slug)
    const response = await marketplaceAPI.getAvailabilityPostBySlug(slug)
    console.log('Availability post API success:', response.data)
    return { ...response.data, postType: "availability" }
  } catch (availabilityError) {
    console.log('Availability post API failed:', availabilityError.message)
    try {
      console.log('Trying job post API with slug:', slug)
      const response = await marketplaceAPI.getJobPostBySlug(slug)
      console.log('Job post API success:', response.data)
      return { ...response.data, postType: "job" }
    } catch (jobError) {
      console.log('Job post API also failed:', jobError.message)
      throw availabilityError // Return the first error
    }
  }
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

      // Handle FormData vs regular object - default to availability post if no type specified
      let postType
      if (postData instanceof FormData) {
        postType = postData.get("postType") || "availability"
      } else {
        postType = postData.postType || "availability"
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

      console.log("=== POST CREATION SUCCESS ===")
      console.log("Response:", response)
      console.log("Response data:", response.data)

      // Ensure we return the correct data structure
      const createdPost = {
        ...response.data,
        postType: postType
      }

      return createdPost
    } catch (error) {
      console.error("=== REDUX CREATE POST ERROR ===")
      console.error("Error:", error)
      console.error("Error response:", error.response)
      console.error("Error response data:", error.response?.data)

      // Handle different types of errors with specific messages
      if (error.response?.status === 401) {
        return rejectWithValue("Authentication required. Please log in.")
      } else if (error.response?.status === 403) {
        return rejectWithValue("You don't have permission to create posts.")
      } else if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || "Invalid data provided."
        return rejectWithValue(errorMessage)
      } else if (error.response?.status === 422) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || "Validation failed."
        return rejectWithValue(errorMessage)
      } else if (error.response?.data?.error) {
        return rejectWithValue(error.response.data.error)
      } else if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message)
      } else if (error.message) {
        return rejectWithValue(error.message)
      } else {
        return rejectWithValue("Failed to create post. Please try again.")
      }
    }
  },
)

// Update post with support for both post types
export const updatePost = createAsyncThunk(
  "marketplace/updatePost",
  async ({ postId, postData, postType }, { rejectWithValue }) => {
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
        return rejectWithValue("Authentication required. Please log in.")
      } else if (error.response?.status === 403) {
        return rejectWithValue("You don't have permission to update this post.")
      } else if (error.response?.data?.error) {
        return rejectWithValue(error.response.data.error)
      } else {
        return rejectWithValue("Failed to update post. Please try again.")
      }
    }
  },
)

// Delete post with support for both post types
export const deletePost = createAsyncThunk(
  "marketplace/deletePost",
  async ({ postId, postType }, { rejectWithValue }) => {
    try {
      if (postType === "availability") {
        await marketplaceAPI.deleteAvailabilityPost(postId)
      } else {
        await marketplaceAPI.deleteJobPost(postId)
      }
      return { postId, postType }
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue("Authentication required. Please log in.")
      } else if (error.response?.status === 403) {
        return rejectWithValue("You don't have permission to delete this post.")
      } else if (error.response?.data?.error) {
        return rejectWithValue(error.response.data.error)
      } else {
        return rejectWithValue("Failed to delete post. Please try again.")
      }
    }
  },
)

// Fetch user posts for both job posts and availability posts
export const fetchUserPosts = createAsyncThunk("marketplace/fetchUserPosts", async (_, { rejectWithValue }) => {
  try {
    console.log("[v0] Starting fetchUserPosts - attempting to fetch both availability and job posts")

    // Fetch both availability posts and job posts
    const [availabilityResponse, jobResponse] = await Promise.allSettled([
      marketplaceAPI.getMyAvailabilityPosts(),
      marketplaceAPI.getMyJobPosts(),
    ])

    console.log("[v0] API Responses:", { availabilityResponse, jobResponse })

    let availabilityPosts = []
    let jobPosts = []

    // Handle availability posts response
    if (availabilityResponse.status === "fulfilled") {
      availabilityPosts = (availabilityResponse.value.data || []).map((post) => {
        console.log("[v0] Processing availability post:", post)
        return { ...post, postType: "availability" }
      })
      console.log("[v0] Successfully loaded", availabilityPosts.length, "availability posts")
    } else {
      const error = availabilityResponse.reason
      if (error?.response?.status === 403) {
        console.log("[v0] 403 Forbidden for availability posts - user may not have artist permissions")
      } else if (error?.response?.status === 401) {
        console.log("[v0] 401 Unauthorized for availability posts - authentication issue")
      } else {
        console.error("[v0] Availability posts fetch failed:", error?.message || error)
      }
    }

    // Handle job posts response
    if (jobResponse.status === "fulfilled") {
      jobPosts = (jobResponse.value.data || []).map((post) => {
        console.log("[v0] Processing job post:", post)
        return { ...post, postType: "job" }
      })
      console.log("[v0] Successfully loaded", jobPosts.length, "job posts")
    } else {
      const error = jobResponse.reason
      if (error?.response?.status === 403) {
        console.log("[v0] 403 Forbidden for job posts - user may not have client permissions")
      } else if (error?.response?.status === 401) {
        console.log("[v0] 401 Unauthorized for job posts - authentication issue")
      } else {
        console.error("[v0] Job posts fetch failed:", error?.message || error)
      }
    }

    const allPosts = [...availabilityPosts, ...jobPosts]
    console.log("[v0] Combined posts total:", allPosts.length)

    // If both requests failed with auth errors, handle appropriately
    if (availabilityResponse.status === "rejected" && jobResponse.status === "rejected") {
      const availabilityError = availabilityResponse.reason
      const jobError = jobResponse.reason

      if (availabilityError?.response?.status === 401 || jobError?.response?.status === 401) {
        return rejectWithValue("Authentication required. Please log in again.")
      } else if (availabilityError?.response?.status === 403 && jobError?.response?.status === 403) {
        console.log("[v0] User lacks permissions for both post types - returning empty array")
        return []
      }
    }

    return allPosts
  } catch (error) {
    console.error("[v0] fetchUserPosts unexpected error:", error)
    if (error.response?.status === 401) {
      return rejectWithValue("Authentication required. Please log in.")
    } else if (error.response?.status === 403) {
      console.log("[v0] 403 error in fetchUserPosts - returning empty posts array")
      return []
    } else if (error.response?.data?.error) {
      return rejectWithValue(error.response.data.error)
    } else {
      return rejectWithValue("Failed to fetch your posts. Please try again.")
    }
  }
})

// Category async thunks
export const fetchCategories = createAsyncThunk("marketplace/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const response = await categoryAPI.getAllCategories()
    console.log("📂 Fetched categories:", response)
    return response
  } catch (error) {
    console.error("❌ Failed to fetch categories:", error)
    return rejectWithValue(error.response?.data?.message || "Failed to fetch categories")
  }
})

export const fetchCategoryById = createAsyncThunk(
  "marketplace/fetchCategoryById",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await categoryAPI.getCategoryById(categoryId)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch category")
    }
  },
)

export const filterCategories = createAsyncThunk(
  "marketplace/filterCategories",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await categoryAPI.filterCategories(filters)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to filter categories")
    }
  },
)

// Category-specific post fetching with pagination
export const fetchAvailabilityPostsByCategory = createAsyncThunk(
  "marketplace/fetchAvailabilityPostsByCategory", 
  async ({ categoryId, filters = {} }, { rejectWithValue }) => {
    try {
      console.log("🎯 Fetching availability posts for category:", categoryId, "with filters:", filters)
      const response = await marketplaceAPI.getAvailabilityPostsByCategory(categoryId, filters)
      console.log("📡 Category availability posts response:", response)
      return { ...response, categoryId, filters }
    } catch (error) {
      console.error("❌ Failed to fetch availability posts by category:", error)
      return rejectWithValue(error.response?.data?.message || "Failed to fetch posts for this category")
    }
  }
)

export const fetchJobPostsByCategory = createAsyncThunk(
  "marketplace/fetchJobPostsByCategory", 
  async ({ categoryId, filters = {} }, { rejectWithValue }) => {
    try {
      console.log("🎯 Fetching job posts for category:", categoryId, "with filters:", filters)
      const response = await marketplaceAPI.getJobPostsByCategory(categoryId, filters)
      console.log("📡 Category job posts response:", response)
      return { ...response, categoryId, filters }
    } catch (error) {
      console.error("❌ Failed to fetch job posts by category:", error)
      return rejectWithValue(error.response?.data?.message || "Failed to fetch posts for this category")
    }
  }
)

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
    totalCount: 0,
    limit: 6, // Changed from 9 to 6 for marketplace
    isLoading: false,
  },

  // Categories state
  categories: [],
  filteredCategories: [],
  currentCategory: null,
  categoriesLoading: false,
  categoriesError: null,

  // Category posts state
  categoryPosts: {
    availability: {
      posts: [],
      loading: false,
      error: null,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 9, // Changed from 10 to 9 for category pages
      },
    },
    jobs: {
      posts: [],
      loading: false,
      error: null,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 9, // Changed from 10 to 9 for category pages
      },
    },
    currentCategoryId: null,
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
    
    // Pagination actions
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload
    },
    setPaginationLoading: (state, action) => {
      state.pagination.isLoading = action.payload
    },
    resetPagination: (state) => {
      state.pagination = initialState.pagination
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

    // Category posts actions
    setCategoryPostsPage: (state, action) => {
      const { postType, page } = action.payload
      console.log(`🚨 [REDUX] setCategoryPostsPage called:`, { postType, page });
      console.log(`🚨 [REDUX] Before update - ${postType} current page:`, state.categoryPosts[postType]?.pagination?.currentPage);
      
      if (state.categoryPosts[postType]) {
        state.categoryPosts[postType].pagination.currentPage = page
        console.log(`🚨 [REDUX] After update - ${postType} current page:`, state.categoryPosts[postType].pagination.currentPage);
      } else {
        console.error(`🚨 [REDUX] ERROR: postType "${postType}" not found in categoryPosts`);
      }
    },
    clearCategoryPosts: (state) => {
      console.log("🧹 [REDUX] clearCategoryPosts called - clearing all posts");
      state.categoryPosts.availability.posts = []
      state.categoryPosts.jobs.posts = []
      state.categoryPosts.availability.error = null
      state.categoryPosts.jobs.error = null
      state.categoryPosts.currentCategoryId = null
    },
    setCategoryPostsLimit: (state, action) => {
      const { postType, limit } = action.payload
      if (state.categoryPosts[postType]) {
        state.categoryPosts[postType].pagination.limit = limit
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true
        state.pagination.isLoading = true
        state.error = null
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false
        state.pagination.isLoading = false
        
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
          ...state.pagination,
          currentPage: action.payload?.currentPage || action.payload?.page || 1,
          totalPages: action.payload?.totalPages || Math.ceil((action.payload?.totalCount || state.posts.length) / state.pagination.limit),
          totalCount: action.payload?.totalCount || action.payload?.total || state.posts.length,
          isLoading: false
        }
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false
        state.pagination.isLoading = false
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
        state.error = action.error.message
      })
      
      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading = true
        state.error = null
        console.log("🔄 Post creation started...")
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        console.log("✅ Post creation successful:", action.payload)
        
        // Add the new post to the beginning of the posts array
        state.posts.unshift(action.payload)
        
        // Also add to userPosts if it exists
        state.userPosts.unshift(action.payload)
        
        // Update pagination count
        state.pagination.totalCount += 1
        // Recalculate total pages
        state.pagination.totalPages = Math.ceil(state.pagination.totalCount / state.pagination.limit)
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
        console.error("❌ Post creation failed:", action.payload || action.error.message)
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
        // Ensure we always have a valid array
        const categoriesData = action.payload?.categories || action.payload?.data || action.payload;
        state.categories = Array.isArray(categoriesData) ? categoriesData : [];
        state.categoriesError = null
        console.log("📂 Categories loaded successfully:", {
          count: state.categories.length,
          sample: state.categories.slice(0, 3).map(cat => ({ id: cat.id || cat._id, name: cat.name }))
        });
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false
        state.categoriesError = action.payload
        // Don't clear existing categories on error - keep them if we have them
        console.error("❌ Categories fetch failed:", action.payload);
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

      // Fetch availability posts by category
      .addCase(fetchAvailabilityPostsByCategory.pending, (state, action) => {
        state.categoryPosts.availability.loading = true
        state.categoryPosts.availability.error = null
        state.categoryPosts.currentCategoryId = action.meta.arg.categoryId
      })
      .addCase(fetchAvailabilityPostsByCategory.fulfilled, (state, action) => {
        state.categoryPosts.availability.loading = false
        
        // Extract posts from the correct nested structure
        const posts = action.payload.data?.posts || action.payload.posts || []
        
        state.categoryPosts.availability.posts = posts
        state.categoryPosts.availability.pagination = {
          ...state.categoryPosts.availability.pagination,
          currentPage: action.payload.data?.currentPage || action.payload.currentPage || action.payload.page || 1,
          totalPages: action.payload.data?.totalPages || action.payload.totalPages || Math.ceil((action.payload.data?.totalCount || action.payload.totalCount || 0) / (action.payload.data?.limit || action.payload.limit || 9)),
          totalCount: action.payload.data?.totalCount || action.payload.totalCount || 0,
          limit: action.payload.data?.limit || action.payload.limit || 9,
        }
        state.categoryPosts.availability.error = null
      })
      .addCase(fetchAvailabilityPostsByCategory.rejected, (state, action) => {
        state.categoryPosts.availability.loading = false
        state.categoryPosts.availability.error = action.payload
        state.categoryPosts.availability.posts = []
      })

      // Fetch job posts by category  
      .addCase(fetchJobPostsByCategory.pending, (state, action) => {
        state.categoryPosts.jobs.loading = true
        state.categoryPosts.jobs.error = null
        state.categoryPosts.currentCategoryId = action.meta.arg.categoryId
      })
      .addCase(fetchJobPostsByCategory.fulfilled, (state, action) => {
        state.categoryPosts.jobs.loading = false
        
        // Extract posts from the correct nested structure
        const posts = action.payload.data?.posts || action.payload.posts || []
        
        state.categoryPosts.jobs.posts = posts
        state.categoryPosts.jobs.pagination = {
          ...state.categoryPosts.jobs.pagination,
          currentPage: action.payload.data?.currentPage || action.payload.currentPage || action.payload.page || 1,
          totalPages: action.payload.data?.totalPages || action.payload.totalPages || Math.ceil((action.payload.data?.totalCount || action.payload.totalCount || 0) / (action.payload.data?.limit || action.payload.limit || 9)),
          totalCount: action.payload.data?.totalCount || action.payload.totalCount || 0,
          limit: action.payload.data?.limit || action.payload.limit || 9,
        }
        state.categoryPosts.jobs.error = null
      })
      .addCase(fetchJobPostsByCategory.rejected, (state, action) => {
        state.categoryPosts.jobs.loading = false
        state.categoryPosts.jobs.error = action.payload
        state.categoryPosts.jobs.posts = []
      })
  },
})

export const {
  setFilters,
  clearFilters,
  setCurrentPost,
  clearCurrentPost,
  clearError,
  // Pagination actions
  setCurrentPage,
  setPaginationLoading,
  resetPagination,
  // Category actions
  clearCategoriesError,
  clearCurrentCategory,
  setFilteredCategories,
  // Category posts actions
  setCategoryPostsPage,
  clearCategoryPosts,
  setCategoryPostsLimit,
} = marketplaceSlice.actions

// Selectors for category posts
export const selectCategoryAvailabilityPosts = (state) => state.marketplace.categoryPosts.availability.posts
export const selectCategoryJobPosts = (state) => state.marketplace.categoryPosts.jobs.posts
export const selectCategoryAvailabilityLoading = (state) => state.marketplace.categoryPosts.availability.loading
export const selectCategoryJobLoading = (state) => state.marketplace.categoryPosts.jobs.loading
export const selectCategoryAvailabilityError = (state) => state.marketplace.categoryPosts.availability.error
export const selectCategoryJobError = (state) => state.marketplace.categoryPosts.jobs.error
export const selectCategoryAvailabilityPagination = (state) => state.marketplace.categoryPosts.availability.pagination
export const selectCategoryJobPagination = (state) => state.marketplace.categoryPosts.jobs.pagination
export const selectCurrentCategoryId = (state) => state.marketplace.categoryPosts.currentCategoryId

export default marketplaceSlice.reducer
