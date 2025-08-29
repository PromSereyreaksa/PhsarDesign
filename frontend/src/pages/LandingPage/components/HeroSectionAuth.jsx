"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SearchBox from "../../../components/common/SearchBox";
import SuggestionChip from "../../../components/common/SuggestionChip";
import OptimizedImage from "../../../components/ui/OptimizedImage";

// Memoized components
const MemoizedSearchBox = React.memo(SearchBox);
const MemoizedSuggestionChip = React.memo(SuggestionChip);

export default function HeroSectionAuth({ backgroundImageUrl }) {
  const [searchController, setSearchController] = useState("");
  const navigate = useNavigate();

  // Get user from Redux store
  const { user } = useSelector((state) => state.auth);

  // Memoized user name calculation
  const userName = useMemo(() => {
    if (user?.firstName) return user.firstName;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  }, [user?.firstName, user?.email]);

  // Memoized category mapping
  const categoryMapping = useMemo(() => ({
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
  }), []);

  // Optimized search handler
  const handleSearch = useCallback((searchTerm) => {
    if (searchTerm.trim()) {
      const params = new URLSearchParams();
      const searchLower = searchTerm.toLowerCase().trim();
      const matchedCategory = categoryMapping[searchLower];
      
      if (matchedCategory) {
        params.set("category", matchedCategory);
        params.set("type", "availability");
      } else {
        params.set("search", searchTerm.trim());
        params.set("type", "availability");
      }
      
      navigate(`/marketplace?${params.toString()}`);
    }
  }, [categoryMapping, navigate]);

  // Optimized suggestion click handler
  const handleSuggestionClick = useCallback((suggestion) => {
    setSearchController(suggestion);
    handleSearch(suggestion);
  }, [handleSearch]);

  // Optimized search input handler
  const handleSearchChange = useCallback((value) => {
    setSearchController(value);
  }, []);

  // Optimized search submit handler
  const handleSearchSubmit = useCallback(() => {
    handleSearch(searchController);
  }, [handleSearch, searchController]);

  // Memoized suggestions
  const suggestions = useMemo(() => [
    "logo",
    "graphic design", 
    "3D Render",
    "illustration",
    "branding",
  ], []);

  // Memoized suggestion buttons
  const SuggestionButtons = useMemo(() => (
    <div className="flex flex-wrap gap-3">
      {suggestions.map((suggestion, index) => (
        <MemoizedSuggestionChip
          key={`${suggestion}-${index}`}
          label={suggestion}
          onTap={() => handleSuggestionClick(suggestion)}
          fontSize="text-sm"
        />
      ))}
    </div>
  ), [suggestions, handleSuggestionClick]);

  // Memoized welcome text
  const WelcomeText = useMemo(() => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      <h2 className="text-3xl md:text-4xl font-bold">
        <span className="text-white">Welcome, </span>
        <span className="text-[#A95BAB]">{userName}!</span>
      </h2>
    </div>
  ), [userName]);

  // Memoized gradient title
  const GradientTitle = useMemo(() => (
    <div className="text-right">
      <div className="space-y-1">
        <div className="text-2xl md:text-3xl font-bold text-gray-400 leading-tight">
          A Marketplace Where Creative
        </div>
        <div
          className="text-3xl md:text-4xl font-bold leading-tight"
          style={{
            background: "linear-gradient(135deg, #22c55e 0%, #9ca3af 100%)",
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
  ), []);

  return (
    <div className="w-full">
      <div className="w-full min-h-[520px] relative overflow-hidden">
        {/* Optimized background image */}
        <div className="absolute inset-0">
          {/* Gradient overlay */}
          <div 
            className="absolute inset-0 z-10"
            style={{
              background: "linear-gradient(to right, #1c1c1c 0%, #1c1c1c 70%, rgba(192, 0, 199, 0.51) 100%)"
            }}
          />
          
          {/* Background image with optimization */}
          <OptimizedImage
            src="/image/hero-image.png"
            alt="PhsarDesign Hero Background"
            className="w-full h-full object-cover object-center-right"
            priority={true}
            sizes="100vw"
            style={{
              objectPosition: "center right"
            }}
          />
        </div>
        
        {/* Welcome text */}
        <div className="relative z-20">
          {WelcomeText}
        </div>
        
        {/* Main hero content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 max-w-2xl">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Find Artists, See Work, Be Discovered
                </h1>
                
                <div className="space-y-4">
                  <MemoizedSearchBox
                    value={searchController}
                    onChange={handleSearchChange}
                    onSubmit={handleSearchSubmit}
                  />
                  {SuggestionButtons}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            {GradientTitle}
          </div>
        </div>
      </div>
    </div>
  );
}