import express from 'express';
import {
  createCommissionRequest,
  getCommissionsByArtist,
  getCommissionsByClient,
  updateCommissionStatus,
  addProgressUpdate,
  getCommissionById,
  getAllCommissions
} from '../controllers/commission.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All commission routes require authentication
router.use(authenticate);

// Commission CRUD operations
router.post('/', createCommissionRequest);
router.get('/', getAllCommissions); // Admin endpoint
router.get('/artist', getCommissionsByArtist); // Get current user's commissions as artist
router.get('/artist/:artistId', getCommissionsByArtist); // Get specific artist's commissions
router.get('/client', getCommissionsByClient);
router.get('/:id', getCommissionById);
router.patch('/:id/status', updateCommissionStatus);
router.post('/:id/progress', addProgressUpdate);

export default router;