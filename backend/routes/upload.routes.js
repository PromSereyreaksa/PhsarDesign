// routes/upload.routes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { validateFileUpload } from '../middlewares/security.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
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
} from '../controllers/upload.controller.js';

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp, svg)'));
  }
};

// Multer middleware configurations
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files
  }
});

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 10 files.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name for file upload.'
      });
    }
  }
  
  if (error.message.includes('Only image files are allowed')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next(error);
};

// UPLOAD ROUTES

/**
 * @route POST /api/upload/image
 * @desc Upload single image
 * @access Protected
 */
router.post('/image', authenticate, upload.single('image'), handleMulterError, validateFileUpload, uploadSingleImage);

/**
 * @route POST /api/upload/images
 * @desc Upload multiple images
 * @access Protected
 */
router.post('/images', authenticate, upload.array('images', 10), handleMulterError, validateFileUpload, uploadMultipleFiles);

/**
 * @route POST /api/upload/avatar
 * @desc Upload user avatar
 * @access Protected
 */
router.post('/avatar', authenticate, upload.single('avatar'), handleMulterError, validateFileUpload, uploadAvatar);

/**
 * @route POST /api/upload/portfolio
 * @desc Upload portfolio image
 * @access Protected
 */
router.post('/portfolio', authenticate, upload.single('portfolio'), handleMulterError, validateFileUpload, uploadPortfolioImage);

// READ ROUTES

/**
 * @route GET /api/upload/image/:publicId
 * @desc Get image details by public ID
 * @access Public
 */
router.get('/image/:publicId', getImage);

/**
 * @route GET /api/upload/images
 * @desc List images with optional filters
 * @access Public
 * @query folder, max_results, next_cursor, tags
 */
router.get('/images', getImages);

// UPDATE ROUTES

/**
 * @route PUT /api/upload/image/:publicId
 * @desc Update image metadata (tags, context)
 * @access Protected (require authentication)
 */
router.put('/image/:publicId', updateImage);

/**
 * @route POST /api/upload/transform/:publicId
 * @desc Transform existing image
 * @access Public
 */
router.post('/transform/:publicId', transformImageEndpoint);

// DELETE ROUTES

/**
 * @route DELETE /api/upload/image/:publicId
 * @desc Delete single image
 * @access Protected (require authentication)
 */
router.delete('/image/:publicId', deleteImageEndpoint);

/**
 * @route DELETE /api/upload/images
 * @desc Delete multiple images
 * @access Protected (require authentication)
 */
router.delete('/images', deleteMultipleImagesEndpoint);

/**
 * @route DELETE /api/upload/folder/:folderName
 * @desc Delete entire folder
 * @access Protected (require admin role)
 */
router.delete('/folder/:folderName', deleteFolderEndpoint);

// UTILITY ROUTES

/**
 * @route POST /api/upload/signature
 * @desc Generate upload signature for frontend uploads
 * @access Protected (require authentication)
 */
router.post('/signature', getUploadSignature);

// Error handling middleware
router.use((error, req, res, next) => {
  console.error('Upload route error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});

export default router;
