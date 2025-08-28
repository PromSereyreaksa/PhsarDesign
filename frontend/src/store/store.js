import { configureStore } from '@reduxjs/toolkit';
import apiReducer from './slices/apiSlice';
import artistsReducer from './slices/artistsSlice';
import authReducer from './slices/authSlice';
import categoriesReducer from './slices/categoriesSlice';
import marketplaceReducer from './slices/marketplaceSlice';
import notificationsReducer from './slices/notificationsSlice';
import postsReducer from './slices/postsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    api: apiReducer,
    posts: postsReducer,
    marketplace: marketplaceReducer,
    artists: artistsReducer,
    categories: categoriesReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;