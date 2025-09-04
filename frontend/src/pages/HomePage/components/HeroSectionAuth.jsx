"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EnhancedSearchBox from "../../../components/common/EnhancedSearchBox";
import SuggestionChip from "../../../components/common/SuggestionChip";

export default function HeroSectionAuth({ backgroundImageUrl }) {
  const [searchController, setSearchController] = useState("");
  const navigate = useNavigate();

  // Get user from Redux store
  const { user } = useSelector((state) => state.auth);

  // Get user's first name or fallback
  const getUserName = () => {
    if (user?.firstName) return user.firstName;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  // Handle search functionality
  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      const params = new URLSearchParams();
      
      // Map search terms to category names (this should match your database categories)
      const categoryMapping = {
        "logo": "Logo Design",
        "graphic design": "Graphic Design", 
        "3D Render": "3D Design",
        "3d render": "3D Design",
        "illustration": "Digital Art",
        "branding": "Branding",
        "web design": "Web Design",
        "ui design": "UI/UX Design",
        "ux design": "UI/UX Design",
        "character design": "Character Design"
      };
      
      const searchLower = searchTerm.toLowerCase().trim();
      const matchedCategory = categoryMapping[searchLower];
      
      if (matchedCategory) {
        // If search term matches a category, search by category
        console.log(`🏷️ Search term "${searchTerm}" mapped to category "${matchedCategory}"`);
        params.set("category", matchedCategory);
        params.set("type", "availability");
        navigate(`/marketplace?${params.toString()}`);
      } else {
        // Otherwise, search by text
        console.log(`🔍 Search term "${searchTerm}" will be used as text search`);
        params.set("search", searchTerm.trim());
        params.set("type", "availability");
        navigate(`/marketplace?${params.toString()}`);
      }
    }
  };

  // Handle suggestion selection from enhanced search
  const handleSuggestionSelected = (suggestion) => {
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
    
    // For any other type, use normal search logic
    handleSearch(suggestion.title);
  };

  // Handle suggestion chip click
  const handleSuggestionClick = (suggestion) => {
    setSearchController(suggestion);
    handleSearch(suggestion); // Immediately search when clicking a chip
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
    const suggestions = [
      "logo",
      "graphic design",
      "3D Render",
      "illustration",
      "branding",
    ];

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
          {suggestions.map((suggestion, index) => (
            <SuggestionChip
              key={index}
              label={suggestion}
              onTap={() => handleSuggestionClick(suggestion)}
              fontSize={getFontSize()}
            />
          ))}
        </div>
      );
    }

    // For mobile and tablet, use flex wrap with intrinsic width
    return (
      <div className="flex flex-wrap gap-3 items-start">
        {suggestions.map((suggestion, index) => (
          <SuggestionChip
            key={index}
            label={suggestion}
            onTap={() => handleSuggestionClick(suggestion)}
            fontSize={getFontSize()}
          />
        ))}
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