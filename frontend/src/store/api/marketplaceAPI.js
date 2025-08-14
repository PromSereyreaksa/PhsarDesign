import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api"

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

// API endpoints
export const getPosts = (filters = {}) => {
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

export const getPostById = (postId) => {
  return api.get(`/availability-posts/${postId}`)
}

export const createPost = (postData) => {
  return api.post("/availability-posts", postData)
}

export const updatePost = (postId, postData) => {
  return api.put(`/availability-posts/${postId}`, postData)
}

export const deletePost = (postId) => {
  return api.delete(`/availability-posts/${postId}`)
}

export const getUserPosts = () => {
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

export const contactArtist = (postId, message) => {
  return api.post(`/availability-posts/${postId}/contact`, { message })
}
