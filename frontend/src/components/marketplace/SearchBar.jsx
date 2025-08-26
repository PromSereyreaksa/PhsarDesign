import { Search, X, User, Briefcase, Wrench } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

export default function SearchBar({ type = "all", filters, onFilterChange }) {
  const [query, setQuery] = useState(filters?.search || "");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef(null);
  const DEBOUNCE_DELAY = 300;

  // Sync query with search filter from URL
  useEffect(() => {
    if (filters?.search && filters.search !== query) {
      setQuery(filters.search);
    }
  }, [filters?.search]);

  const categories = [
    { id: "all", label: "All", icon: Search },
    { id: "users", label: "Users", icon: User },
    { id: "jobs", label: "Jobs", icon: Briefcase },
    { id: "services", label: "Services", icon: Wrench }
  ];

  const fetchData = async (searchQuery, category = selectedCategory) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      let allResults = [];

      if (category === "all") {
        // Search in all categories
        const [usersRes, jobsRes, servicesRes] = await Promise.allSettled([
          usersAPI.search ? usersAPI.search({ q: searchQuery }) : usersAPI.getAll(),
          jobPostsAPI.search({ q: searchQuery }),
          availabilityPostsAPI.search({ q: searchQuery })
        ]);

        // Process users
        if (usersRes.status === 'fulfilled') {
          const users = usersRes.value.data.users || usersRes.value.data || [];
          const filteredUsers = users.filter(user => 
            user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
          );
          allResults.push(...filteredUsers.map(user => ({
            ...user,
            category: 'users',
            displayTitle: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
            id: user.userId || user.id
          })));
        }

        // Process jobs
        if (jobsRes.status === 'fulfilled') {
          const jobs = jobsRes.value.data.jobPosts || [];
          allResults.push(...jobs.map(job => ({
            ...job,
            category: 'jobs',
            displayTitle: job.title,
            id: job.jobId
          })));
        }

        // Process services
        if (servicesRes.status === 'fulfilled') {
          const services = servicesRes.value.data.posts || [];
          allResults.push(...services.map(service => ({
            ...service,
            category: 'services',
            displayTitle: service.title,
            id: service.postId
          })));
        }
      } else {
        // Search in specific category
        let response;
        if (category === "users") {
          response = await (usersAPI.search ? usersAPI.search({ q: searchQuery }) : usersAPI.getAll());
          const users = response.data.users || response.data || [];
          const filteredUsers = users.filter(user => 
            user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
          );
          allResults = filteredUsers.map(user => ({
            ...user,
            category: 'users',
            displayTitle: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
            id: user.userId || user.id
          }));
        } else if (category === "jobs") {
          response = await jobPostsAPI.search({ q: searchQuery });
          allResults = (response.data.jobPosts || []).map(job => ({
            ...job,
            category: 'jobs',
            displayTitle: job.title,
            id: job.jobId
          }));
        } else if (category === "services") {
          response = await availabilityPostsAPI.search({ q: searchQuery });
          allResults = (response.data.posts || []).map(service => ({
            ...service,
            category: 'services',
            displayTitle: service.title,
            id: service.postId
          }));
        }
      }

      setResults(allResults);
      setShowSuggestions(allResults.length > 0);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

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
      if (query.trim()) {
        fetchData(query.trim());
      }
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
      if (query.trim()) {
        fetchData(query.trim());
      }
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowSuggestions(false);
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

      {/* Search Results Dropdown */}
      {showSuggestions && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700/50 rounded-xl shadow-lg max-h-96 overflow-y-auto z-50">
          {loading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#A95BAB]"></div>
            </div>
          )}
          {!loading && results.map((result) => {
            const CategoryIcon = categories.find(cat => cat.id === result.category)?.icon || Search;
            return (
              <div
                key={`${result.category}-${result.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700/50 cursor-pointer border-b border-gray-700/30 last:border-b-0"
                onClick={() => {
                  // Handle result selection here
                  setQuery(result.displayTitle);
                  setShowSuggestions(false);
                }}
              >
                <CategoryIcon className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <div className="text-white text-sm">{result.displayTitle}</div>
                  <div className="text-gray-400 text-xs capitalize">{result.category}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}