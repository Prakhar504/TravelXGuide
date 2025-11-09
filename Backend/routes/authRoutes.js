import express from "express";
import {
  isAuthenticated,
  login,
  logout,
  register,
  resetPassword,
  sendResetOtp,
  oauthLogin,
  getUserProfile,
  updateUserProfile,
  changePassword,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

// Handle preflight requests for auth routes
authRouter.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin");
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(200).end();
});

// Authentication routes
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/oauth-login", oauthLogin);
authRouter.post("/logout", logout);

// Password management routes
authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/change-password", userAuth, changePassword);

// Profile management routes
authRouter.get("/profile", userAuth, getUserProfile);
authRouter.put("/profile", userAuth, updateUserProfile);

// Authentication check
authRouter.get("/is-auth", userAuth, isAuthenticated);

export default authRouter;