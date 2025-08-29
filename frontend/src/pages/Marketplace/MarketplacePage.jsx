"use client";

import { ArrowLeft, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthNavbar from "../../components/layout/AuthNavbar";
import LazyPostCard from "../../components/marketplace/LazyPostCard.jsx";
import SearchBar from "../../components/marketplace/SearchBar";
import SEO from "../../components/seo/SEO";
import PageSkeleton from "../../components/ui/PageSkeleton";
import SearchSkeleton from "../../components/ui/SearchSkeleton";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux.js";

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
    selectAvailabilityPostsError,
    selectAvailabilityPostsLoading,
    selectAvailabilityPostsPagination,
    selectJobPosts,
    selectJobPostsError,
    selectJobPostsLoading,
    selectJobPostsPagination,
    setActiveTab,
    setAvailabilityPostsPage,
    setJobPostsPage
} from '../../store/slices/postsSlice';

import FeaturedArtists from "./FeaturedArtist";

const MarketplacePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearching, setIsSearching] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Get user for RBAC checks
  const { user } = useAppSelector((state) => state.auth);

  // Get data from marketplace slice (including categories)
  const { 
    filters, 
    categories, 
    categoriesLoading, 
    categoriesError 
  } = useAppSelector((state) => state.marketplace);
  
  // Get posts data from posts slice - ALL HOOKS MUST BE AT TOP LEVEL
  const availabilityPosts = useAppSelector(selectAvailabilityPosts);
  const jobPosts = useAppSelector(selectJobPosts);
  const activeTab = useAppSelector(selectActiveTab);
  
  // Get pagination data
  const availabilityPostsPagination = useAppSelector(selectAvailabilityPostsPagination);
  const jobPostsPagination = useAppSelector(selectJobPostsPagination);
  
  // Get loading states for both post types
  const availabilityPostsLoading = useAppSelector(selectAvailabilityPostsLoading);
  const jobPostsLoading = useAppSelector(selectJobPostsLoading);
  const availabilityPostsError = useAppSelector(selectAvailabilityPostsError);
  const jobPostsError = useAppSelector(selectJobPostsError);

  const postsToDisplay = activeTab === "availability"
    ? useAppSelector(selectAvailabilityPosts)
    : useAppSelector(selectJobPosts);

  // Group posts by category (limit to 6 posts per category)
  const groupedPosts = useMemo(() => {
    if (!Array.isArray(postsToDisplay) || postsToDisplay.length === 0) return {};
    
    const grouped = {};
    const categoryCounts = {}; // Track original counts before limiting
    const MAX_POSTS_PER_CATEGORY = 6; // Limit posts per category to 6
    
    // First pass: count all posts per category
    postsToDisplay.forEach(post => {
      const categoryName = post.category?.name || post.category || 'Uncategorized';
      categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
    });
    
    // Second pass: add posts with limit of 6 per category
    postsToDisplay.forEach(post => {
      const categoryName = post.category?.name || post.category || 'Uncategorized';
      if (!grouped[categoryName]) {
        grouped[categoryName] = {
          posts: [],
          totalCount: categoryCounts[categoryName],
          categoryId: post.category?.categoryId || post.category?.id || post.category?._id || null,
          categoryObject: post.category
        };
      }
      
      // Only add to category if we haven't reached the limit of 6 per category
      if (grouped[categoryName].posts.length < MAX_POSTS_PER_CATEGORY) {
        grouped[categoryName].posts.push(post);
      }
    });
    
    return grouped;
  }, [postsToDisplay]);

  // Handle "See All" for category with enhanced category resolution
  const handleSeeAllCategory = (categoryName) => {
    const categoryData = groupedPosts[categoryName];
    const categoryId = categoryData?.categoryId;
    
    // Try to find the category ID from the loaded categories if not available from posts
    let resolvedCategoryId = categoryId;
    if (!resolvedCategoryId && categories.length > 0) {
      const foundCategory = categories.find(cat => {
        const catName = cat.name || cat.title || '';
        return catName.toLowerCase() === categoryName.toLowerCase() ||
               catName.toLowerCase().replace(/\s+/g, '-') === categoryName.toLowerCase().replace(/\s+/g, '-');
      });
      resolvedCategoryId = foundCategory?.categoryId || foundCategory?.id || foundCategory?._id;
    }
    
    // Create URL with category ID as query parameter for better matching
    const urlSlug = categoryName.toLowerCase().replace(/\s+/g, '-');
    const baseUrl = `/marketplace/category/${urlSlug}`;
    const params = new URLSearchParams();
    params.set('type', activeTab === 'availability' ? 'services' : 'jobs');
    
    // Add category ID if available for more reliable matching
    if (resolvedCategoryId) {
      params.set('categoryId', resolvedCategoryId);
    }
    
    const targetUrl = `${baseUrl}?${params.toString()}`;
    
    console.log("🔍 [DEBUG] See All clicked with enhanced resolution:", {
      categoryName,
      categoryId,
      resolvedCategoryId,
      activeTab,
      targetUrl,
      urlSlug,
      categoryData: {
        postsCount: categoryData?.posts?.length,
        totalCount: categoryData?.totalCount,
        categoryObject: categoryData?.categoryObject
      },
      availableCategories: categories.map(cat => ({ id: cat.id || cat._id, name: cat.name }))
    });
    
    navigate(targetUrl);
  };

  // Determine current posts and loading state based on active tab
  const currentPosts = activeTab === 'availability' ? availabilityPosts : jobPosts;
  const currentLoading = activeTab === 'availability' ? availabilityPostsLoading : jobPostsLoading;
  const currentError = activeTab === 'availability' ? availabilityPostsError : jobPostsError;
  const currentPagination = activeTab === 'availability' ? availabilityPostsPagination : jobPostsPagination;

  // Fetch categories on component mount
  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading && !categoriesError) {
      console.log("📂 Fetching categories...");
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length, categoriesLoading, categoriesError]);

  // Handle scroll for floating button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      // Add a small delay before showing the button to avoid flickering
      if (scrollTop > 300) {
        setTimeout(() => setIsScrolled(true), 100);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check URL params for category filtering, post type, and pagination
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    const section = params.get("section");
    const postType = params.get("type"); // 'availability' or 'jobs'
    const searchTerm = params.get("search"); // Extract search parameter
    const page = parseInt(params.get("page")) || 1; // Extract page parameter

    const newFilters = { ...filters };
    if (category) newFilters.category = category;
    if (section) newFilters.section = section;
    if (searchTerm) newFilters.search = searchTerm; // Set search filter

    // Ensure consistency between section and type
    if (postType === 'jobs') {
      newFilters.section = 'jobs';
      dispatch(setActiveTab('jobs'));
      dispatch(setJobPostsPage(page));
    } else if (postType === 'services') {
      newFilters.section = 'services';
      dispatch(setActiveTab('availability'));
      dispatch(setAvailabilityPostsPage(page));
    } else if (section === 'jobs') {
      newFilters.section = 'jobs';
      dispatch(setActiveTab('jobs'));
      dispatch(setJobPostsPage(page));
    } else if (section === 'services') {
      newFilters.section = 'services';
      dispatch(setActiveTab('availability'));
      dispatch(setAvailabilityPostsPage(page));
    } else {
      // default to jobs (freelancing opportunities first as per homepage)
      newFilters.section = 'jobs';
      dispatch(setActiveTab('jobs'));
      dispatch(setJobPostsPage(page));
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

  // Fetch posts when activeTab, filters, or pagination changes
  useEffect(() => {
    setIsSearching(true);
    const page = currentPagination.currentPage;
    const limit = currentPagination.limit;
    
    if (activeTab === 'availability') {
      console.log("Fetching availability posts with filters:", memoizedFilters, "page:", page, "limit:", limit)
      dispatch(fetchAvailabilityPosts({ ...memoizedFilters, page, limit }))
        .finally(() => setIsSearching(false));
    } else if (activeTab === 'jobs') {
      console.log("Fetching job posts with filters:", memoizedFilters, "page:", page, "limit:", limit)
      dispatch(fetchJobPosts({ ...memoizedFilters, page, limit }))
        .finally(() => setIsSearching(false));
    }
  }, [activeTab, memoizedFilters, currentPagination.currentPage, currentPagination.limit, dispatch]);

  // Handle tab switch
  const handleTabChange = (tabType) => {
    if (tabType === activeTab) return;

    console.log(`Switching to ${tabType} tab`);

    dispatch(setActiveTab(tabType));

    // Reset pagination when switching tabs
    if (tabType === 'availability') {
      dispatch(setAvailabilityPostsPage(1));
    } else {
      dispatch(setJobPostsPage(1));
    }

    // Update filters
    const newFilters = { ...filters };
    if (tabType === "availability") {
      newFilters.section = "services";
    } else if (tabType === "jobs") {
      newFilters.section = "jobs";
    }
    dispatch(setFilters(newFilters));
    
    // Update URL with consistent section and type, reset page
    const params = new URLSearchParams(location.search);
    if (tabType === "availability") {
      params.set("section", "services");
      params.set("type", "services");
    } else if (tabType === "jobs") {
      params.set("section", "jobs");
      params.set("type", "jobs");
    }
    params.delete("page"); // Reset page when switching tabs
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });

    // Note: Posts will be fetched automatically by the useEffect above
  };

  // Handle filter change
  const handleFilterChange = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
    // Reset to page 1 when filters change
    if (activeTab === 'availability') {
      dispatch(setAvailabilityPostsPage(1));
    } else {
      dispatch(setJobPostsPage(1));
    }
  }, [dispatch, activeTab]);

  // Smart post creation routing based on user role
  const handleCreatePost = () => {
    if (!user) {
      // Could show login prompt here
      return;
    }
    
    if (user.role === 'client') {
      navigate("/marketplace/create?type=jobs");
    } else if (user.role === 'artist' || user.role === 'freelancer') {
      navigate("/marketplace/create?type=availability");
    }
  };

  // Get create button text and icon based on user role
  const getCreateButtonInfo = () => {
    if (!user) return null;
    
    if (user.role === 'client') {
      return { text: "Post a Job", shortText: "Post Job" };
    } else if (user.role === 'artist' || user.role === 'freelancer') {
      return { text: "Create Service", shortText: "Create" };
    }
    return null;
  };

  const createButtonInfo = getCreateButtonInfo();

  // Handle category change specifically - navigate to category page like "See All"
  const handleCategoryChange = useCallback((categoryValue) => {
    console.log("📂 Category changed to:", categoryValue);
    
    if (categoryValue) {
      // Find the category to get its ID
      const selectedCategory = categories.find(cat => 
        (cat.name || cat.title) === categoryValue
      );
      
      if (selectedCategory) {
        const categoryId = selectedCategory.id || selectedCategory._id;
        const urlCategoryName = categoryValue.replace(/\s+/g, '').toLowerCase();
        
        console.log("🔗 Navigating to category page:", {
          categoryValue,
          urlCategoryName,
          categoryId
        });
        
        // Navigate to category page like "See All" does
        navigate(`/marketplace/category/${urlCategoryName}?categoryId=${categoryId}`);
      }
    } else {
      // If "All Categories" selected, just update the current filter
      handleFilterChange({ ...filters, category: "" });
      
      // Update URL
      const params = new URLSearchParams(location.search);
      params.delete("category");
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  }, [filters, categories, handleFilterChange, location.search, navigate]);

  if (currentLoading) {
    return <PageSkeleton />;
  }

  if (currentError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
          <p className="text-lg text-red-400">Error: {currentError}</p>
          <button 
            onClick={() => {
              const page = currentPagination.currentPage;
              const limit = currentPagination.limit;
              if (activeTab === 'availability') {
                dispatch(fetchAvailabilityPosts({ ...filters, page, limit }));
              } else {
                dispatch(fetchJobPosts({ ...filters, page, limit }));
              }
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Marketplace - Find Creative Professionals | PhsarDesign"
        description="Discover talented artists, designers, and creative professionals. Browse portfolios, connect with freelancers, and find the perfect creative partner for your projects."
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Marketplace",
          "name": "PhsarDesign Marketplace",
          "description": "Creative marketplace connecting clients with talented artists and designers",
          "url": typeof window !== 'undefined' ? window.location.href : 'https://phsardesign.com/marketplace',
          "numberOfItems": postsToDisplay?.length || 0
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />

        {/* Hero Section */}
        <div className="pt-24 pb-8">
          <div className="max-w-6xl mx-auto px-6">
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
        </div>      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-6 mb-6">
        <button
          onClick={() => navigate("/home")}
          className="inline-flex items-center text-gray-300 hover:text-[#A95BAB] transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="pb-6">
        <div className="max-w-6xl mx-auto px-6">
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
        <div className="max-w-6xl mx-auto px-6 mb-4">
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
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {(filters.section || "jobs") === "services"
                ? "Popular Services"
                : "Freelancing Opportunities"}
            </h2>
            {!isSearching && (
              <p className="text-gray-400 text-sm mt-1">
                {currentPagination.totalCount > 0 
                  ? `${currentPagination.totalCount} ${currentPagination.totalCount === 1 ? 'result' : 'results'} found`
                  : `${currentPosts.length} ${currentPosts.length === 1 ? 'result' : 'results'} found`
                }
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Unified Create Button - shows only when user is authenticated and has appropriate role */}
            {createButtonInfo && (
              <button
                onClick={handleCreatePost}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#A95BAB] to-[#A95BAB]/80 hover:from-[#A95BAB]/90 hover:to-[#A95BAB]/70 text-white rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#A95BAB]/25"
              >
                <Plus className="w-4 h-4 mr-2" />
                {createButtonInfo.text}
              </button>
            )}
          </div>
        </div>

        {/* Loading State for Search */}
        {isSearching && <SearchSkeleton />}

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
              <div className="space-y-12">
                {/* Group posts by category */}
                {Object.entries(groupedPosts).map(([categoryName, categoryData]) => (
                  <div key={categoryName} className="space-y-6">
                    {/* Category Header */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-white">{categoryName}</h2>
                      {categoryData.totalCount > categoryData.posts.length && (
                        <button
                          onClick={() => handleSeeAllCategory(categoryName)}
                          className="text-[#A95BAB] hover:text-[#A95BAB]/80 font-medium transition-colors flex items-center gap-2"
                        >
                          See All ({categoryData.totalCount})
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Posts Grid for this category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                      {categoryData.posts.map((post, index) => (
                        <LazyPostCard 
                          key={post.jobId || post.id || post.postId || index}
                          post={post}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                ))}

                {/* Show message if any category has more posts than displayed */}
                {Object.values(groupedPosts).some(categoryData => 
                  categoryData.totalCount > categoryData.posts.length
                ) && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">
                      Some categories show only the first 6 posts. Click "See All" to view more.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Featured Artists Section */}
      <FeaturedArtists />

      {/* Floating Action Button */}
      {createButtonInfo && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <button
            onClick={handleCreatePost}
            className="group relative w-16 h-16 bg-gradient-to-r from-[#A95BAB] to-[#A95BAB]/80 hover:from-[#A95BAB]/90 hover:to-[#A95BAB]/70 text-white rounded-full shadow-2xl hover:shadow-[#A95BAB]/40 transition-all duration-300 transform hover:scale-110 active:scale-95"
            title={createButtonInfo.text}
          >
            <Plus className="w-7 h-7 mx-auto transition-transform duration-300 group-hover:rotate-90" />
            
            {/* Tooltip */}
            <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-gray-900/95 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-x-2 group-hover:translate-x-0">
              {createButtonInfo.text}
              <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900/95"></div>
            </div>

            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full border-2 border-[#A95BAB]/30 animate-ping"></div>
          </button>
        </div>
      )}
      </div>
    </>
  );
};

export default MarketplacePage;