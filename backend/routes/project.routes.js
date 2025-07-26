import express from 'express';
import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
} from '../controllers/project.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateProject } from '../middlewares/security.middleware.js';

const router = express.Router();

// Project CRUD operations
router.post('/', authenticate, validateProject, createProject);
router.get('/', getAllProjects); // Public route for browsing projects
router.get('/:id', getProjectById); // Public route for project details
router.put('/:id', authenticate, validateProject, updateProject);
router.delete('/:id', authenticate, deleteProject);

export default router;