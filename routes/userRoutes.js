import express from 'express';
import {createUser, getUsers, deleteUser, updateUser} from '../src/controllers/userController.js';
import { authorizeAdmin, authenticateUser } from '../src/middleware/authMiddleware.js';
import { login } from '../src/controllers/authController.js';
import { validateCreateUser, validateUpdateUser } from '../validators/userValidator.js';

const router = express.Router();


// Login route, anyone can access
router.post('/login', login);

// User routes, only Admin can access all users
router.get('/', getUsers);

// Create user, only admin can create user
router.post('/', validateCreateUser, createUser);


// Update user, only admin can update user
router.put('/:id', authenticateUser, authorizeAdmin, validateUpdateUser, updateUser);


// Delete user, only admin can delete user
router.delete('/:id', authenticateUser, authorizeAdmin, deleteUser)

export default router;