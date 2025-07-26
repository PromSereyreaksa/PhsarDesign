
import { Projects, Clients, Artist } from '../models/index.js';
import { validate as isUUID } from 'uuid';


export const createProject = async (req, res) => {
    try {
        const project = await Projects.create(req.body);
        res.status(201).json(project);
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(400).json({ error: error.message });
    }
}

export const getAllProjects = async (req, res) => {
    try {
        const projects = await Projects.findAll({
            include: [
                { model: Clients, as: "client" },
                { model: Artist, as: "artist" }
            ]
        });
        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: "Internal server error" });
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