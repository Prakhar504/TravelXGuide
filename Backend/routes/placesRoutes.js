import express from "express";
import { searchPlaces } from "../controllers/placesController.js";

const placesRouter = express.Router();

// Handle preflight requests
placesRouter.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin");
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(200).end();
});

// Places API routes
placesRouter.get("/search", searchPlaces);

// Test endpoint for Gemini AI
placesRouter.get("/test-gemini", async (req, res) => {
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    if (!process.env.GEMINI_API_KEY) {
      return res.json({ success: false, message: 'Gemini API key not configured' });
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent('Generate a sample image URL for Taj Mahal');
    const response = await result.response;
    
    return res.json({ 
      success: true, 
      message: 'Gemini API working',
      response: response.text()
    });
  } catch (error) {
    return res.json({ 
      success: false, 
      message: 'Gemini API test failed',
      error: error.message 
    });
  }
});

export default placesRouter;
