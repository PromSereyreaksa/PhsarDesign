import express from "express";
import {
  createJobPost,
  getAllJobPosts,
  getJobPostById,
  updateJobPost,
  deleteJobPost,
  applyToJobPost,
  searchJobPosts
} from "../controllers/jobPost.controller.js";

const router = express.Router();

// Public routes
router.get("/search", searchJobPosts);
router.get("/", getAllJobPosts);
router.get("/:jobId", getJobPostById);

// Protected routes
router.post("/client/:clientId", createJobPost);
router.put("/:jobId", updateJobPost);
router.delete("/:jobId", deleteJobPost);
router.post("/:jobId/apply", applyToJobPost);

export default router;