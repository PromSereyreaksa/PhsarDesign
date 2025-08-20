import api from './apiConfig';

// Artists API (formerly Freelancers)
export const artistsAPI = {
  getAll: () => api.get('/api/artists'),
  getById: (id) => api.get(`/api/artists/${id}`),
  getByUserId: (userId) => api.get(`/api/artists/user/${userId}`),
  getByCategory: (category) => api.get(`/api/artists/category/${category}`),
  getBySlug: (slug) => api.get(`/api/artists/slug/${slug}`),
  search: (params) => api.get('/api/artists/search', { params }),
  create: (artistData) => api.post('/api/artists', artistData),
  update: (id, artistData) => api.put(`/api/artists/${id}`, artistData),
  updateBySlug: (slug, artistData) => api.put(`/api/artists/slug/${slug}`, artistData),
  delete: (id) => api.delete(`/api/artists/${id}`),
  deleteBySlug: (slug) => api.delete(`/api/artists/slug/${slug}`),
};

// Legacy alias for backward compatibility
export const freelancersAPI = artistsAPI;

// Legacy function for backward compatibility
export const getArtists = async () => {
  try {
    const response = await artistsAPI.getAll();
    return response.data;
  } catch (error) {
    console.error("Error fetching artists:", error);
    throw error;
  }
};

export default artistsAPI;
