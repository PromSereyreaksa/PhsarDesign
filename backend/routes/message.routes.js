import express from "express";
import { 
  sendMessage,
  getConversation,
  getConversations,
  markMessagesAsRead,
  deleteMessage,
  getUnreadMessageCount
} from "../controllers/message.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { param, body } from "express-validator";
import { handleValidationErrors } from "../middlewares/security.middleware.js";
import { validate as isUUID } from 'uuid';

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  [
    body('receiverId').isInt({ min: 1 }).withMessage('Receiver ID must be a valid integer'),
    body('content').trim().isLength({ min: 1, max: 5000 }).withMessage('Content must be between 1 and 5000 characters'),
    body('messageType').optional().isIn(['text', 'image', 'file', 'system']).withMessage('Invalid message type'),
    body('projectId').optional().custom((value) => {
      if (value && !isUUID(value)) {
        throw new Error('Project ID must be a valid UUID');
      }
      return true;
    }),
    body('applicationId').optional().isInt({ min: 1 }).withMessage('Application ID must be a valid integer'),
    body('attachmentUrl').optional().isURL().withMessage('Attachment URL must be valid'),
    handleValidationErrors
  ],
  sendMessage
);

router.get("/", authenticateToken, getConversations);

router.get("/unread-count", authenticateToken, getUnreadMessageCount);

router.get(
  "/conversation/:otherUserId",
  authenticateToken,
  [
    param('otherUserId').isInt({ min: 1 }).withMessage('Other user ID must be a valid integer'),
    handleValidationErrors
  ],
  getConversation
);

router.patch(
  "/conversation/:otherUserId/read",
  authenticateToken,
  [
    param('otherUserId').isInt({ min: 1 }).withMessage('Other user ID must be a valid integer'),
    handleValidationErrors
  ],
  markMessagesAsRead
);

router.delete(
  "/:messageId",
  authenticateToken,
  [
    param('messageId').custom((value) => {
      if (!isUUID(value)) {
        throw new Error('Message ID must be a valid UUID');
      }
      return true;
    }),
    handleValidationErrors
  ],
  deleteMessage
);

export default router;