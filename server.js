import express from 'express';
import cors from 'cors';
import { errorHandler } from './src/middleware/errorHandler.js';

import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/upload.js';
import downloadRoutes from './routes/download.js';
import deleteRoutes from './routes/file.js';

import { limiter } from './src/middleware/rateLimiter.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';

const app = express();

dotenv.config(); // Load .env variables

const corsOptions = {
    origin: 'http://localhost:3000', //Allowed Frontend URLs
    methods: ['GET', 'POST', 'PUT', 'DELETE'], //Allowed HTTP methods
    credentials: true, //Include cookies and authorization headers
    optionsSuccessStatus: 200 //For successful preflight requests
}

// Middlewares
app.use(helmet()); // Middleware for setting security headers
app.use(cookieParser()); // Middleware for parsing cookies
app.use(cors(corsOptions)); // Middleware for enabling CORS
app.use(express.json()); // Middleware for parsing application/json
app.use('/', limiter); // Rate limiter middleware
app.use(errorHandler); // Error handler middleware

//Routes
app.use('/auth', authRoutes); // Auth routes
app.use('/users', userRoutes); // User routes
app.post('/upload', uploadRoutes); // Upload routes
app.use('/files', downloadRoutes); // Download routes
app.use('/files', deleteRoutes); // Delete routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})