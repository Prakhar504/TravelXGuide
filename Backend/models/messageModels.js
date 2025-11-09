import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  groupId: { type: String, required: true },
  senderId: { type: String, required: true }, // Changed to String to handle both ObjectId and string
  message: { type: String, required: true },
  senderName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// ⚡ PERFORMANCE: Indexes for better query performance
messageSchema.index({ groupId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });
messageSchema.index({ createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;
