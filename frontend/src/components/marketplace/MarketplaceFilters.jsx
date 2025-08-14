"use client"

import { useState } from "react"
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react"

const MarketplaceFilters = ({ filters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const categories = [
    "All Categories",
    "Graphic Design",
    "Web Design",
    "Logo Design",
    "Illustration",
    "Photography",
    "Video Editing",
    "Animation",
    "UI/UX Design",
  ]

  const priceRanges = [
    { label: "Any Price", value: "" },
    { label: "$0 - $50", value: "0-50" },
    { label: "$50 - $200", value: "50-200" },
    { label: "$200 - $500", value: "200-500" },
    { label: "$500+", value: "500+" },
  ]

  const sortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Most Popular", value: "popular" },
    { label: "Deadline Soon", value: "deadline" },
  ]

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value })
  }

  const handleSkillToggle = (skill) => {
    const currentSkills = filters.skills || []
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter((s) => s !== skill)
      : [...currentSkills, skill]

    onFilterChange({ skills: newSkills })
  }

  const clearAllFilters = () => {
    onFilterChange({
      category: "",
      priceRange: "",
      location: "",
      skills: [],
      sortBy: "newest",
    })
  }

  const popularSkills = [
    "Photoshop",
    "Illustrator",
    "Figma",
    "After Effects",
    "Premiere Pro",
    "Sketch",
    "InDesign",
    "Blender",
  ]

  return (
    <div className="bg-gray-800/20 backdrop-blur-sm border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-[#A95BAB]" />
            <h3 className="text-lg font-semibold text-white">Filter Jobs</h3>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white transition-colors md:hidden"
          >
            <span>Filters</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Main Filters Row */}
        <div className={`grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4 ${!isExpanded ? 'hidden md:grid' : ''}`}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Category</label>
            <select
              value={filters.category || ""}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
            >
              {categories.map((category) => (
                <option key={category} value={category === "All Categories" ? "" : category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Price Range</label>
            <select
              value={filters.priceRange || ""}
              onChange={(e) => handleFilterChange("priceRange", e.target.value)}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Location</label>
            <input
              type="text"
              placeholder="Any location"
              value={filters.location || ""}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Sort By</label>
            <select
              value={filters.sortBy || "newest"}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              className="w-full px-4 py-2 bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Less Filters" : "More Filters"}
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="border-t border-gray-700 pt-4">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">Skills</label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
                {popularSkills.map((skill) => (
                  <button
                    key={skill}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      (filters.skills || []).includes(skill)
                        ? "bg-purple-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    onClick={() => handleSkillToggle(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters & Clear */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value || (Array.isArray(value) && value.length === 0)) return null

              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-purple-600 text-white text-sm rounded-full"
                >
                  {key}: {Array.isArray(value) ? value.join(", ") : value}
                  <button
                    onClick={() => handleFilterChange(key, Array.isArray(value) ? [] : "")}
                    className="hover:bg-purple-700 rounded-full p-1"
                  >
                    ×
                  </button>
                </span>
              )
            })}
          </div>

          {Object.values(filters).some((v) => v && (Array.isArray(v) ? v.length > 0 : true)) && (
            <button
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              onClick={clearAllFilters}
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MarketplaceFilters
