import prisma from '../prisma/client.js';
import bcrypt from 'bcrypt';

export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'user' // Default role is user
            },
        }); // Create user

        res.status(201).json({ message: 'User created!', newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUsers = async (req, res) => {

    // Get all users, with pagination and search by name
    try {
        const page = parseInt(req.query.page) || 1; // Default page 1
        const limit = parseInt(req.query.limit) || 10; // Default limit 10
        const skip = (page - 1) * limit; // Skip the number of pages we are not on
        const nameQuery = req.query.name ? req.query.name.toLowerCase() : null; // Search by name


        const users = await prisma.user.findMany({
            where: nameQuery
                ? { name: { contains: nameQuery, mode: 'insensitive' } } // Search by name if nameQuery exists 
                : {}, // Otherwise, get all users
            skip,
            take: limit,
        }); // Get users

        res.status(200).json({ total: users.length, page, users })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; // Get all users

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, role } = req.body;

    try {
        const updateUser = await prisma.user.update({
            where: { id: id },
            data: {
                email,
                role // Update email and role
            }
        });

        res.status(200).json({ message: 'User updated!', updateUser });
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};


export const deleteUser = async (req, res) => {

    try {
        const userRole = req.user.role; // Get user role from token

        if (userRole !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: Admins only' });
        }

        await prisma.user.delete({
            where: { id: req.params.id },
        }); // Delete user
    
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};