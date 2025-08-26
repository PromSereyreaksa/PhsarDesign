import axios from "axios"
import store from "../store"
import { loginSuccess, logout } from "../slices/authSlice"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/"

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    const state = store.getState()
    const token = state.auth.token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 (Unauthorized) - token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, { withCredentials: true })

        if (refreshResponse.data.token) {
          // Update Redux store
          const state = store.getState()
          const user = state.auth.user

          store.dispatch(loginSuccess({ user, token: refreshResponse.data.token }))

          // Retry with new token
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        const state = store.getState()
        if (state.auth.isAuthenticated) {
          store.dispatch(logout())
        }
        return Promise.reject(refreshError)
      }
    }

    if (error.response?.status === 403) {
      const endpoint = error.config?.url || "unknown endpoint"
      console.log(`[v0] 403 Forbidden - User lacks permission for: ${endpoint}`)

      // Don't logout on 403, just reject with a clear message
      const enhancedError = new Error(`Access denied: You don't have permission to access this resource`)
      enhancedError.status = 403
      enhancedError.endpoint = endpoint
      enhancedError.originalError = error
      return Promise.reject(enhancedError)
    }

    return Promise.reject(error)
  },
)

// ========== STRUCTURED API OBJECTS ==========

// Availability Posts API (Artist Posts)
export const availabilityPostsAPI = {
  getAll: (params) => api.get("/api/availability-posts", { params }),
  getById: (id) => api.get(`/api/availability-posts/id/${id}`),
  getBySlug: (slug) => api.get(`/api/availability-posts/${slug}`),
  getByArtist: (artistId, params) => api.get(`/api/availability-posts/artist/${artistId}`, { params }),
  getMyPosts: (params) => api.get("/api/availability-posts/my-posts", { params }),
  search: (params) => api.get("/api/availability-posts/search", { params }),
  create: (postData) => {
    const isFormData = typeof FormData !== "undefined" && postData instanceof FormData
    return api.post(
      "/api/availability-posts",
      postData,
      isFormData ? { headers: { "Content-Type": undefined } } : undefined,
    )
  },
  update: (id, postData) => {
    const isFormData = typeof FormData !== "undefined" && postData instanceof FormData
    return api.patch(
      `/api/availability-posts/id/${id}`,
      postData,
      isFormData ? { headers: { "Content-Type": undefined } } : undefined,
    )
  },
  updateBySlug: (slug, postData) => {
    const isFormData = typeof FormData !== "undefined" && postData instanceof FormData
    return api.patch(
      `/api/availability-posts/${slug}`,
      postData,
      isFormData ? { headers: { "Content-Type": undefined } } : undefined,
    )
  },
  delete: (id) => api.delete(`/api/availability-posts/id/${id}`),
  deleteBySlug: (slug) => api.delete(`/api/availability-posts/${slug}`),
}

// Job Posts API (Client Jobs)
export const jobPostsAPI = {
  getAll: (params) => api.get("/api/job-posts", { params }),
  getById: (id) => api.get(`/api/job-posts/id/${id}`),
  getBySlug: (slug) => api.get(`/api/job-posts/${slug}`),
  getByClient: (clientId) => api.get(`/api/job-posts/client/${clientId}`),
  getMyPosts: (params) => api.get("/api/job-posts/my-posts", { params }),
  search: (params) => api.get("/api/job-posts/search", { params }),
  create: (postData) => {
    const isFormData = typeof FormData !== "undefined" && postData instanceof FormData
    return api.post("/api/job-posts", postData, isFormData ? { headers: { "Content-Type": undefined } } : undefined)
  },
  update: (id, postData) => {
    const isFormData = typeof FormData !== "undefined" && postData instanceof FormData
    return api.patch(
      `/api/job-posts/id/${id}`,
      postData,
      isFormData ? { headers: { "Content-Type": undefined } } : undefined,
    )
  },
  updateBySlug: (slug, postData) => {
    const isFormData = typeof FormData !== "undefined" && postData instanceof FormData
    return api.patch(
      `/api/job-posts/${slug}`,
      postData,
      isFormData ? { headers: { "Content-Type": undefined } } : undefined,
    )
  },
  delete: (id) => api.delete(`/api/job-posts/id/${id}`),
  deleteBySlug: (slug) => api.delete(`/api/job-posts/${slug}`),
  apply: (jobId, applicationData) => api.post(`/api/job-posts/id/${jobId}/apply`, applicationData),
}

// Availability Posts API endpoints
export const getAllAvailabilityPosts = (filters = {}) => {
  const params = new URLSearchParams()

  // Parse price range into minBudget and maxBudget
  let minBudget, maxBudget
  if (filters.priceRange) {
    if (filters.priceRange === "0-50") {
      minBudget = 0
      maxBudget = 50
    } else if (filters.priceRange === "50-200") {
      minBudget = 50
      maxBudget = 200
    } else if (filters.priceRange === "200-500") {
      minBudget = 200
      maxBudget = 500
    } else if (filters.priceRange === "500+") {
      minBudget = 500
    }
  }

  // Map frontend filter names to backend expected parameters
  const paramMapping = {
    category: filters.category,
    availabilityType: filters.availabilityType,
    location: filters.location,
    search: filters.search || filters.q, // Support both search and q
    minBudget: filters.minBudget || minBudget,
    maxBudget: filters.maxBudget || maxBudget,
    skills: filters.skills,
    isActive: filters.isActive !== undefined ? filters.isActive : true,
    page: filters.page || 1,
    limit: filters.limit || 10,
    sortBy:
      filters.sortBy === "newest"
        ? "createdAt"
        : filters.sortBy === "oldest"
          ? "createdAt"
          : filters.sortBy || "createdAt",
    sortOrder: filters.sortBy === "newest" ? "DESC" : filters.sortBy === "oldest" ? "ASC" : filters.sortOrder || "DESC",
  }

  Object.entries(paramMapping).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v))
      } else {
        params.append(key, value)
      }
    }
  })

  return api.get(`/api/availability-posts?${params.toString()}`)
}

// Job Posts API endpoints
export const getAllJobPosts = (filters = {}) => {
  const params = new URLSearchParams()

  // Parse price range into minBudget and maxBudget
  let minBudget, maxBudget
  if (filters.priceRange) {
    if (filters.priceRange === "0-50") {
      minBudget = 0
      maxBudget = 50
    } else if (filters.priceRange === "50-200") {
      minBudget = 50
      maxBudget = 200
    } else if (filters.priceRange === "200-500") {
      minBudget = 200
      maxBudget = 500
    } else if (filters.priceRange === "500+") {
      minBudget = 500
    }
  }

  // Map frontend filter names to backend expected parameters
  const paramMapping = {
    category: filters.category,
    location: filters.location,
    search: filters.search || filters.q, // Support both search and q
    minBudget: filters.minBudget || minBudget,
    maxBudget: filters.maxBudget || maxBudget,
    skills: filters.skills,
    isActive: filters.isActive !== undefined ? filters.isActive : true,
    page: filters.page || 1,
    limit: filters.limit || 10,
    sortBy:
      filters.sortBy === "newest"
        ? "createdAt"
        : filters.sortBy === "oldest"
          ? "createdAt"
          : filters.sortBy || "createdAt",
    sortOrder: filters.sortBy === "newest" ? "DESC" : filters.sortBy === "oldest" ? "ASC" : filters.sortOrder || "DESC",
  }

  Object.entries(paramMapping).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v))
      } else {
        params.append(key, value)
      }
    }
  })

  return api.get(`/api/job-posts?${params.toString()}`)
}

export const getJobPostByClient = (clientId) => {
  return api.get(`/api/job-posts/client/${clientId}`)
}

export const getJobPostById = (jobId) => {
  return api.get(`/api/job-posts/id/${jobId}`)
}

export const getJobPostBySlug = (slug) => {
  return api.get(`/api/job-posts/${slug}`)
}

export const createJobPost = (postData) => {
  const isFormData = typeof FormData !== "undefined" && postData instanceof FormData
  return api.post("/api/job-posts", postData, isFormData ? { headers: { "Content-Type": undefined } } : undefined)
}

export const updateJobPost = (jobId, postData) => {
  const isFormData = typeof FormData !== "undefined" && postData instanceof FormData
  return api.put(
    `/api/job-posts/id/${jobId}`,
    postData,
    isFormData ? { headers: { "Content-Type": undefined } } : undefined,
  )
}

export const deleteJobPost = (jobId) => {
  return api.delete(`/api/job-posts/${jobId}`)
}

export const getMyJobPosts = () => {
  return api.get("/api/job-posts/my")
}

export const uploadImages = (files) => {
  const formData = new FormData()
  files.forEach((file, index) => {
    formData.append("attachments", file)
  })

  return api.post("/api/upload/images", formData, {
    headers: { "Content-Type": undefined },
  })
}

export const contactArtistFromPost = (jobId, message) => {
  return api.post(`/api/job-posts/id/${jobId}/contact`, { message })
}

// ========== CONVENIENCE EXPORTS FOR AVAILABILITY POSTS ==========
export const createAvailabilityPost = (postData) => availabilityPostsAPI.create(postData)
export const updateAvailabilityPost = (id, postData) => availabilityPostsAPI.update(id, postData)
export const deleteAvailabilityPost = (id) => availabilityPostsAPI.delete(id)
export const getAvailabilityPostById = (id) => {
  console.log("getAvailabilityPostById called with id:", id)
  console.log("Making API call to:", `/api/availability-posts/id/${id}`)
  return availabilityPostsAPI.getById(id)
}
export const getAvailabilityPostBySlug = (slug) => availabilityPostsAPI.getBySlug(slug)
export const getMyAvailabilityPosts = (params) => availabilityPostsAPI.getMyPosts(params)
