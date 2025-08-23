"use client"

import { AlertCircle, Calendar, Edit, Eye, EyeOff, MapPin, MessageSquare, RefreshCw, Star } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import AuthFooter from "../../components/layout/AuthFooter"
import AuthNavbar from "../../components/layout/AuthNavbar"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { clientsAPI } from "../../lib/api"

export default function ClientProfile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [isOwner, setIsOwner] = useState(false)
  const [clientData, setClientData] = useState(null) // Changed to null for clarity
  const [isLoading, setIsLoading] = useState(true)
  const [networkError, setNetworkError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isPhonePublic, setIsPhonePublic] = useState(true)
  const hasFetchedRef = useRef(null)

  useEffect(() => {
    // Prevent double execution for the same userId
    if (hasFetchedRef.current === userId) {
      console.log('🚫 Skipping fetch - already fetched for userId:', userId)
      return
    }

    const fetchClientData = async () => {
      if (user && (userId === user.userId || !userId)) {
        hasFetchedRef.current = userId
        setIsOwner(true)
        setIsLoading(true)

        try {
          console.log("[v0] Fetching fresh client data from API for userId:", user.userId)
          const clientResponse = await clientsAPI.getByUserId(user.userId)
          const freshClientData = clientResponse.data
          console.log("[v0] Fresh client data received:", freshClientData)

          // Process avatar
          const avatarFromBackend =
            freshClientData.user?.avatarURL ||
            freshClientData.user?.avatar ||
            freshClientData.user?.avatarUrl ||
            freshClientData.user?.profileImage ||
            null

          console.log("[v0] Avatar field from backend:", avatarFromBackend)

          let processedAvatarUrl = null
          if (avatarFromBackend && typeof avatarFromBackend === "string" && avatarFromBackend.trim() !== "") {
            const avatarUrl = avatarFromBackend.trim()
            processedAvatarUrl = avatarUrl.includes("?")
              ? `${avatarUrl}&t=${Date.now()}`
              : `${avatarUrl}?t=${Date.now()}`
            console.log("[v0] Processed avatar URL:", processedAvatarUrl)
          } else {
            console.log("[v0] No valid avatar URL found, will use fallback")
          }

          const clientDataToSet = {
            id: freshClientData.userId || "",
            firstName: freshClientData.user?.firstName || "",
            lastName: freshClientData.user?.lastName || "",
            username: freshClientData.user?.firstName && freshClientData.user?.lastName
              ? `@${freshClientData.user.firstName.toLowerCase()}${freshClientData.user.lastName.toLowerCase()}`
              : "@user",
            avatar: processedAvatarUrl,
            bio: freshClientData.user?.bio || "",
            industry: freshClientData.industry || "",
            location: freshClientData.user?.location || "Location not specified",
            companySize: freshClientData.companySize || "",
            website: freshClientData.user?.website || "",
            phoneNumber: freshClientData.user?.phoneNumber || "",
            joinDate: freshClientData.user?.createdAt || "Recently",
            organizationName: freshClientData.organizationName || "",
            rating: freshClientData.rating || 0,
            totalReviews: freshClientData.reviews?.length || 0,
            totalProjects: freshClientData.jobPosts?.length || 0,
            projectsPosted: freshClientData.jobPosts || [],
            reviews: freshClientData.reviews || [],
            coverImage: freshClientData.user?.coverUrl || "/placeholder.svg",
          }

          console.log("[v0] Final client data:", clientDataToSet)
          setClientData(clientDataToSet)
        } catch (error) {
          console.error("[v0] Error fetching fresh client data:", error)
          if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
            setNetworkError(true)
            setErrorMessage(
              "Unable to connect to server. Please check if the backend is running and CORS is configured properly."
            )
          } else {
            setErrorMessage("Failed to fetch client data. Using cached information.")
          }

          // Fallback to existing user data
          let fallbackAvatarUrl = null
          if (user.avatar && typeof user.avatar === "string" && user.avatar.trim() !== "") {
            const avatarUrl = user.avatar.trim()
            fallbackAvatarUrl = avatarUrl.includes("?")
              ? `${avatarUrl}&t=${Date.now()}`
              : `${avatarUrl}?t=${Date.now()}`
            console.log("[v0] Using fallback avatar from Redux:", fallbackAvatarUrl)
          }

          const fallbackClientData = {
            id: user.userId || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            username: user.firstName && user.lastName
              ? `@${user.firstName.toLowerCase()}${user.lastName.toLowerCase()}`
              : "@user",
            avatar: fallbackAvatarUrl,
            bio: user.about || user.bio || "",
            industry: user.industry || "",
            location: user.location || "Location not specified",
            companySize: user.companySize || "",
            website: user.website || "",
            phoneNumber: user.phoneNumber || "",
            joinDate: user.createdAt || "Recently",
            rating: user.rating || 0,
            totalReviews: user.reviews?.length || 0,
            totalProjects: user.jobPosts?.length || 0,
            projectsPosted: user.jobPosts || [],
            reviews: user.reviews || [],
            coverImage: user.coverUrl || "/placeholder.svg",
          }

          setClientData(fallbackClientData)
        } finally {
          setIsLoading(false)
        }
      } else {
        setClientData(null)
        setIsOwner(false)
        setIsLoading(false)
      }
    }

    fetchClientData()
  }, [userId, user]) // Added user to dependency array

  const handleEditProfile = () => {
    console.log("[v0] Edit Profile button clicked - navigating to /profile/edit")
    navigate("/profile/edit")
  }

  const handleEditPost = (postId) => {
    navigate(`/marketplace/edit/${postId}`)
  }

  const getStatusColor = (isActive) => {
    return (isActive) ? "text-green-400 bg-green-400/20" : "text-gray-400 bg-gray-400/20"
  }

  const handleRetry = () => {
    setNetworkError(false)
    setErrorMessage("")
    setIsLoading(true)
    hasFetchedRef.current = null // Reset to allow refetch
  }

  const handlePhonePrivacyToggle = () => {
    setIsPhonePublic(!isPhonePublic)
    // TODO: Save this preference to the backend
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    )
  }

  // Show message if no client data and not owner
  if (!clientData && !isOwner) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="max-w-7xl mx-auto px-6 py-10 text-white text-center">
          <p>No client data available.</p>
        </div>
        <AuthFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] relative">
      <AuthNavbar />

      {networkError && (
        <div className="bg-red-500/20 border-b border-red-500/30 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 text-red-200">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{errorMessage}</span>
            </div>
            <Button
              size="sm"
              onClick={handleRetry}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      )}

      <div className="pt-20">
        <div className="relative">
          <div className="h-64 md:h-80 relative overflow-hidden">
            <img
              src={clientData?.coverImage || "/placeholder.svg"}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white/20 bg-white/10 backdrop-blur-sm">
                    <AvatarImage
                      src={clientData?.avatar || "/placeholder.svg"}
                      alt={`${clientData?.firstName || "User"} ${clientData?.lastName || ""}`}
                      onLoad={() => console.log("[v0] Client avatar loaded successfully:", clientData?.avatar)}
                      onError={(e) => {
                        console.log("[v0] Client avatar failed to load:", clientData?.avatar)
                        console.log("[v0] Error details:", e)
                      }}
                    />
                    <AvatarFallback className="text-2xl font-bold text-white bg-[#A95BAB]">
                      {clientData?.firstName?.[0] || "U"}
                      {clientData?.lastName?.[0] || ""}
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
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-4 mb-3">
                        <h1 className="text-3xl font-bold">
                          {clientData?.firstName || "User"} {clientData?.lastName || ""}
                        </h1>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="text-xl font-semibold text-yellow-400">{clientData?.rating || 0}</span>
                          </div>
                          <div className="text-gray-300">•</div>
                          <div className="text-lg font-medium text-[#A95BAB]">
                            {clientData?.totalProjects || 0} projects
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-3">{clientData?.username || "@user"}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {clientData?.location || "Location not specified"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Joined {new Date(clientData?.joinDate).toDateString() || "Recently"}
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

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="space-y-8">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-white mb-6">About</h3>
                  {clientData?.bio ? (
                    <p className="text-gray-300 leading-relaxed mb-8 text-base">{clientData.bio}</p>
                  ) : (
                    <p className="text-gray-400">No bio available.</p>
                  )}

                  <div className="space-y-4 mb-8">
                    {clientData?.industry && (
                      <div className="flex justify-between py-3 border-b border-white/10">
                        <span className="text-gray-400 font-medium">Industry</span>
                        <span className="text-white font-semibold">{clientData.industry}</span>
                      </div>
                    )}
                    {clientData?.companySize && (
                      <div className="flex justify-between py-3 border-b border-white/10">
                        <span className="text-gray-400 font-medium">Company Size</span>
                        <span className="text-white font-semibold">{clientData.companySize}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 text-sm">
                    {clientData?.phoneNumber && (
                      <div className="flex justify-between items-center py-3">
                        <span className="text-gray-400 font-medium">Phone</span>
                        <div className="flex items-center gap-3">
                          {isOwner ? (
                            <>
                              <span className="text-white font-medium">
                                {isPhonePublic ? clientData.phoneNumber : "Hidden"}
                              </span>
                              <button
                                onClick={handlePhonePrivacyToggle}
                                className="text-[#A95BAB] hover:text-[#A95BAB]/80 transition-colors"
                                title={isPhonePublic ? "Make phone private" : "Make phone public"}
                              >
                                {isPhonePublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </button>
                            </>
                          ) : (
                            <span className="text-white font-medium">
                              {isPhonePublic ? clientData.phoneNumber : "Private"}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    {clientData?.website && (
                      <div className="flex justify-between py-3">
                        <span className="text-gray-400 font-medium">Website</span>
                        <a
                          href={`https://${clientData.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#A95BAB] hover:text-[#A95BAB]/80 font-medium"
                        >
                          {clientData.website}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div>
                <h2 className="text-2xl font-bold text-white mb-8">
                  Reviews from Artists ({clientData?.totalReviews || 0})
                </h2>

                {clientData?.totalReviews > 0 ? (
                  <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                    {clientData.reviews.map((review) => (
                      <Card key={review.reviewId} className="bg-white/5 border-white/10 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-white">{review.artistName || "Anonymous"}</h4>
                                  <p className="text-sm text-gray-400">{review.project || "No project specified"}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < (review.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-600"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-400">{review.date || "N/A"}</span>
                                </div>
                              </div>
                              <p className="text-gray-300">{review.comment || "No comment provided."}</p>
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

            <div className="lg:col-span-2 space-y-10">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-white">Posts</h2>
                  {isOwner && (
                    <Button
                      onClick={() => navigate("/marketplace/create")}
                      className="bg-[#A95BAB] hover:bg-[#A95BAB]/80"
                    >
                      Create New Post
                    </Button>
                  )}
                </div>

                {clientData?.totalProjects > 0 ? (
                  <div className="space-y-6">
                    {clientData.projectsPosted.map((jobPost) => (
                      <Card
                        key={jobPost.jobId}
                        className="bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                      >
                        <CardContent className="p-8">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-xl font-semibold text-white">{jobPost.title || "Untitled"}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(jobPost.isActive)}`}>
                                  {jobPost.isActive ? "Active": ""}
                                </span>
                              </div>
                              <p
                                style={{
                                  color: "#d1d5db", // text-gray-300
                                  marginBottom: "1.5rem", // mb-6
                                  lineHeight: "1.625", // leading-relaxed
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {jobPost.description || "No description provided."}
                              </p>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                                <div>
                                  <span className="text-gray-400 block mb-1">Budget</span>
                                  <div className="text-white font-medium">{jobPost.budget || "N/A"}</div>
                                </div>
                                <div>
                                  <span className="text-gray-400 block mb-1">Deadline</span>
                                  <div className="text-white font-medium">{new Date(jobPost.deadline).toLocaleDateString() || "N/A"}</div>
                                </div>
                                <div>
                                  <span className="text-gray-400 block mb-1">Applicants</span>
                                  <div className="text-white font-medium">{jobPost.applicationCount || 0}</div>
                                </div>
                                <div>
                                  <span className="text-gray-400 block mb-1">Category</span>
                                  <div className="text-[#A95BAB] font-medium">{jobPost.category.name || "N/A"}</div>
                                </div>
                              </div>
                            </div>

                            {isOwner && (
                              <Button
                                size="sm"
                                onClick={() => handleEditPost(jobPost.jobId)}
                                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white ml-6"
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
                    <CardContent className="p-10 text-center">
                      <p className="text-gray-400 mb-4">No posts yet.</p>
                      {isOwner && (
                        <Button
                          onClick={() => navigate("/marketplace/create")}
                          className="bg-[#A95BAB] hover:bg-[#A95BAB]/80"
                        >
                          Create Your First Post
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