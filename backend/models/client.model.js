import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Users from "./user.model.js"; // Your Users model

const Clients = sequelize.define("Clients", {
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
      model: Users, // Reference the imported model
      key: "userId", // Make sure this matches Users model
    },
    onDelete: "CASCADE", // Correct way to cascade
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
}, {
  tableName: "clients",
  timestamps: true, // Automatically manage createdAt, updatedAt
});

Clients.associate = (models) => {
  Clients.belongsTo(models.Users, { foreignKey: "userId", as: "user" });
  Clients.hasMany(models.Projects, { foreignKey: "clientId", as: "projects" });
};


export default Clients;
