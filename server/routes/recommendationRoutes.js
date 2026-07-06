import express from "express";
import { getRecommendedDonors } from "../controllers/recommendationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
    "/:requestId",
    protect,
    allowRoles("admin", "user", "donor"),
    getRecommendedDonors
);

export default router;