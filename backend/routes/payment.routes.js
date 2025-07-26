// routes/payment.routes.js
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
import { handleValidationErrors } from '../middlewares/security.middleware.js';

const router = express.Router();

// Validation middleware for payment operations
const validatePaymentIntent = [
  body('projectId')
    .isInt({ min: 1 })
    .withMessage('Project ID must be a valid positive integer'),
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

/**
 * @route POST /api/payments/create-intent
 * @desc Create a payment intent for project payment
 * @access Protected
 */
router.post('/create-intent', authenticate, validatePaymentIntent, createPaymentIntent);

/**
 * @route POST /api/payments/confirm
 * @desc Confirm a payment
 * @access Protected
 */
router.post('/confirm', authenticate, validateConfirmPayment, confirmPayment);

/**
 * @route POST /api/payments/setup-intent
 * @desc Create a setup intent for saving payment methods
 * @access Protected
 */
router.post('/setup-intent', authenticate, createSetupIntent);

/**
 * @route GET /api/payments/payment-methods
 * @desc Get saved payment methods for a user
 * @access Protected
 */
router.get('/payment-methods', authenticate, getPaymentMethods);

/**
 * @route DELETE /api/payments/payment-methods/:paymentMethodId
 * @desc Delete a payment method
 * @access Protected
 */
router.delete('/payment-methods/:paymentMethodId', authenticate, deletePaymentMethod);

/**
 * @route POST /api/payments/webhook
 * @desc Handle Stripe webhooks
 * @access Public (but verified by Stripe)
 */
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

/**
 * @route GET /api/payments/history
 * @desc Get payment history for a user
 * @access Protected
 */
router.get('/history', authenticate, getPaymentHistory);

export default router;
