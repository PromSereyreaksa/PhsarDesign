import { ArrowLeft, Code, Users, Wrench } from "lucide-react"
import { useNavigate } from "react-router-dom"
import AuthNavbar from "../../components/layout/AuthNavbar"
import SharedPublicNavbar from "../../components/layout/SharedPublicNavbar"
import { useSelector } from "react-redux"

const CommunityPage = () => {
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
          {/* Back Button */}
          <div className="mb-8 text-left">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center text-gray-300 hover:text-[#A95BAB] transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
          </div>

          {/* Under Development Illustration */}
          <div className="mb-8">
            <div className="flex justify-center items-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-r from-[#A95BAB]/20 to-blue-500/20 rounded-full flex items-center justify-center mb-4">
                  <Wrench className="w-16 h-16 text-[#A95BAB]" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Code className="w-4 h-4 text-yellow-400" />
                </div>
              </div>
            </div>
            <div className="text-6xl mb-6">🚧</div>
          </div>

          {/* Main Content */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Community
              </span>
            </h1>
            <div className="inline-flex items-center px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-6">
              <Wrench className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-yellow-400 font-medium text-sm">Under Development</span>
            </div>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              We're building something amazing for our community! This feature is currently under development and will be available soon.
            </p>
          </div>

          {/* Features Coming Soon */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">What's Coming</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <Users className="w-8 h-8 text-[#A95BAB] mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Community Forums</h3>
                <p className="text-gray-400 text-sm">Connect with other artists and clients, share experiences, and get advice.</p>
              </div>
              
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <div className="text-2xl mb-3">💬</div>
                <h3 className="text-white font-semibold mb-2">Discussion Boards</h3>
                <p className="text-gray-400 text-sm">Participate in topic-based discussions about design trends and techniques.</p>
              </div>
              
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <div className="text-2xl mb-3">🎨</div>
                <h3 className="text-white font-semibold mb-2">Showcase Gallery</h3>
                <p className="text-gray-400 text-sm">Share your work and get feedback from the community.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={handleGoHome}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#A95BAB] to-[#A95BAB]/80 hover:from-[#A95BAB]/90 hover:to-[#A95BAB]/70 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#A95BAB]/25"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {user ? "Back to Home" : "Back to Landing"}
            </button>

            <button
              onClick={handleBrowseMarketplace}
              className="inline-flex items-center px-6 py-3 bg-blue-600/80 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
            >
              <Users className="w-5 h-5 mr-2" />
              Browse Marketplace
            </button>
          </div>

          {/* Stay Updated */}
          <div className="bg-gradient-to-r from-[#A95BAB]/10 to-blue-500/10 border border-[#A95BAB]/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              Stay Updated
            </h3>
            <p className="text-gray-300 mb-4">
              Want to be notified when the community features go live? Keep using PhsarDesign and we'll notify you!
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-[#A95BAB]/20 text-[#A95BAB] rounded-full text-sm font-medium">
                Coming Soon
              </span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                2024 Q4
              </span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                Free to Use
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityPage
