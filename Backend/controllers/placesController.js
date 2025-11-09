import fetch from 'node-fetch';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to get image URL from Gemini AI
const getImageFromGemini = async (placeName) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('⚠️ Gemini API key not found');
      return null;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Generate a high-quality, royalty-free image URL for the place: "${placeName}". 
Provide only a direct image URL (jpg, png, webp) that shows this location or similar places. 
The image should be suitable for a travel website. 
Respond with only the URL, nothing else.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const imageUrl = response.text().trim();
    
    // Basic URL validation
    if (imageUrl && (imageUrl.startsWith('http') && (imageUrl.includes('.jpg') || imageUrl.includes('.png') || imageUrl.includes('.webp') || imageUrl.includes('.jpeg')))) {
      return imageUrl;
    }
    
    return null;
  } catch (error) {
    console.error('Gemini API Error:', error);
    return null;
  }
};

// Google Maps Places API controller
export const searchPlaces = async (req, res) => {
  try {
    const { placeName } = req.query;
    
    if (!placeName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Place name is required' 
      });
    }

    const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!GOOGLE_MAPS_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        message: 'Google Maps API key not configured' 
      });
    }

    // Search for places using Google Places API
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(placeName)}&key=${GOOGLE_MAPS_API_KEY}`;
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const place = data.results[0];
      
      // If place has photos, get the photo URL
      if (place.photos && place.photos.length > 0) {
        const photoReference = place.photos[0].photo_reference;
        const maxWidth = 400;
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
        
        return res.json({
          success: true,
          place: {
            name: place.name,
            formatted_address: place.formatted_address,
            rating: place.rating,
            photoUrl: photoUrl,
            place_id: place.place_id
          }
        });
      } else {
        // No Google Places photo available, try Gemini AI for image URL
        console.log(`🤖 No Google photo for ${placeName}, trying Gemini AI...`);
        const geminiImageUrl = await getImageFromGemini(placeName);
        
        return res.json({
          success: true,
          place: {
            name: place.name,
            formatted_address: place.formatted_address,
            rating: place.rating,
            photoUrl: geminiImageUrl,
            place_id: place.place_id,
            imageSource: geminiImageUrl ? 'gemini' : 'none'
          }
        });
      }
    } else {
      // No place found in Google Places, try Gemini AI for image URL
      console.log(`🤖 No place found for ${placeName}, trying Gemini AI...`);
      const geminiImageUrl = await getImageFromGemini(placeName);
      
      if (geminiImageUrl) {
        return res.json({
          success: true,
          place: {
            name: placeName,
            formatted_address: 'Location not found in Google Places',
            rating: null,
            photoUrl: geminiImageUrl,
            place_id: null,
            imageSource: 'gemini'
          }
        });
      } else {
        return res.json({
          success: false,
          message: 'No places found and no image generated',
          status: data.status
        });
      }
    }
  } catch (error) {
    console.error('Places API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search places',
      error: error.message
    });
  }
};
