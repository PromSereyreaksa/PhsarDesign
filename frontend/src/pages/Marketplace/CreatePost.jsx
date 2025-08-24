"use client"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import AuthNavbar from "../../components/layout/AuthNavbar"
import CreateJobPostForm from "../../components/marketplace/CreateJobPostForm"
import CreatePostForm from "../../components/marketplace/CreatePostForm"
import { useAppDispatch } from "../../hook/useRedux"
import { createPost } from "../../store/slices/marketplaceSlice"

const CreatePostPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isJobPost = location.pathname === "/marketplace/create-job"

  const handleSubmit = async (postData) => {
    console.log("=== POST DATA BEING SUBMITTED ===")
    console.log("postData type:", typeof postData)
    
    // If it's FormData, log the entries
    if (postData instanceof FormData) {
      console.log("FormData entries:")
      for (let [key, value] of postData.entries()) {
        console.log(key, value)
      }
    } else {
      console.log(JSON.stringify(postData, null, 2))
    }

    setIsSubmitting(true)
    try {
      const result = await dispatch(createPost(postData)).unwrap()
      console.log("=== POST CREATION SUCCESS ===")
      console.log(result)

      alert("Post created successfully!")
      navigate("/marketplace")
    } catch (error) {
      console.error("=== POST CREATION ERROR ===")
      console.error("Error object:", error)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)

      // More detailed error message
      const errorMessage = error.message || error.error || "Unknown error occurred"
      alert(`Failed to create post: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate("/marketplace")
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
                {isJobPost ? "Post a Job" : "Create New Post"}
              </span>
            </h1>
            <p className="text-xl text-gray-300">
              {isJobPost
                ? "Find talented artists for your project"
                : "Share your availability and connect with potential clients"}
            </p>
          </div>
        </div>
        
        {/* Use the correct form component based on post type */}
        {isJobPost ? (
          <CreateJobPostForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        ) : (
          <CreatePostForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            postType="service"
          />
        )}
      </div>
    </div>
  )
}

export default CreatePostPage