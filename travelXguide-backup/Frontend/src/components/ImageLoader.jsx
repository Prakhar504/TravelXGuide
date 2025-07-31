import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ImageLoader = ({ 
    src, 
    alt, 
    className = "rounded-lg h-48 w-full object-cover",
    fallbackSrc = null,
    onLoad = () => {},
    onError = () => {},
    showLoadingSpinner = true
}) => {
    const [imageSrc, setImageSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImageSrc(src);
        setIsLoading(true);
        setHasError(false);
    }, [src]);

    const handleLoad = () => {
        setIsLoading(false);
        setHasError(false);
        onLoad();
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
        
        // Try fallback image if provided
        if (fallbackSrc && imageSrc !== fallbackSrc) {
            setImageSrc(fallbackSrc);
            setIsLoading(true);
        } else {
            onError();
        }
    };

    return (
        <div className="relative">
            {isLoading && showLoadingSpinner && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg"
                >
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                        <span className="text-xs text-gray-500">Loading image...</span>
                    </div>
                </motion.div>
            )}
            
            <motion.img
                src={imageSrc}
                alt={alt}
                className={`${className} transition-opacity duration-300 ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={handleLoad}
                onError={handleError}
                style={{ display: isLoading ? 'none' : 'block' }}
            />
            
            {hasError && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                    <div className="text-center">
                        <div className="text-gray-400 text-4xl mb-2">📷</div>
                        <span className="text-xs text-gray-500">Image unavailable</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageLoader; 