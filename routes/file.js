import express from 'express';
import fs from 'fs/promises'; // Use the promise-based version of fs
import { checkRole } from '../src/middleware/authMiddleware.js';
import path from 'path';

const router = express.Router();

router.delete('/delete/:filename', checkRole('ADMIN'), async (req, res) => {
    const filePath = path.join(process.cwd(), 'uploads', req.params.filename);

    // Log the file path for debugging
    console.log('File path:', filePath);

    try {
        // Check if file exists
        await fs.access(filePath);

        // Delete the file
        await fs.unlink(filePath);
        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        if (error.code === 'ENOENT') {
            // File not found
            return res.status(404).json({ message: 'File not found' });
        }
        // Other errors
        console.error('Delete error:', error);
        res.status(500).json({ message: 'Delete failed' });
    }
});

export default router;
