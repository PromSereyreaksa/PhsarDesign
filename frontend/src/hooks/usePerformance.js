import { useCallback, useEffect, useMemo, useRef } from 'react'

/**
 * Debounce hook for delaying function execution
 * Perfect for search inputs and API calls
 */
export const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null)
  
  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }, [callback, delay])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
  
  return debouncedCallback
}

/**
 * Throttle hook for limiting function execution frequency
 * Perfect for scroll and resize events
 */
export const useThrottle = (callback, delay) => {
  const lastCall = useRef(0)
  const timeoutRef = useRef(null)
  
  const throttledCallback = useCallback((...args) => {
    const now = Date.now()
    
    if (now - lastCall.current >= delay) {
      lastCall.current = now
      callback(...args)
    } else {
      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      // Set a timeout for the remaining time
      timeoutRef.current = setTimeout(() => {
        lastCall.current = Date.now()
        callback(...args)
      }, delay - (now - lastCall.current))
    }
  }, [callback, delay])
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
  
  return throttledCallback
}

/**
 * Hook for optimized scroll event handling
 */
export const useOptimizedScroll = (callback, options = {}) => {
  const { 
    delay = 100, 
    passive = true,
    throttle = true 
  } = options
  
  const optimizedCallback = throttle 
    ? useThrottle(callback, delay)
    : useDebounce(callback, delay)
  
  useEffect(() => {
    const handleScroll = optimizedCallback
    
    window.addEventListener('scroll', handleScroll, { passive })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [optimizedCallback, passive])
}

/**
 * Hook for optimized resize event handling
 */
export const useOptimizedResize = (callback, delay = 250) => {
  const throttledCallback = useThrottle(callback, delay)
  
  useEffect(() => {
    window.addEventListener('resize', throttledCallback, { passive: true })
    
    return () => {
      window.removeEventListener('resize', throttledCallback)
    }
  }, [throttledCallback])
}

/**
 * Intersection Observer hook for lazy loading and animations
 */
export const useIntersectionObserver = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true
  } = options
  
  const [isIntersecting, setIsIntersecting] = React.useState(false)
  const [element, setElement] = React.useState(null)
  
  useEffect(() => {
    if (!element) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting
        setIsIntersecting(inView)
        
        if (inView && triggerOnce) {
          observer.unobserve(element)
        }
      },
      { threshold, rootMargin }
    )
    
    observer.observe(element)
    
    return () => observer.disconnect()
  }, [element, threshold, rootMargin, triggerOnce])
  
  return [setElement, isIntersecting]
}

/**
 * Performance monitoring utilities
 */
export const performanceUtils = {
  // Measure function execution time
  measureTime: (fn, label = 'Function') => {
    return (...args) => {
      const start = performance.now()
      const result = fn(...args)
      const end = performance.now()
      console.log(`${label} took ${(end - start).toFixed(2)} milliseconds`)
      return result
    }
  },
  
  // Measure component render time
  measureRender: (WrappedComponent, displayName) => {
    return React.memo((props) => {
      const start = performance.now()
      
      useEffect(() => {
        const end = performance.now()
        console.log(`${displayName} render took ${(end - start).toFixed(2)} milliseconds`)
      })
      
      return <WrappedComponent {...props} />
    })
  },
  
  // Report Core Web Vitals
  reportWebVitals: () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // LCP
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log('LCP:', lastEntry.startTime)
      }).observe({ entryTypes: ['largest-contentful-paint'] })
      
      // FID (replaced by INP)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach(entry => {
          console.log('FID:', entry.processingStart - entry.startTime)
        })
      }).observe({ entryTypes: ['first-input'] })
      
      // CLS
      let cumulativeLayoutShiftScore = 0
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            cumulativeLayoutShiftScore += entry.value
          }
        })
        console.log('CLS:', cumulativeLayoutShiftScore)
      }).observe({ entryTypes: ['layout-shift'] })
    }
  }
}

/**
 * Virtual scrolling hook for large lists
 */
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = React.useState(0)
  
  const visibleItems = useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(startIndex + visibleCount, items.length)
    
    return {
      items: items.slice(startIndex, endIndex),
      startIndex,
      offsetY: startIndex * itemHeight
    }
  }, [items, itemHeight, containerHeight, scrollTop])
  
  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop)
  }, [])
  
  return {
    visibleItems: visibleItems.items,
    startIndex: visibleItems.startIndex,
    offsetY: visibleItems.offsetY,
    totalHeight: items.length * itemHeight,
    handleScroll
  }
}

export default {
  useDebounce,
  useThrottle,
  useOptimizedScroll,
  useOptimizedResize,
  useIntersectionObserver,
  performanceUtils,
  useVirtualScroll
}
