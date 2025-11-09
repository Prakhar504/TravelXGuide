import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    // ✅ Support both cookie-based & header-based tokens
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    console.log("Token received:", token); // 🔹 Debugging

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Please log in again.",
      });
    }

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (!tokenDecode || !tokenDecode.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token. Please log in again.",
      });
    }

    req.user = { id: tokenDecode.id }; // ✅ Store in `req.user`

    next(); // Proceed to next middleware
  } catch (error) {
    console.error("Auth Error:", error); // 🔹 Log the actual error
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

export default userAuth;
