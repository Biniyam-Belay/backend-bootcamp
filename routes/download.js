import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { checkRole } from '../src/middleware/authMiddleware.js';

const router = express.Router();

router.get('/download/:file', checkRole, (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const filePath = path.join(__dirname, '../uploads', req.params.file);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath, (error) => {
        if (error) {
            console.error('Download error:', error);
            return res.status(500).json({ message: 'Download failed' });
        }
    });
});

export default router;