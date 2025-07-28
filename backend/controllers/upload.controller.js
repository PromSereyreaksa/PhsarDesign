// controllers/upload.controller.js
import {
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
} from '../services/cloudinary.service.js';

/**
 * Upload Controller - Handle file upload requests
 */

/**
 * Upload single image
 * POST /api/upload/image
 */
export const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

    const { folder, public_id, tags } = req.body;
    
    const options = {
      folder: folder || 'artlink/general',
      public_id,
      transformation: {
        quality: 'auto:good',
        fetch_format: 'auto'
      }
    };

    if (tags) {
      options.tags = Array.isArray(tags) ? tags : tags.split(',');
    }

    const result = await uploadImage(req.file.path, options);

    // Clean up local file
    cleanupLocalFiles(req.file.path);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Upload failed',
        error: result.error
      });
    }

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: result.data
    });

  } catch (error) {
    console.error('Upload single image error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Upload multiple images
 * POST /api/upload/images
 */
export const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files provided'
      });
    }

    const { folder, tags } = req.body;
    const filePaths = req.files.map(file => file.path);

    const options = {
      folder: folder || 'artlink/general',
      transformation: {
        quality: 'auto:good',
        fetch_format: 'auto'
      }
    };

    if (tags) {
      options.tags = Array.isArray(tags) ? tags : tags.split(',');
    }

    const result = await uploadMultipleImages(filePaths, options);

    // Clean up local files
    cleanupLocalFiles(filePaths);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Upload failed',
        error: result.error
      });
    }

    res.status(201).json({
      success: true,
      message: `${result.data.successCount}/${result.data.total} images uploaded successfully`,
      data: result.data
    });

  } catch (error) {
    console.error('Upload multiple images error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Upload avatar image
 * POST /api/upload/avatar
 */
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No avatar file provided'
      });
    }

    const userId = req.user?.id || req.user?.userId || req.body.userId || 101; // Use fallback for testing
    console.log('Upload avatar - userId from req.user:', req.user?.id || req.user?.userId)
    console.log('Upload avatar - userId from req.body:', req.body.userId)
    console.log('Upload avatar - final userId:', userId)
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID required'
      });
    }

    const options = {
      folder: 'artlink/avatars',
      public_id: `avatar_${userId}`,
      overwrite: true,
      transformation: {
        width: 300,
        height: 300,
        crop: 'fill',
        gravity: 'face',
        quality: 'auto:good',
        fetch_format: 'auto'
      }
    };

    const result = await uploadImage(req.file.path, options);

    // Clean up local file
    cleanupLocalFiles(req.file.path);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Avatar upload failed',
        error: result.error
      });
    }

    // Update user profile with avatar URL
    try {
      const { default: Users } = await import('../models/user.model.js');
      const { default: Clients } = await import('../models/client.model.js');
      const { default: Artist } = await import('../models/artist.model.js');

      // Get user to check their role
      const user = await Users.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const avatarUrl = result.data.secure_url;

      // Update the appropriate profile based on user role
      if (user.role === 'client') {
        const updateResult = await Clients.update(
          { avatarUrl },
          { where: { userId } }
        );
        console.log('Client avatar update result:', updateResult)
      } else if (user.role === 'artist') {
        const updateResult = await Artist.update(
          { avatarUrl },
          { where: { userId } }
        );
        console.log('Artist avatar update result:', updateResult)
      }

      console.log(`Avatar URL updated for ${user.role} user ${userId}: ${avatarUrl}`);
    } catch (profileError) {
      console.error('Error updating profile with avatar URL:', profileError);
      // Don't fail the request if profile update fails, avatar is still uploaded
    }

    res.status(201).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        ...result.data,
        avatarUrl: result.data.secure_url
      }
    });

  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Upload portfolio image
 * POST /api/upload/portfolio
 */
export const uploadPortfolioImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No portfolio image provided'
      });
    }

    const { freelancerId, portfolioId, title, description } = req.body;
    
    if (!freelancerId) {
      return res.status(400).json({
        success: false,
        message: 'Freelancer ID required'
      });
    }

    const options = {
      folder: `artlink/portfolios/${freelancerId}`,
      transformation: {
        quality: 'auto:good',
        fetch_format: 'auto'
      },
      context: {
        title: title || '',
        description: description || '',
        portfolioId: portfolioId || ''
      }
    };

    const result = await uploadImage(req.file.path, options);

    // Clean up local file
    cleanupLocalFiles(req.file.path);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Portfolio image upload failed',
        error: result.error
      });
    }

    res.status(201).json({
      success: true,
      message: 'Portfolio image uploaded successfully',
      data: result.data
    });

  } catch (error) {
    console.error('Upload portfolio image error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get image details
 * GET /api/upload/image/:publicId
 */
export const getImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    
    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID required'
      });
    }

    const result = await getImageDetails(publicId);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * List images
 * GET /api/upload/images
 */
export const getImages = async (req, res) => {
  try {
    const {
      folder = 'artlink',
      max_results = 20,
      next_cursor,
      tags
    } = req.query;

    const options = {
      folder,
      max_results: parseInt(max_results),
      next_cursor,
      tags: tags ? tags.split(',') : undefined
    };

    const result = await listImages(options);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve images',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update image metadata
 * PUT /api/upload/image/:publicId
 */
export const updateImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    const { tags, context } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID required'
      });
    }

    const updates = {};
    if (tags) updates.tags = tags;
    if (context) updates.context = context;

    const result = await updateImageMetadata(publicId, updates);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update image',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image updated successfully',
      data: result.data
    });

  } catch (error) {
    console.error('Update image error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Transform image
 * POST /api/upload/transform/:publicId
 */
export const transformImageEndpoint = async (req, res) => {
  try {
    const { publicId } = req.params;
    const transformation = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID required'
      });
    }

    const result = await transformImage(publicId, transformation);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to transform image',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image transformed successfully',
      data: result.data
    });

  } catch (error) {
    console.error('Transform image error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete image
 * DELETE /api/upload/image/:publicId
 */
export const deleteImageEndpoint = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID required'
      });
    }

    const result = await deleteImage(publicId);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete image',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: result.data
    });

  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete multiple images
 * DELETE /api/upload/images
 */
export const deleteMultipleImagesEndpoint = async (req, res) => {
  try {
    const { publicIds } = req.body;

    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Public IDs array required'
      });
    }

    const result = await deleteMultipleImages(publicIds);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete images',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: `${result.data.deletedCount}/${result.data.total} images deleted successfully`,
      data: result.data
    });

  } catch (error) {
    console.error('Delete multiple images error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete folder
 * DELETE /api/upload/folder/:folderName
 */
export const deleteFolderEndpoint = async (req, res) => {
  try {
    const { folderName } = req.params;

    if (!folderName) {
      return res.status(400).json({
        success: false,
        message: 'Folder name required'
      });
    }

    const result = await deleteFolder(folderName);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete folder',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Folder deleted successfully',
      data: result.data
    });

  } catch (error) {
    console.error('Delete folder error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Generate upload signature for frontend
 * POST /api/upload/signature
 */
export const getUploadSignature = async (req, res) => {
  try {
    const params = req.body;
    const result = generateUploadSignature(params);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate signature',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error('Generate signature error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export default {
  uploadSingleImage,
  uploadMultipleFiles,
  uploadAvatar,
  uploadPortfolioImage,
  getImage,
  getImages,
  updateImage,
  transformImageEndpoint,
  deleteImageEndpoint,
  deleteMultipleImagesEndpoint,
  deleteFolderEndpoint,
  getUploadSignature
};
