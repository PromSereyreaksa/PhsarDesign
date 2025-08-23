import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { availabilityPostsAPI, jobPostsAPI } from "../../lib/api"; // adjust path

export default function SearchBar({ type = "availability", filters, onFilterChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef(null);
  const DEBOUNCE_DELAY = 300; // 300ms delay

  const fetchData = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      let response;
      if (type === "availability") {
        response = await availabilityPostsAPI.search({ q: searchQuery });
        setResults(response.data.posts);
      } else if (type === "job") {
        response = await jobPostsAPI.search({ q: searchQuery });
        setResults(response.data.jobPosts);
      }
      setShowSuggestions(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      if (query.trim()) {
        fetchData(query);
      } else {
        setResults([]);
        setShowSuggestions(false);
      }
    }, DEBOUNCE_DELAY);

    // Cleanup function
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, type]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      // Trigger immediate search on Enter
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      fetchData(query);
      if (onFilterChange) {
        onFilterChange({ search: query });
      }
      setShowSuggestions(false);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (item) => {
    // Update filters in your Redux store
    if (onFilterChange) {
      onFilterChange({ search: item.title });
    }
    setQuery(item.title); // Keep the selected text in input
    setShowSuggestions(false); // Hide suggestions after selection
  };

  const handleInputFocus = () => {
    if (results.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder="Search services or artists... (Press Enter to search)"
        className="w-full pl-10 pr-4 py-3 bg-gray-800/30 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-[#A95BAB]/50 focus:ring-1 focus:ring-[#A95BAB]/50 transition-all"
      />
      
      {loading && <p className="text-white mt-2">Searching...</p>}
      
      {showSuggestions && results.length > 0 && (
        <ul className="absolute w-full mt-1 bg-gray-800/80 border border-gray-700/50 rounded-xl max-h-64 overflow-y-auto z-10">
          {results.map((item) => (
            <li
              key={item.postId || item.jobId}
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
              onClick={() => handleSelect(item)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}