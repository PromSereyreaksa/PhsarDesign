import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";
import { v4 as uuidv4 } from 'uuid';

class Message extends Model {
  static associate(models) {
    Message.belongsTo(models.Users, {
      foreignKey: "senderId",
      as: "sender",
      onDelete: "CASCADE",
    });
    Message.belongsTo(models.Users, {
      foreignKey: "receiverId",
      as: "receiver",
      onDelete: "CASCADE",
    });
    Message.belongsTo(models.Projects, {
      foreignKey: "projectId",
      as: "project",
      onDelete: "SET NULL",
    });
    Message.belongsTo(models.Applications, {
      foreignKey: "applicationId",
      as: "application",
      onDelete: "SET NULL",
    });
  }
}

Message.init(
  {
    messageId: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "userId",
      },
      onDelete: "CASCADE",
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "userId",
      },
      onDelete: "CASCADE",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 5000],
      },
    },
    messageType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "text",
      validate: {
        isIn: [["text", "image", "file", "system"]],
      },
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "projects",
        key: "projectId",
      },
      onDelete: "SET NULL",
    },
    applicationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "applications",
        key: "applicationId",
      },
      onDelete: "SET NULL",
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    attachmentUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
  },
  {
    sequelize,
    modelName: "Message",
    tableName: "messages",
    timestamps: true,
  }
);

export default Message;