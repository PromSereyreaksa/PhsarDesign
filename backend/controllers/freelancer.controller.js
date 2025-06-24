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