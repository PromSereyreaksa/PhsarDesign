import { Search, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

export default function SearchBar({ type = "all", filters, onFilterChange }) {
  const [query, setQuery] = useState(filters?.search || "");
  const debounceTimer = useRef(null);
  const DEBOUNCE_DELAY = 300;

  // Sync query with filters.search
  useEffect(() => {
    setQuery(filters?.search || "");
  }, [filters?.search]);

  // Memoize the filter change handler to avoid infinite re-renders
  const handleFilterUpdate = useCallback((searchValue) => {
    if (onFilterChange && searchValue !== (filters?.search || "")) {
      onFilterChange({ search: searchValue });
    }
  }, [onFilterChange, filters?.search]);

  // Debounced search effect
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      handleFilterUpdate(query.trim());
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, handleFilterUpdate]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      handleFilterUpdate(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
    handleFilterUpdate("");
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search posts by title..."
          className="w-full pl-10 pr-12 py-3 bg-gray-800/30 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-[#A95BAB]/50 focus:ring-1 focus:ring-[#A95BAB]/50 transition-all focus:outline-none cursor-pointer"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}