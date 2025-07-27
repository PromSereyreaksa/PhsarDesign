import { JobPost, Clients, Applications, Artist } from "../models/index.js";
import { Op } from "sequelize";

export const createJobPost = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      category, 
      budget, 
      budgetType, 
      deadline, 
      location, 
      skillsRequired, 
      experienceLevel, 
      expiresAt 
    } = req.body;
    
    const clientId = req.params.clientId;

    const client = await Clients.findByPk(clientId);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    const jobPost = await JobPost.create({
      clientId,
      title,
      description,
      category,
      budget,
      budgetType: budgetType || "fixed",
      deadline,
      location,
      skillsRequired,
      experienceLevel: experienceLevel || "intermediate",
      expiresAt
    });

    const jobPostWithClient = await JobPost.findByPk(jobPost.jobId, {
      include: [
        {
          model: Clients,
          as: "client",
          attributes: ["clientId", "name", "organization", "avatarUrl"]
        }
      ]
    });

    res.status(201).json(jobPostWithClient);
  } catch (error) {
    console.error("Error creating job post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllJobPosts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      budgetMin, 
      budgetMax, 
      experienceLevel,
      location,
      status = "open" 
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { status };

    if (category) where.category = category;
    if (experienceLevel) where.experienceLevel = experienceLevel;
    if (location) where.location = { [Op.iLike]: `%${location}%` };
    if (budgetMin || budgetMax) {
      where.budget = {};
      if (budgetMin) where.budget[Op.gte] = parseFloat(budgetMin);
      if (budgetMax) where.budget[Op.lte] = parseFloat(budgetMax);
    }

    const { count, rows: jobPosts } = await JobPost.findAndCountAll({
      where,
      include: [
        {
          model: Clients,
          as: "client",
          attributes: ["clientId", "name", "organization", "avatarUrl"]
        },
        {
          model: Applications,
          as: "applications",
          attributes: ["applicationId", "status"],
          required: false
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]]
    });

    res.json({
      jobPosts,
      totalCount: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error("Error fetching job posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getJobPostById = async (req, res) => {
  try {
    const { jobId } = req.params;

    const jobPost = await JobPost.findByPk(jobId, {
      include: [
        {
          model: Clients,
          as: "client",
          attributes: ["clientId", "name", "organization", "avatarUrl", "slug"]
        },
        {
          model: Applications,
          as: "applications",
          include: [
            {
              model: Artist,
              as: "artist",
              attributes: ["artistId", "name", "avatarUrl", "rating", "hourlyRate"]
            }
          ]
        }
      ]
    });

    if (!jobPost) {
      return res.status(404).json({ error: "Job post not found" });
    }

    await jobPost.increment("viewCount");

    res.json(jobPost);
  } catch (error) {
    console.error("Error fetching job post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateJobPost = async (req, res) => {
  try {
    const { jobId } = req.params;
    const updateData = req.body;

    const jobPost = await JobPost.findByPk(jobId);
    if (!jobPost) {
      return res.status(404).json({ error: "Job post not found" });
    }

    await jobPost.update(updateData);

    const updatedJobPost = await JobPost.findByPk(jobId, {
      include: [
        {
          model: Clients,
          as: "client",
          attributes: ["clientId", "name", "organization", "avatarUrl"]
        }
      ]
    });

    res.json(updatedJobPost);
  } catch (error) {
    console.error("Error updating job post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteJobPost = async (req, res) => {
  try {
    const { jobId } = req.params;

    const jobPost = await JobPost.findByPk(jobId);
    if (!jobPost) {
      return res.status(404).json({ error: "Job post not found" });
    }

    await jobPost.destroy();
    res.json({ message: "Job post deleted successfully" });
  } catch (error) {
    console.error("Error deleting job post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const applyToJobPost = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { artistId, message, proposedBudget, proposedDeadline } = req.body;

    const jobPost = await JobPost.findByPk(jobId);
    if (!jobPost) {
      return res.status(404).json({ error: "Job post not found" });
    }

    if (jobPost.status !== "open") {
      return res.status(400).json({ error: "Job post is not accepting applications" });
    }

    const existingApplication = await Applications.findOne({
      where: { jobPostId: jobId, artistId, applicationType: "artist_to_job" }
    });

    if (existingApplication) {
      return res.status(400).json({ error: "Artist has already applied to this job" });
    }

    const application = await Applications.create({
      jobPostId: jobId,
      artistId,
      applicationType: "artist_to_job",
      message,
      proposedBudget,
      proposedDeadline
    });

    await jobPost.increment("applicationsCount");

    const applicationWithDetails = await Applications.findByPk(application.applicationId, {
      include: [
        {
          model: Artist,
          as: "artist",
          attributes: ["artistId", "name", "avatarUrl", "rating", "hourlyRate"]
        },
        {
          model: JobPost,
          as: "jobPost",
          attributes: ["jobId", "title", "budget"]
        }
      ]
    });

    res.status(201).json(applicationWithDetails);
  } catch (error) {
    console.error("Error applying to job post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};