import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import apiReducer from './slices/apiSlice';
import postsReducer from './slices/postsSlice';
import marketplaceReducer from './slices/marketplaceSlice';
import artistsReducer from './slices/artistsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    api: apiReducer,
    posts: postsReducer,
    marketplace: marketplaceReducer,
    artists: artistsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;