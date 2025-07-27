import express from 'express';
import {
    createAvailabilityPost,
    getAllAvailabilityPosts,
    getAvailabilityPostById,
    getAvailabilityPostBySlug,
    getAvailabilityPostsByArtist,
    getMyAvailabilityPosts,
    updateAvailabilityPost,
    updateAvailabilityPostBySlug,
    deleteAvailabilityPost,
    deleteAvailabilityPostBySlug,
    searchAvailabilityPosts
} from '../controllers/availabilityPost.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateAvailabilityPost, validateUUID, validateSlug } from '../middlewares/security.middleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getAllAvailabilityPosts);
router.get('/search', searchAvailabilityPosts);
router.get('/artist/:artistId', getAvailabilityPostsByArtist);

// Protected routes (authentication required)
// router.use(authenticate);

// CRUD operations with UUID
router.post('/', validateAvailabilityPost, createAvailabilityPost);
router.get('/my-posts', getMyAvailabilityPosts);
router.get('/:id', validateUUID, getAvailabilityPostById);
router.put('/:id', validateUUID, validateAvailabilityPost, updateAvailabilityPost);
router.delete('/:id', validateUUID, deleteAvailabilityPost);

// CRUD operations with slug (these should come after UUID routes)
router.get('/slug/:slug', validateSlug, getAvailabilityPostBySlug);
router.put('/slug/:slug', validateSlug, validateAvailabilityPost, updateAvailabilityPostBySlug);
router.delete('/slug/:slug', validateSlug, deleteAvailabilityPostBySlug);

export default router;