import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Projects = sequelize.define("Projects", {
  projectId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "clients", // Match the actual table name in the DB
      key: "clientId"
    },
    onDelete: "CASCADE"
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [2, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 5000]
    }
  },
  budget: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: "open",
    validate: {
      isIn: [["open", "in_progress", "completed", "cancelled"]]
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: "projects",
  timestamps: false // If you manually define createdAt, updatedAt
});

Projects.associate = (models) => {
  Projects.belongsTo(models.Clients, { foreignKey: "clientId", as: "client" });
  Projects.hasMany(models.Applications, { foreignKey: "projectId", as: "applications" });
};


export default Projects;
