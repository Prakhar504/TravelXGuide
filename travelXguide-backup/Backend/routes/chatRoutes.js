import express from "express";
import Message from "../models/messageModels.js";

const router = express.Router();

// Fetch chat messages for a group
router.get("/messages/:groupId", async (req, res) => {
  try {
    const messages = await Message.find({ groupId: req.params.groupId }).sort({ createdAt: 1 });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
});

// Save a new message
router.post("/messages", async (req, res) => {
  try {
    const { groupId, senderId, message, senderName } = req.body;
    
    const newMessage = new Message({
      groupId,
      senderId,
      message,
      senderName,
    });
    
    await newMessage.save();
    res.json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to save message" });
  }
});

export default router;
