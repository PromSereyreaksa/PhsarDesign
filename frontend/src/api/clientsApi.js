import api from './apiConfig';

// Clients API
export const clientsAPI = {
  getAll: () => api.get('/api/clients'),
  getById: (id) => api.get(`/api/clients/id/${id}`),
  getByUserId: (userId) => api.get(`/api/clients/user/${userId}`),
  getBySlug: (slug) => api.get(`/api/clients/${slug}`),
  getByName: (name) => api.get(`/api/clients/name/${name}`),
  create: (clientData) => api.post('/api/clients', clientData),
  update: (id, clientData) => api.put(`/api/clients/id/${id}`, clientData),
  updateBySlug: (slug, clientData) => api.put(`/api/clients/${slug}`, clientData),
  delete: (id) => api.delete(`/api/clients/id/${id}`),
  deleteBySlug: (slug) => api.delete(`/api/clients/${slug}`),
};

export default clientsAPI;
