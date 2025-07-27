import express from "express";
import {
  createJobPost,
  getAllJobPosts,
  getJobPostById,
  updateJobPost,
  deleteJobPost,
  applyToJobPost
} from "../controllers/jobPost.controller.js";

const router = express.Router();

router.post("/client/:clientId", createJobPost);
router.get("/", getAllJobPosts);
router.get("/:jobId", getJobPostById);
router.put("/:jobId", updateJobPost);
router.delete("/:jobId", deleteJobPost);
router.post("/:jobId/apply", applyToJobPost);

export default router;