// Search Worker for offloading heavy search operations
self.onmessage = function(e) {
  const { id, data } = e.data;
  
  try {
    switch (data.type) {
      case 'SEARCH_AND_FILTER':
        const result = searchAndFilter(data.payload);
        self.postMessage({ id, data: result });
        break;
        
      case 'SEARCH_POSTS':
        const searchResult = searchPosts(data.payload);
        self.postMessage({ id, data: searchResult });
        break;
        
      case 'FILTER_POSTS':
        const filterResult = filterPosts(data.payload);
        self.postMessage({ id, data: filterResult });
        break;
        
      default:
        self.postMessage({ id, error: 'Unknown operation type' });
    }
  } catch (error) {
    self.postMessage({ id, error: error.message });
  }
};

function searchAndFilter({ data, searchTerm, filters, sortBy, sortOrder }) {
  let filteredData = [...data];

  // Apply search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredData = filteredData.filter(item => {
      const searchableText = [
        item.title,
        item.description,
        item.skills,
        item.category?.name || item.category,
        item.user?.name,
        item.location
      ].filter(Boolean).join(' ').toLowerCase();
      
      return searchableText.includes(term);
    });
  }

  // Apply filters
  if (filters.category && filters.category !== 'all') {
    filteredData = filteredData.filter(item => {
      const itemCategory = item.category?.name || item.category;
      return itemCategory === filters.category;
    });
  }

  if (filters.experienceLevel && filters.experienceLevel !== 'all') {
    filteredData = filteredData.filter(item => 
      item.experienceLevel === filters.experienceLevel
    );
  }

  if (filters.location && filters.location !== 'all') {
    filteredData = filteredData.filter(item => 
      item.location === filters.location
    );
  }

  if (filters.budgetMin !== '') {
    const minBudget = parseFloat(filters.budgetMin);
    filteredData = filteredData.filter(item => 
      parseFloat(item.budget) >= minBudget
    );
  }

  if (filters.budgetMax !== '') {
    const maxBudget = parseFloat(filters.budgetMax);
    filteredData = filteredData.filter(item => 
      parseFloat(item.budget) <= maxBudget
    );
  }

  // Apply sorting
  filteredData.sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'date':
        aValue = new Date(a.createdAt || a.date);
        bValue = new Date(b.createdAt || b.date);
        break;
      case 'budget':
        aValue = parseFloat(a.budget) || 0;
        bValue = parseFloat(b.budget) || 0;
        break;
      case 'title':
        aValue = a.title?.toLowerCase() || '';
        bValue = b.title?.toLowerCase() || '';
        break;
      case 'views':
        aValue = parseInt(a.views) || 0;
        bValue = parseInt(b.views) || 0;
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  return { data: filteredData };
}

function searchPosts({ posts, searchTerm }) {
  if (!searchTerm) return posts;
  
  const term = searchTerm.toLowerCase();
  return posts.filter(post => 
    post.title?.toLowerCase().includes(term) ||
    post.description?.toLowerCase().includes(term) ||
    post.skills?.toLowerCase().includes(term)
  );
}

function filterPosts({ posts, filters }) {
  return posts.filter(post => {
    // Apply your filtering logic here
    return true;
  });
}
