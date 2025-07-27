import express from 'express';
import {
    createClient,
    getAllClients,
    getClientById,
    getClientBySlug,
    getClientByUserId,
    updateClient,
    updateClientBySlug,
    deleteClient,
    deleteClientBySlug,
    getClientsWithProjects,
    getClientProjects,
    getClientByOrganization,
    getClientsByName
} from '../controllers/client.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateSlug, validateUserId } from '../middlewares/security.middleware.js';

const router = express.Router();


// Client CRUD operations with slug support
router.post('/', authenticate, createClient);
router.get('/', getAllClients);

// Special routes that need to come before slug/ID matching
router.get('/user/:userId', validateUserId, getClientByUserId);
router.get('/with-projects', getClientsWithProjects);
router.get('/organization/:organization', getClientByOrganization);
router.get('/name/:name', getClientsByName);

// ID-based routes for backward compatibility (numeric IDs only)
router.get('/id/:id', getClientById);
router.put('/id/:id', authenticate, updateClient);
router.delete('/id/:id', authenticate, deleteClient);

// Project-related routes
router.get('/:clientId/projects', getClientProjects);

// Slug-based routes (must come last to catch everything else)
router.get('/:slug', validateSlug, getClientBySlug);
router.put('/:slug', authenticate, validateSlug, updateClientBySlug);
router.delete('/:slug', authenticate, validateSlug, deleteClientBySlug);

export default router;