import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

class Reviews extends Model {
  static associate(models) {
    Reviews.belongsTo(models.Artist, {
      foreignKey: "artistId",
      as: "artist",
      onDelete: "CASCADE",
    });
    Reviews.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });
  }
}

Reviews.init(
  {
    reviewId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "userId",
      },
      onDelete: "CASCADE",
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    reviewText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Reviews",
    tableName: "reviews",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'artistId'],
        name: 'unique_user_artist_review'
      }
    ]
  }
);

export default Reviews;