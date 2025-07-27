import { DataTypes, Model, Op } from "sequelize";
import { sequelize } from "../config/database.js";
import { v4 as uuidv4 } from 'uuid';

class AvailabilityPost extends Model {
  static associate(models) {
    AvailabilityPost.belongsTo(models.Artist, { 
      foreignKey: "artistId", 
      as: "artist",
      onDelete: "CASCADE" 
    });
    AvailabilityPost.hasMany(models.Applications, { 
      foreignKey: "availabilityPostId", 
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

      while (await AvailabilityPost.findOne({ where: { slug } })) {
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

        while (await AvailabilityPost.findOne({ 
          where: { 
            slug,
            postId: { [Op.ne]: post.postId }
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

AvailabilityPost.init(
  {
    postId: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
      allowNull: false,
    },
    artistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "artists",
        key: "artistId",
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
      allowNull: true, // Allow null during migration
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
    availabilityType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "immediate",
      validate: {
        isIn: [["immediate", "within-week", "within-month", "flexible"]],
      },
    },
    duration: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    budget: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    skills: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    portfolioSamples: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    contactPreference: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "platform",
      validate: {
        isIn: [["platform", "email", "direct"]],
      },
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "active",
      validate: {
        isIn: [["active", "paused", "closed", "draft"]],
      },
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    viewCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "AvailabilityPost",
    tableName: "availability_posts",
    timestamps: true,
  }
);

AvailabilityPost.addHooks();

export default AvailabilityPost;