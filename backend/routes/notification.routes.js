import express from "express";
import { 
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount,
  getNotificationTypes
} from "../controllers/notification.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { param, body } from "express-validator";
import { handleValidationErrors } from "../middlewares/security.middleware.js";
import { validate as isUUID } from 'uuid';

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  [
    body('userId').isInt({ min: 1 }).withMessage('User ID must be a valid integer'),
    body('type').isIn(['application_received', 'application_accepted', 'application_rejected', 'project_completed', 'message_received', 'project_invite', 'payment_received', 'review_received']).withMessage('Invalid notification type'),
    body('title').trim().isLength({ min: 1, max: 255 }).withMessage('Title must be between 1 and 255 characters'),
    body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters'),
    body('actionUrl').optional().isURL().withMessage('Action URL must be valid'),
    body('relatedProjectId').optional().custom((value) => {
      if (value && !isUUID(value)) {
        throw new Error('Related project ID must be a valid UUID');
      }
      return true;
    }),
    body('relatedApplicationId').optional().isInt({ min: 1 }).withMessage('Related application ID must be a valid integer'),
    body('priority').optional().isIn(['low', 'normal', 'high', 'urgent']).withMessage('Invalid priority'),
    handleValidationErrors
  ],
  createNotification
);

router.get("/", authenticateToken, getUserNotifications);

router.get("/types", getNotificationTypes);

router.get("/unread-count", authenticateToken, getUnreadNotificationCount);

router.patch("/mark-all-read", authenticateToken, markAllNotificationsAsRead);

router.patch(
  "/:notificationId/read",
  authenticateToken,
  [
    param('notificationId').custom((value) => {
      if (!isUUID(value)) {
        throw new Error('Notification ID must be a valid UUID');
      }
      return true;
    }),
    handleValidationErrors
  ],
  markNotificationAsRead
);

router.delete(
  "/:notificationId",
  authenticateToken,
  [
    param('notificationId').custom((value) => {
      if (!isUUID(value)) {
        throw new Error('Notification ID must be a valid UUID');
      }
      return true;
    }),
    handleValidationErrors
  ],
  deleteNotification
);

export default router;