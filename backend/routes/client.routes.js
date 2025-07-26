import express from 'express';
import {
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient
} from '../controllers/client.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Client CRUD operations
router.post('/',  createClient);
router.get('/',  getAllClients);
router.get('/:id',  getClientById);
router.put('/:id',  updateClient);
router.delete('/:id',  deleteClient);

export default router;