import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Add timeout to prevent hanging requests
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getTopRatedArtists = async ({ signal } = {}) => {
  try {
    console.log('🔄 getTopRatedArtists: Starting direct API calls...');
    
    const [artistsResponse, reviewsResponse] = await Promise.all([
      api.get('/api/artists', { signal }),
      api.get('/api/reviews', { signal }),
    ]);
    
    console.log('✅ Direct API calls completed:', {
      artistsStatus: artistsResponse.status,
      reviewsStatus: reviewsResponse.status,
    });
    
    const artists = artistsResponse.data;
    const reviews = reviewsResponse.data;
    
    console.log('📊 Artists data:', artists);
    console.log('📊 Reviews data:', reviews);
    
    if (!Array.isArray(artists)) {
      console.error('❌ Artists data is not an array:', artists);
      return [];
    }
    
    if (!Array.isArray(reviews)) {
      console.error('❌ Reviews data is not an array:', reviews);
      return [];
    }
    
    const artistsWithRatings = artists.map((artist) => {
      const artistReviews = reviews.filter((review) => review.artistId === artist.id);
      if (artistReviews.length === 0) {
        return {
          ...artist,
          averageRating: 0,
          reviewCount: 0,
        };
      }

      const totalRating = artistReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
      const averageRating = totalRating / artistReviews.length;

      return {
        ...artist,
        averageRating: Number(averageRating.toFixed(1)),
        reviewCount: artistReviews.length,
      };
    });

    const result = artistsWithRatings
      .sort((a, b) => {
        if (b.averageRating === a.averageRating) {
          return b.reviewCount - a.reviewCount;
        }
        return b.averageRating - a.averageRating;
      })
      .slice(0, 3);
    
    console.log('🎯 Returning top artists:', result);
    return result;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('🛑 getTopRatedArtists aborted');
      return [];
    }
    console.error('❌ Error in getTopRatedArtists:', error);
    console.error('❌ Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
    });
    return [];
  }
};

export const getArtists = async () => {
  try {
    console.log('📡 Calling /api/artists...');
    const response = await api.get('/api/artists');
    console.log('✅ Artists API response status:', response.status);
    console.log('✅ Artists API response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching artists:', error);
    console.error('❌ Artists API error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
    });
    throw error;
  }
};

export const getReviews = async () => {
  try {
    console.log('📡 Calling /api/reviews...');
    const response = await api.get('/api/reviews');
    console.log('✅ Reviews API response status:', response.status);
    console.log('✅ Reviews API response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching reviews:', error);
    console.error('❌ Reviews API error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
    });
    throw error;
  }
};

export default {
  getArtists,
  getReviews,
  getTopRatedArtists,
};