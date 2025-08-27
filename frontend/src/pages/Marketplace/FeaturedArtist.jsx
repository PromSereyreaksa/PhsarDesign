import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTopRatedArtists } from '../../store/api/artistsAPI'

const FeaturedArtists = () => {
  const [topArtists, setTopArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  
  // Track image load states for each artist
  const [imageLoadStates, setImageLoadStates] = useState({})
  
  // Debug: Track renders and mounts
  const renderCount = useRef(0)
  const mountCount = useRef(0)
  
  console.log(`🔄 FeaturedArtists RENDER #${++renderCount.current}`)

  useEffect(() => {
    console.log(`🚀 FeaturedArtists MOUNTED #${++mountCount.current}`)
    
    const fetchTopArtists = async () => {
      try {
        console.log('🔄 Starting fetchTopArtists...')
        setLoading(true)
        const artists = await getTopRatedArtists()
        console.log('✅ Got artists in component:', artists)
        
        setTopArtists(artists)
        setError(null)
        
        // Initialize image load states
        const loadStates = {}
        artists.forEach((artist, index) => {
          loadStates[index] = { main: false, avatar: false }
        })
        setImageLoadStates(loadStates)
        
      } catch (err) {
        console.error('❌ Failed to fetch top artists:', err)
        setError('Failed to load artists. Please try again later.')
      } finally {
        setLoading(false)
        console.log('✅ fetchTopArtists completed')
      }
    }

    fetchTopArtists()
    
    return () => {
      console.log('🧹 FeaturedArtists UNMOUNTED')
    }
  }, [])

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-yellow-400">☆</span>)
      } else {
        stars.push(<span key={i} className="text-gray-500">★</span>)
      }
    }
    return stars
  }

  const handleMainImageLoad = (index) => {
    setImageLoadStates(prev => ({
      ...prev,
      [index]: { ...prev[index], main: true }
    }))
  }

  const handleMainImageError = (index) => {
    setImageLoadStates(prev => ({
      ...prev,
      [index]: { ...prev[index], main: false }
    }))
  }

  const handleAvatarImageLoad = (index) => {
    setImageLoadStates(prev => ({
      ...prev,
      [index]: { ...prev[index], avatar: true }
    }))
  }

  const handleAvatarImageError = (index) => {
    setImageLoadStates(prev => ({
      ...prev,
      [index]: { ...prev[index], avatar: false }
    }))
  }

  // Get artist display name
  const getArtistName = (artist, index) => {
    if (artist.user && (artist.user.firstName || artist.user.lastName)) {
      const fullName = `${artist.user.firstName || ''} ${artist.user.lastName || ''}`.trim()
      return fullName || `Artist ${index + 1}`
    }
    return artist.name || `Artist ${index + 1}`
  }

  // Get artist avatar URL - prioritize API data over local images
  const getArtistImageUrl = (artist, index) => {
    // Try API provided URLs first - check user object first since that's where the data is
    const apiImageUrl = artist.user?.avatarURL || 
                       artist.user?.avatar || 
                       artist.user?.profilePicture ||
                       artist.avatarURL || 
                       artist.avatar || 
                       artist.profileImage

    console.log(`🖼️ Artist ${index + 1} image URL:`, apiImageUrl)

    if (apiImageUrl && (apiImageUrl.startsWith('http') || apiImageUrl.startsWith('/'))) {
      return apiImageUrl
    }
    
    // Fallback to local images
    return `/image/Artist${index + 1}.jpg`
  }

  if (loading) {
    return (
      <div className="mt-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="text-center flex-1">
              <h2 className="text-2xl md:text-3xl font-bold">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Featured Artists
                </span>
              </h2>
              <p className="text-gray-400 mt-2">Discover exceptional creative talent</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="relative group overflow-hidden rounded-xl bg-gray-800/20 backdrop-blur border border-gray-700/50 animate-pulse"
              >
                <div className="aspect-video bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-[#A95BAB] hover:text-[#A95BAB]/80"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <h2 className="text-2xl md:text-3xl font-bold">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Featured Artists
              </span>
            </h2>
            <p className="text-gray-400 mt-2">Discover exceptional creative talent</p>
          </div>
          <button
            onClick={() => navigate('/home#artists')}
            className="text-[#A95BAB] hover:text-[#A95BAB]/80 font-medium text-sm transition-colors"
          >
            See All →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topArtists.length > 0 ? (
            topArtists.map((artist, index) => {
              const artistName = getArtistName(artist, index)
              const imageUrl = getArtistImageUrl(artist, index)
              const isMainImageLoaded = imageLoadStates[index]?.main
              const isAvatarLoaded = imageLoadStates[index]?.avatar
              
              return (
                <div
                  key={artist.id || artist.artistId || index}
                  className="bg-white/5 hover:bg-white/10 rounded-2xl overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-500 ease-out"
                  onClick={() => {
                    const artistId = artist.artistId || artist.id;
                    const userId = artist.user?.userId || artist.userId;
                    
                    if (artistId) {
                      navigate(`/profile/artist/${artistId}`);
                    } else if (userId) {
                      navigate(`/profile/artist/${userId}`);
                    } else {
                      console.warn('No valid artist ID found for navigation:', artist);
                    }
                  }}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="relative overflow-hidden h-80 rounded-2xl">
                    {/* Gradient background - always present as fallback */}
                    <div 
                      className="absolute inset-0 w-full h-full bg-gradient-to-br flex items-center justify-center"
                      style={{ 
                        background: `linear-gradient(135deg, ${
                          index === 0 ? '#A95BAB, #8B5A96' : 
                          index === 1 ? '#6366F1, #8B5CF6' : 
                          '#EC4899, #F97316'
                        })`,
                        zIndex: 1
                      }}
                    >
                      <div className="text-center text-white">
                        <div className="text-6xl mb-4">🎨</div>
                        <p className="text-lg font-semibold">{artistName}</p>
                        <p className="text-sm opacity-75 mt-2">
                          {artist.specialty || artist.category || 'Creative Professional'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Main artist image - overlays the gradient when loaded */}
                    <img
                      src={imageUrl}
                      alt={artistName}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                      loading="lazy"
                      style={{ zIndex: 2 }}
                      onLoad={(e) => {
                        console.log(`✅ Artist ${index + 1} main image loaded:`, imageUrl);
                        e.target.style.opacity = '1';
                        handleMainImageLoad(index);
                      }}
                      onError={(e) => {
                        console.log(`❌ Artist ${index + 1} main image failed:`, imageUrl);
                        e.target.style.display = 'none';
                        handleMainImageError(index);
                      }}
                    />
                    
                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-500 ease-out" style={{ zIndex: 3 }} />

                    <div className="absolute top-4 left-4 z-10" style={{ zIndex: 4 }}>
                      <span className="px-3 py-1 bg-[#A95BAB]/20 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                        #{index + 1} Top Rated
                      </span>
                    </div>

                    {/* Hover overlay with artist info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out bg-gradient-to-t from-black/80 to-transparent" style={{ zIndex: 4 }}>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-[#A95BAB] to-[#8B5A96] flex items-center justify-center relative">
                          {/* Gradient background with initial */}
                          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                            {(artist.user?.firstName?.[0] || artistName[0] || 'A').toUpperCase()}
                          </div>
                          {/* Avatar image that overlays the gradient */}
                          <img
                            src={imageUrl}
                            alt={artistName}
                            className="absolute inset-0 w-full h-full object-cover"
                            onLoad={(e) => {
                              console.log(`✅ Artist ${index + 1} avatar loaded:`, imageUrl);
                              e.target.style.opacity = '1';
                            }}
                            onError={(e) => {
                              console.log(`❌ Artist ${index + 1} avatar failed:`, imageUrl);
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{artistName}</h3>
                          <p className="text-xs text-gray-300">
                            {artist.specialty || 
                             artist.category || 
                             (artist.user?.bio?.length > 30 ? 
                               artist.user.bio.substring(0, 30) + '...' : 
                               artist.user?.bio) || 
                             'Creative Professional'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 mb-2">
                        {renderStars(artist.averageRating || 0)}
                        <span className="text-xs ml-1">
                          {artist.averageRating > 0 ? artist.averageRating : 'New'}
                        </span>
                      </div>

                      {artist.reviewCount > 0 && (
                        <span className="inline-block px-2 py-1 bg-[#A95BAB]/20 rounded-full text-xs">
                          {artist.reviewCount} review{artist.reviewCount !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            // Fallback content when no artists found - show local artist images
            [1, 2, 3].map((item) => (
              <div
                key={`fallback-${item}`}
                className="bg-white/5 hover:bg-white/10 rounded-2xl overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-500 ease-out"
                style={{ animationDelay: `${item * 0.2}s` }}
              >
                <div className="relative overflow-hidden h-80 rounded-2xl">
                  <img
                    src={`/image/Artist${item}.jpg`}
                    alt={`Featured Artist ${item}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    loading="lazy"
                    onError={(e) => {
                      // If local image fails, show gradient fallback
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 hidden items-center justify-center">
                    <div className="text-center text-gray-300">
                      <div className="text-4xl mb-2">🎨</div>
                      <p className="text-sm">Featured Artist {item}</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 ease-out" />

                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-[#A95BAB]/20 rounded-full text-xs text-white font-medium">
                      #{item} Top Rated
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-600">
                        <img
                          src={`/image/Artist${item}.jpg`}
                          alt={`Featured Artist ${item}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.style.background = 'linear-gradient(135deg, #6B7280, #4B5563)';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">Featured Artist {item}</h3>
                        <p className="text-xs text-gray-300">Creative Professional</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 mb-2">
                      {renderStars(5)} {/* Show 5 stars for fallback */}
                      <span className="text-xs ml-1">5.0</span>
                    </div>

                    <span className="inline-block px-2 py-1 bg-[#A95BAB]/20 rounded-full text-xs">
                      Portfolio
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default FeaturedArtists