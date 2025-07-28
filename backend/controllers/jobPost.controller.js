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
      search,
      status = "open" 
    } = req.query;

    console.log('Job posts request params:', req.query);

    const offset = (page - 1) * limit;
    const where = { status };

    // Add search functionality
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { skillsRequired: { [Op.iLike]: `%${search}%` } },
        { category: { [Op.iLike]: `%${search}%` } }
      ];
      console.log('Adding search filter for:', search);
    }

    if (category) where.category = category;
    if (experienceLevel) where.experienceLevel = experienceLevel;
    if (location) where.location = { [Op.iLike]: `%${location}%` };
    if (budgetMin || budgetMax) {
      where.budget = {};
      if (budgetMin) where.budget[Op.gte] = parseFloat(budgetMin);
      if (budgetMax) where.budget[Op.lte] = parseFloat(budgetMax);
    }

    console.log('Job posts where clause:', JSON.stringify(where, null, 2));

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

    console.log(`Found ${count} job posts matching criteria`);

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

// Dedicated search function for job posts
export const searchJobPosts = async (req, res) => {
  try {
    console.log('Job post search request received:', req.query);
    const { search, category, minBudget, maxBudget, experienceLevel, location } = req.query;
    const where = { status: 'open' };

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { skillsRequired: { [Op.iLike]: `%${search}%` } },
        { category: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (category) {
      where.category = { [Op.iLike]: `%${category}%` };
    }

    if (experienceLevel) {
      where.experienceLevel = experienceLevel;
    }

    if (location) {
      where.location = { [Op.iLike]: `%${location}%` };
    }

    if (minBudget || maxBudget) {
      where.budget = {};
      if (minBudget) where.budget[Op.gte] = parseFloat(minBudget);
      if (maxBudget) where.budget[Op.lte] = parseFloat(maxBudget);
    }

    console.log('Job post search where clause:', JSON.stringify(where, null, 2));

    const jobPosts = await JobPost.findAll({
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
      order: [["createdAt", "DESC"]],
      limit: 50 // Reasonable limit for search results
    });

    console.log('Found job posts:', jobPosts.length);
    res.status(200).json(jobPosts);
  } catch (error) {
    console.error("Error searching job posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};