import express from "express";
import { 
  createApplication,
  getArtistApplications,
  getProjectApplications,
  updateApplicationStatus,
  deleteApplication,
  getApplicationById,
  applyToService,
  convertApplicationToProject,
  getApplicationsByType
} from "../controllers/applications.controller.js";
import { Applications } from "../models/index.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validateApplication } from "../middlewares/security.middleware.js";
import { param, body } from "express-validator";
import { handleValidationErrors } from "../middlewares/security.middleware.js";
import { validate as isUUID } from 'uuid';

const router = express.Router();

// Add general GET route for all applications
router.get(
  "/",
  // authenticateToken, // TEMPORARILY DISABLED
  async (req, res) => {
    try {
      const { limit = 20, offset = 0 } = req.query;
      const applications = await Applications.findAndCountAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });
      
      res.json({
        success: true,
        data: {
          applications: applications.rows,
          total: applications.count,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });
    } catch (error) {
      console.error("Applications fetch error:", error);
      res.status(500).json({ message: "Failed to fetch applications", error: error.message });
    }
  }
);

router.post(
  "/",
  authenticate,
  // authorize(['artist', 'client']), // Allow both roles for applications
  // validateApplication, // Keep temporarily disabled for testing
  createApplication
);

router.get(
  "/artist/:artistId",
  authenticate,
  [
    param('artistId').isInt({ min: 1 }).withMessage('Artist ID must be a valid integer'),
    handleValidationErrors
  ],
  getArtistApplications
);

router.get(
  "/project/:projectId",
  authenticate,
  authorize(['client']),
  [
    param('projectId').custom((value) => {
      if (!isUUID(value)) {
        throw new Error('Project ID must be a valid UUID');
      }
      return true;
    }),
    handleValidationErrors
  ],
  getProjectApplications
);

router.get(
  "/:applicationId",
  authenticate,
  [
    param('applicationId').isInt({ min: 1 }).withMessage('Application ID must be a valid integer'),
    handleValidationErrors
  ],
  getApplicationById
);

router.patch(
  "/:applicationId/status",
  authenticate,
  authorize(['client']),
  [
    param('applicationId').isInt({ min: 1 }).withMessage('Application ID must be a valid integer'),
    body('status').isIn(['pending', 'accepted', 'rejected']).withMessage('Status must be pending, accepted, or rejected'),
    body('clientMessage').optional().trim().isLength({ max: 1000 }).withMessage('Client message must not exceed 1000 characters'),
    handleValidationErrors
  ],
  updateApplicationStatus
);

router.delete(
  "/:applicationId",
  authenticate,
  [
    param('applicationId').isInt({ min: 1 }).withMessage('Application ID must be a valid integer'),
    handleValidationErrors
  ],
  deleteApplication
);

router.post(
  "/service",
  // authenticateToken,
  // authorize(['client', 'artist']),
  // VALIDATION TEMPORARILY DISABLED FOR TESTING
  // [
  //   body('availabilityPostId').custom((value) => {
  //     if (!isUUID(value)) {
  //       throw new Error('Availability Post ID must be a valid UUID');
  //     }
  //     return true;
  //   }),
  //   body('clientId').isInt({ min: 1 }).withMessage('Client ID must be a valid integer'),
  //   body('message').trim().isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5000 characters'),
  //   body('proposedBudget').optional().isFloat({ min: 0 }).withMessage('Proposed budget must be a positive number'),
  //   body('proposedDeadline').optional().isISO8601().withMessage('Proposed deadline must be a valid date'),
  //   handleValidationErrors
  // ],
  applyToService
);

router.post(
  "/:applicationId/convert-to-project",
  authenticate,
  [
    param('applicationId').isInt({ min: 1 }).withMessage('Application ID must be a valid integer'),
    body('title').optional().trim().isLength({ min: 5, max: 255 }).withMessage('Title must be between 5 and 255 characters'),
    body('description').optional().trim().isLength({ min: 20, max: 5000 }).withMessage('Description must be between 20 and 5000 characters'),
    body('budget').optional().isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
    body('deadline').optional().isISO8601().withMessage('Deadline must be a valid date'),
    handleValidationErrors
  ],
  convertApplicationToProject
);

router.get(
  "/type/:type",
  authenticate,
  [
    param('type').isIn(['artist_to_job', 'client_to_service']).withMessage('Type must be artist_to_job or client_to_service'),
    handleValidationErrors
  ],
  getApplicationsByType
);

export default router;