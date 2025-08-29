import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { performanceUtils } from "../hooks/usePerformance.jsx";
import "../index.css";
import store from "../store/store.js";
import App from "./App.jsx";

// Initialize performance monitoring in production
if (import.meta.env.MODE === 'production') {
  performanceUtils.reportWebVitals();
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </HelmetProvider>
  </StrictMode>
);
