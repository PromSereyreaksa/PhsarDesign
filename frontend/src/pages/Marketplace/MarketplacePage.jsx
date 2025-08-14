"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../hook/useRedux"
import { fetchPosts, setFilters } from "../../store/slices/marketplaceSlice"
import MarketplaceFilters from "../../components/marketplace/MarketplaceFilters"
import PostCard from "../../components/marketplace/PostCard"
import SectionHeader from "../../components/common/SectionHeader"
import MarketplaceNav from "../../components/marketplace/MarketplaceNav"

const MarketplacePage = () => {
  const dispatch = useAppDispatch()
  const { posts, loading, error, filters } = useAppSelector((state) => state.marketplace)

  useEffect(() => {
    dispatch(fetchPosts(filters))
  }, [dispatch, filters])

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <MarketplaceNav />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A95BAB] mb-4"></div>
          <p className="text-lg text-gray-300">Loading marketplace...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <MarketplaceNav />
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
      <MarketplaceNav />

      {/* Hero Section */}
      <div className="relative pt-20 pb-12 flex items-center justify-center">
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">
              Creative
            </span>
            <span className="text-white"> Marketplace</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">Discover amazing opportunities and connect with talented artists</p>
        </div>
      </div>

      {/* Filters */}
      <MarketplaceFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Creative Opportunities</h2>
            <p className="text-gray-300">{posts.length} jobs available</p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16 text-white">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold mb-2 text-white">No posts found</h3>
              <p className="text-gray-400">Try adjusting your filters or check back later for new opportunities.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {posts.map((post) => (
                <PostCard key={post.postId} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Featured Artists Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              <span className="bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">
                Featured Artists
              </span>
            </h2>
            <p className="text-gray-300 mt-2">Discover exceptional creative talent</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="relative group overflow-hidden rounded-xl bg-gray-800/20 backdrop-blur border border-gray-700/50 hover:border-[#A95BAB]/50 transition-all duration-300">
                <div className="aspect-video">
                  <img
                    src={`/artist-portfolio.png?height=200&width=300&query=artist portfolio ${item}`}
                    alt={`Featured work ${item}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-[#A95BAB] text-white text-sm rounded-full font-medium">Featured</span>
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
