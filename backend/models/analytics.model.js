import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";
import { v4 as uuidv4 } from 'uuid';

class Analytics extends Model {
  static associate(models) {
    Analytics.belongsTo(models.Artist, {
      foreignKey: "artistId",
      as: "artist",
      onDelete: "CASCADE",
    });
    Analytics.belongsTo(models.Clients, {
      foreignKey: "clientId",
      as: "client",
      onDelete: "CASCADE",
    });
  }
}

Analytics.init(
  {
    analyticsId: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
      allowNull: false,
    },
    artistId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "artists",
        key: "artistId",
      },
      onDelete: "CASCADE",
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "clients",
        key: "clientId",
      },
      onDelete: "CASCADE",
    },
    eventType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [["profile_view", "portfolio_view", "project_view", "application_submitted", "application_accepted", "project_completed", "message_sent", "like_given"]],
      },
    },
    entityType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isIn: [["profile", "portfolio", "project", "application", "message"]],
      },
    },
    entityId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Analytics",
    tableName: "analytics",
    timestamps: true,
  }
);

export default Analytics;