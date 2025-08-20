import api from './apiConfig';

// Availability Posts API (Artist Services)
export const availabilityPostsAPI = {
  getAll: (params) => api.get('/api/availability-posts', { params }),
  getById: (id) => api.get(`/api/availability-posts/${id}`),
  getBySlug: (slug) => api.get(`/api/availability-posts/slug/${slug}`),
  getByArtist: (artistId, params) => api.get(`/api/availability-posts/artist/${artistId}`, { params }),
  getMyPosts: (params) => api.get('/api/availability-posts/my-posts', { params }),
  search: (params) => api.get('/api/availability-posts/search', { params }),
  create: (postData) => api.post('/api/availability-posts', postData),
  update: (id, postData) => api.put(`/api/availability-posts/${id}`, postData),
  updateBySlug: (slug, postData) => api.put(`/api/availability-posts/slug/${slug}`, postData),
  delete: (id) => api.delete(`/api/availability-posts/${id}`),
  deleteBySlug: (slug) => api.delete(`/api/availability-posts/slug/${slug}`),
};

// Job Posts API (Client Jobs)
export const jobPostsAPI = {
  getAll: (params) => api.get('/api/job-posts', { params }),
  getById: (id) => api.get(`/api/job-posts/${id}`),
  search: (params) => api.get('/api/job-posts/search', { params }),
  create: (clientId, postData) => api.post(`/api/job-posts/client/${clientId}`, postData),
  update: (id, postData) => api.put(`/api/job-posts/${id}`, postData),
  delete: (id) => api.delete(`/api/job-posts/${id}`),
  apply: (jobId, applicationData) => api.post(`/api/job-posts/${jobId}/apply`, applicationData),
};

// Legacy functions for backward compatibility
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