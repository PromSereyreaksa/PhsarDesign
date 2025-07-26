import express from 'express';
import {
    createFreelancer,
    getAllFreelancers,
    getFreelancerById,
    getFreelancerBySlug,
    updateFreelancer,
    updateFreelancerBySlug,
    deleteFreelancer,
    deleteFreelancerBySlug,
    getFreelancersByCategory
} from '../controllers/freelancer.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateSlug } from '../middlewares/security.middleware.js';

const router = express.Router();

// Freelancer CRUD operations with slug support
router.post('/', createFreelancer);
router.get('/', getAllFreelancers);

// Special routes that need to come before slug/ID matching
router.get('/category/:category', getFreelancersByCategory);

// ID-based routes for backward compatibility (numeric IDs only)
router.get('/id/:id(\\d+)', getFreelancerById);
router.put('/id/:id(\\d+)', authenticate, updateFreelancer);
router.delete('/id/:id(\\d+)', authenticate, deleteFreelancer);

// Slug-based routes (must come last to catch everything else)
router.get('/:slug', validateSlug, getFreelancerBySlug);
router.put('/:slug', authenticate, validateSlug, updateFreelancerBySlug);
router.delete('/:slug', authenticate, validateSlug, deleteFreelancerBySlug);

export default router;