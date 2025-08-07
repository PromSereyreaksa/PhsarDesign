import { usersAPI } from '../../services/api';
import { addItem, fetchStart, fetchSuccess, fetchFailure, updateItem, deleteItem } from '../slices/apiSlice';

// User actions
export const fetchAllUsers = () => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await usersAPI.getAll();
    dispatch(fetchSuccess({ type: 'users', data: response.data }));
    return response.data;
  } catch (error) {
    dispatch(fetchFailure(error.response?.data?.message || 'Failed to fetch users'));
    throw error;
  }
};

export const fetchUserById = (id) => async () => {
  try {
    const response = await usersAPI.getById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchUserByEmail = (email) => async () => {
  try {
    const response = await usersAPI.getByEmail(email);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchUsersByRole = (role) => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await usersAPI.getByRole(role);
    dispatch(fetchSuccess({ type: 'users', data: response.data }));
    return response.data;
  } catch (error) {
    dispatch(fetchFailure(error.response?.data?.message || 'Failed to fetch users by role'));
    throw error;
  }
};

export const createUser = (userData) => async (dispatch) => {
  try {
    const response = await usersAPI.create(userData);
    dispatch(addItem({ type: 'users', data: response.data }));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = (id, userData) => async (dispatch) => {
  try {
    const response = await usersAPI.update(id, userData);
    dispatch(updateItem({ type: 'users', id, data: response.data }));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = (id) => async (dispatch) => {
  try {
    await usersAPI.delete(id);
    dispatch(deleteItem({ type: 'users', id }));
    return true;
  } catch (error) {
    throw error;
  }
};
