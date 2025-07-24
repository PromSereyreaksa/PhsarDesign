import Reviews from "../models/review.model.js";

export const createReview = async (req, res) => {
  try {
    const review = await Reviews.create(req.body);
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
    const [updated] = await Reviews.update(req.body, {
      where: { reviewId: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ error: "Review not found" });
    }
    const updatedReview = await Reviews.findByPk(req.params.id);
    res.status(200).json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const deleted = await Reviews.destroy({
      where: { reviewId: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
