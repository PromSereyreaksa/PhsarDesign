import { uploadAPI } from '../../lib/api';
import { addItem, deleteItem, fetchFailure, fetchStart, fetchSuccess, updateItem } from '../slices/apiSlice';

// Upload actions
export const uploadSingleImage = (file, folder = 'artlink/general', tags = '') => async (dispatch) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);
  if (tags) formData.append('tags', tags);

  const response = await uploadAPI.uploadImage(formData);
  dispatch(addItem({ type: 'uploads', data: response.data.data }));
  return response.data;
};

export const uploadMultipleImages = (files, folder = 'artlink/general', tags = '') => async (dispatch) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('images', file);
  });
  formData.append('folder', folder);
  if (tags) formData.append('tags', tags);

  const response = await uploadAPI.uploadImages(formData);
  // Response contains array of uploaded images
  response.data.data.forEach(image => {
    dispatch(addItem({ type: 'uploads', data: image }));
  });
  return response.data;
};

export const uploadAvatar = (file, userId) => async (dispatch) => {
  const formData = new FormData();
  formData.append('avatar', file);
  formData.append('userId', userId.toString());

  const response = await uploadAPI.uploadAvatar(formData);
  dispatch(addItem({ type: 'uploads', data: response.data.data }));
  return response.data;
};

export const uploadPortfolioImage = (file, freelancerId, portfolioId, title, description) => async (dispatch) => {
  const formData = new FormData();
  formData.append('portfolio', file);
  formData.append('freelancerId', freelancerId.toString());
  if (portfolioId) formData.append('portfolioId', portfolioId.toString());
  if (title) formData.append('title', title);
  if (description) formData.append('description', description);

  const response = await uploadAPI.uploadPortfolio(formData);
  dispatch(addItem({ type: 'uploads', data: response.data.data }));
  return response.data;
};

export const fetchImages = (params = {}) => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await uploadAPI.listImages(params);
    dispatch(fetchSuccess({ type: 'uploads', data: response.data.resources || response.data.data }));
    return response.data;
  } catch (error) {
    dispatch(fetchFailure(error.response?.data?.message || 'Failed to fetch images'));
    throw error;
  }
};

export const getImageDetails = (publicId) => async () => {
  const response = await uploadAPI.getImage(publicId);
  return response.data;
};

export const updateImageMetadata = (publicId, metadata) => async (dispatch) => {
  const response = await uploadAPI.updateImageMetadata(publicId, metadata);
  dispatch(updateItem({ type: 'uploads', id: publicId, data: response.data.data }));
  return response.data;
};

export const transformImage = (publicId, transformations) => async () => {
  const response = await uploadAPI.transformImage(publicId, transformations);
  return response.data;
};

export const deleteImage = (publicId) => async (dispatch) => {
  await uploadAPI.deleteImage(publicId);
  dispatch(deleteItem({ type: 'uploads', id: publicId }));
  return true;
};

export const deleteMultipleImages = (publicIds) => async (dispatch) => {
  await uploadAPI.deleteImages(publicIds);
  publicIds.forEach(publicId => {
    dispatch(deleteItem({ type: 'uploads', id: publicId }));
  });
  return true;
};

export const generateUploadSignature = (params) => async () => {
  const response = await uploadAPI.generateSignature(params);
  return response.data;
};