import { useEffect, useRef, useState } from 'react'

/**
 * OptimizedImage Component
 * 
 * Features:
 * - Lazy loading with intersection observer
 * - WebP/AVIF format support with fallbacks
 * - Preloading for above-the-fold images
 * - Fixed dimensions to prevent CLS
 * - Error handling and loading states
 */
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false, // Set true for above-the-fold images
  placeholder = 'blur', // 'blur' | 'empty'
  sizes = '100vw',
  quality = 75,
  loading = 'lazy',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState('')
  const imgRef = useRef(null)
  const [isInView, setIsInView] = useState(true) // Force loading for now to fix display issues

  // Generate optimized source URLs - Just return original for now
  const generateSources = (originalSrc) => {
    if (!originalSrc) return { original: originalSrc }
    
    // For now, just return the original URL without any transformations
    return {
      original: originalSrc
    }
  }

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!imgRef.current || priority || isInView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(entry.target)
        }
      },
      {
        rootMargin: '50px' // Start loading 50px before image comes into view
      }
    )

    observer.observe(imgRef.current)
    return () => observer.disconnect()
  }, [priority, isInView])

  // Preload critical images - simplified
  useEffect(() => {
    if (priority && src) {
      const sources = generateSources(src)
      
      // Create link elements for preloading
      const preloadLink = document.createElement('link')
      preloadLink.rel = 'preload'
      preloadLink.as = 'image'
      preloadLink.href = sources.original
      
      document.head.appendChild(preloadLink)
      
      // Cleanup
      return () => {
        if (document.head.contains(preloadLink)) {
          document.head.removeChild(preloadLink)
        }
      }
    }
  }, [priority, src])

  // Set current source when in view or immediately if priority
  useEffect(() => {
    if ((isInView || priority) && src && !currentSrc) {
      const sources = generateSources(src)
      setCurrentSrc(sources.original)
    }
  }, [isInView, priority, src, currentSrc])

  const handleLoad = (e) => {
    setIsLoaded(true)
    onLoad?.(e)
  }

  const handleError = (e) => {
    setIsError(true)
    onError?.(e)
  }

  // Placeholder while loading
  const renderPlaceholder = () => {
    if (placeholder === 'empty') return null
    
    return (
      <div 
        className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300"
        style={{ width, height }}
      />
    )
  }

  // Error state
  if (isError) {
    return (
      <div 
        ref={imgRef}
        className={`bg-gray-200 flex items-center justify-center text-gray-500 ${className}`}
        style={{ width, height }}
        {...props}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    )
  }

  const sources = generateSources(currentSrc)

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {!isLoaded && renderPlaceholder()}
      
      {(isInView || priority) && currentSrc && (
        <img
          src={sources.original}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          decoding="async"
          sizes={sizes}
          className={`
            transition-opacity duration-300 
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
            ${className}
          `}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          {...props}
        />
      )}
    </div>
  )
}

export default OptimizedImage
