import api from './apiConfig';

// Upload API
export const uploadAPI = {
  uploadImage: (formData) => api.post('/api/upload/image', formData, {
    headers: { 'Content-Type': undefined, 'Accept': 'application/json' }
  }),
  uploadImages: (formData) => api.post('/api/upload/images', formData, {
    headers: { 'Content-Type': undefined, 'Accept': 'application/json' }
  }),
  uploadAvatar: async (formData) => {
    // First, validate the FormData
    let fileField = null;
    for (let [key, value] of formData.entries()) {
      console.log(`[v0] FormData entry - ${key}:`, value instanceof File ? 
        `File(name=${value.name}, type=${value.type}, size=${value.size})` : value);
      if (value instanceof File) {
        fileField = key;
      }
    }

    if (!fileField) {
      console.error('[v0] No file found in FormData');
      throw new Error('No file included in upload request');
    }

    // Try different field names if the server keeps rejecting
    const fieldNames = ['avatar', 'image', 'file'];
    if (!fieldNames.includes(fileField)) {
      console.warn(`[v0] Using non-standard field name: ${fileField}`);
    }

    try {
      // Create a new FormData with debug logging
      const debugFormData = new FormData();
      for (let [key, value] of formData.entries()) {
        debugFormData.append(key, value);
        console.log(`[v0] Adding to FormData - ${key}:`, value instanceof File ?
          `File(${value.name})` : value);
      }

      // Make the request with detailed logging
      console.log('[v0] Starting upload request...');
      const response = await api.post('/api/upload/avatar', debugFormData, {
        headers: {
          'Accept': 'application/json',
          // Let the browser set the correct multipart boundary
          'Content-Type': undefined
        },
        // Add request/response interceptors for debugging
        onUploadProgress: (progressEvent) => {
          console.log('[v0] Upload progress:', 
            Math.round((progressEvent.loaded * 100) / progressEvent.total), '%');
        }
      });

      console.log('[v0] Upload response:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });

      return response;

    } catch (error) {
      console.error('[v0] Upload error:', {
        message: error.message,
        response: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        },
        request: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });

      // Rethrow with more context
      throw new Error(
        `Upload failed: ${error.response?.data?.message || error.message}`
      );
    }
  },
  uploadPortfolio: (formData) => api.post('/api/upload/portfolio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getImage: (publicId) => api.get(`/api/upload/image/${encodeURIComponent(publicId)}`),
  listImages: (params) => api.get('/api/upload/images', { params }),
  updateImageMetadata: (publicId, metadata) => api.put(`/api/upload/image/${encodeURIComponent(publicId)}`, metadata),
  transformImage: (publicId, transformations) => api.post(`/api/upload/transform/${encodeURIComponent(publicId)}`, transformations),
  deleteImage: (publicId) => api.delete(`/api/upload/image/${encodeURIComponent(publicId)}`),
  deleteImages: (publicIds) => api.delete('/api/upload/images', { data: { publicIds } }),
  generateSignature: (params) => api.post('/api/upload/signature', params),
};

export default uploadAPI;
