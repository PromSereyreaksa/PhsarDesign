import { DataTypes, Model, Op } from "sequelize";
import { sequelize } from "../config/database.js";

class Artist extends Model {
  static associate(models) {
    Artist.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });
    Artist.hasMany(models.Applications, {
      foreignKey: "artistId",
      as: "applications",
      onDelete: "CASCADE",
    });
    Artist.hasMany(models.Reviews, {
      foreignKey: "artistId",
      as: "reviews",
      onDelete: "CASCADE",
    });
    Artist.hasMany(models.CommissionRequest, {
      foreignKey: "artistId",
      as: "commissions",
      onDelete: "CASCADE",
    });
    Artist.hasMany(models.AvailabilityPost, {
      foreignKey: "artistId",
      as: "availabilityPosts",
      onDelete: "CASCADE",
    });
    Artist.hasMany(models.Portfolio, {
      foreignKey: "artistId",
      as: "portfolio",
      onDelete: "CASCADE",
    });
    Artist.hasMany(models.Analytics, {
      foreignKey: "artistId",
      as: "analytics",
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
      while (await Artist.findOne({ where: { slug } })) {
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
        while (await Artist.findOne({ 
          where: { 
            slug,
            artistId: { [Op.ne]: freelancer.artistId }
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

Artist.init(
  {
    artistId: {
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
      allowNull: true, // Allow null during migration
      unique: true,
      validate: {
        is: /^[a-z0-9-]+$/i, // Only letters, numbers, and hyphens
      },
    },
    skills: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    specialties: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    availability: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "available"
    },
    hourlyRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    portfolioUrl: {
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
    totalCommissions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "Artist",
    tableName: "artists",
    timestamps: true,
  }
);

Artist.addHooks();

export default Artist;
