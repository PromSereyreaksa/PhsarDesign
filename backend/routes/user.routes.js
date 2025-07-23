import express from 'express';
import {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserByEmail,
    getUserByRole
} from '../controllers/user.controller.js';

const router = express.Router();

// User CRUD operations
router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// User search operations
router.get('/email/:email', getUserByEmail);
router.get('/role/:role', getUserByRole);

export default router;