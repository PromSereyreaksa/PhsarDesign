import { Analytics, Artist, Portfolio, Applications, Projects, Reviews } from "../models/index.js";
import { Op } from "sequelize";

export const getArtistAnalytics = async (req, res) => {
  try {
    const { artistId } = req.params;
    const { period = 'month' } = req.query;

    const artist = await Artist.findByPk(artistId);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case 'week':
        dateFilter = {
          date: {
            [Op.gte]: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          }
        };
        break;
      case 'month':
        dateFilter = {
          date: {
            [Op.gte]: new Date(now.getFullYear(), now.getMonth(), 1)
          }
        };
        break;
      case 'year':
        dateFilter = {
          date: {
            [Op.gte]: new Date(now.getFullYear(), 0, 1)
          }
        };
        break;
    }

    const [
      profileViews,
      portfolioViews,
      totalApplications,
      acceptedApplications,
      totalProjects,
      completedProjects,
      averageRating,
      totalReviews,
      portfolioItems,
      recentActivity
    ] = await Promise.all([
      Analytics.count({
        where: {
          artistId,
          eventType: 'profile_view',
          ...dateFilter
        }
      }),
      Analytics.count({
        where: {
          artistId,
          eventType: 'portfolio_view',
          ...dateFilter
        }
      }),
      Applications.count({
        where: { artistId }
      }),
      Applications.count({
        where: { artistId, status: 'accepted' }
      }),
      Projects.count({
        where: { artistId }
      }),
      Projects.count({
        where: { artistId, status: 'completed' }
      }),
      Reviews.findOne({
        where: { artistId },
        attributes: [[Analytics.sequelize.fn('AVG', Analytics.sequelize.col('rating')), 'averageRating']]
      }),
      Reviews.count({
        where: { artistId }
      }),
      Portfolio.count({
        where: { artistId }
      }),
      Analytics.findAll({
        where: {
          artistId,
          ...dateFilter
        },
        order: [['createdAt', 'DESC']],
        limit: 10,
        attributes: ['eventType', 'createdAt', 'metadata']
      })
    ]);

    const stats = {
      overview: {
        profileViews,
        portfolioViews,
        totalApplications,
        acceptedApplications,
        totalProjects,
        completedProjects,
        portfolioItems,
        averageRating: averageRating?.dataValues?.averageRating || 0,
        totalReviews
      },
      recentActivity,
      successRate: totalApplications > 0 ? (acceptedApplications / totalApplications * 100) : 0,
      completionRate: totalProjects > 0 ? (completedProjects / totalProjects * 100) : 0
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    res.status(500).json({ message: "Failed to fetch analytics", error: error.message });
  }
};

export const getClientAnalytics = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { period = 'month' } = req.query;

    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case 'week':
        dateFilter = {
          createdAt: {
            [Op.gte]: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          }
        };
        break;
      case 'month':
        dateFilter = {
          createdAt: {
            [Op.gte]: new Date(now.getFullYear(), now.getMonth(), 1)
          }
        };
        break;
      case 'year':
        dateFilter = {
          createdAt: {
            [Op.gte]: new Date(now.getFullYear(), 0, 1)
          }
        };
        break;
    }

    const [
      totalProjects,
      activeProjects,
      completedProjects,
      totalApplications,
      averageCompletionTime,
      totalSpent
    ] = await Promise.all([
      Projects.count({
        where: { clientId }
      }),
      Projects.count({
        where: { clientId, status: 'in_progress' }
      }),
      Projects.count({
        where: { clientId, status: 'completed' }
      }),
      Applications.count({
        include: [{
          model: Projects,
          as: 'project',
          where: { clientId }
        }]
      }),
      Projects.findOne({
        where: { 
          clientId, 
          status: 'completed',
          completedAt: { [Op.not]: null }
        },
        attributes: [
          [Projects.sequelize.fn('AVG', 
            Projects.sequelize.literal('EXTRACT(DAY FROM ("completedAt" - "createdAt"))')
          ), 'avgDays']
        ]
      }),
      Projects.sum('budget', {
        where: { clientId, status: 'completed' }
      })
    ]);

    const recentProjects = await Projects.findAll({
      where: { clientId, ...dateFilter },
      order: [['createdAt', 'DESC']],
      limit: 5,
      include: [
        {
          model: Applications,
          as: 'applications',
          attributes: ['applicationId', 'status']
        }
      ]
    });

    const stats = {
      overview: {
        totalProjects,
        activeProjects,
        completedProjects,
        totalApplications,
        averageCompletionTime: averageCompletionTime?.dataValues?.avgDays || 0,
        totalSpent: totalSpent || 0
      },
      recentProjects,
      completionRate: totalProjects > 0 ? (completedProjects / totalProjects * 100) : 0
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error("Client analytics fetch error:", error);
    res.status(500).json({ message: "Failed to fetch client analytics", error: error.message });
  }
};

export const trackAnalytics = async (req, res) => {
  try {
    const { eventType, entityType, entityId, artistId, clientId, metadata } = req.body;
    
    const analyticsData = {
      eventType,
      entityType,
      entityId,
      artistId,
      clientId,
      metadata: metadata || {},
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      date: new Date()
    };

    await Analytics.create(analyticsData);
    
    res.json({ success: true, message: "Analytics tracked successfully" });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    res.status(500).json({ message: "Failed to track analytics", error: error.message });
  }
};

export default {
  getArtistAnalytics,
  getClientAnalytics,
  trackAnalytics
};