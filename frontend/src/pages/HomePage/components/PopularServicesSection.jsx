"use client"

import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import HoverOverlay from "../../../components/common/HoverOverlay"
import SectionHeader from "../../../components/common/SectionHeader"
import Loader from '../../../components/ui/Loader'
import { fetchCategories } from "../../../store/slices/categoriesSlice"
import { fetchAvailabilityPosts } from "../../../store/slices/postsSlice"

export default function PopularServicesSection({ customImages }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // Get data from Redux store
  const { 
    availabilityPosts, 
    availabilityPostsLoading, 
    availabilityPostsError 
  } = useSelector((state) => state.posts)
  
  const { 
    categories, 
    loading: categoriesLoading 
  } = useSelector((state) => state.categories)

  useEffect(() => {
    // Fetch both availability posts and categories when component mounts
    // Fetch more posts to ensure we have posts from different categories
    dispatch(fetchAvailabilityPosts({ limit: 50, isActive: true }))
    dispatch(fetchCategories())
  }, [dispatch])

  // Create category mapping from availability posts
  const getCategoryData = () => {
    if (!categories || categories.length === 0) {
      // Fallback categories if no categories from API
      return [
        { categoryId: 1, name: 'Graphic Design', color: '#A95BAB', image: null },
        { categoryId: 2, name: 'Web Design', color: '#3F51B5', image: null },
        { categoryId: 3, name: 'Mobile Apps', color: '#00BCD4', image: null },
        { categoryId: 4, name: 'UI/UX Design', color: '#4CAF50', image: null },
        { categoryId: 5, name: 'Photography', color: '#FF9800', image: null },
        { categoryId: 6, name: 'Branding', color: '#E91E63', image: null },
        { categoryId: 7, name: 'Animation', color: '#9C27B0', image: null },
        { categoryId: 8, name: 'Video Editing', color: '#FF5722', image: null },
      ]
    }

    // Use first 8 categories from the API and find random post images for each
    const colors = ['#A95BAB', '#3F51B5', '#00BCD4', '#4CAF50', '#FF9800', '#E91E63', '#9C27B0', '#FF5722']
    
    return categories.slice(0, 8).map((category, index) => {
      // Find posts for this category
      const categoryPosts = availabilityPosts?.filter(post => post.categoryId === category.categoryId) || []
      
      // Debug logging
      console.log(`Category ${category.name} (ID: ${category.categoryId}): ${categoryPosts.length} posts found`)
      
      // Get a random post image from this category
      let randomImage = null
      if (categoryPosts.length > 0) {
        const randomPost = categoryPosts[Math.floor(Math.random() * categoryPosts.length)]
        console.log(`Random post for ${category.name}:`, randomPost)
        
        if (randomPost.attachments && randomPost.attachments.length > 0) {
          // Get first attachment URL
          const attachments = typeof randomPost.attachments === 'string' 
            ? JSON.parse(randomPost.attachments) 
            : randomPost.attachments
          if (Array.isArray(attachments) && attachments.length > 0) {
            randomImage = attachments[0].url || attachments[0]
            console.log(`Image found for ${category.name}:`, randomImage)
          }
        }
      } else {
        console.log(`No posts found for category ${category.name}`)
      }
      
      return {
        categoryId: category.categoryId,
        name: category.name,
        color: colors[index % colors.length],
        image: randomImage
      }
    })
  }

  const buildServiceGrid = () => {
    // Show loading state
    if (availabilityPostsLoading || categoriesLoading) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
            <div key={index} className="relative rounded-xl overflow-hidden">
              <div className="w-full h-48 bg-gray-700/50 flex items-center justify-center">
                <Loader />
              </div>
            </div>
          ))}
        </div>
      )
    }

    // Show error state
    if (availabilityPostsError) {
      return (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">Failed to load popular services</p>
          <button 
            onClick={() => {
              dispatch(fetchAvailabilityPosts({ limit: 50, isActive: true }))
              dispatch(fetchCategories())
            }}
            className="text-[#A95BAB] hover:text-[#A95BAB]/80 transition-colors"
          >
            Try Again
          </button>
        </div>
      )
    }

    const categoryData = getCategoryData()

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categoryData.map((category, index) => {
          const hasCustomImage = customImages && index < customImages.length && customImages[index]
          const hasPostImage = category.image
          
          return (
            <div 
              key={category.categoryId || index} 
              className="relative rounded-xl overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                // Navigate to marketplace with category filter
                navigate(`/marketplace?category=${encodeURIComponent(category.name)}&section=services`)
              }}
            >
              {hasCustomImage ? (
                <div className="relative">
                  <img
                    src={customImages[index]}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback to color block if image fails to load
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div 
                    className="w-full h-48 bg-center bg-cover hidden items-center justify-center"
                    style={{ backgroundColor: category.color }}
                  >
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  {/* Gradient overlay for custom images */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              ) : hasPostImage ? (
                <div className="relative">
                  <img
                    src={hasPostImage}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback to color block if image fails to load
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div 
                    className="w-full h-48 bg-center bg-cover hidden items-center justify-center"
                    style={{ backgroundColor: category.color }}
                  >
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  {/* Gradient overlay for post images */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              ) : (
                <div 
                  className="w-full h-48 flex items-center justify-center"
                  style={{ backgroundColor: category.color }}
                >
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              <HoverOverlay label={category.name} />
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-16">
          <SectionHeader title="Popular Services" />
          <button
            onClick={() => navigate('/marketplace?section=services')}
            className="text-[#A95BAB] hover:text-[#A95BAB]/80 font-medium text-sm transition-colors"
          >
            See All →
          </button>
        </div>
        <div className="mt-16">
          {buildServiceGrid()}
        </div>
      </div>
    </section>
  )
}
