import express from 'express';
import {
    createFreelancer,
    getAllFreelancers,
    getFreelancerById,
    updateFreelancer,
    deleteFreelancer
} from '../controllers/freelancer.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Freelancer CRUD operations
router.post('/',  createFreelancer);
router.get('/', getAllFreelancers); // Public route for browsing freelancers
router.get('/:id', getFreelancerById); // Public route for freelancer profiles
router.put('/:id',  updateFreelancer);
router.delete('/:id',  deleteFreelancer);

export default router;