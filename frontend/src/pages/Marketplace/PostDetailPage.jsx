"use client"

import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hook/useRedux"
import { fetchPostById, clearCurrentPost } from "../../store/slices/marketplaceSlice"
import PostDetail from "../../components/marketplace/PostDetail"
import MarketplaceNav from "../../components/marketplace/MarketplaceNav"

const PostDetailPage = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentPost, loading, error } = useAppSelector((state) => state.marketplace)

  useEffect(() => {
    if (postId) {
      dispatch(fetchPostById(postId))
    }

    return () => {
      dispatch(clearCurrentPost())
    }
  }, [dispatch, postId])

  const handleBack = () => {
    navigate("/marketplace")
  }

  if (loading) {
    return (
      <div className="post-detail-page">
        <MarketplaceNav />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading post details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="post-detail-page">
        <MarketplaceNav />
        <div className="error-container">
          <p>Error loading post: {error}</p>
          <button onClick={() => dispatch(fetchPostById(postId))} className="retry-btn">
            Try Again
          </button>
          <button onClick={handleBack} className="back-btn">
            Back to Marketplace
          </button>
        </div>
      </div>
    )
  }

  if (!currentPost) {
    return (
      <div className="post-detail-page">
        <MarketplaceNav />
        <div className="error-container">
          <p>Post not found</p>
          <button onClick={handleBack} className="back-btn">
            Back to Marketplace
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="post-detail-page">
      <MarketplaceNav />
      <button onClick={handleBack} className="back-button">
        ← Back
      </button>
      <PostDetail post={currentPost} />
    </div>
  )
}

export default PostDetailPage
