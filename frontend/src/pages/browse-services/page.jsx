"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer"
import { Search, Filter, MapPin, Clock, Users, Star, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { MultiStepApplicationModal } from "../../components/ui/multi-step-application-modal"
import { availabilityPostsAPI } from "../../services/api"

export default function BrowseServices() {
  const [availabilityPosts, setAvailabilityPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedBudget, setSelectedBudget] = useState("Any Budget")
  const [selectedService, setSelectedService] = useState(null)
  const [isHireModalOpen, setIsHireModalOpen] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const itemsPerPage = 10

  // Fetch availability posts with pagination
  const loadAvailabilityPosts = async (page = 1, filters = {}) => {
    setIsLoading(true)
    setError(null)
    try {
      const params = {
        status: 'active',
        page,
        limit: itemsPerPage,
        ...filters
      }
      
      const response = await availabilityPostsAPI.getAll(params)
      setAvailabilityPosts(response.data.posts || response.data || [])
      setTotalPages(response.data.totalPages || 1)
      setTotalCount(response.data.totalCount || 0)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching availability posts:', error)
      setError('Failed to load services')
    } finally {
      setIsLoading(false)
    }
  }

  // Load initial data
  useEffect(() => {
    loadAvailabilityPosts(1)
  }, [])

  // Handle filter changes - reload with new filters
  const applyFilters = () => {
    const filters = {}
    if (searchQuery.trim()) filters.search = searchQuery
    if (selectedCategory !== "All Categories") filters.category = selectedCategory.toLowerCase().replace(/\s+/g, '-')
    if (selectedBudget !== "Any Budget") filters.budget = selectedBudget
    
    loadAvailabilityPosts(1, filters)
  }

  const categories = ["illustration", "design", "photography", "writing", "video", "music", "animation", "web-development"]

  // Handle search input
  const handleSearch = () => {
    applyFilters()
  }

  // Handle pagination
  const handlePageChange = (page) => {
    const filters = {}
    if (searchQuery.trim()) filters.search = searchQuery
    if (selectedCategory !== "All Categories") filters.category = selectedCategory.toLowerCase().replace(/\s+/g, '-')
    if (selectedBudget !== "Any Budget") filters.budget = selectedBudget
    
    loadAvailabilityPosts(page, filters)
  }

  // Handle hiring an artist
  const handleHireArtist = (service) => {
    setSelectedService(service)
    setIsHireModalOpen(true)
  }

  const handleHireSuccess = () => {
    console.log('Artist hired successfully!')
    loadAvailabilityPosts(currentPage) // Refresh the data
  }

  // Format availability post data to match the expected structure
  const formatServiceForDisplay = (service) => ({
    id: service.postId || service.id,
    postId: service.postId || service.id,
    title: service.title || 'Untitled Service',
    description: service.description || 'No description available',
    budget: service.budget ? `$${service.budget}` : 'Price on request',
    budgetType: 'Starting at',
    skills: service.skills ? service.skills.split(',').map(s => s.trim()) : [],
    artistName: service.artist?.name || 'Anonymous Artist',
    artistRating: service.artist?.rating || 4.5,
    artistReviews: service.artist?.totalCommissions || 0,
    location: service.location || 'Remote',
    availability: service.availabilityType || 'flexible',
    postedTime: service.createdAt ? new Date(service.createdAt).toLocaleDateString() : 'Recently',
    verified: true, // Default - would need verification system
    status: service.status,
    category: service.category,
    duration: service.duration,
    portfolioSamples: service.portfolioSamples || []
  })

  const displayServices = availabilityPosts.map(formatServiceForDisplay)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/home" className="inline-flex items-center text-gray-300 hover:text-[#A95BAB] transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent mb-4">
            Browse Creative Services
          </h1>
          <p className="text-xl text-gray-300">Find talented artists offering their creative services</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white/5 border-white/10 backdrop-blur-sm rounded-lg border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for creative services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10 rounded-xl"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Button 
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#A95BAB] hover:bg-[#A95BAB]/80 h-8 px-3"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
                </Button>
              </div>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-gray-800 border-[#A95BAB]/50 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-[#A95BAB]/50">
                <SelectItem
                  value="All Categories"
                  className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white"
                >
                  All Categories
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedBudget} onValueChange={setSelectedBudget}>
              <SelectTrigger className="bg-gray-800 border-[#A95BAB]/50 text-white">
                <SelectValue placeholder="Budget" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-[#A95BAB]/50">
                <SelectItem
                  value="Any Budget"
                  className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white"
                >
                  Any Budget
                </SelectItem>
                <SelectItem
                  value="0-500"
                  className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white"
                >
                  $0 - $500
                </SelectItem>
                <SelectItem
                  value="500-1000"
                  className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white"
                >
                  $500 - $1,000
                </SelectItem>
                <SelectItem
                  value="1000-5000"
                  className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white"
                >
                  $1,000 - $5,000
                </SelectItem>
                <SelectItem
                  value="5000+"
                  className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white"
                >
                  $5,000+
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-300">
              Showing {displayServices.length} of {totalCount} creative services
              (Page {currentPage} of {totalPages})
              {isLoading && <span className="ml-2">Loading...</span>}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-[#A95BAB]/50 text-white hover:bg-[#A95BAB]/30 hover:border-[#A95BAB] bg-gray-800"
            >
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#A95BAB]" />
            <span className="ml-2 text-gray-300">Loading creative services...</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && displayServices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">No creative services found</div>
            <p className="text-gray-500">Try adjusting your search criteria or check back later for new services.</p>
          </div>
        )}

        {/* Service Listings */}
        {!isLoading && displayServices.length > 0 && (
          <div className="space-y-6">
            {displayServices.map((service) => (
              <Card
                key={service.id}
                className="bg-white/5 border-white/10 hover:bg-[#A95BAB]/5 hover:border-[#A95BAB]/30 transition-all duration-500 ease-out"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 text-white hover:text-[#A95BAB] cursor-pointer">
                        {service.title}
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {service.postedTime}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {service.location}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          Available {service.availability}
                        </span>
                        {service.verified && <Badge className="bg-green-500 text-white border-0">Verified Artist</Badge>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-[#A95BAB] mb-1">{service.budget}</div>
                      <div className="text-sm text-gray-400">{service.budgetType}</div>
                      {service.duration && <div className="text-sm text-orange-400 font-medium mt-1">{service.duration}</div>}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-300 mb-4 line-clamp-3">{service.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="border-white/20 text-gray-300">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium text-white">{service.artistName}</div>
                        <div className="flex items-center text-sm text-gray-400">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span>{service.artistRating}</span>
                          <span className="ml-1">({service.artistReviews} commissions)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#A95BAB]/50 text-white hover:bg-[#A95BAB]/30 hover:border-[#A95BAB] bg-gray-800"
                      >
                        View Portfolio
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white"
                        onClick={() => handleHireArtist(service)}
                      >
                        Hire Artist
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-12">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="border-[#A95BAB]/50 text-white hover:bg-[#A95BAB]/30 hover:border-[#A95BAB] bg-gray-800 disabled:opacity-50"
            >
              Previous
            </Button>
            
            {/* Page numbers */}
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    className={
                      currentPage === pageNumber
                        ? "bg-[#A95BAB] text-white hover:bg-[#A95BAB]/80"
                        : "border-[#A95BAB]/50 text-white hover:bg-[#A95BAB]/30 hover:border-[#A95BAB] bg-gray-800"
                    }
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="border-[#A95BAB]/50 text-white hover:bg-[#A95BAB]/30 hover:border-[#A95BAB] bg-gray-800 disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <Footer />
      
      {/* Hire Modal */}
      <MultiStepApplicationModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
        post={selectedService}
        applicationType="client_to_service"
        onSuccess={handleHireSuccess}
      />
    </div>
  )
}