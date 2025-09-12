"use client"

import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import HoverOverlay from "../../../components/common/HoverOverlay"
import SectionHeader from "../../../components/common/SectionHeader"
import Loader from '../../../components/ui/Loader'
import { fetchCategories } from "../../../store/slices/categoriesSlice"
import { fetchJobPosts } from "../../../store/slices/postsSlice"

export default function FreelancingOpportunitiesSection({ customImages, titleRef }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // Get data from Redux store
  const { 
    jobPosts, 
    jobPostsLoading, 
    jobPostsError 
  } = useSelector((state) => state.posts)
  
  const { 
    categories, 
    loading: categoriesLoading 
  } = useSelector((state) => state.categories)

  useEffect(() => {
    // Fetch both job posts and categories when component mounts
    // Fetch more posts to ensure we have posts from different categories
    dispatch(fetchJobPosts({ limit: 50, isActive: true }))
    dispatch(fetchCategories())
    
    // Run attachment parsing tests in development
    const testCases = [
      { attachment: "https://example.com/image.jpg", expected: ["https://example.com/image.jpg"] },
      { attachment: [{ url: "https://example.com/image2.jpg" }], expected: ["https://example.com/image2.jpg"] },
      { attachment: '[{"url": "https://example.com/image3.jpg"}]', expected: ["https://example.com/image3.jpg"] },
      { attachment: [{ src: "https://example.com/image4.jpg" }], expected: ["https://example.com/image4.jpg"] },
      { attachment: null, expected: [] }
    ]
    
    testCases.forEach((test, index) => {
      const result = getImageUrls(test.attachment)
      console.log(`Attachment Test ${index + 1}:`, {
        input: test.attachment,
        expected: test.expected,
        result: result,
        passed: JSON.stringify(result) === JSON.stringify(test.expected)
      })
    })
  }, [dispatch])

  // Extract image URLs from attachments
  const getImageUrls = (attachments) => {
    if (!attachments) return []
    
    // Handle both array and single attachment formats
    const attachmentArray = Array.isArray(attachments) ? attachments : [attachments]
    
    return attachmentArray
      .map((att) => {
        if (typeof att === "string") {
          // Direct URL string - ensure it's a valid URL
          return att.trim()
        } else if (att && typeof att === "object") {
          // Object with url, src, path, or link properties
          const url = att.url || att.src || att.path || att.link
          return url ? url.trim() : null
        }
        return null
      })
      .filter(Boolean)
      .filter(url => {
        // Basic URL validation - check if it starts with http/https or is a relative path
        return url.startsWith('http') || url.startsWith('/') || url.startsWith('./') || url.startsWith('../')
      })
  }

  // Create category mapping from job posts
  const getCategoryData = () => {
    if (!categories || categories.length === 0) {
      // Fallback categories if no categories from API
      return [
        { categoryId: 1, name: 'Logo Design', color: '#A95BAB', image: null },
        { categoryId: 2, name: 'Graphic Design', color: '#3F51B5', image: null },
        { categoryId: 3, name: '3D Modeling', color: '#00BCD4', image: null },
        { categoryId: 4, name: 'Illustration', color: '#4CAF50', image: null },
        { categoryId: 5, name: 'Photography', color: '#FF9800', image: null },
        { categoryId: 6, name: 'Branding', color: '#E91E63', image: null },
        { categoryId: 7, name: 'Web Design', color: '#9C27B0', image: null },
        { categoryId: 8, name: 'UI/UX Design', color: '#FF5722', image: null },
      ]
    }

    // Use first 8 categories from the API and find random post images for each
    const colors = ['#A95BAB', '#3F51B5', '#00BCD4', '#4CAF50', '#FF9800', '#E91E63', '#9C27B0', '#FF5722']
    
    return categories.slice(0, 8).map((category, index) => {
      // Find posts for this category
      const categoryPosts = jobPosts?.filter(post => post.categoryId === category.categoryId) || []
      
      // Debug logging
      console.log(`Category ${category.name} (ID: ${category.categoryId}): ${categoryPosts.length} posts found`)
      
      // Get a random post image from this category
      let randomImage = null
      if (categoryPosts.length > 0) {
        const randomPost = categoryPosts[Math.floor(Math.random() * categoryPosts.length)]
        console.log(`Random post for ${category.name}:`, {
          title: randomPost.title,
          attachment: randomPost.attachment,
          attachments: randomPost.attachments
        })
        
        // Use the improved getImageUrls function to extract attachment URLs
        const attachments = randomPost.attachment || randomPost.attachments || randomPost.images
        if (attachments) {
          let parsedAttachments = attachments
          
          // Handle string JSON attachments
          if (typeof attachments === 'string') {
            try {
              parsedAttachments = JSON.parse(attachments)
              console.log(`Parsed attachment JSON for ${category.name}:`, parsedAttachments)
            } catch (e) {
              console.warn(`Failed to parse attachment JSON for ${category.name}:`, e)
              // If JSON parsing fails, treat as direct URL string
              parsedAttachments = [attachments]
            }
          }
          
          const imageUrls = getImageUrls(parsedAttachments)
          if (imageUrls.length > 0) {
            randomImage = imageUrls[0]
            console.log(`Image found for ${category.name}:`, randomImage)
          } else {
            console.log(`No valid image URLs found for ${category.name}`, parsedAttachments)
          }
        } else {
          console.log(`No attachments found for ${category.name}`)
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

  const buildMasonryGrid = () => {
    // Show loading state
    if (jobPostsLoading || categoriesLoading) {
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
    if (jobPostsError) {
      return (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">Failed to load freelancing opportunities</p>
          <button 
            onClick={() => {
              dispatch(fetchJobPosts({ limit: 50, isActive: true }))
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
        {categoryData.map((artwork, index) => {
          const hasCustomImage = customImages && index < customImages.length && customImages[index]
          const hasPostImage = artwork.image
          
          // Debug logging for image selection
          console.log(`Rendering ${artwork.name}:`, {
            hasCustomImage: !!hasCustomImage,
            hasPostImage: !!hasPostImage,
            customImage: hasCustomImage,
            postImage: hasPostImage
          })
          
          return (
            <div 
              key={artwork.categoryId || index} 
              className="relative rounded-xl overflow-hidden group cursor-pointer"
              onClick={() => {
                // Navigate to marketplace with category filter for jobs
                navigate(`/marketplace?category=${encodeURIComponent(artwork.name)}&section=jobs`)
              }}
            >
              {hasCustomImage ? (
                <div className="relative">
                  <img
                    src={customImages[index]}
                    alt={artwork.name}
                    className="w-full h-48 object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    loading="lazy"
                    onLoad={() => {
                      console.log(`Successfully loaded custom image for ${artwork.name}:`, customImages[index])
                    }}
                    onError={(e) => {
                      // Fallback to color block if image fails to load
                      console.warn(`Failed to load custom image for ${artwork.name}:`, customImages[index])
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div 
                    className="w-full h-48 bg-center bg-cover hidden items-center justify-center"
                    style={{ backgroundColor: artwork.color }}
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
                    alt={artwork.name}
                    className="w-full h-48 object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    loading="lazy"
                    onLoad={() => {
                      console.log(`Successfully loaded image for ${artwork.name}:`, hasPostImage)
                    }}
                    onError={(e) => {
                      // Fallback to color block if image fails to load
                      console.warn(`Failed to load post image for ${artwork.name}:`, hasPostImage)
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div 
                    className="w-full h-48 bg-center bg-cover hidden items-center justify-center"
                    style={{ backgroundColor: artwork.color }}
                  >
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  {/* Gradient overlay for post images */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              ) : (
                <div 
                  className="w-full h-48 flex items-center justify-center"
                  style={{ backgroundColor: artwork.color }}
                >
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              <HoverOverlay label={artwork.name} />
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
          <SectionHeader title="Freelancing Opportunities" titleRef={titleRef} />
          <button
            onClick={() => navigate('/marketplace?section=jobs')}
            className="text-[#A95BAB] hover:text-[#A95BAB]/80 font-medium text-sm transition-colors"
          >
            See All →
          </button>
        </div>
        <div className="mt-16">
          {buildMasonryGrid()}
        </div>
      </div>
    </section>
  )
}
