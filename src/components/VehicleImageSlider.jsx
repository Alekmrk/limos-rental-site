import { useState, useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const VehicleImageSlider = ({ images, vehicleName }) => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start at index 1 (first real image)
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  
  // Create infinite loop array: [last, ...images, first]
  const infiniteImages = [images[images.length - 1], ...images, images[0]];

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
  };

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index + 1); // +1 because we have the duplicate at start
  };

  // Handle infinite loop transitions
  useEffect(() => {
    if (!isTransitioning) return;

    const timer = setTimeout(() => {
      setIsTransitioning(false);
      
      if (currentIndex === 0) {
        // If we're at the duplicate last image, jump to real last image
        setCurrentIndex(images.length);
      } else if (currentIndex === infiniteImages.length - 1) {
        // If we're at the duplicate first image, jump to real first image
        setCurrentIndex(1);
      }
    }, 300); // Match transition duration

    return () => clearTimeout(timer);
  }, [currentIndex, isTransitioning, images.length, infiniteImages.length]);

  // Touch handlers for swipe functionality
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && images.length > 1) {
      nextSlide();
    }
    if (isRightSwipe && images.length > 1) {
      prevSlide();
    }

    // Reset touch positions
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="bg-cream-light/90 p-0 pb-6 rounded-[1rem] border border-royal-blue/20 shadow-lg">
      {/* Main Image Container */}
      <div className="relative overflow-hidden rounded-lg">
        <div className="relative">
          <div 
            className="flex transition-transform duration-300 ease-in-out cursor-grab active:cursor-grabbing"
            style={{ 
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: isTransitioning ? 'transform 0.3s ease-in-out' : 'none'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {infiniteImages.map((image, index) => (
              <div key={index} className="w-full h-80 md:h-96 flex-shrink-0 flex items-center justify-center">
                <img 
                  className="w-full h-full object-contain" 
                  src={image} 
                  alt={`${vehicleName} - ${index === 0 || index === infiniteImages.length - 1 ? 'Exterior' : 'Interior'} view`}
                />
              </div>
            ))}
          </div>
          
          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm z-10">
              {((currentIndex - 1 + images.length) % images.length) + 1} / {images.length}
            </div>
          )}
        </div>
          
          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="flex items-center justify-center mt-4">
              {/* Thumbnails */}
              <div className="flex gap-2 py-1">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      ((currentIndex - 1 + images.length) % images.length) === index
                        ? 'border-royal-blue scale-110 shadow-lg' 
                        : 'border-royal-blue/30 hover:border-royal-blue/60 hover:scale-105'
                    }`}
                    aria-label={`View ${index === 0 ? 'exterior' : 'interior'} image`}
                  >
                    <img 
                      src={image} 
                      alt={`${vehicleName} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default VehicleImageSlider;
