import express from 'express';
import multer from 'multer';
import prisma from '../prisma/client.js';
import { checkRole } from '../src/middleware/authMiddleware.js';
import fs from 'fs';

const router = express.Router();

// 🔹 Define storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Make sure the "uploads" folder exists
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
        cb(null, uniqueName);
    },
});

// File Filter Function
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp',  'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Only JPEG, PNG, and PDF files are allowed'), false);
    }
    cb(null, true);
};

// Set File Size Limit
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
    fileFilter,
});

// Upload Route
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded or invalid format' });
    }

    // Save file to database
    const savedFile = prisma.file.create({
        data: {
            fileName: req.file.originalname,
            fileUrl: req.file.path,
            fileType: req.file.mimetype,
            fileSize: req.file.size
        },
    });

    res.json({
        message: '✅ File uploaded successfully!',
        file: savedFile,
    });
});

export default router;
