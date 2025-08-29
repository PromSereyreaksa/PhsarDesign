/**
 * Search Worker - Handles heavy search and filtering operations
 * This runs in a separate thread to avoid blocking the main UI thread
 */

// Listen for messages from the main thread
self.addEventListener('message', function(e) {
  const { type, data, id } = e.data
  
  switch (type) {
    case 'SEARCH_POSTS':
      handleSearchPosts(data, id)
      break
    case 'FILTER_POSTS':
      handleFilterPosts(data, id)
      break
    case 'SORT_POSTS':
      handleSortPosts(data, id)
      break
    case 'SEARCH_AND_FILTER':
      handleSearchAndFilter(data, id)
      break
    default:
      console.warn('Unknown worker message type:', type)
  }
})

// Search through posts
function handleSearchPosts({ posts, searchTerm }, requestId) {
  const startTime = performance.now()
  
  if (!searchTerm || searchTerm.length < 2) {
    postMessage({
      type: 'SEARCH_COMPLETE',
      data: posts,
      requestId,
      processingTime: performance.now() - startTime
    })
    return
  }
  
  const normalizedSearch = searchTerm.toLowerCase().trim()
  
  const results = posts.filter(post => {
    // Search in title
    if (post.title?.toLowerCase().includes(normalizedSearch)) return true
    
    // Search in description
    if (post.description?.toLowerCase().includes(normalizedSearch)) return true
    
    // Search in skills/categories
    if (post.skillRequired?.toLowerCase().includes(normalizedSearch)) return true
    if (post.category?.name?.toLowerCase().includes(normalizedSearch)) return true
    
    // Search in artist/client names
    if (post.artist?.firstName?.toLowerCase().includes(normalizedSearch)) return true
    if (post.artist?.lastName?.toLowerCase().includes(normalizedSearch)) return true
    if (post.client?.organizationName?.toLowerCase().includes(normalizedSearch)) return true
    
    return false
  })
  
  postMessage({
    type: 'SEARCH_COMPLETE',
    data: results,
    requestId,
    processingTime: performance.now() - startTime
  })
}

// Filter posts by criteria
function handleFilterPosts({ posts, filters }, requestId) {
  const startTime = performance.now()
  
  let results = [...posts]
  
  // Filter by category
  if (filters.category && filters.category !== 'all') {
    results = results.filter(post => 
      post.category?.name?.toLowerCase() === filters.category.toLowerCase() ||
      post.category?.toLowerCase() === filters.category.toLowerCase()
    )
  }
  
  // Filter by experience level
  if (filters.experienceLevel && filters.experienceLevel !== 'all') {
    results = results.filter(post => 
      post.experienceLevel?.toLowerCase() === filters.experienceLevel.toLowerCase()
    )
  }
  
  // Filter by budget range
  if (filters.budgetMin !== undefined) {
    results = results.filter(post => {
      const budget = parseFloat(post.budget) || 0
      return budget >= filters.budgetMin
    })
  }
  
  if (filters.budgetMax !== undefined) {
    results = results.filter(post => {
      const budget = parseFloat(post.budget) || 0
      return budget <= filters.budgetMax
    })
  }
  
  // Filter by location
  if (filters.location && filters.location !== 'all') {
    results = results.filter(post => 
      post.location?.toLowerCase().includes(filters.location.toLowerCase())
    )
  }
  
  // Filter by post type
  if (filters.postType && filters.postType !== 'all') {
    results = results.filter(post => post.postType === filters.postType)
  }
  
  // Filter by date range
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom)
    results = results.filter(post => new Date(post.createdAt) >= fromDate)
  }
  
  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo)
    results = results.filter(post => new Date(post.createdAt) <= toDate)
  }
  
  postMessage({
    type: 'FILTER_COMPLETE',
    data: results,
    requestId,
    processingTime: performance.now() - startTime
  })
}

// Sort posts by criteria
function handleSortPosts({ posts, sortBy, sortOrder = 'desc' }, requestId) {
  const startTime = performance.now()
  
  const results = [...posts].sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.createdAt)
        bValue = new Date(b.createdAt)
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
        aValue = a.viewCount || 0
        bValue = b.viewCount || 0
        break
      case 'applications':
        aValue = a.applicationCount || 0
        bValue = b.applicationCount || 0
        break
      case 'deadline':
        aValue = a.deadline ? new Date(a.deadline) : new Date('2099-12-31')
        bValue = b.deadline ? new Date(b.deadline) : new Date('2099-12-31')
        break
      default:
        aValue = 0
        bValue = 0
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })
  
  postMessage({
    type: 'SORT_COMPLETE',
    data: results,
    requestId,
    processingTime: performance.now() - startTime
  })
}

// Combined search and filter operation
function handleSearchAndFilter({ posts, searchTerm, filters, sortBy, sortOrder }, requestId) {
  const startTime = performance.now()
  
  let results = [...posts]
  
  // Apply search first
  if (searchTerm && searchTerm.length >= 2) {
    const normalizedSearch = searchTerm.toLowerCase().trim()
    results = results.filter(post => {
      return (
        post.title?.toLowerCase().includes(normalizedSearch) ||
        post.description?.toLowerCase().includes(normalizedSearch) ||
        post.skillRequired?.toLowerCase().includes(normalizedSearch) ||
        post.category?.name?.toLowerCase().includes(normalizedSearch) ||
        post.artist?.firstName?.toLowerCase().includes(normalizedSearch) ||
        post.artist?.lastName?.toLowerCase().includes(normalizedSearch) ||
        post.client?.organizationName?.toLowerCase().includes(normalizedSearch)
      )
    })
  }
  
  // Apply filters
  if (filters.category && filters.category !== 'all') {
    results = results.filter(post => 
      post.category?.name?.toLowerCase() === filters.category.toLowerCase()
    )
  }
  
  if (filters.experienceLevel && filters.experienceLevel !== 'all') {
    results = results.filter(post => 
      post.experienceLevel?.toLowerCase() === filters.experienceLevel.toLowerCase()
    )
  }
  
  if (filters.budgetMin !== undefined) {
    results = results.filter(post => {
      const budget = parseFloat(post.budget) || 0
      return budget >= filters.budgetMin
    })
  }
  
  if (filters.budgetMax !== undefined) {
    results = results.filter(post => {
      const budget = parseFloat(post.budget) || 0
      return budget <= filters.budgetMax
    })
  }
  
  // Apply sorting
  if (sortBy) {
    results.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        case 'budget':
          aValue = parseFloat(a.budget) || 0
          bValue = parseFloat(b.budget) || 0
          break
        case 'title':
          aValue = a.title?.toLowerCase() || ''
          bValue = b.title?.toLowerCase() || ''
          break
        default:
          return 0
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }
  
  postMessage({
    type: 'SEARCH_AND_FILTER_COMPLETE',
    data: results,
    requestId,
    processingTime: performance.now() - startTime
  })
}
