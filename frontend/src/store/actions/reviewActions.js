import { reviewsAPI } from '../../lib/api';
import { addItem, deleteItem, fetchFailure, fetchStart, fetchSuccess, updateItem } from '../slices/apiSlice';

// Review actions
export const fetchAllReviews = () => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await reviewsAPI.getAll();
    dispatch(fetchSuccess({ type: 'reviews', data: response.data }));
    return response.data;
  } catch (error) {
    dispatch(fetchFailure(error.response?.data?.message || 'Failed to fetch reviews'));
    throw error;
  }
};

export const fetchReviewById = (id) => async () => {
  try {
    const response = await reviewsAPI.getById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchReviewsByProjectId = (projectId) => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await reviewsAPI.getByProjectId(projectId);
    dispatch(fetchSuccess({ type: 'reviews', data: response.data }));
    return response.data;
  } catch (error) {
    dispatch(fetchFailure(error.response?.data?.message || 'Failed to fetch project reviews'));
    throw error;
  }
};

export const fetchReviewsByFreelancerId = (freelancerId) => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await reviewsAPI.getByFreelancerId(freelancerId);
    dispatch(fetchSuccess({ type: 'reviews', data: response.data }));
    return response.data;
  } catch (error) {
    dispatch(fetchFailure(error.response?.data?.message || 'Failed to fetch freelancer reviews'));
    throw error;
  }
};

export const fetchReviewsByClientId = (clientId) => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await reviewsAPI.getByClientId(clientId);
    dispatch(fetchSuccess({ type: 'reviews', data: response.data }));
    return response.data;
  } catch (error) {
    dispatch(fetchFailure(error.response?.data?.message || 'Failed to fetch client reviews'));
    throw error;
  }
};

export const createReview = (reviewData) => async (dispatch) => {
  try {
    const response = await reviewsAPI.create(reviewData);
    dispatch(addItem({ type: 'reviews', data: response.data }));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateReview = (id, reviewData) => async (dispatch) => {
  try {
    const response = await reviewsAPI.update(id, reviewData);
    dispatch(updateItem({ type: 'reviews', id, data: response.data }));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteReview = (id) => async (dispatch) => {
  try {
    await reviewsAPI.delete(id);
    dispatch(deleteItem({ type: 'reviews', id }));
    return true;
  } catch (error) {
    throw error;
  }
};
