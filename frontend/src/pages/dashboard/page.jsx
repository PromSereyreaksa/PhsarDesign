"use client"

import { useState } from "react"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer"
import { TrendingUp, DollarSign, Briefcase, MessageSquare, Calendar, Star, Clock } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = {
    totalEarnings: 125000,
    monthlyEarnings: 8500,
    activeProjects: 3,
    completedJobs: 127,
    clientRating: 4.9,
    responseTime: "1 hour",
  }

  const activeProjects = [
    {
      id: 1,
      title: "E-commerce Website Development",
      client: "TechStartup Inc.",
      budget: "$4,500",
      progress: 75,
      deadline: "Dec 15, 2024",
      status: "In Progress",
      lastUpdate: "2 hours ago",
    },
    {
      id: 2,
      title: "Mobile App Backend API",
      client: "FitLife Solutions",
      budget: "$3,200",
      progress: 45,
      deadline: "Jan 10, 2025",
      status: "In Progress",
      lastUpdate: "1 day ago",
    },
    {
      id: 3,
      title: "Website Performance Optimization",
      client: "Creative Agency",
      budget: "$1,800",
      progress: 90,
      deadline: "Dec 8, 2024",
      status: "Review",
      lastUpdate: "3 hours ago",
    },
  ]

  const recentMessages = [
    {
      id: 1,
      from: "TechStartup Inc.",
      message: "Great progress on the e-commerce site! Could you add the payment gateway integration?",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      from: "FitLife Solutions",
      message: "The API documentation looks perfect. When can we expect the next milestone?",
      time: "1 day ago",
      unread: false,
    },
    {
      id: 3,
      from: "Creative Agency",
      message: "The website speed improvements are impressive. Ready for final review.",
      time: "3 hours ago",
      unread: true,
    },
  ]

  const upcomingDeadlines = [
    {
      project: "Website Performance Optimization",
      client: "Creative Agency",
      deadline: "Dec 8, 2024",
      daysLeft: 2,
    },
    {
      project: "E-commerce Website Development",
      client: "TechStartup Inc.",
      deadline: "Dec 15, 2024",
      daysLeft: 9,
    },
    {
      project: "Mobile App Backend API",
      client: "FitLife Solutions",
      deadline: "Jan 10, 2025",
      daysLeft: 35,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back! Here's what's happening with your freelance business.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.monthlyEarnings.toLocaleString()}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-600">Goal: $10,000</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
                </div>
                <Briefcase className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-600">{stats.completedJobs} completed</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Client Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.clientRating}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-600">Response: {stats.responseTime}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Active Projects */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeProjects.map((project) => (
                        <div key={project.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">{project.title}</h4>
                              <p className="text-sm text-gray-600">Client: {project.client}</p>
                            </div>
                            <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>
                              {project.status}
                            </Badge>
                          </div>

                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>

                          <div className="flex justify-between items-center text-sm text-gray-600">
                            <span>Budget: {project.budget}</span>
                            <span>Due: {project.deadline}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Recent Messages */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Recent Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentMessages.map((message) => (
                        <div key={message.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-sm">{message.from}</span>
                            <span className="text-xs text-gray-500">{message.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                          {message.unread && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>}
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4 bg-transparent">
                      View All Messages
                    </Button>
                  </CardContent>
                </Card>

                {/* Upcoming Deadlines */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Upcoming Deadlines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {upcomingDeadlines.map((item, index) => (
                        <div key={index} className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.project}</p>
                            <p className="text-xs text-gray-600">{item.client}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{item.daysLeft} days</p>
                            <p className="text-xs text-gray-500">{item.deadline}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>All Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Detailed project management interface will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Integrated messaging interface will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Detailed analytics and reporting dashboard will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
