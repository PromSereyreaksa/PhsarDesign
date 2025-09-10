import {
    Calendar,
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
import { fetchPostsByArtistId } from '../../store/slices/postsSlice'
import NotFoundPage from '../NotFoundPage/NotFoundPage'

const PublicArtistProfile = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { currentArtist, loading, error } = useSelector((state) => state.artists)
  
  // Use Redux selectors for fetching any user's posts by userId
  const userPosts = useSelector((state) => state.posts.userPosts)
  const postsLoading = useSelector((state) => state.posts.userPostsLoading)
  const postsError = useSelector((state) => state.posts.userPostsError)

  // Debug logging
  console.log('[PublicArtistProfile] Debug info:', {
    slug,
    currentArtist: currentArtist ? {
      artistId: currentArtist.artistId,
      userId: currentArtist.userId,
      userObject: currentArtist.user,
      firstName: currentArtist.user?.firstName,
      lastName: currentArtist.user?.lastName,
      allFields: Object.keys(currentArtist)
    } : null,
    loading,
    error,
    postsError
  })

  useEffect(() => {
    if (slug) {
      dispatch(fetchArtistBySlug(slug))
    }
  }, [dispatch, slug])

  useEffect(() => {
    if (currentArtist) {
      // Use artistId first, fallback to userId if artistId is not available
      const artistId = currentArtist.artistId || currentArtist.userId;
      if (artistId) {
        console.log('[PublicArtistProfile] Fetching posts for specific artist ID:', artistId);
        dispatch(fetchPostsByArtistId(artistId))
          .unwrap()
          .then((posts) => {
            console.log('[PublicArtistProfile] ✅ Artist posts fetched successfully:', posts);
          })
          .catch((error) => {
            console.error('[PublicArtistProfile] ❌ Failed to fetch artist posts:', error);
          });
      }
    }
  }, [dispatch, currentArtist])



  // Add error boundary for the entire component
  if (!slug) {
    return (
      <NotFoundPage 
        title="Not Found"
        message="The page you're looking for doesn't exist."
      />
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] flex items-center justify-center">
        <div className="text-white">Loading artist profile...</div>
      </div>
    )
  }

  // Check for specific error types that should show 404 page
  if (error) {
    const errorString = typeof error === 'string' ? error : error?.message || ''
    const isNotFoundError = 
      errorString.includes('404') || 
      errorString.includes('Artist not found') ||
      errorString.includes('User not found') ||
      errorString.includes('500') ||
      errorString.includes('Internal Server Error') ||
      errorString.includes('Network Error')

    if (isNotFoundError) {
      return (
        <NotFoundPage 
          title="Not Found"
          message="The page you're looking for doesn't exist."
        />
      )
    }

    // For other errors, show generic error message
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] flex items-center justify-center">
        <div className="text-center">
          <div className="text-white mb-4">Error loading artist profile</div>
          <div className="text-red-400 text-sm">{errorString}</div>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-[#A95BAB] hover:bg-[#A95BAB]/80"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // If no artist found but no explicit error, show not found
  if (!loading && !currentArtist) {
    return (
      <NotFoundPage 
        title="Not Found"
        message="The page you're looking for doesn't exist."
      />
    )
  }

  // Prepare artist data in the same format as ArtistProfile with safety checks
  const artistData = currentArtist ? {
    name: `${currentArtist.user?.firstName || ''} ${currentArtist.user?.lastName || ''}`.trim() || 'Unknown Artist',
    username: `@${currentArtist.user?.slug || 'unknown'}`,
    avatar: currentArtist.user?.avatarURL || currentArtist.user?.avatar,
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
  } : null

  // Use the posts fetched by userId for any artist
  const posts = userPosts;

  // Safety check for artistData
  if (!artistData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] flex items-center justify-center">
        <div className="text-white">Unable to load artist data</div>
      </div>
    )
  }

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

                    <div className="flex gap-3">
                      <Button 
                        className="bg-[#A95BAB] hover:bg-[#A95BAB]/80"
                        onClick={() => alert('Message feature is under development')}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                        onClick={() => alert('Follow feature is under development')}
                      >
                        Follow
                      </Button>
                    </div>
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
                  <p className="text-gray-300 leading-relaxed text-sm break-words">{artistData.bio}</p>

                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-gray-400 text-sm flex-shrink-0">Response Time</span>
                      <span className="text-white text-sm font-medium text-right">{artistData.responseTime}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-gray-400 text-sm flex-shrink-0">Availability</span>
                      <span className={`text-sm font-medium text-right ${artistData.availability === "Available" ? "text-green-400" : "text-red-400"}`}>
                        {artistData.availability}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-gray-400 text-sm flex-shrink-0">Hourly Rate</span>
                      <span className="text-white text-sm font-medium text-right">{artistData.hourlyRate}</span>
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
                </div>

                {/* Portfolio section - for any artist's posts */}
                {postsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-white">Loading portfolio...</div>
                  </div>
                ) : postsError ? (
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <div className="text-red-400 mb-4">Failed to load portfolio</div>
                      <div className="text-gray-400 text-sm mb-4">{postsError}</div>
                      <Button 
                        onClick={() => {
                          const artistId = currentArtist.artistId || currentArtist.userId;
                          if (artistId) {
                            dispatch(fetchPostsByArtistId(artistId));
                          }
                        }}
                        className="bg-[#A95BAB] hover:bg-[#A95BAB]/80"
                      >
                        Retry
                      </Button>
                    </CardContent>
                  </Card>
                ) : posts && posts.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {posts.map((post, index) => {
                      // Safety check for post data
                      if (!post || typeof post !== 'object') {
                        console.warn('[PublicArtistProfile] Invalid post data at index:', index, post)
                        return null
                      }

                      return (
                      <Card
                        key={post.postId || post.id || post._id || index}
                        className="bg-white/5 border-white/10 hover:bg-white/10 rounded-2xl overflow-hidden group cursor-pointer transform hover:scale-[1.02] transition-all duration-300 ease-out"
                        onClick={() => {
                          navigate(`/marketplace/service/${post.slug}`)
                        }}
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={post.attachments[0].url || post.imageUrl || "/placeholder.svg?height=200&width=400&query=portfolio work"}
                            alt={post.title}
                            className="w-full h-48 object-cover transition-transform duration-300 ease-out"
                          />
                        </div>
                        <CardContent className="p-8 space-y-5">
                          <h3 className="font-semibold text-white text-lg leading-tight line-clamp-2 min-h-[3.5rem] flex items-start pt-2">
                            {String(post.title || 'Untitled')}
                          </h3>
                          <div className="flex items-center justify-between text-sm pt-3">
                            <span className="px-3 py-1.5 bg-[#A95BAB]/20 rounded-full text-[#A95BAB] border border-[#A95BAB]/30 text-xs font-medium whitespace-nowrap">
                              {typeof post.category === 'object' ? post.category?.name || 'Uncategorized' : post.category || 'Uncategorized'}
                            </span>
                            <div className="flex items-center gap-4 text-gray-400 ml-3">
                              <div className="flex items-center gap-1.5">
                                <Heart className="w-4 h-4 flex-shrink-0" />
                                <span className="text-sm">{Number(post.likes) || 0}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Eye className="w-4 h-4 flex-shrink-0" />
                                <span className="text-sm">{Number(post.views) || 0}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      )
                    })}
                  </div>
                ) : (
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-400">No portfolio items yet.</p>
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