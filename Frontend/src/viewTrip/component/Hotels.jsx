import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getFallbackImage, getOptimizedImageUrl, getBestImageForPlace } from '../../utils/imageUtils';
import ImageLoader from '../../components/ImageLoader';

function Hotels({ tripData = {} }) {
    const [hotels, setHotels] = useState([]);
    const [imageErrors, setImageErrors] = useState({});
    const [imageLoading, setImageLoading] = useState({});
    const [optimizedImages, setOptimizedImages] = useState({});

    useEffect(() => {
        if (tripData?.hotelOptions && Array.isArray(tripData.hotelOptions)) {
            setHotels(tripData.hotelOptions);
        } else {
            setHotels([]);
        }
    }, [tripData]);

    // Function to handle image loading
    const handleImageLoad = (hotelIndex) => {
        setImageLoading(prev => ({ ...prev, [hotelIndex]: false }));
    };

    // Function to handle image error
    const handleImageError = async (hotelIndex, hotelName) => {
        setImageErrors(prev => ({ ...prev, [hotelIndex]: true }));
        setImageLoading(prev => ({ ...prev, [hotelIndex]: false }));
        
        // Try to get a better image when AI image fails
        try {
            const betterImage = await getBestImageForPlace(hotelName, 'hotel');
            setOptimizedImages(prev => ({ ...prev, [hotelIndex]: betterImage }));
        } catch (error) {
            console.error('Error fetching better image:', error);
        }
    };

    // Pre-load and optimize hotel images
    useEffect(() => {
        if (hotels.length > 0) {
            const loadOptimizedHotelImages = async () => {
                hotels.forEach((hotel, index) => {
                    const hotelIndex = `hotel-${index}`;
                    // Set loading state to true initially
                    setImageLoading(prev => ({ ...prev, [hotelIndex]: true }));
                    
                    // Skip AI images - fetch directly from Unsplash using hotel name
                    getBestImageForPlace(hotel.hotelName || 'hotel')
                        .then(optimizedUrl => {
                            setOptimizedImages(prev => ({ ...prev, [hotelIndex]: optimizedUrl }));
                        })
                        .catch(error => {
                            console.error('Error fetching hotel image:', error);
                        });
                });
            };
            
            loadOptimizedHotelImages();
        }
    }, [hotels]);

    if (!hotels.length) {
        return <p className="text-gray-500 text-center text-lg mt-5">No hotels available.</p>;
    }

    return (
        <div className="w-full mb-12 md:mb-16">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8 md:mb-12"
            >
                <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Recommended Hotels
                </h2>
                <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto px-4">
                    Handpicked accommodations for your perfect stay
                </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {hotels.map((hotel, index) => {
                    const hotelIndex = `hotel-${index}`;
                    const imageUrl = optimizedImages[hotelIndex] || 
                        (imageErrors[hotelIndex] 
                            ? getFallbackImage(hotel.hotelName || 'hotel')
                            : getOptimizedImageUrl(hotel.hotelImageUrl || getFallbackImage(hotel.hotelName || 'hotel')));
                    
                    return (
                        <motion.div
                            key={hotel.hotelName || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="h-full"
                        >
                            <Link
                                to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.hotelName + " " + hotel.hotelAddress)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block h-full"
                            >
                                <motion.div
                                    whileHover={{ y: -8 }}
                                    className="bg-white shadow-lg rounded-2xl overflow-hidden h-full flex flex-col border border-gray-100 hover:shadow-2xl transition-all duration-300 min-h-[450px]"
                                >
                                    <div className="relative h-56 sm:h-60 w-full overflow-hidden flex-shrink-0">
                                        {imageLoading[hotelIndex] && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                                                <div className="flex flex-col items-center">
                                                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mb-2"></div>
                                                    <span className="text-sm text-gray-600 font-medium">Loading...</span>
                                                </div>
                                            </div>
                                        )}
                                        <img
                                            src={imageUrl}
                                            alt={hotel.hotelName || "Hotel"}
                                            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                                                imageLoading[hotelIndex] ? 'opacity-0' : 'opacity-100'
                                            }`}
                                            onLoad={() => handleImageLoad(hotelIndex)}
                                            onError={() => handleImageError(hotelIndex, hotel.hotelName)}
                                            style={{ display: imageLoading[hotelIndex] ? 'none' : 'block' }}
                                        />
                                        
                                        {/* Rating Badge */}
                                        {hotel.rating && (
                                            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-xl flex items-center gap-1.5 border border-yellow-200">
                                                <span className="text-yellow-500 text-lg">⭐</span>
                                                <span className="font-bold text-gray-800 text-sm">{hotel.rating}</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="p-5 sm:p-6 flex flex-col flex-grow">
                                        <h2 className="font-bold text-lg sm:text-xl text-gray-800 mb-3 line-clamp-2 h-[56px] leading-tight">
                                            {hotel.hotelName || "Unknown Hotel"}
                                        </h2>
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex items-start gap-2 h-[44px] overflow-hidden">
                                            <span className="text-lg flex-shrink-0">📍</span>
                                            <span className="leading-relaxed">{hotel.hotelAddress || "Address not available"}</span>
                                        </p>
                                        
                                        <div className="mt-auto pt-4 border-t border-gray-200">
                                            <div className="flex items-center justify-between gap-3 mb-3">
                                                <div className="flex items-center gap-2 bg-green-50 px-4 py-2.5 rounded-xl border border-green-200 flex-1 min-w-0">
                                                    <span className="text-xl flex-shrink-0">💰</span>
                                                    <span className="font-bold text-green-700 text-sm truncate">
                                                        {hotel.price || "Contact for price"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-5 py-3 rounded-xl font-semibold text-sm border border-blue-200 text-center hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>View on Map</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

export default Hotels;