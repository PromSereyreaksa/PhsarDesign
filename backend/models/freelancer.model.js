import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

class Freelancers extends Model {
  static associate(models) {
    // A Freelancer belongs to one User
    Freelancers.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });

    // A Freelancer has many Applications
    Freelancers.hasMany(models.Applications, {
      foreignKey: "freelancerId",
      as: "applications",
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
        model: "users",  // Make sure this matches your actual table name (usually lowercase)
        key: "userId",   // Make sure this matches your Users primary key field name
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
  },
  {
    sequelize,
    modelName: "Freelancers",
    tableName: "freelancers",
    timestamps: true,
  }
);

export default Freelancers;
