import "./App.css"
import { Routes, Route } from "react-router-dom"
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx"
import PublicRoute from "./components/auth/PublicRoute.jsx"
import ProfileSetup from "./components/auth/ProfileSetup.jsx"
import LandingPage from "./components/Home/LandingPage.jsx"
import HomePage from "./components/Home/homepage.jsx"
import LoginPage from "./components/auth/LoginPage.jsx"
import RegisterPage from "./components/auth/RegisterPage.jsx"
import AboutPage from "./pages/about/page.jsx"
import BrowseJobs from "./pages/browse-job/page.jsx"
import BrowseFreelancers from "./pages/browse-freelancers/page.jsx"
import PostJobClient from "./pages/post-job-client/page.jsx"
import PostJobFreelancer from "./pages/post-job-freelancer/page.jsx"
import PostJobClientNew from "./pages/post-job/client.jsx"
import PostJobFreelancerNew from "./pages/post-job/freelancer.jsx"
import Messages from "./pages/messages/page.jsx"
import Profile from "./pages/profile/page.jsx"
import Dashboard from "./pages/dashboard/page.jsx"

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        
        {/* Auth routes - redirect to dashboard if already logged in */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
        
        {/* Protected routes */}
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/browse-jobs" element={<ProtectedRoute><BrowseJobs /></ProtectedRoute>} />
        <Route path="/browse-freelancers" element={<ProtectedRoute><BrowseFreelancers /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        {/* Client only routes */}
        <Route path="/post-job-client" element={<ProtectedRoute requiredRole="client"><PostJobClient /></ProtectedRoute>} />
        <Route path="/post-job/client" element={<ProtectedRoute requiredRole="client"><PostJobClientNew /></ProtectedRoute>} />
        
        {/* Freelancer only routes */}
        <Route path="/post-job-freelancer" element={<ProtectedRoute requiredRole="freelancer"><PostJobFreelancer /></ProtectedRoute>} />
        <Route path="/post-job/freelancer" element={<ProtectedRoute requiredRole="freelancer"><PostJobFreelancerNew /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App
