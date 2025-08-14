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
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v))
      } else {
        params.append(key, value)
      }
    }
  })
  return api.get(`/availability-posts?${params.toString()}`)
}

export const searchAvailabilityPosts = (filters = {}) => {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v))
      } else {
        params.append(key, value)
      }
    }
  })
  return api.get(`/availability-posts/search?${params.toString()}`)
}

export const getAvailabilityPostsByArtist = (artistId) => {
  return api.get(`/availability-posts/artist/${artistId}`)
}

export const getAvailabilityPostById = (postId) => {
  return api.get(`/availability-posts/id/${postId}`)
}

export const getAvailabilityPostBySlug = (slug) => {
  return api.get(`/availability-posts/${slug}`)
}

export const createAvailabilityPost = (postData) => {
  return api.post("/availability-posts", postData)
}

export const updateAvailabilityPost = (postId, postData) => {
  return api.put(`/availability-posts/id/${postId}`, postData)
}

export const deleteAvailabilityPost = (postId) => {
  return api.delete(`/availability-posts/id/${postId}`)
}

export const getMyAvailabilityPosts = () => {
  return api.get("/availability-posts/my-posts")
}

export const uploadImages = (files) => {
  const formData = new FormData()
  files.forEach((file, index) => {
    formData.append(`images`, file)
  })

  return api.post("/upload/images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const contactArtistFromPost = (postId, message) => {
  return api.post(`/availability-posts/id/${postId}/contact`, { message })
}