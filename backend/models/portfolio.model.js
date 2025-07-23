import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
// Make sure Freelancers is imported
import Freelancers from './freelancer.model.js';

class Portfolio extends Model {
  static associate(models) {
    Portfolio.belongsTo(models.Freelancers, { foreignKey: 'freelancerId', as: 'freelancer' });
  }
  static async createPortfolio(data) {
    try {
      const portfolio = await this.create(data);
      return portfolio;
    } catch (error) {
      console.error("Error creating portfolio:", error);
      throw error;
    }
  }
}

Portfolio.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  freelancerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'freelancers',
      key: 'freelancerId'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  projectUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Portfolio'
});



export default Portfolio;
