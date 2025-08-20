import api from './apiConfig';

// Applications API
export const applicationsAPI = {
  getAll: (params) => api.get('/api/applications', { params }),
  getById: (id) => api.get(`/api/applications/${id}`),
  getByProjectId: (projectId, params) => api.get(`/api/applications/project/${projectId}`, { params }),
  getByArtistId: (artistId, params) => api.get(`/api/applications/artist/${artistId}`, { params }),
  getByFreelancerId: (freelancerId, params) => api.get(`/api/applications/artist/${freelancerId}`, { params }), // Legacy alias
  getByType: (type, params) => api.get(`/api/applications/type/${type}`, { params }),
  create: (applicationData) => api.post('/api/applications', applicationData),
  applyToService: (applicationData) => api.post('/api/applications/service', applicationData),
  convertToProject: (applicationId, projectData) => api.post(`/api/applications/${applicationId}/convert-to-project`, projectData),
  update: (id, applicationData) => api.put(`/api/applications/${id}`, applicationData),
  delete: (id) => api.delete(`/api/applications/${id}`),
  updateStatus: (id, statusData) => api.patch(`/api/applications/${id}/status`, statusData),
};

export default applicationsAPI;
