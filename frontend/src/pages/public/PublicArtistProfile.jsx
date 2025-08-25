import {
    Calendar,
    Edit,
    Eye,
    Heart,
    MapPin,
    MessageSquare,
    Star
} from 'lucide-react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import AuthNavbar from '../../components/layout/AuthNavbar'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { fetchArtistBySlug } from '../../store/slices/artistsSlice'
import { fetchAvailabilityPostsByUserId } from '../../store/slices/postsSlice'

const PublicArtistProfile = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { currentArtist, loading, error } = useSelector((state) => state.artists)
  const { user } = useSelector((state) => state.auth)
  // Use Redux selectors for fetching any user's posts by userId
  const userPosts = useSelector((state) => state.posts.userPosts)
  const postsLoading = useSelector((state) => state.posts.userPostsLoading)
  
  const isOwner = user && currentArtist && user.id === currentArtist.userId

  useEffect(() => {
    if (slug) {
      dispatch(fetchArtistBySlug(slug))
    }
  }, [dispatch, slug])

  useEffect(() => {
    if (currentArtist?.userId) {
      // Fetch posts for this specific artist (works for any artist, not just current user)
      console.log('[PublicArtistProfile] Fetching posts for artist userId:', currentArtist.userId)
      dispatch(fetchAvailabilityPostsByUserId(currentArtist.userId))
    }
  }, [dispatch, currentArtist?.userId])

  // Updated to handle both edit profile scenarios
  const handleEditProfile = () => {
    if (isOwner) {
      navigate('/profile')
    }
    // If not owner, do nothing (stay on public view)
  }

  // Optional: Uncomment to auto-redirect owners to their profile page
  // useEffect(() => {
  //   if (isOwner && currentArtist) {
  //     navigate('/profile')
  //   }
  // }, [isOwner, currentArtist, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] flex items-center justify-center">
        <div className="text-white">Loading artist profile...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] flex items-center justify-center">
        <div className="text-white">Error: {error}</div>
      </div>
    )
  }

  if (!currentArtist) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] flex items-center justify-center">
        <div className="text-white">Artist not found</div>
      </div>
    )
  }

  // If user is the owner, they'll see edit options but won't be auto-redirected
  // This component will render for both owners and non-owners

  // Prepare artist data in the same format as ArtistProfile
  const artistData = {
    name: `${currentArtist.user?.firstName || ''} ${currentArtist.user?.lastName || ''}`.trim(),
    username: `@${currentArtist.user?.username || ''}`,
    avatar: currentArtist.user?.avatarURL,
    coverImage: currentArtist.coverImage || "/placeholder.svg",
    bio: currentArtist.bio || 'No bio available.',
    location: currentArtist.location || 'Location not specified',
    joinDate: currentArtist.user?.createdAt ? new Date(currentArtist.user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Unknown',
    rating: currentArtist.rating || 0,
    totalProjects: currentArtist.totalProjects || 0,
    totalReviews: currentArtist.reviews?.length || 0,
    responseTime: currentArtist.responseTime || 'Within 24 hours',
    availability: currentArtist.availability || 'Available',
    hourlyRate: currentArtist.hourlyRate || 'Contact for pricing',
    skills: currentArtist.skills ? currentArtist.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
    tools: currentArtist.tools ? currentArtist.tools.split(',').map(s => s.trim()).filter(Boolean) : [],
    reviews: currentArtist.reviews || []
  }

  // Use the posts fetched by userId for any artist
  const posts = userPosts;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] relative">
      <AuthNavbar/>

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
                          console.log("[Public Profile] ✅ Avatar image loaded successfully!")
                          console.log("[Public Profile] Avatar URL that loaded:", artistData.avatar)
                        }}
                        onError={(e) => {
                          console.log("[Public Profile] ❌ Avatar image failed to load!")
                          console.log("[Public Profile] Failed avatar URL:", artistData.avatar)
                          console.log("[Public Profile] Error details:", e)
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

                {/* Portfolio section - for any artist's posts */}
                {postsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-white">Loading portfolio...</div>
                  </div>
                ) : posts && posts.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {posts.map((post) => (
                      <Card
                        key={post.postId || post.id || post._id}
                        className="bg-white/5 border-white/10 hover:bg-white/10 rounded-2xl overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-500 ease-out"
                        onClick={() => {
                          const slug = post.title
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)/g, "")
                          navigate(`/marketplace/${slug}`)
                        }}
                      >
                        <div className="relative">
                          <img
                            src={post.image || post.imageUrl || "/placeholder.svg?height=200&width=400&query=portfolio work"}
                            alt={post.title}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                          />
                          {isOwner && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                const postId = post.postId || post.id
                                navigate(`/marketplace/edit/${postId}`)
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
                                {post.likes || 0}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {post.views || 0}
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
      </div>
    </div>
  )
}

export default PublicArtistProfile