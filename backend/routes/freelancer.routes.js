import express from 'express';
import {
    createFreelancer,
    getAllFreelancers,
    getFreelancerById,
    updateFreelancer,
    deleteFreelancer
} from '../controllers/freelancer.controller.js';

const router = express.Router();

// Freelancer CRUD operations
router.post('/', createFreelancer);
router.get('/', getAllFreelancers);
router.get('/:id', getFreelancerById);
router.put('/:id', updateFreelancer);
router.delete('/:id', deleteFreelancer);

export default router;