"use client"

import { useState } from "react"
import { Eye, Heart, MessageCircle, Crown } from "lucide-react"
import { contactArtistFromPost } from "../../../store/api/marketplaceAPI"

const PostDetail = ({ post }) => {
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactMessage, setContactMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleContact = async () => {
    if (!contactMessage.trim()) {
      setShowContactForm(true)
      return
    }

    setIsSubmitting(true)
    try {
      await contactArtistFromPost(post.postId, contactMessage)
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
    if (typeof attachment === 'string') {
      return attachment;
    } else if (attachment && typeof attachment === 'object') {
      return attachment.url || attachment.src || attachment.path || attachment.link;
    }
    return null;
  }

  const portfolioSamples = post.attachments 
    ? post.attachments.map(attachment => getImageUrl(attachment)).filter(Boolean)
    : [
        "/portfolio-sample-1.png",
        "/portfolio-sample-2.png", 
        "/portfolio-sample-3.png",
        "/portfolio-sample-4.png",
      ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Side - Image */}
          <div className="bg-gray-800/20 backdrop-blur border border-gray-700/50 rounded-2xl p-8 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-[#A95BAB] to-[#A95BAB]/80 rounded-full flex items-center justify-center">
              <Crown className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="bg-gray-800/20 backdrop-blur border border-gray-700/50 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#A95BAB] to-[#A95BAB]/80 rounded-full flex items-center justify-center">
                  <img
                    src={post.artistAvatar || "/placeholder.svg?height=50&width=50&query=artist avatar"}
                    alt="Artist"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{post.artistName || "Artist Name"}</h3>
                  <p className="text-gray-300 text-sm">{post.artistTitle || "Professional Designer"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400 font-medium">Available</span>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-white">{post.title || "We need a banner"}</h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <span className="text-sm text-gray-400">Price</span>
                  <div className="text-lg font-semibold text-[#A95BAB]">
                    {formatPrice(post.budgetMin, post.budgetMax)}
                  </div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <span className="text-sm text-gray-400">Deadline</span>
                  <div className="text-lg font-semibold text-white">{post.duration || "1 week"}</div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <span className="text-sm text-gray-400">Location</span>
                  <div className="text-lg font-semibold text-white">{post.location || "Remote"}</div>
                </div>
              </div>

              <div>
                <p className="text-gray-300 leading-relaxed">
                  {post.description ||
                    "I'm looking for a clean and professional banner for our company website. The banner will be used across multiple platforms and should be eye-catching. We need someone who can deliver high-quality work within the specified timeframe."}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Required Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {(post.skills || ["Design", "Photoshop", "Branding", "Creative Direction"]).map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
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
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Portfolio Samples</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {portfolioSamples.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className="relative group bg-gray-800/20 backdrop-blur border border-gray-700/50 rounded-xl overflow-hidden hover:border-[#A95BAB]/50 transition-all duration-300"
              >
                <div className="aspect-square">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Portfolio sample ${index + 1}`}
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
