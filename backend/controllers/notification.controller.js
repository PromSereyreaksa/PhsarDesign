import { Notification, Users, Projects, Applications } from "../models/index.js";
import { Op } from "sequelize";

export const createNotification = async (req, res) => {
  try {
    const { userId, type, title, message, actionUrl, relatedProjectId, relatedApplicationId, priority = "normal" } = req.body;
    const fromUserId = req.user?.userId;

    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const notification = await Notification.create({
      userId,
      fromUserId,
      type,
      title,
      message,
      actionUrl,
      relatedProjectId,
      relatedApplicationId,
      priority
    });

    const notificationWithDetails = await Notification.findByPk(notification.notificationId, {
      include: [
        {
          model: Users,
          as: 'fromUser',
          attributes: ['userId', 'email', 'role']
        },
        {
          model: Projects,
          as: 'relatedProject',
          attributes: ['projectId', 'title']
        },
        {
          model: Applications,
          as: 'relatedApplication',
          attributes: ['applicationId', 'status']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: notificationWithDetails
    });
  } catch (error) {
    console.error("Notification creation error:", error);
    res.status(500).json({ message: "Failed to create notification", error: error.message });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { isRead, type, limit = 20, offset = 0 } = req.query;

    let whereClause = { userId };
    
    if (isRead !== undefined) {
      whereClause.isRead = isRead === 'true';
    }
    
    if (type) {
      whereClause.type = type;
    }

    const notifications = await Notification.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Users,
          as: 'fromUser',
          attributes: ['userId', 'email', 'role']
        },
        {
          model: Projects,
          as: 'relatedProject',
          attributes: ['projectId', 'title']
        },
        {
          model: Applications,
          as: 'relatedApplication',
          attributes: ['applicationId', 'status']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        notifications: notifications.rows,
        total: notifications.count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error("Notifications fetch error:", error);
    res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { notificationId } = req.params;

    const notification = await Notification.findOne({
      where: {
        notificationId,
        userId
      }
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.update({
      isRead: true,
      readAt: new Date()
    });

    res.json({
      success: true,
      message: "Notification marked as read",
      data: notification
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);
    res.status(500).json({ message: "Failed to mark notification as read", error: error.message });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    const updatedCount = await Notification.update(
      { isRead: true, readAt: new Date() },
      {
        where: {
          userId,
          isRead: false
        }
      }
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
      data: { updatedCount: updatedCount[0] }
    });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    res.status(500).json({ message: "Failed to mark all notifications as read", error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { notificationId } = req.params;

    const notification = await Notification.findOne({
      where: {
        notificationId,
        userId
      }
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.destroy();

    res.json({
      success: true,
      message: "Notification deleted successfully"
    });
  } catch (error) {
    console.error("Notification deletion error:", error);
    res.status(500).json({ message: "Failed to delete notification", error: error.message });
  }
};

export const getUnreadNotificationCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const unreadCount = await Notification.count({
      where: {
        userId,
        isRead: false
      }
    });

    const priorityCounts = await Notification.findAll({
      where: {
        userId,
        isRead: false
      },
      attributes: [
        'priority',
        [Notification.sequelize.fn('COUNT', Notification.sequelize.col('priority')), 'count']
      ],
      group: ['priority'],
      raw: true
    });

    const counts = {
      total: unreadCount,
      low: 0,
      normal: 0,
      high: 0,
      urgent: 0
    };

    priorityCounts.forEach(item => {
      counts[item.priority] = parseInt(item.count);
    });

    res.json({
      success: true,
      data: counts
    });
  } catch (error) {
    console.error("Unread notification count fetch error:", error);
    res.status(500).json({ message: "Failed to fetch unread notification count", error: error.message });
  }
};

export const getNotificationTypes = async (req, res) => {
  try {
    const types = [
      "application_received",
      "application_accepted", 
      "application_rejected",
      "project_completed",
      "message_received",
      "project_invite",
      "payment_received",
      "review_received"
    ];

    res.json({
      success: true,
      data: types
    });
  } catch (error) {
    console.error("Notification types fetch error:", error);
    res.status(500).json({ message: "Failed to fetch notification types", error: error.message });
  }
};

export const createBulkNotifications = async (userIds, notificationData) => {
  try {
    const notifications = userIds.map(userId => ({
      ...notificationData,
      userId
    }));

    await Notification.bulkCreate(notifications);
    return { success: true };
  } catch (error) {
    console.error("Bulk notification creation error:", error);
    return { success: false, error: error.message };
  }
};

export default {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount,
  getNotificationTypes,
  createBulkNotifications
};