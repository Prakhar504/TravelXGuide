import debounce from 'lodash.debounce';

// ⚡ PERFORMANCE: Create a simple in-memory cache
const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch data with caching support
 * @param {string} url - API endpoint
 * @param {object} options - Fetch options
 * @param {boolean} useCache - Whether to use cache
 * @returns {Promise} - API response
 */
export const cachedFetch = async (url, options = {}, useCache = true) => {
  const cacheKey = `${url}_${JSON.stringify(options)}`;
  
  // Check cache first
  if (useCache && apiCache.has(cacheKey)) {
    const { data, timestamp } = apiCache.get(cacheKey);
    const age = Date.now() - timestamp;
    
    if (age < CACHE_DURATION) {
      console.log('✅ Returning cached data for:', url);
      return data;
    } else {
      // Cache expired, remove it
      apiCache.delete(cacheKey);
    }
  }
  
  // Fetch fresh data
  const response = await fetch(url, options);
  const data = await response.json();
  
  // Store in cache
  if (useCache && response.ok) {
    apiCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }
  
  return data;
};

/**
 * Clear cache for a specific URL or all cache
 * @param {string} url - Optional URL to clear specific cache
 */
export const clearCache = (url = null) => {
  if (url) {
    // Clear cache for specific URL
    for (const key of apiCache.keys()) {
      if (key.startsWith(url)) {
        apiCache.delete(key);
      }
    }
  } else {
    // Clear all cache
    apiCache.clear();
  }
};

/**
 * Debounced search function
 * @param {Function} searchFn - Search function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const createDebouncedSearch = (searchFn, delay = 300) => {
  return debounce(searchFn, delay);
};

/**
 * Batch multiple API requests
 * @param {Array} requests - Array of fetch promises
 * @returns {Promise} - All responses
 */
export const batchRequests = async (requests) => {
  try {
    const responses = await Promise.all(requests);
    return responses;
  } catch (error) {
    console.error('Batch request error:', error);
    throw error;
  }
};

/**
 * Retry failed requests
 * @param {Function} fn - Function to retry
 * @param {number} retries - Number of retries
 * @param {number} delay - Delay between retries
 * @returns {Promise} - Result of successful retry
 */
export const retryRequest = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

export default {
  cachedFetch,
  clearCache,
  createDebouncedSearch,
  batchRequests,
  retryRequest
};
