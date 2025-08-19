"use client"

import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Search, ArrowLeft } from "lucide-react"
import { useAppDispatch, useAppSelector } from "../../hook/useRedux"
import { fetchPosts, setFilters } from "../../store/slices/marketplaceSlice"
import MarketplaceFilters from "../../components/marketplace/MarketplaceFilters"
import PostCard from "../../components/marketplace/PostCard"
import AuthNavbar from "../../components/layout/navigation/AuthNavbar"
import Loader from "../../components/ui/Loader"

const MarketplacePage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { posts, loading, error, filters } = useAppSelector((state) => state.marketplace)

  // Check URL params for category filtering
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const category = params.get('category')
    const section = params.get('section')
    
    if (category || section) {
      const newFilters = { ...filters }
      if (category) newFilters.category = category
      if (section) newFilters.section = section
      dispatch(setFilters(newFilters))
    }
  }, [location.search, dispatch])

  useEffect(() => {
    dispatch(fetchPosts(filters))
  }, [dispatch, filters])

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
          <Loader />
          <p className="text-lg text-gray-300 mt-4">Loading marketplace...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
          <p className="text-lg mb-4 text-gray-300">Error loading marketplace: {error}</p>
          <button
            onClick={() => dispatch(fetchPosts(filters))}
            className="px-8 py-3 bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <AuthNavbar />

      {/* Hero Section */}
      <div className="pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-6">
          <button
            onClick={() => navigate('/home')}
            className="inline-flex items-center text-gray-300 hover:text-[#A95BAB] mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </button>
        </div>
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Marketplace
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover talented artists and quality services
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 px-6">
          <div className="flex flex-col md:flex-row gap-4 max-w-5xl mx-auto">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search services or artists..."
                  value={filters.search || ""}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/30 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-[#A95BAB]/50 focus:ring-1 focus:ring-[#A95BAB]/50 transition-all"
                />
              </div>
            </div>

            {/* Filter Type */}
            <div className="flex bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-1">
              <button
                onClick={() => handleFilterChange({ section: "services" })}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  (filters.section || "services") === "services"
                    ? "bg-[#A95BAB]/20 text-[#A95BAB] border border-[#A95BAB]/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Services
              </button>
              <button
                onClick={() => handleFilterChange({ section: "jobs" })}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.section === "jobs"
                    ? "bg-[#A95BAB]/20 text-[#A95BAB] border border-[#A95BAB]/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Jobs
              </button>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center space-x-3">
              <select
                value={filters.category || ""}
                onChange={(e) => handleFilterChange({ category: e.target.value })}
                className="px-4 py-3 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white text-sm focus:border-[#A95BAB]/50 focus:ring-1 focus:ring-[#A95BAB]/50 transition-all appearance-none bg-no-repeat bg-right pr-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1rem'
                }}
              >
                <option value="">All Categories</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Web Design">Web Design</option>
                <option value="Logo Design">Logo Design</option>
                <option value="Photography">Photography</option>
                <option value="Animation">Animation</option>
              </select>

              <select
                value={filters.sortBy || "newest"}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                className="px-4 py-3 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white text-sm focus:border-[#A95BAB]/50 focus:ring-1 focus:ring-[#A95BAB]/50 transition-all appearance-none bg-no-repeat bg-right pr-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1rem'
                }}
              >
                <option value="newest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="price_asc">Price: Low</option>
                <option value="price_desc">Price: High</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Posts Grid */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {(filters.section || "services") === "services" ? "Popular Services" : "Freelancing Opportunities"}
              </h2>
              
            </div>
            {posts.length > 9 && (
              <button 
                onClick={() => {
                  // Remove the 9-item limit by showing all posts
                  const params = new URLSearchParams()
                  if (filters.category) params.set('category', filters.category)
                  if (filters.section) params.set('section', filters.section)
                  if (filters.search) params.set('search', filters.search)
                  params.set('showAll', 'true')
                  navigate(`/marketplace?${params.toString()}`)
                }}
                className="text-[#A95BAB] hover:text-[#A95BAB]/80 font-medium text-sm transition-colors"
              >
                See All →
              </button>
            )}
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold mb-2 text-white">No posts found</h3>
              <p className="text-gray-400">Try adjusting your filters or check back later for new opportunities.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(location.search.includes('showAll=true') ? posts : posts.slice(0, 9)).map((post) => (
                <PostCard key={post.postId} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Featured Artists Section */}
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
                onClick={() => {
                  // Navigate to artists section
                  navigate('/home#artists')
                }}
                className="text-[#A95BAB] hover:text-[#A95BAB]/80 font-medium text-sm transition-colors"
              >
                See All →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="relative group overflow-hidden rounded-xl bg-gray-800/20 backdrop-blur border border-gray-700/50 hover:border-gray-600/60 transition-all duration-300"
                >
                  <div className="aspect-video">
                    <img
                      src={`/artist-portfolio.png?height=200&width=300&query=artist portfolio ${item}`}
                      alt={`Featured work ${item}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-[#A95BAB]/80 text-white text-sm rounded-full font-medium">Featured</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  )
}

export default MarketplacePage
