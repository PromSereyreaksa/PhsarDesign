import express from 'express';
import {
    createPortfolio,
    getAllPortfolios,
    getPortfolioById,
    updatePortfolio,
    deletePortfolio
} from '../controllers/portfolio.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validatePortfolioUpdate } from '../middlewares/security.middleware.js';

const router = express.Router();

// Portfolio CRUD operations
router.post('/', authenticate, validatePortfolioUpdate, createPortfolio);
router.get('/', getAllPortfolios); // Public route for browsing portfolios
router.get('/:id', getPortfolioById); // Public route for portfolio details
router.put('/:id', authenticate, validatePortfolioUpdate, updatePortfolio);
router.delete('/:id', authenticate, deletePortfolio);

export default router;