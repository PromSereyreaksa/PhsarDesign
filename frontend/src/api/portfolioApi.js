import api from './apiConfig';

// Portfolio API
export const portfolioAPI = {
  getAll: (params) => api.get('/api/portfolio', { params }),
  getById: (id) => api.get(`/api/portfolio/${id}`),
  getByArtistId: (artistId, params) => api.get(`/api/portfolio/artist/${artistId}`, { params }),
  getByFreelancerId: (freelancerId, params) => api.get(`/api/portfolio/artist/${freelancerId}`, { params }), // Legacy alias
  getCategories: () => api.get('/api/portfolio/categories'),
  create: (portfolioData) => api.post('/api/portfolio', portfolioData),
  update: (id, portfolioData) => api.put(`/api/portfolio/${id}`, portfolioData),
  delete: (id) => api.delete(`/api/portfolio/${id}`),
  like: (id) => api.post(`/api/portfolio/${id}/like`),
};

export default portfolioAPI;
