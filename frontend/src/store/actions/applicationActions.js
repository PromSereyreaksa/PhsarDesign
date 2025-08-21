import { applicationsAPI } from '../../lib/api';
import { addItem, deleteItem, fetchFailure, fetchStart, fetchSuccess, updateItem } from '../slices/apiSlice';

// Application actions
export const fetchAllApplications = () => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await applicationsAPI.getAll();
    dispatch(fetchSuccess({ type: 'applications', data: response.data }));
    return response.data;
  } catch (error) {
    dispatch(fetchFailure(error.response?.data?.message || 'Failed to fetch applications'));
    throw error;
  }
};

export const fetchApplicationById = (id) => async () => {
  try {
    const response = await applicationsAPI.getById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchApplicationsByProjectId = (projectId) => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await applicationsAPI.getByProjectId(projectId);
    dispatch(fetchSuccess({ type: 'applications', data: response.data }));
    return response.data;
  } catch (error) {
    dispatch(fetchFailure(error.response?.data?.message || 'Failed to fetch project applications'));
    throw error;
  }
};

export const fetchApplicationsByFreelancerId = (freelancerId) => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await applicationsAPI.getByFreelancerId(freelancerId);
    dispatch(fetchSuccess({ type: 'applications', data: response.data }));
    return response.data;
  } catch (error) {
    dispatch(fetchFailure(error.response?.data?.message || 'Failed to fetch freelancer applications'));
    throw error;
  }
};

export const createApplication = (applicationData) => async (dispatch) => {
  try {
    const response = await applicationsAPI.create(applicationData);
    dispatch(addItem({ type: 'applications', data: response.data }));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateApplication = (id, applicationData) => async (dispatch) => {
  try {
    const response = await applicationsAPI.update(id, applicationData);
    dispatch(updateItem({ type: 'applications', id, data: response.data }));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateApplicationStatus = (id, status) => async (dispatch) => {
  try {
    const response = await applicationsAPI.updateStatus(id, status);
    dispatch(updateItem({ type: 'applications', id, data: response.data }));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteApplication = (id) => async (dispatch) => {
  try {
    await applicationsAPI.delete(id);
    dispatch(deleteItem({ type: 'applications', id }));
    return true;
  } catch (error) {
    throw error;
  }
};
