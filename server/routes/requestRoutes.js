import express from "express";
import {
  createBloodRequest,
  getAllBloodRequests,
  getMyBloodRequests,
  acceptBloodRequest,
  completeBloodRequest,
  getDonationHistory,
} from "../controllers/requestController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/donation-history", protect, getDonationHistory);
router.post("/", protect, createBloodRequest);
router.get("/", getAllBloodRequests);
router.get("/my-requests", protect, getMyBloodRequests);

router.patch("/:id/accept", protect, acceptBloodRequest);
router.patch("/:id/complete", protect, completeBloodRequest);

export default router;