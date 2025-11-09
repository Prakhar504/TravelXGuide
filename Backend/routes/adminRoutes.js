import express from "express";
import { 
  adminLogin, 
  getAllGuideApplications, 
  getGuideApplication,
  approveGuideApplication,
  rejectGuideApplication,
  getDashboardStats,
  setGuideActiveStatus
} from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Admin authentication
router.post("/login", adminLogin);

// Protected admin routes
router.get("/dashboard/stats", adminAuth, getDashboardStats);
router.get("/applications", adminAuth, getAllGuideApplications);
router.get("/applications/:id", adminAuth, getGuideApplication);
router.put("/applications/:id/approve", adminAuth, approveGuideApplication);
router.put("/applications/:id/reject", adminAuth, rejectGuideApplication);
router.put("/guides/:id/active", adminAuth, setGuideActiveStatus);

export default router; 