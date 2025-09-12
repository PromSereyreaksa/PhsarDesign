import api from '../lib/api';

export const projectsAPI = {
  // Convert application to project
  convertApplicationToProject: async (applicationId, projectData) => {
    if (!applicationId) {
      throw new Error('Application ID is required');
    }
    const response = await api.post(`/api/applications/${applicationId}/convert-to-project`, projectData);
    return response;
  },

  // Project CRUD operations
  createProject: async (projectData) => {
    const response = await api.post('/api/projects', projectData);
    return response;
  },

  getAllProjects: async () => {
    const response = await api.get('/api/projects');
    return response;
  },

  searchArtists: async (params) => {
    const response = await api.get('/api/projects/search/artists', { params });
    return response;
  },

  getClientProjects: async (clientId) => {
    const response = await api.get(`/api/projects/user/${clientId}`);
    return response;
  },

  getArtistProjects: async (artistId) => {
    const response = await api.get(`/api/projects/user/${artistId}`);
    return response;
  },

  getProjectById: async (projectId) => {
    const response = await api.get(`/api/projects/${projectId}`);
    return response;
  },

  updateProject: async (projectId, projectData) => {
    const response = await api.put(`/api/projects/${projectId}`, projectData);
    return response;
  },

  updateProjectStatus: async (projectId, status) => {
    const response = await api.patch(`/api/projects/${projectId}/status`, { status });
    return response;
  },

  deleteProject: async (projectId) => {
    const response = await api.delete(`/api/projects/${projectId}`);
    return response;
  },

  updateChecklistStatus: async (projectId, checklistData) => {
    const response = await api.put(`/api/projects/checklist/${projectId}`, checklistData);
    return response;
  }
};

// Checklist API operations
export const checklistAPI = {
  createChecklist: async (checklistData) => {
    const response = await api.post('/api/checklists', checklistData);
    return response;
  },

  getProjectChecklists: async (projectId) => {
    const response = await api.get(`/api/checklists/project/${projectId}`);
    return response;
  },

  updateChecklist: async (checklistId, checklistData) => {
    const response = await api.patch(`/api/checklists/${checklistId}`, checklistData);
    return response;
  },

  deleteChecklist: async (checklistId) => {
    const response = await api.delete(`/api/checklists/${checklistId}`);
    return response;
  }
};

export default projectsAPI;
