import { DataTypes, Model, Op } from "sequelize";
import { sequelize } from "../config/database.js";
import { v4 as uuidv4 } from 'uuid';

class JobPost extends Model {
  static associate(models) {
    JobPost.belongsTo(models.Clients, { 
      foreignKey: "clientId", 
      as: "client",
      onDelete: "CASCADE" 
    });
    JobPost.hasMany(models.Applications, { 
      foreignKey: "jobPostId", 
      as: "applications",
      onDelete: "CASCADE" 
    });
  }

  generateSlug() {
    return this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static addHooks() {
    this.addHook('beforeCreate', async (post) => {
      let baseSlug = post.generateSlug();
      let slug = baseSlug;
      let counter = 1;

      while (await JobPost.findOne({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      post.slug = slug;
    });

    this.addHook('beforeUpdate', async (post) => {
      if (post.changed('title')) {
        let baseSlug = post.generateSlug();
        let slug = baseSlug;
        let counter = 1;

        while (await JobPost.findOne({ 
          where: { 
            slug,
            jobId: { [Op.ne]: post.jobId }
          } 
        })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }
        
        post.slug = slug;
      }
    });
  }
}

JobPost.init(
  {
    jobId: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
      allowNull: false,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "clients",
        key: "clientId",
      },
      onDelete: "CASCADE",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [5, 255],
      },
    },
    slug: {
      type: DataTypes.STRING(265),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9-]+$/i,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [20, 5000],
      },
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isIn: [["illustration", "design", "photography", "writing", "video", "music", "animation", "web-development", "other"]],
      },
    },
    budget: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    budgetType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "fixed",
      validate: {
        isIn: [["fixed", "hourly", "negotiable"]],
      },
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    skillsRequired: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    experienceLevel: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "intermediate",
      validate: {
        isIn: [["beginner", "intermediate", "expert", "any"]],
      },
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "open",
      validate: {
        isIn: [["open", "in_progress", "completed", "cancelled", "closed"]],
      },
    },
    applicationsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    viewCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "JobPost",
    tableName: "job_posts",
    timestamps: true,
  }
);

JobPost.addHooks();

export default JobPost;