import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";
import Users from "./user.model.js"; // Import the Users model

class Clients extends Model {
  // You can add custom methods here if needed
}

Clients.init(
  {
    clientId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: Users,
        key: "userId",
      },
      onDelete: "CASCADE",
    },
    organization: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
  },
  {
    sequelize,
    modelName: "Clients",
    tableName: "clients",
    timestamps: true,
  }
);

// Define associations as a static method (recommended)
Clients.associate = (models) => {
  Clients.belongsTo(models.Users, { foreignKey: "userId", as: "user" });
  Clients.hasMany(models.Projects, { foreignKey: "clientId", as: "projects" });
};

export default Clients;
