"use client"
import { useNavigate } from "react-router-dom"
import { Sparkles, Clock, Star, ArrowRight } from "lucide-react"

const PostCard = ({ post }) => {
  const navigate = useNavigate()

  const handleViewDetails = () => {
    navigate(`/marketplace/${post.postId}`)
  }

  const handleContact = (e) => {
    e.stopPropagation()
    // Handle contact logic
    console.log("Contact artist for post:", post.postId)
  }

  const formatPrice = (min, max) => {
    if (min && max) {
      return `$${min}-$${max}`
    } else if (min) {
      return `From $${min}`
    } else if (max) {
      return `Up to $${max}`
    }
    return "Price negotiable"
  }

  return (
    <div
      className="bg-gray-800/20 backdrop-blur border border-gray-700/50 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:bg-gray-800/40 hover:scale-105 hover:border-[#A95BAB]/50 hover:shadow-lg hover:shadow-[#A95BAB]/10 group"
      onClick={handleViewDetails}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#A95BAB] to-[#A95BAB]/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-400 font-medium">Available</span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#A95BAB] transition-colors">{post.title || "We need a banner"}</h3>
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold text-[#A95BAB]">{formatPrice(post.budgetMin, post.budgetMax)}</div>
          <div className="flex items-center space-x-1 text-sm text-gray-400">
            <Clock className="w-3 h-3" />
            <span>Deadline: {post.duration || "1 week"}</span>
          </div>
        </div>

        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          {post.description?.substring(0, 100) ||
            "Looking for a clean and professional banner for our company website. The banner will be used across multiple platforms and should be eye-catching."}
          {post.description?.length > 100 && "..."}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {(post.skills || ["Design", "Photoshop", "Branding"]).slice(0, 3).map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full font-medium">
              {skill}
            </span>
          ))}
          {post.skills?.length > 3 && (
            <span className="px-3 py-1 bg-[#A95BAB] text-white text-xs rounded-full font-medium">+{post.skills.length - 3}</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          className="px-6 py-2 bg-gradient-to-r from-[#A95BAB] to-[#A95BAB]/80 text-white rounded-lg hover:from-[#A95BAB]/90 hover:to-[#A95BAB]/70 transition-all duration-300 font-medium transform hover:scale-105 group"
          onClick={handleContact}
        >
          <span>Contact now</span>
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span className="flex items-center space-x-1">
            <Star className="w-3 h-3" />
            <span>{post.views || 0}</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="text-red-400">♥</span>
            <span>{post.likes || 0}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default PostCard
