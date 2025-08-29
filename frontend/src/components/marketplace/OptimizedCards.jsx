import { Clock, DollarSign, MapPin, Star } from 'lucide-react'
import { memo, useMemo } from 'react'
import OptimizedImage from '../ui/OptimizedImage'

/**
 * Optimized Post Card with semantic HTML and performance optimizations
 */
const PostCard = memo(({
  post,
  onCardClick,
  onApplyClick,
  showApplyButton = true,
  className = '',
  priority = false
}) => {
  // Memoize computed values
  const formattedBudget = useMemo(() => {
    if (!post.budget) return 'Price negotiable'
    return `$${post.budget}${post.budgetType === 'Hourly Rate' ? '/hr' : ''}`
  }, [post.budget, post.budgetType])

  const formattedDate = useMemo(() => {
    if (!post.createdAt) return ''
    return new Date(post.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }, [post.createdAt])

  const posterName = useMemo(() => {
    if (post.artist?.firstName && post.artist?.lastName) {
      return `${post.artist.firstName} ${post.artist.lastName}`
    }
    if (post.client?.organizationName) {
      return post.client.organizationName
    }
    if (post.client?.user?.firstName && post.client?.user?.lastName) {
      return `${post.client.user.firstName} ${post.client.user.lastName}`
    }
    return 'Anonymous'
  }, [post.artist, post.client])

  const skillsArray = useMemo(() => {
    if (!post.skillRequired) return []
    return post.skillRequired.split(',').map(skill => skill.trim()).slice(0, 3)
  }, [post.skillRequired])

  const mainImage = useMemo(() => {
    if (post.attachment && post.attachment.length > 0) {
      return post.attachment[0].url || post.attachment[0]
    }
    return '/api/placeholder/300/200'
  }, [post.attachment])

  const handleCardClick = (e) => {
    e.preventDefault()
    onCardClick?.(post)
  }

  const handleApplyClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onApplyClick?.(post)
  }

  return (
    <article 
      className={`
        group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 
        backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden 
        hover:border-[#A95BAB]/50 transition-all duration-300 cursor-pointer
        hover:shadow-lg hover:shadow-[#A95BAB]/10 hover:-translate-y-1
        ${className}
      `}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick(e)
        }
      }}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <OptimizedImage
          src={mainImage}
          alt={`${post.title} preview`}
          width={300}
          height={160}
          priority={priority}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Category Badge */}
        {post.category && (
          <div className="absolute top-3 left-3">
            <span className="bg-[#A95BAB]/90 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
              {typeof post.category === 'string' ? post.category : post.category.name}
            </span>
          </div>
        )}
        
        {/* Experience Level Badge */}
        {post.experienceLevel && (
          <div className="absolute top-3 right-3">
            <span className="bg-green-500/90 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
              {post.experienceLevel}
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Price */}
        <header className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-white text-lg line-clamp-2 group-hover:text-[#A95BAB] transition-colors">
            {post.title}
          </h3>
          <div className="flex items-center text-green-400 font-medium text-sm shrink-0">
            <DollarSign className="w-4 h-4" />
            <span>{formattedBudget}</span>
          </div>
        </header>
        
        {/* Description */}
        <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
          {post.description}
        </p>
        
        {/* Skills */}
        {skillsArray.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skillsArray.map((skill, index) => (
              <span 
                key={index}
                className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full text-xs border border-gray-600/30"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
        
        {/* Footer */}
        <footer className="pt-3 border-t border-gray-700/30">
          <div className="flex justify-between items-center mb-3 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{post.location || 'Remote'}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <time dateTime={post.createdAt}>{formattedDate}</time>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            {/* Poster Info */}
            <div className="flex items-center gap-2">
              {(post.artist?.avatarURL || post.client?.user?.avatarURL) && (
                <OptimizedImage
                  src={post.artist?.avatarURL || post.client?.user?.avatarURL}
                  alt={`${posterName} avatar`}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="text-gray-300 text-sm font-medium">{posterName}</span>
            </div>
            
            {/* Apply Button */}
            {showApplyButton && (
              <button
                onClick={handleApplyClick}
                className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#A95BAB]/50"
                aria-label={`Apply for ${post.title}`}
              >
                Apply Now
              </button>
            )}
          </div>
        </footer>
      </div>
    </article>
  )
})

PostCard.displayName = 'PostCard'

/**
 * Optimized Artist Card
 */
export const ArtistCard = memo(({
  artist,
  onCardClick,
  onContactClick,
  className = '',
  priority = false
}) => {
  const fullName = useMemo(() => {
    return `${artist.firstName || ''} ${artist.lastName || ''}`.trim() || 'Anonymous Artist'
  }, [artist.firstName, artist.lastName])

  const specialtiesArray = useMemo(() => {
    if (!artist.specialties) return []
    return artist.specialties.split(',').map(s => s.trim()).slice(0, 3)
  }, [artist.specialties])

  const skillsArray = useMemo(() => {
    if (!artist.skills) return []
    return artist.skills.split(',').map(s => s.trim()).slice(0, 4)
  }, [artist.skills])

  const rating = useMemo(() => {
    return artist.rating || 4.5
  }, [artist.rating])

  const handleCardClick = (e) => {
    e.preventDefault()
    onCardClick?.(artist)
  }

  const handleContactClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onContactClick?.(artist)
  }

  return (
    <article
      className={`
        group bg-gradient-to-br from-gray-800/50 to-gray-900/50 
        backdrop-blur-sm border border-gray-700/50 rounded-xl p-6
        hover:border-[#A95BAB]/50 transition-all duration-300 cursor-pointer
        hover:shadow-lg hover:shadow-[#A95BAB]/10 hover:-translate-y-1
        ${className}
      `}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick(e)
        }
      }}
    >
      {/* Artist Info */}
      <header className="flex items-center gap-4 mb-4">
        <OptimizedImage
          src={artist.avatarURL || '/api/placeholder/80/80'}
          alt={`${fullName} profile picture`}
          width={80}
          height={80}
          priority={priority}
          className="w-20 h-20 rounded-full"
        />
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white group-hover:text-[#A95BAB] transition-colors">
            {fullName}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-yellow-400 font-medium">{rating.toFixed(1)}</span>
            <span className="text-gray-400 text-sm ml-1">
              ({artist.reviewCount || 0} reviews)
            </span>
          </div>
        </div>
      </header>
      
      {/* Location */}
      {artist.location && (
        <div className="flex items-center gap-2 text-gray-300 mb-4">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{artist.location}</span>
        </div>
      )}
      
      {/* Bio */}
      {artist.bio && (
        <p className="text-gray-300 text-sm line-clamp-3 mb-4">
          {artist.bio}
        </p>
      )}
      
      {/* Specialties */}
      {specialtiesArray.length > 0 && (
        <div className="mb-4">
          <h4 className="text-gray-400 text-xs uppercase tracking-wide mb-2">Specialties</h4>
          <div className="flex flex-wrap gap-2">
            {specialtiesArray.map((specialty, index) => (
              <span
                key={index}
                className="bg-[#A95BAB]/20 text-[#A95BAB] px-2 py-1 rounded-full text-xs font-medium border border-[#A95BAB]/30"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Skills */}
      {skillsArray.length > 0 && (
        <div className="mb-6">
          <h4 className="text-gray-400 text-xs uppercase tracking-wide mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {skillsArray.map((skill, index) => (
              <span
                key={index}
                className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full text-xs border border-gray-600/30"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Contact Button */}
      <footer>
        <button
          onClick={handleContactClick}
          className="w-full bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#A95BAB]/50"
          aria-label={`Contact ${fullName}`}
        >
          Contact Artist
        </button>
      </footer>
    </article>
  )
})

ArtistCard.displayName = 'ArtistCard'

export default PostCard
