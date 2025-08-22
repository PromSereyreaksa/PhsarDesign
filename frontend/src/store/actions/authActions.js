import { authAPI, clientsAPI, freelancersAPI } from '../../lib/api';
import { addItem, deleteItem, fetchStart, fetchSuccess, updateItem } from '../slices/apiSlice';
import { loginFailure, loginStart, loginSuccess, logout } from '../slices/authSlice';
import store from '../store';

// Auth actions
export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const response = await authAPI.login(credentials);
    
    // Backend returns { user, accessToken }
    const { user, accessToken } = response.data;
    
    dispatch(loginSuccess({ 
      user: user, 
      token: accessToken 
    }));
    
    return response.data;
  } catch (error) {
    dispatch(loginFailure(error.response?.data?.message || 'Login failed'));
    throw error;
  }
};

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const response = await authAPI.register(userData);
    
    // Backend returns { user, accessToken }
    const { user, accessToken } = response.data;
    
    dispatch(loginSuccess({ 
      user: user, 
      token: accessToken 
    }));
    
    return response.data;
  } catch (error) {
    dispatch(loginFailure(error.response?.data?.message || 'Registration failed'));
    throw error;
  }
};

export const refreshToken = () => async (dispatch) => {
  try {
    const response = await authAPI.refresh();
    const { accessToken } = response.data;
    
    // Update token in state while keeping existing user data
    const currentState = store.getState();
    dispatch(loginSuccess({ 
      user: currentState.auth.user, 
      token: accessToken 
    }));
    
    return response.data;
  } catch (error) {
    dispatch(loginFailure('Token refresh failed'));
    throw error;
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await authAPI.logout();
  } catch {
    // Continue with logout even if API call fails
  } finally {
    dispatch(logout());
  }
};

// Profile creation actions
export const createClientProfile = (clientData) => async (dispatch, getState) => {
  const { auth } = getState();
  const profileData = {
    userId: auth.user.userId,
    ...clientData
  };
  
  const response = await clientsAPI.create(profileData);
  dispatch(addItem({ type: 'clients', data: response.data }));
  
  return response.data;
};

export const createFreelancerProfile = (freelancerData) => async (dispatch, getState) => {
  const { auth } = getState();
  const profileData = {
    userId: auth.user.userId,
    ...freelancerData
  };
  
  const response = await freelancersAPI.create(profileData);
  dispatch(addItem({ type: 'freelancers', data: response.data }));
  
  return response.data;
};

// Generic API actions
export const fetchData = (apiFunction, type) => async (dispatch) => {
  dispatch(fetchStart());
  const response = await apiFunction();
  dispatch(fetchSuccess({ type, data: response.data }));
  return response.data;
};

export const createData = (apiFunction, type) => async (dispatch, data) => {
  const response = await apiFunction(data);
  dispatch(addItem({ type, data: response.data }));
  return response.data;
};

export const updateData = (apiFunction, type, id) => async (dispatch, data) => {
  const response = await apiFunction(id, data);
  dispatch(updateItem({ type, id, data: response.data }));
  return response.data;
};

export const deleteData = (apiFunction, type, id) => async (dispatch) => {
  await apiFunction(id);
  dispatch(deleteItem({ type, id }));
  return true;
};