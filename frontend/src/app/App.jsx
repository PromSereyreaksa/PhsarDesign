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

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]" style={{fontFamily: 'Poppins, sans-serif'}}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Protected authenticated routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
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
