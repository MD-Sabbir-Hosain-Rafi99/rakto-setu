import express from "express";
import {
  createOrUpdateDonorProfile,
  getMyDonorProfile,
  searchDonors,
} from "../controllers/donorController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", searchDonors);
router.get("/me", protect, getMyDonorProfile);
router.post("/profile", protect, createOrUpdateDonorProfile);

export default router;