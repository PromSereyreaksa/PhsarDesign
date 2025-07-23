import Projectss from '../models/project.model.js';

export const createProject = async (req, res) => {
    try {
        const project = await Projectss.create(req.body);
        res.status(201).json(project);
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(400).json({ error: error.message });
    }
}

export const getAllProjects = async (req, res) => {
    try {
        const projects = await Projects.findAll();
        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getProjectById = async (req, res) => {
    try {
        const project = await Projects.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ error: "Projects not found" });
        }
        res.status(200).json(project);
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updateProject = async (req, res) => {
    try {
        const [updated] = await Projects.update(req.body, {
            where: { id: req.params.id }
        });
        if (!updated) {
            return res.status(404).json({ error: "Projects not found" });
        }
        const updatedProjects = await Projects.findByPk(req.params.id);
        res.status(200).json(updatedProjects);
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(400).json({ error: error.message });
    }
}

export const deleteProject = async (req, res) => {
    try {
        const deleted = await Projects.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ error: "Projects not found" });
        }
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

