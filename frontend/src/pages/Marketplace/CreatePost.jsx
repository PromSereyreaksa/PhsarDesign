"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../hook/useRedux"
import { createPost } from "../../store/slices/marketplaceSlice"
import CreatePostForm from "../../components/marketplace/CreatePostForm"
import MarketplaceNav from "../../components/marketplace/MarketplaceNav"

const CreatePostPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (postData) => {
    setIsSubmitting(true)
    try {
      await dispatch(createPost(postData)).unwrap()
      alert("Post created successfully!")
      navigate("/marketplace")
    } catch (error) {
      alert("Failed to create post. Please try again.")
      console.error("Create post error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate("/marketplace")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <MarketplaceNav />

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
                Create New Post
              </span>
            </h1>
            <p className="text-xl text-gray-300">Share your availability and connect with potential clients</p>
          </div>
        </div>

        <CreatePostForm onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isSubmitting} />
      </div>
    </div>
  )
}

export default CreatePostPage
