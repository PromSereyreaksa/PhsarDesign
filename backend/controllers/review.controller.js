import Reviews from "../models/review.model.js";
import Freelancers from "../models/freelancer.model.js";

export const createReview = async (req, res) => {
  try {
    const review = await Reviews.create(req.body);

    // Calculate average rating for the freelancer
    const freelancerId = req.body.freelancerId;
    const reviews = await Reviews.findAll({ where: { freelancerId } });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / reviews.length;

    // Update freelancer rating
    await Freelancers.update(
      { rating: avgRating },
      { where: { freelancerId } }
    );

    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(400).json({ error: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const { freelancerId } = req.query;
    let reviews;
    if (freelancerId) {
      reviews = await Reviews.findAll({ where: { freelancerId } });
    } else {
      reviews = await Reviews.findAll();
    }
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const review = await Reviews.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateReview = async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id, 10);
    if (isNaN(reviewId)) {
      return res.status(400).json({ error: "Invalid review ID" });
    }
    
    const [updated] = await Reviews.update(req.body, {
      where: { reviewId },
    });
    
    if (!updated) {
      return res.status(404).json({ error: "Review not found" });
    }
    
    const updatedReview = await Reviews.findByPk(reviewId);
    const freelancerId = updatedReview.freelancerId;
    
    const reviews = await Reviews.findAll({ where: { freelancerId } });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / reviews.length;
    
    await Freelancers.update(
      { rating: avgRating },
      { where: { freelancerId } }
    );
    
    res.status(200).json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id, 10);
    if (isNaN(reviewId)) {
      return res.status(400).json({ error: "Invalid review ID" });
    }
    
    // CRITICAL FIX: Get freelancer ID before deletion
    const reviewToDelete = await Reviews.findByPk(reviewId);
    if (!reviewToDelete) {
      return res.status(404).json({ error: "Review not found" });
    }
    
    const freelancerId = reviewToDelete.freelancerId;
    
    const deleted = await Reviews.destroy({
      where: { reviewId },
    });
    
    // Recalculate freelancer rating after deletion
    const remainingReviews = await Reviews.findAll({ where: { freelancerId } });
    
    if (remainingReviews.length > 0) {
      const totalRating = remainingReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = totalRating / remainingReviews.length;
      
      await Freelancers.update(
        { rating: avgRating },
        { where: { freelancerId } }
      );
    } else {
      // No reviews left, set rating to null or 0
      await Freelancers.update(
        { rating: null }, // or 0, depending on your business logic
        { where: { freelancerId } }
      );
    }
    
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};