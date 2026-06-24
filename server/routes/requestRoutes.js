import express from "express";
import {
  createBloodRequest,
  getAllBloodRequests,
  getMyBloodRequests
} from "../controllers/requestController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBloodRequest);
router.get("/", getAllBloodRequests);
router.get("/my-requests", protect, getMyBloodRequests);

export default router;