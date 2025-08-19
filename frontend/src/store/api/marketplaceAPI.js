import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/"

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests


// 1. Request interceptor → attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken") 
               || localStorage.getItem("token") 
               || sessionStorage.getItem("authToken") 
               || sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response interceptor → refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (refreshResponse.data.token) {
          // Update Redux store
          const state = store.getState();
          const user = state.auth.user;

          store.dispatch(
            loginSuccess({ user, token: refreshResponse.data.token })
          );

          // Retry with new token
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        const state = store.getState();
        if (state.auth.isAuthenticated) {
          store.dispatch(logout());
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

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
    sortBy: filters.sortBy === 'newest' ? 'createdAt' : (filters.sortBy === 'oldest' ? 'createdAt' : (filters.sortBy || 'createdAt')),
    sortOrder: filters.sortBy === 'newest' ? 'DESC' : (filters.sortBy === 'oldest' ? 'ASC' : (filters.sortOrder || 'DESC'))
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

export const searchAvailabilityPosts = (filters = {}) => {
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
    sortBy: filters.sortBy === 'newest' ? 'createdAt' : (filters.sortBy === 'oldest' ? 'createdAt' : (filters.sortBy || 'createdAt')),
    sortOrder: filters.sortBy === 'newest' ? 'DESC' : (filters.sortBy === 'oldest' ? 'ASC' : (filters.sortOrder || 'DESC'))
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
  
  return api.get(`/api/availability-posts/search?${params.toString()}`)
}

export const getAvailabilityPostsByArtist = (artistId) => {
  return api.get(`/api/availability-posts/artist/${artistId}`)
}

export const getAvailabilityPostById = (postId) => {
  return api.get(`/api/availability-posts/id/${postId}`)
}

export const getAvailabilityPostBySlug = (slug) => {
  return api.get(`/api/availability-posts/${slug}`)
}

export const createAvailabilityPost = (postData) => {
  const isFormData = typeof FormData !== 'undefined' && postData instanceof FormData;
  return api.post(
    "/api/availability-posts",
    postData,
    isFormData
      ? { headers: { "Content-Type": undefined } }
      : undefined
  )
}

export const updateAvailabilityPost = (postId, postData) => {
  return api.put(`/api/availability-posts/id/${postId}`, postData)
}

export const deleteAvailabilityPost = (postId) => {
  return api.delete(`/api/availability-posts/id/${postId}`)
}

export const getMyAvailabilityPosts = () => {
  return api.get("/api/availability-posts/my-posts")
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

export const contactArtistFromPost = (postId, message) => {
  return api.post(`/api/availability-posts/id/${postId}/contact`, { message })
}