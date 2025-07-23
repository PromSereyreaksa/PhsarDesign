"use client"

import { useState } from "react"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer"
import { Star, MapPin, Calendar, Award, Edit, Camera, Plus } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Progress } from "../../components/ui/progress"

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)

  const profile = {
    name: "Sarah Johnson",
    title: "Full Stack Developer",
    avatar: "/placeholder.svg?height=120&width=120",
    location: "San Francisco, CA",
    memberSince: "March 2020",
    hourlyRate: "$85/hr",
    totalEarned: "$125,000+",
    jobsCompleted: 127,
    rating: 4.9,
    reviews: 89,
    responseTime: "1 hour",
    bio: "Experienced full-stack developer with 8+ years of expertise in React, Node.js, and cloud technologies. I specialize in building scalable web applications and have helped numerous startups and enterprises achieve their digital goals.",
    skills: [
      { name: "React", level: 95 },
      { name: "Node.js", level: 90 },
      { name: "Python", level: 85 },
      { name: "AWS", level: 80 },
      { name: "MongoDB", level: 88 },
      { name: "TypeScript", level: 92 },
    ],
    certifications: ["AWS Certified Solutions Architect", "Google Cloud Professional", "React Developer Certification"],
    languages: [
      { name: "English", level: "Native" },
      { name: "Spanish", level: "Conversational" },
      { name: "French", level: "Basic" },
    ],
  }

  const recentProjects = [
    {
      id: 1,
      title: "E-commerce Platform Development",
      client: "TechStartup Inc.",
      rating: 5,
      review:
        "Sarah delivered an exceptional e-commerce platform. Her attention to detail and technical expertise exceeded our expectations.",
      budget: "$4,500",
      completedDate: "Dec 2023",
      skills: ["React", "Node.js", "Stripe"],
    },
    {
      id: 2,
      title: "Mobile App Backend API",
      client: "FitLife Solutions",
      rating: 5,
      review:
        "Outstanding work on our fitness app backend. Clean code, excellent documentation, and delivered on time.",
      budget: "$3,200",
      completedDate: "Nov 2023",
      skills: ["Node.js", "MongoDB", "AWS"],
    },
    {
      id: 3,
      title: "Website Redesign & Optimization",
      client: "Creative Agency",
      rating: 4,
      review: "Great work on the website redesign. The performance improvements were significant.",
      budget: "$2,800",
      completedDate: "Oct 2023",
      skills: ["React", "Next.js", "Tailwind"],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                  <AvatarFallback className="text-2xl">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute bottom-0 right-0 rounded-full p-2 bg-transparent"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                    <p className="text-xl text-gray-600 mt-1">{profile.title}</p>
                  </div>
                  <Button onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-semibold">{profile.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600">{profile.reviews} reviews</p>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-600">{profile.hourlyRate}</div>
                    <p className="text-sm text-gray-600">Hourly Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{profile.jobsCompleted}</div>
                    <p className="text-sm text-gray-600">Jobs Completed</p>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{profile.totalEarned}</div>
                    <p className="text-sm text-gray-600">Total Earned</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {profile.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Member since {profile.memberSince}
                  </div>
                  <div>Response time: {profile.responseTime}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* About */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profile.skills.map((skill) => (
                        <div key={skill.name}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-sm text-gray-600">{skill.level}%</span>
                          </div>
                          <Progress value={skill.level} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Certifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {profile.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="w-full justify-start">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Languages */}
                <Card>
                  <CardHeader>
                    <CardTitle>Languages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {profile.languages.map((lang, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="font-medium">{lang.name}</span>
                          <Badge variant="secondary">{lang.level}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>On-time delivery</span>
                        <span className="font-semibold">98%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Repeat hire rate</span>
                        <span className="font-semibold">85%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Response rate</span>
                        <span className="font-semibold">100%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Recent Projects</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {recentProjects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Client: {project.client}</span>
                      <span>{project.completedDate}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-3">
                      <div className="flex items-center mr-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < project.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-green-600">{project.budget}</span>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-3">{project.review}</p>

                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Client Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{project.title}</h4>
                          <p className="text-sm text-gray-600">by {project.client}</p>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < project.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">{project.completedDate}</span>
                        </div>
                      </div>
                      <p className="text-gray-700">{project.review}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Profile settings and preferences will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
