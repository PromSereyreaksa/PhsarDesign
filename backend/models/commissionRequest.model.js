import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";
import Users from "./user.model.js";

class CommissionRequest extends Model {
  static associate(models) {
    CommissionRequest.belongsTo(models.Users, { 
      foreignKey: "artistId", 
      as: "artist" 
    });
    CommissionRequest.belongsTo(models.Users, { 
      foreignKey: "clientId", 
      as: "client" 
    });
  }

  static async createCommission(data) {
    try {
      const commission = await this.create(data);
      return commission;
    } catch (error) {
      console.error("Error creating commission request:", error);
      throw error;
    }
  }

  async addProgressUpdate(message, imageUrl = null) {
    try {
      const currentUpdates = this.progressUpdates || [];
      const newUpdate = {
        id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message,
        imageUrl,
        timestamp: new Date()
      };
      
      await this.update({
        progressUpdates: [...currentUpdates, newUpdate]
      });
      
      return newUpdate;
    } catch (error) {
      console.error("Error adding progress update:", error);
      throw error;
    }
  }
}

CommissionRequest.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  artistId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Users,
      key: "userId"
    },
    onDelete: "CASCADE"
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Users,
      key: "userId"
    },
    onDelete: "CASCADE"
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 5000]
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'completed'),
    allowNull: false,
    defaultValue: 'pending'
  },
  progressUpdates: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: "CommissionRequest",
  tableName: "commission_requests",
  timestamps: true
});

export default CommissionRequest;