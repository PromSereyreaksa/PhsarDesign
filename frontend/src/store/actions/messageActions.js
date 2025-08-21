import { messagesAPI } from '../../lib/api';
import { addItem, deleteItem, fetchFailure, fetchStart, fetchSuccess, updateItem } from '../slices/apiSlice';

// Message actions
export const fetchAllMessages = () => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await messagesAPI.getAll();
    dispatch(fetchSuccess({ type: 'messages', data: response.data }));
    return response.data;
  } catch (error) {
    dispatch(fetchFailure(error.response?.data?.message || 'Failed to fetch messages'));
    throw error;
  }
};

export const fetchMessageById = (id) => async () => {
  try {
    const response = await messagesAPI.getById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchConversation = (userId1, userId2) => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await messagesAPI.getConversation(userId1, userId2);
    dispatch(fetchSuccess({ type: 'conversation', data: response.data }));
    return response.data;
  } catch (error) {
    dispatch(fetchFailure(error.response?.data?.message || 'Failed to fetch conversation'));
    throw error;
  }
};

export const fetchUserConversations = (userId) => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await messagesAPI.getUserConversations(userId);
    dispatch(fetchSuccess({ type: 'conversations', data: response.data }));
    return response.data;
  } catch (error) {
    dispatch(fetchFailure(error.response?.data?.message || 'Failed to fetch user conversations'));
    throw error;
  }
};

export const sendMessage = (messageData) => async (dispatch) => {
  try {
    const response = await messagesAPI.create(messageData);
    dispatch(addItem({ type: 'messages', data: response.data }));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markMessageAsRead = (id) => async (dispatch) => {
  try {
    const response = await messagesAPI.markAsRead(id);
    dispatch(updateItem({ type: 'messages', id, data: response.data }));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMessage = (id) => async (dispatch) => {
  try {
    await messagesAPI.delete(id);
    dispatch(deleteItem({ type: 'messages', id }));
    return true;
  } catch (error) {
    throw error;
  }
};
