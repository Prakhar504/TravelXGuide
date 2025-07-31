// Utility functions for image handling

// API Keys (optional - for enhanced image fetching)
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const PIXABAY_API_KEY = import.meta.env.VITE_PIXABAY_API_KEY;

// Test API key on load
console.log('🔑 Unsplash API Key Status:', UNSPLASH_ACCESS_KEY ? '✅ Loaded' : '❌ Missing');
if (UNSPLASH_ACCESS_KEY) {
    console.log('🔑 API Key Preview:', UNSPLASH_ACCESS_KEY.substring(0, 10) + '...');
}

// API URLs
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';
const PIXABAY_API_URL = 'https://pixabay.com/api/';

// Function to fetch image from Unsplash based on place name
export const fetchUnsplashImage = async (placeName, category = 'travel') => {
    console.log(`🔑 Checking Unsplash API key: ${UNSPLASH_ACCESS_KEY ? 'Found' : 'Missing'}`);
    
    if (!UNSPLASH_ACCESS_KEY) {
        console.warn('❌ Unsplash API key not found. Using fallback images.');
        return getFallbackImage(placeName);
    }

    try {
        const searchQuery = `${placeName} ${category}`;
        const apiUrl = `${UNSPLASH_API_URL}?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`;
        console.log(`🌅 Making Unsplash API call to: ${apiUrl}`);
        
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        });

        console.log(`📡 Unsplash API response status: ${response.status}`);

        if (!response.ok) {
            throw new Error(`Unsplash API failed with status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`📊 Unsplash API response:`, data);
        
        if (data.results && data.results.length > 0) {
            const imageUrl = data.results[0].urls.regular;
            console.log(`✅ Unsplash image found: ${imageUrl}`);
            return imageUrl;
        } else {
            console.log(`❌ No Unsplash results found for: ${placeName}`);
            return getFallbackImage(placeName);
        }
    } catch (error) {
        console.error('❌ Error fetching Unsplash image:', error);
        return getFallbackImage(placeName);
    }
};

// Function to fetch image from Pixabay
export const fetchPixabayImage = async (placeName) => {
    if (!PIXABAY_API_KEY) {
        return getFallbackImage(placeName);
    }

    try {
        const searchQuery = `${placeName} landmark tourist`;
        const response = await fetch(
            `${PIXABAY_API_URL}?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(searchQuery)}&image_type=photo&orientation=horizontal&per_page=1`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch from Pixabay');
        }

        const data = await response.json();
        
        if (data.hits && data.hits.length > 0) {
            return data.hits[0].webformatURL;
        } else {
            return getFallbackImage(placeName);
        }
    } catch (error) {
        console.error('Error fetching Pixabay image:', error);
        return getFallbackImage(placeName);
    }
};

// Function to get the best available image for a place
export const getBestImageForPlace = async (placeName, aiImageUrl = null) => {
    console.log(`🔍 Finding best image for: ${placeName}`);
    
    // Skip AI images entirely - go straight to Unsplash
    try {
        // Try Unsplash first
        console.log(`🌅 Fetching from Unsplash for: ${placeName}`);
        const unsplashImage = await fetchUnsplashImage(placeName);
        if (unsplashImage && await validateImageUrl(unsplashImage)) {
            console.log(`✅ Using Unsplash image for: ${placeName}`);
            return unsplashImage;
        }

        // Try Pixabay as backup
        console.log(`🖼️ Trying Pixabay API for: ${placeName}`);
        const pixabayImage = await fetchPixabayImage(placeName);
        if (pixabayImage && await validateImageUrl(pixabayImage)) {
            console.log(`✅ Using Pixabay image for: ${placeName}`);
            return pixabayImage;
        }
    } catch (error) {
        console.error('Error fetching external images:', error);
    }

    // Fallback to curated images
    console.log(`🔄 Using fallback image for: ${placeName}`);
    return getFallbackImage(placeName);
};

// Enhanced fallback image system with more specific categories
export const getFallbackImage = (placeName) => {
    const placeNameLower = placeName.toLowerCase();
    
    // More specific categories for better image matching
    if (placeNameLower.includes('temple') || placeNameLower.includes('mosque') || placeNameLower.includes('church') || placeNameLower.includes('cathedral')) {
        return 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=400&h=300&fit=crop';
    } else if (placeNameLower.includes('park') || placeNameLower.includes('garden') || placeNameLower.includes('botanical')) {
        return 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop';
    } else if (placeNameLower.includes('museum') || placeNameLower.includes('gallery') || placeNameLower.includes('art')) {
        return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';
    } else if (placeNameLower.includes('beach') || placeNameLower.includes('coast') || placeNameLower.includes('ocean') || placeNameLower.includes('sea')) {
        return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop';
    } else if (placeNameLower.includes('mountain') || placeNameLower.includes('hill') || placeNameLower.includes('peak') || placeNameLower.includes('summit')) {
        return 'https://images.unsplash.com/photo-1464822759844-d150baec0134?w=400&h=300&fit=crop';
    } else if (placeNameLower.includes('fort') || placeNameLower.includes('palace') || placeNameLower.includes('castle') || placeNameLower.includes('citadel')) {
        return 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop';
    } else if (placeNameLower.includes('hotel') || placeNameLower.includes('resort') || placeNameLower.includes('lodge')) {
        return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop';
    } else if (placeNameLower.includes('market') || placeNameLower.includes('bazaar') || placeNameLower.includes('shopping')) {
        return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop';
    } else if (placeNameLower.includes('restaurant') || placeNameLower.includes('cafe') || placeNameLower.includes('food')) {
        return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop';
    } else if (placeNameLower.includes('lake') || placeNameLower.includes('river') || placeNameLower.includes('waterfall')) {
        return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop';
    } else if (placeNameLower.includes('forest') || placeNameLower.includes('jungle') || placeNameLower.includes('wildlife')) {
        return 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop';
    } else if (placeNameLower.includes('monument') || placeNameLower.includes('statue') || placeNameLower.includes('memorial')) {
        return 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop';
    } else if (placeNameLower.includes('bridge') || placeNameLower.includes('tower') || placeNameLower.includes('skyscraper')) {
        return 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop';
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