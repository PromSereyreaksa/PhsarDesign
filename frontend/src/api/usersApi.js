import api from './apiConfig';

// Users API
export const usersAPI = {
  getAll: () => api.get('/api/users'),
  getById: (id) => api.get(`/api/users/${id}`),
  getByEmail: (email) => api.get(`/api/users/email/${email}`),
  getByRole: (role) => api.get(`/api/users/role/${role}`),
  create: (userData) => api.post('/api/users', userData),
  update: (id, userData) => api.patch(`/api/users/${id}`, userData),
  delete: (id) => api.delete(`/api/users/${id}`),
};

export default usersAPI;
