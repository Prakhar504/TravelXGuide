import express from "express";
import {
  createTour,
  getPendingTours,
  getAllTours,
  getApprovedTours,
  updateTourStatus,
  getUserTours,
  getTourDetails,
  updateTour,
  deleteTour
} from "../controllers/tourController.js";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";
import multer from "multer";
import path from "path";

// Multer config for tour location photo
const tourStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("uploads/tours"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-tour" + ext);
  },
});
const uploadTourPhoto = multer({ storage: tourStorage });

const router = express.Router();

// Public routes
router.get("/approved", getApprovedTours);

// User routes (require user authentication)
router.post("/create", userAuth, uploadTourPhoto.single("locationPhoto"), createTour);
router.get("/my-tours", userAuth, getUserTours);
router.get("/details/:tourId", userAuth, getTourDetails);
router.put("/update/:tourId", userAuth, updateTour);
router.delete("/delete/:tourId", userAuth, deleteTour);

// Admin routes (require admin authentication)
router.get("/pending", adminAuth, getPendingTours);
router.get("/all", adminAuth, getAllTours);
router.put("/approve", adminAuth, updateTourStatus);
router.delete("/admin-delete/:tourId", adminAuth, deleteTour);

export default router; 