import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

class Users extends Model {
    static associate(models) {
        Users.hasOne(models.Clients, { 
            foreignKey: 'userId',
            as: 'clientProfile'
        });
        Users.hasOne(models.Artist, { 
            foreignKey: 'userId',
            as: 'artistProfile'
        });
    }

    // Helper to check only one profile exists
    async hasSingleProfile() {
        const client = await this.getClientProfile();
        const artist = await this.getArtistProfile();
        return (client && !artist) || (!client && artist);
    }
}




Users.init({
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [6, 100] // Password must be between 6 and 100 characters
    }
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user', // Default role is 'user'
    validate: {
      isIn: [['client', 'artist']] // Role must be either 'client' or 'artist'
    }
  },
  stripeCustomerId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
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
  modelName: 'Users',
  tableName: 'users', // Optional: explicitly set table name
  timestamps: true // This will automatically handle createdAt and updatedAt
});

export default Users;