import express from 'express';
import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
} from '../controllers/project.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateProject, validateUUID } from '../middlewares/security.middleware.js';

const router = express.Router();

// Project CRUD operations (all using UUID)
router.post('/', authenticate, validateProject, createProject);
router.get('/', getAllProjects);
router.get('/:id', validateUUID, getProjectById);
router.put('/:id', authenticate, validateUUID, validateProject, updateProject);
router.delete('/:id', authenticate, validateUUID, deleteProject);

export default router;