import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";
import { v4 as uuidv4 } from 'uuid';

class Portfolio extends Model {
  static associate(models) {
    Portfolio.belongsTo(models.Artist, {
      foreignKey: "artistId",
      as: "artist",
      onDelete: "CASCADE",
    });
  }
}

Portfolio.init(
  {
    portfolioId: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
      allowNull: false,
    },
    artistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "artists",
        key: "artistId",
      },
      onDelete: "CASCADE",
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: [2, 200],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 1000],
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [["illustration", "design", "photography", "writing", "video", "music", "animation", "web-development", "other"]],
      },
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    projectUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    completionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Portfolio",
    tableName: "portfolio",
    timestamps: true,
  }
);

export default Portfolio;