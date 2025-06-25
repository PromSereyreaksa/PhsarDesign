import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";
import Users from "./user.model.js";

class Messages extends Model {
  static associate(models) {
    Messages.belongsTo(models.Users, { foreignKey: "senderId", as: "sender" });
    Messages.belongsTo(models.Users, { foreignKey: "receiverId", as: "receiver" });
  }
}

Messages.init(
  {
    messageId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Users,
        key: "userId",
      },
      onDelete: "CASCADE",
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Users,
        key: "userId",
      },
      onDelete: "CASCADE",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 5000],
      },
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Messages",
    tableName: "messages",
    timestamps: false, // disables createdAt and updatedAt
  }
);

export default Messages;
