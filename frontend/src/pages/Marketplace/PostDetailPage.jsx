"use client"

import { ArrowLeft } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AuthNavbar from "../../components/layout/AuthNavbar"
import SimplePostCard from "../../components/marketplace/SimplePostCard"
import PostDetail from "../../components/marketplace/PostDetail"
import { useAppDispatch, useAppSelector } from "../../hook/useRedux"
import { selectActiveTab, selectAvailabilityPosts, selectJobPosts } from "../../store/slices/postsSlice"
import { availabilityPostsAPI, jobPostsAPI } from "../../store/api/marketplaceAPI"

// Helper function to extract image URLs
const getImageUrls = (attachments) => {
  if (!attachments || !Array.isArray(attachments)) return []
  return attachments.map((att) => att.url)
}

// Helper to format price
const formatPrice = (value) => `$${Number.parseFloat(value).toFixed(2)}`

const PostDetailPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [fetchedPost, setFetchedPost] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState(null)

  // Use the same selectors as MarketplacePage
  const activeTab = useAppSelector(selectActiveTab)
  const availabilityPosts = useAppSelector(selectAvailabilityPosts)
  const jobPosts = useAppSelector(selectJobPosts)

  // Use postsToDisplay logic from MarketplacePage
  const postsToDisplay = useMemo(() => {
    return activeTab === "availability" ? availabilityPosts : jobPosts
  }, [activeTab, availabilityPosts, jobPosts])

  // Find the post by slug in store first, then use fetched post
  const currentPost = useMemo(() => {
    const storePost = postsToDisplay.find((p) => p.slug === slug)
    return storePost || fetchedPost
  }, [slug, postsToDisplay, fetchedPost])

  useEffect(() => {
    const fetchPostBySlug = async () => {
      // If post is already in store, don't fetch
      const storePost = [...availabilityPosts, ...jobPosts].find((p) => p.slug === slug)
      if (storePost) {
        setFetchedPost(null) // Clear any previously fetched post
        return
      }

      setIsLoading(true)
      setFetchError(null)

      try {
        console.log("[v0] PostDetailPage - Fetching post by slug:", slug)

        // Try availability posts first
        try {
          const availabilityResponse = await availabilityPostsAPI.getBySlug(slug)
          console.log("[v0] PostDetailPage - Found availability post:", availabilityResponse.data)
          const post = availabilityResponse.data
          // Ensure post has correct type
          post.postType = "availability"
          setFetchedPost(post)
          return
        } catch (availabilityError) {
          console.log("[v0] PostDetailPage - Not found in availability posts, trying job posts")
        }

        // Try job posts if not found in availability posts
        try {
          const jobResponse = await jobPostsAPI.getBySlug(slug)
          console.log("[v0] PostDetailPage - Found job post:", jobResponse.data)
          const post = jobResponse.data
          // Ensure post has correct type
          post.postType = "job"
          setFetchedPost(post)
          return
        } catch (jobError) {
          console.log("[v0] PostDetailPage - Not found in job posts either")
        }

        // If not found in either, set error
        setFetchError("Post not found")
      } catch (error) {
        console.error("[v0] PostDetailPage - Error fetching post:", error)
        setFetchError("Failed to load post")
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchPostBySlug()
    }
  }, [slug, availabilityPosts, jobPosts])

  // Related posts: filter by same artist/client, exclude current
  const relatedPosts = useMemo(() => {
    if (!currentPost) return []
    if (activeTab === "availability" && currentPost.artist?.artistId) {
      return postsToDisplay.filter((p) => p.artist?.artistId === currentPost.artist.artistId && p.slug !== slug)
    }
    if (activeTab === "jobs" && currentPost.clientId) {
      return postsToDisplay.filter((p) => p.clientId === currentPost.clientId && p.slug !== slug)
    }
    return []
  }, [currentPost, postsToDisplay, activeTab, slug])

  const handleBack = () => navigate("/marketplace")

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="pt-28 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <button
              onClick={handleBack}
              className="inline-flex items-center space-x-2 mb-8 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:border-gray-600/60 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Marketplace</span>
            </button>

            <div className="text-center py-16">
              <div className="animate-spin w-8 h-8 border-2 border-[#A95BAB] border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-white">Loading post...</h3>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentPost || fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="pt-28 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <button
              onClick={handleBack}
              className="inline-flex items-center space-x-2 mb-8 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:border-gray-600/60 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Marketplace</span>
            </button>

            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold mb-2 text-white">Post not found</h3>
              <p className="text-gray-400">
                {fetchError || "The post you're looking for doesn't exist or may have been removed."}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <AuthNavbar />

      <div className="pt-28 max-w-7xl mx-auto px-6 pb-12">
        <button
          onClick={handleBack}
          className="inline-flex items-center space-x-2 mb-8 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:border-gray-600/60 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        <PostDetail post={currentPost} />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">
              More from this {activeTab === "availability" ? "Artist" : "Client"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.slice(0, 3).map((post) => (
                <SimplePostCard key={post.id || post.jobId} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostDetailPage
