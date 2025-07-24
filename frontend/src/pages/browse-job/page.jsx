"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer"
import { Search, Filter, MapPin, Clock, Users, Star, ArrowLeft } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"

export default function BrowseJobs() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedBudget, setSelectedBudget] = useState("Any Budget")

  const jobs = [
    {
      id: 1,
      title: "Create Digital Art for Album Cover",
      description:
        "Looking for a talented digital artist to create an eye-catching album cover. Need modern, vibrant artwork that captures the essence of electronic music. Must be original and high-resolution.",
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
    },
    {
      id: 2,
      title: "Professional Logo Design for Tech Startup",
      description:
        "Need a clean, modern logo design for a tech startup. Looking for something minimalist yet memorable that works across all platforms and represents innovation.",
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
    },
    {
      id: 3,
      title: "Character Design for Mobile Game",
      description:
        "Seeking a character designer to create unique game characters. Need 5 main characters with different personalities and styles for an adventure mobile game.",
      budget: "$800 - $1,500",
      budgetType: "Fixed Price",
      skills: ["Character Design", "Game Art", "Illustration", "Concept Art"],
      postedBy: "GameStudio Pro",
      clientRating: 4.7,
      clientReviews: 12,
      location: "United Kingdom",
      bids: 18,
      timeLeft: "7 days left",
      postedTime: "1 day ago",
      verified: false,
    },
    {
      id: 4,
      title: "Complete Branding Package Design",
      description:
        "Looking for a graphic designer to create a complete branding package including logo, business cards, letterhead, and brand guidelines for a consulting firm.",
      budget: "$600 - $1,200",
      budgetType: "Fixed Price",
      skills: ["Graphic Design", "Branding", "Print Design", "Adobe Creative Suite"],
      postedBy: "Business Solutions Ltd",
      clientRating: 4.6,
      clientReviews: 8,
      location: "Australia",
      bids: 12,
      timeLeft: "6 days left",
      postedTime: "3 hours ago",
      verified: true,
    },
    {
      id: 5,
      title: "3D Product Visualization and Rendering",
      description:
        "Create stunning 3D renders and animations for product showcase. Need photorealistic quality for e-commerce and marketing materials. Multiple products involved.",
      budget: "$800 - $1,800",
      budgetType: "Fixed Price",
      skills: ["3D Design", "Blender", "Product Visualization", "Rendering"],
      postedBy: "Design Studio Pro",
      clientRating: 4.9,
      clientReviews: 67,
      location: "Germany",
      bids: 22,
      timeLeft: "4 days left",
      postedTime: "6 hours ago",
      verified: true,
    },
    {
      id: 6,
      title: "Illustration Series for Children's Book",
      description:
        "Need a talented illustrator to create a series of illustrations for a children's book. Looking for colorful, engaging artwork that appeals to ages 5-10.",
      budget: "$1,000 - $2,000",
      budgetType: "Fixed Price",
      skills: ["Illustration", "Children's Art", "Digital Art", "Storytelling"],
      postedBy: "Rainbow Publishing",
      clientRating: 4.8,
      clientReviews: 34,
      location: "Netherlands",
      bids: 25,
      timeLeft: "8 days left",
      postedTime: "5 hours ago",
      verified: true,
    },
  ]

  const categories = ["Digital Art", "Logo Design", "Graphic Design", "3D Design", "Character Design"]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
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
            Browse Creative Jobs
          </h1>
          <p className="text-xl text-gray-300">Find your next creative opportunity from amazing clients</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/5 border-white/10 backdrop-blur-sm rounded-lg border p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
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
            
            <Button className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white px-6">
              <Search className="h-4 w-4 mr-2" />
              Search Jobs
            </Button>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-300">Showing {jobs.length} creative jobs</div>
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

        {/* Job Listings */}
        <div className="space-y-6">
          {jobs.map((job) => (
            <Card
              key={job.id}
              className="bg-white/5 border-white/10 hover:bg-[#A95BAB]/5 hover:border-[#A95BAB]/30 transition-all duration-500 ease-out"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 text-white hover:text-[#A95BAB] cursor-pointer">
                      {job.title}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.postedTime}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {job.bids} bids
                      </span>
                      {job.verified && <Badge className="bg-green-500 text-white border-0">Verified Client</Badge>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-[#A95BAB] mb-1">{job.budget}</div>
                    <div className="text-sm text-gray-400">{job.budgetType}</div>
                    <div className="text-sm text-orange-400 font-medium mt-1">{job.timeLeft}</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-300 mb-4 line-clamp-3">{job.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="border-white/20 text-gray-300">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="font-medium text-white">{job.postedBy}</div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span>{job.clientRating}</span>
                        <span className="ml-1">({job.clientReviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#A95BAB]/50 text-white hover:bg-[#A95BAB]/30 hover:border-[#A95BAB] bg-gray-800"
                    >
                      Save Job
                    </Button>
                    <Button size="sm" className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white">
                      Submit Proposal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-[#A95BAB]/50 text-white hover:bg-[#A95BAB]/30 hover:border-[#A95BAB] bg-gray-800"
          >
            Load More Jobs
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
