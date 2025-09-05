"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EnhancedSearchBox from "../../../components/common/EnhancedSearchBox";
import SuggestionChip from "../../../components/common/SuggestionChip";
import { fetchCategories } from "../../../store/slices/categoriesSlice";
import categoryAPI from "../../../store/api/categoryAPI";
import { clearFilters, clearCategoryPosts, clearCurrentPost, clearError } from "../../../store/slices/marketplaceSlice";
import { clearPosts, clearError as clearPostsError } from "../../../store/slices/postsSlice";

export default function HeroSectionAuth({ backgroundImageUrl }) {
  const [searchController, setSearchController] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user from Redux store
  const { user } = useSelector((state) => state.auth);
  
  // Get categories from Redux store
  const { categories, loading: categoriesLoading, error: categoriesError } = useSelector((state) => state.categories);

  // Fetch categories on component mount
  useEffect(() => {
    console.log("[HeroSectionAuth] Categories state:", { 
      categories: categories,
      categoriesLength: categories?.length || 0,
      categoriesLoading,
      categoriesError,
      categoriesStructure: categories?.length > 0 ? categories[0] : null
    });
    
    if ((!categories || categories.length === 0) && !categoriesLoading) {
      console.log("[HeroSectionAuth] Fetching categories from backend...");
      dispatch(fetchCategories())
        .then((result) => {
          console.log("[HeroSectionAuth] Categories fetch result:", result);
        })
        .catch((error) => {
          console.error("[HeroSectionAuth] Categories fetch error:", error);
          
          // If Redux fetch fails, try direct API call as fallback
          console.log("[HeroSectionAuth] Trying direct API call as fallback...");
          categoryAPI.getAllCategories()
            .then((directResult) => {
              console.log("[HeroSectionAuth] Direct API call result:", directResult);
            })
            .catch((directError) => {
              console.error("[HeroSectionAuth] Direct API call also failed:", directError);
            });
        });
    }
    
    if (categoriesError) {
      console.error("[HeroSectionAuth] Categories error from Redux:", categoriesError);
    }
  }, [dispatch, categories, categoriesLoading, categoriesError]);

  // Get user's first name or fallback
  const getUserName = () => {
    if (user?.firstName) return user.firstName;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  // Handle search functionality (wrapper for executeSearch)
  const handleSearch = (searchTerm = searchController) => {
    // Use the parameter if provided, otherwise use current state
    const actualSearchTerm = searchTerm || searchController;
    executeSearch(actualSearchTerm);
  };

  // Handle suggestion selection from enhanced search
  const handleSuggestionSelected = (suggestion) => {
    // Clear previous state before navigation
    console.log("[HeroSectionAuth] Clearing state before suggestion selection");
    dispatch(clearFilters());
    dispatch(clearCategoryPosts());
    dispatch(clearCurrentPost());
    dispatch(clearError());
    dispatch(clearPosts());
    dispatch(clearPostsError());

    if (suggestion.type === 'category') {
      // Navigate to category page with proper URL structure
      const categoryName = suggestion.title;
      const categoryId = suggestion.categoryId;
      
      // Create URL-friendly category name
      const urlCategoryName = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      if (categoryId && categoryId !== 'unknown') {
        // Navigate to specific category page: /marketplace/category/{categoryName}?type=services&categoryId={id}
        navigate(`/marketplace/category/${urlCategoryName}?type=services&categoryId=${categoryId}`);
      } else {
        // Fallback to marketplace with category search if no valid ID
        console.warn("No valid categoryId found, falling back to search by category name");
        navigate(`/marketplace?category=${encodeURIComponent(categoryName)}&type=services`);
      }
      return;
    }
    
    // For any other type, use the new executeSearch function
    executeSearch(suggestion.title);
  };

  // Handle suggestion chip click
  const handleSuggestionClick = (suggestion) => {
    console.log("[HeroSectionAuth] Suggestion clicked:", suggestion);
    console.log("[HeroSectionAuth] Current searchController:", searchController);
    console.log("[HeroSectionAuth] Categories available:", categories?.length || 0);
    
    // Update the search input
    setSearchController(suggestion);
    
    // Directly execute search with the clicked suggestion
    // Don't rely on state updates
    executeSearch(suggestion);
  };

  // Separate search execution function to avoid state dependency issues
  const executeSearch = (searchTerm) => {
    console.log("[HeroSectionAuth] Executing search with term:", searchTerm);
    
    if (!searchTerm || !searchTerm.trim()) {
      console.log("[HeroSectionAuth] Empty search term, aborting");
      return;
    }

    // Clear previous state before navigation
    console.log("[HeroSectionAuth] Clearing previous state before navigation");
    dispatch(clearFilters());
    dispatch(clearCategoryPosts());
    dispatch(clearCurrentPost());
    dispatch(clearError());
    dispatch(clearPosts());
    dispatch(clearPostsError());

    // Create dynamic category mapping from backend categories
    const categoryMapping = {};
    
    console.log("[HeroSectionAuth] Creating category mapping from:", categories);
    
    if (categories && categories.length > 0) {
      categories.forEach(category => {
        const categoryName = category.name || category.categoryName || category.title || category.label;
        if (categoryName) {
          // Add exact match (case-insensitive)
          categoryMapping[categoryName.toLowerCase()] = categoryName;
          
          // Add partial matches for common search terms
          const lowerName = categoryName.toLowerCase();
          if (lowerName.includes('logo')) categoryMapping['logo'] = categoryName;
          if (lowerName.includes('graphic')) categoryMapping['graphic design'] = categoryName;
          if (lowerName.includes('3d')) {
            categoryMapping['3d render'] = categoryName;
            categoryMapping['3d design'] = categoryName;
          }
          if (lowerName.includes('digital') || lowerName.includes('illustration')) {
            categoryMapping['illustration'] = categoryName;
            categoryMapping['digital art'] = categoryName;
          }
          if (lowerName.includes('brand')) categoryMapping['branding'] = categoryName;
          if (lowerName.includes('web')) categoryMapping['web design'] = categoryName;
          if (lowerName.includes('ui') || lowerName.includes('ux')) {
            categoryMapping['ui design'] = categoryName;
            categoryMapping['ux design'] = categoryName;
          }
          if (lowerName.includes('character')) categoryMapping['character design'] = categoryName;
        }
      });
    }
    
    console.log("[HeroSectionAuth] Category mapping created:", categoryMapping);
    
    const searchLower = searchTerm.toLowerCase().trim();
    const matchedCategory = categoryMapping[searchLower];
    
    if (matchedCategory) {
      // If search term matches a category, navigate to category page
      console.log(`🏷️ Search term "${searchTerm}" mapped to category "${matchedCategory}"`);
      
      // Create URL-friendly category name
      const urlCategoryName = matchedCategory.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      // Try to find the category ID for more reliable matching
      let categoryId = null;
      if (categories && categories.length > 0) {
        const foundCategory = categories.find(cat => {
          const catName = cat.name || cat.categoryName || cat.title || cat.label;
          return catName && catName.toLowerCase() === matchedCategory.toLowerCase();
        });
        categoryId = foundCategory?.categoryId || foundCategory?.id || foundCategory?._id;
      }
      
      // Navigate to category page: /marketplace/category/{categoryName}
      const params = new URLSearchParams();
      params.set("type", "services");
      if (categoryId && categoryId !== 'undefined' && categoryId !== 'null') {
        params.set("categoryId", categoryId);
      }
      
      const targetUrl = `/marketplace/category/${urlCategoryName}?${params.toString()}`;
      console.log(`🔗 Navigating to category page: ${targetUrl}`);
      navigate(targetUrl);
    } else {
      // Otherwise, search by text in marketplace
      console.log(`🔍 Search term "${searchTerm}" will be used as text search`);
      const params = new URLSearchParams();
      params.set("search", searchTerm.trim());
      params.set("type", "availability");
      navigate(`/marketplace?${params.toString()}`);
    }
  };

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearchController(value);
  };

  // Handle enter key press in search
  const handleSearchSubmit = () => {
    handleSearch(searchController);
  };

  const buildSuggestionButtons = () => {
    // Get suggestions from backend categories, fallback to hardcoded if not loaded
    let suggestions = [];
    
    console.log("[HeroSectionAuth] Building suggestions with categories:", categories);
    
    if (categories && categories.length > 0) {
      // Handle different possible category data structures
      suggestions = categories
        .slice(0, 5)
        .map(category => {
          // Try different property names that might contain the category name
          return category.name || 
                 category.categoryName || 
                 category.title || 
                 category.label || 
                 (typeof category === 'string' ? category : null);
        })
        .filter(Boolean);
      
      console.log("[HeroSectionAuth] Processed suggestions from backend:", suggestions);
    }
    
    // Fallback suggestions if backend categories aren't loaded yet or processing failed
    if (suggestions.length === 0) {
      console.log("[HeroSectionAuth] Using fallback suggestions");
      suggestions = [
        "Logo Design",
        "Graphic Design", 
        "3D Design",
        "Digital Art",
        "Branding",
      ];
    }

    // Responsive font sizing
    const getFontSize = () => {
      if (typeof window === "undefined") return "text-base";
      if (window.innerWidth >= 1024) return "text-base"; // Desktop: 16px
      if (window.innerWidth >= 768) return "text-sm"; // Tablet: 14px
      return "text-xs"; // Mobile: 12px
    };

    const isDesktop =
      typeof window !== "undefined" && window.innerWidth >= 1024;

    if (isDesktop) {
      return (
        <div className="flex flex-wrap gap-3">
          {categoriesLoading ? (
            <div className="text-white/70 text-sm">Loading categories...</div>
          ) : (
            suggestions.map((suggestion, index) => (
              <SuggestionChip
                key={index}
                label={suggestion}
                onTap={() => handleSuggestionClick(suggestion)}
                fontSize={getFontSize()}
              />
            ))
          )}
        </div>
      );
    }

    // For mobile and tablet, use flex wrap with intrinsic width
    return (
      <div className="flex flex-wrap gap-3 items-start">
        {categoriesLoading ? (
          <div className="text-white/70 text-xs">Loading categories...</div>
        ) : (
          suggestions.map((suggestion, index) => (
            <SuggestionChip
              key={index}
              label={suggestion}
              onTap={() => handleSuggestionClick(suggestion)}
              fontSize={getFontSize()}
            />
          ))
        )}
      </div>
    );
  };

  const buildMobileLayout = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Find Artists, See Work, Be Discovered
          </h1>
          <div className="space-y-4">
            <EnhancedSearchBox
              value={searchController}
              onChange={handleSearchChange}
              onSubmit={handleSearchSubmit}
              onSuggestionSelected={handleSuggestionSelected}
              searchType="all"
              placeholder="What type of service are you looking for?"
            />
            {buildSuggestionButtons()}
          </div>
          <div className="mt-8">
            <GradientTitle />
          </div>
        </div>
      </div>
    );
  };

  const buildTabletLayout = () => {
    return (
      <div className="flex flex-col space-y-6">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Find Artists, See Work, Be Discovered
          </h1>
          <div className="space-y-4">
            <EnhancedSearchBox
              value={searchController}
              onChange={handleSearchChange}
              onSubmit={handleSearchSubmit}
              onSuggestionSelected={handleSuggestionSelected}
              searchType="all"
              placeholder="What type of service are you looking for?"
            />
            {buildSuggestionButtons()}
          </div>
          <div className="mt-8">
            <GradientTitle />
          </div>
        </div>
      </div>
    );
  };

  const buildDesktopLayout = () => {
    return (
      <div className="relative">
        <div className="flex">
          <div className="flex-1 max-w-2xl">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Find Artists, See Work, Be Discovered
              </h1>
              <div className="space-y-4">
                <EnhancedSearchBox
                  value={searchController}
                  onChange={handleSearchChange}
                  onSubmit={handleSearchSubmit}
                  onSuggestionSelected={handleSuggestionSelected}
                  searchType="all"
                  placeholder="What type of service are you looking for?"
                />
                {buildSuggestionButtons()}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <GradientTitle />
        </div>
      </div>
    );
  };

  const WelcomeText = () => {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 mt-30 mb-6">
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="text-white">Welcome, </span>
          <span className="text-[#A95BAB]">{getUserName()}!</span>
        </h2>
      </div>
    );
  };

  const GradientTitle = () => {
    return (
      <div className="text-right">
        <div className="space-y-1">
          <div className="text-3xl md:text-3xl font-bold text-gray-400 leading-tight">
            A Marketplace Where Creative
          </div>
          <div
            className="text-3xl md:text-4xl font-bold leading-tight"
            style={{
              background:
                "linear-gradient(135deg, #22c55e 0%, #9ca3af 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Dreams Take Shape.
          </div>
        </div>
      </div>
    );
  };

  const getLayout = () => {
    if (typeof window === "undefined") return buildDesktopLayout();

    const screenWidth = window.innerWidth;
    const isMobile = screenWidth < 768;
    const isTablet = screenWidth >= 768 && screenWidth < 1024;

    if (isMobile) return buildMobileLayout();
    if (isTablet) return buildTabletLayout();
    return buildDesktopLayout();
  };

  return (
    <div className="w-full">
      <div
        className="w-full min-h-[520px] relative overflow-hidden"
        style={{
          backgroundImage: `
      linear-gradient(to right, #1c1c1c 0%, #1c1c1c 70%, rgba(192, 0, 199, 0.51) 100%),
      url('/image/hero-image.png')
    `,
          backgroundSize: "cover",
          backgroundPosition: "center right",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Welcome text now inside the hero background */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-white">Welcome, </span>
            <span className="text-[#A95BAB]">{getUserName()}!</span>
          </h2>
        </div>
        
        {/* Main hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {getLayout()}
        </div>
      </div>
    </div>
  );
}