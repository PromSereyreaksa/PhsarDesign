import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

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
  return api.post("/api/availability-posts", postData)
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
    formData.append(`photos`, file)
  })

  return api.post("/api/upload/images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const contactArtistFromPost = (postId, message) => {
  return api.post(`/api/availability-posts/id/${postId}/contact`, { message })
}