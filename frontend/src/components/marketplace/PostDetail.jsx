"use client"

import { useState } from "react"
import { Eye, Heart, MessageCircle, Crown, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { contactArtistFromPost } from "../../store/api/marketplaceAPI"

const PostDetail = ({ post }) => {
  const navigate = useNavigate()
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactMessage, setContactMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getPosterInfo = () => {
    console.log("[v0] PostDetail - Full post object:", post)
    console.log("[v0] PostDetail - Post keys:", Object.keys(post || {}))

    // Check all possible user data locations in the post object
    const possibleUserSources = [
      post.client?.user,
      post.client,
      post.artist?.user,
      post.artist,
      post.postedBy,
      post.user,
      post.createdBy,
      post.author,
      post.owner,
      post.clientInfo,
      post.artistInfo,
    ].filter(Boolean)

    console.log("[v0] PostDetail - Possible user sources found:", possibleUserSources)

    let userInfo = null
    let role = "artist" // default

    // Try to find user info from any available source
    for (const source of possibleUserSources) {
      if (source && (source.firstName || source.name || source.username || source.email)) {
        userInfo = source
        break
      }
    }

    // Determine role based on post type or available data
    if (post.postType === "job" || post.type === "job" || post.jobId) {
      role = "client"
    } else if (post.postType === "availability" || post.type === "availability" || post.availabilityId) {
      role = "artist"
    }

    console.log("[v0] PostDetail - Found user info:", userInfo)
    console.log("[v0] PostDetail - Determined role:", role)

    if (!userInfo) {
      console.warn("[v0] PostDetail - No user info found in post object")
      return {
        id: null,
        name: role === "client" ? "Anonymous Client" : "Anonymous Artist",
        avatar: null,
        role,
        title: role === "client" ? "Client" : "Creative Professional",
      }
    }

    // Extract name with comprehensive fallback options
    let name = `Anonymous ${role === "client" ? "Client" : "Artist"}`
    if (userInfo.firstName && userInfo.lastName) {
      name = `${userInfo.firstName} ${userInfo.lastName}`
    } else if (userInfo.name) {
      name = userInfo.name
    } else if (userInfo.username) {
      name = userInfo.username
    } else if (userInfo.email) {
      name = userInfo.email.split("@")[0]
    }

    // Extract title with better fallbacks
    let title = role === "client" ? "Client" : "Creative Professional"
    if (userInfo.title) {
      title = userInfo.title
    } else if (userInfo.profession) {
      title = userInfo.profession
    } else if (userInfo.jobTitle) {
      title = userInfo.jobTitle
    } else if (userInfo.role) {
      title = userInfo.role
    } else if (userInfo.specialization) {
      title = userInfo.specialization
    }

    return {
      id: userInfo.userId || userInfo.id || userInfo.clientId || userInfo.artistId,
      name,
      avatar: userInfo.avatar || userInfo.avatarURL || userInfo.profileImage || userInfo.photo || userInfo.picture,
      role,
      title,
    }
  }

  const handlePosterClick = () => {
    const posterInfo = getPosterInfo()
    console.log("[v0] PostDetail - Navigating to poster profile:", posterInfo)

    if (posterInfo.id) {
      if (posterInfo.role === "client") {
        navigate(`/profile/client/${posterInfo.id}`)
      } else {
        navigate(`/profile/artist/${posterInfo.id}`)
      }
    } else {
      console.warn("[v0] PostDetail - No poster ID found, cannot navigate to profile")
    }
  }

  const handleContact = async () => {
    if (!contactMessage.trim()) {
      setShowContactForm(true)
      return
    }

    setIsSubmitting(true)
    try {
      await contactArtistFromPost(post.jobId, contactMessage)
      alert("Message sent successfully!")
      setShowContactForm(false)
      setContactMessage("")
    } catch (error) {
      alert("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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

  // Handle different attachment structures for portfolio samples
  const getImageUrl = (attachment) => {
    if (typeof attachment === "string") {
      return attachment
    } else if (attachment && typeof attachment === "object") {
      return attachment.url || attachment.src || attachment.path || attachment.link
    }
    return null
  }

  const portfolioSamples = post.attachments
    ? post.attachments.map((attachment) => getImageUrl(attachment)).filter(Boolean)
    : ["/portfolio-sample-1.png", "/portfolio-sample-2.png", "/portfolio-sample-3.png", "/portfolio-sample-4.png"]

  const posterInfo = getPosterInfo()

  console.log("[v0] PostDetail - Final poster info:", posterInfo)

  const formatDate = (dateString) => {
    if (!dateString) return null

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return dateString // Return original if invalid date

      // Format as YYYY-MM-DD
      return date.toISOString().split("T")[0]
    } catch (error) {
      console.warn("[v0] PostDetail - Error formatting date:", error)
      return dateString
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Side - Image */}
          <div className="bg-gray-800/20 backdrop-blur border border-gray-700/50 rounded-2xl p-8 flex items-center justify-center">
            {post.image || post.thumbnail || post.coverImage ? (
              <img
                src={post.image || post.thumbnail || post.coverImage || post.attachments[0]}
                alt={post.title || "Post image"}
                className="w-full h-full object-cover rounded-lg max-h-96"
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-[#A95BAB] to-[#A95BAB]/80 rounded-full flex items-center justify-center">
                <Crown className="w-16 h-16 text-white" />
              </div>
            )}
          </div>

          {/* Right Side - Details */}
          <div className="bg-gray-800/20 backdrop-blur border border-gray-700/50 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6 bg-gray-700/20 rounded-lg p-4 border border-gray-600/30">
              <div
                className="flex items-center space-x-4 cursor-pointer hover:bg-gray-700/30 rounded-lg p-3 -m-3 transition-all duration-200 flex-1"
                onClick={handlePosterClick}
                title={`View ${posterInfo.name}'s profile`}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#A95BAB] to-[#A95BAB]/80 rounded-full flex items-center justify-center overflow-hidden border-2 border-[#A95BAB]/30">
                  {posterInfo.avatar ? (
                    <img
                      src={posterInfo.avatar || "/placeholder.svg"}
                      alt={posterInfo.name}
                      className="w-14 h-14 rounded-full object-cover"
                      onError={(e) => {
                        console.log("[v0] PostDetail - Avatar failed to load, showing fallback")
                        e.target.style.display = "none"
                        e.target.nextSibling.style.display = "flex"
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center ${posterInfo.avatar ? "hidden" : "flex"}`}
                  >
                    <User className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-white hover:text-[#A95BAB] transition-colors">
                      {posterInfo.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        posterInfo.role === "client"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      }`}
                    >
                      {posterInfo.role === "client" ? "Client" : "Artist"}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm font-medium">{posterInfo.title}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {posterInfo.role === "client" ? "Looking for services" : "Offering services"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400 font-medium">Available</span>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-white">{post.title || post.jobTitle || "Untitled Post"}</h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <span className="text-sm text-gray-400">Price</span>
                  <div className="text-lg font-semibold text-[#A95BAB]">
                    {post.budget || formatPrice(post.budgetMin, post.budgetMax) || post.price || "Price negotiable"}
                  </div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <span className="text-sm text-gray-400">Deadline</span>
                  <div className="text-lg font-semibold text-white">
                    {formatDate(post.deadline) ||
                      formatDate(post.dueDate) ||
                      post.duration ||
                      post.timeframe ||
                      "To be discussed"}
                  </div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <span className="text-sm text-gray-400">Location</span>
                  <div className="text-lg font-semibold text-white">
                    {post.location || post.workLocation || "Remote"}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-gray-300 leading-relaxed">
                  {post.description || post.jobDescription || post.details || "No description provided."}
                </p>
              </div>

              {(post.skills || post.requirements || post.tags) && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">
                    {post.postType === "job" ? "Required Skills:" : "Skills Offered:"}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(post.skills || post.requirements || post.tags || []).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                {!showContactForm ? (
                  <button
                    className="w-full px-6 py-3 bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold"
                    onClick={() => setShowContactForm(true)}
                  >
                    Contact now
                  </button>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      placeholder="Write your message here..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all resize-none"
                    />
                    <div className="flex space-x-3">
                      <button
                        className="flex-1 px-6 py-3 bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white rounded-lg transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleContact}
                        disabled={isSubmitting || !contactMessage.trim()}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </button>
                      <button
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 font-semibold"
                        onClick={() => setShowContactForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-700/50">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{post.views || 0} views</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{post.likes || 0} likes</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{post.responses || 0} responses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Section */}
        {post.attachments && post.attachments.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">
              {post.postType === "job" ? "Reference Images" : "Portfolio Samples"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {portfolioSamples.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className="relative group bg-gray-800/20 backdrop-blur border border-gray-700/50 rounded-xl overflow-hidden hover:border-[#A95BAB]/50 transition-all duration-300"
                >
                  <div className="aspect-square">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${post.postType === "job" ? "Reference" : "Portfolio"} ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-[#A95BAB] text-white rounded-lg transition-all duration-300 transform scale-90 group-hover:scale-100">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Similar Opportunities</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-gray-800/20 backdrop-blur border border-gray-700/50 rounded-xl overflow-hidden hover:border-[#A95BAB]/50 transition-all duration-300 group cursor-pointer"
              >
                <div className="aspect-video bg-gradient-to-br from-[#A95BAB]/20 to-[#A95BAB]/10 flex items-center justify-center">
                  <Crown className="w-8 h-8 text-[#A95BAB]" />
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-[#A95BAB] transition-colors">
                    Similar Project {item}
                  </h4>
                  <p className="text-[#A95BAB] font-semibold mb-2">$50-$150</p>
                  <p className="text-gray-300 text-sm">Looking for creative design work...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetail
