// Export all actions from a central location for easier imports
export * from './authActions';
export * from './projectActions';
export * from './uploadActions';
export * from './paymentActions';
export * from './userActions';
export * from './messageActions';
export * from './applicationActions';
export * from './reviewActions';

// Generic actions for other APIs (freelancers, clients, portfolios, reviews, applications, messages)
import { 
  freelancersAPI, 
  clientsAPI, 
  portfolioAPI, 
  reviewsAPI, 
  applicationsAPI, 
  messagesAPI 
} from '../../services/api';
import { 
  addItem, 
  fetchStart, 
  fetchSuccess, 
  fetchFailure, 
  updateItem, 
  deleteItem 
} from '../slices/apiSlice';

// Freelancer actions
export const fetchAllFreelancers = () => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await freelancersAPI.getAll();
    dispatch(fetchSuccess({ type: 'freelancers', data: response.data }));
    return response.data;
  } catch (error) {
    dispatch(fetchFailure(error.response?.data?.message || 'Failed to fetch freelancers'));
    throw error;
  }
};

export const fetchFreelancerById = (id) => async () => {
  try {
    const response = await freelancersAPI.getById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchFreelancerByUserId = (userId) => async () => {
  try {
    const response = await freelancersAPI.getByUserId(userId);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchFreelancersBySkills = (skills) => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await freelancersAPI.getBySkills(skills);
    dispatch(fetchSuccess({ type: 'freelancers', data: response.data }));
    return response.data;
  } catch (error) {
    dispatch(fetchFailure(error.response?.data?.message || 'Failed to fetch freelancers by skills'));
    throw error;
  }
};

export const updateFreelancer = (id, freelancerData) => async (dispatch) => {
  try {
    const response = await freelancersAPI.update(id, freelancerData);
    dispatch(updateItem({ type: 'freelancers', id, data: response.data }));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteFreelancer = (id) => async (dispatch) => {
  try {
    await freelancersAPI.delete(id);
    dispatch(deleteItem({ type: 'freelancers', id }));
    return true;
  } catch (error) {
    throw error;
  }
};

// Client actions
export const fetchAllClients = () => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await clientsAPI.getAll();
    dispatch(fetchSuccess({ type: 'clients', data: response.data }));
    return response.data;
  } catch (error) {
    dispatch(fetchFailure(error.response?.data?.message || 'Failed to fetch clients'));
    throw error;
  }
};

export const fetchClientById = (id) => async () => {
  try {
    const response = await clientsAPI.getById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchClientByUserId = (userId) => async () => {
  try {
    const response = await clientsAPI.getByUserId(userId);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateClient = (id, clientData) => async (dispatch) => {
  try {
    const response = await clientsAPI.update(id, clientData);
    dispatch(updateItem({ type: 'clients', id, data: response.data }));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteClient = (id) => async (dispatch) => {
  try {
    await clientsAPI.delete(id);
    dispatch(deleteItem({ type: 'clients', id }));
    return true;
  } catch (error) {
    throw error;
  }
};

// Portfolio actions
export const fetchAllPortfolios = () => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await portfolioAPI.getAll();
    dispatch(fetchSuccess({ type: 'portfolios', data: response.data }));
    return response.data;
  } catch (error) {
    dispatch(fetchFailure(error.response?.data?.message || 'Failed to fetch portfolios'));
    throw error;
  }
};

export const fetchPortfoliosByFreelancerId = (freelancerId) => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await portfolioAPI.getByFreelancerId(freelancerId);
    dispatch(fetchSuccess({ type: 'portfolios', data: response.data }));
    return response.data;
  } catch (error) {
    dispatch(fetchFailure(error.response?.data?.message || 'Failed to fetch freelancer portfolios'));
    throw error;
  }
};

export const createPortfolio = (portfolioData) => async (dispatch) => {
  try {
    const response = await portfolioAPI.create(portfolioData);
    dispatch(addItem({ type: 'portfolios', data: response.data }));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePortfolio = (id, portfolioData) => async (dispatch) => {
  try {
    const response = await portfolioAPI.update(id, portfolioData);
    dispatch(updateItem({ type: 'portfolios', id, data: response.data }));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePortfolio = (id) => async (dispatch) => {
  try {
    await portfolioAPI.delete(id);
    dispatch(deleteItem({ type: 'portfolios', id }));
    return true;
  } catch (error) {
    throw error;
  }
};

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

export const fetchReviewsByProjectId = (projectId) => async (dispatch) => {
  try {
    const response = await reviewsAPI.getByProjectId(projectId);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchReviewsByFreelancerId = (freelancerId) => async (dispatch) => {
  try {
    const response = await reviewsAPI.getByFreelancerId(freelancerId);
    return response.data;
  } catch (error) {
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

// Application actions
export const fetchApplicationsByProjectId = (projectId) => async (dispatch) => {
  try {
    const response = await applicationsAPI.getByProjectId(projectId);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchApplicationsByFreelancerId = (freelancerId) => async (dispatch) => {
  try {
    const response = await applicationsAPI.getByFreelancerId(freelancerId);
    return response.data;
  } catch (error) {
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

export const updateApplicationStatus = (id, status) => async (dispatch) => {
  try {
    const response = await applicationsAPI.updateStatus(id, status);
    dispatch(updateItem({ type: 'applications', id, data: response.data }));
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Message actions (if implemented)
export const fetchUserConversations = (userId) => async (dispatch) => {
  try {
    const response = await messagesAPI.getUserConversations(userId);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchConversation = (userId1, userId2) => async (dispatch) => {
  try {
    const response = await messagesAPI.getConversation(userId1, userId2);
    return response.data;
  } catch (error) {
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