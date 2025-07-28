"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer"
import { Star, MapPin, Calendar, Award, Edit, Camera, Plus, Loader2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Progress } from "../../components/ui/progress"
import { 
  fetchFreelancerByUserId,
  fetchClientByUserId,
  fetchPortfoliosByFreelancerId,
  fetchProjectsByClientId
} from "../../store/actions"

export default function Profile() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { 
    projects, 
    portfolios, 
    currentArtist, 
    currentClient, 
    loading: isLoading, 
    error 
  } = useSelector((state) => state.api)
  
  // Create a demo user if no user is logged in
  const effectiveUser = user || {
    name: "Demo User",
    email: "demo@artlink.com",
    role: "artist",
    id: 1,
    userId: 1
  }
  
  const [isEditing, setIsEditing] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [userProjects, setUserProjects] = useState([])
  const [userPortfolios, setUserPortfolios] = useState([])

  // Fetch user profile and related data on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!effectiveUser) {
        console.log('No user found, using mock profile data')
        return
      }

      try {
        let fetchedProfile = null
        
        console.log('Loading profile for user:', effectiveUser)
        
        if (effectiveUser.role === 'artist' || effectiveUser.role === 'freelancer') {
          try {
            // Fetch artist profile
            fetchedProfile = await dispatch(fetchFreelancerByUserId(effectiveUser.userId || effectiveUser.id))
            console.log('Fetched artist profile:', fetchedProfile)
            
            // Fetch artist's portfolios
            if (fetchedProfile && fetchedProfile.artistId) {
              await dispatch(fetchPortfoliosByFreelancerId(fetchedProfile.artistId))
            }
          } catch (artistError) {
            console.warn('Failed to fetch artist profile:', artistError.message)
            // Continue with mock data
          }
        } else if (effectiveUser.role === 'client') {
          try {
            // Fetch client profile
            fetchedProfile = await dispatch(fetchClientByUserId(effectiveUser.userId || effectiveUser.id))
            console.log('Fetched client profile:', fetchedProfile)
            
            // Fetch client's projects  
            if (fetchedProfile && fetchedProfile.clientId) {
              await dispatch(fetchProjectsByClientId(fetchedProfile.clientId))
            }
          } catch (clientError) {
            console.warn('Failed to fetch client profile:', clientError.message)
            // Continue with mock data
          }
        }
        
        setUserProfile(fetchedProfile)
      } catch (error) {
        console.error('Error loading user profile:', error)
        // Don't throw the error, just continue with mock data
      }
    }

    loadUserProfile()
  }, [dispatch, effectiveUser])

  // Update local state when Redux state changes
  useEffect(() => {
    if (effectiveUser?.role === 'artist' && currentArtist) {
      setUserProfile(currentArtist)
    } else if (effectiveUser?.role === 'client' && currentClient) {
      setUserProfile(currentClient)
    }
  }, [currentArtist, currentClient, effectiveUser])

  useEffect(() => {
    if (projects && Array.isArray(projects)) {
      setUserProjects(projects)
    } else if (projects && projects.projects) {
      setUserProjects(projects.projects)
    }
  }, [projects])

  useEffect(() => {
    if (portfolios && Array.isArray(portfolios)) {
      setUserPortfolios(portfolios)
    } else if (portfolios && portfolios.portfolios) {
      setUserPortfolios(portfolios.portfolios)
    }
  }, [portfolios])

  // Create profile object from fetched data or use mock data
  const getProfileData = () => {
    // Always show mock data for now to prevent errors
    const mockName = effectiveUser?.name || effectiveUser?.email?.split('@')[0] || "Demo User"
    const mockRole = effectiveUser?.role === 'artist' ? "Creative Artist" : effectiveUser?.role === 'client' ? "Creative Client" : "User"
    
    if (userProfile && effectiveUser) {
      return {
        name: userProfile.name || mockName,
        title: userProfile.title || mockRole,
        avatar: userProfile.avatarUrl || userProfile.avatar || "/placeholder.svg?height=120&width=120",
        location: userProfile.location || "Location not specified",
        memberSince: effectiveUser.createdAt ? new Date(effectiveUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently joined",
        hourlyRate: userProfile.hourlyRate || userProfile.rate ? `$${userProfile.hourlyRate || userProfile.rate}/hr` : "Rate on request",
        totalEarned: userProfile.totalEarned || "$0",
        jobsCompleted: userProjects.filter(p => p.status === 'completed').length || 0,
        rating: userProfile.rating || 4.5,
        reviews: userProfile.reviews || userProfile.totalCommissions || 0,
        responseTime: userProfile.responseTime || "1-2 hours",
        bio: userProfile.bio || userProfile.description || "Welcome to my profile! I'm excited to work on creative projects.",
        skills: userProfile.skills ? userProfile.skills.split(',').map(skill => ({ name: skill.trim(), level: Math.floor(Math.random() * 20) + 80 })) : [
          { name: "Creative Design", level: 90 },
          { name: "Problem Solving", level: 85 }
        ],
        certifications: userProfile.certifications ? userProfile.certifications.split(',') : ["Professional Certificate"],
        languages: [{ name: "English", level: "Native" }],
      }
    }
    
    // Fallback mock data if no real data is available
    return {
      name: mockName,
      title: mockRole,
      avatar: "/placeholder.svg?height=120&width=120",
      location: "Remote",
      memberSince: "Recently joined",
      hourlyRate: "$50/hr",
      totalEarned: "$1,000+",
      jobsCompleted: 5,
      rating: 4.8,
      reviews: 3,
      responseTime: "1 hour",
      bio: "Welcome to my profile! I'm excited to work on creative projects and bring your ideas to life.",
      skills: [
        { name: "Creative Design", level: 90 },
        { name: "Communication", level: 95 },
        { name: "Project Management", level: 85 },
        { name: "Problem Solving", level: 88 },
      ],
      certifications: ["Creative Professional", "Digital Artist"],
      languages: [
        { name: "English", level: "Native" },
      ],
    }
  }

  const profileData = getProfileData()

  // Format recent projects from real data or use mock data
  const getRecentProjects = () => {
    if (userProjects.length > 0) {
      return userProjects
        .filter(p => p.status === 'completed')
        .slice(0, 3)
        .map(project => ({
          id: project.id,
          title: project.title || 'Untitled Project',
          client: project.Client?.name || 'Unknown Client',
          rating: 5, // Would need to calculate from reviews
          review: project.description || 'No review available',
          budget: project.budget || 'Budget not specified',
          completedDate: project.updatedAt ? new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently',
          skills: project.skills ? project.skills.split(',').map(s => s.trim()) : [],
        }))
    }
    
    // Fallback mock data
    return [
      {
        id: 1,
        title: "E-commerce Platform Development",
        client: "TechStartup Inc.",
        rating: 5,
        review: "Sarah delivered an exceptional e-commerce platform. Her attention to detail and technical expertise exceeded our expectations.",
        budget: "$4,500",
        completedDate: "Dec 2023",
        skills: ["React", "Node.js", "Stripe"],
      },
      {
        id: 2,
        title: "Mobile App Backend API",
        client: "FitLife Solutions",
        rating: 5,
        review: "Outstanding work on our fitness app backend. Clean code, excellent documentation, and delivered on time.",
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
  }

  const recentProjects = getRecentProjects()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#A95BAB]" />
          <span className="ml-2 text-gray-600">Loading profile...</span>
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

      {/* Profile Content */}
      {!isLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt={profileData.name} />
                    <AvatarFallback className="text-2xl">
                      {profileData.name
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
                    <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
                    <p className="text-xl text-gray-600 mt-1">{profileData.title}</p>
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
                      <span className="font-semibold">{profileData.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600">{profileData.reviews} reviews</p>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-600">{profileData.hourlyRate}</div>
                    <p className="text-sm text-gray-600">Hourly Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{profileData.jobsCompleted}</div>
                    <p className="text-sm text-gray-600">Jobs Completed</p>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{profileData.totalEarned}</div>
                    <p className="text-sm text-gray-600">Total Earned</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {profileData.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Member since {profileData.memberSince}
                  </div>
                  <div>Response time: {profileData.responseTime}</div>
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
                    <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profileData.skills.map((skill) => (
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
                      {profileData.certifications.map((cert, index) => (
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
                      {profileData.languages.map((lang, index) => (
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
      )}

      <Footer />
    </div>
  )
}
