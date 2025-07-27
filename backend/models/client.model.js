import { DataTypes, Model, Op } from "sequelize";
import { sequelize } from "../config/database.js";
import Users from "./user.model.js";

class Clients extends Model {
  static associate(models) {
    Clients.belongsTo(models.Users, { foreignKey: "userId", as: "user" });
    Clients.hasMany(models.Projects, { foreignKey: "clientId", as: "projects" });
    Clients.hasMany(models.JobPost, { 
      foreignKey: "clientId", 
      as: "jobPosts",
      onDelete: "CASCADE" 
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
    this.addHook('beforeCreate', async (client) => {
      let baseSlug = client.generateSlug();
      let slug = baseSlug;
      let counter = 1;

      // Check for existing slugs and append number if needed
      while (await Clients.findOne({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      client.slug = slug;
    });

    this.addHook('beforeUpdate', async (client) => {
      if (client.changed('name')) {
        let baseSlug = client.generateSlug();
        let slug = baseSlug;
        let counter = 1;

        // Check for existing slugs (excluding current record)
        while (await Clients.findOne({ 
          where: { 
            slug,
            clientId: { [Op.ne]: client.clientId }
          } 
        })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }
        
        client.slug = slug;
      }
    });
  }
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
    slug: {
      type: DataTypes.STRING(110),
      allowNull: true, // Allow null during migration
      unique: true,
      validate: {
        is: /^[a-z0-9-]+$/i, // Only letters, numbers, and hyphens
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

// Add hooks after model initialization
Clients.addHooks();

export default Clients;