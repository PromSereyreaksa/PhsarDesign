"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Star, MapPin, Calendar, Edit, MessageSquare, AlertCircle, RefreshCw, Eye, EyeOff } from "lucide-react"
import { Button } from "../../shared/components/ui/button"
import { Card, CardContent } from "../../shared/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "../../shared/components/ui/avatar"
import AuthNavbar from "../../shared/components/layout/navigation/AuthNavbar"
import AuthFooter from "../../shared/components/layout/footer/AuthFooter"
import { clientsAPI, usersAPI } from "../../services/api"
import { updateProfile } from "../../store/slices/authSlice"
import Loader from "../../shared/components/ui/Loader"

export default function ClientProfile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [isOwner, setIsOwner] = useState(false)
  const [clientData, setClientData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [networkError, setNetworkError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isPhonePublic, setIsPhonePublic] = useState(true)

  const createDefaultClientData = (userData = {}) => ({
    id: userData.userId || "",
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    username:
      userData.firstName && userData.lastName
        ? `@${userData.firstName.toLowerCase()}${userData.lastName.toLowerCase()}`
        : "@user",
    avatar: userData.avatarURL || userData.avatar || "/placeholder.svg",
    bio: userData.bio || userData.about || "",
    industry: userData.industry || "",
    location: userData.location || "Location not specified",
    companySize: userData.companySize || "",
    website: userData.website || "",
    phoneNumber: userData.phoneNumber || "",
    joinDate: userData.joinDate || "Recently",
    rating: userData.rating || 0,
    totalReviews: userData.totalReviews || 0,
    totalProjects: userData.totalProjects || 0,
    projectsPosted: userData.projectsPosted || [],
    reviews: userData.reviews || [],
    coverImage: userData.coverImage || "/placeholder.svg",
  })

  useEffect(() => {
    const fetchAndUpdateClientData = async () => {
      if (isLoading || networkError) return
      setIsLoading(true)
      setNetworkError(false)
      setErrorMessage("")

      let freshUserData = user
      let clientProjects = []
      let additionalClientData = {}

      if (user && (userId === user.userId || !userId)) {
        try {
          console.log("[v0] Fetching comprehensive client data...")

          const [clientResponse, userResponse, projectsResponse] = await Promise.allSettled([
            clientsAPI.getByUserId(user.userId),
            usersAPI.getById(user.userId),
            clientsAPI.getClientProjects ? clientsAPI.getClientProjects(user.userId) : Promise.resolve({ data: [] }),
          ])

          // Process client-specific data
          if (clientResponse.status === "fulfilled") {
            additionalClientData = clientResponse.value.data
            console.log("[v0] Client-specific data received:", additionalClientData)
          }

          // Process user data
          if (userResponse.status === "fulfilled") {
            freshUserData = userResponse.value.data
            console.log("[v0] User data received:", freshUserData)
          }

          // Process projects data
          if (projectsResponse.status === "fulfilled") {
            clientProjects = projectsResponse.value.data || []
            console.log("[v0] Client projects received:", clientProjects)
          }

          const combinedData = {
            ...freshUserData,
            ...additionalClientData,
            projectsPosted: clientProjects,
            totalProjects: clientProjects.length,
          }

          let processedAvatarUrl = null
          const possibleAvatarFields = ["avatarURL", "avatar", "avatarUrl", "profileImage"]

          for (const field of possibleAvatarFields) {
            if (combinedData[field]) {
              processedAvatarUrl = combinedData[field]
              console.log(`[v0] Found avatar in field '${field}':`, processedAvatarUrl)
              break
            }
          }

          if (processedAvatarUrl) {
            const separator = processedAvatarUrl.includes("?") ? "&" : "?"
            processedAvatarUrl = `${processedAvatarUrl}${separator}t=${Date.now()}`
            console.log("[v0] Processed avatar URL with cache-busting:", processedAvatarUrl)
          }

          const updatedUserData = {
            ...combinedData,
            avatar: processedAvatarUrl || combinedData.avatarURL || combinedData.avatar,
          }

          dispatch(updateProfile(updatedUserData))
          freshUserData = updatedUserData
        } catch (error) {
          console.error("[v0] Error fetching comprehensive client data:", error)

          if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
            setNetworkError(true)
            setErrorMessage(
              "Unable to connect to server. Please check if the backend is running and CORS is configured properly.",
            )
            freshUserData = user
          } else {
            setErrorMessage("Failed to fetch client data. Using cached information.")
          }
        }
      }

      if (freshUserData && (userId === freshUserData.userId || !userId)) {
        setIsOwner(true)
        setClientData(
          createDefaultClientData({
            ...freshUserData,
            projectsPosted: clientProjects,
            totalProjects: clientProjects.length,
          }),
        )
      } else {
        setClientData(createDefaultClientData())
        setIsOwner(false)
      }

      setIsLoading(false)
    }

    fetchAndUpdateClientData()
  }, [userId])

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

  if (!clientData || isLoading) {
  const handleRetry = () => {
    setNetworkError(false)
    setErrorMessage("")
    setIsLoading(false)
  }

  const handlePhonePrivacyToggle = () => {
    setIsPhonePublic(!isPhonePublic)
    // Here you would typically save this preference to the backend
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
            <img src={clientData.coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white/20 bg-white/10 backdrop-blur-sm">
                    <AvatarImage
                      src={clientData.avatar || "/placeholder.svg"}
                      alt={`${clientData.firstName} ${clientData.lastName}`}
                      onLoad={() => console.log("[v0] Client avatar loaded successfully:", clientData.avatar)}
                      onError={(e) => {
                        console.log("[v0] Client avatar failed to load:", clientData.avatar)
                        console.log("[v0] Error details:", e)
                      }}
                    />
                    <AvatarFallback className="text-2xl font-bold text-white bg-[#A95BAB]">
                      {clientData.firstName?.[0]}
                      {clientData.lastName?.[0]}
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
                          {clientData.firstName} {clientData.lastName}
                        </h1>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="text-xl font-semibold text-yellow-400">{clientData.rating}</span>
                          </div>
                          <div className="text-gray-300">•</div>
                          <div className="text-lg font-medium text-[#A95BAB]">{clientData.totalProjects} projects</div>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-3">{clientData.username}</p>
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

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="space-y-8">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-white mb-6">About</h3>
                  {clientData.bio && <p className="text-gray-300 leading-relaxed mb-8 text-base">{clientData.bio}</p>}

                  <div className="space-y-4 mb-8">
                    {clientData.industry && (
                      <div className="flex justify-between py-3 border-b border-white/10">
                        <span className="text-gray-400 font-medium">Industry</span>
                        <span className="text-white font-semibold">{clientData.industry}</span>
                      </div>
                    )}
                    {clientData.companySize && (
                      <div className="flex justify-between py-3 border-b border-white/10">
                        <span className="text-gray-400 font-medium">Company Size</span>
                        <span className="text-white font-semibold">{clientData.companySize}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 text-sm">
                    {clientData.phoneNumber && (
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
                    {clientData.website && (
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
                <h2 className="text-2xl font-bold text-white mb-8">Reviews from Artists ({clientData.totalReviews})</h2>

                {clientData.reviews.length > 0 ? (
                  <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
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

                {clientData.projectsPosted.length > 0 ? (
                  <div className="space-y-6">
                    {clientData.projectsPosted.map((project) => (
                      <Card
                        key={project.id}
                        className="bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                      >
                        <CardContent className="p-8">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                                  {project.status}
                                </span>
                              </div>
                              <p className="text-gray-300 mb-6 leading-relaxed">{project.description}</p>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                                <div>
                                  <span className="text-gray-400 block mb-1">Budget</span>
                                  <div className="text-white font-medium">{project.budget}</div>
                                </div>
                                <div>
                                  <span className="text-gray-400 block mb-1">Deadline</span>
                                  <div className="text-white font-medium">{project.deadline}</div>
                                </div>
                                <div>
                                  <span className="text-gray-400 block mb-1">Applicants</span>
                                  <div className="text-white font-medium">{project.applicants}</div>
                                </div>
                                <div>
                                  <span className="text-gray-400 block mb-1">Category</span>
                                  <div className="text-[#A95BAB] font-medium">{project.category}</div>
                                </div>
                              </div>
                            </div>

                            {isOwner && (
                              <Button
                                size="sm"
                                onClick={() => handleEditPost(project.id)}
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
}}
