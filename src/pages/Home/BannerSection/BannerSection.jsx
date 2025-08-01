import { UTMLink } from "../../../components/UTMLink";
import Button from "../../../components/Button";
import ReservationCard from "./ReservationCard";
import Image from "../../../components/Image";
import bannerImage from "../../../assets/background/home(u169_2k).jpg";
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
      <div className="banner-home relative w-full rounded-[1.5rem] mt-16 pb-32 md:pb-0 overflow-visible text-center min-h-[700px] lg:min-h-[800px]">
        {/* Optimized Background Image - Full Width */}
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImage}
            alt="Elite Way Limo luxury chauffeur service"
            className="w-full h-full object-cover object-top"
            imageType="banner"
            priority={true}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-warm-gray/8 via-cream/5 to-soft-gray/8"></div>
        </div>

        {/* Softer Animated Background Elements with Harmonious Colors */}
        <div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }}>
          <div className="absolute top-20 left-10 w-20 h-20 bg-royal-blue/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-gold/25 rounded-full animate-bounce"></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-warm-gray/30 rounded-full animate-ping"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-royal-blue/15 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-cream/20 to-gold/15 rounded-full blur-xl animate-float"></div>
        </div>

        {/* Desktop Layout - Split Container */}
        <div className="hidden md:block relative z-20 h-full">
          <div className="grid grid-cols-12 gap-8 px-4 md:px-6 lg:px-16 container-ultra-wide mx-auto h-full min-h-[700px] lg:min-h-[800px]">
            {/* Left Content Area - Takes up 7 columns */}
            <div className="col-span-7 pt-32 md:pt-40 lg:pt-48">
              {/* Main Title with glassy background */}
              <div className="relative mb-8 md:mb-10 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-black/15 backdrop-blur-sm rounded-2xl transform translate-x-1 translate-y-1"></div>
                  <div className="relative bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30 shadow-2xl">
                    <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-center drop-shadow-lg">
                      <span className="text-royal-blue drop-shadow-lg">Switzerland's Elite</span>{" "}
                      <span className="text-gold drop-shadow-lg">Chauffeur Service</span>
                    </h1>
                  </div>
                </div>
              </div>

              {/* Desktop Trust Indicators */}
              <div className="flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-6 mb-8 md:mb-12 text-gray-600 text-sm">
                <div className="flex items-center gap-3 bg-warm-white/80 backdrop-blur-sm px-3 py-2 rounded-full border border-royal-blue/20 shadow-md">
                  <FaShieldAlt className="text-emerald-500 text-base" />
                  <span className="font-medium">Fully Insured</span>
                </div>
                <div className="flex items-center gap-3 bg-warm-white/80 backdrop-blur-sm px-3 py-2 rounded-full border border-royal-blue/20 shadow-md">
                  <FaClock className="text-royal-blue text-base" />
                  <span className="font-medium">24/7 Available</span>            
                </div>
                <div className="flex items-center gap-3 bg-warm-white/80 backdrop-blur-sm px-3 py-2 rounded-full border border-royal-blue/20 shadow-md">
                  <FaPhone className="text-gold text-base" />
                  <span className="font-medium">Instant Booking</span>
                </div>
              </div>

              <div className="flex justify-center mb-12 md:mb-16">
                <UTMLink to={"/vehicles"}>
                  <Button variant="secondary" className="transform hover:scale-105 transition-all duration-300">
                    Explore Our Fleet
                  </Button>
                </UTMLink>
              </div>
            </div>

            {/* Right Reservation Card Area - Takes up 5 columns */}
            <div className="col-span-5 relative h-full flex items-end">
              <div className="w-full pb-8">
                <ReservationCard idPrefix="desktop-" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout: Reservation Card and Badges in Same Container */}
        <div className="block md:hidden relative z-20 px-4">
          <div className="pt-32 mb-8">
            {/* Main Title with glassy background */}
            <div className="relative mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-black/15 backdrop-blur-sm rounded-2xl transform translate-x-1 translate-y-1"></div>
                <div className="relative bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30 shadow-2xl">
                  <h1 className="text-3xl sm:text-4xl font-semibold text-center drop-shadow-lg">
                    <span className="text-royal-blue drop-shadow-lg">Switzerland's Elite</span>{" "}
                    <span className="text-gold drop-shadow-lg">Chauffeur Service</span>
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="relative z-50">
              <ReservationCard idPrefix="mobile-" />
            </div>
            
            {/* Mobile Trust Indicators - After reservation card */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 text-gray-600 text-sm">
              <div className="flex items-center gap-3 bg-warm-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                <FaShieldAlt className="text-emerald-500 text-lg" />
                <span className="font-medium">Fully Insured</span>
              </div>
              <div className="flex items-center gap-3 bg-warm-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                <FaClock className="text-royal-blue text-lg" />
                <span className="font-medium">24/7 Available</span>            
              </div>
              <div className="flex items-center gap-3 bg-warm-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                <FaPhone className="text-gold text-lg" />
                <span className="font-medium">Instant Booking</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <UTMLink to={"/vehicles"}>
                <Button variant="secondary" className="transform hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                  Explore Our Fleet
                </Button>
              </UTMLink>
            </div>
          </div>
        </div>

        {/* Softer Decorative Bottom Wave - MOVED INSIDE BANNER */}
        <div className="absolute bottom-0 left-0 right-0 z-10 -mb-1" style={{ pointerEvents: 'none' }}>
          <svg className="w-full h-20 text-warm-gray" viewBox="0 0 1200 80" preserveAspectRatio="none">
            <defs>
              <linearGradient id="softWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.9"/>
                <stop offset="50%" stopColor="#F8F7F4" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.9"/>
              </linearGradient>
            </defs>
            <path d="M0,80V40c200,0,400,-20,600,0s400,20,600,0V80Z" fill="url(#softWaveGradient)" opacity="0.9"/>
            <path d="M0,80V50c150,0,350,-15,600,10s450,-10,600,5V80Z" fill="currentColor"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BannerSection;
