import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const socket = io(backendUrl, {
  autoConnect: false,
  withCredentials: true, // ✅ Ensure credentials are included
  transports: ["websocket", "polling"], // ✅ Fallback to polling if WebSocket fails
  timeout: 10000, // 10 second timeout
  forceNew: true, // Force new connection
  reconnection: true, // Enable reconnection
  reconnectionAttempts: 5, // Max reconnection attempts
  reconnectionDelay: 1000, // Delay between reconnection attempts
});

// Socket event handlers for better error handling
socket.on("connect", () => {
  console.log("🔌 Socket connected successfully");
});

socket.on("connect_error", (error) => {
  console.error("🔌 Socket connection error:", error);
  if (error.message === "Not allowed by CORS") {
    console.error("CORS error detected in socket connection");
  }
});

socket.on("disconnect", (reason) => {
  console.log("🔌 Socket disconnected:", reason);
});

socket.on("reconnect", (attemptNumber) => {
  console.log("🔌 Socket reconnected after", attemptNumber, "attempts");
});

socket.on("reconnect_error", (error) => {
  console.error("🔌 Socket reconnection error:", error);
});

console.log("🔌 Socket initialized:", backendUrl);
