import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const VehicleImageSlider = ({ images, vehicleName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="bg-cream-light/90 p-4 rounded-[1rem] border border-royal-blue/20 shadow-lg">
      {/* Main Image Container */}
        <div className="relative overflow-hidden rounded-lg">
          <div className="relative h-80 md:h-96 flex items-center justify-center">
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
          
          {/* Thumbnail Navigation with Arrows */}
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-3 mt-4">
              {/* Left Arrow */}
              <button
                onClick={prevSlide}
                className="w-10 h-10 bg-royal-blue/80 hover:bg-royal-blue text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Previous image"
              >
                <FaChevronLeft className="text-sm" />
              </button>
              
              {/* Thumbnails */}
              <div className="flex gap-2">
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
              
              {/* Right Arrow */}
              <button
                onClick={nextSlide}
                className="w-10 h-10 bg-royal-blue/80 hover:bg-royal-blue text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Next image"
              >
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default VehicleImageSlider;
