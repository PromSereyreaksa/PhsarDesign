import { Applications, Projects, JobPost, AvailabilityPost, Artist, Clients, Analytics, Users, Notification } from "../models/index.js";
import { Op } from "sequelize";

export const createApplication = async (req, res) => {
  try {
    console.log('createApplication called with body:', req.body);
    console.log('Request user:', req.user);
    
    const { 
      jobPostId, 
      availabilityPostId,
      artistId, 
      clientId,
      message, 
      proposedBudget, 
      proposedDeadline, 
      applicationType,
      name,
      portfolio,
      experience,
      additionalNotes
    } = req.body;

    let finalArtistId = artistId;
    let finalClientId = clientId;

    // If no artistId/clientId provided, try to get it from the authenticated user
    if (!finalArtistId && !finalClientId && req.user) {
      const userId = req.user.userId;
      
      if (!userId) {
        return res.status(400).json({ 
          error: "Invalid user ID. User ID must be a valid number.",
          received: userId
        });
      }

      // Check user role and get corresponding profile ID
      if (req.user.role === 'artist' || req.user.role === 'freelancer') {
        const artist = await Artist.findOne({ where: { userId } });
        if (!artist) {
          return res.status(404).json({ 
            error: "Artist profile not found for this user.",
            userId: userId
          });
        }
        finalArtistId = artist.artistId;
      } else if (req.user.role === 'client') {
        const client = await Clients.findOne({ where: { userId } });
        if (!client) {
          return res.status(404).json({ 
            error: "Client profile not found for this user.",
            userId: userId
          });
        }
        finalClientId = client.clientId;
      }
    }

    console.log('Creating application with data:', {
      jobPostId,
      availabilityPostId,
      artistId: finalArtistId,
      clientId: finalClientId,
      message,
      proposedBudget,
      proposedDeadline,
      applicationType,
      name,
      portfolio,
      experience,
      additionalNotes
    });

    const application = await Applications.create({
      jobPostId,
      availabilityPostId,
      artistId: finalArtistId,
      clientId: finalClientId,
      message,
      proposedBudget,
      proposedDeadline,
      applicationType: applicationType || 'artist_to_job',
      name,
      portfolio,
      experience,
      additionalNotes,
      status: 'pending'
    });

    // Skip analytics for testing
    // await Analytics.create({
    //   artistId,
    //   eventType: 'application_submitted',
    //   entityType: 'application',
    //   entityId: application.applicationId,
    //   metadata: { projectId },
    //   ipAddress: req.ip,
    //   userAgent: req.get('User-Agent')
    // });

    console.log('Regular application created successfully:', application.applicationId);

    // Create notification for the recipient (artist or client)
    try {
      let notificationData = {};
      
      if (applicationType === 'client_to_service' && finalArtistId) {
        // Client applying to hire an artist - notify the artist
        const artist = await Artist.findByPk(finalArtistId, {
          include: [{ model: Users, as: 'user', attributes: ['userId', 'email'] }]
        });
        
        if (artist && artist.user) {
          const client = await Clients.findByPk(finalClientId, {
            include: [{ model: Users, as: 'user', attributes: ['userId', 'email'] }]
          });
          
          notificationData = {
            userId: artist.user.userId,
            fromUserId: client?.user?.userId || req.user.userId,
            type: 'application_received',
            title: 'New Service Request',
            message: `${client?.name || 'A client'} wants to hire you for a project. "${message || 'No message provided'}"`,
            actionUrl: `/dashboard/applications/${application.applicationId}`,
            relatedApplicationId: application.applicationId,
            priority: 'normal'
          };
        }
      } else if (applicationType === 'artist_to_job' && jobPostId) {
        // Artist applying to a job post - notify the client who posted the job
        const project = await Projects.findByPk(jobPostId, {
          include: [
            { 
              model: Clients, 
              as: 'client',
              include: [{ model: Users, as: 'user', attributes: ['userId', 'email'] }]
            }
          ]
        });
        
        if (project && project.client && project.client.user) {
          const artist = await Artist.findByPk(finalArtistId, {
            include: [{ model: Users, as: 'user', attributes: ['userId', 'email'] }]
          });
          
          notificationData = {
            userId: project.client.user.userId,
            fromUserId: artist?.user?.userId || req.user.userId,
            type: 'application_received',
            title: 'New Job Application',
            message: `${artist?.name || 'An artist'} has applied to your project "${project.title}". "${message || 'No message provided'}"`,
            actionUrl: `/dashboard/projects/${project.projectId}/applications`,
            relatedApplicationId: application.applicationId,
            relatedProjectId: project.projectId,
            priority: 'normal'
          };
        }
      }

      // Create the notification if we have valid data
      if (notificationData.userId) {
        await Notification.create(notificationData);
        console.log('Notification created for application:', application.applicationId);
      }
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError);
      // Don't fail the application creation if notification fails
    }

    // SIMPLIFIED RESPONSE FOR TESTING
    // const applicationWithDetails = await Applications.findByPk(application.applicationId, {
    //   include: [
    //     {
    //       model: Projects,
    //       as: 'project',
    //       attributes: ['title', 'budget', 'status'],
    //       include: [
    //         {
    //           model: Clients,
    //           as: 'client',
    //           attributes: ['name', 'organization'],
    //           include: [
    //             {
    //               model: Users,
    //               as: 'user',
    //               attributes: ['email']
    //             }
    //           ]
    //         }
    //       ]
    //     },
    //     {
    //       model: Artist,
    //       as: 'artist',
    //       attributes: ['name', 'avatarUrl', 'hourlyRate'],
    //       include: [
    //         {
    //           model: Users,
    //           as: 'user',
    //           attributes: ['email']
    //         }
    //       ]
    //     }
    //   ]
    // });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application // Simplified: just return the basic application data
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

    // Create notification for status update
    try {
      console.log('Creating notification for status update:', { applicationId, status, userId: req.user?.userId });
      let notificationData = {};
      
      if (status === 'accepted') {
        // Notify the artist that their application was accepted
        if (application.artist) {
          const artist = await Artist.findByPk(application.artistId, {
            include: [{ model: Users, as: 'user', attributes: ['userId', 'email'] }]
          });
          
          console.log('Found artist for notification:', artist ? { artistId: artist.artistId, userId: artist.user?.userId } : 'null');
          
          if (artist && artist.user) {
            notificationData = {
              userId: artist.user.userId,
              fromUserId: req.user?.userId,
              type: 'application_accepted',
              title: 'Application Accepted! 🎉',
              message: `Congratulations! Your application for "${application.project?.title || 'a project'}" has been accepted. ${clientMessage || 'The client is excited to work with you!'}`,
              actionUrl: `/dashboard/projects/${application.projectId}`,
              relatedApplicationId: application.applicationId,
              relatedProjectId: application.projectId,
              priority: 'high'
            };
            
            console.log('Notification data created:', notificationData);
          }
        }
      } else if (status === 'rejected') {
        // Notify the artist that their application was rejected
        if (application.artist) {
          const artist = await Artist.findByPk(application.artistId, {
            include: [{ model: Users, as: 'user', attributes: ['userId', 'email'] }]
          });
          
          console.log('Found artist for rejection notification:', artist ? { artistId: artist.artistId, userId: artist.user?.userId } : 'null');
          
          if (artist && artist.user) {
            notificationData = {
              userId: artist.user.userId,
              fromUserId: req.user?.userId,
              type: 'application_rejected',
              title: 'Application Update',
              message: `Your application for "${application.project?.title || 'a project'}" was not selected this time. ${clientMessage || 'Keep applying to other projects!'}`,
              actionUrl: `/dashboard/applications/${application.applicationId}`,
              relatedApplicationId: application.applicationId,
              relatedProjectId: application.projectId,
              priority: 'normal'
            };
            
            console.log('Rejection notification data created:', notificationData);
          }
        }
      }

      // Create the notification if we have valid data
      if (notificationData.userId) {
        const createdNotification = await Notification.create(notificationData);
        console.log('Status update notification created successfully:', {
          notificationId: createdNotification.notificationId,
          applicationId,
          status,
          userId: notificationData.userId
        });
      } else {
        console.log('No notification data to create - missing userId or artist info');
      }
    } catch (notificationError) {
      console.error('Failed to create status update notification:', notificationError);
      console.error('Notification error details:', notificationError.message);
      // Don't fail the status update if notification fails
    }

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
    console.log('applyToService called with body:', req.body);
    const { 
      availabilityPostId, 
      clientId, 
      message, 
      proposedBudget, 
      proposedDeadline,
      applicationType,
      name,
      portfolio,
      experience,
      additionalNotes
    } = req.body;

    // TEMPORARILY SIMPLIFIED FOR TESTING - Skip all validations
    console.log('Creating application with data:', {
      availabilityPostId,
      clientId,
      message,
      proposedBudget,
      proposedDeadline,
      applicationType,
      name,
      portfolio,
      experience,
      additionalNotes
    });

    const application = await Applications.create({
      availabilityPostId,
      clientId,
      applicationType: applicationType || "client_to_service",
      message,
      proposedBudget,
      proposedDeadline,
      name,
      portfolio,
      experience,
      additionalNotes,
      status: 'pending'
    });

    // SIMPLIFIED RESPONSE FOR TESTING
    console.log('Application created successfully:', application.applicationId);

    res.status(201).json({
      success: true,
      message: "Application to service submitted successfully",
      data: application // Simplified: just return the basic application data
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