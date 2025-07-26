import express from 'express';
import {
    createClient,
    getAllClients,
    getClientById,
    getClientBySlug,
    updateClient,
    updateClientBySlug,
    deleteClient,
    deleteClientBySlug,
    getClientByUserId,
    getClientsWithProjects,
    getClientProjects,
    getClientByOrganization,
    getClientsByName
} from '../controllers/client.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateSlug } from '../middlewares/security.middleware.js';

const router = express.Router();

// Client CRUD operations with slug support
router.post('/', createClient);
router.get('/', getAllClients);

// Special routes that need to come before slug/ID matching
router.get('/user/:userId', getClientByUserId);
router.get('/with-projects', getClientsWithProjects);
router.get('/organization/:organization', getClientByOrganization);
router.get('/name/:name', getClientsByName);

// ID-based routes for backward compatibility (numeric IDs only)
router.get('/id/:id(\\d+)', getClientById);
router.put('/id/:id(\\d+)', authenticate, updateClient);
router.delete('/id/:id(\\d+)', authenticate, deleteClient);

// Project-related routes
router.get('/:clientId(\\d+)/projects', getClientProjects);

// Slug-based routes (must come last to catch everything else)
router.get('/:slug', validateSlug, getClientBySlug);
router.put('/:slug', authenticate, validateSlug, updateClientBySlug);
router.delete('/:slug', authenticate, validateSlug, deleteClientBySlug);

export default router;