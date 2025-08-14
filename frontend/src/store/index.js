import { configureStore } from "@reduxjs/toolkit"
import marketplaceReducer from "./slices/marketplaceSlice"

export const store = configureStore({
  reducer: {
    marketplace: marketplaceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["marketplace/uploadImages/pending", "marketplace/uploadImages/fulfilled"],
      },
    }),
})

export default store
