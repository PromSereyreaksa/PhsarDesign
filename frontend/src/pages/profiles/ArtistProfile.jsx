"use client"

import { Calendar, Edit, Eye, Heart, MapPin, MessageSquare, Star } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import AuthFooter from "../../components/layout/AuthFooter"
import AuthNavbar from "../../components/layout/AuthNavbar"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import Loader from "../../components/ui/Loader"
import { artistsAPI, usersAPI } from "../../lib/api"
import { updateProfile } from "../../store/slices/authSlice"
import { fetchMyAvailabilityPosts } from "../../store/slices/postsSlice"

export default function ArtistProfile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [isOwner, setIsOwner] = useState(false)
  const [artistData, setArtistData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const fetchedUserIdRef = useRef(null)
  // Use Redux selectors for user's own posts
  const myAvailabilityPosts = useSelector((state) => state.posts.myAvailabilityPosts)
  const postsLoading = useSelector((state) => state.posts.myAvailabilityPostsLoading)

  // Use only the current user's posts
  const posts = myAvailabilityPosts;

  useEffect(() => {
    // Prevent infinite loops by checking if we already fetched for this user
    if (fetchedUserIdRef.current === user?.userId && (userId === user?.userId || !userId)) {
      console.log("🚫 Skipping fetch - already fetched for user:", user?.userId)
      return
    }

    const fetchUserData = async () => {
      if (user && (userId === user.userId || !userId)) {
        fetchedUserIdRef.current = user.userId
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
            id: freshUserData.userId,
            name: `${freshUserData.firstName} ${freshUserData.lastName}`,
            username: `@${freshUserData.slug}`,
            avatar: processedAvatarUrl,
            bio: freshUserData.about || freshUserData.bio || null,
            location: freshUserData.location || null,
            joinDate: freshUserData.createdAt ? new Date(freshUserData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : null,
            skills: artistProfileData?.skills
              ? artistProfileData.skills
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [],
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
            rating: artistProfileData?.rating || 0,
            totalReviews: artistProfileData?.totalReviews || 0,
            totalProjects: artistProfileData?.totalProjects || 0,
            responseTime: artistProfileData?.responseTime ? `${artistProfileData.responseTime} hours` : null,
            availability: artistProfileData?.availability || null,
            hourlyRate: artistProfileData?.hourlyRate ? `$${artistProfileData.hourlyRate}/hour` : null,
            reviews: artistProfileData?.reviews || [],
            coverImage: artistProfileData?.coverImage || null,
          })

          // No need to fetch posts here, already handled by Redux slice
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
            id: user.userId,
            name: `${user.firstName} ${user.lastName}`,
            username: `@${user.slug}`,
            avatar: fallbackAvatarUrl,
            bio: user.about || user.bio || null,
            location: user.location || null,
            joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : null,
            skills: user.skills
              ? Array.isArray(user.skills)
                ? user.skills
                : user.skills
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
              : [],
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
            rating: user.rating || 0,
            totalReviews: user.totalReviews || 0,
            totalProjects: user.totalProjects || 0,
            responseTime: user.responseTime ? `${user.responseTime} hours` : null,
            availability: user.availability || null,
            hourlyRate: user.hourlyRate ? `$${user.hourlyRate}/hour` : null,
            reviews: user.reviews || [],
            coverImage: user.coverImage || null,
          })

          // No need to fetch posts here, already handled by Redux slice
        } finally {
          setIsLoading(false)
        }
      } else {
        setArtistData(null)
        setIsOwner(false)
        // No need to fetch posts here, already handled by Redux slice
      }
    }

    fetchUserData();
  }, [userId, user?.userId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Separate effect for fetching posts
  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchMyAvailabilityPosts());
    }
  }, [dispatch, user?.userId])

  const handleEditProfile = () => {
    console.log("[v0] Edit Profile button clicked - navigating to /profile/edit")
    navigate("/profile/edit")
  }

  const handleEditPost = (postId) => {
    console.log('ArtistProfile handleEditPost called with postId:', postId)
    console.log('ArtistProfile handleEditPost - typeof postId:', typeof postId)
    console.log('ArtistProfile handleEditPost - navigating to:', `/marketplace/edit/${postId}`)
    navigate(`/marketplace/edit/${postId}`)
  }

  if (!artistData || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader />
          <p className="text-white mt-4">{isLoading ? "Loading data..." : "Loading..."}</p>
        </div>
      </div>
    )
  }

  console.log("userId param:", userId);
console.log("My post:", myAvailabilityPosts);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <AuthNavbar />

      {/* Main content with proper spacing */}
      <div className="pt-20 pb-8">
        {/* Cover section */}
        <div className="relative mt-0 md:mt-0">
          <div className="h-48 md:h-64 lg:h-80 relative overflow-hidden">
            <img src={artistData.coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Profile info section - positioned below cover image */}
          <div className="relative -mt-8 md:-mt-10 z-10">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-white/20 bg-white/10 backdrop-blur-sm">
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
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                        <h1 className="text-2xl md:text-3xl font-bold">{artistData.name}</h1>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
                            <span className="text-lg md:text-xl font-semibold text-yellow-400">{artistData.rating}</span>
                          </div>
                          <div className="text-gray-300">•</div>
                          <div className="text-base md:text-lg font-medium text-[#A95BAB]">{artistData.totalProjects} projects</div>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-2">{artistData.username}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {artistData.location || "Location not specified"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Joined {artistData.joinDate || "Recently"}
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
                <CardContent className="p-6 space-y-6">
                  <h3 className="text-xl font-bold text-white mb-6 pt-2">About</h3>
                  <p className="text-gray-300 leading-relaxed text-sm break-words">{artistData.bio || "No bio available."}</p>

                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-gray-400 text-sm flex-shrink-0">Response Time</span>
                      <span className="text-white text-sm font-medium text-right">{artistData.responseTime || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-gray-400 text-sm flex-shrink-0">Availability</span>
                      <span className={`text-sm font-medium text-right ${artistData.availability === "Available" ? "text-green-400" : "text-red-400"}`}>
                        {artistData.availability || "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-gray-400 text-sm flex-shrink-0">Hourly Rate</span>
                      <span className="text-white text-sm font-medium text-right">{artistData.hourlyRate || "Contact for pricing"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-6 pt-2">Skills & Expertise</h3>
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

                  <h3 className="text-xl font-bold text-white mb-6 pt-2">Tools & Software</h3>
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
                <h2 className="text-2xl font-bold text-white mb-6 px-2">Reviews ({artistData.totalReviews})</h2>

                {artistData.reviews.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {artistData.reviews.map((review) => (
                      <Card key={review.id} className="bg-white/5 border-white/10 backdrop-blur-sm">
                        <CardContent className="p-8">
                          <div className="flex items-start gap-4 pt-2">
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
                              <div className="flex items-center justify-between mb-3">
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
                      onClick={() => navigate("/marketplace/create?type=availability")}
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
                        key={post.postId || post.id || post._id}
                        className="bg-white/5 border-white/10 hover:bg-white/10 rounded-2xl overflow-hidden group cursor-pointer transform hover:scale-[1.02] transition-all duration-300 ease-out"
                        onClick={() => {
                          const slug = post.title
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)/g, "")
                          navigate(`/marketplace/service/${slug}`)
                        }}
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={post.attachments?.[0]?.url || "/placeholder.svg?height=200&width=400&query=portfolio work"}
                            alt={post.title}
                            className="w-full h-48 object-cover transition-transform duration-300 ease-out"
                          />
                          {isOwner && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                console.log('ArtistProfile edit button clicked - post:', post)
                                console.log('ArtistProfile edit button clicked - post.postId:', post.postId)
                                console.log('ArtistProfile edit button clicked - post.id:', post.id)
                                const postId = post.postId || post.id
                                console.log('ArtistProfile edit button clicked - using postId:', postId)
                                handleEditPost(postId)
                              }}
                              className="absolute top-3 right-3 bg-black/70 hover:bg-black/80 backdrop-blur-sm border border-white/20 z-10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <CardContent className="p-8 space-y-5">
                          <h3 className="font-semibold text-white text-lg leading-tight line-clamp-2 min-h-[3.5rem] flex items-start pt-2">
                            {post.title}
                          </h3>
                          <div className="flex items-center justify-between text-sm pt-3">
                            <span className="px-3 py-1.5 bg-[#A95BAB]/20 rounded-full text-[#A95BAB] border border-[#A95BAB]/30 text-xs font-medium whitespace-nowrap">
                              {post.category}
                            </span>
                            <div className="flex items-center gap-4 text-gray-400 ml-3">
                              <div className="flex items-center gap-1.5">
                                <Heart className="w-4 h-4 flex-shrink-0" />
                                <span className="text-sm">{post.likes || 0}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Eye className="w-4 h-4 flex-shrink-0" />
                                <span className="text-sm">{post.views || 0}</span>
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
                          onClick={() => navigate("/marketplace/create?type=availability")}
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
