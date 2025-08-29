import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Custom hook for Web Worker integration with error handling and state management
 */
export const useWebWorker = (workerScript, options = {}) => {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const workerRef = useRef(null)
  const pendingCallbacks = useRef(new Map())
  const messageId = useRef(0)

  // Initialize worker
  useEffect(() => {
    if (typeof Worker === 'undefined') {
      setError(new Error('Web Workers not supported'))
      return
    }

    try {
      workerRef.current = new Worker(workerScript, {
        type: 'module',
        ...options
      })

      workerRef.current.onmessage = (event) => {
        const { id, data, error: workerError } = event.data
        
        if (pendingCallbacks.current.has(id)) {
          const { resolve, reject } = pendingCallbacks.current.get(id)
          pendingCallbacks.current.delete(id)
          
          if (workerError) {
            reject(new Error(workerError))
          } else {
            resolve(data)
          }
        }
        
        setIsProcessing(false)
      }

      workerRef.current.onerror = (error) => {
        console.error('Worker error:', error)
        setError(error)
        setIsReady(false)
      }

      workerRef.current.onmessageerror = (error) => {
        console.error('Worker message error:', error)
        setError(error)
      }

      setIsReady(true)
      setError(null)

    } catch (err) {
      console.error('Failed to create worker:', err)
      setError(err)
      setIsReady(false)
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
      pendingCallbacks.current.clear()
      setIsReady(false)
    }
  }, [workerScript, options])

  // Execute task in worker
  const execute = useCallback((data, timeout = 10000) => {
    if (!workerRef.current || !isReady) {
      return Promise.reject(new Error('Worker not ready'))
    }

    return new Promise((resolve, reject) => {
      const id = messageId.current++
      
      // Set up timeout
      const timeoutId = setTimeout(() => {
        if (pendingCallbacks.current.has(id)) {
          pendingCallbacks.current.delete(id)
          reject(new Error('Worker timeout'))
        }
      }, timeout)

      // Store callback
      pendingCallbacks.current.set(id, {
        resolve: (data) => {
          clearTimeout(timeoutId)
          resolve(data)
        },
        reject: (error) => {
          clearTimeout(timeoutId)
          reject(error)
        }
      })

      // Send message to worker
      setIsProcessing(true)
      workerRef.current.postMessage({ id, data })
    })
  }, [isReady])

  return {
    execute,
    isReady,
    error,
    isProcessing,
    terminate: () => {
      if (workerRef.current) {
        workerRef.current.terminate()
      }
    }
  }
}

/**
 * Specialized hook for search worker
 */
export const useSearchWorker = () => {
  const { execute, isReady, error, isProcessing } = useWebWorker('/searchWorker.js')

  const searchAndFilter = useCallback(async (data, searchTerm, filters, sortBy, sortOrder) => {
    if (!isReady) return { data: [] }

    try {
      const result = await execute({
        type: 'SEARCH_AND_FILTER',
        payload: {
          data,
          searchTerm,
          filters,
          sortBy,
          sortOrder
        }
      })
      return result
    } catch (err) {
      console.error('Search worker error:', err)
      // Fallback to client-side filtering
      return clientSideSearch(data, searchTerm, filters, sortBy, sortOrder)
    }
  }, [execute, isReady])

  return { 
    searchAndFilter,
    isReady, 
    error, 
    isProcessing 
  }
}

/**
 * Fallback client-side search function
 */
const clientSideSearch = (data, searchTerm, filters, sortBy, sortOrder) => {
  let filteredData = [...data]

  // Apply search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase()
    filteredData = filteredData.filter(item => {
      const searchableText = [
        item.title,
        item.description,
        item.skills,
        item.category?.name || item.category,
        item.user?.name,
        item.location
      ].filter(Boolean).join(' ').toLowerCase()
      
      return searchableText.includes(term)
    })
  }

  // Apply filters
  if (filters.category && filters.category !== 'all') {
    filteredData = filteredData.filter(item => {
      const itemCategory = item.category?.name || item.category
      return itemCategory === filters.category
    })
  }

  if (filters.experienceLevel && filters.experienceLevel !== 'all') {
    filteredData = filteredData.filter(item => 
      item.experienceLevel === filters.experienceLevel
    )
  }

  if (filters.location && filters.location !== 'all') {
    filteredData = filteredData.filter(item => 
      item.location === filters.location
    )
  }

  if (filters.budgetMin !== '') {
    const minBudget = parseFloat(filters.budgetMin)
    filteredData = filteredData.filter(item => 
      parseFloat(item.budget) >= minBudget
    )
  }

  if (filters.budgetMax !== '') {
    const maxBudget = parseFloat(filters.budgetMax)
    filteredData = filteredData.filter(item => 
      parseFloat(item.budget) <= maxBudget
    )
  }

  // Apply sorting
  filteredData.sort((a, b) => {
    let aValue, bValue

    switch (sortBy) {
      case 'date':
        aValue = new Date(a.createdAt || a.date)
        bValue = new Date(b.createdAt || b.date)
        break
      case 'budget':
        aValue = parseFloat(a.budget) || 0
        bValue = parseFloat(b.budget) || 0
        break
      case 'title':
        aValue = a.title?.toLowerCase() || ''
        bValue = b.title?.toLowerCase() || ''
        break
      case 'views':
        aValue = parseInt(a.views) || 0
        bValue = parseInt(b.views) || 0
        break
      default:
        return 0
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
    }
  })

  return { data: filteredData }
}
