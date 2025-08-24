"use client"

import { ArrowLeft, Plus } from "lucide-react"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import AuthNavbar from "../../components/layout/AuthNavbar"
import PostCard from "../../components/marketplace/PostCard.jsx"
import SearchBar from "../../components/marketplace/SearchBar"
import Loader from "../../components/ui/Loader"
import { useAppDispatch, useAppSelector } from "../../hook/useRedux"
import { setFilters } from "../../store/slices/marketplaceSlice"
import {
  fetchAvailabilityPosts,
  fetchJobPosts,
  selectActiveTab,
  selectAvailabilityPosts,
  selectJobPosts,
  setActiveTab,
} from "../../store/slices/postsSlice"
import FeaturedArtists from "./FeaturedArtist"

const MarketplacePage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  // Get data from both slices
  const { filters } = useAppSelector((state) => state.marketplace)

  // Get posts data from posts slice
  const availabilityPosts = useAppSelector(selectAvailabilityPosts)
  const jobPosts = useAppSelector(selectJobPosts)
  const activeTab = useAppSelector(selectActiveTab)

  // Get loading states for both post types
  const { availabilityPostsLoading, jobPostsLoading, availabilityPostsError, jobPostsError } = useAppSelector(
    (state) => state.posts,
  )

  const postsToDisplay = activeTab === "availability" ? availabilityPosts : jobPosts

  // Determine current posts and loading state based on active tab
  const currentPosts = activeTab === "availability" ? availabilityPosts : jobPosts
  const currentLoading = activeTab === "availability" ? availabilityPostsLoading : jobPostsLoading
  const currentError = activeTab === "availability" ? availabilityPostsError : jobPostsError

  // Check URL params for category filtering and post type
  // On URL param change
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const category = params.get("category")
    const section = params.get("section")
    const postType = params.get("type") // 'availability' or 'jobs'

    const newFilters = { ...filters }
    if (category) newFilters.category = category
    if (section) newFilters.section = section

    // **Set default section based on type if section is missing**
    if (!section) {
      if (postType === "jobs") newFilters.section = "jobs"
      if (postType === "availability") newFilters.section = "services"
    }

    dispatch(setFilters(newFilters))

    if (postType && (postType === "availability" || postType === "jobs")) {
      dispatch(setActiveTab(postType))
    } else {
      // default to availability
      dispatch(setActiveTab("availability"))
    }
  }, [location.search])

  // Fetch posts when activeTab or filters change
  useEffect(() => {
    if (activeTab === "availability") {
      console.log("Fetching availability posts with filters:", filters)
      dispatch(fetchAvailabilityPosts(filters))
    } else if (activeTab === "jobs") {
      console.log("Fetching job posts with filters:", filters)
      dispatch(fetchJobPosts(filters))
    }
  }, [activeTab, filters])

  // Handle tab switch
  const handleTabChange = (tabType) => {
    if (tabType === activeTab) return

    console.log(`Switching to ${tabType} tab`)

    dispatch(setActiveTab(tabType))

    // Update filters
    const newFilters = { ...filters }
    if (tabType === "availability") newFilters.section = "services"
    if (tabType === "jobs") newFilters.section = "jobs"
    dispatch(setFilters(newFilters))

    // Update URL
    const params = new URLSearchParams(location.search)
    params.set("type", tabType)
    navigate(`${location.pathname}?${params.toString()}`, { replace: true })

    // Fetch posts
    if (tabType === "availability") dispatch(fetchAvailabilityPosts(newFilters))
    if (tabType === "jobs") dispatch(fetchJobPosts(newFilters))
  }

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters }
    dispatch(setFilters(updatedFilters))

    if (activeTab === "availability") dispatch(fetchAvailabilityPosts(updatedFilters))
    if (activeTab === "jobs") dispatch(fetchJobPosts(updatedFilters))
  }

  if (currentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
          <Loader />
          <p className="text-lg text-gray-300 mt-4">
            Loading {activeTab === "availability" ? "artist posts" : "job posts"}...
          </p>
        </div>
      </div>
    )
  }

  if (currentError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
          <p className="text-lg text-red-400">Error: {currentError}</p>
          <button
            onClick={() =>
              activeTab === "availability"
                ? dispatch(fetchAvailabilityPosts(filters))
                : dispatch(fetchJobPosts(filters))
            }
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
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
            onClick={() => navigate("/home")}
            className="inline-flex items-center text-gray-300 hover:text-[#A95BAB] mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </button>
        </div>
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Marketplace</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Discover talented artists and quality services</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 px-6">
        <div className="flex flex-col md:flex-row gap-4 max-w-5xl mx-auto">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <SearchBar
                type="availability" // or "job"
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Tab Switch */}
          <div className="flex bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-1">
            <button
              onClick={() => handleTabChange("availability")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "availability"
                  ? "bg-[#A95BAB]/20 text-[#A95BAB] border border-[#A95BAB]/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Services
            </button>
            <button
              onClick={() => handleTabChange("jobs")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "jobs"
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
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: "right 0.75rem center",
                backgroundSize: "1rem",
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
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: "right 0.75rem center",
                backgroundSize: "1rem",
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
          {console.log("postsToDisplay:", postsToDisplay, "activeTab:", activeTab)}

          <div>
            <h2 className="text-2xl font-bold text-white">
              {(filters.section || "services") === "services" ? "Popular Services" : "Freelancing Opportunities"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {currentPosts.length > 9 && (
              <button
                onClick={() => {
                  // Remove the 9-item limit by showing all posts
                  const params = new URLSearchParams()
                  if (filters.category) params.set("category", filters.category)
                  if (filters.section) params.set("section", filters.section)
                  if (filters.search) params.set("search", filters.search)
                  params.set("showAll", "true")
                  navigate(`/marketplace?${params.toString()}`)
                }}
                className="text-[#A95BAB] hover:text-[#A95BAB]/80 font-medium text-sm transition-colors"
              >
                See All →
              </button>
            )}

            {activeTab === "availability" ? (
              <button
                onClick={() => navigate("/marketplace/create")}
                className="inline-flex items-center px-4 py-2 bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Service
              </button>
            ) : (
              <button
                onClick={() => navigate("/marketplace/create-job")}
                className="inline-flex items-center px-4 py-2 bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post a Job
              </button>
            )}
          </div>
        </div>

        {!Array.isArray(postsToDisplay) || postsToDisplay.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold mb-2 text-white">No posts found</h3>
            <p className="text-gray-400">Try adjusting your filters or check back later for new opportunities.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(location.search.includes("showAll=true") ? postsToDisplay : postsToDisplay.slice(0, 9)).map((post) => (
              <PostCard key={post.jobId || post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Featured Artists Section */}
      <FeaturedArtists />
    </div>
  )
}

export default MarketplacePage
