import api from './apiConfig';

// Projects API
export const projectsAPI = {
  getAll: (params) => api.get('/api/projects', { params }),
  getById: (id) => api.get(`/api/projects/${id}`),
  getByClientId: (clientId, params) => api.get(`/api/projects/client/${clientId}`, { params }),
  getByStatus: (status) => api.get(`/api/projects/status/${status}`),
  search: (params) => api.get('/api/projects/search', { params }),
  searchArtists: (params) => api.get('/api/projects/search/artists', { params }),
  create: (projectData) => api.post('/api/projects', projectData),
  update: (id, projectData) => api.put(`/api/projects/${id}`, projectData),
  updateStatus: (id, status) => api.patch(`/api/projects/${id}/status`, { status }),
  delete: (id) => api.delete(`/api/projects/${id}`),
};

export default projectsAPI;
