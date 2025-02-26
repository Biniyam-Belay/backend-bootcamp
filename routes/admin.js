import express from 'express';
import { verifyToken, checkRole } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/admin-data', verifyToken, checkRole('ADMIN'), (req, res) => {
    res.json({ message: 'Welcome Admin! Here is your data' });
});

export default router;