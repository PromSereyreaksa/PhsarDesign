// services/cloudinary.service.js
import { cloudinary } from '../config/cloudinary.js';
import fs from 'fs';
import path from 'path';

/**
 * Cloudinary Service - CRUD Operations
 * Handles image upload, retrieval, update, and deletion
 */

/**
 * CREATE - Upload image to Cloudinary
 * @param {string} filePath - Local file path or buffer
 * @param {object} options - Upload options
 * @returns {Promise<object>} - Upload result with URL and public_id
 */
export const uploadImage = async (filePath, options = {}) => {
  try {
    const {
      folder = 'artlink',
      public_id,
      transformation = {},
      resource_type = 'image',
      overwrite = false,
      invalidate = true
    } = options;

    const uploadOptions = {
      folder,
      resource_type,
      overwrite,
      invalidate,
      ...transformation
    };

    if (public_id) {
      uploadOptions.public_id = public_id;
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, uploadOptions);

    return {
      success: true,
      data: {
        public_id: result.public_id,
        url: result.secure_url,
        original_filename: result.original_filename,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        created_at: result.created_at
      }
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * CREATE - Upload multiple images
 * @param {Array} filePaths - Array of file paths
 * @param {object} options - Upload options
 * @returns {Promise<object>} - Upload results
 */
export const uploadMultipleImages = async (filePaths, options = {}) => {
  try {
    const uploadPromises = filePaths.map(filePath => uploadImage(filePath, options));
    const results = await Promise.all(uploadPromises);
    
    const successful = results.filter(result => result.success);
    const failed = results.filter(result => !result.success);

    return {
      success: true,
      data: {
        successful: successful.map(result => result.data),
        failed: failed.map(result => result.error),
        total: results.length,
        successCount: successful.length,
        failureCount: failed.length
      }
    };
  } catch (error) {
    console.error('Multiple upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * READ - Get image details by public_id
 * @param {string} publicId - Cloudinary public_id
 * @returns {Promise<object>} - Image details
 */
export const getImageDetails = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    
    return {
      success: true,
      data: {
        public_id: result.public_id,
        url: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        created_at: result.created_at,
        updated_at: result.updated_at,
        tags: result.tags || [],
        context: result.context || {}
      }
    };
  } catch (error) {
    console.error('Get image details error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * READ - List images from a folder
 * @param {object} options - Search options
 * @returns {Promise<object>} - List of images
 */
export const listImages = async (options = {}) => {
  try {
    const {
      folder = 'artlink',
      max_results = 50,
      next_cursor,
      tags,
      resource_type = 'image'
    } = options;

    const searchOptions = {
      type: 'upload',
      resource_type,
      max_results
    };

    if (folder) {
      searchOptions.prefix = folder;
    }

    if (next_cursor) {
      searchOptions.next_cursor = next_cursor;
    }

    if (tags && tags.length > 0) {
      searchOptions.tags = true;
    }

    const result = await cloudinary.api.resources(searchOptions);

    return {
      success: true,
      data: {
        resources: result.resources.map(resource => ({
          public_id: resource.public_id,
          url: resource.secure_url,
          format: resource.format,
          width: resource.width,
          height: resource.height,
          bytes: resource.bytes,
          created_at: resource.created_at,
          tags: resource.tags || []
        })),
        next_cursor: result.next_cursor || null,
        total_count: result.total_count
      }
    };
  } catch (error) {
    console.error('List images error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * UPDATE - Update image metadata (tags, context)
 * @param {string} publicId - Cloudinary public_id
 * @param {object} updates - Updates to apply
 * @returns {Promise<object>} - Update result
 */
export const updateImageMetadata = async (publicId, updates = {}) => {
  try {
    const { tags, context } = updates;
    const updateOptions = {};

    if (tags) {
      updateOptions.tags = Array.isArray(tags) ? tags.join(',') : tags;
    }

    if (context) {
      updateOptions.context = context;
    }

    const result = await cloudinary.api.update(publicId, updateOptions);

    return {
      success: true,
      data: {
        public_id: result.public_id,
        url: result.secure_url,
        tags: result.tags || [],
        context: result.context || {}
      }
    };
  } catch (error) {
    console.error('Update image metadata error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * UPDATE - Transform existing image
 * @param {string} publicId - Cloudinary public_id
 * @param {object} transformation - Transformation options
 * @returns {Promise<object>} - Transformed image URL
 */
export const transformImage = async (publicId, transformation = {}) => {
  try {
    const transformedUrl = cloudinary.url(publicId, {
      ...transformation,
      secure: true
    });

    return {
      success: true,
      data: {
        public_id: publicId,
        original_url: cloudinary.url(publicId, { secure: true }),
        transformed_url: transformedUrl,
        transformation
      }
    };
  } catch (error) {
    console.error('Transform image error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * DELETE - Delete single image
 * @param {string} publicId - Cloudinary public_id
 * @param {object} options - Delete options
 * @returns {Promise<object>} - Delete result
 */
export const deleteImage = async (publicId, options = {}) => {
  try {
    const { resource_type = 'image', invalidate = true } = options;

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type,
      invalidate
    });

    return {
      success: result.result === 'ok',
      data: {
        public_id: publicId,
        result: result.result
      }
    };
  } catch (error) {
    console.error('Delete image error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * DELETE - Delete multiple images
 * @param {Array} publicIds - Array of public_ids
 * @param {object} options - Delete options
 * @returns {Promise<object>} - Delete results
 */
export const deleteMultipleImages = async (publicIds, options = {}) => {
  try {
    const { resource_type = 'image', invalidate = true } = options;

    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type,
      invalidate
    });

    const deleted = Object.entries(result.deleted).map(([public_id, status]) => ({
      public_id,
      success: status === 'deleted'
    }));

    const notFound = result.not_found || [];
    const errors = result.partial || [];

    return {
      success: true,
      data: {
        deleted,
        not_found: notFound,
        errors,
        total: publicIds.length,
        deletedCount: deleted.filter(item => item.success).length
      }
    };
  } catch (error) {
    console.error('Delete multiple images error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * DELETE - Delete images by folder
 * @param {string} folder - Folder name
 * @returns {Promise<object>} - Delete result
 */
export const deleteFolder = async (folder) => {
  try {
    const result = await cloudinary.api.delete_resources_by_prefix(folder);

    return {
      success: true,
      data: {
        deleted: result.deleted,
        partial: result.partial || [],
        total_deleted: Object.keys(result.deleted).length
      }
    };
  } catch (error) {
    console.error('Delete folder error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * UTILITY - Generate upload signature for frontend uploads
 * @param {object} params - Upload parameters
 * @returns {object} - Signature and timestamp
 */
export const generateUploadSignature = (params = {}) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = {
      timestamp,
      ...params
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    return {
      success: true,
      data: {
        signature,
        timestamp,
        api_key: process.env.CLOUDINARY_API_KEY,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME
      }
    };
  } catch (error) {
    console.error('Generate signature error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * UTILITY - Clean up local files after upload
 * @param {Array|string} filePaths - File paths to delete
 */
export const cleanupLocalFiles = (filePaths) => {
  try {
    const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
    
    paths.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Cleaned up local file: ${filePath}`);
      }
    });
  } catch (error) {
    console.error('Cleanup error:', error);
  }
};

export default {
  uploadImage,
  uploadMultipleImages,
  getImageDetails,
  listImages,
  updateImageMetadata,
  transformImage,
  deleteImage,
  deleteMultipleImages,
  deleteFolder,
  generateUploadSignature,
  cleanupLocalFiles
};
