// Test file to verify Unsplash API key
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export const testUnsplashAPI = async () => {
    console.log('🧪 Testing Unsplash API...');
    console.log('🔑 API Key:', UNSPLASH_ACCESS_KEY ? 'Present' : 'Missing');
    
    if (!UNSPLASH_ACCESS_KEY) {
        console.error('❌ No API key found!');
        return false;
    }

    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=taj mahal&per_page=1`,
            {
                headers: {
                    'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
                }
            }
        );

        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', response.headers);

        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Test Successful!');
            console.log('📊 Results:', data.results?.length || 0);
            return true;
        } else {
            console.error('❌ API Test Failed:', response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error('❌ API Test Error:', error);
        return false;
    }
}; 