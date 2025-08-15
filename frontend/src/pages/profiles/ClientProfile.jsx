"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { Star, MapPin, Calendar, Edit, MessageSquare, Building, Users } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar"
import AuthNavbar from "../../components/layout/navigation/AuthNavbar"
import AuthFooter from "../../components/layout/footer/AuthFooter"

export default function ClientProfile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [isOwner, setIsOwner] = useState(false)
  const [clientData, setClientData] = useState(null)

  // Mock client data - replace with API call
  const mockClientData = {
    id: userId || "1",
    companyName: "TechCorp Solutions",
    contactName: "John Smith",
    username: "@techcorp",
    avatar: "/professional-business-logo.png",
    coverImage: "/modern-office.png",
    bio: "Leading technology company specializing in innovative software solutions. We partner with talented designers and developers to bring cutting-edge products to market.",
    industry: "Technology",
    location: "New York, NY",
    joinDate: "January 2023",
    companySize: "50-200 employees",
    website: "www.techcorp.com",
    rating: 4.8,
    totalReviews: 45,
    totalProjects: 23,
    responseTime: "4 hours",
    projectsPosted: [
      {
        id: 1,
        title: "Mobile App UI/UX Design",
        description:
          "Looking for a talented designer to create modern, user-friendly interface for our new mobile application.",
        budget: "$2,000 - $5,000",
        deadline: "2 weeks",
        status: "Active",
        applicants: 12,
        category: "UI/UX Design",
      },
      {
        id: 2,
        title: "Brand Identity Package",
        description:
          "Complete brand identity design including logo, color palette, and brand guidelines for our new product line.",
        budget: "$1,500 - $3,000",
        deadline: "3 weeks",
        status: "Completed",
        applicants: 8,
        category: "Branding",
      },
      {
        id: 3,
        title: "Website Redesign",
        description: "Modern, responsive website redesign to improve user experience and conversion rates.",
        budget: "$3,000 - $7,000",
        deadline: "1 month",
        status: "In Progress",
        applicants: 15,
        category: "Web Design",
      },
    ],
    reviews: [
      {
        id: 1,
        artistName: "Emma Wilson",
        artistAvatar: "/female-artist-portrait.png",
        rating: 5,
        comment:
          "TechCorp was an amazing client to work with. Clear communication, fair payment, and great feedback throughout the project.",
        date: "1 week ago",
        project: "Mobile App Design",
      },
      {
        id: 2,
        artistName: "Mike Rodriguez",
        artistAvatar: "/male-designer-portrait.png",
        rating: 5,
        comment:
          "Professional and responsive client. The project requirements were well-defined and the collaboration was smooth.",
        date: "3 weeks ago",
        project: "Brand Identity",
      },
    ],
  }

  useEffect(() => {
    // If viewing own profile, use real user data; otherwise use mock data
    if (user && (userId === user.userId || !userId)) {
      setIsOwner(true)
      setClientData({
        ...mockClientData,
        id: user.userId,
        companyName: user.role === "client" ? `${user.firstName} ${user.lastName}` : mockClientData.companyName,
        contactName: `${user.firstName} ${user.lastName}`,
        username: `@${user.firstName?.toLowerCase()}${user.lastName?.toLowerCase()}`,
        avatar: user.avatar || mockClientData.avatar,
        // Use real data if available, fallback to mock data
        bio: user.bio || user.about || mockClientData.bio,
        industry: user.industry || mockClientData.industry,
        location: user.location || mockClientData.location,
        joinDate: user.joinDate || mockClientData.joinDate,
        companySize: user.companySize || mockClientData.companySize,
        website: user.website || mockClientData.website,
        rating: user.rating || mockClientData.rating,
        totalReviews: user.totalReviews || mockClientData.totalReviews,
        totalProjects: user.totalProjects || mockClientData.totalProjects,
        responseTime: user.responseTime || mockClientData.responseTime,
        projectsPosted: user.projectsPosted || mockClientData.projectsPosted,
        reviews: user.reviews || mockClientData.reviews,
        coverImage: user.coverImage || mockClientData.coverImage,
      })
    } else {
      setClientData(mockClientData)
      setIsOwner(false)
    }
  }, [userId, user])

  const handleEditProfile = () => {
    console.log("[v0] Edit Profile button clicked - navigating to /profile/edit")
    navigate("/profile/edit")
  }

  const handleEditPost = (postId) => {
    navigate(`/marketplace/edit/${postId}`)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "text-green-400 bg-green-400/20"
      case "In Progress":
        return "text-blue-400 bg-blue-400/20"
      case "Completed":
        return "text-gray-400 bg-gray-400/20"
      default:
        return "text-gray-400 bg-gray-400/20"
    }
  }

  if (!clientData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] relative">
      <AuthNavbar />

      <div className="pt-20">
        {/* Cover Image & Profile Header */}
        <div className="relative">
          <div className="h-64 md:h-80 relative overflow-hidden">
            <img src={clientData.coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Profile Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white/20 bg-white/10 backdrop-blur-sm">
                    <AvatarImage src={clientData.avatar || "/placeholder.svg"} alt={clientData.companyName} />
                    <AvatarFallback className="text-2xl font-bold text-white bg-[#A95BAB]">
                      {clientData.companyName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {isOwner && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-full p-2"
                      onClick={handleEditProfile}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1 text-white">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <h1 className="text-3xl font-bold">{clientData.companyName}</h1>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="text-xl font-semibold text-yellow-400">{clientData.rating}</span>
                          </div>
                          <div className="text-gray-300">•</div>
                          <div className="text-lg font-medium text-[#A95BAB]">{clientData.totalProjects} projects</div>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-2">{clientData.username}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {clientData.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Joined {clientData.joinDate}
                        </div>
                      </div>
                    </div>

                    {!isOwner && (
                      <div className="flex gap-3">
                        <Button className="bg-[#A95BAB] hover:bg-[#A95BAB]/80">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                        >
                          Follow
                        </Button>
                      </div>
                    )}

                    {isOwner && (
                      <Button
                        onClick={handleEditProfile}
                        className="bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Sidebar */}
            <div className="space-y-6">
              {/* About */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">About</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">{clientData.bio}</p>

                  {/* Company Details */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Industry</span>
                      <span className="text-white">{clientData.industry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Company Size</span>
                      <span className="text-white">{clientData.companySize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Response Time</span>
                      <span className="text-white">{clientData.responseTime}</span>
                    </div>
                    {clientData.website && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Website</span>
                        <a
                          href={`https://${clientData.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#A95BAB] hover:text-[#A95BAB]/80"
                        >
                          {clientData.website}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Company Info */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Company Info</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-[#A95BAB]" />
                      <div>
                        <div className="text-white font-medium">{clientData.industry}</div>
                        <div className="text-sm text-gray-400">Industry</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-[#A95BAB]" />
                      <div>
                        <div className="text-white font-medium">{clientData.companySize}</div>
                        <div className="text-sm text-gray-400">Team Size</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Reviews from Artists ({clientData.totalReviews})</h2>

                {clientData.reviews.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {clientData.reviews.map((review) => (
                      <Card key={review.id} className="bg-white/5 border-white/10 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={review.artistAvatar || "/placeholder.svg"} alt={review.artistName} />
                              <AvatarFallback className="bg-[#A95BAB] text-white">
                                {review.artistName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-white">{review.artistName}</h4>
                                  <p className="text-sm text-gray-400">{review.project}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.rating ? "text-yellow-400 fill-current" : "text-gray-600"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-400">{review.date}</span>
                                </div>
                              </div>
                              <p className="text-gray-300">{review.comment}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-400">No reviews yet.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Posted Projects */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Posted Projects</h2>
                  {isOwner && (
                    <Button
                      onClick={() => navigate("/marketplace/create")}
                      className="bg-[#A95BAB] hover:bg-[#A95BAB]/80"
                    >
                      Post New Project
                    </Button>
                  )}
                </div>

                {clientData.projectsPosted.length > 0 ? (
                  <div className="space-y-4">
                    {clientData.projectsPosted.map((project) => (
                      <Card
                        key={project.id}
                        className="bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                                  {project.status}
                                </span>
                              </div>
                              <p className="text-gray-300 mb-4">{project.description}</p>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-400">Budget</span>
                                  <div className="text-white font-medium">{project.budget}</div>
                                </div>
                                <div>
                                  <span className="text-gray-400">Deadline</span>
                                  <div className="text-white font-medium">{project.deadline}</div>
                                </div>
                                <div>
                                  <span className="text-gray-400">Applicants</span>
                                  <div className="text-white font-medium">{project.applicants}</div>
                                </div>
                                <div>
                                  <span className="text-gray-400">Category</span>
                                  <div className="text-[#A95BAB] font-medium">{project.category}</div>
                                </div>
                              </div>
                            </div>

                            {isOwner && (
                              <Button
                                size="sm"
                                onClick={() => handleEditPost(project.id)}
                                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white ml-4"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-400">No projects posted yet.</p>
                      {isOwner && (
                        <Button
                          onClick={() => navigate("/marketplace/create")}
                          className="mt-4 bg-[#A95BAB] hover:bg-[#A95BAB]/80"
                        >
                          Post Your First Project
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>

        <AuthFooter />
      </div>
    </div>
  )
}
