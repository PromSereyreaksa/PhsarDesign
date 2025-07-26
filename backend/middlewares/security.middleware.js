import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, param, validationResult } from 'express-validator';
import { validate as isUUID } from 'uuid';

// Rate limiting configurations
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    resetTime: new Date(Date.now() + 15 * 60 * 1000)
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 authentication attempts per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    resetTime: new Date(Date.now() + 15 * 60 * 1000)
  },
  skipSuccessfulRequests: true, // Don't count successful requests
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each IP to 50 uploads per hour
  message: {
    error: 'Too many upload attempts, please try again later.',
    resetTime: new Date(Date.now() + 60 * 60 * 1000)
  },
});

// Security headers configuration
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.cloudinary.com"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow embedding for development
});

// Input sanitization function
export const sanitizeInput = (req, res, next) => {
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    // Remove potential NoSQL injection patterns and XSS attempts
    return str.replace(/[\$\.]/g, '').replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  };

  const sanitizeObj = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeObj(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };

  // Only sanitize if the properties exist and are writable
  try {
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObj(req.body);
    }
    
    // For query and params, we need to be more careful as they might be read-only
    if (req.query && typeof req.query === 'object') {
      const sanitizedQuery = sanitizeObj(req.query);
      // Only reassign if we can
      try {
        req.query = sanitizedQuery;
      } catch (e) {
        // If we can't reassign, create a new property
        req.sanitizedQuery = sanitizedQuery;
      }
    }
  } catch (error) {
    console.warn('Sanitization warning:', error.message);
  }
  
  next();
};

// Validation middleware
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  next();
};

// Common validation rules
export const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('userType')
    .isIn(['freelancer', 'client'])
    .withMessage('User type must be either freelancer or client'),
  handleValidationErrors
];

export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Updated project validation with UUID support
export const validateProject = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Project title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Project description must be between 10 and 2000 characters'),
  body('budget')
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number'),
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Deadline must be a valid date'),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
  body('clientId')
    .isInt({ min: 1 })
    .withMessage('Client ID must be a valid positive integer'),
  body('freelancerId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Freelancer ID must be a valid positive integer'),
  handleValidationErrors
];

export const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comment must not exceed 1000 characters'),
  handleValidationErrors
];

export const validatePortfolioUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('skills.*')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Each skill must be between 1 and 30 characters'),
  handleValidationErrors
];

// UUID validation middleware
export const validateUUID = [
  param('id')
    .custom((value) => {
      if (!isUUID(value)) {
        throw new Error('Invalid UUID format');
      }
      return true;
    }),
  handleValidationErrors
];

// Slug validation middleware
export const validateSlug = [
  param('slug')
    .matches(/^[a-z0-9-]+$/i)
    .withMessage('Slug can only contain letters, numbers, and hyphens')
    .isLength({ min: 1, max: 110 })
    .withMessage('Slug must be between 1 and 110 characters'),
  handleValidationErrors
];


// Client validation with slug generation
export const validateClient = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('organization')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Organization name must not exceed 255 characters'),
  body('userId')
    .isInt({ min: 1 })
    .withMessage('User ID must be a valid positive integer'),
  body('avatarUrl')
    .optional()
    .isURL()
    .withMessage('Avatar URL must be a valid URL'),
  handleValidationErrors
];

// Freelancer validation with slug generation
export const validateFreelancer = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('skills')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Skills must not exceed 1000 characters'),
  body('availability')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Availability must not exceed 50 characters'),
  body('userId')
    .isInt({ min: 1 })
    .withMessage('User ID must be a valid positive integer'),
  body('avatarUrl')
    .optional()
    .isURL()
    .withMessage('Avatar URL must be a valid URL'),
  handleValidationErrors
];

// Application validation with UUID project support
export const validateApplication = [
  body('projectId')
    .custom((value) => {
      if (!isUUID(value)) {
        throw new Error('Project ID must be a valid UUID');
      }
      return true;
    }),
  body('freelancerId')
    .isInt({ min: 1 })
    .withMessage('Freelancer ID must be a valid positive integer'),
  body('message')
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Message must be between 10 and 5000 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'accepted', 'rejected'])
    .withMessage('Status must be either pending, accepted, or rejected'),
  handleValidationErrors
];

// File upload validation
export const validateFileUpload = (req, res, next) => {
  if (!req.file && !req.files) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  const file = req.file || req.files[0];
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'
    });
  }

  if (file.size > maxSize) {
    return res.status(400).json({
      success: false,
      message: 'File size too large. Maximum size is 10MB.'
    });
  }

  next();
};

// IP whitelisting for admin endpoints (optional)
export const adminOnly = (req, res, next) => {
  const adminIPs = process.env.ADMIN_IPS?.split(',') || [];
  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (adminIPs.length > 0 && !adminIPs.includes(clientIP)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied from this IP address'
    });
  }
  
  next();
};

// Request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    };
    
    if (req.user) {
      logData.userId = req.user.id;
      logData.userType = req.user.userType;
    }
    
    // Log suspicious activity
    if (res.statusCode >= 400) {
      console.warn('Suspicious request:', logData);
    } else {
      console.log('Request:', logData);
    }
  });
  
  next();
};
