import express from 'express';
import {
    createPortfolio,
    getAllPortfolios,
    getPortfolioById,
    updatePortfolio,
    deletePortfolio
} from '../controllers/portfolio.controller.js';

const router = express.Router();

// Portfolio CRUD operations
router.post('/', createPortfolio);
router.get('/', getAllPortfolios);
router.get('/:id', getPortfolioById);
router.put('/:id', updatePortfolio);
router.delete('/:id', deletePortfolio);

export default router;