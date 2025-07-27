import express from 'express';
import {
  createArtist,
  getAllArtists,
  getArtistById,
  getArtistByUserId,
  getArtistByCategory,
  updateArtist,
  deleteArtist,
  searchArtists,
  getArtistBySlug,
  updateArtistBySlug,
  deleteArtistBySlug
} from '../controllers/artist.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateSlug, validateUserId } from '../middlewares/security.middleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getAllArtists);
router.get('/search', searchArtists);
router.get('/category/:category', getArtistByCategory);
router.get('/:id', getArtistById);
router.get('/user/:userId', validateUserId, getArtistByUserId);

// Protected routes (authentication required)
router.post('/', authenticate, createArtist);
router.put('/:id', authenticate, updateArtist);
router.delete('/:id', authenticate, deleteArtist);

// Slug-based routes (protected)
router.get('/slug/:slug', validateSlug, getArtistBySlug);
router.put('/slug/:slug', authenticate, validateSlug, updateArtistBySlug);
router.delete('/slug/:slug', authenticate, validateSlug, deleteArtistBySlug);

export default router;