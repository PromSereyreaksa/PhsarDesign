"use client"

import Loader from "../ui/Loader"

const MyPostsDashboard = ({ posts, loading, error, onEdit, onDelete, onView, deleteConfirm, onCancelDelete }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6">
        <Loader />
        <p className="text-gray-600 mt-4">Loading your posts...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 px-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">Error loading posts: {error}</p>
        </div>
      </div>
    )
  }

  const formatPrice = (min, max) => {
    if (min && max) {
      return `$${min}-$${max}`
    } else if (min) {
      return `From $${min}`
    } else if (max) {
      return `Up to $${max}`
    }
    return "Price negotiable"
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#4caf50"
      case "paused":
        return "#ff9800"
      case "completed":
        return "#2196f3"
      default:
        return "#757575"
    }
  }

  // Calculate stats
  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0)
  const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0)
  const totalResponses = posts.reduce((sum, post) => sum + (post.responses || 0), 0)
  const activePosts = posts.filter((post) => post.status === "active" || !post.status).length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">📊</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{posts.length}</h3>
              <p className="text-sm text-gray-600">Total Posts</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">✅</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{activePosts}</h3>
              <p className="text-sm text-gray-600">Active Posts</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">👁</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{totalViews}</h3>
              <p className="text-sm text-gray-600">Total Views</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">💬</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{totalResponses}</h3>
              <p className="text-sm text-gray-600">Responses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="mt-8">
        {posts.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="text-6xl mb-4">👑</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600">Create your first availability post to start connecting with clients.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.jobId} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-gray-900 truncate">{post.title}</h4>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className="text-sm font-medium text-[#A95BAB]">{formatPrice(post.budgetMin, post.budgetMax)}</span>
                        <span 
                          className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{ 
                            backgroundColor: `${getStatusColor(post.status || "active")}20`,
                            color: getStatusColor(post.status || "active")
                          }}
                        >
                          {post.status || "Active"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 ml-3">
                      <button 
                        onClick={() => onView(post.jobId)} 
                        className="p-2 text-gray-500 hover:text-[#A95BAB] hover:bg-gray-50 rounded-lg transition-colors" 
                        title="View"
                      >
                        👁
                      </button>
                      <button 
                        onClick={() => onEdit(post.jobId)} 
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors" 
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete(post.jobId)}
                        className={`p-2 rounded-lg transition-colors ${
                          deleteConfirm === post.jobId 
                            ? "text-red-600 bg-red-50" 
                            : "text-gray-500 hover:text-red-600 hover:bg-gray-50"
                        }`}
                        title={deleteConfirm === post.jobId ? "Click again to confirm" : "Delete"}
                      >
                        {deleteConfirm === post.jobId ? "✓" : "🗑"}
                      </button>
                      {deleteConfirm === post.jobId && (
                        <button 
                          onClick={onCancelDelete} 
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" 
                          title="Cancel"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {post.description?.substring(0, 150)}
                      {post.description?.length > 150 && "..."}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {(post.skills || []).slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                          {skill}
                        </span>
                      ))}
                      {post.skills?.length > 3 && (
                        <span className="px-2 py-1 bg-[#A95BAB] text-white text-xs rounded-md">
                          +{post.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <span>👁</span>
                        <span>{post.views || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>❤️</span>
                        <span>{post.likes || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>💬</span>
                        <span>{post.responses || 0}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Recently"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyPostsDashboard
