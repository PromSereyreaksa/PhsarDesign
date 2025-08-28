"use client"

import { ArrowLeft, Clock, MapPin, Star, Tag, User } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AuthNavbar from "../../components/layout/AuthNavbar"
import SimplePostCard from "../../components/marketplace/SimplePostCard"
import Loader from "../../components/ui/Loader"
import { MultiStepApplicationModal } from "../../components/ui/MultiStepApplicationModal"
import { showToast } from "../../components/ui/toast"
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux"
import {
    clearCurrentPost,
    fetchPostById,
    fetchPostBySlug,
    fetchPosts,
} from "../../store/slices/marketplaceSlice"

const PostDetailPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { currentPost, posts, loading, error } = useAppSelector(
    (state) => state.marketplace
  )
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)

  // 🔹 Load post (by ID or slug)
  useEffect(() => {
    if (slug) {
      const parts = slug.split("-")
      const lastPart = parts[parts.length - 1]

      if (lastPart && !isNaN(Number(lastPart))) {
        dispatch(fetchPostById({ postId: parseInt(lastPart), postType: "auto" }))
      } else {
        dispatch(fetchPostBySlug(slug))
      }
    }

    return () => {
      dispatch(clearCurrentPost())
    }
  }, [dispatch, slug])

  // 🔹 Fetch other posts by same artist for related section
  useEffect(() => {
    if (currentPost?.artist?.artistId) {
      dispatch(fetchPosts({ artistId: currentPost.artist.artistId }))
    }
  }, [dispatch, currentPost?.artist?.artistId])

  const handleBack = () => navigate("/marketplace")

  const formatPrice = (budget) =>
    budget ? `$${budget}` : "Price negotiable"

  // 🔹 Extract all possible image URLs from attachments
  const getImageUrls = (attachments) => {
    if (!attachments || !Array.isArray(attachments)) return []
    return attachments
      .map((att) =>
        typeof att === "string"
          ? att
          : att?.url || att?.src || att?.path || att?.link
      )
      .filter(Boolean)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
          <Loader />
          <p className="text-lg text-gray-300 mt-4">Loading post details...</p>
        </div>
      </div>
    )
  }

  if (error || !currentPost) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="pt-28 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <button
              onClick={handleBack}
              className="inline-flex items-center space-x-2 mb-8 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:border-gray-600/60 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Marketplace</span>
            </button>

            <div className="text-center py-16">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Error Loading Post
              </h2>
              <p className="text-lg text-gray-300 mb-4">
                {error || "The post may have been removed."}
              </p>
              <button
                onClick={() => navigate("/marketplace")}
                className="px-8 py-3 bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold text-white"
              >
                Browse Marketplace
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const imageUrls = getImageUrls(currentPost.attachments)
  const artistName = currentPost?.artist?.user
    ? `${currentPost.artist.user.firstName} ${currentPost.artist.user.lastName}`
    : "Artist"
  const avatarUrl = currentPost?.artist?.avatar || null

  // 🔹 Related posts
  const relatedPosts =
    posts?.filter(
      (post) =>
        post.artist?.artistId === currentPost?.artist?.artistId &&
        post.slug !== slug
    ) || []

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <AuthNavbar />

      <div className="pt-28 max-w-7xl mx-auto px-6 pb-12">
        <button
          onClick={handleBack}
          className="inline-flex items-center space-x-2 mb-8 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:border-gray-600/60 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        {/* Post Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Image */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-2xl overflow-hidden flex items-center justify-center">
              {imageUrls.length > 0 ? (
                <img
                  src={imageUrls[0]}
                  alt={currentPost.title}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-8xl">🎨</div>
              )}
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-white">
              {currentPost.title}
            </h1>
            <div className="text-3xl font-bold text-[#A95BAB]">
              {formatPrice(currentPost.budget)}
            </div>

            {currentPost.category && (
              <span className="inline-block mt-2 px-3 py-1 bg-gray-700/50 rounded-full text-sm text-gray-300">
                {currentPost.category.name}
              </span>
            )}

            <div className="flex items-center space-x-4 text-sm text-gray-400 my-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>
                  {new Date(currentPost.createdAt).toLocaleDateString()}
                </span>
              </div>
              {currentPost.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{currentPost.location}</span>
                </div>
              )}
            </div>

            {/* Artist Info */}
            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-2xl p-4 flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full border-2 border-gray-700/40 overflow-hidden">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={artistName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#A95BAB]/80 to-[#A95BAB]/60 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white">{artistName}</h3>
                <p className="text-sm text-gray-400">Creative Professional</p>
                {currentPost.artist?.rating && (
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-300">
                      {currentPost.artist.rating}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-base font-medium text-white">Description</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {currentPost.description || "No description available."}
              </p>
            </div>

            {/* Skills */}
            {currentPost.skills && (
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-2xl p-4">
                <h3 className="text-base font-medium text-white mb-3 flex items-center space-x-2">
                  <Tag className="w-4 h-4" />
                  <span>Skills Required</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentPost.skills.split(",").map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300 border border-gray-600/30"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {currentPost.postType === "job" ||
              currentPost.jobId ||
              currentPost.client ? (
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      showToast("Please login to apply for this job", "error")
                      return
                    }
                    setIsApplicationModalOpen(true)
                  }}
                  className="w-full py-4 bg-gradient-to-r from-[#A95BAB] to-[#A95BAB]/80 rounded-xl text-white font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[#A95BAB]/20 cursor-pointer"
                >
                  {!isAuthenticated ? "Login to Apply for Job" : "Apply for Job"}
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      showToast("Please login to contact this artist", "error")
                      return
                    }
                    setIsApplicationModalOpen(true)
                  }}
                  className="w-full py-4 bg-gradient-to-r from-[#A95BAB] to-[#A95BAB]/80 rounded-xl text-white font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[#A95BAB]/20 cursor-pointer"
                >
                  {!isAuthenticated
                    ? "Login to Contact Artist"
                    : "Contact Artist"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">
              More from this Artist
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.slice(0, 3).map((post) => (
                <SimplePostCard key={post.id || post.jobId} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Application Modal */}
      <MultiStepApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        post={currentPost}
        applicationType={
          currentPost?.postType === "job" ||
          currentPost?.jobId ||
          currentPost?.client
            ? "artist_to_job"
            : "client_to_service"
        }
        onSuccess={() => {
          setIsApplicationModalOpen(false)
          const message =
            currentPost?.postType === "job" ||
            currentPost?.jobId ||
            currentPost?.client
              ? "Your job application has been submitted successfully!"
              : "Your service request has been sent to the artist successfully!"
          showToast(message, "success")
        }}
      />
    </div>
  )
}

export default PostDetailPage
