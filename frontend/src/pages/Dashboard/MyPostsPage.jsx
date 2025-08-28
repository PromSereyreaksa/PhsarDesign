"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import MarketplaceNav from "../../components/marketplace/MarketplaceNav"
import MyPostsDashboard from "../../components/marketplace/MyPostsDashboard"
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux"
import { deletePost, fetchUserPosts } from "../../store/slices/marketplaceSlice"

const MyPostsPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { userPosts, loading, error } = useAppSelector((state) => state.marketplace)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    console.log('MyPostsPage - dispatching fetchUserPosts')
    dispatch(fetchUserPosts())
  }, [dispatch])

  // Debug effect to log userPosts when they change
  useEffect(() => {
    console.log('MyPostsPage - userPosts updated:', userPosts)
    if (userPosts && userPosts.length > 0) {
      console.log('First post structure:', userPosts[0])
      console.log('All post IDs:', userPosts.map(post => ({
        id: post.id,
        jobId: post.jobId,
        _id: post._id,
        postId: post.postId,
        extractedId: post.jobId || post.id || post._id || post.postId
      })))
    }
  }, [userPosts])

  const handleCreateNew = () => {
    // Route based on user role
    if (user?.role === 'client') {
      navigate("/marketplace/create?type=jobs")
    } else if (user?.role === 'artist' || user?.role === 'freelancer') {
      navigate("/marketplace/create?type=availability")
    } else {
      navigate("/marketplace/create")
    }
  }

  const handleEdit = (postId) => {
    console.log('MyPostsPage handleEdit called with postId:', postId)
    console.log('MyPostsPage handleEdit - typeof postId:', typeof postId)
    console.log('MyPostsPage handleEdit - postId === undefined:', postId === undefined)
    
    const targetUrl = `/marketplace/edit/${postId}`
    console.log('MyPostsPage handleEdit - Navigating to:', targetUrl)
    
    navigate(targetUrl)
  }

  const handleDelete = async (postId, postType) => {
    if (deleteConfirm === postId) {
      try {
        await dispatch(deletePost({ postId, postType })).unwrap()
        alert("Post deleted successfully!")
        setDeleteConfirm(null)
      } catch (error) {
        alert(`Failed to delete post: ${error}`)
        console.error("Delete post error:", error)
      }
    } else {
      setDeleteConfirm(postId)
    }
  }

  const handleView = (jobId) => {
    navigate(`/marketplace/${jobId}`)
  }

  return (
    <div className="my-posts-page">
      <MarketplaceNav />

      <div className="page-header">
        <div className="header-content">
          <h1>My Posts</h1>
          <p>Manage your availability posts and track their performance</p>
        </div>
        <button onClick={handleCreateNew} className="create-btn">
          + Create New Post
        </button>
      </div>

      <MyPostsDashboard
        posts={userPosts}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        deleteConfirm={deleteConfirm}
        onCancelDelete={() => setDeleteConfirm(null)}
      />
    </div>
  )
}

export default MyPostsPage
