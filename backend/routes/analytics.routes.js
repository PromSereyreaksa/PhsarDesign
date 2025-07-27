import express from "express";
import { getArtistAnalytics, getClientAnalytics, trackAnalytics } from "../controllers/analytics.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { param, body } from "express-validator";
import { handleValidationErrors } from "../middlewares/security.middleware.js";

const router = express.Router();

router.get(
  "/artist/:artistId",
  authenticateToken,
  [
    param('artistId').isInt({ min: 1 }).withMessage('Artist ID must be a valid integer'),
    handleValidationErrors
  ],
  getArtistAnalytics
);

router.get(
  "/client/:clientId", 
  authenticateToken,
  [
    param('clientId').isInt({ min: 1 }).withMessage('Client ID must be a valid integer'),
    handleValidationErrors
  ],
  getClientAnalytics
);

router.post(
  "/track",
  [
    body('eventType')
      .isIn(['profile_view', 'portfolio_view', 'project_view', 'application_submitted', 'application_accepted', 'project_completed', 'message_sent', 'like_given'])
      .withMessage('Invalid event type'),
    body('entityType')
      .optional()
      .isIn(['profile', 'portfolio', 'project', 'application', 'message'])
      .withMessage('Invalid entity type'),
    body('artistId').optional().isInt({ min: 1 }).withMessage('Artist ID must be a valid integer'),
    body('clientId').optional().isInt({ min: 1 }).withMessage('Client ID must be a valid integer'),
    handleValidationErrors
  ],
  trackAnalytics
);

export default router;