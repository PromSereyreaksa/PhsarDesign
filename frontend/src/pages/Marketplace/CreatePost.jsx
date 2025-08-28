"use client"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import AuthNavbar from "../../components/layout/AuthNavbar"
import CreateAvailabilityPostForm from "../../components/marketplace/CreateAvailabilityPostForm"
import CreateJobPostForm from "../../components/marketplace/CreateJobPostForm"
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux"
import { createPost } from "../../store/slices/marketplaceSlice"

const CreatePostPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const urlParams = new URLSearchParams(location.search)
  const requestedPostType = urlParams.get("type") // "jobs" or "availability"
  const isJobPost = location.pathname === "/marketplace/create-job" || requestedPostType === "jobs"

  // RBAC Enforcement
  useEffect(() => {
    if (user) {
      // Redirect based on user role
      if (isJobPost && user.role !== 'client') {
        const showToast = async () => {
          const { showToast } = await import("../../components/ui/toast")
          showToast(`Access denied. Only clients can create job posts. Redirecting to availability posts...`, 'error')
        }
        showToast()
        // Redirect to availability post creation
        setTimeout(() => navigate("/marketplace/create-post?type=availability"), 2000)
        return
      }
      
      if (!isJobPost && user.role !== 'artist' && user.role !== 'freelancer') {
        const showToast = async () => {
          const { showToast } = await import("../../components/ui/toast")
          showToast(`Access denied. Only artists can create availability posts. Redirecting to job posts...`, 'error')
        }
        showToast()
        // Redirect to job post creation
        setTimeout(() => navigate("/marketplace/create-job?type=jobs"), 2000)
        return
      }
    }
  }, [user, isJobPost, navigate])

  const handleSubmit = async (postData) => {
    console.log("=== POST DATA BEING SUBMITTED ===")
    console.log("postData type:", typeof postData)
    console.log("User role:", user?.role)
    console.log("Is job post:", isJobPost)

    // If it's FormData, log the entries
    if (postData instanceof FormData) {
      console.log("FormData entries:")
      for (const [key, value] of postData.entries()) {
        console.log(key, value)
      }
    } else {
      console.log(JSON.stringify(postData, null, 2))
    }

    // Double-check RBAC before submission
    if (isJobPost && user?.role !== 'client') {
      const { showToast } = await import("../../components/ui/toast")
      showToast('Access denied. Only clients can create job posts.', 'error')
      return
    }
    
    if (!isJobPost && user?.role !== 'artist' && user?.role !== 'freelancer') {
      const { showToast } = await import("../../components/ui/toast")
      showToast('Access denied. Only artists can create availability posts.', 'error')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await dispatch(createPost(postData)).unwrap()
      console.log("=== POST CREATION SUCCESS ===")
      console.log(result)

      // Import and use showToast for success message
      const { showToast } = await import("../../components/ui/toast")
      showToast(
        `${isJobPost ? 'Job' : 'Availability'} post created successfully! Your post is now live in the marketplace.`,
        'success'
      )

      // Navigate to marketplace after successful creation
      navigate("/marketplace")
    } catch (error) {
      console.error("=== POST CREATION ERROR ===")
      console.error("Error object:", error)
      console.error("Error message:", error.message || error)

      // Import and use showToast for error message
      const { showToast } = await import("../../components/ui/toast")
      const errorMessage = typeof error === 'string' ? error : (error.message || error.error || "Unknown error occurred")
      showToast(
        `Failed to create ${isJobPost ? 'job' : 'availability'} post: ${errorMessage}`,
        'error'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate("/marketplace")
  }

  // Show loading state while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="max-w-4xl mx-auto px-6 pt-20 pb-8">
          <div className="text-center space-y-4">
            <div className="text-gray-300">Please log in to create posts...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <AuthNavbar />
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-8">
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center space-x-2 text-gray-300 hover:text-white mb-6 transition-colors group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Marketplace</span>
          </button>
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">
                {isJobPost ? "Post a Job" : "Create Availability Post"}
              </span>
            </h1>
            <p className="text-xl text-gray-300">
              {isJobPost
                ? "Find talented artists for your project"
                : "Share your availability and connect with potential clients"}
            </p>
            
            {/* Role indicator */}
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-800/50 border border-gray-600/50">
              <span className="w-2 h-2 bg-[#A95BAB] rounded-full mr-2"></span>
              <span className="text-gray-300">
                Logged in as: <span className="text-white capitalize">{user.role}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Use the correct form component based on post type and user role */}
        {isJobPost ? (
          <CreateJobPostForm 
            onSubmit={handleSubmit} 
            onCancel={handleCancel} 
            isSubmitting={isSubmitting} 
          />
        ) : (
          <CreateAvailabilityPostForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  )
}

export default CreatePostPage
