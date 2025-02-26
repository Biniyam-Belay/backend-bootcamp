import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config(); // Load .env variables

//Generate JWT token
const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
    }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Sign token
};

// Generate Refresh JWT token
const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '1d' } 
    );
}

//Login Controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = generateToken(user); // Sign token for the user
        const newRefreshToken = generateRefreshToken(user); // Sign refresh token for the user

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set secure to true if in production
            sameSite: 'Strict', // Set sameSite to Strict to prevent CSRF attacks
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        })

        res.status(200).json({ message: "Login Successful", token, refreshToken: newRefreshToken });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'USER' // Default role is user
            },
        }); // Create user

        res.status(201).json({ message: 'User created!', newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

export const refreshtoken = async(req, res) => {
    const { refreshedToken } = req.body;

    if (!refreshedToken) {
        return res.status(403).json({ error: 'Access Denied, Token missing' });
    }

    jwt.verify(refreshedToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        const newAccessToken = jwt.sign({
            id: decoded.id
        }, process.env.JWT_SECRET, { expiresIn: '1h'
        }) // Sign token for the user

        res.status(200).json({ message: "Token Refreshed", newAccessToken });

    });
}