import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

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

  // Method to generate slug from name
  generateSlug() {
    return this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  // Hook to generate slug before save
  static addHooks() {
    this.addHook('beforeCreate', async (freelancer) => {
      let baseSlug = freelancer.generateSlug();
      let slug = baseSlug;
      let counter = 1;

      // Check for existing slugs and append number if needed
      while (await Freelancers.findOne({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      freelancer.slug = slug;
    });

    this.addHook('beforeUpdate', async (freelancer) => {
      if (freelancer.changed('name')) {
        let baseSlug = freelancer.generateSlug();
        let slug = baseSlug;
        let counter = 1;

        // Check for existing slugs (excluding current record)
        while (await Freelancers.findOne({ 
          where: { 
            slug,
            freelancerId: { [sequelize.Sequelize.Op.ne]: freelancer.freelancerId }
          } 
        })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }
        
        freelancer.slug = slug;
      }
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
    slug: {
      type: DataTypes.STRING(110),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9-]+$/i, // Only letters, numbers, and hyphens
      },
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

// Add hooks after model initialization
Freelancers.addHooks();

export default Freelancers;