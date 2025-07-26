import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

class Projects extends Model {
  static associate(models) {
    Projects.belongsTo(models.Clients, { foreignKey: "clientId", as: "client" });
    Projects.belongsTo(models.Artist, { foreignKey: "artistId", as: "artist" });
    Projects.hasMany(models.Applications, { foreignKey: "projectId", as: "applications" });
  }
}

Projects.init(
  {
    projectId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "clients", // Table name in the database
        key: "clientId",
      },
      onDelete: "CASCADE",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [2, 255],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 5000],
      },
    },
    budget: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "open",
      validate: {
        isIn: [["open", "in_progress", "completed", "cancelled", "paid"]],
      },
    },
    paymentStatus: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "pending",
      validate: {
        isIn: [["pending", "processing", "completed", "failed", "refunded"]],
      },
    },
    paymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    artistId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "artists",
        key: "artistId",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Projects",
    tableName: "projects",
    timestamps: false, // You manually defined createdAt, no updatedAt here
  }
);


export default Projects;
