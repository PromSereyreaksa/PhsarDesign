import { Clients, Projects } from "../models/index.js";

export const createClient = async (req, res) => {
    try {
        const client = await Clients.create(req.body);
        res.status(201).json(client);
    } catch (error) {
        console.error("Error creating client:", error);
        res.status(400).json({ error: error.message });
    }
}

export const getAllClients = async (req, res) => {
    try {
        const clients = await Clients.findAll();
        res.status(200).json(clients);
    } catch (error) {
        console.error("Error fetching clients:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getClientById = async (req, res) => {
    try {
        const client = await Clients.findOne({
            where: { clientId: req.params.id }
        });
        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }
        res.status(200).json(client);
    } catch (error) {
        console.error("Error fetching client:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getClientBySlug = async (req, res) => {
    try {
        const client = await Clients.findOne({
            where: { slug: req.params.slug }
        });
        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }
        res.status(200).json(client);
    } catch (error) {
        console.error("Error fetching client by slug:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updateClient = async (req, res) => {
    try {
        const [updated] = await Clients.update(req.body, {
            where: { clientId: req.params.id }
        });
        if (!updated) {
            return res.status(404).json({ error: "Client not found" });
        }
        const updatedClient = await Clients.findOne({
            where: { clientId: req.params.id }
        });
        res.status(200).json(updatedClient);
    } catch (error) {
        console.error("Error updating client:", error);
        res.status(400).json({ error: error.message });
    }
}

export const updateClientBySlug = async (req, res) => {
    try {
        const [updated] = await Clients.update(req.body, {
            where: { slug: req.params.slug }
        });
        if (!updated) {
            return res.status(404).json({ error: "Client not found" });
        }
        const updatedClient = await Clients.findOne({
            where: { slug: req.params.slug }
        });
        res.status(200).json(updatedClient);
    } catch (error) {
        console.error("Error updating client by slug:", error);
        res.status(400).json({ error: error.message });
    }
}

export const deleteClient = async (req, res) => {
    try {
        const deleted = await Clients.destroy({
            where: { clientId: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ error: "Client not found" });
        }
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting client:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const deleteClientBySlug = async (req, res) => {
    try {
        const deleted = await Clients.destroy({
            where: { slug: req.params.slug }
        });
        if (!deleted) {
            return res.status(404).json({ error: "Client not found" });
        }
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting client by slug:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getClientByUserId = async (req, res) => {
    try {
        const client = await Clients.findOne({
            where: { userId: req.params.userId }
        });
        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }
        res.status(200).json(client);
    } catch (error) {
        console.error("Error fetching client by user ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getClientsWithProjects = async (req, res) => {
    try {
        const clients = await Clients.findAll({
            include: [{
                model: Projects,
                as: 'projects'
            }]
        });
        res.status(200).json(clients);
    } catch (error) {
        console.error("Error fetching clients with projects:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getClientProjects = async (req, res) => {
    try {
        const projects = await Projects.findAll({
            where: { clientId: req.params.clientId }
        });
        if (!projects) {
            return res.status(404).json({ error: "No projects found for this client" });
        }
        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching client projects:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getClientByOrganization = async (req, res) => {
    try {
        const client = await Clients.findOne({
            where: { organization: req.params.organization }
        });
        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }
        res.status(200).json(client);
    } catch (error) {
        console.error("Error fetching client by organization:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getClientsByName = async (req, res) => {
    try {
        const clients = await Clients.findAll({
            where: { name: req.params.name }
        });
        if (clients.length === 0) {
            return res.status(404).json({ error: "No clients found with this name" });
        }
        res.status(200).json(clients);
    } catch (error) {
        console.error("Error fetching clients by name:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
