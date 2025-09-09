"use client";

import { ArrowLeft, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthNavbar from "../../components/layout/AuthNavbar";
import LazyPostCard from "../../components/marketplace/LazyPostCard.jsx";
import SearchBar from "../../components/marketplace/SearchBar";
// import SEO from "../../components/seo/SEO";
import PageSkeleton from "../../components/ui/PageSkeleton";
import Pagination from "../../components/ui/Pagination";
import SearchSkeleton from "../../components/ui/SearchSkeleton";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux.js";

// Import from marketplace slice (now includes categories)
import {
    setFilters,
    clearCategoryPosts,
    clearCurrentPost,
    clearError,
    clearFilters
} from "../../store/slices/marketplaceSlice";

// Import categories from the dedicated categories slice
import { fetchCategories } from "../../store/slices/categoriesSlice";

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
    setJobPostsPage,
    clearPosts,
    clearError as clearPostsError
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

  // Get data from marketplace slice
  const { 
    filters
  } = useAppSelector((state) => state.marketplace);
  
  // Get categories from the dedicated categories slice
  const { 
    categories, 
    loading: categoriesLoading, 
    error: categoriesError 
  } = useAppSelector((state) => state.categories);
  
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

  // Enhanced groupedPosts calculation with better error handling
  const groupedPosts = useMemo(() => {
    // Skip grouping if filtering by specific category (will show flat list instead)
    if (filters.category && filters.category.trim() !== '') {
      console.log("📊 Filtering by category, skipping grouping:", filters.category);
      return {};
    }
    
    if (!Array.isArray(postsToDisplay) || postsToDisplay.length === 0) {
      console.log("📊 No posts to display, returning empty grouped object");
      return {};
    }
    
    console.log("📊 Grouping posts for overview mode:", {
      totalPosts: postsToDisplay.length,
      samplePosts: postsToDisplay.slice(0, 2).map(post => ({
        id: post.id || post.jobId,
        category: post.category,
        title: post.title
      }))
    });
    
    const grouped = {};
    const categoryCounts = {};
    const MAX_POSTS_PER_CATEGORY = 6; // Always limit to 6 in overview mode
    
    // First pass: count all posts per category
    postsToDisplay.forEach(post => {
      const categoryName = post.category?.name || post.category || 'Uncategorized';
      categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
    });
    
    console.log("📊 Category counts:", categoryCounts);
    
    // Second pass: add posts with limit of 6 per category for overview
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
      
      if (grouped[categoryName].posts.length < MAX_POSTS_PER_CATEGORY) {
        grouped[categoryName].posts.push(post);
      }
    });
    
    console.log("📊 Final grouped posts:", Object.keys(grouped).map(key => ({
      category: key,
      postsCount: grouped[key].posts.length,
      totalCount: grouped[key].totalCount
    })));
    
    return grouped;
  }, [postsToDisplay]);

  // Handle "See All" for category - filter on same page instead of navigating
  const handleSeeAllCategory = (categoryName) => {
    console.log("🔍 See All clicked for category:", categoryName);
    
    // Apply the category filter on the same page
    const newFilters = { ...filters, category: categoryName };
    handleFilterChange(newFilters);
    
    console.log("🔍 Filtering to show all posts in category:", {
      categoryName,
      newFilters
    });
  };

  // Determine current posts and loading state based on active tab
  const currentPosts = activeTab === 'availability' ? availabilityPosts : jobPosts;
  const currentLoading = activeTab === 'availability' ? availabilityPostsLoading : jobPostsLoading;
  const currentError = activeTab === 'availability' ? availabilityPostsError : jobPostsError;
  const currentPagination = activeTab === 'availability' ? availabilityPostsPagination : jobPostsPagination;

  // Fetch categories only if not already loaded (lazy loading pattern)
  useEffect(() => {
    // Only fetch if we don't have categories or if there was an error
    if (!categoriesLoading && (categories.length === 0 || categoriesError)) {
      console.log("📂 MarketplacePage - Fetching categories (lazy load):", {
        categoriesLength: categories.length,
        categoriesLoading,
        categoriesError,
        shouldFetch: categories.length === 0 || categoriesError
      });
      
      dispatch(fetchCategories());
    } else {
      console.log("📂 MarketplacePage - Categories already loaded, skipping fetch:", {
        categoriesLength: categories.length,
        categoriesLoading
      });
    }
  }, [dispatch, categories.length, categoriesLoading, categoriesError]);

  // Reset and cleanup when returning to marketplace from category pages
  useEffect(() => {
    console.log("🔄 MarketplacePage mounted - ensuring fresh state");
    
    // Clear previous state on mount for fresh start
    console.log("[MarketplacePage] Component mounting, clearing previous state");
    dispatch(clearCategoryPosts());
    dispatch(clearCurrentPost());
    dispatch(clearError());
    
    // No need to reset pagination here as it's handled by URL params
    
    return () => {
      console.log("🧹 MarketplacePage unmounting - cleanup");
    };
  }, [dispatch]); // Include dispatch in dependency array

  // Ensure "All Categories" is default when no URL params present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hasParams = params.toString() !== '';
    
    // If no URL params exist, ensure we're showing all categories (empty filter)
    if (!hasParams && filters.category !== '') {
      console.log("🏠 MarketplacePage - No URL params detected, setting to show All Categories");
      dispatch(setFilters({ 
        ...filters, 
        category: '', // Empty string represents "All Categories"
        section: 'services' // Default to services section
      }));
    }
  }, [location.search, filters.category, dispatch]);

  // Check URL params for category filtering, post type, and pagination
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    const categoryId = params.get("categoryId"); // Extract categoryId parameter
    const section = params.get("section");
    const postType = params.get("type"); // 'availability' or 'jobs'
    const searchTerm = params.get("search"); // Extract search parameter
    const sortBy = params.get("sortBy"); // Extract sort parameter
    const minPrice = params.get("minPrice"); // Extract min price parameter
    const maxPrice = params.get("maxPrice"); // Extract max price parameter
    const skills = params.get("skills"); // Extract skills parameter
    const location_param = params.get("location"); // Extract location parameter
    const availabilityType = params.get("availabilityType"); // Extract availability type parameter
    const page = parseInt(params.get("page")) || 1; // Extract page parameter

    const newFilters = { ...filters };
    
    // Handle category filter
    if (category) {
      newFilters.category = category;
    }
    
    // Handle categoryId filter
    if (categoryId && categoryId !== 'undefined' && categoryId !== 'null') {
      newFilters.categoryId = categoryId;
    } else {
      // Remove categoryId from filters if it's invalid
      delete newFilters.categoryId;
    }
    
    // Handle section filter
    if (section) {
      newFilters.section = section;
    }
    
    // Handle search filter - clear it if not present in URL
    if (searchTerm) {
      newFilters.search = searchTerm;
    } else {
      newFilters.search = ''; // Clear search if no search parameter in URL
    }
    
    // Handle other filters - clear them if not present in URL
    if (sortBy) {
      newFilters.sortBy = sortBy;
    } else {
      newFilters.sortBy = 'newest'; // Reset to default if not in URL
    }
    
    if (minPrice) {
      newFilters.minPrice = minPrice;
    } else {
      delete newFilters.minPrice; // Remove if not in URL
    }
    
    if (maxPrice) {
      newFilters.maxPrice = maxPrice;
    } else {
      delete newFilters.maxPrice; // Remove if not in URL
    }

    // Handle skills filter
    if (skills && skills.trim() !== '') {
      newFilters.skills = skills;
    } else {
      delete newFilters.skills; // Remove if not in URL
    }

    // Handle location filter
    if (location_param && location_param.trim() !== '') {
      newFilters.location = location_param;
    } else {
      delete newFilters.location; // Remove if not in URL
    }

    // Handle availability type filter (for services)
    if (availabilityType && availabilityType.trim() !== '') {
      newFilters.availabilityType = availabilityType;
    } else {
      delete newFilters.availabilityType; // Remove if not in URL
    }

    console.log("[MarketplacePage] URL params parsed:", {
      category,
      categoryId,
      section,
      postType,
      searchTerm,
      sortBy,
      minPrice,
      maxPrice,
      skills,
      location_param,
      availabilityType,
      page,
      newFilters
    });

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
      // default to services (availability posts) instead of jobs
      newFilters.section = 'services';
      dispatch(setActiveTab('availability'));
      dispatch(setAvailabilityPostsPage(page));
    }

    dispatch(setFilters(newFilters));
    
    // If we have a search term from URL, just set the loading state
    // The main posts fetch effect will handle the actual fetching
    if (searchTerm && searchTerm.trim()) {
      console.log("[MarketplacePage] Search term detected from URL:", searchTerm);
      setIsSearching(true); // Main fetch effect will handle the actual fetch
    }
  }, [location.search, dispatch]);

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => filters, [
    filters.category,
    filters.categoryId,
    filters.search,
    filters.sortBy,
    filters.minPrice,
    filters.maxPrice,
    filters.section,
    filters.skills,
    filters.location,
    filters.availabilityType
  ]);

  // Fetch posts when activeTab, filters, or pagination changes
  useEffect(() => {
    console.log("[MarketplacePage] Posts fetch effect triggered:", {
      activeTab,
      memoizedFilters,
      currentPage: currentPagination.currentPage,
      limit: currentPagination.limit,
      filtersSearch: filters.search
    });
    
    setIsSearching(true);
    const page = currentPagination.currentPage;
    const limit = currentPagination.limit;
    
    if (activeTab === 'availability') {
      console.log("Fetching availability posts with filters:", memoizedFilters, "page:", page, "limit:", limit)
      dispatch(fetchAvailabilityPosts({ ...memoizedFilters, page, limit }))
        .then((result) => {
          console.log("[MarketplacePage] Availability posts fetch completed:", result);
        })
        .catch((error) => {
          console.error("[MarketplacePage] Availability posts fetch error:", error);
        })
        .finally(() => {
          setIsSearching(false);
        });
    } else if (activeTab === 'jobs') {
      console.log("Fetching job posts with filters:", memoizedFilters, "page:", page, "limit:", limit)
      dispatch(fetchJobPosts({ ...memoizedFilters, page, limit }))
        .then((result) => {
          console.log("[MarketplacePage] Job posts fetch completed:", result);
        })
        .catch((error) => {
          console.error("[MarketplacePage] Job posts fetch error:", error);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }
  }, [activeTab, memoizedFilters, currentPagination.currentPage, currentPagination.limit, dispatch]);

  // Handle tab switch
  const handleTabChange = (tabType) => {
    if (tabType === activeTab) return;

    console.log(`Switching to ${tabType} tab`);
    
    // Clear previous posts state when switching tabs, but preserve filters
    console.log("[MarketplacePage] Tab change detected, clearing previous posts but preserving filters");
    dispatch(clearCategoryPosts());
    dispatch(clearCurrentPost());
    dispatch(clearError());
    dispatch(clearPosts());
    dispatch(clearPostsError());

    dispatch(setActiveTab(tabType));

    // Reset pagination when switching tabs
    if (tabType === 'availability') {
      dispatch(setAvailabilityPostsPage(1));
    } else {
      dispatch(setJobPostsPage(1));
    }

    // Update filters - only change section, preserve other filters like sortBy
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
    console.log("[MarketplacePage] Filter change requested:", newFilters);
    console.log("[MarketplacePage] Current filters:", filters);
    
    // Check if this is a search operation (when search filter is being set)
    const isSearchOperation = newFilters.search !== undefined && newFilters.search !== filters.search;
    
    if (isSearchOperation) {
      console.log("[MarketplacePage] Search operation detected, clearing previous state");
      // Clear all relevant state when performing a search
      dispatch(clearCategoryPosts());
      dispatch(clearCurrentPost());
      dispatch(clearError());
      dispatch(clearPosts());
      dispatch(clearPostsError());
      // DON'T clear filters during search - preserve sortBy and other filters
    }
    
    // Merge new filters with existing filters
    const updatedFilters = { ...filters, ...newFilters };
    console.log("[MarketplacePage] Updated filters after merge:", updatedFilters);
    
    dispatch(setFilters(updatedFilters));
    
    // Update URL with new filters
    const params = new URLSearchParams(location.search);
    
    // Update URL parameters for all filter types
    Object.keys(updatedFilters).forEach(key => {
      const value = updatedFilters[key];
      if (value && value !== '' && value !== 'newest') { // Don't add default values to URL
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    // Always remove page when filters change
    params.delete('page');
    
    // Update URL
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    
    // Reset to page 1 when filters change
    if (activeTab === 'availability') {
      dispatch(setAvailabilityPostsPage(1));
    } else {
      dispatch(setJobPostsPage(1));
    }
  }, [dispatch, activeTab, filters, location.search, location.pathname, navigate]);

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

  // Handle category change - filter on the same page instead of navigating
  const handleCategoryChange = useCallback((categoryValue) => {
    console.log("📂 Category changed to:", categoryValue);
    
    // Update the filter state with the selected category
    const newFilters = { ...filters, category: categoryValue };
    
    // Use the existing handleFilterChange to update filters and URL
    handleFilterChange(newFilters);
    
    console.log("🔗 Filtering by category on same page:", {
      categoryValue,
      newFilters
    });
  }, [filters, handleFilterChange]);

  // Handle page change for pagination
  const handlePageChange = useCallback((page) => {
    console.log("📄 Page changed to:", page);
    
    // Update URL with new page parameter
    const params = new URLSearchParams(location.search);
    params.set('page', page.toString());
    
    // Update URL without triggering a page reload
    navigate(`?${params.toString()}`, { replace: true });
    
    // Scroll to top of results
    const resultsSection = document.getElementById('marketplace-results');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.search, navigate]);

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
      {/* SEO removed */}
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
                activeTab={activeTab}
              />
            </div>

            {/* Tab Switch - Services left, Jobs right */}
            <div className="flex bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-1">
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
              <div className="flex flex-col gap-1">
                <p className="text-gray-400 text-sm">
                  {currentPagination.totalCount > 0 
                    ? `${currentPagination.totalCount} ${currentPagination.totalCount === 1 ? 'result' : 'results'} found`
                    : `${currentPosts.length} ${currentPosts.length === 1 ? 'result' : 'results'} found`
                  }
                </p>
                {/* Show active filters */}
                {(filters.search || filters.category || filters.sortBy !== 'newest') && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {filters.search && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#A95BAB]/20 text-[#A95BAB] text-xs rounded-full">
                        Search: "{filters.search}"
                        <button
                          onClick={() => handleFilterChange({ search: '' })}
                          className="hover:text-[#A95BAB]/80"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.category && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                        Category: {filters.category}
                        <button
                          onClick={() => handleFilterChange({ category: '' })}
                          className="hover:text-blue-300"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.sortBy !== 'newest' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                        Sort: {filters.sortBy}
                        <button
                          onClick={() => handleFilterChange({ sortBy: 'newest' })}
                          className="hover:text-green-300"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
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
        {isSearching && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#A95BAB]/20 rounded-full mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A95BAB]"></div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Searching...</h3>
            <p className="text-gray-400">
              {filters.search ? `Looking for "${filters.search}"` : 'Finding the best results for you'}
            </p>
          </div>
        )}

        {/* Error State */}
        {currentError && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold mb-2 text-white">
              Something went wrong
            </h3>
            <p className="text-gray-400 mb-6">
              {currentError.message || "Failed to load posts. Please try again."}
            </p>
            <button
              onClick={() => {
                dispatch(clearPostsError());
                dispatch(clearError());
                // Retry loading posts
                window.location.reload();
              }}
              className="px-6 py-2 bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Posts Grid */}
        {!isSearching && !currentError && (
          <>
            {!Array.isArray(postsToDisplay) || postsToDisplay.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold mb-2 text-white">
                  {filters.search ? `No results found for "${filters.search}"` : "No posts found"}
                </h3>
                <p className="text-gray-400 mb-6">
                  {filters.search 
                    ? "Try searching with different keywords or browse all categories below."
                    : "Try adjusting your filters or check back later for new opportunities."
                  }
                </p>
                
                {/* Clear search / Show helpful actions */}
                {filters.search ? (
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <button
                      onClick={() => handleFilterChange({ search: '' })}
                      className="px-6 py-2 bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white rounded-lg transition-colors"
                    >
                      Clear Search
                    </button>
                    <button
                      onClick={() => handleFilterChange({ category: '', search: '' })}
                      className="px-6 py-2 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg transition-colors"
                    >
                      Browse All Posts
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleFilterChange({ category: '', search: '', sortBy: 'newest' })}
                      className="px-6 py-2 bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white rounded-lg transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-12">
                {/* Check if filtering by specific category */}
                {filters.category && filters.category.trim() !== '' ? (
                  /* Category-specific view: Show all posts in flat grid with pagination */
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {filters.category}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                          {currentPagination.totalCount > 0 
                            ? `${currentPagination.totalCount} ${currentPagination.totalCount === 1 ? 'result' : 'results'} found`
                            : `${postsToDisplay.length} ${postsToDisplay.length === 1 ? 'result' : 'results'} found`
                          }
                          {currentPagination.totalPages > 1 && (
                            <span className="ml-2">
                              • Page {currentPagination.currentPage} of {currentPagination.totalPages}
                            </span>
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => handleFilterChange({ category: '' })}
                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to All Categories
                      </button>
                    </div>
                    
                    {/* All posts in flat grid for the selected category (6 posts per page with pagination) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                      {postsToDisplay.map((post, index) => (
                        <LazyPostCard 
                          key={post.jobId || post.id || post.postId || index}
                          post={post}
                          index={index}
                        />
                      ))}
                    </div>

                    {/* Pagination for Category-Specific View */}
                    {currentPagination.totalPages > 1 && (
                      <div className="flex justify-center py-8" id="marketplace-results">
                        <Pagination
                          currentPage={currentPagination.currentPage}
                          totalPages={currentPagination.totalPages}
                          onPageChange={handlePageChange}
                          className="mt-4"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  /* Overview mode: Group posts by category with "See All" buttons */
                  Object.entries(groupedPosts).map(([categoryName, categoryData]) => (
                    <div key={categoryName} className="space-y-6">
                      {/* Category Header */}
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">{categoryName}</h2>
                        {/* Only show "See All" button when in overview mode and there are more posts */}
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
                  ))
                )}



                {/* Pagination */}
                {currentPagination.totalPages > 1 && (
                  <div className="flex justify-center py-8" id="marketplace-results">
                    <Pagination
                      currentPage={currentPagination.currentPage}
                      totalPages={currentPagination.totalPages}
                      onPageChange={handlePageChange}
                      className="mt-4"
                    />
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