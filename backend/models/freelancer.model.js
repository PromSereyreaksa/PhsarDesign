import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

import Reviews from "./review.model.js";

class Freelancers extends Model {
  static associate(models) {
    Freelancers.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });
    Freelancers.hasMany(models.Applications, {
      foreignKey: "freelancerId",
      as: "applications",
      onDelete: "CASCADE",
    });
    Freelancers.hasMany(models.Reviews, {
      foreignKey: "freelancerId",
      as: "reviews",
      onDelete: "CASCADE",
    });
  }
}

Freelancers.init(
  {
    freelancerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    skills: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    availability: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    portfolio_images_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null,
      validate: {
        min: 1,
        max: 5,
      },
    },
  },
  {
    sequelize,
    modelName: "Freelancers",
    tableName: "freelancers",
    timestamps: true,
  }
);

export default Freelancers;
