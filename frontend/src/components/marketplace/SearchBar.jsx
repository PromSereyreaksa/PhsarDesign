import { Briefcase, Search, User, Wrench, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Autosuggest from 'react-autosuggest';
import { useNavigate } from "react-router-dom";
import categoryAPI from "../../store/api/categoryAPI";

// CSS for react-autosuggest
const autosuggestStyles = `
  .marketplace-autosuggest .react-autosuggest__container {
    position: relative;
    width: 100%;
  }

  .marketplace-autosuggest .react-autosuggest__input {
    width: 100%;
    padding-left: 40px;
    padding-right: 48px;
    padding-top: 12px;
    padding-bottom: 12px;
    background: rgba(31, 41, 55, 0.3);
    border: 1px solid rgba(75, 85, 99, 0.5);
    border-radius: 12px;
    color: white;
    font-size: 16px;
    transition: all 0.3s ease-out;
  }

  .marketplace-autosuggest .react-autosuggest__input:focus {
    outline: none;
    border-color: rgba(169, 91, 171, 0.5);
    box-shadow: 0 0 0 1px rgba(169, 91, 171, 0.5);
  }

  .marketplace-autosuggest .react-autosuggest__input::placeholder {
    color: rgba(156, 163, 175, 1);
  }

  .marketplace-autosuggest .react-autosuggest__suggestions-container {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 50;
    margin-top: 8px;
  }

  .marketplace-autosuggest .react-autosuggest__suggestions-container--open {
    display: block;
  }

  .marketplace-autosuggest .react-autosuggest__suggestions-list {
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

  .marketplace-autosuggest .react-autosuggest__suggestion {
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid rgba(75, 85, 99, 0.3);
    transition: background-color 0.2s ease;
  }

  .marketplace-autosuggest .react-autosuggest__suggestion:last-child {
    border-bottom: none;
  }

  .marketplace-autosuggest .react-autosuggest__suggestion--highlighted {
    background: rgba(169, 91, 171, 0.2);
  }

  .marketplace-autosuggest .react-autosuggest__suggestion:hover {
    background: rgba(169, 91, 171, 0.1);
  }

  @media (max-width: 768px) {
    .marketplace-autosuggest .react-autosuggest__input {
      font-size: 14px;
    }
  }
`;

export default function SearchBar({ type = "all", filters, onFilterChange, activeTab = "availability" }) {
  const [query, setQuery] = useState(filters?.search || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef(null);
  const styleElement = useRef(null);
  const navigate = useNavigate();
  const DEBOUNCE_DELAY = 300;

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

  // Sync query with search filter from URL only on mount or when filters change externally
  useEffect(() => {
    // Only update query if it's different and not currently being typed
    if (filters?.search !== undefined && filters.search !== query) {
      setQuery(filters.search);
    }
  }, [filters?.search]); // Removed query dependency to prevent loops

  // Get category suggestions based on active tab - only from API
  const fetchSuggestions = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 1) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      // Fetch all categories from API and filter them
      const categoriesResponse = await categoryAPI.getAllCategories();
      console.log("SearchBar - Categories response:", categoriesResponse); // Debug log
      
      const categories = categoriesResponse.categories || categoriesResponse.data || categoriesResponse || [];
      console.log("SearchBar - Extracted categories:", categories); // Debug log
      
      const categoryMatches = categories
        .filter(cat => 
          cat.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(cat => {
          // Try different possible ID fields
          const categoryId = cat.categoryId || cat.id || cat._id;
          console.log("SearchBar - Category mapping:", { name: cat.name, categoryId, originalCat: cat });
          
          return {
            id: `category-${categoryId || 'unknown'}`,
            title: cat.name,
            type: 'category',
            category: activeTab === 'jobs' ? 'Job Category' : 'Service Category',
            categoryId: categoryId,
            data: cat
          };
        })
        .filter(cat => cat.categoryId); // Only include categories with valid IDs

      console.log("SearchBar - Category matches:", categoryMatches); // Debug log
      
      // Limit total suggestions
      setSuggestions(categoryMatches.slice(0, 8));

    } catch (error) {
      console.error("Error fetching suggestions:", error);
      // Still show some basic suggestions based on search query
      if (searchQuery.length >= 2) {
        const basicSuggestions = [
          {
            id: `search-${searchQuery}`,
            title: searchQuery,
            type: 'search',
            category: 'Search Term'
          }
        ];
        setSuggestions(basicSuggestions);
      } else {
        setSuggestions([]);
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  // Memoize the filter change handler to avoid infinite re-renders
  const handleFilterUpdate = useCallback((searchValue) => {
    if (onFilterChange && searchValue !== (filters?.search || "")) {
      onFilterChange({ search: searchValue });
    }
  }, [onFilterChange, filters?.search]);

  // Trigger search when component mounts with existing search filter (from URL)
  useEffect(() => {
    // On initial mount, if there's a search filter but no active search has been triggered
    if (filters?.search && filters.search.trim() && query === filters.search) {
      console.log("[SearchBar] Initial search detected from URL:", filters.search);
      // Fetch suggestions for the initial search term
      fetchSuggestions(filters.search.trim());
    }
  }, [filters?.search, fetchSuggestions]); // Only run when filters.search changes

  // No auto-fetching - suggestions only on Enter or manual trigger
  // Removed debounced suggestions fetching to reduce API calls

  // Handle clearing search when input becomes empty
  useEffect(() => {
    // Only clear search filters when input is completely empty
    if (query === "" && filters?.search && filters.search !== "") {
      console.log("[SearchBar] Input cleared, clearing search filters");
      handleFilterUpdate("");
    }
  }, [query, filters?.search, handleFilterUpdate]);

  // Autosuggest configuration
  const getSuggestionValue = (suggestion) => suggestion.title;

  const renderSuggestion = (suggestion) => (
    <div className="flex items-center gap-3 min-h-[48px] md:min-h-0">
      <div className="flex-1 min-w-0">
        <div className="text-white text-sm truncate">{suggestion.title}</div>
        <div className="flex items-center gap-2">
          <span className="text-[#A95BAB] text-xs capitalize">{suggestion.type}</span>
          {suggestion.category && (
            <>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400 text-xs">{suggestion.category}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const onSuggestionSelected = (event, { suggestion }) => {
    // Clear suggestions immediately
    setSuggestions([]);
    
    if (suggestion.type === 'category') {
      // Navigate to category page with proper URL structure
      const categoryName = suggestion.title;
      const categoryId = suggestion.categoryId;
      
      // Create URL-friendly category name
      const urlCategoryName = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      // Determine the type based on active tab
      const postType = activeTab === 'jobs' ? 'jobs' : 'services';
      
      if (categoryId && categoryId !== 'unknown') {
        // Navigate to specific category page: /marketplace/category/{categoryName}?type={services/jobs}&categoryId={id}
        navigate(`/marketplace/category/${urlCategoryName}?type=${postType}&categoryId=${categoryId}`);
      } else {
        // Fallback to marketplace with category search if no valid ID
        console.warn("No valid categoryId found, falling back to search by category name");
        navigate(`/marketplace?category=${encodeURIComponent(categoryName)}&type=${postType}`);
      }
    } else {
      // For keyword searches, set the query and update filter
      setQuery(suggestion.title);
      handleFilterUpdate(suggestion.title);
    }
  };

  const onSuggestionsFetchRequested = ({ value: inputValue }) => {
    // Suggestions are already handled by useEffect
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      console.log("[SearchBar] Enter key pressed, triggering immediate search:", query);
      
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      
      // Clear suggestions
      setSuggestions([]);
      
      // Only search when user presses Enter
      if (query.trim()) {
        console.log("[SearchBar] Enter pressed - executing search for:", query.trim());
        // Clear suggestions since we're executing the search
        setSuggestions([]);
        handleFilterUpdate(query.trim());
      } else {
        console.log("[SearchBar] Enter pressed - clearing search");
        setSuggestions([]);
        handleFilterUpdate("");
      }
    }
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    // Only clear filters when user explicitly clears the search
    handleFilterUpdate("");
  };

  const inputProps = {
    placeholder: `Search ${activeTab === 'jobs' ? 'job posts' : 'services'} by title... (Press Enter)`,
    value: query,
    onChange: (e, { newValue }) => {
      setQuery(newValue);
    },
    onKeyDown: handleKeyDown,
    className: "react-autosuggest__input",
  };

  return (
    <div className="relative w-full marketplace-autosuggest">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
        
        {/* Loading indicator */}
        {loading && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#A95BAB]"></div>
          </div>
        )}

        {/* Clear button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer z-10"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Autosuggest component */}
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          onSuggestionSelected={onSuggestionSelected}
          inputProps={inputProps}
          focusInputOnSuggestionClick={false}
        />
      </div>
    </div>
  );
}