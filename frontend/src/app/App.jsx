import { Route, Routes } from "react-router-dom"
import ProtectedRoute from "../guards/ProtectedRoute.jsx"
import MyPostsPage from "../pages/Dashboard/MyPostsPage"
import HomePage from "../pages/HomePage/index.jsx"
import CreatePostPage from "../pages/Marketplace/CreatePost"
import EditPostPage from "../pages/Marketplace/EditPostPage"
import MarketplacePage from "../pages/Marketplace/MarketplacePage"
import PostDetailPage from "../pages/Marketplace/PostDetailPage"
import ChangePasswordPage from "../pages/auth/ChangePasswordPage"
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage"
import LoginPage from "../pages/auth/LoginPage/index.jsx"
import OTPVerificationPage from "../pages/auth/OTPVerificationPage"
import RegisterPage from "../pages/auth/RegisterPage"
import ArtistProfile from "../pages/profiles/ArtistProfile.jsx"
import ClientProfile from "../pages/profiles/ClientProfile.jsx"
import EditProfile from "../pages/profiles/EditProfile.jsx"
import ProfileRouter from "../pages/profiles/ProfileRouter.jsx"
import AboutPage from "../pages/public/AboutPage/index.jsx"
import LandingPage from "../pages/public/LandingPage/index.jsx"
import "./App.css"

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
        <Route path="/marketplace/:slug" element={<PostDetailPage />} />

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

        {/* Profile routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileRouter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/artist/:userId"
          element={
            <ProtectedRoute>
              <ArtistProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/client/:userId"
          element={
            <ProtectedRoute>
              <ClientProfile />
            </ProtectedRoute>
          }
        />

        {/* Profile Edit route */}
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
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
