// models/portfolio.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Freelancers from "./freelancer.model.js"; 

const Portfolio = sequelize.define("Portfolio", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  freelancerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "freelancers",
      key: "freelancerId",
    },
    onDelete: "CASCADE",
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  projectUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true,
    },
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Use JSON if using MySQL
    allowNull: true,
    defaultValue: [],
  },
}, {
  tableName: "portfolios",
  timestamps: true,
});

// In models/freelancer.model.js
Freelancers.hasMany(Portfolio, { foreignKey: "freelancerId" });
Portfolio.belongsTo(Freelancers, { foreignKey: "freelancerId" });


export default Portfolio;
