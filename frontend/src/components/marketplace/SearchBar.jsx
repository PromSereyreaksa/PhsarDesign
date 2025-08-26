import { Briefcase, ChevronDown, Search, User, Wrench } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { availabilityPostsAPI, jobPostsAPI, usersAPI } from "../../lib/api"; // adjust path

export default function SearchBar({ type = "all", filters, onFilterChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  // Auto-sync category with marketplace section
  const selectedCategory = React.useMemo(() => {
    if (filters?.section === "services") return "services";
    if (filters?.section === "jobs") return "jobs";
    return "all";
  }, [filters?.section]);
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

      setResults(allResults.slice(0, 10)); // Limit to 10 results
      setShowSuggestions(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (query.trim()) {
        fetchData(query);
      } else {
        setResults([]);
        setShowSuggestions(false);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, selectedCategory]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      fetchData(query);
      if (onFilterChange) {
        onFilterChange({ search: query, category: selectedCategory });
      }
      setShowSuggestions(false);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (item) => {
    if (onFilterChange) {
      onFilterChange({ 
        search: item.displayTitle, 
        category: item.category,
        selectedItem: item 
      });
    }
    setQuery(item.displayTitle);
    setShowSuggestions(false);
  };

  const handleCategorySelect = (categoryId) => {
    // Update the marketplace section when category changes
    if (onFilterChange) {
      const sectionMap = {
        "services": "services",
        "jobs": "jobs",
        "users": null, // Users don't have a marketplace section
        "all": null    // All doesn't set a specific section
      };
      onFilterChange({ section: sectionMap[categoryId] });
    }
    
    setShowCategoryDropdown(false);
    if (query.trim()) {
      fetchData(query, categoryId);
    }
  };

  const handleInputFocus = () => {
    if (results.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      setShowCategoryDropdown(false);
    }, 200);
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    const IconComponent = category?.icon || Search;
    return <IconComponent className="w-4 h-4" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      users: 'text-blue-400',
      jobs: 'text-green-400',
      services: 'text-purple-400'
    };
    return colors[category] || 'text-gray-400';
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative flex">
        {/* Category Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="flex items-center gap-2 px-3 py-3 bg-gray-800/50 border border-gray-700/50 border-r-0 rounded-l-xl text-white hover:bg-gray-700/50 transition-all focus:outline-none focus:border-[#A95BAB]/50 h-[50px]"
          >
            {getCategoryIcon(selectedCategory)}
            <span className="text-sm font-medium min-w-[60px] text-left">{selectedCategoryData?.label}</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Category Dropdown */}
          {showCategoryDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-xl z-50 shadow-xl min-w-[120px]">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-white hover:bg-gray-700/50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                >
                  <category.icon className="w-4 h-4" />
                  <span className="text-sm">{category.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={`Search ${selectedCategory === 'all' ? 'everything' : selectedCategory}...`}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/30 border border-gray-700/50 rounded-r-xl text-white placeholder-gray-400 focus:border-[#A95BAB]/50 focus:ring-1 focus:ring-[#A95BAB]/50 transition-all focus:outline-none h-[50px]"
          />
        </div>
      </div>

      {/* Search Suggestions with Roblox-style format */}
      {(loading || (showSuggestions && results.length > 0)) && (
        <div className="absolute w-full mt-1 bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-xl max-h-64 overflow-y-auto z-50 shadow-xl">
          {loading && (
            <div className="px-4 py-3 text-gray-400 text-sm flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent mr-2"></div>
              Searching...
            </div>
          )}
          
          {!loading && showSuggestions && results.length > 0 && (
            <ul className="divide-y divide-gray-700/30">
              {results.map((item) => (
                <li
                  key={`${item.category}-${item.id}`}
                  className="px-4 py-3 hover:bg-gray-700/50 cursor-pointer text-white transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(item);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{item.displayTitle}</div>
                      <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        {getCategoryIcon(item.category)}
                        <span className={getCategoryColor(item.category)}>
                          "{query}" in {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}