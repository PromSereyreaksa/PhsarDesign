import "./App.css"
import { Routes, Route } from "react-router-dom"
import LandingPage from "./components/Home/LandingPage.jsx"
import HomePage from "./components/Home/homepage.jsx"
import LoginPage from "./components/auth/LoginPage.jsx"
import RegisterPage from "./components/auth/RegisterPage.jsx"
import AboutPage from "./pages/about/page.jsx"
import BrowseJobs from "./pages/browse-job/page.jsx"
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
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/browse-jobs" element={<BrowseJobs />} />
        <Route path="/post-job-client" element={<PostJobClient />} />
        <Route path="/post-job-freelancer" element={<PostJobFreelancer />} />
        <Route path="/post-job/client" element={<PostJobClientNew />} />
        <Route path="/post-job/freelancer" element={<PostJobFreelancerNew />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App
