import { useEffect, useState } from 'react'

/**
 * Performance Monitor - Shows Core Web Vitals in development
 */
const PerformanceMonitor = ({ 
  showInProduction = false,
  position = 'bottom-right'
}) => {
  const [metrics, setMetrics] = useState({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    inp: null
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development unless explicitly enabled for production
    if (process.env.NODE_ENV === 'production' && !showInProduction) {
      return
    }

    let lcpObserver
    let fidObserver
    let clsObserver

    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          const lastEntry = entries[entries.length - 1]
          setMetrics(prev => ({ ...prev, lcp: Math.round(lastEntry.startTime) }))
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        console.warn('LCP observer failed:', e)
      }

      // First Input Delay (FID)
      try {
        fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          entries.forEach(entry => {
            const fid = Math.round(entry.processingStart - entry.startTime)
            setMetrics(prev => ({ ...prev, fid }))
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })
      } catch (e) {
        console.warn('FID observer failed:', e)
      }

      // Cumulative Layout Shift (CLS)
      try {
        let cumulativeLayoutShiftScore = 0
        clsObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          entries.forEach(entry => {
            if (!entry.hadRecentInput) {
              cumulativeLayoutShiftScore += entry.value
            }
          })
          setMetrics(prev => ({ 
            ...prev, 
            cls: Math.round(cumulativeLayoutShiftScore * 1000) / 1000 
          }))
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        console.warn('CLS observer failed:', e)
      }
    }

    // Navigation Timing API for other metrics
    if ('performance' in window && window.performance.timing) {
      const timing = window.performance.timing
      
      // Time to First Byte (TTFB)
      const ttfb = timing.responseStart - timing.requestStart
      if (ttfb > 0) {
        setMetrics(prev => ({ ...prev, ttfb: Math.round(ttfb) }))
      }
    }

    // Use Performance Observer for newer metrics if available
    if ('PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          entries.forEach(entry => {
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({ ...prev, fcp: Math.round(entry.startTime) }))
            }
          })
        })
        paintObserver.observe({ entryTypes: ['paint'] })
      } catch (e) {
        console.warn('Paint observer failed:', e)
      }
    }

    // Cleanup
    return () => {
      lcpObserver?.disconnect()
      fidObserver?.disconnect()
      clsObserver?.disconnect()
    }
  }, [showInProduction])

  const getScoreColor = (metric, value) => {
    if (value === null) return 'text-gray-400'
    
    switch (metric) {
      case 'lcp':
        return value <= 2500 ? 'text-green-400' : value <= 4000 ? 'text-yellow-400' : 'text-red-400'
      case 'fid':
      case 'inp':
        return value <= 100 ? 'text-green-400' : value <= 300 ? 'text-yellow-400' : 'text-red-400'
      case 'cls':
        return value <= 0.1 ? 'text-green-400' : value <= 0.25 ? 'text-yellow-400' : 'text-red-400'
      case 'fcp':
        return value <= 1800 ? 'text-green-400' : value <= 3000 ? 'text-yellow-400' : 'text-red-400'
      case 'ttfb':
        return value <= 800 ? 'text-green-400' : value <= 1800 ? 'text-yellow-400' : 'text-red-400'
      default:
        return 'text-gray-300'
    }
  }

  const formatValue = (metric, value) => {
    if (value === null) return 'N/A'
    
    switch (metric) {
      case 'lcp':
      case 'fcp':
      case 'ttfb':
        return `${value}ms`
      case 'fid':
      case 'inp':
        return `${value}ms`
      case 'cls':
        return value.toFixed(3)
      default:
        return value
    }
  }

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  }

  if (process.env.NODE_ENV === 'production' && !showInProduction) {
    return null
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <div className="relative">
        {/* Toggle Button */}
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="bg-gray-900/90 hover:bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-lg p-2 text-white transition-colors"
          title="Performance Monitor"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Metrics Panel */}
        {isVisible && (
          <div className="absolute bottom-full right-0 mb-2 bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 min-w-64 shadow-xl">
            <h3 className="text-white font-semibold mb-3 text-sm">Core Web Vitals</h3>
            
            <div className="space-y-2 text-xs">
              {[
                { key: 'lcp', label: 'LCP', desc: 'Largest Contentful Paint' },
                { key: 'fid', label: 'FID', desc: 'First Input Delay' },
                { key: 'cls', label: 'CLS', desc: 'Cumulative Layout Shift' },
                { key: 'fcp', label: 'FCP', desc: 'First Contentful Paint' },
                { key: 'ttfb', label: 'TTFB', desc: 'Time to First Byte' }
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-gray-400" title={desc}>{label}:</span>
                  <span className={`font-mono ${getScoreColor(key, metrics[key])}`}>
                    {formatValue(key, metrics[key])}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Performance Tips */}
            <div className="mt-4 pt-3 border-t border-gray-700/50">
              <p className="text-gray-400 text-xs mb-2">Performance Tips:</p>
              <div className="space-y-1 text-xs text-gray-500">
                <div>🟢 Good: LCP ≤ 2.5s, FID ≤ 100ms, CLS ≤ 0.1</div>
                <div>🟡 Needs Improvement: Moderate values</div>
                <div>🔴 Poor: Above thresholds</div>
              </div>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={() => window.location.reload()}
              className="mt-3 w-full bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white py-1 px-3 rounded text-xs transition-colors"
            >
              Refresh Page
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PerformanceMonitor
