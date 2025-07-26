"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Search, Star, Users, Briefcase, Clock, MapPin, Filter, Grid, List, Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import Navbar from "../layout/Navbar"
import Footer from "../layout/Footer"
import { fetchAllProjects, fetchAllFreelancers } from "../../store/actions"

export default function HomePage() {
  const dispatch = useDispatch()
  const { projects = [], freelancers = [], isLoading, error } = useSelector((state) => state.api)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedBudget, setSelectedBudget] = useState("Any Budget")
  const [viewMode, setViewMode] = useState("grid")

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchAllProjects()),
          dispatch(fetchAllFreelancers())
        ])
      } catch (error) {
        console.error('Error loading homepage data:', error)
      }
    }

    loadData()
  }, [dispatch])

  const categories = ["Digital Art", "Logo Design", "Graphic Design", "3D Design", "Character Design"]

  // Format project data for display
  const formatClientPosts = () => {
    if (projects.projects && projects.projects.length > 0) {
      return projects.projects.slice(0, 6).map(project => ({
        id: project.id,
        title: project.title || 'Untitled Project',
        description: project.description || 'No description available',
        budget: project.budget ? `$${project.budget}` : 'Budget not specified',
        budgetType: project.budget_type || 'Fixed Price',
        skills: project.skills ? project.skills.split(',').map(s => s.trim()) : [],
        postedBy: project.Client?.name || 'Anonymous Client',
        clientRating: 4.5, // Default rating - would need to calculate from reviews
        clientReviews: 0, // Default - would need to count reviews
        location: project.location || 'Remote',
        bids: 0, // Would need to count applications
        timeLeft: '5 days left', // Would need to calculate from deadline
        postedTime: project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Recently',
        verified: true,
        urgent: false,
        image: "/DigitalArt.jpg", // Default image
      }))
    }
    
    // Fallback mock data
    return []
  }

  // Format freelancer data for display
  const formatFreelancerPosts = () => {
    if (freelancers.freelancers && freelancers.freelancers.length > 0) {
      return freelancers.freelancers.slice(0, 6).map(freelancer => ({
        id: freelancer.id,
        name: freelancer.name || 'Unknown Freelancer',
        title: freelancer.title || freelancer.specialization || 'Creative Professional',
        description: freelancer.description || freelancer.bio || 'Experienced creative professional',
        hourlyRate: freelancer.hourlyRate ? `$${freelancer.hourlyRate}/hr` : '$50/hr',
        skills: freelancer.skills ? freelancer.skills.split(',').map(s => s.trim()) : [],
        rating: freelancer.rating || 4.5,
        reviews: freelancer.reviews || 0,
        completedJobs: freelancer.completedJobs || 0,
        responseTime: freelancer.responseTime || '1 hour',
        location: freelancer.location || 'Remote',
        verified: true,
        topRated: freelancer.rating >= 4.8,
        available: true,
        avatar: "/DigitalArt.jpg", // Default avatar
        portfolio: "/DigitalArt.jpg", // Default portfolio image
      }))
    }
    
    // Fallback mock data
    return []
  }

  const clientPosts = formatClientPosts()
  const freelancerPosts = formatFreelancerPosts()

  // Use real data if available, otherwise use mock data
  const displayClientPosts = clientPosts.length > 0 ? clientPosts : [
    {
      id: 1,
      title: "Create Digital Art for Album Cover",
      description: "Looking for a talented digital artist to create an eye-catching album cover. Need modern, vibrant artwork that captures the essence of electronic music.",
      budget: "$300 - $800",
      budgetType: "Fixed Price",
      skills: ["Digital Art", "Illustration", "Adobe Photoshop", "Creative Design"],
      postedBy: "Sonic Records",
      clientRating: 4.8,
      clientReviews: 23,
      location: "United States",
      bids: 15,
      timeLeft: "5 days left",
      postedTime: "2 hours ago",
      verified: true,
      urgent: false,
      image: "/DigitalArt.jpg",
    },
    {
      id: 2,
      title: "Professional Logo Design for Startup",
      description: "Need a clean, modern logo design for a tech startup. Looking for something minimalist yet memorable that works across all platforms.",
      budget: "$200 - $500",
      budgetType: "Fixed Price",
      skills: ["Logo Design", "Adobe Illustrator", "Branding", "Vector Graphics"],
      postedBy: "TechFlow Inc",
      clientRating: 4.9,
      clientReviews: 45,
      location: "Canada",
      bids: 28,
      timeLeft: "3 days left",
      postedTime: "4 hours ago",
      verified: true,
      urgent: true,
      image: "/LogoDesign.jpg",
    }
  ]

  const displayFreelancerPosts = freelancerPosts.length > 0 ? freelancerPosts : [
    {
      id: 1,
      name: "vicky gujjar",
      title: "Digital Artist & Illustrator",
      description: "Specialized in creating stunning digital artwork, illustrations, and visual concepts. Expert in Adobe Creative Suite with 6+ years of experience.",
      hourlyRate: "$45/hr",
      skills: ["Digital Art", "Illustration", "Adobe Photoshop", "Concept Art", "Visual Design"],
      rating: 4.9,
      reviews: 127,
      completedJobs: 89,
      responseTime: "1 hour",
      location: "Mumbai, India",
      verified: true,
      topRated: true,
      available: true,
      avatar: "/DigitalArt.jpg",
      portfolio: "/DigitalArt.jpg",
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <Navbar />

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#A95BAB]" />
          <span className="ml-2 text-gray-300">Loading marketplace...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      postedTime: "6 hours ago",
      verified: true,
      urgent: false,
      image: "/3DDesign.jpg",
    },
  ]

  const freelancerPosts = [
    {
      id: 1,
      name: "vicky gujjar",
      title: "Digital Artist & Illustrator",
      description:
        "Specialized in creating stunning digital artwork, illustrations, and visual concepts. Expert in Adobe Creative Suite with 6+ years of experience.",
      hourlyRate: "$45/hr",
      skills: ["Digital Art", "Illustration", "Adobe Photoshop", "Concept Art", "Visual Design"],
      rating: 4.9,
      reviews: 127,
      completedJobs: 89,
      responseTime: "1 hour",
      location: "Mumbai, India",
      verified: true,
      topRated: true,
      available: true,
      avatar: "/DigitalArt.jpg",
      portfolio: "/DigitalArt.jpg",
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      title: "Logo Designer & Brand Specialist",
      description:
        "Professional logo designer with expertise in creating memorable brand identities. Specialized in minimalist and modern design approaches.",
      hourlyRate: "$55/hr",
      skills: ["Logo Design", "Branding", "Adobe Illustrator", "Vector Graphics", "Brand Identity"],
      rating: 4.8,
      reviews: 89,
      completedJobs: 67,
      responseTime: "2 hours",
      location: "Mexico City, Mexico",
      verified: true,
      topRated: false,
      available: true,
      avatar: "/LogoDesign.jpg",
      portfolio: "/LogoDesign.jpg",
    },
    {
      id: 3,
      name: "Emma Wilson",
      title: "Character Designer & Animator",
      description:
        "Creative character designer specializing in game characters, mascots, and animated illustrations. Bringing personalities to life through art.",
      hourlyRate: "$50/hr",
      skills: ["Character Design", "Animation", "Game Art", "Illustration", "Concept Art"],
      rating: 4.9,
      reviews: 156,
      completedJobs: 134,
      responseTime: "30 min",
      location: "London, UK",
      verified: true,
      topRated: true,
      available: true,
      avatar: "/CharacterDesign.jpg",
      portfolio: "/CharacterDesign.jpg",
    },
    {
      id: 4,
      name: "David Kim",
      title: "Graphic Designer & Visual Artist",
      description:
        "Versatile graphic designer with expertise in print and digital media. Creating impactful visual solutions for brands and businesses.",
      hourlyRate: "$40/hr",
      skills: ["Graphic Design", "Print Design", "Adobe Creative Suite", "Layout Design", "Typography"],
      rating: 4.7,
      reviews: 73,
      completedJobs: 52,
      responseTime: "1 hour",
      location: "Seoul, South Korea",
      verified: true,
      topRated: false,
      available: false,
      avatar: "/GraphicDesign.jpg",
      portfolio: "/GraphicDesign.jpg",
    },
    {
      id: 5,
      name: "Lisa Park",
      title: "3D Artist & Visualizer",
      description:
        "Expert 3D artist specializing in product visualization, architectural rendering, and creative 3D designs. High-quality renders guaranteed.",
      hourlyRate: "$60/hr",
      skills: ["3D Design", "Blender", "Maya", "Product Visualization", "Architectural Rendering"],
      rating: 4.8,
      reviews: 92,
      completedJobs: 78,
      responseTime: "45 min",
      location: "Sydney, Australia",
      verified: true,
      topRated: true,
      available: true,
      avatar: "/3DDesign.jpg",
      portfolio: "/3DDesign.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent mb-4">
            Creative Marketplace
          </h1>
          <p className="text-xl text-gray-300">
            Discover amazing creative talent and connect with professional artists
          </p>
        </div>

        {/* Filters */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-4 mb-4 mt-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-gray-800 border-[#A95BAB]/50 text-white min-w-[160px]">
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

              <Select value={selectedBudget} onValueChange={setSelectedBudget}>
                <SelectTrigger className="bg-gray-800 border-[#A95BAB]/50 text-white min-w-[160px]">
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

              <Button className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white transform hover:scale-105 transition-all duration-500 ease-out px-6">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#A95BAB]/50 text-white hover:bg-[#A95BAB]/30 hover:border-[#A95BAB] bg-gray-800"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid"
                      ? "bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white"
                      : "border-[#A95BAB]/50 text-white hover:bg-[#A95BAB]/30 hover:border-[#A95BAB] bg-gray-800"
                  }
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={
                    viewMode === "list"
                      ? "bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white"
                      : "border-[#A95BAB]/50 text-white hover:bg-[#A95BAB]/30 hover:border-[#A95BAB] bg-gray-800"
                  }
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Client Posts vs Freelancer Posts */}
        <Tabs defaultValue="client-posts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border-white/10">
            <TabsTrigger
              value="client-posts"
              className="text-white data-[state=active]:bg-[#A95BAB] data-[state=active]:text-white"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Projects Looking for Artists ({clientPosts.length})
            </TabsTrigger>
            <TabsTrigger
              value="freelancer-posts"
              className="text-white data-[state=active]:bg-[#A95BAB] data-[state=active]:text-white"
            >
              <Users className="h-4 w-4 mr-2" />
              Available Artists ({freelancerPosts.length})
            </TabsTrigger>
          </TabsList>

          {/* Client Posts */}
          <TabsContent value="client-posts">
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {clientPosts.map((post) => (
                <Card
                  key={post.id}
                  className="bg-white/5 border-white/10 hover:bg-[#A95BAB]/5 hover:border-[#A95BAB]/30 transform hover:scale-[1.02] transition-all duration-500 ease-out cursor-pointer"
                >
                  {viewMode === "grid" && (
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        {post.verified && <Badge className="bg-green-500 text-white border-0">Verified</Badge>}
                        {post.urgent && <Badge className="bg-red-600 text-white border-0">Urgent</Badge>}
                      </div>
                    </div>
                  )}

                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2">{post.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {post.postedTime}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {post.location}
                          </span>
                        </div>
                      </div>
                      {viewMode === "list" && (
                        <div className="text-right ml-4">
                          <div className="text-lg font-semibold text-[#A95BAB] mb-1">{post.budget}</div>
                          <div className="text-sm text-gray-400">{post.budgetType}</div>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-300 mb-4 line-clamp-3">{post.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.skills.slice(0, 3).map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="border-white/20 text-gray-300 hover:border-[#A95BAB]/50"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {post.skills.length > 3 && (
                        <Badge variant="outline" className="border-white/20 text-gray-300">
                          +{post.skills.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        {viewMode === "grid" && (
                          <div className="text-lg font-semibold text-[#A95BAB] mb-1">{post.budget}</div>
                        )}
                        <div className="flex items-center text-sm text-gray-400">
                          <Users className="h-4 w-4 mr-1" />
                          {post.bids} bids • {post.timeLeft}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white transform hover:scale-105 transition-all duration-500 ease-out"
                      >
                        Submit Proposal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Freelancer Posts */}
          <TabsContent value="freelancer-posts">
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {freelancerPosts.map((freelancer) => (
                <Card
                  key={freelancer.id}
                  className="bg-white/5 border-white/10 hover:bg-[#A95BAB]/5 hover:border-[#A95BAB]/30 transform hover:scale-[1.02] transition-all duration-500 ease-out cursor-pointer"
                >
                  {viewMode === "grid" && (
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img
                        src={freelancer.portfolio || "/placeholder.svg"}
                        alt={`${freelancer.name} portfolio`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        {freelancer.verified && <Badge className="bg-green-500 text-white border-0">Verified</Badge>}
                        {freelancer.topRated && <Badge className="bg-[#A95BAB] text-white border-0">Top Rated</Badge>}
                        <Badge
                          className={`${freelancer.available ? "bg-emerald-500" : "bg-gray-600"} text-white border-0`}
                        >
                          {freelancer.available ? "Available" : "Busy"}
                        </Badge>
                      </div>
                    </div>
                  )}

                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <img
                        src={freelancer.avatar || "/placeholder.svg"}
                        alt={freelancer.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg mb-1">{freelancer.name}</h3>
                        <p className="text-gray-300 mb-2">{freelancer.title}</p>
                        <div className="flex items-center text-sm">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-white mr-1">{freelancer.rating}</span>
                          <span className="text-gray-400">({freelancer.reviews} reviews)</span>
                        </div>
                      </div>
                      {viewMode === "list" && (
                        <div className="text-right">
                          <div className="text-lg font-semibold text-[#A95BAB] mb-1">{freelancer.hourlyRate}</div>
                          <div className="text-sm text-gray-400">per hour</div>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-300 mb-4 line-clamp-3">{freelancer.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {freelancer.skills.slice(0, 3).map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="border-white/20 text-gray-300 hover:border-[#A95BAB]/50"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {freelancer.skills.length > 3 && (
                        <Badge variant="outline" className="border-white/20 text-gray-300">
                          +{freelancer.skills.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        {viewMode === "grid" && (
                          <div className="text-lg font-semibold text-[#A95BAB] mb-1">{freelancer.hourlyRate}</div>
                        )}
                        <div className="flex items-center text-sm text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          {freelancer.location}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white transform hover:scale-105 transition-all duration-500 ease-out"
                      >
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-[#A95BAB]/50 text-white hover:bg-[#A95BAB]/30 hover:border-[#A95BAB] bg-gray-800 transform hover:scale-105 transition-all duration-500 ease-out"
          >
            Load More Results
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
