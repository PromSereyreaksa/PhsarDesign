"use client"

import { useState, useEffect } from "react"
import SectionHeader from "../../components/common/SectionHeader"
import HoverOverlay from "../../components/common/HoverOverlay"
import { availabilityPostsAPI } from "../../services/api"

export default function PopularServicesSection({ customImages }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Category mapping for display names
  const categoryMap = {
    1: 'Graphic Design',
    2: 'Web Design', 
    3: 'Mobile Apps',
    4: 'UI/UX Design',
    5: 'Logo Design',
    6: '3D Modeling',
    7: 'Digital Art',
    8: 'Photography',
    9: 'Illustration',
    10: 'Animation',
    11: 'Branding',
    12: 'Print Design'
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await availabilityPostsAPI.getAll({ 
        limit: 8, // Limit to 8 posts as requested
        isActive: true 
      })
      console.log('API Response:', response.data) // Debug log
      setPosts(response.data.posts || response.data || [])
    } catch (err) {
      console.error('Error fetching posts:', err)
      setError('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const buildServiceGrid = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="relative rounded-xl overflow-hidden bg-gray-800 animate-pulse">
              <div className="w-full h-48 bg-gray-700"></div>
            </div>
          ))}
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={fetchPosts}
            className="mt-4 px-6 py-2 bg-[#A95BAB] text-white rounded-lg hover:bg-[#A95BAB]/80 transition-colors"
          >
            Try Again
          </button>
        </div>
      )
    }

    if (posts.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-400">No services available at the moment.</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.slice(0, 8).map((post, index) => {
          const categoryName = categoryMap[post.categoryId] || 'Other'
          const imageUrl = post.photos && post.photos.length > 0 ? post.photos[0].url : null
          
          console.log('Post:', post.postId, 'Image URL:', imageUrl) // Debug log
          
          return (
            <div key={post.postId} className="relative rounded-xl overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-500 ease-out">
              {imageUrl ? (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt={categoryName}
                    className="w-full h-48 object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    onLoad={() => console.log('Image loaded successfully:', imageUrl)}
                    onError={(e) => {
                      console.error('Image failed to load:', imageUrl, e)
                      // Fallback to placeholder if image fails to load
                      e.target.style.display = 'none'
                      const fallback = e.target.nextSibling
                      if (fallback) fallback.style.display = 'flex'
                    }}
                    crossOrigin="anonymous"
                    loading="lazy"
                  />
                  <div 
                    className="w-full h-48 bg-gradient-to-br from-[#A95BAB] to-[#3F51B5] hidden items-center justify-center"
                  >
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="ml-2 text-white text-sm">Image unavailable</span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-[#A95BAB] to-[#3F51B5] flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="ml-2 text-white text-sm">No image</span>
                </div>
              )}
              
              <HoverOverlay label={categoryName} />
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Popular Services" />
        <div className="mt-16">
          {buildServiceGrid()}
        </div>
      </div>
    </section>
  )
}
