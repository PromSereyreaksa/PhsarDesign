"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hook/useRedux"
import { fetchPostById, updatePost, clearCurrentPost } from "../../store/slices/marketplaceSlice"
import EditPostForm from "../../components/marketplace/EditPostForm"
import MarketplaceNav from "../../components/marketplace/MarketplaceNav"
import Loader from "../../components/ui/Loader"

const EditPostPage = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentPost, loading, error } = useAppSelector((state) => state.marketplace)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (jobId) {
      dispatch(fetchPostById(jobId))
    }

    return () => {
      dispatch(clearCurrentPost())
    }
  }, [dispatch, jobId])

  const handleSubmit = async (postData) => {
    setIsSubmitting(true)
    try {
      await dispatch(updatePost({ jobId, postData })).unwrap()
      alert("Post updated successfully!")
      navigate("/dashboard/my-posts")
    } catch (error) {
      alert(`Failed to update post: ${error}`)
      console.error("Update post error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate("/dashboard/my-posts")
  }

  if (loading) {
    return (
      <div className="edit-post-page">
        <MarketplaceNav />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader />
        </div>
      </div>
    )
  }

  if (error || !currentPost) {
    return (
      <div className="edit-post-page">
        <MarketplaceNav />
        <div className="error-container">
          <p>Error loading post: {error || "Post not found"}</p>
          <button onClick={handleCancel} className="back-btn">
            Back to My Posts
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="edit-post-page">
      <MarketplaceNav />

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
