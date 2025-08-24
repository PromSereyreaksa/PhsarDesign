"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AuthNavbar from "../../components/layout/AuthNavbar"
import EditPostForm from "../../components/marketplace/EditPostForm"
import Loader from "../../components/ui/Loader"
import { useAppDispatch, useAppSelector } from "../../hook/useRedux"
import { clearCurrentPost, fetchPostById, updatePost } from "../../store/slices/marketplaceSlice"

const EditPostPage = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentPost, loading, error } = useAppSelector((state) => state.marketplace)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Debug logging at component level
  console.log('EditPostPage render - postId:', postId)
  console.log('EditPostPage render - all useParams():', { postId })
  console.log('EditPostPage render - window.location:', window.location.href)

  useEffect(() => {
    console.log('EditPostPage useEffect - postId:', postId)
    console.log('EditPostPage useEffect - typeof postId:', typeof postId)
    console.log('EditPostPage useEffect - postId === undefined:', postId === undefined)
    console.log('EditPostPage useEffect - postId === "undefined":', postId === "undefined")
    console.log('Current location:', window.location.href)
    
    if (postId && postId !== 'undefined') {
      console.log('EditPostPage dispatching fetchPostById with:', { postId, postType: "auto" })
      dispatch(fetchPostById({ postId, postType: "auto" }))
    } else {
      console.error('Invalid postId in EditPostPage:', postId)
      console.error('PostId validation failed - not dispatching fetchPostById')
    }

    return () => {
      dispatch(clearCurrentPost())
    }
  }, [dispatch, postId])

  const handleSubmit = async (postData) => {
    setIsSubmitting(true)
    try {
      await dispatch(updatePost({ 
        postId, 
        postData, 
        postType: currentPost.postType || "job" 
      })).unwrap()
      alert("Post updated successfully!")
      navigate("/profile")
    } catch (error) {
      alert(`Failed to update post: ${error}`)
      console.error("Update post error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate("/profile")
  }

  if (loading) {
    return (
      <div className="edit-post-page">
        <AuthNavbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader />
        </div>
      </div>
    )
  }

  if (error || !currentPost) {
    return (
      <div className="edit-post-page">
        <AuthNavbar />
        <div className="error-container p-8">
          <p className="text-red-600 mb-4">Error loading post: {error || "Post not found"}</p>
          
          <div className="bg-gray-100 p-4 rounded mb-4">
            <h3 className="font-bold mb-2">Debug Information:</h3>
            <p><strong>PostId from URL:</strong> {postId || 'undefined'}</p>
            <p><strong>Current URL:</strong> {window.location.href}</p>
            <p><strong>Error:</strong> {error ? String(error) : 'No error'}</p>
            <p><strong>Current Post:</strong> {currentPost ? 'Exists' : 'Null/Undefined'}</p>
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          </div>
          
          <button onClick={handleCancel} className="back-btn bg-blue-500 text-white px-4 py-2 rounded">
            Back to Profile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="edit-post-page">
      <AuthNavbar />

      <div className="page-header">
        <button onClick={handleCancel} className="back-button">
          ← Back to My Posts
        </button>
        <h1>Edit Post</h1>
        <p>Update your job post information</p>
      </div>

      <EditPostForm
        initialData={currentPost}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

export default EditPostPage
