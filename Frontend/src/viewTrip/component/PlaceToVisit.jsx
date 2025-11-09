import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getFallbackImage, getOptimizedImageUrl, getBestImageForPlace } from '../../utils/imageUtils';
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
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-16'>
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className='text-center mb-12'
            >
                <h2 className='font-bold text-4xl md:text-5xl mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
                    Places to Visit
                </h2>
                <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
                    Discover amazing destinations and create unforgettable memories
                </p>
            </motion.div>
            
            {Object.entries(tripData.itinerary).map(([day, dayInfo], dayIndex) => (
                <motion.div 
                    key={day} 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: dayIndex * 0.1 }}
                    className='mb-16'
                >
                    {/* Day Header with Gradient Badge */}
                    <div className='mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                        <div className='flex items-center gap-4'>
                            <div className='bg-gradient-to-br from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg'>
                                <h3 className='font-bold text-2xl'>{dayInfo.dayName}</h3>
                            </div>
                            <div className='hidden md:block h-1 flex-grow bg-gradient-to-r from-blue-500/20 to-transparent rounded'></div>
                        </div>
                        {dayInfo.bestTimeToVisit && (
                            <div className='flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-xl'>
                                <span className='text-2xl'>🕒</span>
                                <span className='font-medium text-orange-600'>{dayInfo.bestTimeToVisit}</span>
                            </div>
                        )}
                    </div>
                    
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                        {dayInfo.places.map((place, index) => {
                            const placeIndex = `${day}-${index}`;
                            const imageUrl = optimizedImages[placeIndex] || 
                                (imageErrors[placeIndex] 
                                    ? getFallbackImage(place.placeName)
                                    : getOptimizedImageUrl(place.placeImageUrl || getFallbackImage(place.placeName)));
                            
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    whileHover={{ y: -8 }}
                                    className='h-full'
                                >
                                    <Link
                                        to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.placeName)}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='block h-full group'
                                    >
                                        <div className='bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100 min-h-[480px]'>
                                            {/* Image Container with Overlay */}
                                            <div className="relative h-64 w-full overflow-hidden flex-shrink-0">
                                                {imageLoading[placeIndex] && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                                                        <div className="flex flex-col items-center">
                                                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mb-2"></div>
                                                            <span className="text-sm text-gray-600 font-medium">Loading...</span>
                                                        </div>
                                                    </div>
                                                )}
                                                <img
                                                    src={imageUrl}
                                                    alt={place.placeName}
                                                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                                                        imageLoading[placeIndex] ? 'opacity-0' : 'opacity-100'
                                                    }`}
                                                    onLoad={() => handleImageLoad(placeIndex)}
                                                    onError={() => handleImageError(placeIndex, place.placeName)}
                                                    style={{ display: imageLoading[placeIndex] ? 'none' : 'block' }}
                                                />
                                                {/* Gradient Overlay */}
                                                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                                
                                                {/* Rating Badge */}
                                                {place.rating && (
                                                    <div className='absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-xl flex items-center gap-1.5 border border-yellow-200'>
                                                        <span className='text-yellow-500 text-lg'>⭐</span>
                                                        <span className='font-bold text-gray-800 text-sm'>{place.rating}</span>
                                                    </div>
                                                )}
                                                
                                                {/* Map Icon Overlay */}
                                                <div className='absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110'>
                                                    <div className='bg-gradient-to-br from-blue-600 to-blue-700 text-white p-3 rounded-xl shadow-2xl'>
                                                        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                                                        </svg>
                                                    </div>
                                                </div>

                                                {/* Place Number Badge */}
                                                <div className='absolute top-4 left-4 bg-gradient-to-br from-purple-600 to-pink-600 text-white px-3 py-1.5 rounded-lg shadow-lg font-bold text-sm'>
                                                    #{index + 1}
                                                </div>
                                            </div>
                                            
                                            {/* Content Section */}
                                            <div className='p-6 flex flex-col flex-grow'>
                                                {/* Place Name - Fixed 2 lines */}
                                                <h2 className='font-bold text-xl text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors h-[56px] leading-tight'>
                                                    {place.placeName.length > 50 
                                                        ? place.placeName.substring(0, 50) + '...' 
                                                        : place.placeName}
                                                </h2>
                                                
                                                {/* Place Details - Fixed 2 lines */}
                                                <p className='text-sm text-gray-600 mb-4 flex items-start gap-2 h-[44px] overflow-hidden'>
                                                    <span className='text-lg flex-shrink-0'>📍</span>
                                                    <span className='leading-relaxed line-clamp-2'>
                                                        {place.placeDetails.length > 80 
                                                            ? place.placeDetails.substring(0, 80) + '...' 
                                                            : place.placeDetails}
                                                    </span>
                                                </p>
                                                
                                                {/* Map Button - Fixed height */}
                                                <div className='mt-auto pt-4 border-t border-gray-200'>
                                                    <div className='w-full bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-5 py-3 rounded-xl font-semibold text-sm border border-blue-200 text-center group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2'>
                                                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                                                        </svg>
                                                        <span>View on Map</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

export default PlacesToVisit;
