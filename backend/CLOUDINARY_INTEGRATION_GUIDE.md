# Cloudinary Integration Guide for ArtLink Backend

**Document Version:** 1.0  
**Date:** July 23, 2025  
**Target:** Backend Developer implementing file upload system  

## 📋 Table of Contents

1. [Overview](#overview)
2. [Setup & Configuration](#setup--configuration)
3. [Service Implementation](#service-implementation)
4. [Controller Integration](#controller-integration)
5. [Route Implementation](#route-implementation)
6. [Frontend Integration Examples](#frontend-integration-examples)
7. [Error Handling](#error-handling)
8. [Security Considerations](#security-considerations)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

### What is Cloudinary?
Cloudinary is a cloud-based image and video management service that provides:
- **Upload Management**: Secure file uploads with validation
- **Storage**: Reliable cloud storage for media files
- **Transformation**: Real-time image/video manipulation
- **Delivery**: Fast CDN delivery with optimization
- **URL Generation**: Automatic URL generation for uploaded assets

### Why We're Using Cloudinary
- **Scalable Storage**: No server disk space concerns
- **Image Optimization**: Automatic format conversion and compression
- **Security**: Secure uploads with validation
- **Performance**: CDN delivery for fast loading
- **Transformations**: Resize, crop, and optimize images on-the-fly

### ArtLink Use Cases
- **User Avatars**: Profile pictures for clients and freelancers
- **Portfolio Images**: Freelancer work showcases
- **Project Assets**: Images related to project descriptions
- **Document Uploads**: Contracts, proposals, etc.

---

## ⚙️ Setup & Configuration

### 1. Cloudinary Account Setup

#### Create Account
1. Visit [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Note your **Cloud Name**, **API Key**, and **API Secret**

#### Dashboard Overview
```
Cloud Name: your-cloud-name
API Key: 123456789012345
API Secret: abcdefghijklmnopqrstuvwxyz123456
```

### 2. Install Dependencies

```bash
npm install cloudinary multer multer-storage-cloudinary
```

### 3. Environment Configuration

Add to `.env` file:
```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456

# Upload Configuration
MAX_FILE_SIZE=5242880  # 5MB in bytes
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

### 4. Cloudinary Config File

Create `/config/cloudinary.js`:
```javascript
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure storage for different upload types
const createStorage = (folder, allowedFormats = ['jpg', 'png', 'gif', 'webp']) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `artlink/${folder}`,
      allowed_formats: allowedFormats,
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ],
    },
  });
};

// Storage configurations for different use cases
export const avatarStorage = createStorage('avatars', ['jpg', 'png']);
export const portfolioStorage = createStorage('portfolios', ['jpg', 'png', 'gif', 'webp']);
export const projectStorage = createStorage('projects', ['jpg', 'png', 'pdf']);

// Multer configurations
export const avatarUpload = multer({
  storage: avatarStorage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG and PNG are allowed for avatars.'), false);
    }
  },
});

export const portfolioUpload = multer({
  storage: portfolioStorage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type for portfolio images.'), false);
    }
  },
});

export default cloudinary;
```

---

## 🛠️ Service Implementation

### Create `/services/cloudinary.service.js`

```javascript
import cloudinary from '../config/cloudinary.js';

class CloudinaryService {
  /**
   * Upload single image to Cloudinary
   * @param {Object} file - Multer file object
   * @param {string} folder - Cloudinary folder name
   * @param {Object} options - Additional upload options
   * @returns {Promise<Object>} Upload result
   */
  async uploadImage(file, folder = 'general', options = {}) {
    try {
      const uploadOptions = {
        folder: `artlink/${folder}`,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
        ...options
      };

      const result = await cloudinary.uploader.upload(file.path, uploadOptions);
      
      return {
        success: true,
        data: {
          publicId: result.public_id,
          url: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
          createdAt: result.created_at
        }
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Upload multiple images
   * @param {Array} files - Array of multer file objects
   * @param {string} folder - Cloudinary folder name
   * @returns {Promise<Object>} Upload results
   */
  async uploadMultipleImages(files, folder = 'general') {
    try {
      const uploadPromises = files.map(file => 
        this.uploadImage(file, folder)
      );

      const results = await Promise.all(uploadPromises);
      const successful = results.filter(result => result.success);
      const failed = results.filter(result => !result.success);

      return {
        success: failed.length === 0,
        successful: successful.map(result => result.data),
        failed: failed.map(result => result.error),
        totalUploaded: successful.length,
        totalFailed: failed.length
      };
    } catch (error) {
      console.error('Multiple upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete image from Cloudinary
   * @param {string} publicId - Cloudinary public ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      
      return {
        success: result.result === 'ok',
        result: result.result,
        publicId
      };
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete multiple images
   * @param {Array} publicIds - Array of public IDs
   * @returns {Promise<Object>} Deletion results
   */
  async deleteMultipleImages(publicIds) {
    try {
      const result = await cloudinary.api.delete_resources(publicIds);
      
      return {
        success: true,
        deleted: result.deleted,
        deletedCounts: result.deleted_counts,
        partialPublicIds: result.partial_public_ids
      };
    } catch (error) {
      console.error('Multiple delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate optimized URL with transformations
   * @param {string} publicId - Cloudinary public ID
   * @param {Object} transformations - Transformation options
   * @returns {string} Optimized URL
   */
  generateOptimizedUrl(publicId, transformations = {}) {
    const defaultTransformations = {
      quality: 'auto',
      fetch_format: 'auto'
    };

    return cloudinary.url(publicId, {
      ...defaultTransformations,
      ...transformations
    });
  }

  /**
   * Generate thumbnail URL
   * @param {string} publicId - Cloudinary public ID
   * @param {number} width - Thumbnail width
   * @param {number} height - Thumbnail height
   * @returns {string} Thumbnail URL
   */
  generateThumbnail(publicId, width = 150, height = 150) {
    return this.generateOptimizedUrl(publicId, {
      width,
      height,
      crop: 'fill',
      gravity: 'face'
    });
  }

  /**
   * Get image details
   * @param {string} publicId - Cloudinary public ID
   * @returns {Promise<Object>} Image details
   */
  async getImageDetails(publicId) {
    try {
      const result = await cloudinary.api.resource(publicId);
      
      return {
        success: true,
        data: {
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
          url: result.secure_url,
          createdAt: result.created_at,
          tags: result.tags
        }
      };
    } catch (error) {
      console.error('Get image details error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Search images by tags
   * @param {Array} tags - Array of tags to search
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results
   */
  async searchImagesByTags(tags, options = {}) {
    try {
      const searchOptions = {
        expression: `tags:${tags.join(' AND tags:')}`,
        max_results: options.maxResults || 50,
        sort_by: options.sortBy || [{ created_at: 'desc' }]
      };

      const result = await cloudinary.search
        .expression(searchOptions.expression)
        .max_results(searchOptions.max_results)
        .sort_by(...searchOptions.sort_by)
        .execute();

      return {
        success: true,
        data: result.resources,
        totalCount: result.total_count
      };
    } catch (error) {
      console.error('Search images error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new CloudinaryService();
```

---

## 🎮 Controller Integration

### Update Controllers to Handle File Uploads

#### User Controller (`/controllers/user.controller.js`)
Add avatar upload functionality:
```javascript
import CloudinaryService from '../services/cloudinary.service.js';

// Add this method to your existing user controller
export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const uploadResult = await CloudinaryService.uploadImage(req.file, 'avatars');
    
    if (!uploadResult.success) {
      return res.status(400).json({ error: uploadResult.error });
    }

    // Update user's avatar URL
    let avatarUrl = uploadResult.data.url;
    
    // Update appropriate profile (client or freelancer)
    if (user.role === 'client') {
      const client = await Clients.findOne({ where: { userId } });
      if (client) {
        // Delete old avatar if exists
        if (client.avatarUrl) {
          const oldPublicId = client.avatarUrl.split('/').pop().split('.')[0];
          await CloudinaryService.deleteImage(`artlink/avatars/${oldPublicId}`);
        }
        
        await client.update({ avatarUrl });
      }
    } else if (user.role === 'freelancer') {
      const freelancer = await Freelancers.findOne({ where: { userId } });
      if (freelancer) {
        // Delete old avatar if exists
        if (freelancer.avatarUrl) {
          const oldPublicId = freelancer.avatarUrl.split('/').pop().split('.')[0];
          await CloudinaryService.deleteImage(`artlink/avatars/${oldPublicId}`);
        }
        
        await freelancer.update({ avatarUrl });
      }
    }

    res.status(200).json({
      message: 'Avatar uploaded successfully',
      avatarUrl,
      imageDetails: uploadResult.data
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
};
```

#### Portfolio Controller (`/controllers/portfolio.controller.js`)
Add portfolio image upload functionality:
```javascript
import CloudinaryService from '../services/cloudinary.service.js';

// Add this method to your existing portfolio controller
export const uploadPortfolioImages = async (req, res) => {
  try {
    const portfolioId = req.params.id;
    
    // Check if portfolio exists
    const portfolio = await Portfolios.findByPk(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Upload to Cloudinary
    const uploadResult = await CloudinaryService.uploadMultipleImages(req.files, 'portfolios');
    
    if (!uploadResult.success) {
      return res.status(400).json({ error: 'Some uploads failed', details: uploadResult.failed });
    }

    // Update portfolio with new image URLs
    const imageUrls = uploadResult.successful.map(img => img.url);
    
    // If portfolio already has images, you might want to keep them or replace them
    const existingImages = portfolio.imageUrl ? [portfolio.imageUrl] : [];
    const allImages = [...existingImages, ...imageUrls];
    
    await portfolio.update({ 
      imageUrl: allImages[0], // Main image
      // You might want to add an images array field to store multiple URLs
    });

    res.status(200).json({
      message: 'Portfolio images uploaded successfully',
      uploadedCount: uploadResult.totalUploaded,
      images: uploadResult.successful
    });

  } catch (error) {
    console.error('Portfolio upload error:', error);
    res.status(500).json({ error: 'Failed to upload portfolio images' });
  }
};

export const createPortfolioWithImages = async (req, res) => {
  try {
    const { freelancerId, title, description, projectUrl, tags } = req.body;
    
    // Validate required fields
    if (!freelancerId || !title) {
      return res.status(400).json({ error: 'FreelancerId and title are required' });
    }

    let imageUrl = null;
    let uploadedImages = [];

    // Handle image uploads if provided
    if (req.files && req.files.length > 0) {
      const uploadResult = await CloudinaryService.uploadMultipleImages(req.files, 'portfolios');
      
      if (uploadResult.success) {
        uploadedImages = uploadResult.successful;
        imageUrl = uploadedImages[0]?.url; // Use first image as main image
      }
    }

    // Create portfolio
    const portfolio = await Portfolios.create({
      freelancerId,
      title,
      description,
      imageUrl,
      projectUrl,
      tags: Array.isArray(tags) ? tags : tags ? [tags] : []
    });

    res.status(201).json({
      message: 'Portfolio created successfully',
      portfolio,
      uploadedImages
    });

  } catch (error) {
    console.error('Create portfolio error:', error);
    res.status(500).json({ error: 'Failed to create portfolio' });
  }
};
```

---

## 🛣️ Route Implementation

### Update Routes to Handle File Uploads

#### User Routes (`/routes/user.routes.js`)
```javascript
import express from 'express';
import { avatarUpload } from '../config/cloudinary.js';
import { 
  createUser, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  getUserByEmail, 
  getUserByRole,
  uploadAvatar  // New import
} from '../controllers/user.controller.js';

const router = express.Router();

// Existing routes
router.post('/', createUser);
router.get('/email/:email', getUserByEmail);
router.get('/role/:role', getUserByRole);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// New avatar upload route
router.post('/:id/avatar', avatarUpload.single('avatar'), uploadAvatar);

export default router;
```

#### Portfolio Routes (`/routes/portfolio.routes.js`)
```javascript
import express from 'express';
import { portfolioUpload } from '../config/cloudinary.js';
import { 
  createPortfolio, 
  getAllPortfolios, 
  getPortfolioById, 
  updatePortfolio, 
  deletePortfolio,
  uploadPortfolioImages,    // New import
  createPortfolioWithImages // New import
} from '../controllers/portfolio.controller.js';

const router = express.Router();

// Existing routes
router.get('/', getAllPortfolios);
router.get('/:id', getPortfolioById);
router.put('/:id', updatePortfolio);
router.delete('/:id', deletePortfolio);

// Updated create route to handle images
router.post('/', portfolioUpload.array('images', 5), createPortfolioWithImages);

// New image upload route for existing portfolios
router.post('/:id/images', portfolioUpload.array('images', 5), uploadPortfolioImages);

export default router;
```

#### Dedicated Upload Routes (`/routes/upload.routes.js`)
Create a new file for general upload handling:
```javascript
import express from 'express';
import { avatarUpload, portfolioUpload } from '../config/cloudinary.js';
import CloudinaryService from '../services/cloudinary.service.js';
import { authenticate } from '../middlewares/auth.middleware.js'; // When auth is implemented

const router = express.Router();

// General image upload endpoint
router.post('/image', authenticate, portfolioUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const uploadResult = await CloudinaryService.uploadImage(req.file, 'general');
    
    if (!uploadResult.success) {
      return res.status(400).json({ error: uploadResult.error });
    }

    res.status(200).json({
      message: 'Image uploaded successfully',
      image: uploadResult.data
    });

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Multiple images upload endpoint
router.post('/images', authenticate, portfolioUpload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadResult = await CloudinaryService.uploadMultipleImages(req.files, 'general');

    res.status(200).json({
      message: 'Images uploaded successfully',
      successful: uploadResult.successful,
      failed: uploadResult.failed,
      totalUploaded: uploadResult.totalUploaded,
      totalFailed: uploadResult.totalFailed
    });

  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

// Delete image endpoint
router.delete('/image/:publicId', authenticate, async (req, res) => {
  try {
    const { publicId } = req.params;
    const fullPublicId = `artlink/general/${publicId}`;
    
    const deleteResult = await CloudinaryService.deleteImage(fullPublicId);
    
    if (!deleteResult.success) {
      return res.status(400).json({ error: deleteResult.error });
    }

    res.status(200).json({
      message: 'Image deleted successfully',
      publicId: deleteResult.publicId
    });

  } catch (error) {
    console.error('Image delete error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;
```

### Update Server.js
Add the upload routes to your main server file:
```javascript
// Add this import
import uploadRoutes from './routes/upload.routes.js';

// Add this route
app.use('/api/upload', uploadRoutes);
```

---

## 🌐 Frontend Integration Examples

### JavaScript/Fetch Examples

#### Upload Avatar
```javascript
// Upload user avatar
const uploadAvatar = async (userId, file) => {
  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const response = await fetch(`/api/users/${userId}/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}` // When auth is implemented
      },
      body: formData
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('Avatar uploaded:', result.avatarUrl);
      return result;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

// Usage
const fileInput = document.getElementById('avatar-input');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const result = await uploadAvatar(123, file);
      // Update UI with new avatar URL
      document.getElementById('avatar-img').src = result.avatarUrl;
    } catch (error) {
      alert('Upload failed: ' + error.message);
    }
  }
});
```

#### Create Portfolio with Images
```javascript
const createPortfolioWithImages = async (portfolioData, imageFiles) => {
  const formData = new FormData();
  
  // Add portfolio data
  formData.append('freelancerId', portfolioData.freelancerId);
  formData.append('title', portfolioData.title);
  formData.append('description', portfolioData.description);
  formData.append('projectUrl', portfolioData.projectUrl);
  
  // Add tags
  portfolioData.tags.forEach(tag => {
    formData.append('tags', tag);
  });
  
  // Add images
  imageFiles.forEach(file => {
    formData.append('images', file);
  });

  try {
    const response = await fetch('/api/portfolio', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('Portfolio created:', result);
      return result;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Portfolio creation failed:', error);
    throw error;
  }
};
```

### React Examples

#### Avatar Upload Component
```jsx
import React, { useState } from 'react';

const AvatarUpload = ({ userId, currentAvatar, onAvatarUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentAvatar);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`/api/users/${userId}/avatar`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (response.ok) {
        setPreview(result.avatarUrl);
        onAvatarUpdate(result.avatarUrl);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setPreview(currentAvatar); // Revert preview
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="avatar-upload">
      <div className="avatar-preview">
        <img 
          src={preview || '/default-avatar.png'} 
          alt="Avatar" 
          style={{ width: '100px', height: '100px', borderRadius: '50%' }}
        />
        {uploading && <div className="upload-spinner">Uploading...</div>}
      </div>
      
      <input 
        type="file" 
        accept="image/jpeg,image/png" 
        onChange={handleFileSelect}
        disabled={uploading}
      />
    </div>
  );
};

export default AvatarUpload;
```

#### Portfolio Image Upload Component
```jsx
import React, { useState } from 'react';

const PortfolioImageUpload = ({ portfolioId, onImagesUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = async (files) => {
    const validFiles = Array.from(files).filter(file => 
      ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)
    );

    if (validFiles.length === 0) {
      alert('Please select valid image files');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      validFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch(`/api/portfolio/${portfolioId}/images`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (response.ok) {
        onImagesUploaded(result.images);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e) => {
    handleFiles(e.target.files);
  };

  return (
    <div 
      className={`portfolio-upload ${dragOver ? 'drag-over' : ''}`}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
    >
      {uploading ? (
        <div className="upload-progress">Uploading images...</div>
      ) : (
        <>
          <p>Drag & drop images here or click to select</p>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleFileInput}
            style={{ display: 'none' }}
            id="portfolio-file-input"
          />
          <label htmlFor="portfolio-file-input" className="upload-button">
            Select Images
          </label>
        </>
      )}
    </div>
  );
};

export default PortfolioImageUpload;
```

---

## ⚠️ Error Handling

### Common Error Scenarios

#### File Upload Errors
```javascript
// In your controllers
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({ 
          error: 'File too large', 
          maxSize: '5MB' 
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({ 
          error: 'Too many files', 
          maxCount: 5 
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({ 
          error: 'Unexpected field name' 
        });
      default:
        return res.status(400).json({ 
          error: 'Upload error', 
          details: error.message 
        });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({ 
      error: 'Invalid file type',
      allowedTypes: ['JPEG', 'PNG', 'GIF', 'WebP']
    });
  }
  
  next(error);
};
```

#### Cloudinary Service Error Handling
```javascript
// Enhanced error handling in service methods
async uploadImage(file, folder = 'general', options = {}) {
  try {
    // ... upload logic
  } catch (error) {
    // Log detailed error for debugging
    console.error('Cloudinary upload error:', {
      error: error.message,
      code: error.http_code,
      file: file ? file.originalname : 'unknown',
      folder,
      timestamp: new Date().toISOString()
    });

    // Return user-friendly error
    if (error.http_code === 400) {
      return {
        success: false,
        error: 'Invalid file or upload parameters'
      };
    } else if (error.http_code === 401) {
      return {
        success: false,
        error: 'Cloudinary authentication failed'
      };
    } else if (error.http_code === 420) {
      return {
        success: false,
        error: 'Upload quota exceeded'
      };
    } else {
      return {
        success: false,
        error: 'Upload service temporarily unavailable'
      };
    }
  }
}
```

### Error Middleware
Add to your routes:
```javascript
import { handleUploadError } from '../controllers/upload.controller.js';

// Apply error handler to upload routes
router.post('/:id/avatar', avatarUpload.single('avatar'), uploadAvatar, handleUploadError);
```

---

## 🔒 Security Considerations

### File Validation

#### 1. File Type Validation
```javascript
const validateFileType = (file, allowedTypes) => {
  // Check MIME type
  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`);
  }
  
  // Additional check: validate file signature (magic numbers)
  const fileBuffer = fs.readFileSync(file.path);
  const signature = fileBuffer.toString('hex', 0, 4);
  
  const signatures = {
    'image/jpeg': ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2'],
    'image/png': ['89504e47'],
    'image/gif': ['47494638']
  };
  
  const expectedSignatures = signatures[file.mimetype];
  if (expectedSignatures && !expectedSignatures.includes(signature)) {
    throw new Error('File signature does not match MIME type');
  }
};
```

#### 2. File Size Limits
```javascript
// Set different limits for different file types
const getFileSizeLimit = (fileType) => {
  const limits = {
    'image/jpeg': 5 * 1024 * 1024,  // 5MB
    'image/png': 5 * 1024 * 1024,   // 5MB
    'image/gif': 2 * 1024 * 1024,   // 2MB
    'application/pdf': 10 * 1024 * 1024, // 10MB
  };
  
  return limits[fileType] || 1 * 1024 * 1024; // Default 1MB
};
```

#### 3. Rate Limiting
```javascript
import rateLimit from 'express-rate-limit';

// Upload rate limiter
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 uploads per windowMs
  message: 'Too many uploads, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to upload routes
router.post('/avatar', uploadLimiter, avatarUpload.single('avatar'), uploadAvatar);
```

#### 4. User Authorization
```javascript
// Ensure users can only upload to their own profiles
const authorizeUpload = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const authenticatedUserId = req.user.id; // From auth middleware
    
    if (userId !== authenticatedUserId) {
      return res.status(403).json({ error: 'Unauthorized upload' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authorization check failed' });
  }
};
```

### Cloudinary Security

#### 1. Signed Uploads (for sensitive files)
```javascript
// Generate signed upload parameters
const generateSignedUploadParams = (folder, tags = []) => {
  const timestamp = Math.round((new Date()).getTime() / 1000);
  
  const params = {
    timestamp,
    folder: `artlink/${folder}`,
    tags: tags.join(','),
  };
  
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);
  
  return {
    ...params,
    signature,
    api_key: process.env.CLOUDINARY_API_KEY
  };
};
```

#### 2. Access Control
```javascript
// Set upload permissions
const secureUploadOptions = {
  access_mode: 'authenticated', // Requires signed URLs for access
  folder: 'artlink/private',
  tags: ['private', 'user-content'],
  context: {
    userId: req.user.id,
    uploadedAt: new Date().toISOString()
  }
};
```

---

## 🧪 Testing

### Unit Tests

#### Test Cloudinary Service
```javascript
// __tests__/services/cloudinary.service.test.js
import CloudinaryService from '../../services/cloudinary.service.js';
import cloudinary from '../../config/cloudinary.js';

// Mock Cloudinary
jest.mock('../../config/cloudinary.js');

describe('CloudinaryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadImage', () => {
    it('should upload image successfully', async () => {
      const mockFile = {
        path: '/tmp/test-image.jpg',
        originalname: 'test-image.jpg'
      };

      const mockResult = {
        public_id: 'artlink/test/image123',
        secure_url: 'https://res.cloudinary.com/test/image/upload/v123/artlink/test/image123.jpg',
        width: 800,
        height: 600,
        format: 'jpg',
        bytes: 102400,
        created_at: '2025-01-01T00:00:00Z'
      };

      cloudinary.uploader.upload.mockResolvedValue(mockResult);

      const result = await CloudinaryService.uploadImage(mockFile, 'test');

      expect(result.success).toBe(true);
      expect(result.data.url).toBe(mockResult.secure_url);
      expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
        mockFile.path,
        expect.objectContaining({
          folder: 'artlink/test'
        })
      );
    });

    it('should handle upload errors', async () => {
      const mockFile = { path: '/tmp/test-image.jpg' };
      const mockError = new Error('Upload failed');

      cloudinary.uploader.upload.mockRejectedValue(mockError);

      const result = await CloudinaryService.uploadImage(mockFile, 'test');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Upload failed');
    });
  });

  describe('deleteImage', () => {
    it('should delete image successfully', async () => {
      const mockResult = { result: 'ok' };
      cloudinary.uploader.destroy.mockResolvedValue(mockResult);

      const result = await CloudinaryService.deleteImage('test-public-id');

      expect(result.success).toBe(true);
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('test-public-id');
    });
  });
});
```

### Integration Tests

#### Test Upload Endpoints
```javascript
// __tests__/integration/upload.test.js
import request from 'supertest';
import app from '../../server.js';
import path from 'path';

describe('Upload Endpoints', () => {
  const testImagePath = path.join(__dirname, '../fixtures/test-image.jpg');

  describe('POST /api/users/:id/avatar', () => {
    it('should upload avatar successfully', async () => {
      const userId = 1;
      
      const response = await request(app)
        .post(`/api/users/${userId}/avatar`)
        .attach('avatar', testImagePath)
        .expect(200);

      expect(response.body.message).toBe('Avatar uploaded successfully');
      expect(response.body.avatarUrl).toMatch(/^https:\/\/res\.cloudinary\.com/);
    });

    it('should reject invalid file types', async () => {
      const userId = 1;
      const textFilePath = path.join(__dirname, '../fixtures/test.txt');

      const response = await request(app)
        .post(`/api/users/${userId}/avatar`)
        .attach('avatar', textFilePath)
        .expect(400);

      expect(response.body.error).toContain('Invalid file type');
    });

    it('should reject oversized files', async () => {
      const userId = 1;
      const largeImagePath = path.join(__dirname, '../fixtures/large-image.jpg');

      const response = await request(app)
        .post(`/api/users/${userId}/avatar`)
        .attach('avatar', largeImagePath)
        .expect(400);

      expect(response.body.error).toContain('File too large');
    });
  });
});
```

### Test Fixtures

Create test images for testing:
```bash
# Create test fixtures directory
mkdir -p __tests__/fixtures

# Create small test image (you can use any small image file)
# Copy a small JPEG file to __tests__/fixtures/test-image.jpg

# Create invalid file for testing
echo "This is not an image" > __tests__/fixtures/test.txt
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. "Invalid API Key" Error
**Symptoms:** 401 Unauthorized errors from Cloudinary
**Solutions:**
- Check `.env` file has correct Cloudinary credentials
- Verify credentials in Cloudinary dashboard
- Ensure no extra spaces in environment variables
- Restart server after changing `.env`

#### 2. "File not found" Error
**Symptoms:** Multer can't find uploaded file
**Solutions:**
- Check multer configuration
- Verify form field names match route expectations
- Ensure `enctype="multipart/form-data"` in forms
- Check file permissions on upload directory

#### 3. Images Not Displaying
**Symptoms:** Upload succeeds but images don't show
**Solutions:**
- Check returned URL format
- Verify Cloudinary folder permissions
- Test URL directly in browser
- Check CORS settings

#### 4. Upload Timeouts
**Symptoms:** Large files fail to upload
**Solutions:**
- Increase Express timeout limits
- Implement file compression
- Add upload progress indicators
- Consider chunked uploads for large files

#### 5. Database URL Not Updating
**Symptoms:** Upload succeeds but database not updated
**Solutions:**
- Check model field names match controller
- Verify database connection
- Add transaction handling
- Check for validation errors

### Debugging Tools

#### 1. Enable Cloudinary Logging
```javascript
// Add to cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  // Enable detailed logging
  debug: process.env.NODE_ENV === 'development'
});
```

#### 2. Request Logging Middleware
```javascript
const uploadLogger = (req, res, next) => {
  console.log('Upload request:', {
    method: req.method,
    url: req.url,
    files: req.files ? req.files.map(f => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      mimetype: f.mimetype,
      size: f.size
    })) : 'No files',
    body: req.body
  });
  next();
};

// Use in routes
router.post('/avatar', uploadLogger, avatarUpload.single('avatar'), uploadAvatar);
```

#### 3. Error Tracking
```javascript
const trackUploadError = (error, context) => {
  console.error('Upload Error:', {
    error: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
  
  // Send to error tracking service (e.g., Sentry)
  // Sentry.captureException(error, { extra: context });
};
```

### Performance Optimization

#### 1. Image Optimization
```javascript
// Optimize images on upload
const optimizationOptions = {
  quality: 'auto:best',
  fetch_format: 'auto',
  width: 1000,
  height: 1000,
  crop: 'limit'
};
```

#### 2. Lazy Loading URLs
```javascript
// Generate URLs on demand instead of storing them
const generateImageUrl = (publicId, transformations = {}) => {
  return cloudinary.url(publicId, {
    secure: true,
    ...transformations
  });
};
```

#### 3. Caching
```javascript
// Cache frequently accessed images
const imageCache = new Map();

const getCachedImageUrl = (publicId, transformations) => {
  const cacheKey = `${publicId}-${JSON.stringify(transformations)}`;
  
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }
  
  const url = generateImageUrl(publicId, transformations);
  imageCache.set(cacheKey, url);
  
  return url;
};
```

---

## 📚 Additional Resources

### Cloudinary Documentation
- [Cloudinary Node.js Guide](https://cloudinary.com/documentation/node_integration)
- [Upload API Reference](https://cloudinary.com/documentation/image_upload_api_reference)
- [Transformation Reference](https://cloudinary.com/documentation/image_transformation_reference)
- [Admin API](https://cloudinary.com/documentation/admin_api)

### Multer Documentation
- [Multer GitHub](https://github.com/expressjs/multer)
- [Multer-Storage-Cloudinary](https://github.com/affanshahid/multer-storage-cloudinary)

### Security Best Practices
- [OWASP File Upload Security](https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Document Author:** Backend Development Team  
**Last Updated:** July 23, 2025  
**Next Review:** July 30, 2025  

*Keep this document updated as you implement and refine the Cloudinary integration. Share any issues or improvements with the team.*