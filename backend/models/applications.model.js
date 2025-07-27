import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Applications = sequelize.define("Applications", {
  applicationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  projectId: {
    type: DataTypes.UUID, 
    allowNull: true,
    references: {
      model: "projects", 
      key: "projectId"
    },
    onDelete: "CASCADE"
  },
  jobPostId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "job_posts",
      key: "jobId"
    },
    onDelete: "CASCADE"
  },
  availabilityPostId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "availability_posts",
      key: "postId"
    },
    onDelete: "CASCADE"
  },
  artistId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "artists",
      key: "artistId"
    },
    onDelete: "CASCADE"
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "clients",
      key: "clientId"
    },
    onDelete: "CASCADE"
  },
  applicationType: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  proposedBudget: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  proposedDeadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  portfolio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  experience: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  additionalNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: "pending"
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "applications",
  timestamps: false
});

Applications.associate = (models) => {
  Applications.belongsTo(models.Projects, { foreignKey: "projectId", as: "project" });
  Applications.belongsTo(models.JobPost, { foreignKey: "jobPostId", as: "jobPost" });
  Applications.belongsTo(models.AvailabilityPost, { foreignKey: "availabilityPostId", as: "availabilityPost" });
  Applications.belongsTo(models.Artist, { foreignKey: "artistId", as: "artist" });
  Applications.belongsTo(models.Clients, { foreignKey: "clientId", as: "client" });
};

export default Applications;