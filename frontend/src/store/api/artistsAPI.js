import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Get all artists
export const getArtists = async () => {
  try {
    console.log('📡 Calling /api/artists...')
    const response = await api.get("/api/artists")
    console.log('✅ Artists API response status:', response.status)
    console.log('✅ Artists API response data:', response.data)
    return response.data
  } catch (error) {
    console.error("❌ Error fetching artists:", error)
    console.error("❌ Artists API error details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url
    })
    throw error
  }
}

// Get all reviews
export const getReviews = async () => {
  try {
    console.log('📡 Calling /api/reviews...')
    const response = await api.get("/api/reviews")
    console.log('✅ Reviews API response status:', response.status)
    console.log('✅ Reviews API response data:', response.data)
    return response.data
  } catch (error) {
    console.error("❌ Error fetching reviews:", error)
    console.error("❌ Reviews API error details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url
    })
    throw error
  }
}

// Create a NEW version of getTopRatedArtists that doesn't use getArtists/getReviews
export const getTopRatedArtists = async () => {
  try {
    console.log('🔄 getTopRatedArtistsIsolated: Starting direct API calls...')
    
    // Make direct API calls without using getArtists/getReviews
    const [artistsResponse, reviewsResponse] = await Promise.all([
      api.get("/api/artists"),  // Direct call
      api.get("/api/reviews")   // Direct call
    ])
    
    console.log('✅ Direct API calls completed')
    
    const artists = artistsResponse.data
    const reviews = reviewsResponse.data
    
    // Add validation
    if (!Array.isArray(artists)) {
      console.error('❌ Artists data is not an array:', artists)
      return []
    }
    
    if (!Array.isArray(reviews)) {
      console.error('❌ Reviews data is not an array:', reviews)  
      return []
    }
    
    // Calculate ratings (same logic as before)
    const artistsWithRatings = artists.map(artist => {
      const artistReviews = reviews.filter(review => review.artistId === artist.id)
      if (artistReviews.length === 0) {
        return {
          ...artist,
          averageRating: 0,
          reviewCount: 0
        }
      }

      const totalRating = artistReviews.reduce((sum, review) => sum + (review.rating || 0), 0)
      const averageRating = totalRating / artistReviews.length

      return {
        ...artist,
        averageRating: Number(averageRating.toFixed(1)),
        reviewCount: artistReviews.length
      }
    })

    // Sort and return top 3
    const result = artistsWithRatings
      .sort((a, b) => {
        if (b.averageRating === a.averageRating) {
          return b.reviewCount - a.reviewCount
        }
        return b.averageRating - a.averageRating
      })
      .slice(0, 3)
    
    console.log('🎯 Returning isolated top artists:', result)
    return result
    
  } catch (error) {
    console.error("❌ Error in getTopRatedArtistsIsolated:", error)
    return []
  }
}

export default {
  getArtists,
  getReviews,
  getTopRatedArtists,
};
