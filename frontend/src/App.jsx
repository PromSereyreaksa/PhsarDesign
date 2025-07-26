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
import BrowseArtists from "./pages/browse-freelancers/page.jsx" // Import from legacy path but rename component
import PostJobClient from "./pages/post-job-client/page.jsx"
import PostJobArtist from "./pages/post-job-freelancer/page.jsx" // Legacy path but rename component
import PostJobClientNew from "./pages/post-job/client.jsx"
import PostJobArtistNew from "./pages/post-job/freelancer.jsx" // Legacy path but rename component
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
        <Route path="/dashboard" element={
          <ProtectedRoute>
            {/* Dashboard custom protection is handled inside ProtectedRoute component */}
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/browse-jobs" element={<ProtectedRoute><BrowseJobs /></ProtectedRoute>} />
        <Route path="/browse-freelancers" element={<ProtectedRoute><BrowseArtists /></ProtectedRoute>} />
        <Route path="/browse-artists" element={<ProtectedRoute><BrowseArtists /></ProtectedRoute>} /> {/* Add new consistent route */}
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        {/* Client only routes */}
        <Route path="/post-job-client" element={<ProtectedRoute requiredRole="client"><PostJobClient /></ProtectedRoute>} />
        <Route path="/post-job/client" element={<ProtectedRoute requiredRole="client"><PostJobClientNew /></ProtectedRoute>} />
        
        {/* Artist only routes */}
        <Route path="/post-job-freelancer" element={<ProtectedRoute requiredRole="artist"><PostJobArtist /></ProtectedRoute>} />
        <Route path="/post-job/freelancer" element={<ProtectedRoute requiredRole="artist"><PostJobArtistNew /></ProtectedRoute>} />
        <Route path="/post-job/artist" element={<ProtectedRoute requiredRole="artist"><PostJobArtistNew /></ProtectedRoute>} /> {/* Add new consistent route */}
      </Routes>
    </div>
  )
}

export default App
