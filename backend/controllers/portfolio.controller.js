import { Portfolio, Artist, Analytics } from "../models/index.js";
import { Op } from "sequelize";

export const createPortfolioItem = async (req, res) => {
  try {
    const { artistId, title, description, imageUrl, category, tags, projectUrl, completionDate } = req.body;

    const artist = await Artist.findByPk(artistId);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    const portfolioItem = await Portfolio.create({
      artistId,
      title,
      description,
      imageUrl,
      category,
      tags: tags || [],
      projectUrl,
      completionDate: completionDate ? new Date(completionDate) : null
    });

    res.status(201).json({
      success: true,
      message: "Portfolio item created successfully",
      data: portfolioItem
    });
  } catch (error) {
    console.error("Portfolio creation error:", error);
    res.status(500).json({ message: "Failed to create portfolio item", error: error.message });
  }
};

export const getArtistPortfolio = async (req, res) => {
  try {
    const { artistId } = req.params;
    const { category, featured, limit = 20, offset = 0 } = req.query;

    let whereClause = { artistId, isPublic: true };
    
    if (category) {
      whereClause.category = category;
    }
    
    if (featured === 'true') {
      whereClause.featured = true;
    }

    const portfolio = await Portfolio.findAndCountAll({
      where: whereClause,
      order: [['featured', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: Artist,
          as: 'artist',
          attributes: ['name', 'slug', 'avatarUrl']
        }
      ]
    });

    await Analytics.create({
      artistId,
      eventType: 'portfolio_view',
      entityType: 'portfolio',
      entityId: artistId,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: { category, featured }
    });

    res.json({
      success: true,
      data: {
        items: portfolio.rows,
        total: portfolio.count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error("Portfolio fetch error:", error);
    res.status(500).json({ message: "Failed to fetch portfolio", error: error.message });
  }
};

export const getPortfolioItem = async (req, res) => {
  try {
    const { portfolioId } = req.params;

    const item = await Portfolio.findByPk(portfolioId, {
      include: [
        {
          model: Artist,
          as: 'artist',
          attributes: ['name', 'slug', 'avatarUrl', 'rating', 'totalCommissions']
        }
      ]
    });

    if (!item) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }

    await item.increment('views');

    await Analytics.create({
      artistId: item.artistId,
      eventType: 'portfolio_view',
      entityType: 'portfolio',
      entityId: portfolioId,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({ success: true, data: item });
  } catch (error) {
    console.error("Portfolio item fetch error:", error);
    res.status(500).json({ message: "Failed to fetch portfolio item", error: error.message });
  }
};

export const updatePortfolioItem = async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const { title, description, category, tags, projectUrl, completionDate, featured, isPublic } = req.body;

    const item = await Portfolio.findByPk(portfolioId);
    if (!item) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (projectUrl !== undefined) updateData.projectUrl = projectUrl;
    if (completionDate !== undefined) updateData.completionDate = completionDate ? new Date(completionDate) : null;
    if (featured !== undefined) updateData.featured = featured;
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    await item.update(updateData);

    res.json({
      success: true,
      message: "Portfolio item updated successfully",
      data: item
    });
  } catch (error) {
    console.error("Portfolio update error:", error);
    res.status(500).json({ message: "Failed to update portfolio item", error: error.message });
  }
};

export const deletePortfolioItem = async (req, res) => {
  try {
    const { portfolioId } = req.params;

    const item = await Portfolio.findByPk(portfolioId);
    if (!item) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }

    await item.destroy();

    res.json({
      success: true,
      message: "Portfolio item deleted successfully"
    });
  } catch (error) {
    console.error("Portfolio deletion error:", error);
    res.status(500).json({ message: "Failed to delete portfolio item", error: error.message });
  }
};

export const likePortfolioItem = async (req, res) => {
  try {
    const { portfolioId } = req.params;

    const item = await Portfolio.findByPk(portfolioId);
    if (!item) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }

    await item.increment('likes');

    await Analytics.create({
      artistId: item.artistId,
      eventType: 'like_given',
      entityType: 'portfolio',
      entityId: portfolioId,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: "Portfolio item liked successfully",
      data: { likes: item.likes + 1 }
    });
  } catch (error) {
    console.error("Portfolio like error:", error);
    res.status(500).json({ message: "Failed to like portfolio item", error: error.message });
  }
};

export const getPortfolioCategories = async (req, res) => {
  try {
    const categories = [
      "illustration",
      "design", 
      "photography",
      "writing",
      "video",
      "music",
      "animation",
      "web-development",
      "other"
    ];

    res.json({ success: true, data: categories });
  } catch (error) {
    console.error("Categories fetch error:", error);
    res.status(500).json({ message: "Failed to fetch categories", error: error.message });
  }
};

export default {
  createPortfolioItem,
  getArtistPortfolio,
  getPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  likePortfolioItem,
  getPortfolioCategories
};