import { Users } from '../models/index.js';
import bcrypt from 'bcryptjs';

export const createUser = async (req, res) => {
    try {
        const { password, ...userData } = req.body;
        
        // Hash password if provided
        if (password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            userData.password = hashedPassword;
        }
        
        const user = await Users.create(userData);
        
        // Remove password from response
        const { password: _, ...userResponse } = user.toJSON();
        
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: userResponse
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(400).json({ 
            success: false,
            error: error.message 
        });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await Users.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getUserById = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: { userId: req.params.id }
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updateUser = async (req, res) => {
    try {
        const [updated] = await Users.update(req.body, {
            where: { userId: req.params.id }
        });
        if (!updated) {
            return res.status(404).json({ error: "User not found" });
        }
        const updatedUser = await Users.findOne({
            where: { userId: req.params.id }
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(400).json({ error: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const deleted = await Users.destroy({
            where: { userId: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getUserByEmail = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: { email: req.params.email }
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user by email:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const getUserByRole = async (req, res) => {
    try {
        const users = await Users.findAll({
            where: { role: req.params.role }
        });
        if (!users.length) {
            return res.status(404).json({ error: "No users found with this role" });
        }
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users by role:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}



