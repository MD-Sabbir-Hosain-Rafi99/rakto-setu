import express from "express";
import {
  getAdminStats,
  getPendingDonors,
  verifyDonor,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/stats", protect, allowRoles("admin"), getAdminStats);
router.get("/pending-donors", protect, allowRoles("admin"), getPendingDonors);
router.patch("/verify-donor/:id", protect, allowRoles("admin"), verifyDonor);

export default router;