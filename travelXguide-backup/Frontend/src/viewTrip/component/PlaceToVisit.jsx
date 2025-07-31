import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getFallbackImage, getOptimizedImageUrl, getBestImageForPlace } from '../../utils/imageUtils';
import { testUnsplashAPI } from '../../utils/testApi';
import ImageLoader from '../../components/ImageLoader';

function PlacesToVisit({ tripData }) {
    const [imageErrors, setImageErrors] = useState({});
    const [imageLoading, setImageLoading] = useState({});
    const [optimizedImages, setOptimizedImages] = useState({});

    // Pre-load and optimize images when component mounts
    useEffect(() => {
        if (tripData?.itinerary) {
            const loadOptimizedImages = async () => {
                const newOptimizedImages = {};
                
                Object.entries(tripData.itinerary).forEach(([day, dayInfo]) => {
                    dayInfo.places.forEach((place, index) => {
                        const placeIndex = `${day}-${index}`;
                        // Set loading state to true initially
                        setImageLoading(prev => ({ ...prev, [placeIndex]: true }));
                        
                        // Skip AI images - fetch directly from Unsplash using place name
                        getBestImageForPlace(place.placeName)
                            .then(optimizedUrl => {
                                newOptimizedImages[placeIndex] = optimizedUrl;
                                setOptimizedImages(prev => ({ ...prev, [placeIndex]: optimizedUrl }));
                            })
                            .catch(error => {
                                console.error('Error fetching image:', error);
                            });
                    });
                });
            };
            
            loadOptimizedImages();
        }
    }, [tripData]);

    // Test API on component mount
    useEffect(() => {
        testUnsplashAPI();
    }, []);

    // Function to handle image loading
    const handleImageLoad = (placeIndex) => {
        setImageLoading(prev => ({ ...prev, [placeIndex]: false }));
    };

    // Function to handle image error
    const handleImageError = async (placeIndex, placeName) => {
        setImageErrors(prev => ({ ...prev, [placeIndex]: true }));
        setImageLoading(prev => ({ ...prev, [placeIndex]: false }));
        
        // Try to get a better image when AI image fails
        try {
            const betterImage = await getBestImageForPlace(placeName);
            setOptimizedImages(prev => ({ ...prev, [placeIndex]: betterImage }));
        } catch (error) {
            console.error('Error fetching better image:', error);
        }
    };

    if (!tripData?.itinerary) {
        return <p className="text-gray-500 text-center text-lg mt-5">No itinerary available.</p>;
    }

    return (
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 mt-10'>
            <h2 className='font-bold text-3xl mb-8 text-center text-gray-800'>Places to Visit</h2>
            
            {Object.entries(tripData.itinerary).map(([day, dayInfo]) => (
                <div key={day} className='mt-10'>
                    <h3 className='font-medium text-xl text-gray-800'>{dayInfo.dayName}</h3>
                    <p className='font-medium text-sm text-orange-300'>{dayInfo.bestTimeToVisit || "Best time to visit: All day"}</p>
                    
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                        {dayInfo.places.map((place, index) => {
                            const placeIndex = `${day}-${index}`;
                            const imageUrl = optimizedImages[placeIndex] || 
                                (imageErrors[placeIndex] 
                                    ? getFallbackImage(place.placeName)
                                    : getOptimizedImageUrl(place.placeImageUrl || getFallbackImage(place.placeName)));
                            
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className='h-full'
                                >
                                    <Link
                                        to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.placeName)}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='block h-full'
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            className='bg-white shadow-lg rounded-xl overflow-hidden p-4 h-full flex flex-col justify-between transition-transform hover:shadow-2xl min-h-[400px]'
                                        >
                                            <div className="relative h-48 w-full">
                                                {imageLoading[placeIndex] && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
                                                        <div className="flex flex-col items-center">
                                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                                                            <span className="text-xs text-gray-500">Loading...</span>
                                                        </div>
                                                    </div>
                                                )}
                                                <img
                                                    src={imageUrl}
                                                    alt={place.placeName}
                                                    className={`rounded-lg h-48 w-full object-cover transition-opacity duration-300 ${
                                                        imageLoading[placeIndex] ? 'opacity-0' : 'opacity-100'
                                                    }`}
                                                    onLoad={() => handleImageLoad(placeIndex)}
                                                    onError={() => handleImageError(placeIndex, place.placeName)}
                                                    style={{ display: imageLoading[placeIndex] ? 'none' : 'block' }}
                                                />
                                            </div>
                                            <div className='mt-3 flex flex-col flex-grow text-center sm:text-left'>
                                                <h2 className='font-semibold text-lg text-gray-800'>{place.placeName}</h2>
                                                <p className='text-sm text-gray-500 mt-1'>📍 {place.placeDetails}</p>
                                                <p className='text-base font-medium text-blue-600 mt-2'>💰 {place.ticketPricing || 'Free'}</p>
                                                <p className='text-base font-medium text-yellow-500 mt-2'>⭐ {place.rating || 'N/A'}</p>
                                            </div>
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PlacesToVisit;
