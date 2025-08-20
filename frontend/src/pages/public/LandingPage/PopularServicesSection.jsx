"use client"

import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import HoverOverlay from "../../../components/common/HoverOverlay"
import SectionHeader from "../../../components/common/SectionHeader"
import Loader from '../../../components/ui/Loader'
import { clearError, fetchCategories, fetchPosts } from "../../../store/slices/postsSlice"

export default function PopularServicesSection({ customImages }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // Get data from Redux store
  const { 
    posts, 
    categories, 
    loading, 
    error,
    categoriesLoading 
  } = useSelector((state) => state.posts)

  // Create dynamic category mapping from categories array
  const getCategoryName = (categoryId) => {
    // Try to use dynamic categories first
    if (categories && Array.isArray(categories) && categories.length > 0) {
      const category = categories.find(cat => cat.id === categoryId || cat.categoryId === categoryId);
      if (category) {
        return category.name || category.categoryName;
      }
    }
    
    // Fallback category mapping only as last resort
    const fallbackCategories = {
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
    };
    
    if (fallbackCategories[categoryId]) {
      return fallbackCategories[categoryId];
    }
    
    return 'Other';
  }

  useEffect(() => {
    // Fetch both posts and categories when component mounts
    dispatch(fetchPosts())
    dispatch(fetchCategories())

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading || categoriesLoading) {
        console.error('Loading timeout - API calls took too long');
      }
    }, 10000) // 10 second timeout

    return () => clearTimeout(timeout)
  }, [dispatch])

  // Add debugging for posts as well
  useEffect(() => {
    console.log('Posts from Redux:', posts);
    console.log('Categories from Redux:', categories);
    console.log('Loading states:', { loading, categoriesLoading, error });
    
    // If we've been loading for too long, show mock data
    const mockTimeout = setTimeout(() => {
      if ((loading || categoriesLoading) && (!posts || posts.length === 0)) {
        console.warn('Loading taking too long, consider showing fallback content');
      }
    }, 5000)
    
    return () => clearTimeout(mockTimeout)
  }, [posts, categories, loading, categoriesLoading, error])

  const handleRetry = () => {
    dispatch(clearError())
    dispatch(fetchPosts())
    dispatch(fetchCategories())
  }

  const buildServiceGrid = () => {
    console.log('BuildServiceGrid - Loading states:', { loading, categoriesLoading, error });
    console.log('Posts length:', posts?.length || 0);
    
    // Show loading state - but with timeout to prevent infinite loading
    if (loading || categoriesLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader />
          <p className="text-gray-400 mt-4">Loading services...</p>
        </div>
      )
    }

    // Show error state
    if (error) {
      console.error('Error in buildServiceGrid:', error);
      return (
        <div className="text-center py-12">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={handleRetry}
            className="mt-4 px-6 py-2 bg-[#A95BAB] text-white rounded-lg hover:bg-[#A95BAB]/80 transition-colors"
          >
            Try Again
          </button>
        </div>
      )
    }

    // Show empty state
    if (!posts || posts.length === 0) {
      console.log('No posts found, showing empty state');
      return (
        <div className="text-center py-12">
          <p className="text-gray-400">No services available at the moment.</p>
          <button 
            onClick={handleRetry}
            className="mt-4 px-6 py-2 bg-[#A95BAB] text-white rounded-lg hover:bg-[#A95BAB]/80 transition-colors"
          >
            Retry
          </button>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.slice(0, 8).map((post, index) => {
          const categoryName = getCategoryName(post.categoryId)
          
          // Get image URL from API attachments
          let apiImageUrl = null;
          if (post.attachments && Array.isArray(post.attachments) && post.attachments.length > 0) {
            // Handle different attachment structures
            const attachment = post.attachments[0];
            if (typeof attachment === 'string') {
              // If attachment is directly a URL string
              apiImageUrl = attachment;
            } else if (attachment && typeof attachment === 'object') {
              // If attachment is an object, try common URL properties
              apiImageUrl = attachment.url || attachment.src || attachment.path || attachment.link;
            }
          }
          
          // Fallback images only if API image is not available
          const fallbackImages = [
            '/image/Service1.jpg',
            '/image/Service2.jpg', 
            '/image/Service3.jpg',
            '/image/Service4.jpg',
            '/image/Artist1.jpg',
            '/image/Artist2.jpg',
            '/image/Artist3.jpg',
            '/image/Artist4.jpg'
          ];
          
          // Prioritize API image, fallback to static images
          const displayImage = apiImageUrl || fallbackImages[index % fallbackImages.length];
          
          console.log(`Rendering post ${index}:`, {
            postId: post.postId,
            categoryId: post.categoryId,
            categoryName,
            apiImageUrl,
            displayImage,
            hasPhotos: post.photos?.length || 0
          });
          
          return (
            <div 
              key={post.postId || index} 
              className="relative rounded-xl overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                // Navigate to marketplace with category filter
                navigate(`/marketplace?category=${encodeURIComponent(categoryName)}&section=services`)
              }}
            >
              <img
                src={displayImage}
                alt={categoryName}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                onLoad={() => console.log(`✓ Image ${index} loaded successfully:`, displayImage)}
                onError={(e) => {
                  console.error(`✗ Image ${index} failed to load:`, displayImage);
                  // If API image fails, try fallback
                  if (apiImageUrl && e.target.src === apiImageUrl) {
                    console.log(`Falling back to static image for post ${index}`);
                    e.target.src = fallbackImages[index % fallbackImages.length];
                  } else {
                    // If even fallback fails, try a different one
                    const altIndex = (index + 1) % fallbackImages.length;
                    e.target.src = fallbackImages[altIndex];
                  }
                }}
              />
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
