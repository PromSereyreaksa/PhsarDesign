import express from 'express';
import {
    createClient,
    getAllClients,
    getClientById,
    getClientByUserId,
    updateClient,
    deleteClient
} from '../controllers/client.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Client CRUD operations
router.post('/',  createClient);
router.get('/',  getAllClients);
router.get('/user/:userId',  getClientByUserId);
router.get('/:id',  getClientById);
router.put('/:id',  updateClient);
router.delete('/:id',  deleteClient);

export default router;