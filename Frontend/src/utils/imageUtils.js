// Enhanced Image Utils with Google Maps Places API and Gemini AI fallback

// Test backend connection on load
console.log('🗺️ Backend URL:', import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000');

// Function to search for places using backend API
export const searchGooglePlaces = async (placeName) => {
    try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
        const searchUrl = `${backendUrl}/api/places/search?placeName=${encodeURIComponent(placeName)}`;
        console.log(`🗺️ Searching places via backend for: ${placeName}`);
        
        const response = await fetch(searchUrl, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success && data.place) {
            return data.place;
        }
        
        return null;
    } catch (error) {
        console.error('Error searching places via backend:', error);
        return null;
    }
};

// Function to fetch place photos from Google Maps via backend
export const fetchGoogleMapsImage = async (placeName, category = 'travel') => {
    console.log(`🗺️ Fetching image via backend for: ${placeName}`);
    
    try {
        // Search for the place via backend
        const place = await searchGooglePlaces(placeName);
        if (!place) {
            console.log(`❌ No place found for: ${placeName}`);
            return getFallbackImage(placeName);
        }

        // Check if place has a photo URL
        if (place.photoUrl) {
            console.log(`✅ Google Maps photo found for: ${placeName}`);
            return place.photoUrl;
        } else {
            console.log(`❌ No photos available for: ${placeName}`);
            return getFallbackImage(placeName);
        }
    } catch (error) {
        console.error('❌ Error fetching Google Maps image:', error);
        return getFallbackImage(placeName);
    }
};

// Pixabay removed - now using Gemini AI via backend

// Function to get the best available image for a place
export const getBestImageForPlace = async (placeName, aiImageUrl = null) => {
    console.log(`🔍 Finding best image for: ${placeName}`);
    
    try {
        // Try Google Maps Places API via backend (includes Gemini AI fallback)
        console.log(`🗺️ Fetching from backend (Google Maps + Gemini AI) for: ${placeName}`);
        const googleMapsImage = await fetchGoogleMapsImage(placeName);
        if (googleMapsImage && await validateImageUrl(googleMapsImage)) {
            console.log(`✅ Using backend image for: ${placeName}`);
            return googleMapsImage;
        }
    } catch (error) {
        console.error('Error fetching backend images:', error);
    }

    // Final fallback to curated images
    console.log(`🔄 Using fallback image for: ${placeName}`);
    return getFallbackImage(placeName);
};

// Enhanced fallback image system with more specific categories
export const getFallbackImage = (placeName) => {
    const placeNameLower = placeName.toLowerCase();
    
    // More specific categories for better image matching
    if (placeNameLower.includes('temple') || placeNameLower.includes('mosque') || placeNameLower.includes('church') || placeNameLower.includes('cathedral')) {
        return 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400&h=300&fit=crop';
    } else if (placeNameLower.includes('park') || placeNameLower.includes('garden') || placeNameLower.includes('botanical')) {
        return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop';
    } else if (placeNameLower.includes('museum') || placeNameLower.includes('gallery') || placeNameLower.includes('art')) {
        return 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&h=300&fit=crop';
    } else if (placeNameLower.includes('beach') || placeNameLower.includes('coast') || placeNameLower.includes('ocean') || placeNameLower.includes('sea')) {
        return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop';
    } else if (placeNameLower.includes('mountain') || placeNameLower.includes('hill') || placeNameLower.includes('peak') || placeNameLower.includes('summit')) {
        return 'https://images.unsplash.com/photo-1464822759844-d150baec0134?w=400&h=300&fit=crop';
    } else if (placeNameLower.includes('fort') || placeNameLower.includes('palace') || placeNameLower.includes('castle') || placeNameLower.includes('citadel')) {
        return 'https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=400&h=300&fit=crop';
    } else if (placeNameLower.includes('hotel') || placeNameLower.includes('resort') || placeNameLower.includes('lodge')) {
        return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop';
    } else if (placeNameLower.includes('market') || placeNameLower.includes('bazaar') || placeNameLower.includes('shopping')) {
        return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop';
    } else if (placeNameLower.includes('restaurant') || placeNameLower.includes('cafe') || placeNameLower.includes('food')) {
        return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop';
    } else if (placeNameLower.includes('lake') || placeNameLower.includes('river') || placeNameLower.includes('waterfall')) {
        return 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop';
    } else if (placeNameLower.includes('forest') || placeNameLower.includes('jungle') || placeNameLower.includes('wildlife')) {
        return 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=300&fit=crop';
    } else if (placeNameLower.includes('monument') || placeNameLower.includes('statue') || placeNameLower.includes('memorial')) {
        return 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop';
    } else if (placeNameLower.includes('bridge') || placeNameLower.includes('tower') || placeNameLower.includes('skyscraper')) {
        return 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=300&fit=crop';
    } else {
        // Default travel image
        return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop';
    }
};

// Function to validate image URL
export const validateImageUrl = async (url) => {
    if (!url) return false;
    
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        return false;
    }
};

// Function to get optimized image URL with proper dimensions
export const getOptimizedImageUrl = (url, width = 400, height = 300) => {
    if (!url) return getFallbackImage('travel');
    
    // If it's already an Unsplash URL, optimize it
    if (url.includes('unsplash.com')) {
        return `${url}?w=${width}&h=${height}&fit=crop`;
    }
    
    return url;
};

// Function to get city-specific images
export const getCitySpecificImage = (cityName) => {
    const cityNameLower = cityName.toLowerCase();
    
    // Popular cities with specific images
    const cityImages = {
        'mumbai': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop',
        'delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop',
        'bangalore': 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=400&h=300&fit=crop',
        'chennai': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop',
        'kolkata': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop',
        'hyderabad': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop',
        'pune': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop',
        'ahmedabad': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop',
        'jaipur': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop',
        'agra': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop',
        'varanasi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop',
        'goa': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
        'kerala': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        'manali': 'https://images.unsplash.com/photo-1464822759844-d150baec0134?w=400&h=300&fit=crop',
        'shimla': 'https://images.unsplash.com/photo-1464822759844-d150baec0134?w=400&h=300&fit=crop',
        'darjeeling': 'https://images.unsplash.com/photo-1464822759844-d150baec0134?w=400&h=300&fit=crop',
        'ooty': 'https://images.unsplash.com/photo-1464822759844-d150baec0134?w=400&h=300&fit=crop',
        'munnar': 'https://images.unsplash.com/photo-1464822759844-d150baec0134?w=400&h=300&fit=crop',
        'kodaikanal': 'https://images.unsplash.com/photo-1464822759844-d150baec0134?w=400&h=300&fit=crop',
        'gangtok': 'https://images.unsplash.com/photo-1464822759844-d150baec0134?w=400&h=300&fit=crop'
    };
    
    return cityImages[cityNameLower] || getFallbackImage('travel');
}; 