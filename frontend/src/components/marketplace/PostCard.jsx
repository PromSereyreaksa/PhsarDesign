"use client"
import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

const PostCard = ({ post }) => {
  const navigate = useNavigate()

  // Navigate to details page
  const handleViewDetails = () => {
    const slugified = (post.title || "post")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    navigate(`/marketplace/${slugified}`)
  }

  // Price display
  const formatPrice = (budget) => (budget ? `$${budget}` : "Price negotiable")

  // Get image URLs
  const getImageUrls = (attachments) => {
    if (!attachments) return []
    if (!Array.isArray(attachments)) attachments = [attachments]
    return attachments
      .map((att) => (typeof att === "string" ? att : att.url || att.src || att.path || att.link))
      .filter(Boolean)
  }

  const imageUrls = getImageUrls(post.attachments || post.attachment)
  const mainImageUrl = imageUrls[0] || null

  const getPosterInfo = () => {
    // For availability posts (artist posts)
    if (post.artist?.user) {
      return {
        name: `${post.artist.user.firstName} ${post.artist.user.lastName}`,
        avatar: post.artist.avatar,
        type: "artist",
      }
    }

    // For job posts (client posts) - try multiple possible data structures
    if (post.client?.user) {
      return {
        name: `${post.client.user.firstName} ${post.client.user.lastName}`,
        avatar: post.client.avatar || post.client.user.avatar,
        type: "client",
      }
    }

    // Fallback: try to get user info directly from post
    if (post.user) {
      return {
        name: `${post.user.firstName} ${post.user.lastName}`,
        avatar: post.user.avatar,
        type: post.postType === "job" ? "client" : "artist",
      }
    }

    // Fallback: try to get creator info from post
    if (post.createdBy) {
      return {
        name: `${post.createdBy.firstName} ${post.createdBy.lastName}`,
        avatar: post.createdBy.avatar,
        type: post.postType === "job" ? "client" : "artist",
      }
    }

    // Final fallback
    return {
      name: post.postType === "job" ? "Client" : "Artist",
      avatar: null,
      type: post.postType === "job" ? "client" : "artist",
    }
  }

  const posterInfo = getPosterInfo()

  // Skills
  const skills = post.skills || post.skillRequired || ""

  const getPostTypeLabel = () => {
    if (post.postType === "job") return "Job Post"
    if (post.postType === "availability") return "Service"
    // Fallback detection based on fields
    if (post.deadline || post.budgetType || post.experienceLevel) return "Job Post"
    return "Service"
  }

  return (
    <div className="group relative h-full">
      <div
        className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:backdrop-blur-xl hover:shadow-2xl hover:shadow-white/5 hover:-translate-y-2 hover:scale-[1.02] h-full flex flex-col"
        onClick={handleViewDetails}
      >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          {mainImageUrl ? (
            <img src={mainImageUrl || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-4xl">
              {posterInfo.type === "client" ? "💼" : "🎨"}
            </div>
          )}

          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs font-medium">
              {getPostTypeLabel()}
            </span>
          </div>

          <div className="absolute top-3 right-3">
            <div className="w-10 h-10 rounded-full border-2 border-white/20 backdrop-blur-sm bg-white/10 overflow-hidden flex items-center justify-center">
              {posterInfo.avatar ? (
                <img
                  src={posterInfo.avatar || "/placeholder.svg"}
                  alt={posterInfo.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-sm font-bold">{posterInfo.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-3 flex-1 flex flex-col">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-white line-clamp-2">{post.title}</h3>
            <div className="text-[#A95BAB] font-bold text-lg">{formatPrice(post.budget)}</div>
          </div>

          <p className="text-gray-400 text-sm line-clamp-3">{post.description || "No description available"}</p>

          {skills && (
            <div className="flex flex-wrap gap-1 pt-2">
              {skills
                .split(",")
                .slice(0, 3)
                .map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300 border border-white/20"
                  >
                    {skill.trim()}
                  </span>
                ))}
            </div>
          )}

          <div className="mt-auto pt-3 flex justify-between items-center border-t border-white/10">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">
                {posterInfo.type === "client" ? "Posted by" : "by"} {posterInfo.name}
              </span>
              {posterInfo.type === "client" && (
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                  Client
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          {/* View details button */}
          <button className="w-full flex items-center justify-center space-x-2 py-2.5 mt-2 bg-gradient-to-r from-[#A95BAB]/20 to-[#A95BAB]/10 border border-[#A95BAB]/30 rounded-xl text-[#A95BAB] font-medium text-sm backdrop-blur-sm transition-all duration-300">
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostCard
