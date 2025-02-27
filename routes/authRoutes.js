import express from 'express';
import { login, register, refreshtoken } from '../src/controllers/authController.js';

const router = express.Router();

// Login route
router.post('/login', login);
router.post('/register', register);
router.post('/refreshtoken', refreshtoken);

export default router;