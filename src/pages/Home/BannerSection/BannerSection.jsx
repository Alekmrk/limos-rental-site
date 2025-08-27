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
      <div className="banner-home relative w-full rounded-[1.5rem] mt-16 pb-24 md:pb-0 overflow-visible text-center min-h-[600px] md:min-h-[700px] lg:min-h-[800px]">
        {/* Background - Image on desktop, luxury pattern on mobile */}
        <div className="absolute inset-0 z-0">
          {/* Desktop Background Image */}
          <div className="hidden md:block w-full h-full">
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
          
          {/* Mobile Luxury Background - Similar tone to Airport Transfer */}
          <div className="block md:hidden w-full h-full relative">
            {/* Dark luxury gradient base - similar to airport transfer */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-gray-700 to-slate-900"></div>
            
            {/* Luxury gold overlay instead of aviation blue */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-gold/20 via-gold/10 to-primary-gold/15"></div>
            
            {/* Luxury service path graphics - positioned at bottom */}
            <div className="absolute inset-0 opacity-30">
              {/* Elegant curved paths with trailing traces */}
              <div className="absolute bottom-20 left-8 w-48 h-2 bg-gradient-to-r from-transparent via-primary-gold/60 to-transparent transform rotate-8"></div>
              {/* Trailing dotted path */}
              <div className="absolute bottom-20 left-2 w-32 h-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent transform rotate-8" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(212, 175, 55, 0.4) 3px, rgba(212, 175, 55, 0.4) 6px)' }}></div>
              
              <div className="absolute bottom-32 right-12 w-40 h-2 bg-gradient-to-r from-transparent via-gold/60 to-transparent transform -rotate-6"></div>
              {/* Trailing dotted path */}
              <div className="absolute bottom-32 right-6 w-28 h-1 bg-gradient-to-r from-transparent via-primary-gold/40 to-transparent transform -rotate-6" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(218, 165, 32, 0.4) 3px, rgba(218, 165, 32, 0.4) 6px)' }}></div>
              
              <div className="absolute bottom-44 left-16 w-56 h-2 bg-gradient-to-r from-transparent via-gold/70 to-transparent transform rotate-4"></div>
              {/* Trailing dotted path */}
              <div className="absolute bottom-44 left-8 w-36 h-1 bg-gradient-to-r from-transparent via-primary-gold/50 to-transparent transform rotate-4" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(212, 175, 55, 0.5) 3px, rgba(212, 175, 55, 0.5) 6px)' }}></div>
              
              {/* Elegant luxury elements following the paths */}
              <div className="absolute bottom-24 left-32 text-primary-gold/70 text-xl transform rotate-8">◆</div>
              <div className="absolute bottom-36 right-28 text-gold/60 text-lg transform -rotate-6">✦</div>
              <div className="absolute bottom-48 left-40 text-primary-gold/80 text-xl transform rotate-4">◈</div>
              
              {/* Luxury service markers at very bottom */}
              <div className="absolute bottom-8 left-24 w-6 h-6 bg-primary-gold/60 rounded-full"></div>
              <div className="absolute bottom-12 left-52 w-5 h-5 bg-gold/60 rounded-full"></div>
              <div className="absolute bottom-6 right-36 w-6 h-6 bg-primary-gold/70 rounded-full"></div>
              <div className="absolute bottom-10 right-20 w-5 h-5 bg-gold/50 rounded-full"></div>
            </div>
            
            {/* Subtle luxury pattern */}
            <div className="absolute inset-0 opacity-8" style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                rgba(212, 175, 55, 0.1) 0px,
                transparent 2px,
                transparent 30px
              )`
            }}></div>
            
            {/* Soft corner accents */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-primary-gold/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold/25 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-primary-gold/20 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-44 h-44 bg-gradient-to-tl from-gold/20 to-transparent rounded-full blur-3xl"></div>
            
            {/* Elegant center glow */}
            <div className="absolute inset-0 bg-gradient-radial from-primary-gold/10 via-transparent to-transparent"></div>
            
            {/* Subtle depth vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-slate-800/30"></div>
          </div>
        </div>

        {/* Softer Animated Background Elements with Harmonious Colors - Similar to Airport Transfer */}
        <div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }}>
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary-gold/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-warm-gray/30 rounded-full animate-ping"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-primary-gold/15 rounded-full animate-pulse"></div>
        </div>

        {/* Desktop Layout - Split Container */}
        <div className="hidden md:block relative z-20 h-full">
          <div className="grid grid-cols-12 gap-8 px-4 md:px-6 lg:px-16 container-ultra-wide mx-auto h-full min-h-[700px] lg:min-h-[800px]">
            {/* Left Content Area - Takes up 7 columns */}
            <div className="col-span-7 flex flex-col justify-center pt-24 md:pt-32 lg:pt-40">
              {/* Main Title with glassy background */}
              <div className="relative mb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-black/15 backdrop-blur-sm rounded-2xl transform translate-x-1 translate-y-1"></div>
                  <div className="relative bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30 shadow-2xl">
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-center drop-shadow-lg">
                      <span className="text-primary-gold drop-shadow-lg">Switzerland's Elite</span>{" "}
                      <span className="text-gold drop-shadow-lg">Chauffeur Service</span>
                    </h1>
                  </div>
                </div>
              </div>

              {/* Desktop Trust Indicators with centered button layout */}
              <div className="flex flex-col items-center">
                <div className="flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-6 text-gray-600 text-sm mb-6">
                  <div className="flex items-center gap-3 bg-warm-white/80 backdrop-blur-sm px-3 py-2 rounded-full border border-primary-gold/20 shadow-md">
                    <FaShieldAlt className="text-emerald-500 text-base" />
                    <span className="font-medium">Fully Insured</span>
                  </div>
                  <div className="flex items-center gap-3 bg-warm-white/80 backdrop-blur-sm px-3 py-2 rounded-full border border-primary-gold/20 shadow-md">
                    <FaClock className="text-primary-gold text-base" />
                    <span className="font-medium">24/7 Available</span>            
                  </div>
                  <div className="flex items-center gap-3 bg-warm-white/80 backdrop-blur-sm px-3 py-2 rounded-full border border-primary-gold/20 shadow-md">
                    <FaPhone className="text-gold text-base" />
                    <span className="font-medium">Instant Booking</span>
                  </div>
                </div>

                {/* Button positioned below and centered with middle badge */}
                <div className="flex justify-center lg:ml-[-1.35rem]">
                  <UTMLink to={"/vehicles"}>
                    <Button variant="secondary" className="transform hover:scale-105 transition-all duration-300">
                      Explore Our Fleet
                    </Button>
                  </UTMLink>
                </div>
              </div>
            </div>

            {/* Right Reservation Card Area - Takes up 5 columns */}
            <div className="col-span-5 relative h-full flex items-start">
              <div className="w-full pt-12 md:pt-16 lg:pt-20">
                <ReservationCard idPrefix="desktop-" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout: Reservation Card and Badges in Same Container */}
        <div className="block md:hidden relative z-20 px-4">
          <div className="pt-12 mb-6">
            {/* Main Title with glassy background */}
            <div className="relative mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-black/15 backdrop-blur-sm rounded-xl transform translate-x-1 translate-y-1"></div>
                <div className="relative bg-white/20 backdrop-blur-md rounded-xl px-4 py-3 border border-white/30 shadow-2xl">
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-center drop-shadow-lg">
                    <span className="text-primary-gold drop-shadow-lg">Switzerland's Elite</span>{" "}
                    <span className="text-gold drop-shadow-lg">Chauffeur Service</span>
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative z-50">
              <ReservationCard idPrefix="mobile-" />
            </div>
            
            {/* Mobile Trust Indicators - After reservation card */}
            <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-3 text-gray-600 text-xs">
              <div className="flex items-center gap-2 bg-warm-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-primary-gold/20 shadow-md">
                <FaShieldAlt className="text-emerald-500 text-sm" />
                <span className="font-medium">Fully Insured</span>
              </div>
              <div className="flex items-center gap-2 bg-warm-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-primary-gold/20 shadow-md">
                <FaClock className="text-primary-gold text-sm" />
                <span className="font-medium">24/7 Available</span>            
              </div>
              <div className="flex items-center gap-2 bg-warm-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-primary-gold/20 shadow-md">
                <FaPhone className="text-gold text-sm" />
                <span className="font-medium">Instant Booking</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <UTMLink to={"/vehicles"}>
                <Button variant="secondary" className="transform hover:scale-105 transition-all duration-300 w-full sm:w-auto text-sm py-2">
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
                <stop offset="50%" stopColor="#EBE5DD" stopOpacity="0.8"/>
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
