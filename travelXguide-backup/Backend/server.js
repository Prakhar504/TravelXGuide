import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/mongodb.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import guideRoutes from "./routes/guideRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import tourRoutes from "./routes/tourRoutes.js";
import Message from "./models/messageModels.js";
import path from "path";
import { createCorsConfig, getSocketCorsConfig } from "./utils/corsConfig.js";

dotenv.config();

// Debug environment variables
console.log("🔍 Environment Variables Check:");
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
console.log("GOOGLE_CLIENT_ID exists:", !!process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET exists:", !!process.env.GOOGLE_CLIENT_SECRET);
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
console.log("PORT:", process.env.PORT || "5000 (default)");

// Set fallback JWT_SECRET if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "your-super-secret-jwt-key-change-this-in-production";
  console.log("⚠️  JWT_SECRET not found in environment, using fallback");
}

const app = express();
const server = createServer(app);

// Initialize CORS configuration
const { corsOptions, allowedOrigins, corsMiddleware, preflightMiddleware } = createCorsConfig();

// Socket.IO setup with CORS
const io = new Server(server, {
  cors: getSocketCorsConfig(),
});

// Apply CORS middleware
app.use(corsMiddleware);

// Pre-flight requests
app.options('*', preflightMiddleware);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve tour images statically
const __dirname = path.resolve();
app.use("/uploads/tours", express.static(path.join(__dirname, "uploads/tours")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/guide", guideRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/tour", tourRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ 
    message: "TravelXGuide API is running!",
    timestamp: new Date().toISOString(),
    cors: {
      allowedOrigins: allowedOrigins,
      credentials: true
    }
  });
});

// Environment variables test endpoint
app.get("/api/test-env", (req, res) => {
  res.json({
    jwtSecretExists: !!process.env.JWT_SECRET,
    googleClientIdExists: !!process.env.GOOGLE_CLIENT_ID,
    googleClientSecretExists: !!process.env.GOOGLE_CLIENT_SECRET,
    mongodbUriExists: !!process.env.MONGODB_URI,
    port: process.env.PORT || "5000 (default)"
  });
});

// Socket.IO event handlers
let onlineUsers = new Set();

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);
  
  // Add user to online users
  onlineUsers.add(socket.id);
  
  // Broadcast online users count to all clients
  io.emit("onlineUsers", onlineUsers.size);

  socket.on("joinGroup", (data) => {
    const { groupId } = data;
    socket.join(groupId);
    console.log(`👥 User ${socket.id} joined group: ${groupId}`);
  });

  socket.on("sendMessage", async (data) => {
    const { groupId, message, senderId, senderName, userId } = data;
    console.log(`💬 Message in ${groupId}:`, message);
    console.log(`👤 Sender data:`, { senderId, senderName, userId });
    
    try {
      // Use userId as senderId if senderId is not provided
      const actualSenderId = senderId || userId;
      
      if (!actualSenderId) {
        console.error("❌ No senderId or userId provided");
        return;
      }
      
      if (!senderName) {
        console.error("❌ No senderName provided");
        return;
      }
      
      console.log(`✅ Creating message with:`, {
        groupId,
        senderId: actualSenderId,
        senderName,
        message: message.substring(0, 50) + (message.length > 50 ? '...' : '')
      });
      
      // Save message to database
      const newMessage = new Message({
        groupId,
        senderId: actualSenderId,
        message,
        senderName,
      });
      await newMessage.save();
      
      console.log(`✅ Message saved successfully with ID:`, newMessage._id);
      
      // Broadcast message to all users in the group
      io.to(groupId).emit("receiveMessage", {
        ...newMessage.toObject(),
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("❌ Error saving message:", error.message);
      console.error("❌ Error details:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔌 User disconnected:", socket.id);
    
    // Remove user from online users
    onlineUsers.delete(socket.id);
    
    // Broadcast updated online users count to all clients
    io.emit("onlineUsers", onlineUsers.size);
  });
});

const PORT = process.env.PORT || 5000;

// Periodic broadcast of online users count
setInterval(() => {
  io.emit("onlineUsers", onlineUsers.size);
}, 30000); // Update every 30 seconds

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔌 Socket.IO server ready`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
