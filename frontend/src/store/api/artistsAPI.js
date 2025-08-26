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
    // Add query parameter to ensure we get full user data including profile pictures
    const response = await api.get("/api/artists?include=user,profile")
    console.log('✅ Artists API response status:', response.status)
    console.log('✅ Artists API response data:', response.data)
    
    // Log individual artist data to debug profile pictures
    if (response.data && Array.isArray(response.data)) {
      response.data.forEach((artist, index) => {
        console.log(`Artist ${index + 1}:`, {
          name: artist.user ? `${artist.user.firstName} ${artist.user.lastName}` : 'Unknown',
          profilePicture: artist.user?.profilePicture,
          artistId: artist.artistId
        })
      })
    }
    
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
    
    console.log('🎨 Raw artists data:', artists);
    console.log('⭐ Raw reviews data:', reviews);
    
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
      // Try both possible ID fields for matching reviews
      const artistId = artist.artistId || artist.id;
      const artistReviews = reviews.filter(review => 
        review.artistId === artistId || 
        review.artistId === artist.id ||
        review.artistId === artist.artistId
      );
      
      console.log(`🎨 Artist ${artistId} has ${artistReviews.length} reviews`);
      
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

// Get artist by slug (for public profile pages like GitHub)
export const getArtistBySlug = async (slug) => {
  try {
    console.log('📡 Calling /api/artists/slug/' + slug + '...')
    const response = await api.get(`/api/artists/slug/${slug}?include=user,profile,posts`)
    console.log('✅ Artist by slug API response:', response.data)
    return response.data
  } catch (error) {
    console.error("❌ Error fetching artist by slug:", error)
    console.error("❌ Artist by slug API error details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      slug: slug
    })
    throw error
  }
}

// Get public artist profile (for public view)
export const getPublicArtistProfile = async (identifier) => {
  try {
    console.log('📡 Calling public artist profile for:', identifier)
    // Try both slug and ID for flexibility
    const response = await api.get(`/api/public/artist/${identifier}?include=user,profile,posts,reviews`)
    console.log('✅ Public artist profile response:', response.data)
    return response.data
  } catch (error) {
    console.error("❌ Error fetching public artist profile:", error)
    console.error("❌ Public artist profile error details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      identifier: identifier
    })
    throw error
  }
}

export default {
  getArtists,
  getReviews,
  getTopRatedArtists,
  getArtistBySlug,
  getPublicArtistProfile,
};
