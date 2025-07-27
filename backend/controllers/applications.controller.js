import { Applications, Projects, JobPost, AvailabilityPost, Artist, Clients, Analytics, Users } from "../models/index.js";
import { Op } from "sequelize";

export const createApplication = async (req, res) => {
  try {
    const { projectId, artistId, message } = req.body;

    const project = await Projects.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.status !== 'open') {
      return res.status(400).json({ message: "Project is not accepting applications" });
    }

    const artist = await Artist.findByPk(artistId);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    const existingApplication = await Applications.findOne({
      where: { projectId, artistId }
    });

    if (existingApplication) {
      return res.status(409).json({ message: "Application already exists for this project" });
    }

    const application = await Applications.create({
      projectId,
      artistId,
      message,
      status: 'pending'
    });

    await Analytics.create({
      artistId,
      eventType: 'application_submitted',
      entityType: 'application',
      entityId: application.applicationId,
      metadata: { projectId },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    const applicationWithDetails = await Applications.findByPk(application.applicationId, {
      include: [
        {
          model: Projects,
          as: 'project',
          attributes: ['title', 'budget', 'status'],
          include: [
            {
              model: Clients,
              as: 'client',
              attributes: ['name', 'organization'],
              include: [
                {
                  model: Users,
                  as: 'user',
                  attributes: ['email']
                }
              ]
            }
          ]
        },
        {
          model: Artist,
          as: 'artist',
          attributes: ['name', 'avatarUrl', 'hourlyRate'],
          include: [
            {
              model: Users,
              as: 'user',
              attributes: ['email']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: applicationWithDetails
    });
  } catch (error) {
    console.error("Application creation error:", error);
    res.status(500).json({ message: "Failed to create application", error: error.message });
  }
};

export const getArtistApplications = async (req, res) => {
  try {
    const { artistId } = req.params;
    const { status, limit = 20, offset = 0, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;

    let whereClause = { artistId };
    if (status && ['pending', 'accepted', 'rejected'].includes(status)) {
      whereClause.status = status;
    }

    const applications = await Applications.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Projects,
          as: 'project',
          attributes: ['projectId', 'title', 'description', 'budget', 'status', 'createdAt'],
          include: [
            {
              model: Clients,
              as: 'client',
              attributes: ['name', 'organization', 'avatarUrl']
            }
          ]
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const stats = await Applications.findAll({
      where: { artistId },
      attributes: [
        'status',
        [Applications.sequelize.fn('COUNT', Applications.sequelize.col('status')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    const statusCounts = {
      pending: 0,
      accepted: 0,
      rejected: 0
    };

    stats.forEach(stat => {
      statusCounts[stat.status] = parseInt(stat.count);
    });

    res.json({
      success: true,
      data: {
        applications: applications.rows,
        total: applications.count,
        stats: statusCounts,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error("Artist applications fetch error:", error);
    res.status(500).json({ message: "Failed to fetch applications", error: error.message });
  }
};

export const getProjectApplications = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, limit = 20, offset = 0 } = req.query;

    const project = await Projects.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    let whereClause = { projectId };
    if (status && ['pending', 'accepted', 'rejected'].includes(status)) {
      whereClause.status = status;
    }

    const applications = await Applications.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Artist,
          as: 'artist',
          attributes: ['artistId', 'name', 'avatarUrl', 'skills', 'hourlyRate', 'rating', 'totalCommissions'],
          include: [
            {
              model: Users,
              as: 'user',
              attributes: ['email']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        applications: applications.rows,
        total: applications.count,
        project: {
          projectId: project.projectId,
          title: project.title,
          status: project.status
        },
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error("Project applications fetch error:", error);
    res.status(500).json({ message: "Failed to fetch project applications", error: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, clientMessage } = req.body;

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Applications.findByPk(applicationId, {
      include: [
        {
          model: Projects,
          as: 'project',
          include: [
            {
              model: Clients,
              as: 'client'
            }
          ]
        },
        {
          model: Artist,
          as: 'artist'
        }
      ]
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    await application.update({ status });

    if (status === 'accepted') {
      await Analytics.create({
        artistId: application.artistId,
        eventType: 'application_accepted',
        entityType: 'application',
        entityId: applicationId,
        metadata: { 
          projectId: application.projectId,
          clientMessage 
        },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      await Projects.update(
        { artistId: application.artistId, status: 'in_progress' },
        { where: { projectId: application.projectId } }
      );

      await Applications.update(
        { status: 'rejected' },
        { 
          where: { 
            projectId: application.projectId,
            applicationId: { [Op.ne]: applicationId },
            status: 'pending'
          } 
        }
      );
    }

    const updatedApplication = await Applications.findByPk(applicationId, {
      include: [
        {
          model: Projects,
          as: 'project',
          attributes: ['title', 'budget', 'status']
        },
        {
          model: Artist,
          as: 'artist',
          attributes: ['name', 'avatarUrl']
        }
      ]
    });

    res.json({
      success: true,
      message: "Application status updated successfully",
      data: updatedApplication
    });
  } catch (error) {
    console.error("Application status update error:", error);
    res.status(500).json({ message: "Failed to update application status", error: error.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Applications.findByPk(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status === 'accepted') {
      return res.status(400).json({ message: "Cannot delete accepted application" });
    }

    await application.destroy();

    res.json({
      success: true,
      message: "Application deleted successfully"
    });
  } catch (error) {
    console.error("Application deletion error:", error);
    res.status(500).json({ message: "Failed to delete application", error: error.message });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Applications.findByPk(applicationId, {
      include: [
        {
          model: Projects,
          as: 'project',
          include: [
            {
              model: Clients,
              as: 'client',
              attributes: ['name', 'organization', 'avatarUrl'],
              include: [
                {
                  model: Users,
                  as: 'user',
                  attributes: ['email']
                }
              ]
            }
          ]
        },
        {
          model: Artist,
          as: 'artist',
          attributes: ['name', 'avatarUrl', 'skills', 'hourlyRate', 'rating'],
          include: [
            {
              model: Users,
              as: 'user',
              attributes: ['email']
            }
          ]
        }
      ]
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ success: true, data: application });
  } catch (error) {
    console.error("Application fetch error:", error);
    res.status(500).json({ message: "Failed to fetch application", error: error.message });
  }
};

export const applyToService = async (req, res) => {
  try {
    const { availabilityPostId, clientId, message, proposedBudget, proposedDeadline } = req.body;

    const availabilityPost = await AvailabilityPost.findByPk(availabilityPostId);
    if (!availabilityPost) {
      return res.status(404).json({ message: "Service post not found" });
    }

    if (availabilityPost.status !== 'active') {
      return res.status(400).json({ message: "Service is not available" });
    }

    const client = await Clients.findByPk(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const existingApplication = await Applications.findOne({
      where: { 
        availabilityPostId, 
        clientId, 
        applicationType: "client_to_service" 
      }
    });

    if (existingApplication) {
      return res.status(409).json({ message: "Client has already applied to this service" });
    }

    const application = await Applications.create({
      availabilityPostId,
      clientId,
      artistId: availabilityPost.artistId,
      applicationType: "client_to_service",
      message,
      proposedBudget,
      proposedDeadline,
      status: 'pending'
    });

    const applicationWithDetails = await Applications.findByPk(application.applicationId, {
      include: [
        {
          model: AvailabilityPost,
          as: 'availabilityPost',
          attributes: ['title', 'category', 'budget']
        },
        {
          model: Artist,
          as: 'artist',
          attributes: ['name', 'avatarUrl', 'hourlyRate', 'rating']
        },
        {
          model: Clients,
          as: 'client',
          attributes: ['name', 'organization', 'avatarUrl']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: "Application to service submitted successfully",
      data: applicationWithDetails
    });
  } catch (error) {
    console.error("Service application error:", error);
    res.status(500).json({ message: "Failed to apply to service", error: error.message });
  }
};

export const convertApplicationToProject = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { title, description, budget, deadline } = req.body;

    const application = await Applications.findByPk(applicationId, {
      include: [
        {
          model: JobPost,
          as: 'jobPost'
        },
        {
          model: AvailabilityPost,
          as: 'availabilityPost'
        },
        {
          model: Artist,
          as: 'artist'
        },
        {
          model: Clients,
          as: 'client'
        }
      ]
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status !== 'accepted') {
      return res.status(400).json({ message: "Only accepted applications can be converted to projects" });
    }

    let projectTitle = title;
    let projectDescription = description;
    let projectBudget = budget;
    let clientId, artistId;

    if (application.applicationType === 'artist_to_job') {
      clientId = application.jobPost.clientId;
      artistId = application.artistId;
      projectTitle = projectTitle || application.jobPost.title;
      projectDescription = projectDescription || application.jobPost.description;
      projectBudget = projectBudget || application.proposedBudget || application.jobPost.budget;
    } else if (application.applicationType === 'client_to_service') {
      clientId = application.clientId;
      artistId = application.artistId;
      projectTitle = projectTitle || application.availabilityPost.title;
      projectDescription = projectDescription || application.availabilityPost.description;
      projectBudget = projectBudget || application.proposedBudget || application.availabilityPost.budget;
    } else {
      return res.status(400).json({ message: "Invalid application type" });
    }

    const project = await Projects.create({
      clientId,
      artistId,
      title: projectTitle,
      description: projectDescription,
      budget: projectBudget,
      status: 'in_progress',
      paymentStatus: 'pending'
    });

    await application.update({ 
      status: 'converted_to_project',
      projectId: project.projectId
    });

    if (application.jobPostId) {
      await JobPost.update(
        { status: 'in_progress' },
        { where: { jobId: application.jobPostId } }
      );
    }

    if (application.availabilityPostId) {
      await AvailabilityPost.update(
        { status: 'closed' },
        { where: { postId: application.availabilityPostId } }
      );
    }

    const projectWithDetails = await Projects.findByPk(project.projectId, {
      include: [
        {
          model: Clients,
          as: 'client',
          attributes: ['clientId', 'name', 'organization', 'avatarUrl']
        },
        {
          model: Artist,
          as: 'artist',
          attributes: ['artistId', 'name', 'avatarUrl', 'hourlyRate', 'rating']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: "Application converted to project successfully",
      data: {
        project: projectWithDetails,
        application: application
      }
    });
  } catch (error) {
    console.error("Project conversion error:", error);
    res.status(500).json({ message: "Failed to convert application to project", error: error.message });
  }
};

export const getApplicationsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { userId, limit = 20, offset = 0, status } = req.query;

    if (!['artist_to_job', 'client_to_service'].includes(type)) {
      return res.status(400).json({ message: "Invalid application type" });
    }

    let whereClause = { applicationType: type };
    if (status) whereClause.status = status;

    if (type === 'artist_to_job' && userId) {
      const artist = await Artist.findOne({ where: { userId } });
      if (artist) whereClause.artistId = artist.artistId;
    } else if (type === 'client_to_service' && userId) {
      const client = await Clients.findOne({ where: { userId } });
      if (client) whereClause.clientId = client.clientId;
    }

    const includeModels = [
      {
        model: Artist,
        as: 'artist',
        attributes: ['artistId', 'name', 'avatarUrl', 'hourlyRate', 'rating']
      },
      {
        model: Clients,
        as: 'client',
        attributes: ['clientId', 'name', 'organization', 'avatarUrl']
      }
    ];

    if (type === 'artist_to_job') {
      includeModels.push({
        model: JobPost,
        as: 'jobPost',
        attributes: ['jobId', 'title', 'description', 'budget', 'category']
      });
    } else {
      includeModels.push({
        model: AvailabilityPost,
        as: 'availabilityPost',
        attributes: ['postId', 'title', 'description', 'budget', 'category']
      });
    }

    const applications = await Applications.findAndCountAll({
      where: whereClause,
      include: includeModels,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        applications: applications.rows,
        total: applications.count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error("Applications fetch error:", error);
    res.status(500).json({ message: "Failed to fetch applications", error: error.message });
  }
};

export default {
  createApplication,
  getArtistApplications,
  getProjectApplications,
  updateApplicationStatus,
  deleteApplication,
  getApplicationById,
  applyToService,
  convertApplicationToProject,
  getApplicationsByType
};