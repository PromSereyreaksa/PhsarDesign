"use client"
import { useNavigate } from "react-router-dom"
import { Clock, Star, ArrowRight } from "lucide-react"

const PostCard = ({ post }) => {
  const navigate = useNavigate()

  const handleViewDetails = () => {
    // Create slug from title
    const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    navigate(`/marketplace/${slug}-${post.jobId}`)
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

  const imageUrls = getImageUrls(post.attachments)
  const mainImageUrl = imageUrls.length > 0 ? imageUrls[0] : null
  const artistName = post.artist?.user ? `${post.artist.user.firstName} ${post.artist.user.lastName}` : "Artist"
  const avatarUrl = post.artist?.avatar || null

  return (
    <div className="group relative h-full">
      {/* Softer shining light reflection effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-60 transition-all duration-700 rounded-2xl blur-sm"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/3 opacity-0 group-hover:opacity-70 transition-all duration-500 rounded-2xl"></div>
      
      {/* Softer moving light sweep effect */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out opacity-0 group-hover:opacity-60"></div>
      </div>
      
      <div
        className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:backdrop-blur-xl hover:shadow-2xl hover:shadow-white/5 hover:-translate-y-2 hover:scale-[1.02] h-full flex flex-col"
        onClick={handleViewDetails}
      >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {mainImageUrl ? (
          <img
            src={mainImageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700/50 to-gray-800/50 flex items-center justify-center">
            <div className="text-4xl">🎨</div>
          </div>
        )}
        
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Multiple images indicator */}
        {imageUrls.length > 1 && (
          <div className="absolute bottom-3 right-3">
            <div className="flex items-center space-x-1 px-2 py-1 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-white text-xs">+{imageUrls.length - 1}</span>
            </div>
          </div>
        )}
        
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs font-medium">
            {post.category?.name || "Service"}
          </span>
        </div>

        {/* Artist avatar */}
        <div className="absolute top-3 right-3">
          <div className="w-10 h-10 rounded-full border-2 border-white/20 backdrop-blur-sm bg-white/10 overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={artistName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#A95BAB]/80 to-[#A95BAB]/60 flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {artistName.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-[#A95BAB]/90 transition-colors">
            {post.title}
          </h3>
          <div className="text-right">
            <div className="text-[#A95BAB] font-bold text-lg">
              {formatPrice(post.budget)}
            </div>
          </div>
        </div>

        <p className="text-gray-400 text-sm line-clamp-2">
          {post.description || "No description available"}
        </p>

        {/* Skills - with consistent height */}
        <div className="flex-1">
          {post.skills && (
            <div className="flex flex-wrap gap-1 pt-2">
              {post.skills.split(',').slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-gray-300 border border-white/20"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Artist info */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">by {artistName}</span>
            {post.artist?.rating && (
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-400">{post.artist.rating}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* View details button */}
        <div className="pt-3 mt-auto">
          <button className="w-full flex items-center justify-center space-x-2 py-2.5 bg-gradient-to-r from-[#A95BAB]/20 to-[#A95BAB]/10 border border-[#A95BAB]/30 rounded-xl text-[#A95BAB] font-medium text-sm backdrop-blur-sm transition-all duration-300 group-hover:from-[#A95BAB]/30 group-hover:to-[#A95BAB]/20 group-hover:border-[#A95BAB]/50">
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}

export default PostCard
