import { Freelancers } from "../models/freelancer.model.js";

export const createFreelancer = async (req, res) => {
    try {
        const freelancer = await Freelancers.create(req,body);
        res.status(201).json(freelancer);
    } catch (error) {
        console.error("Error creating freelancer:", error);
        res.status(400).json({error: error.message });
    }
}

export const getAllFreelancers = async (req, res) => {
    try{
        const freelancers = await Freelancers.findAll();
        res.status(200).json(freelancers);
    } catch (error) {
        console.error("Error fetching freelancers:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getFreelancersById = async (req, res) => {
    try {
        const freelancer = await Freelancers.findByPk(req.params.id);
        if (!freelancer) {
            return res.status(404).json({ error: "Freelancer not found" });
        }
        res.status(200).json(freelancer);
    } catch (error)  {
        console.error("Error fetching freelancer:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updateFreelancer = async (req, res) => {
    try {
        const [updated] = await Freelancers.update(req.body, {
            where: { id: req.params.id }
        });
        if (!updated) {
            return res.status(404).json({ error: "Freelancer not found" });
        }
        const updatedFreelancer = await Freelancers.findByPk(req.params.id);
        res.status(200).json(updatedFreelancer);
    } catch (error) {
        console.error("Error updating freelancer:", error);
        res.status(400).json({ error: error.message });
    }
}

export const deleteFreelancer = async (req, res) => {
    try {
        const deleted = await Freelancers.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
          return res.status(404).json({ error: "Freelancer not found" });
        }
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting freelancer:", error);
        res.status(500).json({ error: "Internal server error" });
    }
} 
 
export const getFreelancersByCategory = async (req, res) => {
  try {
    const freelancers = await Freelancers.findAll({
      where: { category: req.params.category }
    });
    if (freelancers.length === 0) {
      return res.status(404).json({ error: "No freelancers found in this category" });
    }
    res.status(200).json(freelancers);
  } catch (error) {
    console.error("Error fetching freelancers by category:", error);
    res.status(500).json({ error: "Internal server error" });}
}    

