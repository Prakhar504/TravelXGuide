import jwt from "jsonwebtoken";
import GuideApplication from "../models/guideModel.js";

const guideAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Access denied. No token provided." 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const guide = await GuideApplication.findById(decoded.guideId).select("-password");
    
    if (!guide || !guide.isActive || guide.status !== "approved") {
      return res.status(401).json({ 
        success: false,
        message: "Invalid token or guide account inactive/not approved." 
      });
    }

    req.guide = decoded;
    next();
  } catch (error) {
    console.error("Guide auth middleware error:", error);
    res.status(401).json({ 
      success: false,
      message: "Invalid token." 
    });
  }
};

export default guideAuth; 