"use client"
import { Briefcase, MessageCircle } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../hook/useRedux"
import { MultiStepApplicationModal } from "../ui/MultiStepApplicationModal"
import { showToast } from "../ui/toast"

const PostCard = ({ post }) => {
  const navigate = useNavigate()
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  // Navigate to details page
  const handleViewDetails = (e) => {
    e?.stopPropagation?.()
    const slugified = (post.title || "post")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Use ID-based routing to ensure we can fetch the post reliably
    const postId = post.jobId || post.id || post._id || post.postId
    if (postId) {
      navigate(`/marketplace/${slugified}-${postId}`)
    } else {
      navigate(`/marketplace/${slugified}`)
    }
  }

  // Handle application form
  const handleApplication = (e) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      const isJobPost = post.postType === "job" || post.jobId || post.client
      const message = isJobPost
        ? "Please login to apply for this job"
        : "Please login to contact this artist"
      showToast(message, "error")
      return
    }
    setIsApplicationModalOpen(true)
  }

  // Determine if this is a job post or artist service
  const isJobPost = post.postType === "job" || post.jobId || post.client

  // Price display
  const formatPrice = (budget) => (budget ? `$${budget}` : "Price negotiable")

  // Image handling
  const getImageUrls = (attachments) => {
    if (!attachments) return []
    return Array.isArray(attachments)
      ? attachments
          .map((att) =>
            typeof att === "string" ? att : att?.url || att?.path
          )
          .filter(Boolean)
      : []
  }

  const imageUrls = getImageUrls(post.images || post.attachments)
  const mainImageUrl = imageUrls[0] || post.image || post.thumbnail

  // Get poster information
  const getPosterInfo = () => {
    if (post.client?.user) {
      return {
        name: `${post.client.user.firstName} ${post.client.user.lastName}`,
        avatar: post.client.avatar || post.client.user.avatar,
        type: "client",
      }
    }
    
    if (post.artist?.user) {
      return {
        name: `${post.artist.user.firstName} ${post.artist.user.lastName}`,
        avatar: post.artist.avatar || post.artist.user.avatar,
        type: post.postType === "job" ? "client" : "artist",
      }
    }
    
    if (post.user) {
      return {
        name: `${post.user.firstName} ${post.user.lastName}`,
        avatar: post.user.avatar,
        type: post.postType === "job" ? "client" : "artist",
      }
    }
    
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
    if (post.deadline || post.budgetType || post.experienceLevel) return "Job Post"
    return "Service"
  }

  return (
    <>
      <div className="group relative h-full">
        <div
          className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/5 hover:-translate-y-1 h-full flex flex-col"
          onClick={handleViewDetails}
        >
          {/* Image Section - Better size for wider cards */}
          <div className="relative h-48 overflow-hidden">
            {mainImageUrl ? (
              <img
                src={mainImageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            {/* Fallback when no image or image fails to load */}
            <div 
              className={`w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-3xl ${mainImageUrl ? 'hidden' : 'flex'}`}
              style={{ display: mainImageUrl ? 'none' : 'flex' }}
            >
              {posterInfo.type === "client" ? "💼" : "🎨"}
            </div>

            {/* Category badge */}
            <div className="absolute top-2 left-2">
              <span className="px-2 py-0.5 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs font-medium">
                {post.category?.name || getPostTypeLabel()}
              </span>
            </div>

            {/* Poster avatar */}
            <div className="absolute top-2 right-2">
              <div className="w-8 h-8 rounded-full border-2 border-white/20 backdrop-blur-sm bg-white/10 overflow-hidden flex items-center justify-center">
                {posterInfo.avatar ? (
                  <img
                    src={posterInfo.avatar}
                    alt={posterInfo.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-xs font-bold">
                    {posterInfo.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content Section - More comfortable spacing for wider cards */}
          <div className="p-4 space-y-3 flex-1 flex flex-col">
            <div className="flex justify-between items-start">
              <h3 className="text-base font-semibold text-white line-clamp-2 flex-1 mr-2">
                {post.title}
              </h3>
              <div className="text-[#A95BAB] font-bold text-base whitespace-nowrap">
                {formatPrice(post.budget)}
              </div>
            </div>

            <p className="text-gray-400 text-sm line-clamp-2">
              {post.description || "No description available"}
            </p>

            {skills && (
              <div className="flex flex-wrap gap-1 pt-1">
                {skills
                  .split(",")
                  .slice(0, 2)
                  .map((skill, index) => (
                    <span
                      key={index}
                      className="px-1.5 py-0.5 bg-white/10 rounded-full text-xs text-gray-300 border border-white/20"
                    >
                      {skill.trim()}
                    </span>
                  ))}
              </div>
            )}

            {/* Poster info & date */}
            <div className="mt-auto pt-2 flex justify-between items-center border-t border-white/10">
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-300 truncate">
                  {posterInfo.type === "client" ? "Posted by" : "by"}{" "}
                  {posterInfo.name}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Action button */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleApplication}
                className={`w-full flex items-center justify-center space-x-1 py-2 rounded-lg font-medium text-sm transition-all duration-300 cursor-pointer ${
                  isJobPost
                    ? "bg-gradient-to-r from-[#A95BAB] to-[#A95BAB]/80 text-white hover:shadow-lg hover:shadow-[#A95BAB]/20"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/20"
                }`}
              >
                {isJobPost ? (
                  <Briefcase className="w-4 h-4" />
                ) : (
                  <MessageCircle className="w-4 h-4" />
                )}
                <span>{isJobPost ? "Apply" : "Contact"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <MultiStepApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        post={post}
      />
    </>
  )
}

export default PostCard
