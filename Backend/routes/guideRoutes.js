import express from "express";
import { 
  applyGuide, 
  guideLogin, 
  getApprovedGuides,
  getGuideProfile
} from "../controllers/guideController.js";
import guideAuth from "../middleware/guideAuth.js";
import multer from "multer";
import path from "path";

// Multer config for profile image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/guides/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-guide" + ext);
  },
});
const upload = multer({ storage });

const router = express.Router();

// Public routes
router.post("/apply", upload.single("profileImage"), applyGuide);
router.post("/login", guideLogin);
router.get("/approved", getApprovedGuides);

// Protected routes (require guide authentication)
router.get("/profile", guideAuth, getGuideProfile);

export default router;
