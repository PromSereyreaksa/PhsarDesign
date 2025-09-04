import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectsAPI, checklistAPI } from '../../services/projectsAPI';

// Async thunks for project operations
export const convertApplicationToProject = createAsyncThunk(
  'projects/convertApplicationToProject',
  async ({ applicationId, projectData }, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.convertApplicationToProject(applicationId, projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to convert application to project');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.createProject(projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create project');
    }
  }
);

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.getAllProjects();
      
      // Handle nested response structure: response.data.data.projects
      const projects = response.data?.data?.projects || response.data?.projects || response.data?.data || response.data || [];
      const processedProjects = Array.isArray(projects) ? projects.map(project => ({
        ...project,
        status: project.status || 'open' // Default status if null
      })) : [];
      
      return processedProjects;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch projects');
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.getProjectById(projectId);
      
      // Handle nested response structure: response.data.data
      const project = response.data?.data || response.data;
      const processedProject = project ? {
        ...project,
        status: project.status || 'open' // Default status if null
      } : null;
      
      return processedProject;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch project');
    }
  }
);

export const fetchClientProjects = createAsyncThunk(
  'projects/fetchClientProjects',
  async (clientId, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.getClientProjects(clientId);
      
      // Handle nested response structure: response.data.data.projects
      const projects = response.data?.data?.projects || response.data?.projects || response.data?.data || response.data || [];
      const processedProjects = Array.isArray(projects) ? projects.map(project => ({
        ...project,
        status: project.status || 'open' // Default status if null
      })) : [];
      
      return processedProjects;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch client projects');
    }
  }
);

export const fetchArtistProjects = createAsyncThunk(
  'projects/fetchArtistProjects',
  async (artistId, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.getArtistProjects(artistId);
      
      // Handle nested response structure: response.data.data.projects
      const projects = response.data?.data?.projects || response.data?.projects || response.data?.data || response.data || [];
      const processedProjects = Array.isArray(projects) ? projects.map(project => ({
        ...project,
        status: project.status || 'open' // Default status if null
      })) : [];
      
      return processedProjects;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch artist projects');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ projectId, projectData }, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.updateProject(projectId, projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update project');
    }
  }
);

export const updateProjectStatus = createAsyncThunk(
  'projects/updateProjectStatus',
  async ({ projectId, status }, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.updateProjectStatus(projectId, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update project status');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId, { rejectWithValue }) => {
    try {
      await projectsAPI.deleteProject(projectId);
      return projectId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete project');
    }
  }
);

// Checklist operations
export const createChecklist = createAsyncThunk(
  'projects/createChecklist',
  async (checklistData, { rejectWithValue }) => {
    try {
      const response = await checklistAPI.createChecklist(checklistData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create checklist');
    }
  }
);

export const fetchProjectChecklists = createAsyncThunk(
  'projects/fetchProjectChecklists',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await checklistAPI.getProjectChecklists(projectId);
      
      // Handle different response structures
      const checklists = response.data?.checklists || response.data?.data || response.data || [];
      return Array.isArray(checklists) ? checklists : [];
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch checklists');
    }
  }
);

export const updateChecklist = createAsyncThunk(
  'projects/updateChecklist',
  async ({ checklistId, checklistData }, { rejectWithValue }) => {
    try {
      const response = await checklistAPI.updateChecklist(checklistId, checklistData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update checklist');
    }
  }
);

export const deleteChecklist = createAsyncThunk(
  'projects/deleteChecklist',
  async (checklistId, { rejectWithValue }) => {
    try {
      await checklistAPI.deleteChecklist(checklistId);
      return checklistId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete checklist');
    }
  }
);

export const updateChecklistStatus = createAsyncThunk(
  'projects/updateChecklistStatus',
  async ({ projectId, checklistData }, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.updateChecklistStatus(projectId, checklistData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update checklist status');
    }
  }
);

const initialState = {
  projects: [],
  currentProject: null,
  checklists: [],
  loading: false,
  error: null,
  conversionLoading: false,
  projectStats: {
    total: 0,
    open: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    paid: 0
  },
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    updateProjectStats: (state) => {
      const projects = state.projects || [];
      state.projectStats = {
        total: projects.length,
        open: projects.filter(p => p.status === 'open').length,
        inProgress: projects.filter(p => p.status === 'in_progress').length,
        completed: projects.filter(p => p.status === 'completed').length,
        cancelled: projects.filter(p => p.status === 'cancelled').length,
        paid: projects.filter(p => p.status === 'paid').length,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Convert application to project
      .addCase(convertApplicationToProject.pending, (state) => {
        state.conversionLoading = true;
        state.error = null;
      })
      .addCase(convertApplicationToProject.fulfilled, (state, action) => {
        state.conversionLoading = false;
        state.projects = state.projects || [];
        state.projects.unshift(action.payload);
        state.projectStats.total += 1;
        if (action.payload.status === 'open') {
          state.projectStats.open += 1;
        }
      })
      .addCase(convertApplicationToProject.rejected, (state, action) => {
        state.conversionLoading = false;
        state.error = action.payload;
      })

      // Create project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects || [];
        state.projects.unshift(action.payload);
        state.projectStats.total += 1;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        const projects = Array.isArray(action.payload) ? action.payload : [];
        // Ensure all projects have a default status
        state.projects = projects.map(project => ({
          ...project,
          status: project.status || 'open' // Default to 'open' if status is null
        }));
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.projects = [];
      })      // Fetch project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch client projects
      .addCase(fetchClientProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientProjects.fulfilled, (state, action) => {
        state.loading = false;
        const projects = Array.isArray(action.payload) ? action.payload : [];
        // Ensure all projects have a default status
        state.projects = projects.map(project => ({
          ...project,
          status: project.status || 'open' // Default to 'open' if status is null
        }));
      })
      .addCase(fetchClientProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.projects = [];
      })

      // Fetch artist projects
      .addCase(fetchArtistProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtistProjects.fulfilled, (state, action) => {
        state.loading = false;
        const projects = Array.isArray(action.payload) ? action.payload : [];
        // Ensure all projects have a default status
        state.projects = projects.map(project => ({
          ...project,
          status: project.status || 'open' // Default to 'open' if status is null
        }));
      })
      .addCase(fetchArtistProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.projects = [];
      })

      // Update project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const projects = state.projects || [];
        const index = projects.findIndex(p => p.projectId === action.payload.projectId);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.projectId === action.payload.projectId) {
          state.currentProject = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update project status
      .addCase(updateProjectStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProjectStatus.fulfilled, (state, action) => {
        state.loading = false;
        const projects = state.projects || [];
        const index = projects.findIndex(p => p.projectId === action.payload.projectId);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.projectId === action.payload.projectId) {
          state.currentProject = action.payload;
        }
      })
      .addCase(updateProjectStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = (state.projects || []).filter(p => p.projectId !== action.payload);
        state.projectStats.total = Math.max(0, state.projectStats.total - 1);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Checklist operations
      .addCase(createChecklist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChecklist.fulfilled, (state, action) => {
        state.loading = false;
        state.checklists = state.checklists || [];
        state.checklists.push(action.payload);
      })
      .addCase(createChecklist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchProjectChecklists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectChecklists.fulfilled, (state, action) => {
        state.loading = false;
        state.checklists = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProjectChecklists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.checklists = [];
      })

      .addCase(updateChecklist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChecklist.fulfilled, (state, action) => {
        state.loading = false;
        const checklists = state.checklists || [];
        const index = checklists.findIndex(c => c.checklistId === action.payload.checklistId);
        if (index !== -1) {
          state.checklists[index] = action.payload;
        }
      })
      .addCase(updateChecklist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteChecklist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChecklist.fulfilled, (state, action) => {
        state.loading = false;
        state.checklists = (state.checklists || []).filter(c => c.checklistId !== action.payload);
      })
      .addCase(deleteChecklist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentProject, updateProjectStats } = projectSlice.actions;
export default projectSlice.reducer;
