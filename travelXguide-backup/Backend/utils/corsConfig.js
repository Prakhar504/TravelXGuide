import cors from 'cors';

// CORS Configuration Utility
export const createCorsConfig = () => {
  const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173", // Changed to 5173 as primary
    process.env.FRONTEND_URL_HTTPS || "https://localhost:5173", // Changed to 5173
    "http://localhost:5174", // Keep as alternative
    "https://localhost:5174", // Keep as alternative
    "http://localhost:3000",
    "https://localhost:3000",
    "http://localhost:4173",
    "https://localhost:4173",
    // Add your production domains here
    process.env.PRODUCTION_URL,
    process.env.STAGING_URL,
  ].filter(Boolean); // Remove undefined values

  console.log("🌐 Allowed CORS origins:", allowedOrigins);

  const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("🚫 CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-API-Key',
      'Cache-Control',
      'Pragma'
    ],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86400 // 24 hours
  };

  return {
    corsOptions,
    allowedOrigins,
    corsMiddleware: cors(corsOptions),
    preflightMiddleware: cors(corsOptions)
  };
};

// Socket.IO CORS configuration
export const getSocketCorsConfig = () => {
  const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173", // Changed to 5173 as primary
    process.env.FRONTEND_URL_HTTPS || "https://localhost:5173", // Changed to 5173
    "http://localhost:5174", // Keep as alternative
    "https://localhost:5174", // Keep as alternative
    "http://localhost:3000",
    "https://localhost:3000",
    "http://localhost:4173",
    "https://localhost:4173",
    process.env.PRODUCTION_URL,
    process.env.STAGING_URL,
  ].filter(Boolean);

  return {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"]
  };
}; 