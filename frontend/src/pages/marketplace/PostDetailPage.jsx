"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Clock, Star, MapPin, User, ChevronLeft, ChevronRight, Tag } from "lucide-react"
import { useAppDispatch, useAppSelector } from "../../shared/hooks/useRedux"
import { fetchPostById, clearCurrentPost, fetchPosts } from "../../store/slices/marketplaceSlice"
import PostCard from "../../shared/components/marketplace/PostCard"
import SimplePostCard from "../../shared/components/marketplace/SimplePostCard"
import AuthNavbar from "../../shared/components/layout/navigation/AuthNavbar"
import PostDetail from "../../shared/components/marketplace/PostDetail"
import Loader from "../../shared/components/ui/Loader"

const PostDetailPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentPost, posts, loading, error } = useAppSelector((state) => state.marketplace)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [slideDirection, setSlideDirection] = useState('') // 'left' or 'right'

  useEffect(() => {
    if (slug) {
      // Extract postId from slug (format: title-slug-postId)
      const postId = slug.split('-').pop()
      dispatch(fetchPostById(postId))
    }

    return () => {
      dispatch(clearCurrentPost())
    }
  }, [dispatch, slug])

  // Fetch posts by the same artist when currentPost is loaded
  useEffect(() => {
    if (currentPost?.artist?.artistId) {
      // Fetch other posts by the same artist
      dispatch(fetchPosts({ artistId: currentPost.artist.artistId }))
    }
  }, [dispatch, currentPost?.artist?.artistId])

  const handleBack = () => {
    navigate("/marketplace")
  }

  const formatPrice = (budget) => {
    if (budget) {
      return `$${budget}`
    }
    return "Price negotiable"
  }

  // Get all image URLs from attachments
  const getImageUrls = (attachments) => {
    if (!attachments || !Array.isArray(attachments)) return []
    
    return attachments.map(attachment => {
      if (typeof attachment === 'string') {
        return attachment
      } else if (attachment && typeof attachment === 'object') {
        return attachment.url || attachment.src || attachment.path || attachment.link
      }
      return null
    }).filter(Boolean)
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
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleBack}
              className="inline-flex items-center space-x-2 mb-8 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:border-gray-600/60 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Marketplace</span>
            </button>

            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold mb-2 text-white">Post not found</h3>
              <p className="text-gray-400">The post you're looking for doesn't exist or may have been removed.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const imageUrls = getImageUrls(currentPost?.attachments)
  const artistName = currentPost?.artist?.user ? `${currentPost.artist.user.firstName} ${currentPost.artist.user.lastName}` : "Artist"
  const avatarUrl = currentPost?.artist?.avatar || null
  
  // Filter posts by the same artist (excluding current post)
  const sameArtistPosts = posts.filter(post => 
    post.artist?.artistId === currentPost?.artist?.artistId && 
    post.postId !== currentPost?.postId
  )

  const nextImage = () => {
    if (isAnimating || imageUrls.length <= 1) return
    setIsAnimating(true)
    setSlideDirection('right')
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length)
      setTimeout(() => {
        setSlideDirection('')
        setIsAnimating(false)
      }, 50)
    }, 300)
  }

  const prevImage = () => {
    if (isAnimating || imageUrls.length <= 1) return
    setIsAnimating(true)
    setSlideDirection('left')
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length)
      setTimeout(() => {
        setSlideDirection('')
        setIsAnimating(false)
      }, 50)
    }, 300)
  }

  const handleThumbnailClick = (targetIndex) => {
    if (isAnimating || targetIndex === currentImageIndex || imageUrls.length <= 1) return
    setIsAnimating(true)
    const direction = targetIndex > currentImageIndex ? 'right' : 'left'
    setSlideDirection(direction)
    setTimeout(() => {
      setCurrentImageIndex(targetIndex)
      setTimeout(() => {
        setSlideDirection('')
        setIsAnimating(false)
      }, 50)
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <AuthNavbar />
      
      {/* Main Content Grid */}
      <div className="pt-28 max-w-7xl mx-auto px-6 pb-12">
        {/* Back Button - aligned with the carousel */}
        <button
          onClick={handleBack}
          className="inline-flex items-center space-x-2 mb-8 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:border-gray-600/60 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Large Square Carousel */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-2xl overflow-hidden">
              {imageUrls.length > 0 ? (
                <>
                  <div className="relative w-full h-full">
                    {/* Image Container with clean slide animation */}
                    <div className="relative w-full h-full overflow-hidden">
                      <div 
                        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${
                          slideDirection === 'right' ? '-translate-x-full opacity-0' :
                          slideDirection === 'left' ? 'translate-x-full opacity-0' :
                          'translate-x-0 opacity-100'
                        }`}
                      >
                        <img
                          src={imageUrls[currentImageIndex]}
                          alt={`${currentPost.title} ${currentImageIndex + 1}`}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Navigation Arrows */}
                  {imageUrls.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {imageUrls.length > 1 && (
                    <div className="absolute top-4 right-4">
                      <div className="px-3 py-1 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm">
                        {currentImageIndex + 1} / {imageUrls.length}
                      </div>
                    </div>
                  )}

                  {/* Image Indicators */}
                  {imageUrls.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                      {imageUrls.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handleThumbnailClick(index)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-700/50 to-gray-800/50 flex items-center justify-center">
                  <div className="text-8xl">🎨</div>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {imageUrls.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      index === currentImageIndex ? 'border-[#A95BAB]' : 'border-gray-700/40'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`${currentPost.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Details and Actions */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl font-bold text-white flex-1 pr-4">
                  {currentPost.title}
                </h1>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#A95BAB]">
                    {formatPrice(currentPost.budget)}
                  </div>
                  {currentPost.category && (
                    <span className="inline-block mt-2 px-3 py-1 bg-gray-700/50 rounded-full text-sm text-gray-300">
                      {currentPost.category.name || currentPost.category}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Meta Info */}
              <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(currentPost.createdAt).toLocaleDateString()}</span>
                </div>
                {currentPost.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{currentPost.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Artist Info */}
            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-2xl p-4">
              <div className="flex items-center space-x-3">
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
                      <span className="text-xs text-gray-300">{currentPost.artist.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description - no background, just text */}
            <div className="space-y-2">
              <h3 className="text-base font-medium text-white">Description</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {currentPost.description || "No description available for this post."}
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
                  {currentPost.skills.split(',').map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-700/50 backdrop-blur-sm rounded-full text-xs text-gray-300 border border-gray-600/30"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full py-4 bg-gradient-to-r from-[#A95BAB] to-[#A95BAB]/80 rounded-xl text-white font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[#A95BAB]/20">
                Contact Artist
              </button>
              <button className="w-full py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-300 font-medium transition-all duration-300 hover:bg-gray-700/50 hover:border-gray-600/50">
                Save to Favorites
              </button>
            </div>
          </div>
        </div>

        {/* More from this Artist Section */}
        {sameArtistPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">
              More from {artistName}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sameArtistPosts.slice(0, 3).map((post) => (
                <SimplePostCard key={post.postId} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostDetailPage
