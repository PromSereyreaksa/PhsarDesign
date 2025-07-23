"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, Star, ArrowRight, Users, Briefcase, Clock } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  const featuredJobs = [
    {
      id: 1,
      title: "Build a Modern E-commerce Website",
      description:
        "Looking for an experienced developer to create a responsive e-commerce platform with payment integration.",
      budget: "$2,500 - $5,000",
      skills: ["React", "Node.js", "MongoDB"],
      postedBy: "TechStartup Inc.",
      bids: 12,
      timeLeft: "5 days left",
    },
    {
      id: 2,
      title: "Logo Design for Tech Company",
      description:
        "Need a professional logo design for a new technology company. Modern and clean aesthetic preferred.",
      budget: "$200 - $500",
      skills: ["Graphic Design", "Adobe Illustrator", "Branding"],
      postedBy: "InnovateTech",
      bids: 28,
      timeLeft: "3 days left",
    },
    {
      id: 3,
      title: "Content Writing for Blog",
      description:
        "Seeking experienced content writer for technology blog. 10 articles needed on AI and machine learning topics.",
      budget: "$500 - $1,000",
      skills: ["Content Writing", "SEO", "Technology"],
      postedBy: "AI Insights",
      bids: 15,
      timeLeft: "7 days left",
    },
  ]

  const topFreelancers = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Full Stack Developer",
      rating: 4.9,
      reviews: 127,
      hourlyRate: "$85/hr",
      skills: ["React", "Python", "AWS"],
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b9e0e4d4?w=60&h=60&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Mike Chen",
      title: "UI/UX Designer",
      rating: 4.8,
      reviews: 89,
      hourlyRate: "$65/hr",
      skills: ["Figma", "Adobe XD", "Prototyping"],
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      title: "Digital Marketing Expert",
      rating: 4.9,
      reviews: 156,
      hourlyRate: "$55/hr",
      skills: ["SEO", "Google Ads", "Social Media"],
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
    },
  ]

  const categories = [
    { name: "Web Development", jobs: 1250, icon: "💻" },
    { name: "Graphic Design", jobs: 890, icon: "🎨" },
    { name: "Writing & Translation", jobs: 670, icon: "✍️" },
    { name: "Digital Marketing", jobs: 540, icon: "📱" },
    { name: "Video & Animation", jobs: 320, icon: "🎬" },
    { name: "Music & Audio", jobs: 180, icon: "🎵" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find the perfect freelance services for your business
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">Connect with talented freelancers worldwide</p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="What service are you looking for today?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-4 text-lg text-gray-900"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 px-8">
                  Search
                </Button>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="mt-6">
              <p className="text-green-100 mb-3">Popular searches:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Website Design", "Logo Design", "WordPress", "Voice Over", "Video Editing"].map((term) => (
                  <Badge key={term} variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">2M+</div>
              <div className="text-gray-600">Active Freelancers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500K+</div>
              <div className="text-gray-600">Projects Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-xl text-gray-600">Find the perfect service for your needs</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Card key={category.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.jobs} jobs available</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Jobs</h2>
              <p className="text-xl text-gray-600">Latest opportunities from top clients</p>
            </div>
            <Link to="/browse-jobs">
              <Button variant="outline" className="hidden md:flex items-center bg-transparent">
                View All Jobs <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>by {job.postedBy}</span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {job.timeLeft}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-green-600">{job.budget}</div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {job.bids} bids
                      </div>
                    </div>
                    <Button size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top Freelancers Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Freelancers</h2>
            <p className="text-xl text-gray-600">Work with the best talent in the industry</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topFreelancers.map((freelancer) => (
              <Card key={freelancer.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={freelancer.avatar || "/placeholder.svg"}
                      alt={freelancer.name}
                      className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{freelancer.name}</h3>
                      <p className="text-gray-600">{freelancer.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-4">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 font-semibold">{freelancer.rating}</span>
                      <span className="ml-1 text-gray-600">({freelancer.reviews})</span>
                    </div>
                    <div className="font-semibold text-green-600">{freelancer.hourlyRate}</div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {freelancer.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <Link to="/profile">
                    <Button className="w-full">View Profile</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 text-green-100">
            Join millions of people who use FreelanceHub to turn their ideas into reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/post-job">
              <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                <Briefcase className="mr-2 h-5 w-5" />
                Post a Job
              </Button>
            </Link>
            <Link to="/browse-jobs">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
              >
                <Users className="mr-2 h-5 w-5" />
                Find Work
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
