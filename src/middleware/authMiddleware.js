import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

export const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(401).json({ error: 'Authentication failed, Admin access required' });
    }
    next();
};

export const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET); // Verify token
        req.user = decoded; // Set user to request object
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

export const verifyToken = (req, res, next) => {
    const token = req.header.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = decoded; // Set user to request object
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

export const checkRole = (role) => (req, res, next) => {
    if (!req.user || req.user.role !== role) {
        return res.status(401).json({ error: 'Authentication failed, Admin access required' });
    }
    next();
}