"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer"
import { TrendingUp, DollarSign, Briefcase, MessageSquare, Calendar, Star, Clock, Loader2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { fetchProjectsByClientId } from "../../store/actions/projectActions"
import { 
  fetchFreelancerByUserId,
  fetchClientByUserId 
} from "../../store/actions/index"
import { projectsAPI, applicationsAPI, analyticsAPI, clientsAPI, artistsAPI } from "../../services/api"

export default function Dashboard() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { projects = [], conversations = [], isLoading, error } = useSelector((state) => state.api)
  const navigate = useNavigate()
  
  // Remove role restriction - dashboard supports both clients and artists
  
  const [activeTab, setActiveTab] = useState("overview")
  const [profile, setProfile] = useState(null)
  const [userProjects, setUserProjects] = useState([])
  const [userMessages, setUserMessages] = useState([])
  const [applications, setApplications] = useState([])
  const [analytics, setAnalytics] = useState(null)

  // Fetch user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return

      try {
        // Load user profile based on role
        let userProfile = null
        if (user.role === 'artist' || user.role === 'freelancer') {
          // Get artist profile
          const artistResponse = await artistsAPI.getByUserId(user.userId)
          userProfile = artistResponse.data
          setProfile(userProfile)

          // Load artist applications
          const applicationsResponse = await applicationsAPI.getByArtistId(userProfile.artistId)
          setApplications(applicationsResponse.data.applications || [])

          // Load artist analytics
          const analyticsResponse = await analyticsAPI.getArtistAnalytics(userProfile.artistId)
          setAnalytics(analyticsResponse.data)

        } else if (user.role === 'client') {
          // Get client profile
          const clientResponse = await clientsAPI.getByUserId(user.userId)
          userProfile = clientResponse.data
          setProfile(userProfile)

          // Load client projects
          const projectsResponse = await projectsAPI.getByClientId(userProfile.clientId)
          setUserProjects(projectsResponse.data.projects || [])

          // Load client analytics
          const analyticsResponse = await analyticsAPI.getClientAnalytics(userProfile.clientId)
          setAnalytics(analyticsResponse.data)
        }

      } catch (error) {
        console.error('Error loading dashboard data:', error)
      }
    }

    loadUserData()
  }, [user])

  // Update local state when Redux state changes
  useEffect(() => {
    if (projects.projects) {
      setUserProjects(projects.projects)
    }
  }, [projects])

  useEffect(() => {
    if (conversations.conversations) {
      setUserMessages(conversations.conversations)
    }
  }, [conversations])

  // Calculate stats from real data based on user role
  const calculateStats = () => {
    if (user?.role === 'client') {
      const activeProjectsCount = userProjects.filter(p => p.status === 'open' || p.status === 'in_progress').length
      const completedProjectsCount = userProjects.filter(p => p.status === 'completed').length
      const totalSpent = userProjects
        .filter(p => p.status === 'completed')
        .reduce((total, p) => total + (parseFloat(p.budget) || 0), 0)
      
      return {
        totalSpent,
        monthlySpent: analytics?.overview?.totalSpent || 0,
        activeProjects: activeProjectsCount,
        completedProjects: completedProjectsCount,
        totalApplications: analytics?.overview?.totalApplications || 0,
        averageCompletionTime: analytics?.overview?.averageCompletionTime || 0,
      }
    } else {
      // Artist stats
      return {
        totalEarnings: 0, // Would come from completed projects
        monthlyEarnings: 0,
        profileViews: analytics?.overview?.profileViews || 0,
        portfolioViews: analytics?.overview?.portfolioViews || 0,
        totalApplications: analytics?.overview?.totalApplications || 0,
        acceptedApplications: analytics?.overview?.acceptedApplications || 0,
        successRate: analytics?.successRate || 0,
      }
    }
  }

  const stats = calculateStats()

  // Format projects for display
  const formatActiveProjects = () => {
    return userProjects
      .filter(p => p.status === 'active' || p.status === 'in_progress')
      .map(project => ({
        id: project.id,
        title: project.title || 'Untitled Project',
        client: project.Client?.name || 'Unknown Client',
        budget: project.budget || 'Not specified',
        progress: 50, // This would need to be calculated based on milestones
        deadline: project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline',
        status: project.status === 'active' ? 'In Progress' : 'In Progress',
        lastUpdate: project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'Recently'
      }))
  }

  // Format messages for display
  const formatRecentMessages = () => {
    // Mock data until messages API is implemented
    return [
      {
        id: 1,
        from: "John Doe",
        message: "Great progress on the project!",
        time: "2 hours ago",
        unread: true
      },
      {
        id: 2,
        from: "Jane Smith", 
        message: "Looking forward to the next update",
        time: "1 day ago",
        unread: false
      }
    ]
    
    // This will be used once messages API is working:
    // return userMessages.slice(0, 5).map(conversation => ({
    //   id: conversation.id,
    //   from: conversation.otherUser?.name || 'Unknown User',
    //   message: conversation.lastMessage?.content || 'No recent messages',
    //   time: conversation.lastMessage?.createdAt ? 
    //     new Date(conversation.lastMessage.createdAt).toLocaleDateString() : 'Recently',
    //   unread: conversation.unreadCount > 0
    // }))
  }

  // Format upcoming deadlines
  const formatUpcomingDeadlines = () => {
    const now = new Date()
    return userProjects
      .filter(p => p.deadline && new Date(p.deadline) > now)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 5)
      .map(project => ({
        project: project.title || 'Untitled Project',
        client: project.Client?.name || 'Unknown Client',
        deadline: new Date(project.deadline).toLocaleDateString(),
        daysLeft: Math.ceil((new Date(project.deadline) - now) / (1000 * 60 * 60 * 24))
      }))
  }

  const activeProjects = formatActiveProjects()
  const recentMessages = formatRecentMessages()
  const upcomingDeadlines = formatUpcomingDeadlines()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back{profile ? `, ${profile.name}` : ''}! Here's your project overview.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading dashboard data...</span>
          </div>
        )}

        {/* Stats Cards */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {user?.role === 'client' ? (
              <>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Spent</p>
                        <p className="text-2xl font-bold text-gray-900">${stats.totalSpent?.toLocaleString() || 0}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="text-gray-600">Lifetime spending</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Projects</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.activeProjects || 0}</p>
                      </div>
                      <Briefcase className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="text-gray-600">{stats.completedProjects || 0} completed</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Applications</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalApplications || 0}</p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="text-gray-600">Total received</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg Completion</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.averageCompletionTime || 0} days</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-500" />
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="text-gray-600">Project duration</span>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Profile Views</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.profileViews || 0}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="text-gray-600">Portfolio: {stats.portfolioViews || 0}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Applications</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalApplications || 0}</p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="text-gray-600">{stats.acceptedApplications || 0} accepted</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Success Rate</p>
                        <p className="text-2xl font-bold text-gray-900">{Math.round(stats.successRate || 0)}%</p>
                      </div>
                      <Star className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="text-gray-600">Application success</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                        <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings?.toLocaleString() || 0}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-yellow-500" />
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="text-gray-600">Lifetime earnings</span>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

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
                    {activeProjects.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No active projects</p>
                      </div>
                    ) : (
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
                    )}
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
                    {recentMessages.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-gray-500">No recent messages</p>
                      </div>
                    ) : (
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
                    )}
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
                    {upcomingDeadlines.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-gray-500">No upcoming deadlines</p>
                      </div>
                    ) : (
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
                    )}
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
                {userProjects.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No projects yet</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {user?.role === 'client' ? 'Post your first project to get started!' : 'Start browsing projects to find work!'}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600">Detailed project management interface showing all {userProjects.length} projects.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Integrated messaging interface showing {userMessages.length} conversations.</p>
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
