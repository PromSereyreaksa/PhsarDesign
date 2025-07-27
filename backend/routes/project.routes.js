import express from 'express';
import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    getClientProjects,
    updateProjectStatus,
    searchArtists
} from '../controllers/project.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validateProject, validateUUID } from '../middlewares/security.middleware.js';
import { param, body } from "express-validator";
import { handleValidationErrors } from "../middlewares/security.middleware.js";

const router = express.Router();

// Project CRUD operations (all using UUID)
router.post('/', authenticate, authorize(['client']), validateProject, createProject);
router.get('/', getAllProjects);
router.get('/search/artists', authenticate, authorize(['client']), searchArtists);
router.get('/client', 
  authenticate,
  authorize(['client']),
  getClientProjects
);
router.get('/:id', validateUUID, getProjectById);
router.put('/:id', authenticate, authorize(['client']), validateUUID, validateProject, updateProject);
router.patch('/:id/status', 
  authenticate, 
  authorize(['client']),
  [
    validateUUID,
    body('status').isIn(['open', 'in_progress', 'completed', 'cancelled', 'paid']).withMessage('Invalid status'),
    handleValidationErrors
  ],
  updateProjectStatus
);
router.delete('/:id', authenticate, authorize(['client']), validateUUID, deleteProject);

export default router;