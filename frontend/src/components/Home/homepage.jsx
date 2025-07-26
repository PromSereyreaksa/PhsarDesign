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
    if (projects && projects.length > 0) {
      return projects.slice(0, 6).map(project => ({
        id: project.id,
        title: project.title || 'Untitled Project',
        description: project.description || 'No description available',
        budget: project.budget ? `$${project.budget}` : 'Budget not specified',
        budgetType: project.budget_type || 'Fixed Price',
        skills: project.skills ? project.skills.split(',').map(s => s.trim()) : [],
        postedBy: project.Client?.name || 'Anonymous Client',
        clientRating: 4.5,
        clientReviews: 0,
        location: project.location || 'Remote',
        bids: 0,
        timeLeft: '5 days left',
        postedTime: project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Recently',
        verified: true,
        urgent: false,
        image: "/DigitalArt.jpg",
      }))
    }
    return []
  }

  // Format artist data for display
  const formatArtistPosts = () => {
    if (freelancers && freelancers.length > 0) {
      return freelancers.slice(0, 6).map(artist => ({
        id: artist.artistId || artist.id,
        name: artist.name || 'Unknown Artist',
        title: artist.specialties || 'Creative Professional',
        description: artist.skills || 'Experienced creative professional',
        hourlyRate: artist.hourlyRate ? `$${artist.hourlyRate}/hr` : '$50/hr',
        skills: artist.skills ? artist.skills.split(',').map(s => s.trim()) : [],
        rating: artist.rating || 4.5,
        reviews: artist.totalCommissions || 0,
        completedJobs: artist.totalCommissions || 0,
        responseTime: '1 hour',
        location: 'Remote',
        verified: true,
        topRated: (artist.rating || 4.5) >= 4.8,
        available: artist.availability === 'available',
        avatar: artist.avatarUrl || "/DigitalArt.jpg",
        portfolio: artist.portfolioUrl || "/DigitalArt.jpg",
      }))
    }
    return []
  }

  const clientPosts = formatClientPosts()
  const artistPosts = formatArtistPosts()

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

  const displayArtistPosts = artistPosts.length > 0 ? artistPosts : [
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
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent mb-6">
              Creative Marketplace
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Connect with talented artists and creative professionals worldwide
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search for projects, skills, or artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-[#A95BAB] focus:ring-[#A95BAB]"
                />
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-[#202020] border-[#A95BAB]/30">
                  <SelectItem value="All Categories" className="text-white hover:bg-[#A95BAB]/20">
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
                <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Any Budget" />
                </SelectTrigger>
                <SelectContent className="bg-[#202020] border-[#A95BAB]/30">
                  <SelectItem value="Any Budget" className="text-white hover:bg-[#A95BAB]/20">
                    Any Budget
                  </SelectItem>
                  <SelectItem value="Under $500" className="text-white hover:bg-[#A95BAB]/20">
                    Under $500
                  </SelectItem>
                  <SelectItem value="$500-$1000" className="text-white hover:bg-[#A95BAB]/20">
                    $500 - $1,000
                  </SelectItem>
                  <SelectItem value="$1000+" className="text-white hover:bg-[#A95BAB]/20">
                    $1,000+
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="border-white/20 text-white hover:bg-[#A95BAB]/20"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="client-posts" className="mb-12">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/10 border-white/20">
              <TabsTrigger
                value="client-posts"
                className="text-white data-[state=active]:bg-[#A95BAB] data-[state=active]:text-white"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Projects Looking for Artists ({displayClientPosts.length})
              </TabsTrigger>
              <TabsTrigger
                value="freelancer-posts"
                className="text-white data-[state=active]:bg-[#A95BAB] data-[state=active]:text-white"
              >
                <Users className="h-4 w-4 mr-2" />
                Available Artists ({displayArtistPosts.length})
              </TabsTrigger>
            </TabsList>

            {/* Client Posts */}
            <TabsContent value="client-posts">
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {displayClientPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#A95BAB]/50 backdrop-blur-sm transition-all duration-300 cursor-pointer group overflow-hidden transform hover:scale-105"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#A95BAB] transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-300 text-sm line-clamp-3 mb-3">{post.description}</p>
                        </div>
                        {post.urgent && (
                          <Badge variant="destructive" className="ml-2">
                            Urgent
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {post.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs text-gray-400">
                            +{post.skills.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {post.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {post.timeLeft}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold text-[#A95BAB]">{post.budget}</div>
                          <div className="text-xs text-gray-400">{post.budgetType}</div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-sm text-gray-300">
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

            {/* Artist Posts */}
            <TabsContent value="freelancer-posts">
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {displayArtistPosts.map((artist) => (
                  <Card
                    key={artist.id}
                    className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#A95BAB]/50 backdrop-blur-sm transition-all duration-300 cursor-pointer group overflow-hidden transform hover:scale-105"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#A95BAB] to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {artist.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-[#A95BAB] transition-colors">
                            {artist.name}
                          </h3>
                          <p className="text-[#A95BAB] text-sm mb-2">{artist.title}</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(artist.rating)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-400"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-300">
                              {artist.rating} ({artist.reviews} reviews)
                            </span>
                          </div>
                        </div>
                        {artist.topRated && (
                          <Badge className="bg-yellow-500 text-black">
                            Top Rated
                          </Badge>
                        )}
                      </div>

                      <p className="text-gray-300 text-sm line-clamp-3 mb-4">{artist.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {artist.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {artist.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs text-gray-400">
                            +{artist.skills.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {artist.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Response: {artist.responseTime}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold text-[#A95BAB]">{artist.hourlyRate}</div>
                          <div className="text-xs text-gray-400">{artist.completedJobs} jobs completed</div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white transform hover:scale-105 transition-all duration-500 ease-out"
                        >
                          Contact Artist
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Load More Button */}
          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              className="border-[#A95BAB]/50 text-white hover:bg-[#A95BAB]/30 hover:border-[#A95BAB] bg-gray-800 transform hover:scale-105 transition-all duration-500 ease-out"
            >
              Load More Results
            </Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
