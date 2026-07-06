import express from "express";
import {
  getAdminStats,
  getAllDonors,
  getPendingDonors,
  verifyDonor,
  rejectDonor,
  suspendDonor,
  deleteDonor,
  getAllRequests,
  updateRequestStatus,
  deleteRequest,
  getAllUsers,
  updateUserStatus,
  getActivityLogs,
  updateUserRole,
  deleteUser,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(allowRoles("admin"));

router.get("/stats", getAdminStats);

// Donor management
router.get("/donors", getAllDonors);
router.get("/pending-donors", getPendingDonors);
router.patch("/donors/:id/verify", verifyDonor);
router.patch("/donors/:id/reject", rejectDonor);
router.patch("/donors/:id/suspend", suspendDonor);
router.delete("/donors/:id", deleteDonor);

// Blood request management
router.get("/requests", getAllRequests);
router.patch("/requests/:id/status", updateRequestStatus);
router.delete("/requests/:id", deleteRequest);

// User management
router.get("/users", getAllUsers);
router.patch("/users/:id/status", updateUserStatus);

// Activity logs
router.get("/logs", getActivityLogs);

// Update User Role & DeleteUser
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

export default router;