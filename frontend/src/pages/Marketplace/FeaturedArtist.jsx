import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTopRatedArtists } from '../../store/api/artistsAPI'

const FeaturedArtists = () => {
  const [topArtists, setTopArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  
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
      } catch (err) {
        console.error('❌ Failed to fetch top artists:', err)
        setError('Failed to load artists. Please try again later.')
      } finally {
        setLoading(false)
        console.log('✅ fetchTopArtists completed')
      }
    }

    fetchTopArtists()
    
    // Cleanup function to detect unmounts
    return () => {
      console.log('🧹 FeaturedArtists UNMOUNTED')
    }
  }, []) // ✅ Empty dependency array

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
            topArtists.map((artist, index) => (
              <div
                key={artist.id}
                className="bg-white/5 hover:bg-white/10 rounded-2xl overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-500 ease-out"
                onClick={() => navigate(`/artist/${artist.slug || artist.id}`)}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="relative overflow-hidden h-80 rounded-2xl">
                  <img
                    src={artist.profileImage || artist.avatar}
                    alt={artist.name || `Artist ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 ease-out" />

                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-[#A95BAB]/20 rounded-full text-xs text-white font-medium">
                      #{index + 1} Top Rated
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-600">
                        <img
                          src={artist.profileImage || artist.avatar}
                          alt={artist.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">
                          {artist.name || `Featured Artist ${index + 1}`}
                        </h3>
                        <p className="text-xs text-gray-300">
                          {artist.specialty || artist.category || artist.bio?.substring(0, 30) + '...' || 'Creative Professional'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 mb-2">
                      {renderStars(artist.averageRating)}
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
            ))
          ) : (
            // Fallback content when no artists found
            [1, 2, 3].map((item) => (
              <div
                key={`fallback-${item}`}
                className="bg-white/5 hover:bg-white/10 rounded-2xl overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-500 ease-out"
                style={{ animationDelay: `${item * 0.2}s` }}
              >
                <div className="relative overflow-hidden h-80 rounded-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                    <div className="text-center text-gray-300">
                      <div className="text-4xl mb-2">🎨</div>
                      <p className="text-sm">Featured Artist {item}</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 ease-out" />

                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-block px-2 py-1 bg-[#A95BAB]/20 rounded-full text-xs text-white">
                      Featured
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <h3 className="font-semibold text-sm mb-1">Featured Artist {item}</h3>
                    <p className="text-xs text-gray-300">Creative Professional</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-[#A95BAB]/20 rounded-full text-xs">
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