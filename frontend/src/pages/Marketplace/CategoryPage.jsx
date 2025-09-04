"use client";

import { ArrowLeft, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AuthNavbar from "../../components/layout/AuthNavbar";
import LazyPostCard from "../../components/marketplace/LazyPostCard.jsx";
import SearchBar from "../../components/marketplace/SearchBar";
import PageSkeleton from "../../components/ui/PageSkeleton";
import PaginationComponent from "../../components/ui/PaginationComponent";
import SearchSkeleton from "../../components/ui/SearchSkeleton";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux.js";

// Import from posts slice AND marketplace slice for category-specific data
import {
    setActiveTab
} from '../../store/slices/postsSlice';

// Import from marketplace slice for categories and category-specific posts
import {
    clearCategoryPosts,
    fetchAvailabilityPostsByCategory,
    fetchJobPostsByCategory,
    setCategoryPostsPage,
    setFilters
} from "../../store/slices/marketplaceSlice";

// Import categories from the dedicated categories slice
import { fetchCategories } from "../../store/slices/categoriesSlice";

const CategoryPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryName } = useParams();
  const [isSearching, setIsSearching] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [initializationComplete, setInitializationComplete] = useState(false);

  // Get user for RBAC checks
  const { user } = useAppSelector((state) => state.auth);

  // Get data from marketplace slice (category posts and filters)
  const { 
    filters, 
    categoryPosts 
  } = useAppSelector((state) => state.marketplace);
  
  // Get categories from the dedicated categories slice
  const { 
    categories, 
    loading: categoriesLoading, 
    error: categoriesError 
  } = useAppSelector((state) => state.categories);
  
  // Get parameters from URL - this is the single source of truth
  const urlParams = new URLSearchParams(location.search);
  const typeFromUrl = urlParams.get('type') || 'services';
  const categoryIdFromUrl = urlParams.get('categoryId');
  const currentPageFromUrl = Math.max(1, parseInt(urlParams.get('page')) || 1);
  const searchFromUrl = urlParams.get('search') || '';
  const sortByFromUrl = urlParams.get('sortBy') || 'newest';
  const currentActiveTab = typeFromUrl === 'services' ? 'availability' : 'jobs';

  console.log("🔍 [URL STATE] Current URL parameters:", {
    categoryName,
    typeFromUrl,
    categoryIdFromUrl,
    currentPageFromUrl,
    searchFromUrl,
    sortByFromUrl,
    currentActiveTab,
    fullUrl: location.href
  });

  // Convert URL category name back to display name
  const displayCategoryName = useMemo(() => {
    if (!categoryName) {
      console.log("⚠️ [DEBUG] No categoryName from URL params");
      return '';
    }
    const result = categoryName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    console.log("🔍 [DEBUG] CategoryPage - URL to display name conversion:", {
      urlCategoryName: categoryName,
      displayCategoryName: result
    });
    return result;
  }, [categoryName]);
  
  // Enhanced category resolution with proper validation
  const resolvedCategory = useMemo(() => {
    if (!initializationComplete || categories.length === 0) {
      console.log("🔍 Category resolution pending - waiting for initialization");
      return null;
    }

    // If we have categoryId from URL, use it directly
    if (categoryIdFromUrl) {
      const foundById = categories.find(cat => 
        (cat.categoryId && cat.categoryId.toString() === categoryIdFromUrl) ||
        (cat.id && cat.id.toString() === categoryIdFromUrl) || 
        (cat._id && cat._id.toString() === categoryIdFromUrl)
      );
      if (foundById) {
        console.log("🔍 Category resolved by ID from URL:", {
          categoryIdFromUrl,
          foundCategory: { categoryId: foundById.categoryId, id: foundById.id || foundById._id, name: foundById.name }
        });
        return foundById;
      }
    }

    // Fallback to name-based matching
    let found = categories.find(cat => cat.name === displayCategoryName);
    
    if (!found) {
      found = categories.find(cat => 
        cat.name.toLowerCase() === displayCategoryName.toLowerCase()
      );
    }
    
    if (!found) {
      const normalizedCategoryName = displayCategoryName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      found = categories.find(cat => 
        cat.name.toLowerCase() === normalizedCategoryName.toLowerCase()
      );
    }

    console.log("🔍 Category resolution result:", {
      categoryIdFromUrl,
      displayCategoryName,
      foundCategory: found ? { 
        categoryId: found.categoryId,
        id: found.id || found._id, 
        name: found.name,
        fullObject: found 
      } : null
    });

    return found;
  }, [displayCategoryName, categories, initializationComplete, categoryIdFromUrl]);

  const currentCategory = resolvedCategory;
  const categoryId = currentCategory?.categoryId || currentCategory?.id || currentCategory?._id;
  const effectiveCategoryId = categoryIdFromUrl || categoryId;
  
  // Get category posts data from marketplace slice
  const currentPosts = useMemo(() => {
    const posts = currentActiveTab === 'availability' 
      ? categoryPosts?.availability?.posts 
      : categoryPosts?.jobs?.posts;
    
    return Array.isArray(posts) ? posts : [];
  }, [currentActiveTab, categoryPosts]);
  
  const currentLoading = currentActiveTab === 'availability' 
    ? categoryPosts.availability.loading 
    : categoryPosts.jobs.loading;
  const currentError = currentActiveTab === 'availability' 
    ? categoryPosts.availability.error 
    : categoryPosts.jobs.error;
  const currentPagination = currentActiveTab === 'availability' 
    ? categoryPosts.availability.pagination 
    : categoryPosts.jobs.pagination;

  // Handle scroll for floating button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 300) {
        setTimeout(() => setIsScrolled(true), 100);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Clear category posts when component mounts or category changes
  const prevCategoryName = useRef(categoryName);
  useEffect(() => {
    if (prevCategoryName.current !== categoryName && prevCategoryName.current !== undefined) {
      console.log("🔄 Category changed, clearing previous state", {
        previousCategory: prevCategoryName.current,
        newCategory: categoryName
      });
      dispatch(clearCategoryPosts());
      setInitializationComplete(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    prevCategoryName.current = categoryName;
    
    // Cleanup function to clear category posts when leaving this page
    return () => {
      console.log("🧹 CategoryPage cleanup - clearing category posts");
      dispatch(clearCategoryPosts());
    };
  }, [dispatch, categoryName]);

  // Fetch categories if not loaded
  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading && !categoriesError) {
      console.log("📂 Fetching categories for CategoryPage...");
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length, categoriesLoading, categoriesError]);

  // Initialize filters and active tab from URL
  useEffect(() => {
    console.log("🔧 Setting up from URL params:", {
      typeFromUrl,
      searchFromUrl,
      currentPageFromUrl,
      sortByFromUrl,
      categoryIdFromUrl,
      displayCategoryName,
      currentActiveTab,
      currentPaginationState: {
        availability: categoryPosts.availability.pagination?.currentPage,
        jobs: categoryPosts.jobs.pagination?.currentPage
      }
    });

    // Set active tab based on URL
    dispatch(setActiveTab(currentActiveTab));

    // Set up filters for this category
    const newFilters = {
      category: displayCategoryName,
      search: searchFromUrl,
      sortBy: sortByFromUrl,
      section: typeFromUrl === 'services' ? 'services' : 'jobs'
    };

    dispatch(setFilters(newFilters));

    // IMPORTANT: Sync Redux pagination state with URL
    console.log(`📄 CRITICAL: Syncing Redux pagination - setting ${currentActiveTab} to page ${currentPageFromUrl}`);
    dispatch(setCategoryPostsPage({ 
      postType: currentActiveTab, 
      page: currentPageFromUrl 
    }));

    // Mark initialization complete
    if (categoryIdFromUrl || categories.length > 0) {
      setInitializationComplete(true);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.search, displayCategoryName, dispatch, categoryIdFromUrl, categories.length, currentActiveTab, typeFromUrl, searchFromUrl, sortByFromUrl, currentPageFromUrl]);

  // CRITICAL: Dedicated effect to sync pagination state when page changes in URL
  useEffect(() => {
    const currentReduxPage = currentPagination?.currentPage || 1;
    if (currentReduxPage !== currentPageFromUrl) {
      console.log(`🚨 PAGINATION SYNC: Redux page (${currentReduxPage}) != URL page (${currentPageFromUrl}). Syncing...`);
      console.log(`🚨 Before dispatch - categoryPosts state:`, {
        availability: {
          currentPage: categoryPosts.availability.pagination?.currentPage,
          totalPages: categoryPosts.availability.pagination?.totalPages
        },
        jobs: {
          currentPage: categoryPosts.jobs.pagination?.currentPage,
          totalPages: categoryPosts.jobs.pagination?.totalPages
        }
      });
      
      dispatch(setCategoryPostsPage({ 
        postType: currentActiveTab, 
        page: currentPageFromUrl 
      }));
      
      // Log after dispatch (this won't show immediate change due to async nature)
      console.log(`🚨 Dispatched setCategoryPostsPage for ${currentActiveTab} to page ${currentPageFromUrl}`);
    }
  }, [currentPageFromUrl, currentActiveTab, currentPagination?.currentPage, dispatch, categoryPosts]);

  // Create a stable filters object that only changes when URL changes
  const stableFilters = useMemo(() => ({
    category: displayCategoryName,
    search: searchFromUrl,
    sortBy: sortByFromUrl,
    section: typeFromUrl === 'services' ? 'services' : 'jobs'
  }), [displayCategoryName, searchFromUrl, sortByFromUrl, typeFromUrl]);

  // Enhanced fetch posts - FIXED: Use URL as single source of truth
  useEffect(() => {
    console.log("🔍 Fetch effect triggered:", {
      effectiveCategoryId,
      currentActiveTab,
      currentPageFromUrl,
      stableFilters,
      currentPosts: currentPosts?.length || 0,
      currentPagination,
      currentPostsForTab: {
        availability: categoryPosts.availability.posts?.length || 0,
        jobs: categoryPosts.jobs.posts?.length || 0
      }
    });

    if (!effectiveCategoryId) {
      console.log("⏳ No category ID available yet");
      return;
    }

    // Check if we already have posts for this tab and page combination
    const hasPostsForCurrentTab = currentPosts && currentPosts.length > 0;
    const isCorrectPage = currentPagination?.currentPage === currentPageFromUrl;
    
    console.log("📊 Fetch decision factors:", {
      hasPostsForCurrentTab,
      isCorrectPage,
      currentActiveTab,
      currentPaginationPage: currentPagination?.currentPage,
      urlPage: currentPageFromUrl
    });

    setIsSearching(true);
    
    const limit = 9;
    
    const fetchParams = { 
      categoryId: effectiveCategoryId, 
      filters: { 
        ...stableFilters, 
        page: currentPageFromUrl, // Use page from URL directly
        limit
      } 
    };

    console.log(`🎯 Fetching ${currentActiveTab} posts for page ${currentPageFromUrl}:`, {
      fetchParams,
      beforeFetch: {
        currentPostsLength: currentPosts?.length || 0,
        currentPagination: {
          currentPage: currentPagination?.currentPage,
          totalPages: currentPagination?.totalPages,
          totalCount: currentPagination?.totalCount
        }
      }
    });
    
    const fetchPromise = currentActiveTab === 'availability' 
      ? dispatch(fetchAvailabilityPostsByCategory(fetchParams))
      : dispatch(fetchJobPostsByCategory(fetchParams));

    fetchPromise
      .then((result) => {
        console.log(`✅ Fetch success for page ${currentPageFromUrl}:`, {
          result,
          payload: result?.payload,
          posts: result?.payload?.posts || result?.payload?.data,
          pagination: result?.payload?.pagination,
          afterFetch: {
            currentPostsLength: currentPosts?.length || 0,
            currentPagination: {
              currentPage: currentPagination?.currentPage,
              totalPages: currentPagination?.totalPages,
              totalCount: currentPagination?.totalCount
            }
          }
        });
      })
      .catch((error) => {
        console.error(`❌ Fetch error for page ${currentPageFromUrl}:`, error);
      })
      .finally(() => setIsSearching(false));

  }, [effectiveCategoryId, currentActiveTab, currentPageFromUrl, stableFilters, dispatch]);

  // Handle tab switch - FIXED: Update URL properly and clear posts
  const handleTabChange = (tabType) => {
    console.log("🔄 Switching tab:", { tabType, effectiveCategoryId, from: currentActiveTab, to: tabType });
    
    // Clear posts when switching tabs to avoid showing old data
    console.log("🧹 Clearing category posts before tab switch");
    dispatch(clearCategoryPosts());
    
    const params = new URLSearchParams();
    
    // Always preserve categoryId
    if (effectiveCategoryId) {
      params.set('categoryId', effectiveCategoryId);
    }
    
    params.set("type", tabType === 'availability' ? 'services' : 'jobs');
    
    // Preserve search and sortBy, but reset page
    if (searchFromUrl) {
      params.set('search', searchFromUrl);
    }
    if (sortByFromUrl && sortByFromUrl !== 'newest') {
      params.set('sortBy', sortByFromUrl);
    }
    
    const newUrl = `${location.pathname}?${params.toString()}`;
    console.log("🔄 Tab change - navigating to:", newUrl);
    navigate(newUrl, { replace: true });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle filter change - FIXED: Update URL properly
  const handleFilterChange = useCallback((newFilters) => {
    console.log("🔍 Filter change:", newFilters);
    
    const params = new URLSearchParams();
    
    // Always preserve categoryId
    if (effectiveCategoryId) {
      params.set('categoryId', effectiveCategoryId);
    }
    
    // Preserve current tab type
    params.set('type', typeFromUrl);
    
    // Update search parameter
    if (newFilters.search) {
      params.set('search', newFilters.search);
    }
    
    // Update sortBy parameter
    if (newFilters.sortBy && newFilters.sortBy !== 'newest') {
      params.set('sortBy', newFilters.sortBy);
    }
    
    // Reset page when filters change
    // Don't set page parameter for page 1
    
    const newUrl = `${location.pathname}?${params.toString()}`;
    console.log("🔍 Filter change - navigating to:", newUrl);
    navigate(newUrl, { replace: true });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [effectiveCategoryId, typeFromUrl, location.pathname, navigate]);

  // Handle page change - FIXED: Don't scroll to top for pagination within same category
  const handlePageChange = useCallback((page) => {
    console.log(`📄 Page change to ${page} - staying within same category`);
    console.log(`📄 Before dispatch - current Redux state:`, {
      currentActiveTab,
      currentReduxPage: currentPagination?.currentPage,
      targetPage: page
    });
    
    // CRITICAL: Update Redux pagination state FIRST
    dispatch(setCategoryPostsPage({ 
      postType: currentActiveTab, 
      page: page 
    }));
    
    console.log(`📄 Dispatched setCategoryPostsPage({ postType: "${currentActiveTab}", page: ${page} })`);
    
    const params = new URLSearchParams(location.search);
    
    // Always preserve categoryId
    if (effectiveCategoryId) {
      params.set('categoryId', effectiveCategoryId);
    }
    
    if (page > 1) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }
    
    const newUrl = `${location.pathname}?${params.toString()}`;
    console.log("📄 Page change - navigating to:", newUrl);
    navigate(newUrl, { replace: true });

    // DON'T scroll to top for pagination - users want to see new posts in context
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.search, location.pathname, navigate, effectiveCategoryId, dispatch, currentActiveTab, currentPagination?.currentPage]);

  // Smart post creation routing
  const handleCreatePost = () => {
    if (!user) return;
    
    if (user.role === 'client') {
      navigate("/marketplace/create?type=jobs");
    } else if (user.role === 'artist' || user.role === 'freelancer') {
      navigate("/marketplace/create?type=availability");
    }
  };

  // Get create button info
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

  // Show loading skeleton if categories are loading or category posts are loading
  if (categoriesLoading || currentLoading) {
    return <PageSkeleton categoryName={displayCategoryName} />;
  }

  if (currentError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
          <p className="text-lg text-red-400">Error: {currentError}</p>
          <button 
            onClick={() => window.location.reload()}
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
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {displayCategoryName}
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {currentActiveTab === 'availability' ? 'Browse services' : 'Explore opportunities'} in {displayCategoryName}
            </p>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-6 mb-6">
        <button
          onClick={() => navigate("/marketplace")}
          className="inline-flex items-center text-gray-300 hover:text-[#A95BAB] transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
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
                filters={stableFilters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Tab Switch */}
            <div className="flex bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-1">
              <button
                onClick={() => handleTabChange("jobs")}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  currentActiveTab === "jobs"
                    ? "bg-[#A95BAB]/20 text-[#A95BAB] border border-[#A95BAB]/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Jobs
              </button>
              <button
                onClick={() => handleTabChange("availability")}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  currentActiveTab === "availability"
                    ? "bg-[#A95BAB]/20 text-[#A95BAB] border border-[#A95BAB]/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Services
              </button>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-3">
              <select
                value={sortByFromUrl}
                onChange={(e) => handleFilterChange({ ...stableFilters, sortBy: e.target.value })}
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
              
              {/* Clear Filters / See All Button */}
              {(searchFromUrl || sortByFromUrl !== 'newest') && (
                <button
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (effectiveCategoryId) {
                      params.set('categoryId', effectiveCategoryId);
                    }
                    params.set('type', typeFromUrl);
                    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
                  }}
                  className="px-4 py-3 bg-[#A95BAB]/20 backdrop-blur-sm border border-[#A95BAB]/30 rounded-xl text-[#A95BAB] text-sm hover:bg-[#A95BAB]/30 transition-all whitespace-nowrap"
                >
                  See All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {currentActiveTab === "availability" ? "Services" : "Job Opportunities"}
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

        {/* Loading State */}
        {isSearching && <SearchSkeleton />}

        {/* Posts Grid with Pagination */}
        {!isSearching && (
          <>
            {currentPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold mb-2 text-white">
                  No posts found in {displayCategoryName}
                </h3>
                <p className="text-gray-400">
                  Try adjusting your filters or check back later for new opportunities.
                </p>
                {/* Debug pagination info */}
                
              </div>
            ) : (
              <>
                

                {/* Top Pagination */}
                {currentPagination.totalPages > 1 && (
                  <div className="flex justify-center mb-8">
                    <PaginationComponent
                      currentPage={currentPageFromUrl} // Use URL as source of truth
                      totalPages={currentPagination.totalPages}
                      totalCount={currentPagination.totalCount}
                      isLoading={isSearching}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                  {currentPosts.map((post, index) => (
                    <LazyPostCard 
                      key={post.jobId || post.id || index}
                      post={post}
                      index={index}
                    />
                  ))}
                </div>

                {/* Bottom Pagination */}
                {currentPagination.totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <PaginationComponent
                      currentPage={currentPageFromUrl} // Use URL as source of truth
                      totalPages={currentPagination.totalPages}
                      totalCount={currentPagination.totalCount}
                      isLoading={isSearching}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Floating Action Button */}
      {createButtonInfo && isScrolled && (
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
  );
};

export default CategoryPage;