import { useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const VehicleImageSlider = ({ images, vehicleName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

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
    <div className="bg-cream-light/90 p-0 pb-6 rounded-[1rem] border border-royal-blue/20 shadow-lg">        {/* Main Image Container */}
        <div className="relative overflow-hidden rounded-lg">
          <div 
            className="relative h-80 md:h-96 flex items-center justify-center cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img 
              className="w-full h-full object-contain transition-transform duration-300" 
              src={images[currentIndex]} 
              alt={`${vehicleName} - ${currentIndex === 0 ? 'Exterior' : 'Interior'} view`}
            />
            
            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm z-10">
                {currentIndex + 1} / {images.length}
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
                      index === currentIndex 
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
