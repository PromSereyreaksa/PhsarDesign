import { ChevronDown, Filter, Search, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDebounce } from '../../hooks/usePerformance.jsx'
import { useSearchWorker } from '../../hooks/useWebWorker'

/**
 * Optimized Search Component with debouncing and Web Worker integration
 */
const OptimizedSearch = ({
  posts = [],
  onResultsChange,
  onSearchChange,
  placeholder = "Search projects, skills, or artists...",
  showFilters = true,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    category: 'all',
    experienceLevel: 'all',
    budgetMin: '',
    budgetMax: '',
    location: 'all'
  })
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [isSearching, setIsSearching] = useState(false)

  // Initialize search worker
  const { searchAndFilter, isReady, error } = useSearchWorker()

  // Extract unique values for filter options
  const filterOptions = useMemo(() => {
    const categories = new Set()
    const locations = new Set()
    
    posts.forEach(post => {
      if (post.category) {
        const categoryName = typeof post.category === 'string' ? post.category : post.category.name
        categories.add(categoryName)
      }
      if (post.location) {
        locations.add(post.location)
      }
    })

    return {
      categories: Array.from(categories),
      locations: Array.from(locations),
      experienceLevels: ['Beginner', 'Intermediate', 'Expert']
    }
  }, [posts])

  // Debounced search function
  const debouncedSearch = useDebounce(async (term, currentFilters, currentSortBy, currentSortOrder) => {
    if (!isReady || !searchAndFilter) return

    try {
      setIsSearching(true)
      const result = await searchAndFilter(
        posts,
        term,
        currentFilters,
        currentSortBy,
        currentSortOrder
      )
      
      onResultsChange?.(result.data)
      onSearchChange?.(term)
    } catch (err) {
      console.error('Search error:', err)
      onResultsChange?.(posts) // Fallback to all posts
    } finally {
      setIsSearching(false)
    }
  }, 300)

  // Effect to trigger search when inputs change
  useEffect(() => {
    debouncedSearch(searchTerm, filters, sortBy, sortOrder)
  }, [searchTerm, filters, sortBy, sortOrder, debouncedSearch])

  // Handle search input change
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value)
  }, [])

  // Handle filter changes
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  // Clear search and filters
  const clearSearch = useCallback(() => {
    setSearchTerm('')
    setFilters({
      category: 'all',
      experienceLevel: 'all',
      budgetMin: '',
      budgetMax: '',
      location: 'all'
    })
    setSortBy('date')
    setSortOrder('desc')
  }, [])

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'budgetMin' || key === 'budgetMax') {
        return value !== ''
      }
      return value !== 'all'
    })
  }, [filters])

  return (
    <div className={`bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={placeholder}
            className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:border-[#A95BAB] focus:outline-none transition-colors"
            aria-label="Search"
          />
          
          {/* Loading indicator */}
          {isSearching && (
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#A95BAB] border-t-transparent"></div>
            </div>
          )}
          
          {/* Clear button */}
          {(searchTerm || hasActiveFilters) && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Worker error indicator */}
        {error && (
          <p className="text-red-400 text-sm mt-2">
            Search optimization unavailable. Using fallback search.
          </p>
        )}
      </div>

      {/* Filters and Sort */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 items-center">
          {/* Filter Toggle */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors
              ${hasActiveFilters 
                ? 'bg-[#A95BAB]/20 border-[#A95BAB]/50 text-[#A95BAB]' 
                : 'bg-gray-700/50 border-gray-600/50 text-gray-300 hover:border-gray-500'
              }
            `}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-[#A95BAB] text-white text-xs px-2 py-0.5 rounded-full">
                {Object.values(filters).filter(v => v !== 'all' && v !== '').length}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-gray-300 focus:border-[#A95BAB] focus:outline-none"
          >
            <option value="date">Sort by Date</option>
            <option value="budget">Sort by Budget</option>
            <option value="title">Sort by Title</option>
            <option value="views">Sort by Views</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-gray-300 hover:border-gray-500 transition-colors"
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && isFilterOpen && (
        <div className="mt-4 p-4 bg-gray-900/30 rounded-lg border border-gray-700/30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-3 py-2 text-gray-300 focus:border-[#A95BAB] focus:outline-none"
              >
                <option value="all">All Categories</option>
                {filterOptions.categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Experience Level Filter */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Experience Level</label>
              <select
                value={filters.experienceLevel}
                onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-3 py-2 text-gray-300 focus:border-[#A95BAB] focus:outline-none"
              >
                <option value="all">All Levels</option>
                {filterOptions.experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Budget Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={filters.budgetMin}
                  onChange={(e) => handleFilterChange('budgetMin', e.target.value)}
                  placeholder="Min"
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-3 py-2 text-gray-300 focus:border-[#A95BAB] focus:outline-none"
                />
                <input
                  type="number"
                  value={filters.budgetMax}
                  onChange={(e) => handleFilterChange('budgetMax', e.target.value)}
                  placeholder="Max"
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-3 py-2 text-gray-300 focus:border-[#A95BAB] focus:outline-none"
                />
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Location</label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-3 py-2 text-gray-300 focus:border-[#A95BAB] focus:outline-none"
              >
                <option value="all">All Locations</option>
                <option value="remote">Remote</option>
                {filterOptions.locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OptimizedSearch
