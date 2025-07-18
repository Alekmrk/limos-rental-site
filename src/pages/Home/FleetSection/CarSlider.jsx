import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import cars from "../../../data/cars";
import SliderCard from "../../../components/SliderCard";
import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";

// Custom CSS for the carousel
const carouselStyles = `
  .react-multi-carousel-list {
    display: flex;
    align-items: center;
    overflow: hidden;
    position: relative;
  }
  
  .react-multi-carousel-track {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
    position: relative;
    transform-style: preserve-3d;
    backface-visibility: hidden;
    will-change: transform, transition;
  }
  
  .react-multi-carousel-item {
    position: relative;
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }
`;

// Inject the styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = carouselStyles;
  document.head.appendChild(styleSheet);
}
const CarSlider = ({ setSelectedVehicle }) => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  // Preload critical car images for even faster loading
  useEffect(() => {
    // Use the first 3 available cars for preloading
    const preloadPromises = cars.slice(0, 3).map(car => {
      return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = car.image;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
      });
    });

    Promise.all(preloadPromises).catch(error => {
      console.warn('Car image preload failed:', error);
    });

    return () => {
      // Cleanup preload links when component unmounts
      const preloadLinks = document.querySelectorAll('link[rel="preload"][as="image"]');
      preloadLinks.forEach(link => {
        if (cars.some(car => car.image === link.href)) {
          if (document.head.contains(link)) {
            document.head.removeChild(link);
          }
        }
      });
    };
  }, []);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1200 },
      items: 2,
      slidesToSlide: 1,
    },
    desktop: {
      breakpoint: { max: 1200, min: 768 },
      items: 2,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 1,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  const chooseVehicle = (name) => {
    setSelectedVehicle(cars.find((car) => car.name === name));
  };

  return (
    <div
      className="flex justify-center w-full mx-auto relative"
      data-aos="fade-left"
    >
      <div className="w-full max-w-7xl">
        <Carousel
          responsive={responsive}
          showDots={true}
          infinite={true}
          swipeable={true}
          draggable={true}
          arrows={true}
          autoPlay={false}
          keyBoardControl={true}
          customTransition="transform 300ms ease-in-out"
          transitionDuration={300}
          containerClass="carousel-container"
          removeArrowOnDeviceType={[]}
          partialVisible={true}
        >
          {/* Show all vehicles without filtering */}
          {cars.map((car, i) => (
            <div key={car.id} className="p-4">
              <SliderCard
                {...car}
                index={i}
                chooseVehicle={chooseVehicle}
              />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default CarSlider;
