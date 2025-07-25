import express from 'express';
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} from '../controllers/review.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateReview } from '../middlewares/security.middleware.js';

const router = express.Router();

router.post('/', authenticate, validateReview, createReview);
router.get('/', getAllReviews); // Public route for viewing reviews
router.get('/:id', getReviewById); // Public route for review details
router.put('/:id', authenticate, validateReview, updateReview);
router.delete('/:id', authenticate, deleteReview);

export default router;
