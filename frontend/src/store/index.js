import { configureStore } from "@reduxjs/toolkit"
import artistsReducer from "./slices/artistsSlice"
import authReducer from "./slices/authSlice"
import categoriesReducer from "./slices/categoriesSlice"
import marketplaceReducer from "./slices/marketplaceSlice"
import postsReducer from "./slices/postsSlice"

export const store = configureStore({
  reducer: {
    marketplace: marketplaceReducer,
    auth: authReducer,
    artists: artistsReducer,
    posts: postsReducer,
    categories: categoriesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["marketplace/uploadImages/pending", "marketplace/uploadImages/fulfilled"],
      },
    }),
})

export default store
