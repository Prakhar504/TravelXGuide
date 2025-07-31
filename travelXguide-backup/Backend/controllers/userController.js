import userModel from "../models/userModels.js";

export const getUserData = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Use `req.user.id`

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User Not Found" });
    }

    res.json({
      success: true,
      userData: {
        id: user._id,
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
