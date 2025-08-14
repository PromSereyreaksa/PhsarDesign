import "./App.css"
import { Routes, Route } from "react-router-dom"
import LandingPage from "../pages/public/LandingPage"
import HomePage from "../pages/dashboard/HomePage"
import LoginPage from "../pages/auth/LoginPage"
import RegisterPage from "../pages/auth/RegisterPage"
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage"
import OTPVerificationPage from "../pages/auth/OTPVerificationPage"
import ChangePasswordPage from "../pages/auth/ChangePasswordPage"
import AboutPage from "../pages/public/AboutPage"
import ProtectedRoute from "../guards/ProtectedRoute.jsx"
import MarketplacePage from "../pages/Marketplace/MarketplacePage"
import PostDetailPage from "../pages/Marketplace/PostDetailPage"
import CreatePostPage from "../pages/Marketplace/CreatePost"
import EditPostPage from "../pages/Marketplace/EditPostPage"
import MyPostsPage from "../pages/Dashboard/MyPostsPage"

function App() {
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/marketplace/:postId" element={<PostDetailPage />} />

        {/* Protected authenticated routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/marketplace/create"
          element={
            <ProtectedRoute>
              <CreatePostPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketplace/edit/:postId"
          element={
            <ProtectedRoute>
              <EditPostPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/my-posts"
          element={
            <ProtectedRoute>
              <MyPostsPage />
            </ProtectedRoute>
          }
        />

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<OTPVerificationPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
      </Routes>
    </div>
  )
}

export default App
