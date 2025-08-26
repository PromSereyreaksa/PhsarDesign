"use client";

import { ArrowLeft, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthNavbar from "../../components/layout/AuthNavbar";
import PostCard from "../../components/marketplace/PostCard.jsx";
import SearchBar from "../../components/marketplace/SearchBar";
import Loader from "../../components/ui/Loader";
import Pagination from "../../components/ui/Pagination";
import { useAppDispatch, useAppSelector } from "../../hook/useRedux";

// Import from marketplace slice (now includes categories)
import {
  fetchCategories,
  setFilters
} from "../../store/slices/marketplaceSlice";

// Import from posts slice
import {
  fetchAvailabilityPosts,
  fetchJobPosts,
  selectActiveTab,
  selectAvailabilityPosts,
  selectJobPosts,
  setActiveTab
} from '../../store/slices/postsSlice';

import FeaturedArtists from "./FeaturedArtist";

const MarketplacePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearching, setIsSearching] = useState(false);

  // Get data from marketplace slice (including categories)
  const { 
    filters, 
    categories, 
    categoriesLoading, 
    categoriesError 
  } = useAppSelector((state) => state.marketplace);
  
  // Get posts data from posts slice
  const availabilityPosts = useAppSelector(selectAvailabilityPosts);
  const jobPosts = useAppSelector(selectJobPosts);
  const activeTab = useAppSelector(selectActiveTab);
  
  // Get loading states for both post types
  const {
    availabilityPostsLoading,
    jobPostsLoading,
    availabilityPostsError,
    jobPostsError,
  } = useAppSelector((state) => state.posts);

  const postsToDisplay = activeTab === "availability"
    ? useAppSelector(selectAvailabilityPosts)
    : useAppSelector(selectJobPosts);

  // Determine current posts and loading state based on active tab
  const currentPosts = activeTab === 'availability' ? availabilityPosts : jobPosts;
  const currentLoading = activeTab === 'availability' ? availabilityPostsLoading : jobPostsLoading;
  const currentError = activeTab === 'availability' ? availabilityPostsError : jobPostsError;

  // Fetch categories on component mount
  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading && !categoriesError) {
      console.log("📂 Fetching categories...");
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length, categoriesLoading, categoriesError]);

  // Check URL params for category filtering and post type
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    const section = params.get("section");

    const postType = params.get("type"); // 'availability' or 'jobs'
    const searchTerm = params.get("search"); // Extract search parameter

    const newFilters = { ...filters };
    if (category) newFilters.category = category;
    if (section) newFilters.section = section;
    if (searchTerm) newFilters.search = searchTerm; // Set search filter

    const postType = params.get("type"); // 'services' or 'jobs'

    const newFilters = { ...filters };
    if (category) newFilters.category = category;

    // Ensure consistency between section and type
    if (postType === 'jobs') {
      newFilters.section = 'jobs';
      dispatch(setActiveTab('jobs'));
    } else if (postType === 'services') {
      newFilters.section = 'services';
      dispatch(setActiveTab('availability'));
    } else if (section === 'jobs') {
      newFilters.section = 'jobs';
      dispatch(setActiveTab('jobs'));
    } else if (section === 'services') {
      newFilters.section = 'services';
      dispatch(setActiveTab('availability'));
    } else {
      // default to jobs (freelancing opportunities first as per homepage)
      newFilters.section = 'jobs';
      dispatch(setActiveTab('jobs'));
    }

    dispatch(setFilters(newFilters));
  }, [location.search, dispatch]);

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => filters, [
    filters.category,
    filters.search,
    filters.sortBy,
    filters.section
  ]);

  // Fetch posts when activeTab or filters change
  useEffect(() => {
    setIsSearching(true);
    if (activeTab === 'availability') {
      console.log("Fetching availability posts with filters:", memoizedFilters)
      dispatch(fetchAvailabilityPosts(memoizedFilters))
        .finally(() => setIsSearching(false));
    } else if (activeTab === 'jobs') {
      console.log("Fetching job posts with filters:", memoizedFilters)
      dispatch(fetchJobPosts(memoizedFilters))
        .finally(() => setIsSearching(false));
    }
  }, [activeTab, memoizedFilters, dispatch]);

  // Handle tab switch
  const handleTabChange = (tabType) => {
    if (tabType === activeTab) return;

    console.log(`Switching to ${tabType} tab`);

    dispatch(setActiveTab(tabType));

    // Update filters
    const newFilters = { ...filters };
    if (tabType === "availability") {
      newFilters.section = "services";
    } else if (tabType === "jobs") {
      newFilters.section = "jobs";
    }
    dispatch(setFilters(newFilters));
    
    // Update URL with consistent section and type
    const params = new URLSearchParams(location.search);
    if (tabType === "availability") {
      params.set("section", "services");
      params.set("type", "services");
    } else if (tabType === "jobs") {
      params.set("section", "jobs");
      params.set("type", "jobs");
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });

    // Note: Posts will be fetched automatically by the useEffect above
  };

  // Handle filter change
  const handleFilterChange = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  // Handle category change specifically
  const handleCategoryChange = useCallback((categoryValue) => {
    console.log("📂 Category changed to:", categoryValue);
    handleFilterChange({ ...filters, category: categoryValue });
    
    // Update URL with category
    const params = new URLSearchParams(location.search);
    if (categoryValue) {
      params.set("category", categoryValue);
    } else {
      params.delete("category");
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [filters, handleFilterChange, location.search, navigate]);

  if (currentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
          <Loader />
          <p className="text-lg text-gray-300 mt-4">
            Loading {activeTab === 'availability' ? 'artist posts' : 'job posts'}...
          </p>
        </div>
      </div>
    );
  }

  if (currentError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
          <p className="text-lg text-red-400">Error: {currentError}</p>
          <button 
            onClick={() => activeTab === 'availability' ? dispatch(fetchAvailabilityPosts(filters)) : dispatch(fetchJobPosts(filters))}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <AuthNavbar />

      {/* Hero Section */}
      <div className="pt-24 pb-8">
        <div className="max-w-5xl mx-auto px-6">
          <button
            onClick={() => navigate("/home")}
            className="inline-flex items-center text-gray-300 hover:text-[#A95BAB] mb-8 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </button>
          
          <div className="text-center mb-8">
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
      </div>

      {/* Search and Filter Section */}
      <div className="sticky top-20 z-10 pb-6">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <SearchBar
                type="marketplace"
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Tab Switch - Jobs left, Services right */}
            <div className="flex bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-1">
              <button
                onClick={() => handleTabChange("jobs")}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "jobs"
                    ? "bg-[#A95BAB]/20 text-[#A95BAB] border border-[#A95BAB]/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Jobs
              </button>
              <button
                onClick={() => handleTabChange("availability")}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "availability"
                    ? "bg-[#A95BAB]/20 text-[#A95BAB] border border-[#A95BAB]/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Services
              </button>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center space-x-3">
              {/* Updated Category Select with API data */}
              <select
                value={filters.category || ""}
                onChange={(e) => handleCategoryChange(e.target.value)}
                disabled={categoriesLoading}
                className="px-4 py-3 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white text-sm focus:border-[#A95BAB]/50 focus:ring-1 focus:ring-[#A95BAB]/50 transition-all appearance-none bg-no-repeat bg-right pr-10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1rem",
                }}
              >
                <option value="">
                  {categoriesLoading ? "Loading categories..." : "All Categories"}
                </option>
                {categories.map((category) => (
                  <option key={category.id || category._id} value={category.name || category.title}>
                    {category.name || category.title}
                  </option>
                ))}
              </select>

              <select
                value={filters.sortBy || "newest"}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                className="px-4 py-3 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white text-sm focus:border-[#A95BAB]/50 focus:ring-1 focus:ring-[#A95BAB]/50 transition-all appearance-none bg-no-repeat bg-right pr-10 cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
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
      </div>

      {/* Show categories error if any */}
      {categoriesError && (
        <div className="max-w-5xl mx-auto px-6 mb-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">
              Categories Error: {categoriesError}
              <button 
                onClick={() => {
                  dispatch(fetchCategories());
                }}
                className="ml-2 text-red-300 hover:text-red-200 underline cursor-pointer"
              >
                Retry
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Posts Grid */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {(filters.section || "jobs") === "services"
                ? "Popular Services"
                : "Freelancing Opportunities"}
            </h2>
            {!isSearching && (
              <p className="text-gray-400 text-sm mt-1">
                {currentPosts.length} {currentPosts.length === 1 ? 'result' : 'results'} found
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {activeTab === "availability" ? (
              <button
                onClick={() => navigate("/marketplace/create?type=availability")}
                className="inline-flex items-center px-4 py-2 bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105"
                <Plus className="w-4 h-4 mr-2" />
                Create Service
              </button>
            ) : (
              <button
                onClick={() => navigate("/marketplace/create?type=jobs")}
                className="inline-flex items-center px-4 py-2 bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post a Job
              </button>
            )}
          </div>
        </div>

        {/* Loading State for Search */}
        {isSearching && (
          <div className="text-center py-16">
            <Loader />
            <p className="text-gray-300 mt-4">Searching posts...</p>
          </div>
        )}

        {/* Posts Grid */}
        {!isSearching && (
          <>
            {!Array.isArray(postsToDisplay) || postsToDisplay.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold mb-2 text-white">
                  No posts found
                </h3>
                <p className="text-gray-400">
                  Try adjusting your filters or check back later for new opportunities.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {postsToDisplay.map((post) => (
                    <PostCard key={post.jobId || post.id} post={post} />
                  ))}
                </div>

                {/* Pagination - placeholder for now, will be implemented when API supports it */}
                {postsToDisplay.length > 0 && (
                  <div className="flex justify-center">
                    <Pagination
                      currentPage={1}
                      totalPages={Math.ceil(postsToDisplay.length / 12)}
                      onPageChange={(page) => {
                        // TODO: Implement pagination when API supports it
                        console.log('Navigate to page:', page);
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Featured Artists Section */}
      <FeaturedArtists />
    </div>
  );
};

export default MarketplacePage;