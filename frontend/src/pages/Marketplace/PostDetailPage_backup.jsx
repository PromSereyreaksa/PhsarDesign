"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Clock, Star, MapPin, User, ChevronLeft, ChevronRight, Tag } from "lucide-react"
import { useAppDispatch, useAppSelector } from "../../hook/useRedux"
import { fetchPostById, clearCurrentPost, fetchPosts } from "../../store/slices/marketplaceSlice"
import PostCard from "../../components/marketplace/PostCard"
import AuthNavbar from "../../components/layout/navigation/AuthNavbar"

const PostDetailPage = () => {
  const { slug } = useP              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-700/50">
                <button className="flex-1 py-3 px-6 bg-gradient-to-r from-[#A95BAB] to-[#A95BAB]/80 rounded-xl text-white font-semibold transition-all duration-300 hover:from-[#A95BAB]/90 hover:to-[#A95BAB]/70 transform hover:scale-105">
                  Contact Artist
                </button>
                <button className="flex-1 py-3 px-6 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-gray-300 font-semibold hover:text-white hover:border-gray-500/60 transition-all">
                  Save Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetailPage
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentPost, posts, loading, error } = useAppSelector((state) => state.marketplace)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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
        <div className="pt-20 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="inline-flex items-center space-x-2 mb-8 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:border-gray-600/60 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Marketplace</span>
            </button>

            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A95BAB] mb-4"></div>
              <p className="text-lg text-gray-300">Loading post details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="pt-20 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="inline-flex items-center space-x-2 mb-8 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:border-gray-600/60 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Marketplace</span>
            </button>

            <div className="text-center py-16">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-2xl font-bold mb-2 text-white">Error loading post</h3>
              <p className="text-gray-400 mb-6">{error}</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    const postId = slug.split('-').pop()
                    dispatch(fetchPostById(postId))
                  }}
                  className="px-6 py-3 bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold text-white"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentPost) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="pt-20 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
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
    setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <AuthNavbar />
      
      {/* Back Button */}
      <div className="pt-28 px-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={handleBack}
            className="inline-flex items-center space-x-2 mb-8 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:border-gray-600/60 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Large Square Carousel */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-2xl overflow-hidden">
              {imageUrls.length > 0 ? (
                <>
                  <img
                    src={imageUrls[currentImageIndex]}
                    alt={currentPost.title}
                    className="w-full h-full object-cover"
                  />
                  
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
                          onClick={() => setCurrentImageIndex(index)}
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
                    onClick={() => setCurrentImageIndex(index)}
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
            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-2xl p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full border-2 border-gray-700/40 overflow-hidden">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={artistName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#A95BAB]/80 to-[#A95BAB]/60 flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">{artistName}</h3>
                  <p className="text-gray-400">Creative Professional</p>
                  {currentPost.artist?.rating && (
                    <div className="flex items-center space-x-1 mt-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-300">{currentPost.artist.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
              <p className="text-gray-300 leading-relaxed">
                {currentPost.description || "No description available for this post."}
              </p>
            </div>

            {/* Skills */}
            {currentPost.skills && (
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Tag className="w-5 h-5" />
                  <span>Skills Required</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentPost.skills.split(',').map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-gray-700/50 backdrop-blur-sm rounded-full text-sm text-gray-300 border border-gray-600/30"
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
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">
                More from {artistName}
              </h2>
              <span className="text-gray-400 text-sm">
                {sameArtistPosts.length} more post{sameArtistPosts.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sameArtistPosts.slice(0, 6).map((post) => (
                <PostCard key={post.postId} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
            {/* Image Section */}
            {imageUrls.length > 0 && (
              <div className="relative h-80 md:h-96 overflow-hidden">
                <img
                  src={imageUrls[currentImageIndex]}
                  alt={currentPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Navigation arrows for carousel */}
                {imageUrls.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                
                {/* Category badge */}
                <div className="absolute top-6 left-6">
                  <span className="px-3 py-1 bg-black/30 backdrop-blur-sm border border-white/10 rounded-full text-white text-sm font-medium">
                    {currentPost.category?.name || "Service"}
                  </span>
                </div>

                {/* Image indicators */}
                {imageUrls.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                    {imageUrls.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Multiple images counter */}
                {imageUrls.length > 1 && (
                  <div className="absolute bottom-6 right-6">
                    <div className="flex items-center space-x-1 px-3 py-1 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white text-sm">{currentImageIndex + 1} of {imageUrls.length}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Thumbnail Strip */}
            {imageUrls.length > 1 && (
              <div className="px-8 py-4">
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {imageUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
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
              </div>
            )}

            {/* Content Section */}
            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {currentPost.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Posted {new Date(currentPost.createdAt).toLocaleDateString()}</span>
                    </div>
                    {currentPost.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{currentPost.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#A95BAB] mb-1">
                    {formatPrice(currentPost.budget)}
                  </div>
                  <span className="text-gray-400 text-sm">Budget</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed">
                    {currentPost.description || "No description available"}
                  </p>
                </div>
              </div>

              {/* Skills */}
              {currentPost.skills && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentPost.skills.split(',').map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-gray-700/50 backdrop-blur-sm rounded-lg text-sm text-gray-300 border border-gray-600/30"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Artist Info */}
              <div className="border-t border-gray-700/50 pt-8">
                <h3 className="text-lg font-semibold text-white mb-4">Posted by</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full border-2 border-gray-600/50 backdrop-blur-sm bg-gray-800/50 overflow-hidden">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={artistName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#A95BAB]/80 to-[#A95BAB]/60 flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">{artistName}</h4>
                    {currentPost.artist?.rating && (
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-gray-300">{currentPost.artist.rating}</span>
                        </div>
                        <span className="text-gray-500 text-sm">• Professional</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-700/50">
                <button className="flex-1 py-3 px-6 bg-gradient-to-r from-[#A95BAB] to-[#A95BAB]/80 rounded-xl text-white font-semibold transition-all duration-300 hover:from-[#A95BAB]/90 hover:to-[#A95BAB]/70 transform hover:scale-105">
                  Contact Artist
}

export default PostDetailPage
