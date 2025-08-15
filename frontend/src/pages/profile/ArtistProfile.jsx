"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { Star, MapPin, Calendar, Edit, MessageSquare, Heart, Eye } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar"
import AuthNavbar from "../../components/layout/navigation/AuthNavbar"
import AuthFooter from "../../components/layout/footer/AuthFooter"

export default function ArtistProfile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [isOwner, setIsOwner] = useState(false)
  const [artistData, setArtistData] = useState(null)

  // Mock artist data - replace with API call
  const mockArtistData = {
    id: userId || "1",
    name: "Emma Wilson",
    username: "@emmawilson",
    avatar: "/professional-artist-portrait.png",
    coverImage: "/artistic-workspace.png",
    bio: "Digital artist and illustrator specializing in character design and concept art. I bring stories to life through vibrant colors and imaginative worlds.",
    location: "San Francisco, CA",
    joinDate: "March 2023",
    skills: ["Digital Art", "Character Design", "Illustration", "Concept Art", "UI/UX Design"],
    rating: 4.9,
    totalReviews: 127,
    totalProjects: 89,
    responseTime: "2 hours",
    availability: "Available",
    hourlyRate: "$75/hour",
    posts: [
      {
        id: 1,
        title: "Fantasy Character Design",
        image: "/placeholder-wv6ds.png",
        likes: 234,
        views: 1200,
        category: "Character Design",
      },
      {
        id: 2,
        title: "Digital Portrait Commission",
        image: "/digital-portrait.png",
        likes: 189,
        views: 890,
        category: "Digital Art",
      },
      {
        id: 3,
        title: "Game UI Concept",
        image: "/stylized-game-ui.png",
        likes: 156,
        views: 670,
        category: "UI/UX Design",
      },
    ],
    reviews: [
      {
        id: 1,
        clientName: "John Smith",
        clientAvatar: "/professional-headshot.png",
        rating: 5,
        comment:
          "Emma delivered exceptional work on our character designs. Her attention to detail and creativity exceeded our expectations.",
        date: "2 weeks ago",
        project: "Fantasy Game Characters",
      },
      {
        id: 2,
        clientName: "Sarah Johnson",
        clientAvatar: "/professional-businesswoman-headshot.png",
        rating: 5,
        comment: "Professional, timely, and incredibly talented. Will definitely work with Emma again!",
        date: "1 month ago",
        project: "Brand Illustration",
      },
    ],
  }

  useEffect(() => {
    // In a real app, fetch artist data based on userId
    setArtistData(mockArtistData)

    // Check if current user is viewing their own profile
    if (user && (userId === user.userId || !userId)) {
      setIsOwner(true)
    }
  }, [userId, user])

  const handleEditProfile = () => {
    navigate("/profile/edit")
  }

  const handleEditPost = (postId) => {
    navigate(`/marketplace/edit/${postId}`)
  }

  if (!artistData) {
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
            <img src={artistData.coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Profile Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white/20 bg-white/10 backdrop-blur-sm">
                    <AvatarImage src={artistData.avatar || "/placeholder.svg"} alt={artistData.name} />
                    <AvatarFallback className="text-2xl font-bold text-white bg-[#A95BAB]">
                      {artistData.name
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
                      <h1 className="text-3xl font-bold mb-2">{artistData.name}</h1>
                      <p className="text-gray-300 mb-2">{artistData.username}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {artistData.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Joined {artistData.joinDate}
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
                  <p className="text-gray-300 leading-relaxed mb-6">{artistData.bio}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#A95BAB]">{artistData.rating}</div>
                      <div className="text-sm text-gray-400">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#A95BAB]">{artistData.totalProjects}</div>
                      <div className="text-sm text-gray-400">Projects</div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Response Time</span>
                      <span className="text-white">{artistData.responseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Availability</span>
                      <span className="text-green-400">{artistData.availability}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Hourly Rate</span>
                      <span className="text-white">{artistData.hourlyRate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {artistData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#A95BAB]/20 text-[#A95BAB] rounded-full text-sm border border-[#A95BAB]/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Portfolio/Posts */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Portfolio</h2>
                  {isOwner && (
                    <Button
                      onClick={() => navigate("/marketplace/create")}
                      className="bg-[#A95BAB] hover:bg-[#A95BAB]/80"
                    >
                      Add New Work
                    </Button>
                  )}
                </div>

                {artistData.posts.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {artistData.posts.map((post) => (
                      <Card
                        key={post.id}
                        className="bg-white/5 border-white/10 hover:bg-white/10 rounded-2xl overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-500 ease-out"
                      >
                        <div className="relative">
                          <img
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                          />
                          {isOwner && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditPost(post.id)
                              }}
                              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-white mb-2">{post.title}</h3>
                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <span className="px-2 py-1 bg-[#A95BAB]/20 rounded-full text-[#A95BAB]">
                              {post.category}
                            </span>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                {post.likes}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {post.views}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-400">No portfolio items yet.</p>
                      {isOwner && (
                        <Button
                          onClick={() => navigate("/marketplace/create")}
                          className="mt-4 bg-[#A95BAB] hover:bg-[#A95BAB]/80"
                        >
                          Add Your First Work
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Reviews */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Reviews ({artistData.totalReviews})</h2>

                {artistData.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {artistData.reviews.map((review) => (
                      <Card key={review.id} className="bg-white/5 border-white/10 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={review.clientAvatar || "/placeholder.svg"} alt={review.clientName} />
                              <AvatarFallback className="bg-[#A95BAB] text-white">
                                {review.clientName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-white">{review.clientName}</h4>
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
          </div>
        </div>

        <AuthFooter />
      </div>
    </div>
  )
}
