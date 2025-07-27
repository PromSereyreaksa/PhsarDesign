import express from "express";
import { 
  createPortfolioItem,
  getArtistPortfolio, 
  getPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  likePortfolioItem,
  getPortfolioCategories
} from "../controllers/portfolio.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { validateFileUpload } from "../middlewares/security.middleware.js";
import { param, body } from "express-validator";
import { handleValidationErrors } from "../middlewares/security.middleware.js";
import { validate as isUUID } from 'uuid';

const router = express.Router();

router.get("/categories", getPortfolioCategories);

router.post(
  "/",
  authenticateToken,
  [
    body('artistId').isInt({ min: 1 }).withMessage('Artist ID must be a valid integer'),
    body('title').trim().isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),
    body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),
    body('imageUrl').isURL().withMessage('Image URL must be valid'),
    body('category').isIn(['illustration', 'design', 'photography', 'writing', 'video', 'music', 'animation', 'web-development', 'other']).withMessage('Invalid category'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('projectUrl').optional().isURL().withMessage('Project URL must be valid'),
    body('completionDate').optional().isISO8601().withMessage('Completion date must be valid'),
    handleValidationErrors
  ],
  createPortfolioItem
);

router.get(
  "/artist/:artistId",
  [
    param('artistId').isInt({ min: 1 }).withMessage('Artist ID must be a valid integer'),
    handleValidationErrors
  ],
  getArtistPortfolio
);

router.get(
  "/:portfolioId",
  [
    param('portfolioId').custom((value) => {
      if (!isUUID(value)) {
        throw new Error('Portfolio ID must be a valid UUID');
      }
      return true;
    }),
    handleValidationErrors
  ],
  getPortfolioItem
);

router.put(
  "/:portfolioId",
  authenticateToken,
  [
    param('portfolioId').custom((value) => {
      if (!isUUID(value)) {
        throw new Error('Portfolio ID must be a valid UUID');
      }
      return true;
    }),
    body('title').optional().trim().isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),
    body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),
    body('category').optional().isIn(['illustration', 'design', 'photography', 'writing', 'video', 'music', 'animation', 'web-development', 'other']).withMessage('Invalid category'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('projectUrl').optional().isURL().withMessage('Project URL must be valid'),
    body('completionDate').optional().isISO8601().withMessage('Completion date must be valid'),
    body('featured').optional().isBoolean().withMessage('Featured must be a boolean'),
    body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
    handleValidationErrors
  ],
  updatePortfolioItem
);

router.delete(
  "/:portfolioId",
  authenticateToken,
  [
    param('portfolioId').custom((value) => {
      if (!isUUID(value)) {
        throw new Error('Portfolio ID must be a valid UUID');
      }
      return true;
    }),
    handleValidationErrors
  ],
  deletePortfolioItem
);

router.post(
  "/:portfolioId/like",
  [
    param('portfolioId').custom((value) => {
      if (!isUUID(value)) {
        throw new Error('Portfolio ID must be a valid UUID');
      }
      return true;
    }),
    handleValidationErrors
  ],
  likePortfolioItem
);

export default router;