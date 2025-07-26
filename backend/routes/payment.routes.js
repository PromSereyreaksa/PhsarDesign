import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  createSetupIntent,
  getPaymentMethods,
  deletePaymentMethod,
  handleWebhook,
  getPaymentHistory
} from '../controllers/payment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { body } from 'express-validator';
import { handleValidationErrors, validateUUID } from '../middlewares/security.middleware.js';
import { validate as isUUID } from 'uuid';

const router = express.Router();

// Updated validation for UUID project IDs
const validatePaymentIntent = [
  body('projectId')
    .custom((value) => {
      if (!isUUID(value)) {
        throw new Error('Project ID must be a valid UUID');
      }
      return true;
    }),
  body('amount')
    .isFloat({ min: 0.50 })
    .withMessage('Amount must be at least $0.50'),
  body('currency')
    .optional()
    .isIn(['usd', 'eur', 'gbp', 'cad', 'aud'])
    .withMessage('Currency must be one of: usd, eur, gbp, cad, aud'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  handleValidationErrors
];

const validateConfirmPayment = [
  body('paymentIntentId')
    .notEmpty()
    .withMessage('Payment intent ID is required'),
  body('paymentMethodId')
    .notEmpty()
    .withMessage('Payment method ID is required'),
  handleValidationErrors
];

// Payment routes
router.post('/create-intent', authenticate, validatePaymentIntent, createPaymentIntent);
router.post('/confirm', authenticate, validateConfirmPayment, confirmPayment);
router.post('/setup-intent', authenticate, createSetupIntent);
router.get('/payment-methods', authenticate, getPaymentMethods);
router.delete('/payment-methods/:paymentMethodId', authenticate, deletePaymentMethod);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);
router.get('/history', authenticate, getPaymentHistory);

export default router;