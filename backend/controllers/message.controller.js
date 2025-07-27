import { Message, Users, Projects, Applications, Notification } from "../models/index.js";
import { Op } from "sequelize";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const { receiverId, content, messageType = "text", projectId, applicationId, attachmentUrl } = req.body;

    const receiver = await Users.findByPk(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const message = await Message.create({
      senderId,
      receiverId,
      content,
      messageType,
      projectId,
      applicationId,
      attachmentUrl
    });

    await Notification.create({
      userId: receiverId,
      fromUserId: senderId,
      type: "message_received",
      title: "New Message",
      message: `You have a new message from ${req.user.email}`,
      metadata: { messageId: message.messageId },
      priority: "normal"
    });

    const messageWithDetails = await Message.findByPk(message.messageId, {
      include: [
        {
          model: Users,
          as: 'sender',
          attributes: ['userId', 'email', 'role']
        },
        {
          model: Users,
          as: 'receiver',
          attributes: ['userId', 'email', 'role']
        },
        {
          model: Projects,
          as: 'project',
          attributes: ['projectId', 'title']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: messageWithDetails
    });
  } catch (error) {
    console.error("Message sending error:", error);
    res.status(500).json({ message: "Failed to send message", error: error.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { otherUserId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const messages = await Message.findAndCountAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId }
        ]
      },
      include: [
        {
          model: Users,
          as: 'sender',
          attributes: ['userId', 'email', 'role']
        },
        {
          model: Users,
          as: 'receiver',
          attributes: ['userId', 'email', 'role']
        },
        {
          model: Projects,
          as: 'project',
          attributes: ['projectId', 'title']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    await Message.update(
      { isRead: true, readAt: new Date() },
      {
        where: {
          senderId: otherUserId,
          receiverId: userId,
          isRead: false
        }
      }
    );

    res.json({
      success: true,
      data: {
        messages: messages.rows.reverse(),
        total: messages.count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error("Conversation fetch error:", error);
    res.status(500).json({ message: "Failed to fetch conversation", error: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 20, offset = 0 } = req.query;

    const conversations = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      attributes: [
        'senderId',
        'receiverId',
        [Message.sequelize.fn('MAX', Message.sequelize.col('createdAt')), 'lastMessageAt'],
        [Message.sequelize.fn('COUNT', Message.sequelize.col('messageId')), 'messageCount']
      ],
      group: ['senderId', 'receiverId'],
      order: [[Message.sequelize.fn('MAX', Message.sequelize.col('createdAt')), 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      raw: true
    });

    const formattedConversations = [];
    const processedUsers = new Set();

    for (const conv of conversations) {
      const otherUserId = conv.senderId === userId ? conv.receiverId : conv.senderId;
      
      if (processedUsers.has(otherUserId)) continue;
      processedUsers.add(otherUserId);

      const otherUser = await Users.findByPk(otherUserId, {
        attributes: ['userId', 'email', 'role']
      });

      const lastMessage = await Message.findOne({
        where: {
          [Op.or]: [
            { senderId: userId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: userId }
          ]
        },
        order: [['createdAt', 'DESC']],
        attributes: ['content', 'messageType', 'createdAt', 'isRead', 'senderId']
      });

      const unreadCount = await Message.count({
        where: {
          senderId: otherUserId,
          receiverId: userId,
          isRead: false
        }
      });

      formattedConversations.push({
        otherUser,
        lastMessage,
        unreadCount,
        lastMessageAt: conv.lastMessageAt
      });
    }

    res.json({
      success: true,
      data: {
        conversations: formattedConversations,
        total: formattedConversations.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error("Conversations fetch error:", error);
    res.status(500).json({ message: "Failed to fetch conversations", error: error.message });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { otherUserId } = req.params;

    const updatedCount = await Message.update(
      { isRead: true, readAt: new Date() },
      {
        where: {
          senderId: otherUserId,
          receiverId: userId,
          isRead: false
        }
      }
    );

    res.json({
      success: true,
      message: "Messages marked as read",
      data: { updatedCount: updatedCount[0] }
    });
  } catch (error) {
    console.error("Mark messages as read error:", error);
    res.status(500).json({ message: "Failed to mark messages as read", error: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { messageId } = req.params;

    const message = await Message.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.senderId !== userId) {
      return res.status(403).json({ message: "You can only delete your own messages" });
    }

    await message.destroy();

    res.json({
      success: true,
      message: "Message deleted successfully"
    });
  } catch (error) {
    console.error("Message deletion error:", error);
    res.status(500).json({ message: "Failed to delete message", error: error.message });
  }
};

export const getUnreadMessageCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const unreadCount = await Message.count({
      where: {
        receiverId: userId,
        isRead: false
      }
    });

    res.json({
      success: true,
      data: { unreadCount }
    });
  } catch (error) {
    console.error("Unread count fetch error:", error);
    res.status(500).json({ message: "Failed to fetch unread count", error: error.message });
  }
};

export default {
  sendMessage,
  getConversation,
  getConversations,
  markMessagesAsRead,
  deleteMessage,
  getUnreadMessageCount
};