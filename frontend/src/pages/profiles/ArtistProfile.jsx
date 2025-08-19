"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Star, MapPin, Calendar, Edit, MessageSquare, Heart, Eye } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar"
import AuthNavbar from "../../components/layout/navigation/AuthNavbar"
import AuthFooter from "../../components/layout/footer/AuthFooter"
import { usersAPI, artistsAPI, availabilityPostsAPI } from "../../services/api"
import { updateProfile } from "../../store/slices/authSlice"

export default function ArtistProfile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [isOwner, setIsOwner] = useState(false)
  const [artistData, setArtistData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [posts, setPosts] = useState([])
  const [postsLoading, setPostsLoading] = useState(false)

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

  const fetchArtistPosts = async (artistUserId) => {
    setPostsLoading(true)
    try {
      console.log("[v0] Fetching posts for artist userId:", artistUserId)
      const response = await availabilityPostsAPI.getByArtist(artistUserId)
      console.log("[v0] Posts API response:", response.data)

      // Transform API data to match the expected post structure
      const transformedPosts = response.data.map((post) => ({
        id: post.postId,
        title: post.title,
        image: post.attachments && post.attachments.length > 0 ? post.attachments[0] : null,
        likes: post.likes || 0,
        views: post.views || 0,
        category: post.category?.name || "Service",
        description: post.description,
        budget: post.budget,
        createdAt: post.createdAt,
      }))

      setPosts(transformedPosts)
      console.log("[v0] Transformed posts:", transformedPosts)
    } catch (error) {
      console.error("[v0] Error fetching artist posts:", error)
      // Fallback to empty array on error
      setPosts([])
    } finally {
      setPostsLoading(false)
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && (userId === user.userId || !userId)) {
        setIsOwner(true)
        setIsLoading(true)

        try {
          console.log("[v0] Fetching fresh user data from API for userId:", user.userId)
          const [userResponse, artistResponse] = await Promise.all([
            usersAPI.getById(user.userId),
            artistsAPI.getByUserId(user.userId),
          ])

          const freshUserData = userResponse.data
          const artistProfileData = artistResponse.data

          console.log("[v0] Fresh user data received:", freshUserData)
          console.log("[v0] Artist profile data received:", artistProfileData)

          const avatarFromBackend =
            freshUserData.avatar || freshUserData.avatarURL || freshUserData.profileImage || null
          console.log("[v0] Avatar field from backend:", avatarFromBackend)
          console.log("[v0] Current Redux avatar:", user.avatar)

          const updatedUserData = {
            ...user,
            ...freshUserData,
            avatar: avatarFromBackend,
          }
          dispatch(updateProfile(updatedUserData))
          console.log("[v0] Updated Redux state with fresh avatar:", avatarFromBackend)

          let processedAvatarUrl = null
          if (avatarFromBackend && typeof avatarFromBackend === "string" && avatarFromBackend.trim() !== "") {
            const avatarUrl = avatarFromBackend.trim()
            processedAvatarUrl = avatarUrl.includes("?")
              ? `${avatarUrl}&t=${Date.now()}`
              : `${avatarUrl}?t=${Date.now()}`
            console.log("[v0] Processed avatar URL:", processedAvatarUrl)
          } else {
            console.log("[v0] No valid avatar URL found, will use fallback initials")
          }

          setArtistData({
            ...mockArtistData,
            id: freshUserData.userId,
            name: `${freshUserData.firstName} ${freshUserData.lastName}`,
            username: `@${freshUserData.firstName?.toLowerCase()}${freshUserData.lastName?.toLowerCase()}`,
            avatar: processedAvatarUrl, // Use processed avatar or null for fallback
            bio: freshUserData.about || freshUserData.bio || mockArtistData.bio,
            location: freshUserData.location || "Location not specified",
            joinDate: mockArtistData.joinDate,
            skills: artistProfileData?.skills
              ? artistProfileData.skills
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : mockArtistData.skills,
            tools: artistProfileData?.specialties
              ? artistProfileData.specialties
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : artistProfileData?.tools
                ? artistProfileData.tools
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : [],
            rating: mockArtistData.rating,
            totalReviews: mockArtistData.totalReviews,
            totalProjects: mockArtistData.totalProjects,
            responseTime: artistProfileData?.responseTime ? `${artistProfileData.responseTime} hours` : "Not specified",
            availability: artistProfileData?.availability || "Not specified",
            hourlyRate: artistProfileData?.hourlyRate ? `$${artistProfileData.hourlyRate}/hour` : "Not specified",
            reviews: mockArtistData.reviews,
            coverImage: mockArtistData.coverImage,
          })

          await fetchArtistPosts(freshUserData.userId)
        } catch (error) {
          console.error("[v0] Error fetching fresh user data:", error)

          let fallbackAvatarUrl = null
          if (user.avatar && typeof user.avatar === "string" && user.avatar.trim() !== "") {
            const avatarUrl = user.avatar.trim()
            fallbackAvatarUrl = avatarUrl.includes("?")
              ? `${avatarUrl}&t=${Date.now()}`
              : `${avatarUrl}?t=${Date.now()}`
            console.log("[v0] Using fallback avatar from Redux:", fallbackAvatarUrl)
          } else {
            console.log("[v0] No valid avatar in Redux state, will use initials fallback")
          }

          setArtistData({
            ...mockArtistData,
            id: user.userId,
            name: `${user.firstName} ${user.lastName}`,
            username: `@${user.firstName?.toLowerCase()}${user.lastName?.toLowerCase()}`,
            avatar: fallbackAvatarUrl, // Use fallback avatar or null
            bio: user.about || user.bio || mockArtistData.bio,
            location: user.location || "Location not specified",
            joinDate: mockArtistData.joinDate,
            skills: user.skills
              ? Array.isArray(user.skills)
                ? user.skills
                : user.skills
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
              : mockArtistData.skills,
            tools: user.specialties
              ? Array.isArray(user.specialties)
                ? user.specialties
                : user.specialties
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
              : user.tools
                ? Array.isArray(user.tools)
                  ? user.tools
                  : user.tools
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                : [],
            rating: mockArtistData.rating,
            totalReviews: mockArtistData.totalReviews,
            totalProjects: mockArtistData.totalProjects,
            responseTime: user.responseTime ? `${user.responseTime} hours` : "Not specified",
            availability: user.availability || "Not specified",
            hourlyRate: user.hourlyRate ? `$${user.hourlyRate}/hour` : "Not specified",
            reviews: mockArtistData.reviews,
            coverImage: mockArtistData.coverImage,
          })

          await fetchArtistPosts(user.userId)
        } finally {
          setIsLoading(false)
        }
      } else {
        setArtistData(mockArtistData)
        setIsOwner(false)
        if (userId) {
          await fetchArtistPosts(userId)
        }
      }
    }

    fetchUserData()
  }, [userId]) // Removed user?.avatar from dependencies to prevent unnecessary re-fetches

  const handleEditProfile = () => {
    console.log("[v0] Edit Profile button clicked - navigating to /profile/edit")
    navigate("/profile/edit")
  }

  const handleEditPost = (postId) => {
    navigate(`/marketplace/edit/${postId}`)
  }

  if (!artistData || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] flex items-center justify-center">
        <div className="text-white">{isLoading ? "Loading fresh data..." : "Loading..."}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] relative">
      <AuthNavbar />

      <div className="pt-20">
        <div className="relative">
          <div className="h-64 md:h-80 relative overflow-hidden">
            <img src={artistData.coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white/20 bg-white/10 backdrop-blur-sm">
                    {artistData.avatar ? (
                      <AvatarImage
                        key={artistData.avatar}
                        src={artistData.avatar || "/placeholder.svg"}
                        alt={artistData.name}
                        onLoad={() => {
                          console.log("[v0] ✅ Avatar image loaded successfully!")
                          console.log("[v0] Avatar URL that loaded:", artistData.avatar)
                        }}
                        onError={(e) => {
                          console.log("[v0] ❌ Avatar image failed to load!")
                          console.log("[v0] Failed avatar URL:", artistData.avatar)
                          console.log("[v0] Error details:", e)
                        }}
                      />
                    ) : null}
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

                <div className="flex-1 text-white">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <h1 className="text-3xl font-bold">{artistData.name}</h1>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="text-xl font-semibold text-yellow-400">{artistData.rating}</span>
                          </div>
                          <div className="text-gray-300">•</div>
                          <div className="text-lg font-medium text-[#A95BAB]">{artistData.totalProjects} projects</div>
                        </div>
                      </div>
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
                      <div className="flex gap-3">
                        <Button
                          onClick={handleEditProfile}
                          className="bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                        <Button onClick={() => navigate("/dashboard")} className="bg-[#A95BAB] hover:bg-[#A95BAB]/80">
                          Dashboard
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">About</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">{artistData.bio}</p>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Response Time</span>
                      <span className="text-white">{artistData.responseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Availability</span>
                      <span className={artistData.availability === "Available" ? "text-green-400" : "text-red-400"}>
                        {artistData.availability}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Hourly Rate</span>
                      <span className="text-white">{artistData.hourlyRate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {artistData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#A95BAB]/20 text-[#A95BAB] rounded-full text-sm border border-[#A95BAB]/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4">Tools & Software</h3>
                  <div className="flex flex-wrap gap-2">
                    {artistData.tools?.map((tool, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#A95BAB]/10 text-[#A95BAB] rounded-full text-sm border border-[#A95BAB]/20"
                      >
                        {tool}
                      </span>
                    ))}
                    {(!artistData.tools || artistData.tools.length === 0) && (
                      <span className="text-gray-400 text-sm">No tools specified</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Reviews ({artistData.totalReviews})</h2>

                {artistData.reviews.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
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

            <div className="lg:col-span-2 space-y-8">
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

                {postsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-white">Loading portfolio...</div>
                  </div>
                ) : posts.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {posts.map((post) => (
                      <Card
                        key={post.id}
                        className="bg-white/5 border-white/10 hover:bg-white/10 rounded-2xl overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-500 ease-out"
                        onClick={() => {
                          const slug = post.title
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)/g, "")
                          navigate(`/marketplace/${slug}-${post.id}`)
                        }}
                      >
                        <div className="relative">
                          <img
                            src={post.image || "/placeholder.svg?height=200&width=400&query=portfolio work"}
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
            </div>
          </div>
        </div>

        <AuthFooter />
      </div>
    </div>
  )
}
