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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10">
            <h2 className="font-bold text-3xl mb-8 text-center text-gray-800">Recommended Hotels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-white shadow-lg rounded-xl overflow-hidden p-4 h-full flex flex-col justify-between transition-transform hover:shadow-2xl min-h-[400px]"
                                >
                                    <div className="relative h-48 w-full">
                                        {imageLoading[hotelIndex] && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
                                                <div className="flex flex-col items-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                                                    <span className="text-xs text-gray-500">Loading...</span>
                                                </div>
                                            </div>
                                        )}
                                        <img
                                            src={imageUrl}
                                            alt={hotel.hotelName || "Hotel"}
                                            className={`rounded-lg h-48 w-full object-cover transition-opacity duration-300 ${
                                                imageLoading[hotelIndex] ? 'opacity-0' : 'opacity-100'
                                            }`}
                                            onLoad={() => handleImageLoad(hotelIndex)}
                                            onError={() => handleImageError(hotelIndex, hotel.hotelName)}
                                            style={{ display: imageLoading[hotelIndex] ? 'none' : 'block' }}
                                        />
                                    </div>
                                    <div className="mt-4 flex flex-col text-center sm:text-left flex-grow">
                                        <h2 className="font-semibold text-lg text-gray-800">{hotel.hotelName || "Unknown Hotel"}</h2>
                                        <p className="text-sm text-gray-500 mt-1">📍 {hotel.hotelAddress || "Address not available"}</p>
                                        <p className="text-base font-medium text-blue-600 mt-2">💰 {hotel.price || "Price not available"}</p>
                                        <p className="text-base font-medium text-yellow-500 mt-2">⭐ {hotel.rating ? hotel.rating : "Not rated"}</p>
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