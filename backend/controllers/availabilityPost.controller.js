import { AvailabilityPost, Artist, Users } from "../models/index.js";
import { validate as isUUID } from 'uuid';
import { Op } from "sequelize";

export const createAvailabilityPost = async (req, res) => {
    try {
        // Fallback to test user ID if authentication is not working
        const userId = req.user?.userId || 1;
        
        const artist = await Artist.findOne({ where: { userId } });
        if (!artist) {
            return res.status(403).json({ error: "Only artists can create availability posts. User ID: " + userId });
        }

        const postData = {
            ...req.body,
            artistId: artist.artistId
        };

        const post = await AvailabilityPost.create(postData);
        
        const postWithDetails = await AvailabilityPost.findByPk(post.postId, {
            include: [
                { model: Artist, as: "artist", include: [{ model: Users, as: "user", attributes: ['email'] }] }
            ]
        });

        res.status(201).json(postWithDetails);
    } catch (error) {
        console.error("Error creating availability post:", error);
        res.status(400).json({ error: error.message });
    }
};

export const getAllAvailabilityPosts = async (req, res) => {
    try {
        const { 
            category, 
            availabilityType, 
            location, 
            search, 
            status = 'active',
            page = 1, 
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'DESC'
        } = req.query;

        const where = { status };
        const offset = (page - 1) * limit;

        if (category && category !== 'all') {
            where.category = category;
        }

        if (availabilityType && availabilityType !== 'all') {
            where.availabilityType = availabilityType;
        }

        if (location) {
            where.location = { [Op.iLike]: `%${location}%` };
        }

        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } },
                { skills: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const posts = await AvailabilityPost.findAndCountAll({
            where,
            include: [
                { model: Artist, as: "artist", include: [{ model: Users, as: "user", attributes: ['email'] }] }
            ],
            order: [[sortBy, sortOrder]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            posts: posts.rows,
            totalCount: posts.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(posts.count / limit),
            hasMore: offset + posts.rows.length < posts.count
        });
    } catch (error) {
        console.error("Error fetching availability posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAvailabilityPostById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isUUID(id)) {
            return res.status(400).json({ error: "Invalid post ID format" });
        }

        const post = await AvailabilityPost.findOne({
            where: { postId: id },
            include: [
                { model: Artist, as: "artist", include: [{ model: Users, as: "user", attributes: ['email'] }] }
            ]
        });
        
        if (!post) {
            return res.status(404).json({ error: "Availability post not found" });
        }

        await post.increment('viewCount');
        
        res.status(200).json(post);
    } catch (error) {
        console.error("Error fetching availability post:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAvailabilityPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const post = await AvailabilityPost.findOne({
            where: { slug },
            include: [
                { model: Artist, as: "artist", include: [{ model: Users, as: "user", attributes: ['email'] }] }
            ]
        });
        
        if (!post) {
            return res.status(404).json({ error: "Availability post not found" });
        }

        await post.increment('viewCount');
        
        res.status(200).json(post);
    } catch (error) {
        console.error("Error fetching availability post by slug:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAvailabilityPostsByArtist = async (req, res) => {
    try {
        const { artistId } = req.params;
        const { status, page = 1, limit = 10 } = req.query;
        
        const artist = await Artist.findByPk(artistId);
        if (!artist) {
            return res.status(404).json({ error: "Artist not found" });
        }

        const where = { artistId: parseInt(artistId) };
        if (status) {
            where.status = status;
        }

        const offset = (page - 1) * limit;

        const posts = await AvailabilityPost.findAndCountAll({
            where,
            include: [
                { model: Artist, as: "artist", include: [{ model: Users, as: "user", attributes: ['email'] }] }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            posts: posts.rows,
            totalCount: posts.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(posts.count / limit),
            hasMore: offset + posts.rows.length < posts.count
        });
    } catch (error) {
        console.error("Error fetching artist's availability posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMyAvailabilityPosts = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { status, page = 1, limit = 10 } = req.query;
        
        const artist = await Artist.findOne({ where: { userId } });
        if (!artist) {
            return res.status(403).json({ error: "Only artists can view their posts" });
        }

        const where = { artistId: artist.artistId };
        if (status) {
            where.status = status;
        }

        const offset = (page - 1) * limit;

        const posts = await AvailabilityPost.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            posts: posts.rows,
            totalCount: posts.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(posts.count / limit),
            hasMore: offset + posts.rows.length < posts.count
        });
    } catch (error) {
        console.error("Error fetching my availability posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateAvailabilityPost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        
        if (!isUUID(id)) {
            return res.status(400).json({ error: "Invalid post ID format" });
        }

        const post = await AvailabilityPost.findOne({
            where: { postId: id },
            include: [{ model: Artist, as: "artist" }]
        });
        
        if (!post) {
            return res.status(404).json({ error: "Availability post not found" });
        }

        if (post.artist.userId !== userId) {
            return res.status(403).json({ error: "Access denied" });
        }

        await post.update(req.body);
        
        const updatedPost = await AvailabilityPost.findOne({
            where: { postId: id },
            include: [
                { model: Artist, as: "artist", include: [{ model: Users, as: "user", attributes: ['email'] }] }
            ]
        });
        
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error updating availability post:", error);
        res.status(400).json({ error: error.message });
    }
};

export const updateAvailabilityPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const userId = req.user.userId;

        const post = await AvailabilityPost.findOne({
            where: { slug },
            include: [{ model: Artist, as: "artist" }]
        });
        
        if (!post) {
            return res.status(404).json({ error: "Availability post not found" });
        }

        if (post.artist.userId !== userId) {
            return res.status(403).json({ error: "Access denied" });
        }

        await post.update(req.body);
        
        const updatedPost = await AvailabilityPost.findOne({
            where: { slug },
            include: [
                { model: Artist, as: "artist", include: [{ model: Users, as: "user", attributes: ['email'] }] }
            ]
        });
        
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error updating availability post by slug:", error);
        res.status(400).json({ error: error.message });
    }
};

export const deleteAvailabilityPost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        
        if (!isUUID(id)) {
            return res.status(400).json({ error: "Invalid post ID format" });
        }

        const post = await AvailabilityPost.findOne({
            where: { postId: id },
            include: [{ model: Artist, as: "artist" }]
        });
        
        if (!post) {
            return res.status(404).json({ error: "Availability post not found" });
        }

        if (post.artist.userId !== userId) {
            return res.status(403).json({ error: "Access denied" });
        }

        await post.destroy();
        res.status(200).json({ message: "Availability post deleted successfully" });
    } catch (error) {
        console.error("Error deleting availability post:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteAvailabilityPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const userId = req.user.userId;

        const post = await AvailabilityPost.findOne({
            where: { slug },
            include: [{ model: Artist, as: "artist" }]
        });
        
        if (!post) {
            return res.status(404).json({ error: "Availability post not found" });
        }

        if (post.artist.userId !== userId) {
            return res.status(403).json({ error: "Access denied" });
        }

        await post.destroy();
        res.status(200).json({ message: "Availability post deleted successfully" });
    } catch (error) {
        console.error("Error deleting availability post by slug:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const searchAvailabilityPosts = async (req, res) => {
    try {
        const { 
            q, 
            category, 
            availabilityType, 
            location, 
            minBudget, 
            maxBudget,
            skills,
            page = 1, 
            limit = 10 
        } = req.query;

        const where = { status: 'active' };
        const offset = (page - 1) * limit;

        if (q) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${q}%` } },
                { description: { [Op.iLike]: `%${q}%` } },
                { skills: { [Op.iLike]: `%${q}%` } }
            ];
        }

        if (category && category !== 'all') {
            where.category = category;
        }

        if (availabilityType && availabilityType !== 'all') {
            where.availabilityType = availabilityType;
        }

        if (location) {
            where.location = { [Op.iLike]: `%${location}%` };
        }

        if (skills) {
            where.skills = { [Op.iLike]: `%${skills}%` };
        }

        if (minBudget || maxBudget) {
            where.budget = {};
            if (minBudget) where.budget[Op.gte] = parseFloat(minBudget);
            if (maxBudget) where.budget[Op.lte] = parseFloat(maxBudget);
        }

        const posts = await AvailabilityPost.findAndCountAll({
            where,
            include: [
                { model: Artist, as: "artist", include: [{ model: Users, as: "user", attributes: ['email'] }] }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            posts: posts.rows,
            totalCount: posts.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(posts.count / limit),
            hasMore: offset + posts.rows.length < posts.count
        });
    } catch (error) {
        console.error("Error searching availability posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};