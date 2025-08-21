"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hook/useRedux"
import { fetchUserPosts, deletePost } from "../../store/slices/marketplaceSlice"
import MyPostsDashboard from "../../components/marketplace/MyPostsDashboard"
import MarketplaceNav from "../../components/marketplace/MarketplaceNav"

const MyPostsPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { userPosts, loading, error } = useAppSelector((state) => state.marketplace)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    dispatch(fetchUserPosts())
  }, [dispatch])

  const handleCreateNew = () => {
    navigate("/marketplace/create")
  }

  const handleEdit = (jobId) => {
    navigate(`/marketplace/edit/${jobId}`)
  }

  const handleDelete = async (jobId) => {
    if (deleteConfirm === jobId) {
      try {
        await dispatch(deletePost(jobId)).unwrap()
        alert("Post deleted successfully!")
        setDeleteConfirm(null)
      } catch (error) {
        alert(`Failed to delete post: ${error}`)
        console.error("Delete post error:", error)
      }
    } else {
      setDeleteConfirm(jobId)
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
