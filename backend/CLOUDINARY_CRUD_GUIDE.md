# Cloudinary CRUD Operations - Implementation Guide

## Overview
This implementation provides complete CRUD (Create, Read, Update, Delete) operations for Cloudinary image management in the ArtLink backend.

## Files Created/Modified
- `services/cloudinary.service.js` - Core Cloudinary operations
- `controllers/upload.controller.js` - HTTP request handlers
- `routes/upload.routes.js` - API endpoints
- `server.js` - Added upload routes

## 📁 New Files Created:

services/cloudinary.service.js - Core Cloudinary service with all CRUD operations
controllers/upload.controller.js - HTTP controllers for handling upload requests
routes/upload.routes.js - API routes with file upload middleware
test/cloudinary-test.js - Node.js test script
test/cloudinary-test.html - Interactive web interface for testing
CLOUDINARY_CRUD_GUIDE.md - Comprehensive documentation
setup-cloudinary.sh - Setup script for easy deployment

## 🚀 Features Implemented:

CREATE Operations:
✅ Upload single image
✅ Upload multiple images
✅ Upload avatar with auto-resize
✅ Upload portfolio images with organization
✅ Generate upload signatures for frontend
READ Operations:
✅ Get image details by public_id
✅ List images with filtering (folder, tags, pagination)
✅ Search images by various criteria
UPDATE Operations:
✅ Update image metadata (tags, context)
✅ Transform images (resize, crop, format conversion)
✅ Modify image properties
DELETE Operations:
✅ Delete single image
✅ Delete multiple images
✅ Delete entire folders
✅ Bulk delete operations

## API Endpoints

POST   /api/upload/image          - Upload single image
POST   /api/upload/images         - Upload multiple images
POST   /api/upload/avatar         - Upload user avatar
POST   /api/upload/portfolio      - Upload portfolio image
GET    /api/upload/image/:id      - Get image details
GET    /api/upload/images         - List images
PUT    /api/upload/image/:id      - Update image metadata
POST   /api/upload/transform/:id  - Transform image
DELETE /api/upload/image/:id      - Delete image
DELETE /api/upload/images         - Delete multiple images
DELETE /api/upload/folder/:name   - Delete folder
POST   /api/upload/signature      - Generate upload signature

## Testing the cloudinary with the html page 

file:///home/long/Desktop/New Folder 1/ArtLink/backend/test/cloudinary-test.html

### CREATE Operations

#### 1. Upload Single Image
```
POST /api/upload/image
Content-Type: multipart/form-data

Form Data:
- image: [file]
- folder: "artlink/general" (optional)
- public_id: "custom_id" (optional)
- tags: "tag1,tag2,tag3" (optional)
```

#### 2. Upload Multiple Images
```
POST /api/upload/images
Content-Type: multipart/form-data

Form Data:
- images: [file1, file2, file3]
- folder: "artlink/general" (optional)
- tags: "tag1,tag2,tag3" (optional)
```

#### 3. Upload Avatar
```
POST /api/upload/avatar
Content-Type: multipart/form-data

Form Data:
- avatar: [file]
- userId: "user_123" (required)
```

#### 4. Upload Portfolio Image
```
POST /api/upload/portfolio
Content-Type: multipart/form-data

Form Data:
- portfolio: [file]
- freelancerId: "freelancer_123" (required)
- portfolioId: "portfolio_456" (optional)
- title: "My Artwork" (optional)
- description: "Description of the artwork" (optional)
```

### READ Operations

#### 5. Get Image Details
```
GET /api/upload/image/{publicId}

Response:
{
  "success": true,
  "data": {
    "public_id": "artlink/image123",
    "url": "https://res.cloudinary.com/...",
    "format": "jpg",
    "width": 1920,
    "height": 1080,
    "bytes": 245760,
    "created_at": "2025-07-25T12:00:00Z",
    "tags": ["portfolio", "artwork"],
    "context": {"title": "My Artwork"}
  }
}
```

#### 6. List Images
```
GET /api/upload/images?folder=artlink&max_results=20&tags=portfolio

Query Parameters:
- folder: Filter by folder (default: "artlink")
- max_results: Number of results (default: 20, max: 50)
- next_cursor: For pagination
- tags: Filter by tags (comma-separated)

Response:
{
  "success": true,
  "data": {
    "resources": [...],
    "next_cursor": "next_page_token",
    "total_count": 150
  }
}
```

### UPDATE Operations

#### 7. Update Image Metadata
```
PUT /api/upload/image/{publicId}
Content-Type: application/json

Body:
{
  "tags": ["new_tag1", "new_tag2"],
  "context": {
    "title": "Updated Title",
    "description": "Updated Description"
  }
}
```

#### 8. Transform Image
```
POST /api/upload/transform/{publicId}
Content-Type: application/json

Body:
{
  "width": 500,
  "height": 500,
  "crop": "fill",
  "quality": "auto:good",
  "format": "webp"
}

Response:
{
  "success": true,
  "data": {
    "public_id": "artlink/image123",
    "original_url": "https://...",
    "transformed_url": "https://...w_500,h_500,c_fill,q_auto:good,f_webp",
    "transformation": {...}
  }
}
```

### DELETE Operations

#### 9. Delete Single Image
```
DELETE /api/upload/image/{publicId}

Response:
{
  "success": true,
  "message": "Image deleted successfully",
  "data": {
    "public_id": "artlink/image123",
    "result": "ok"
  }
}
```

#### 10. Delete Multiple Images
```
DELETE /api/upload/images
Content-Type: application/json

Body:
{
  "publicIds": ["image1", "image2", "image3"]
}

Response:
{
  "success": true,
  "message": "2/3 images deleted successfully",
  "data": {
    "deleted": [
      {"public_id": "image1", "success": true},
      {"public_id": "image2", "success": true}
    ],
    "not_found": ["image3"],
    "errors": [],
    "total": 3,
    "deletedCount": 2
  }
}
```

#### 11. Delete Folder
```
DELETE /api/upload/folder/{folderName}

Response:
{
  "success": true,
  "message": "Folder deleted successfully",
  "data": {
    "deleted": {"image1": "deleted", "image2": "deleted"},
    "total_deleted": 2
  }
}
```

### UTILITY Operations

#### 12. Generate Upload Signature
```
POST /api/upload/signature
Content-Type: application/json

Body:
{
  "folder": "artlink/portfolios",
  "public_id": "custom_id"
}

Response:
{
  "success": true,
  "data": {
    "signature": "signature_string",
    "timestamp": 1627123456,
    "api_key": "your_api_key",
    "cloud_name": "your_cloud_name"
  }
}
```

## Usage Examples

### Frontend JavaScript Examples

#### Upload Single Image with Fetch
```javascript
const uploadImage = async (file, folder = 'artlink/general') => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);
  formData.append('tags', 'portfolio,artwork');

  try {
    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    if (result.success) {
      console.log('Upload successful:', result.data.url);
      return result.data;
    } else {
      console.error('Upload failed:', result.message);
    }
  } catch (error) {
    console.error('Upload error:', error);
  }
};
```

#### Upload Avatar
```javascript
const uploadAvatar = async (file, userId) => {
  const formData = new FormData();
  formData.append('avatar', file);
  formData.append('userId', userId);

  try {
    const response = await fetch('/api/upload/avatar', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}` // Add auth token
      }
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Avatar upload error:', error);
  }
};
```

#### List Portfolio Images
```javascript
const getPortfolioImages = async (freelancerId) => {
  try {
    const response = await fetch(
      `/api/upload/images?folder=artlink/portfolios/${freelancerId}&max_results=20`
    );
    
    const result = await response.json();
    if (result.success) {
      return result.data.resources;
    }
  } catch (error) {
    console.error('Error fetching portfolio:', error);
  }
};
```

#### Delete Image
```javascript
const deleteImage = async (publicId) => {
  try {
    const response = await fetch(`/api/upload/image/${publicId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
};
```

### Backend Service Usage Examples

#### Direct Service Usage in Controllers
```javascript
import {
  uploadImage,
  listImages,
  deleteImage
} from '../services/cloudinary.service.js';

// In a controller function
const handlePortfolioUpload = async (req, res) => {
  try {
    const result = await uploadImage(req.file.path, {
      folder: `artlink/portfolios/${req.user.id}`,
      transformation: {
        width: 1200,
        height: 800,
        crop: 'fill',
        quality: 'auto:good'
      }
    });

    if (result.success) {
      // Save to database
      // Update portfolio record
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

## Error Handling

All operations return a standardized response format:
```javascript
// Success
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}

// Error
{
  "success": false,
  "error": "Error description",
  "message": "User-friendly error message"
}
```

## Security Considerations

1. **File Validation**: Only image files are accepted (jpeg, jpg, png, gif, webp, svg)
2. **File Size Limits**: Maximum 10MB per file
3. **File Count Limits**: Maximum 10 files per upload
4. **Authentication**: Protected routes require authentication middleware
5. **Input Sanitization**: All inputs are validated and sanitized

## Folder Structure

The implementation organizes images in the following folder structure:
```
artlink/
├── general/          # General uploads
├── avatars/          # User avatars
├── portfolios/       # Portfolio images
│   ├── freelancer_1/ # Organized by freelancer ID
│   ├── freelancer_2/
│   └── ...
└── projects/         # Project-related images
```

## Integration with Database Models

### Portfolio Model Integration
```javascript
// After successful Cloudinary upload
const portfolioData = {
  freelancerId: req.user.id,
  title: req.body.title,
  description: req.body.description,
  imageUrl: result.data.url,
  cloudinaryPublicId: result.data.public_id,
  tags: req.body.tags.split(',')
};

const portfolio = await Portfolio.create(portfolioData);
```

### User Avatar Integration
```javascript
// Update user avatar
await User.update({
  avatarUrl: result.data.url,
  avatarPublicId: result.data.public_id
}, {
  where: { id: userId }
});
```

## Testing

You can test the endpoints using tools like Postman or curl:

```bash
# Upload image
curl -X POST \
  http://localhost:3000/api/upload/image \
  -H 'Content-Type: multipart/form-data' \
  -F 'image=@/path/to/image.jpg' \
  -F 'folder=artlink/test' \
  -F 'tags=test,sample'

# Get image details
curl -X GET http://localhost:3000/api/upload/image/artlink/test/image123

# List images
curl -X GET "http://localhost:3000/api/upload/images?folder=artlink&max_results=10"

# Delete image
curl -X DELETE http://localhost:3000/api/upload/image/artlink/test/image123
```

This implementation provides a complete, production-ready Cloudinary integration with proper error handling, security measures, and comprehensive CRUD operations for the ArtLink platform.
