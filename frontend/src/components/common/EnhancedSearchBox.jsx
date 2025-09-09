"use client"

import { Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Autosuggest from 'react-autosuggest';
import { useNavigate } from "react-router-dom";
import categoryAPI from "../../store/api/categoryAPI";

// CSS for react-autosuggest
const autosuggestStyles = `
  .react-autosuggest__container {
    position: relative;
    width: 100%;
  }

  .react-autosuggest__input {
    width: 100%;
    height: 48px;
    padding-left: 48px;
    padding-right: 16px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
    font-size: 16px;
    transition: all 0.3s ease-out;
  }

  .react-autosuggest__input:focus {
    outline: none;
    ring: 2px;
    ring-color: #A95BAB;
    border-color: transparent;
  }

  .react-autosuggest__input::placeholder {
    color: rgba(156, 163, 175, 1);
  }

  .react-autosuggest__suggestions-container {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 50;
    margin-top: 8px;
  }

  .react-autosuggest__suggestions-container--open {
    display: block;
  }

  .react-autosuggest__suggestions-list {
    margin: 0;
    padding: 0;
    list-style-type: none;
    background: rgba(31, 41, 55, 0.95);
    border: 1px solid rgba(75, 85, 99, 0.5);
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    max-height: 300px;
    overflow-y: auto;
  }

  .react-autosuggest__suggestion {
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid rgba(75, 85, 99, 0.3);
    transition: background-color 0.2s ease;
  }

  .react-autosuggest__suggestion:last-child {
    border-bottom: none;
  }

  .react-autosuggest__suggestion--highlighted {
    background: rgba(169, 91, 171, 0.2);
  }

  .react-autosuggest__suggestion:hover {
    background: rgba(169, 91, 171, 0.1);
  }

  .suggestion-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .suggestion-title {
    color: white;
    font-size: 14px;
    font-weight: 500;
  }

  .suggestion-type {
    color: #A95BAB;
    font-size: 12px;
    text-transform: capitalize;
  }

  .suggestion-category {
    color: rgba(156, 163, 175, 1);
    font-size: 11px;
  }
`;

export default function EnhancedSearchBox({
  value = "",
  onChange,
  onSubmit,
  onSuggestionSelected,
  placeholder = "What type of service are you looking for?",
  searchType = "all", // "all", "jobs", "services"
  className = ""
}) {
  const [suggestions, setSuggestions] = useState([]); // No suggestions by default
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef(null);
  const styleElement = useRef(null);
  const navigate = useNavigate();

  // Add styles to document head
  useEffect(() => {
    if (!styleElement.current) {
      styleElement.current = document.createElement('style');
      styleElement.current.textContent = autosuggestStyles;
      document.head.appendChild(styleElement.current);
    }

    return () => {
      if (styleElement.current && document.head.contains(styleElement.current)) {
        document.head.removeChild(styleElement.current);
        styleElement.current = null;
      }
    };
  }, []);

  // Get category suggestions - only from API
  const fetchSuggestions = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 1) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch all categories from API and filter them
      const categoriesResponse = await categoryAPI.getAllCategories();
      console.log("Categories response:", categoriesResponse); // Debug log
      
      const categories = categoriesResponse.categories || categoriesResponse.data || categoriesResponse || [];
      console.log("Extracted categories:", categories); // Debug log
      
      const categoryMatches = categories
        .filter(cat => 
          cat.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(cat => {
          // Try different possible ID fields
          const categoryId = cat.categoryId || cat.id || cat._id;
          console.log("Category mapping:", { name: cat.name, categoryId, originalCat: cat });
          
          return {
            id: `category-${categoryId || 'unknown'}`,
            title: cat.name,
            type: 'category',
            category: 'Category',
            categoryId: categoryId,
            data: cat
          };
        })
        .filter(cat => cat.categoryId); // Only include categories with valid IDs

      console.log("Category matches:", categoryMatches); // Debug log
      
      // Limit total suggestions
      setSuggestions(categoryMatches.slice(0, 8));

    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // No auto-fetching - suggestions only on Enter
  // Removed debounced suggestion fetching to reduce API calls

  // Autosuggest configuration
  const getSuggestionValue = (suggestion) => suggestion.title;

  const renderSuggestion = (suggestion) => (
    <div className="suggestion-content">
      <div className="suggestion-title">{suggestion.title}</div>
      <div className="flex items-center gap-2">
        <span className="suggestion-type">{suggestion.type}</span>
        {suggestion.category && (
          <>
            <span className="text-gray-500">•</span>
            <span className="suggestion-category">{suggestion.category}</span>
          </>
        )}
      </div>
    </div>
  );

  const onSuggestionsFetchRequested = ({ value: inputValue }) => {
    // Suggestions are already handled by useEffect
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelectedHandler = (event, { suggestion }) => {
    if (onSuggestionSelected) {
      onSuggestionSelected(suggestion);
    } else {
      // Default navigation behavior if no custom handler provided
      if (suggestion.type === 'category') {
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
      } else if (onChange) {
        onChange(suggestion.title);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onSubmit) {
      e.preventDefault();
      // Clear suggestions when submitting
      setSuggestions([]);
      onSubmit();
    }
  };

  const inputProps = {
    placeholder,
    value,
    onChange: (e, { newValue }) => {
      if (onChange) {
        onChange(newValue);
      }
    },
    onKeyPress: handleKeyPress,
    className: `react-autosuggest__input ${className}`,
  };

  return (
    <div className="relative w-full max-w-[875px]">
      <div className="relative">
        {/* Search icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 z-10">
          <Search className="w-5 h-5 text-white" />
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#A95BAB]"></div>
          </div>
        )}

        {/* Autosuggest component */}
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          onSuggestionSelected={onSuggestionSelectedHandler}
          inputProps={inputProps}
          focusInputOnSuggestionClick={false}
        />
      </div>
    </div>
  );
}
