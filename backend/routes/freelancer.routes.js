import express from 'express';
import {
    createFreelancer,
    getAllFreelancers,
    getFreelancerById,
    getFreelancerByUserId,
    updateFreelancer,
    deleteFreelancer
} from '../controllers/freelancer.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Freelancer CRUD operations
router.post('/',  createFreelancer);
router.get('/', getAllFreelancers); // Public route for browsing freelancers
router.get('/user/:userId', getFreelancerByUserId); // Get freelancer by user ID
router.get('/:id', getFreelancerById); // Public route for freelancer profiles
router.put('/:id',  updateFreelancer);
router.delete('/:id',  deleteFreelancer);

export default router;