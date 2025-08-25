"use client"
import { ArrowRight, Briefcase, MessageCircle } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../hook/useRedux"
import { ApplicationModal } from "../ui/ApplicationModal"
import { showToast } from "../ui/toast"

const PostCard = ({ post }) => {
  const navigate = useNavigate()
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  // Navigate to details page
  const handleViewDetails = (e) => {
    e.stopPropagation() // Prevent triggering when clicking buttons
    const slugified = (post.title || "post")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Use ID-based routing to ensure we can fetch the post reliably
    const postId = post.jobId || post.id || post._id || post.postId;
    if (postId) {
      navigate(`/marketplace/${slugified}-${postId}`);
    } else {
      console.error('No valid post ID found for navigation:', post);
      // Fallback to slug-only navigation
      navigate(`/marketplace/${slugified}`);
    }
  };

  // Handle application form
  const handleApplication = (e) => {
    e.stopPropagation() // Prevent triggering card click
    if (!isAuthenticated) {
      const isJobPost = post.postType === "job" || post.jobId || post.client
      const message = isJobPost 
        ? "Please login to apply for this job" 
        : "Please login to contact this artist"
      showToast(message, 'error')
      return
    }
    setIsApplicationModalOpen(true)
  }

  // Determine if this is a job post or artist service
  const isJobPost = post.postType === "job" || post.jobId || post.client

  // Price display
  const formatPrice = (budget) => budget ? `$${budget}` : "Price negotiable"

  // Get image URLs
  const getImageUrls = (attachments) => {
    if (!attachments) return []
    if (!Array.isArray(attachments)) attachments = [attachments]
    return attachments
      .map(att => typeof att === "string" ? att : att.url || att.src || att.path || att.link)
      .filter(Boolean)
  }

  const imageUrls = getImageUrls(post.attachments || post.attachment)
  const mainImageUrl = imageUrls[0] || null

  // Artist / client info
  const artistName = post.artist?.user
    ? `${post.artist.user.firstName} ${post.artist.user.lastName}`
    : post.client?.user
      ? `${post.client.user.firstName} ${post.client.user.lastName}`
      : "Artist"

  const avatarUrl = post.artist?.avatar || post.client?.avatar || null

  // Skills
  const skills = post.skills || post.skillRequired || ""

  return (
    <>
      <div className="group relative h-full">
        <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:backdrop-blur-xl hover:shadow-2xl hover:shadow-white/5 hover:-translate-y-2 hover:scale-[1.02] h-full flex flex-col" onClick={handleViewDetails}>
          {/* Image Section */}
          <div className="relative h-48 overflow-hidden">
            {mainImageUrl ? (
              <img src={mainImageUrl} alt={post.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center text-4xl">🎨</div>
            )}

            {/* Category badge */}
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs font-medium">
                {post.category?.name || (isJobPost ? "Job" : "Service")}
              </span>
            </div>

            {/* Artist avatar */}
            <div className="absolute top-3 right-3">
              <div className="w-10 h-10 rounded-full border-2 border-white/20 backdrop-blur-sm bg-white/10 overflow-hidden flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={artistName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-sm font-bold">{artistName.charAt(0)}</span>
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
                {skills.split(",").slice(0, 3).map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300 border border-white/20">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Artist info and date */}
            <div className="mt-auto pt-3 flex justify-between items-center border-t border-white/10">
              <span className="text-sm text-gray-300">by {artistName}</span>
              <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-3">
              <button 
                onClick={handleApplication}
                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer ${
                  isJobPost 
                    ? 'bg-gradient-to-r from-[#A95BAB] to-[#A95BAB]/80 text-white hover:shadow-lg hover:shadow-[#A95BAB]/20'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/20'
                }`}
              >
                {isJobPost ? <Briefcase className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
                <span>{isJobPost ? 'Apply' : 'Contact'}</span>
              </button>
              
              <button 
                onClick={handleViewDetails}
                className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-gradient-to-r from-[#A95BAB]/20 to-[#A95BAB]/10 border border-[#A95BAB]/30 rounded-xl text-[#A95BAB] font-medium text-sm backdrop-blur-sm transition-all duration-300 hover:from-[#A95BAB]/30 hover:to-[#A95BAB]/20 cursor-pointer"
              >
                <span>Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        post={post}
        applicationType={isJobPost ? "artist_to_job" : "client_to_service"}
        onSuccess={() => {
          setIsApplicationModalOpen(false)
          const message = isJobPost
            ? "Your job application has been submitted successfully!"
            : "Your service request has been sent to the artist successfully!"
          showToast(message, 'success')
        }}
      />
    </>
  )
}

export default PostCard