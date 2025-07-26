import { projectsAPI } from '../../services/api';
import { addItem, fetchStart, fetchSuccess, fetchFailure, updateItem, deleteItem } from '../slices/apiSlice';

// Project actions
export const fetchAllProjects = () => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await projectsAPI.getAll();
    dispatch(fetchSuccess({ type: 'projects', data: response.data }));
    return response.data;
  } catch (error) {
    dispatch(fetchFailure(error.response?.data?.message || 'Failed to fetch projects'));
    throw error;
  }
};

export const fetchProjectById = (id) => async () => {
  const response = await projectsAPI.getById(id);
  return response.data;
};

export const fetchProjectsByClientId = (clientId) => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await projectsAPI.getByClientId(clientId);
    dispatch(fetchSuccess({ type: 'projects', data: response.data }));
    return response.data;
  } catch (error) {
    dispatch(fetchFailure(error.response?.data?.message || 'Failed to fetch client projects'));
    throw error;
  }
};

export const fetchProjectsByStatus = (status) => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await projectsAPI.getByStatus(status);
    dispatch(fetchSuccess({ type: 'projects', data: response.data }));
    return response.data;
  } catch (error) {
    dispatch(fetchFailure(error.response?.data?.message || 'Failed to fetch projects by status'));
    throw error;
  }
};

export const searchProjects = (searchParams) => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await projectsAPI.search(searchParams);
    dispatch(fetchSuccess({ type: 'projects', data: response.data }));
    return response.data;
  } catch (error) {
    dispatch(fetchFailure(error.response?.data?.message || 'Failed to search projects'));
    throw error;
  }
};

export const createProject = (projectData) => async (dispatch) => {
  const response = await projectsAPI.create(projectData);
  dispatch(addItem({ type: 'projects', data: response.data }));
  return response.data;
};

export const updateProject = (id, projectData) => async (dispatch) => {
  const response = await projectsAPI.update(id, projectData);
  dispatch(updateItem({ type: 'projects', id, data: response.data }));
  return response.data;
};

export const deleteProject = (id) => async (dispatch) => {
  await projectsAPI.delete(id);
  dispatch(deleteItem({ type: 'projects', id }));
  return true;
};