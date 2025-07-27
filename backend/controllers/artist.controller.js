import { Artist, Users } from "../models/index.js";
import { Op } from "sequelize";

export const createArtist = async (req, res) => {
    try {
        // Extract userId from authenticated user
        const userId = req.user.userId;
        
        // Check if user already has an artist profile
        const existingArtist = await Artist.findOne({ where: { userId } });
        if (existingArtist) {
            return res.status(400).json({ error: "User already has an artist profile" });
        }
        
        // Create artist with userId from authenticated user
        const artistData = {
            ...req.body,
            userId: userId
        };
        
        const artist = await Artist.create(artistData);
        
        // Return artist with user details
        const newArtist = await Artist.findByPk(artist.artistId, {
            include: [
                { model: Users, as: "user", attributes: ['email'] }
            ]
        });
        
        res.status(201).json(newArtist);
    } catch (error) {
        console.error("Error creating artist:", error);
        res.status(400).json({ error: error.message });
    }
}

export const getAllArtists = async (req, res) => {
    try {
        const artists = await Artist.findAll({
            include: [
                { model: Users, as: "user", attributes: ['email'] }
            ]
        });
        res.status(200).json(artists);
    } catch (error) {
        console.error("Error fetching artists:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getArtistById = async (req, res) => {
    try {
        const artist = await Artist.findOne({
            where: { artistId: req.params.id },
            include: [
                { model: Users, as: "user", attributes: ['email'] }
            ]
        });
        if (!artist) {
            return res.status(404).json({ error: "Artist not found" });
        }
        res.status(200).json(artist);
    } catch (error) {
        console.error("Error fetching artist:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getArtistByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Validate userId parameter  
        if (!userId || userId === 'undefined' || userId === 'null' || isNaN(parseInt(userId))) {
            return res.status(400).json({ 
                error: "Invalid user ID. User ID must be a valid number.",
                received: userId
            });
        }
        
        const artist = await Artist.findOne({
            where: { userId: parseInt(userId) },
            include: [
                { model: Users, as: "user", attributes: ['email'] }
            ]
        });
        
        if (!artist) {
            return res.status(404).json({ error: "Artist not found" });
        }
        
        res.status(200).json(artist);
    } catch (error) {
        console.error("Error fetching artist by user ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getArtistByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const artists = await Artist.findAll({
            where: {
                [Op.or]: [
                    { skills: { [Op.iLike]: `%${category}%` } },
                    { specialties: { [Op.iLike]: `%${category}%` } }
                ]
            },
            include: [
                { model: Users, as: "user", attributes: ['email'] }
            ]
        });
        res.status(200).json(artists);
    } catch (error) {
        console.error("Error fetching artists by category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updateArtist = async (req, res) => {
    try {
        const { id } = req.params;
        const artist = await Artist.findByPk(id);
        
        if (!artist) {
            return res.status(404).json({ error: "Artist not found" });
        }

        // Check if the user owns this artist profile or is admin
        if (req.user.userId !== artist.userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: "Access denied" });
        }

        await artist.update(req.body);
        
        const updatedArtist = await Artist.findByPk(id, {
            include: [
                { model: Users, as: "user", attributes: ['email'] }
            ]
        });
        
        res.status(200).json(updatedArtist);
    } catch (error) {
        console.error("Error updating artist:", error);
        res.status(400).json({ error: error.message });
    }
}

export const deleteArtist = async (req, res) => {
    try {
        const { id } = req.params;
        const artist = await Artist.findByPk(id);
        
        if (!artist) {
            return res.status(404).json({ error: "Artist not found" });
        }

        // Check if the user owns this artist profile or is admin
        if (req.user.userId !== artist.userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: "Access denied" });
        }

        await artist.destroy();
        res.status(200).json({ message: "Artist deleted successfully" });
    } catch (error) {
        console.error("Error deleting artist:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const searchArtists = async (req, res) => {
    try {
        console.log('Search request received:', req.query);
        const { search, skills, minRating, maxRate, availability } = req.query;
        const where = {};

        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { skills: { [Op.iLike]: `%${search}%` } },
                { specialties: { [Op.iLike]: `%${search}%` } }
            ];
        }

        if (skills) {
            where.skills = { [Op.iLike]: `%${skills}%` };
        }

        if (minRating) {
            where.rating = { [Op.gte]: parseFloat(minRating) };
        }

        if (maxRate) {
            where.hourlyRate = { [Op.lte]: parseFloat(maxRate) };
        }

        if (availability) {
            where.availability = availability;
        }

        console.log('Where clause:', JSON.stringify(where, null, 2));

        const artists = await Artist.findAll({
            where,
            include: [
                { model: Users, as: "user", attributes: ['email'] }
            ],
            order: [['rating', 'DESC'], ['totalCommissions', 'DESC']]
        });

        console.log('Found artists:', artists.length);
        res.status(200).json(artists);
    } catch (error) {
        console.error("Error searching artists:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getArtistBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const artist = await Artist.findOne({
            where: { slug },
            include: [
                { model: Users, as: "user", attributes: ['email'] }
            ]
        });
        if (!artist) {
            return res.status(404).json({ error: "Artist not found" });
        }
        res.status(200).json(artist);
    } catch (error) {
        console.error("Error fetching artist by slug:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updateArtistBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const artist = await Artist.findOne({ where: { slug } });
        
        if (!artist) {
            return res.status(404).json({ error: "Artist not found" });
        }

        if (req.user.userId !== artist.userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: "Access denied" });
        }

        await artist.update(req.body);
        
        const updatedArtist = await Artist.findOne({
            where: { slug },
            include: [
                { model: Users, as: "user", attributes: ['email'] }
            ]
        });
        
        res.status(200).json(updatedArtist);
    } catch (error) {
        console.error("Error updating artist by slug:", error);
        res.status(400).json({ error: error.message });
    }
}

export const deleteArtistBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const artist = await Artist.findOne({ where: { slug } });
        
        if (!artist) {
            return res.status(404).json({ error: "Artist not found" });
        }

        if (req.user.userId !== artist.userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: "Access denied" });
        }

        await artist.destroy();
        res.status(200).json({ message: "Artist deleted successfully" });
    } catch (error) {
        console.error("Error deleting artist by slug:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}