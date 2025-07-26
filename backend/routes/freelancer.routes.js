import express from 'express';
import {
    createFreelancer,
    getAllFreelancers,
    getFreelancerById,
    getFreelancerBySlug,
    getFreelancerByUserId,
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
// Freelancer CRUD operations
router.post('/',  createFreelancer);
router.get('/', getAllFreelancers); // Public route for browsing freelancers
router.get('/user/:userId', getFreelancerByUserId); // Get freelancer by user ID
router.get('/:id', getFreelancerById); // Public route for freelancer profiles
router.put('/:id',  updateFreelancer);
router.delete('/:id',  deleteFreelancer);

export default router;