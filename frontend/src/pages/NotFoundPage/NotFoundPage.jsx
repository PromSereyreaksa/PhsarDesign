import { ArrowLeft, Home, Search } from "lucide-react"
import { useNavigate } from "react-router-dom"
import AuthNavbar from "../../components/layout/AuthNavbar"
import SharedPublicNavbar from "../../components/layout/SharedPublicNavbar"
import { useSelector } from "react-redux"

const NotFoundPage = ({ title = "Page Not Found", message = "The page you're looking for doesn't exist or has been moved." }) => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleGoHome = () => {
    if (user) {
      navigate("/home")
    } else {
      navigate("/")
    }
  }

  const handleGoBack = () => {
    window.history.back()
  }

  const handleBrowseMarketplace = () => {
    navigate("/marketplace")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      {user ? <AuthNavbar /> : <SharedPublicNavbar />}
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-8xl md:text-9xl font-bold text-[#A95BAB]/20 mb-4">
              404
            </div>
            <div className="text-6xl mb-6">🎨</div>
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              {message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center px-6 py-3 bg-gray-700/50 hover:bg-gray-700/70 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>

            <button
              onClick={handleGoHome}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#A95BAB] to-[#A95BAB]/80 hover:from-[#A95BAB]/90 hover:to-[#A95BAB]/70 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#A95BAB]/25"
            >
              <Home className="w-5 h-5 mr-2" />
              {user ? "Home" : "Landing Page"}
            </button>

            <button
              onClick={handleBrowseMarketplace}
              className="inline-flex items-center px-6 py-3 bg-blue-600/80 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
            >
              <Search className="w-5 h-5 mr-2" />
              Browse Marketplace
            </button>
          </div>

          {/* Helpful Links */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Looking for something else?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate("/marketplace?type=services")}
                className="p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors text-left"
              >
                <div className="text-[#A95BAB] font-medium mb-1">Browse Services</div>
                <div className="text-gray-400 text-sm">Find talented artists and their services</div>
              </button>
              
              <button
                onClick={() => navigate("/marketplace?type=jobs")}
                className="p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors text-left"
              >
                <div className="text-[#A95BAB] font-medium mb-1">Find Jobs</div>
                <div className="text-gray-400 text-sm">Discover freelancing opportunities</div>
              </button>
              
              <button
                onClick={() => navigate("/about")}
                className="p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors text-left"
              >
                <div className="text-[#A95BAB] font-medium mb-1">About Us</div>
                <div className="text-gray-400 text-sm">Learn more about PhsarDesign</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
