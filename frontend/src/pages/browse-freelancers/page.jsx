"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer"
import { Search, Filter, MapPin, Clock, Users, Star, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { MultiStepApplicationModal } from "../../components/ui/multi-step-application-modal"
import { freelancersAPI } from "../../services/api"

export default function BrowseFreelancers() {
  const [freelancers, setFreelancers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedExperience, setSelectedExperience] = useState("Any Experience")
  const [filteredFreelancers, setFilteredFreelancers] = useState([])
  
  // Hiring modal state
  const [isHiringModalOpen, setIsHiringModalOpen] = useState(false)
  const [selectedFreelancer, setSelectedFreelancer] = useState(null)

  // Fetch freelancers on component mount
  useEffect(() => {
    const loadFreelancers = async () => {
      setIsLoading(true)
      try {
        const response = await freelancersAPI.getAll()
        setFreelancers(response.data || [])
      } catch (error) {
        console.error('Error fetching freelancers:', error)
        setError('Failed to load freelancers')
      } finally {
        setIsLoading(false)
      }
    }
    loadFreelancers()
  }, [])

  // Filter and search logic
  useEffect(() => {
    let filtered = freelancers || []

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(freelancer => 
        freelancer.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        freelancer.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        freelancer.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply category filter
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(freelancer => 
        freelancer.category === selectedCategory ||
        freelancer.skills?.includes(selectedCategory)
      )
    }

    // Apply experience filter
    if (selectedExperience !== "Any Experience") {
      filtered = filtered.filter(freelancer => 
        freelancer.experience_level === selectedExperience
      )
    }

    setFilteredFreelancers(filtered)
  }, [freelancers, searchQuery, selectedCategory, selectedExperience])

  const categories = ["Digital Art", "Logo Design", "Graphic Design", "3D Design", "Character Design"]

  // Handle search input
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setIsLoading(true)
      try {
        // If there's a search endpoint for freelancers, use it here
        // For now, we'll use client-side filtering
        setIsLoading(false)
      } catch (error) {
        console.error('Search error:', error)
        setIsLoading(false)
      }
    }
  }

  // Format freelancer data to match the expected structure
  const formatFreelancerForDisplay = (freelancer) => ({
    id: freelancer.id,
    name: freelancer.User?.name || freelancer.name || 'Anonymous Freelancer',
    title: freelancer.title || 'Creative Professional',
    bio: freelancer.bio || 'No bio available',
    hourlyRate: freelancer.hourlyRate || freelancer.hourly_rate || null,
    skills: freelancer.skills ? freelancer.skills.split(',').map(s => s.trim()) : [],
    rating: 4.5, // Default rating - would need to calculate from reviews
    reviewCount: 0, // Default - would need to count reviews
    location: freelancer.location || 'Remote',
    completedProjects: 0, // Would need to count completed projects
    portfolioItems: freelancer.portfolio_items || 0,
    joinedDate: freelancer.createdAt ? new Date(freelancer.createdAt).toLocaleDateString() : 'Recently',
    verified: true, // Default - would need verification system
    status: freelancer.status || 'available',
    experienceLevel: freelancer.experience_level || 'intermediate'
  })

  const displayFreelancers = (filteredFreelancers.length > 0 ? filteredFreelancers : freelancers).map(formatFreelancerForDisplay)

  // Handle hiring button click
  const handleHireFreelancer = (freelancer) => {
    setSelectedFreelancer(freelancer)
    setIsHiringModalOpen(true)
  }

  // Handle successful application
  const handleApplicationSuccess = () => {
    console.log('Application sent successfully!')
    // Could show a toast notification here
  }

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
            Browse Creative Freelancers
          </h1>
          <p className="text-xl text-gray-300">Find talented creative professionals for your projects</p>
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
                  placeholder="Search for creative freelancers..."
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
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedExperience} onValueChange={setSelectedExperience}>
              <SelectTrigger className="bg-gray-800 border-[#A95BAB]/50 text-white">
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-[#A95BAB]/50">
                <SelectItem
                  value="Any Experience"
                  className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white"
                >
                  Any Experience
                </SelectItem>
                <SelectItem
                  value="entry"
                  className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white"
                >
                  Entry Level
                </SelectItem>
                <SelectItem
                  value="intermediate"
                  className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white"
                >
                  Intermediate
                </SelectItem>
                <SelectItem
                  value="expert"
                  className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white"
                >
                  Expert
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-300">
              Showing {displayFreelancers.length} creative freelancers
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
            <span className="ml-2 text-gray-300">Loading creative freelancers...</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && displayFreelancers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">No creative freelancers found</div>
            <p className="text-gray-500">Try adjusting your search criteria or check back later for new talent.</p>
          </div>
        )}

        {/* Freelancer Listings */}
        {!isLoading && displayFreelancers.length > 0 && (
          <div className="space-y-6">
            {displayFreelancers.map((freelancer) => (
              <Card
                key={freelancer.id}
                className="bg-white/5 border-white/10 hover:bg-[#A95BAB]/5 hover:border-[#A95BAB]/30 transition-all duration-500 ease-out"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 text-white hover:text-[#A95BAB] cursor-pointer">
                        {freelancer.name}
                      </CardTitle>
                      <div className="text-lg text-[#A95BAB] mb-2">{freelancer.title}</div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Joined {freelancer.joinedDate}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {freelancer.location}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {freelancer.completedProjects} completed
                        </span>
                        {freelancer.verified && <Badge className="bg-green-500 text-white border-0">Verified</Badge>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-[#A95BAB] mb-1">
                        {freelancer.hourlyRate ? `$${freelancer.hourlyRate}/hr` : 'Rate on request'}
                      </div>
                      <div className="text-sm text-gray-400">Hourly Rate</div>
                      <div className="text-sm text-green-400 font-medium mt-1 capitalize">{freelancer.status}</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-300 mb-4 line-clamp-3">{freelancer.bio}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {freelancer.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="border-white/20 text-gray-300">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="flex items-center text-sm text-gray-400">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span>{freelancer.rating}</span>
                          <span className="ml-1">({freelancer.reviewCount} reviews)</span>
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {freelancer.portfolioItems} portfolio items • {freelancer.experienceLevel} level
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
                        onClick={() => handleHireFreelancer(freelancer)}
                      >
                        Hire Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More */}
        {!isLoading && displayFreelancers.length > 0 && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-[#A95BAB]/50 text-white hover:bg-[#A95BAB]/30 hover:border-[#A95BAB] bg-gray-800"
            >
              Load More Freelancers
            </Button>
          </div>
        )}
      </div>

      {/* Hiring Modal */}
      {selectedFreelancer && (
        <MultiStepApplicationModal
          isOpen={isHiringModalOpen}
          onClose={() => {
            setIsHiringModalOpen(false)
            setSelectedFreelancer(null)
          }}
          post={{
            id: selectedFreelancer.id,
            title: `Hire ${selectedFreelancer.name}`,
            description: selectedFreelancer.bio,
            category: selectedFreelancer.title,
            budget: selectedFreelancer.hourlyRate ? `$${selectedFreelancer.hourlyRate}/hr` : 'Rate on request'
          }}
          onSuccess={handleApplicationSuccess}
          applicationType="client_to_service"
        />
      )}

      <Footer />
    </div>
  )
}