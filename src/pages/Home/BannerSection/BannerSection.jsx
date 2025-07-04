import { Link } from "react-router-dom";
import Button from "../../../components/Button";
import ReservationCard from "./ReservationCard";
import Image from "../../../components/Image";
import bannerImage from "../../../assets/banner-image.jpg";
import eliteWayLogo from "../../../assets/elitewaylogo.png";
import { FaStar, FaShieldAlt, FaClock, FaPhone } from "react-icons/fa";
import { useEffect } from "react";

const BannerSection = () => {
  // Preload critical banner image
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = bannerImage;
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="relative">
      <div className="banner relative container-big rounded-[1.5rem] mt-16 pb-32 md:pb-0 overflow-hidden text-center min-h-[700px]">
        {/* Optimized Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImage}
            alt="Elite Way Limo luxury chauffeur service"
            className="w-full h-full object-cover"
            imageType="banner"
            priority={true}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/25 via-black/30 to-black/37"></div>
        </div>

        {/* Animated Background Elements - Dark Theme */}
        <div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }}>
          <div className="absolute top-20 left-10 w-20 h-20 bg-zinc-700/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-gold/20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-zinc-600/20 rounded-full animate-ping"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-gray-700/20 rounded-full animate-pulse"></div>
        </div>

        <div className="relative z-20 px-4 md:px-8 md:mr-96 lg:mr-[28rem] xl:mr-[32rem]">
          <div className="pt-16 md:pt-20 mb-8 md:mb-12">
            <div className="mb-10 md:mb-12">
              <img 
                src={eliteWayLogo} 
                alt="Elite Way Limo" 
                className="h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 mx-auto object-contain animate-fade-in"
                style={{
                  filter: 'drop-shadow(-0.1px -0.1px 0 rgba(102,102,102,0.35)) drop-shadow(0.1px -0.1px 0 rgba(102,102,102,0.35)) drop-shadow(-0.1px 0.1px 0 rgba(102,102,102,0.35)) drop-shadow(0.1px 0.1px 0 rgba(102,102,102,0.35))'
                }}
                loading="eager"
              />
            </div>
            
            {/* Subtitle with gold gradient */}
            <div className="text-xl md:text-2xl lg:text-3xl font-light text-transparent bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text mb-8 md:mb-10">
              Switzerland's Elite Chauffeur Service
            </div>
          </div>

          <p className="max-w-[50ch] mx-auto mb-8 md:mb-12 text-gray-200 text-lg md:text-xl leading-relaxed">
            Experience unparalleled luxury with our professional chauffeur services 
            featuring Switzerland's finest fleet of premium vehicles
          </p>

          {/* Mobile Reservation Card - Right after description */}
          <div className="block md:hidden mb-8">
            <ReservationCard />
          </div>

          {/* Trust Indicators - Slightly left aligned */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 mb-10 md:mb-12 text-gray-300 text-sm">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-green-400" />
              <span>Fully Insured</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-blue-400" />
              <span>24/7 Available</span>            
            </div>
            <div className="flex items-center gap-2">
              <FaPhone className="text-yellow-400" />
              <span>Instant Booking</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 md:mb-20">
            <Link to={"/vehicles"}>
              <Button variant="secondary" className="transform hover:scale-105 transition-transform duration-300 w-full sm:w-auto">
                Explore Our Fleet
              </Button>
            </Link>
          </div>
        </div>

        {/* Desktop Reservation Card - Original position */}
        <div className="hidden md:block">
          <ReservationCard />
        </div>
      </div>
      
      {/* Improved Decorative Bottom Wave - Moved outside banner container */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg className="w-full h-16 text-zinc-900" viewBox="0 0 1200 80" preserveAspectRatio="none">
          <path d="M0,80V40c200,0,400,-20,600,0s400,20,600,0V80Z" fill="currentColor" opacity="0.8"/>
          <path d="M0,80V50c150,0,350,-15,600,10s450,-10,600,5V80Z" fill="currentColor"/>
        </svg>
      </div>
    </div>
  );
};

export default BannerSection;
