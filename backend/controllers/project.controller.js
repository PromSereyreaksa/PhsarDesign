
import { Projects, Clients, Artist, Applications, Analytics, Users } from '../models/index.js';
import { validate as isUUID } from 'uuid';
import { Op } from 'sequelize';


export const createProject = async (req, res) => {
    try {
        const { title, description, budget, deadline, category, clientId } = req.body;
        
        const client = await Clients.findByPk(clientId);
        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }

        const project = await Projects.create({
            title,
            description,
            budget,
            deadline: deadline ? new Date(deadline) : null,
            category,
            clientId,
            status: 'open'
        });

        const projectWithDetails = await Projects.findByPk(project.projectId, {
            include: [
                {
                    model: Clients,
                    as: 'client',
                    attributes: ['name', 'organization', 'avatarUrl']
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: projectWithDetails
        });
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ message: "Failed to create project", error: error.message });
    }
}

export const getAllProjects = async (req, res) => {
    try {
        const { status, category, budget_min, budget_max, limit = 20, offset = 0, search } = req.query;
        
        let whereClause = {};
        
        if (status && ['open', 'in_progress', 'completed', 'cancelled', 'paid'].includes(status)) {
            whereClause.status = status;
        }
        
        if (category) {
            whereClause.category = category;
        }
        
        if (budget_min || budget_max) {
            whereClause.budget = {};
            if (budget_min) whereClause.budget[Op.gte] = parseFloat(budget_min);
            if (budget_max) whereClause.budget[Op.lte] = parseFloat(budget_max);
        }
        
        if (search) {
            whereClause[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const projects = await Projects.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Clients,
                    as: "client",
                    attributes: ['name', 'organization', 'avatarUrl']
                },
                {
                    model: Artist,
                    as: "artist",
                    attributes: ['name', 'avatarUrl', 'rating']
                },
                {
                    model: Applications,
                    as: 'applications',
                    attributes: ['applicationId', 'status'],
                    separate: true,
                    limit: 5
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            success: true,
            data: {
                projects: projects.rows,
                total: projects.count,
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Failed to fetch projects", error: error.message });
    }
}

export const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate UUID format
        if (!isUUID(id)) {
            return res.status(400).json({ error: "Invalid project ID format" });
        }

        const project = await Projects.findOne({
            where: { projectId: id }
        });
        
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        
        res.status(200).json(project);
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate UUID format
        if (!isUUID(id)) {
            return res.status(400).json({ error: "Invalid project ID format" });
        }

        const [updated] = await Projects.update(req.body, {
            where: { projectId: id }
        });
        
        if (!updated) {
            return res.status(404).json({ error: "Project not found" });
        }
        
        const updatedProject = await Projects.findOne({
            where: { projectId: id }
        });
        
        res.status(200).json(updatedProject);
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(400).json({ error: error.message });
    }
}

export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate UUID format
        if (!isUUID(id)) {
            return res.status(400).json({ error: "Invalid project ID format" });
        }

        const deleted = await Projects.destroy({
            where: { projectId: id }
        });
        
        if (!deleted) {
            return res.status(404).json({ error: "Project not found" });
        }
        
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getClientProjects = async (req, res) => {
    try {
        const { clientId } = req.params;
        const { status, limit = 20, offset = 0 } = req.query;

        // Validate clientId parameter
        if (!clientId || clientId === 'undefined' || clientId === 'null' || isNaN(parseInt(clientId))) {
            return res.status(400).json({ 
                error: "Invalid client ID. Client ID must be a valid number.",
                received: clientId
            });
        }

        let whereClause = { clientId: parseInt(clientId) };
        if (status && ['open', 'in_progress', 'completed', 'cancelled', 'paid'].includes(status)) {
            whereClause.status = status;
        }

        const projects = await Projects.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Artist,
                    as: "artist",
                    attributes: ['name', 'avatarUrl', 'rating']
                },
                {
                    model: Applications,
                    as: 'applications',
                    attributes: ['applicationId', 'status', 'createdAt'],
                    include: [
                        {
                            model: Artist,
                            as: 'artist',
                            attributes: ['name', 'avatarUrl']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            success: true,
            data: {
                projects: projects.rows,
                total: projects.count,
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });
    } catch (error) {
        console.error("Error fetching client projects:", error);
        res.status(500).json({ message: "Failed to fetch client projects", error: error.message });
    }
}

export const updateProjectStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!isUUID(id)) {
            return res.status(400).json({ error: "Invalid project ID format" });
        }

        if (!['open', 'in_progress', 'completed', 'cancelled', 'paid'].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const project = await Projects.findByPk(id);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        await project.update({ 
            status,
            completedAt: status === 'completed' ? new Date() : null
        });

        if (status === 'completed' && project.artistId) {
            await Analytics.create({
                artistId: project.artistId,
                eventType: 'project_completed',
                entityType: 'project',
                entityId: id,
                metadata: { 
                    projectTitle: project.title,
                    budget: project.budget
                },
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            });
        }

        const updatedProject = await Projects.findByPk(id, {
            include: [
                {
                    model: Clients,
                    as: 'client',
                    attributes: ['name', 'organization']
                },
                {
                    model: Artist,
                    as: 'artist',
                    attributes: ['name', 'avatarUrl']
                }
            ]
        });

        res.status(200).json({
            success: true,
            message: "Project status updated successfully",
            data: updatedProject
        });
    } catch (error) {
        console.error("Error updating project status:", error);
        res.status(500).json({ message: "Failed to update project status", error: error.message });
    }
}

export const searchArtists = async (req, res) => {
    try {
        const { skills, rating_min, hourly_rate_max, availability, limit = 20, offset = 0, search } = req.query;

        let whereClause = {};
        
        if (skills) {
            whereClause.skills = { [Op.iLike]: `%${skills}%` };
        }
        
        if (rating_min) {
            whereClause.rating = { [Op.gte]: parseFloat(rating_min) };
        }
        
        if (hourly_rate_max) {
            whereClause.hourlyRate = { [Op.lte]: parseFloat(hourly_rate_max) };
        }
        
        if (availability) {
            whereClause.availability = availability;
        }
        
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { skills: { [Op.iLike]: `%${search}%` } },
                { specialties: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const artists = await Artist.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['email']
                }
            ],
            attributes: {
                exclude: ['userId']
            },
            order: [['rating', 'DESC'], ['totalCommissions', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            success: true,
            data: {
                artists: artists.rows,
                total: artists.count,
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });
    } catch (error) {
        console.error("Error searching artists:", error);
        res.status(500).json({ message: "Failed to search artists", error: error.message });
    }
}