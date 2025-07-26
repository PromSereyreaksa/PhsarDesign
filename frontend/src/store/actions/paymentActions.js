import { paymentsAPI } from '../../services/api';
import { addItem, fetchStart, fetchSuccess, fetchFailure, deleteItem } from '../slices/apiSlice';

// Payment actions
export const createPaymentIntent = (paymentData) => async (dispatch) => {
  try {
    const response = await paymentsAPI.createPaymentIntent(paymentData);
    dispatch(addItem({ type: 'payments', data: response.data.data }));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const confirmPayment = (confirmationData) => async (dispatch) => {
  try {
    const response = await paymentsAPI.confirmPayment(confirmationData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createSetupIntent = () => async () => {
  try {
    const response = await paymentsAPI.createSetupIntent();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchPaymentMethods = () => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await paymentsAPI.getPaymentMethods();
    dispatch(fetchSuccess({ type: 'paymentMethods', data: response.data.data.paymentMethods }));
    return response.data;
  } catch (error) {
    dispatch(fetchFailure(error.response?.data?.message || 'Failed to fetch payment methods'));
    throw error;
  }
};

export const deletePaymentMethod = (paymentMethodId) => async (dispatch) => {
  try {
    await paymentsAPI.deletePaymentMethod(paymentMethodId);
    dispatch(deleteItem({ type: 'paymentMethods', id: paymentMethodId }));
    return true;
  } catch (error) {
    throw error;
  }
};

export const fetchPaymentHistory = (params = {}) => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await paymentsAPI.getPaymentHistory(params);
    dispatch(fetchSuccess({ type: 'paymentHistory', data: response.data.data.payments }));
    return response.data;
  } catch (error) {
    dispatch(fetchFailure(error.response?.data?.message || 'Failed to fetch payment history'));
    throw error;
  }
};