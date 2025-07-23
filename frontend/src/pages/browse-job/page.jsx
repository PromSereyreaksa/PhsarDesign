"use client"

import { useState } from "react"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer"
import { Search, Filter, MapPin, Clock, Users, Star } from "lucide-react"
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
      title: "Build a Modern E-commerce Website",
      description:
        "Looking for an experienced developer to create a responsive e-commerce platform with payment integration. The project includes user authentication, product catalog, shopping cart, and admin dashboard.",
      budget: "$2,500 - $5,000",
      budgetType: "Fixed Price",
      skills: ["React", "Node.js", "MongoDB", "Stripe"],
      postedBy: "TechStartup Inc.",
      clientRating: 4.8,
      clientReviews: 23,
      location: "United States",
      bids: 12,
      timeLeft: "5 days left",
      postedTime: "2 hours ago",
      verified: true,
    },
    {
      id: 2,
      title: "Logo Design for Tech Company",
      description:
        "Need a professional logo design for a new technology company. Modern and clean aesthetic preferred. Should work well in both digital and print formats.",
      budget: "$200 - $500",
      budgetType: "Fixed Price",
      skills: ["Graphic Design", "Adobe Illustrator", "Branding", "Logo Design"],
      postedBy: "InnovateTech",
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
      title: "Content Writing for Blog",
      description:
        "Seeking experienced content writer for technology blog. 10 articles needed on AI and machine learning topics. Each article should be 1500-2000 words.",
      budget: "$500 - $1,000",
      budgetType: "Fixed Price",
      skills: ["Content Writing", "SEO", "Technology", "Research"],
      postedBy: "AI Insights",
      clientRating: 4.7,
      clientReviews: 12,
      location: "United Kingdom",
      bids: 15,
      timeLeft: "7 days left",
      postedTime: "1 day ago",
      verified: false,
    },
    {
      id: 4,
      title: "Mobile App Development - iOS & Android",
      description:
        "Looking for a mobile app developer to create a fitness tracking app. Features include workout logging, progress tracking, social features, and integration with wearable devices.",
      budget: "$50 - $75/hr",
      budgetType: "Hourly",
      skills: ["React Native", "iOS", "Android", "Firebase"],
      postedBy: "FitLife Solutions",
      clientRating: 4.6,
      clientReviews: 8,
      location: "Australia",
      bids: 9,
      timeLeft: "6 days left",
      postedTime: "3 hours ago",
      verified: true,
    },
    {
      id: 5,
      title: "Social Media Marketing Campaign",
      description:
        "Need a digital marketing expert to create and manage social media campaigns across Facebook, Instagram, and LinkedIn. 3-month project with performance tracking.",
      budget: "$1,000 - $2,000",
      budgetType: "Fixed Price",
      skills: ["Social Media Marketing", "Facebook Ads", "Instagram", "Analytics"],
      postedBy: "GrowthCorp",
      clientRating: 4.9,
      clientReviews: 67,
      location: "Germany",
      bids: 22,
      timeLeft: "4 days left",
      postedTime: "6 hours ago",
      verified: true,
    },
  ]

  const categories = [
    "Web Development",
    "Mobile Development",
    "Graphic Design",
    "Content Writing",
    "Digital Marketing",
    "Data Science",
    "Video Editing",
    "Translation",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Jobs</h1>
          <p className="text-lg text-gray-600">Find your next opportunity from thousands of available projects</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedBudget} onValueChange={setSelectedBudget}>
              <SelectTrigger>
                <SelectValue placeholder="Budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Any Budget">Any Budget</SelectItem>
                <SelectItem value="0-500">$0 - $500</SelectItem>
                <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                <SelectItem value="5000+">$5,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">Showing {jobs.length} jobs</div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 hover:text-green-600 cursor-pointer">{job.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
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
                      {job.verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Verified Client
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600 mb-1">{job.budget}</div>
                    <div className="text-sm text-gray-600">{job.budgetType}</div>
                    <div className="text-sm text-orange-600 font-medium mt-1">{job.timeLeft}</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="font-medium text-gray-900">{job.postedBy}</div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span>{job.clientRating}</span>
                        <span className="ml-1">({job.clientReviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Save Job
                    </Button>
                    <Button size="sm">Submit Proposal</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Jobs
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
