import "./App.css"
import { Routes, Route } from "react-router-dom"
import LandingPage from "./components/Home/LandingPage.jsx"
import LoginPage from "./components/auth/LoginPage.jsx"
import RegisterPage from "./components/auth/RegisterPage.jsx"
import AboutPage from "./pages/about/page.jsx"

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]" style={{fontFamily: 'Poppins, sans-serif'}}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        
        {/* Auth routes for future use */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  )
}

export default App
