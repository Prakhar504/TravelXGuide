import jwt from "jsonwebtoken";
import adminModel from "../models/adminModel.js";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Access denied. No token provided." 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await adminModel.findById(decoded.adminId).select("-password");
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid token or admin account inactive." 
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error("Admin auth middleware error:", error);
    res.status(401).json({ 
      success: false,
      message: "Invalid token." 
    });
  }
};

export default adminAuth; 