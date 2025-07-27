import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";
import { v4 as uuidv4 } from 'uuid';

class Notification extends Model {
  static associate(models) {
    Notification.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });
    Notification.belongsTo(models.Users, {
      foreignKey: "fromUserId",
      as: "fromUser",
      onDelete: "SET NULL",
    });
    Notification.belongsTo(models.Projects, {
      foreignKey: "relatedProjectId",
      as: "relatedProject",
      onDelete: "SET NULL",
    });
    Notification.belongsTo(models.Applications, {
      foreignKey: "relatedApplicationId",
      as: "relatedApplication",
      onDelete: "SET NULL",
    });
  }
}

Notification.init(
  {
    notificationId: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "userId",
      },
      onDelete: "CASCADE",
    },
    fromUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "userId",
      },
      onDelete: "SET NULL",
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [["application_received", "application_accepted", "application_rejected", "project_completed", "message_received", "project_invite", "payment_received", "review_received"]],
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [1, 255],
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 1000],
      },
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
    actionUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    relatedProjectId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "projects",
        key: "projectId",
      },
      onDelete: "SET NULL",
    },
    relatedApplicationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "applications",
        key: "applicationId",
      },
      onDelete: "SET NULL",
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    priority: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "normal",
      validate: {
        isIn: [["low", "normal", "high", "urgent"]],
      },
    },
  },
  {
    sequelize,
    modelName: "Notification",
    tableName: "notifications",
    timestamps: true,
  }
);

export default Notification;