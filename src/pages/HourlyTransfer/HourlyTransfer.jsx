import { useEffect, useContext } from "react";
import ReservationContext from "../../contexts/ReservationContext";
import ReservationCard from "../../pages/Home/BannerSection/ReservationCard";
import Button from "../../components/Button";
import Image from "../../components/Image";
import { UTMLink } from "../../components/UTMLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faClock, 
  faRoute, 
  faShieldAlt, 
  faUserTie, 
  faUsers,
  faCalendarCheck,
  faGlobe,
  faStar
} from "@fortawesome/free-solid-svg-icons";
import hourlyTransferImage from "../../assets/background/hourly(u169_2k).jpg";

const HourlyTransfer = ({ scrollUp }) => {
  const { clearReservation, setIsHourly } = useContext(ReservationContext);

  useEffect(() => {
    scrollUp();
    // Clear any previous reservation data when user visits hourly service page
    clearReservation();
    // Set the reservation card to hourly mode
    setIsHourly(true);
  }, [scrollUp, clearReservation, setIsHourly]);

  // Preload critical banner image
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = hourlyTransferImage;
    document.head.appendChild(link);
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const features = [
    {
      icon: faClock,
      title: "Flexible Duration",
      description: "Book for 3-24 hours with complete flexibility. Extend or modify your booking as needed."
    },
    {
      icon: faUserTie,
      title: "Professional Service",
      description: "Dedicated chauffeur at your disposal for meetings, events, or leisure activities."
    },
    {
      icon: faRoute,
      title: "Multiple Destinations",
      description: "Visit multiple locations efficiently with optimized routing and professional guidance."
    },
    {
      icon: faShieldAlt,
      title: "Personalized Experience",
      description: "Tailored service with local expertise, recommendations, and attention to your preferences."
    }
  ];

  const hourlyServices = [
    {
      title: "Business Meetings",
      duration: "3-8 hours",
      icon: faUserTie,
      description: "Professional transportation for business meetings, conferences, and corporate events.",
      features: ["Office to office transfers", "Conference center pickups", "Airport connections", "Flexible scheduling"]
    },
    {
      title: "City Tours & Sightseeing", 
      duration: "4-12 hours",
      icon: faRoute,
      description: "Explore Switzerland's beautiful cities and attractions with a knowledgeable chauffeur.",
      features: ["Tourist attractions", "Photography spots", "Local recommendations", "Cultural sites"]
    },
    {
      title: "Shopping & Leisure",
      duration: "3-6 hours", 
      icon: faUsers,
      description: "Comfortable transportation for shopping trips, dining, and recreational activities.",
      features: ["Shopping districts", "Restaurant transfers", "Entertainment venues", "Personal errands"]
    },
    {
      title: "Corporate Events",
      duration: "6-12 hours",
      icon: faCalendarCheck,
      description: "Professional transportation for conferences, corporate retreats, and executive meetings.",
      features: ["Corporate venues", "Multi-location coordination", "Executive service", "Flexible scheduling"]
    }
  ];

  const pricingTiers = [
    {
      duration: "3-4 Hours",
      price: "From CHF 270",
      features: ["Perfect for meetings", "City center tours"]
    },
    {
      duration: "5-8 Hours", 
      price: "From CHF 450",
      features: ["Multiple destinations", "Shopping trips"]
    },
    {
      duration: "9-12 Hours",
      price: "From CHF 810",
      features: ["Day-long events", "Corporate events"]
    }
  ];

  const popularActivities = [
    {
      activity: "Rhine Falls & Schaffhausen",
      duration: "5 hours",
      highlights: ["Europe's most powerful waterfall", "Medieval old town", "Castle views"]
    },
    {
      activity: "Lake Geneva Wine Tour",
      duration: "8 hours", 
      highlights: ["UNESCO vineyard terraces", "Wine tastings", "Lakeside villages"]
    },
    {
      activity: "Jungfraujoch Day Trip",
      duration: "12 hours",
      highlights: ["Top of Europe", "Alpine railway", "Glacier views"]
    },
    {
      activity: "Zurich Business District",
      duration: "3 hours",
      highlights: ["Financial center", "Corporate meetings", "Hotel transfers"]
    },
    {
      activity: "Lucerne & Mount Pilatus",
      duration: "7 hours",
      highlights: ["Historic city center", "Lake cruise", "Mountain experience"]
    },
    {
      activity: "St. Moritz Luxury Tour",
      duration: "10 hours",
      highlights: ["Alpine resort", "Luxury shopping", "Scenic mountain roads"]
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="relative">
        {/* Hero Section with Reservation Card */}
        <div className="banner-home relative w-full rounded-[1.5rem] text-center mt-16 pb-32 md:pb-0 overflow-visible min-h-[700px] lg:min-h-[800px]">
          {/* Background - Image on desktop, luxury pattern on mobile */}
          <div className="absolute inset-0 z-0">
            {/* Desktop Background Image */}
            <div className="hidden md:block w-full h-full">
              <Image
                src={hourlyTransferImage}
                alt="Luxury hourly transfer service"
                className="w-full h-full object-cover object-top"
                imageType="banner"
                priority={true}
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-warm-gray/8 via-cream/5 to-soft-gray/8"></div>
            </div>
            
            {/* Mobile Luxury Background */}
            <div className="block md:hidden w-full h-full relative">
              {/* Lighter luxury gradient base */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-600 to-slate-700"></div>
              
              {/* Elegant gold wash overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-gold/20 via-gold/10 to-primary-gold/15"></div>
              
              {/* Precise luxury watch graphics - positioned at bottom */}
              <div className="absolute inset-0 opacity-35">
                {/* Main precision watch face */}
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-40 h-40 border-4 border-primary-gold/80 rounded-full bg-gradient-to-br from-gray-800/30 to-gray-900/40 shadow-lg"></div>
                <div className="absolute bottom-22 left-1/2 transform -translate-x-1/2 w-36 h-36 border-2 border-gold/70 rounded-full"></div>
                <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-32 h-32 border border-primary-gold/60 rounded-full"></div>
                
                {/* Precision hour markers (12 positions like real watch) */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-1.5 h-6 bg-primary-gold/90"></div>
                <div className="absolute bottom-54 left-1/2 transform -translate-x-1/2 w-1.5 h-6 bg-primary-gold/90"></div>
                <div className="absolute bottom-32 left-0 w-1.5 h-6 bg-primary-gold/90 transform rotate-90"></div>
                <div className="absolute bottom-32 right-0 w-1.5 h-6 bg-primary-gold/90 transform rotate-90"></div>
                
                {/* Additional precise hour markers */}
                <div className="absolute bottom-14 left-4 w-1 h-4 bg-gold/80 transform rotate-30"></div>
                <div className="absolute bottom-18 left-6 w-1 h-4 bg-primary-gold/70 transform rotate-60"></div>
                <div className="absolute bottom-46 left-6 w-1 h-4 bg-gold/70 transform rotate-120"></div>
                <div className="absolute bottom-50 left-4 w-1 h-4 bg-primary-gold/70 transform rotate-150"></div>
                <div className="absolute bottom-50 right-4 w-1 h-4 bg-gold/80 transform rotate-210"></div>
                <div className="absolute bottom-46 right-6 w-1 h-4 bg-primary-gold/70 transform rotate-240"></div>
                <div className="absolute bottom-18 right-6 w-1 h-4 bg-gold/70 transform rotate-300"></div>
                <div className="absolute bottom-14 right-4 w-1 h-4 bg-primary-gold/70 transform rotate-330"></div>
                
                {/* Precise watch hands showing 10:10 (classic watch display time) */}
                <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-14 h-1.5 bg-primary-gold/95 transform rotate-45 origin-left rounded-full"></div>
                <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gold/90 transform rotate-315 origin-left rounded-full"></div>
                <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-primary-gold/80 transform rotate-90 origin-left"></div>
                
                {/* Watch center dot */}
                <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary-gold/90 rounded-full"></div>
                
                {/* Minute markers (precise tiny lines) */}
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-gold/60 transform rotate-6"></div>
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-gold/60 transform rotate-12"></div>
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-gold/60 transform rotate-18"></div>
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-gold/60 transform rotate-24"></div>
                
                {/* Watch crown (right side) */}
                <div className="absolute bottom-31 right-6 w-4 h-8 bg-primary-gold/70 rounded-sm"></div>
                <div className="absolute bottom-30 right-5 w-2 h-6 bg-gold/80 rounded-sm"></div>
                <div className="absolute bottom-29 right-4 w-1 h-4 bg-primary-gold/60"></div>
                
                {/* Chronograph sub-dials with hands */}
                <div className="absolute bottom-26 left-8 w-8 h-8 border-2 border-primary-gold/60 rounded-full bg-gray-800/20"></div>
                <div className="absolute bottom-38 left-8 w-8 h-8 border-2 border-gold/60 rounded-full bg-gray-800/20"></div>
                <div className="absolute bottom-26 right-8 w-8 h-8 border-2 border-primary-gold/60 rounded-full bg-gray-800/20"></div>
                
                {/* Sub-dial hands */}
                <div className="absolute bottom-28 left-10 w-2 h-0.5 bg-primary-gold/70 transform rotate-45"></div>
                <div className="absolute bottom-40 left-10 w-2 h-0.5 bg-gold/70 transform rotate-90"></div>
                <div className="absolute bottom-28 right-10 w-2 h-0.5 bg-primary-gold/70 transform rotate-30"></div>
                
                {/* Additional precision watches on sides */}
                <div className="absolute bottom-42 left-20 w-20 h-20 border-3 border-primary-gold/50 rounded-full bg-gradient-to-br from-gray-700/20 to-gray-800/30"></div>
                <div className="absolute bottom-42 right-20 w-20 h-20 border-3 border-gold/50 rounded-full bg-gradient-to-br from-gray-700/20 to-gray-800/30"></div>
                
                {/* Side watch details */}
                <div className="absolute bottom-46 left-24 w-6 h-0.5 bg-primary-gold/70 transform rotate-45"></div>
                <div className="absolute bottom-46 left-24 w-4 h-0.5 bg-gold/60 transform rotate-90"></div>
                <div className="absolute bottom-46 right-24 w-6 h-0.5 bg-gold/70 transform rotate-30"></div>
                <div className="absolute bottom-46 right-24 w-4 h-0.5 bg-primary-gold/60 transform rotate-120"></div>
                
                {/* Watch band/chain links */}
                <div className="absolute bottom-16 left-28 w-1 h-12 bg-primary-gold/60 rounded-full"></div>
                <div className="absolute bottom-16 left-30 w-1 h-10 bg-gold/60 rounded-full"></div>
                <div className="absolute bottom-16 left-32 w-1 h-12 bg-primary-gold/50 rounded-full"></div>
                <div className="absolute bottom-16 right-28 w-1 h-12 bg-gold/60 rounded-full"></div>
                <div className="absolute bottom-16 right-30 w-1 h-10 bg-primary-gold/60 rounded-full"></div>
                <div className="absolute bottom-16 right-32 w-1 h-12 bg-gold/50 rounded-full"></div>
                
                {/* Digital display elements */}
                <div className="absolute bottom-22 left-12 w-12 h-3 bg-primary-gold/50 rounded border border-gold/60"></div>
                <div className="absolute bottom-42 right-12 w-12 h-3 bg-gold/50 rounded border border-primary-gold/60"></div>
              </div>
              
              {/* Subtle luxury texture */}
              <div className="absolute inset-0 opacity-8" style={{
                backgroundImage: `repeating-linear-gradient(
                  30deg,
                  rgba(212, 175, 55, 0.1) 0px,
                  transparent 2px,
                  transparent 40px
                )`
              }}></div>
              
              {/* Soft corner accents */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-warm-white/30 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cream/25 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-primary-gold/25 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 right-0 w-44 h-44 bg-gradient-to-tl from-warm-gray/30 to-transparent rounded-full blur-3xl"></div>
              
              {/* Elegant center glow */}
              <div className="absolute inset-0 bg-gradient-radial from-cream/15 via-transparent to-transparent"></div>
              
              {/* Subtle depth vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-800/30 via-transparent to-gray-700/20"></div>
            </div>
          </div>

          {/* Softer Animated Background Elements */}
          <div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }}>
            <div className="absolute top-20 left-10 w-20 h-20 bg-royal-blue/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-40 left-20 w-12 h-12 bg-warm-gray/30 rounded-full animate-ping"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-royal-blue/15 rounded-full animate-pulse"></div>
          </div>

          {/* Desktop Layout - Split Container */}
          <div className="hidden md:block relative z-20 h-full">
            <div className="grid grid-cols-12 gap-8 px-4 md:px-6 lg:px-16 container-ultra-wide mx-auto h-full min-h-[700px] lg:min-h-[800px]">
              {/* Left Content Area - Takes up 7 columns */}
              <div className="col-span-7 flex flex-col justify-center">
                {/* Main Title with glassy background */}
                <div className="relative mb-8 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-black/15 backdrop-blur-sm rounded-2xl transform translate-x-1 translate-y-1"></div>
                    <div className="relative bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30 shadow-2xl">
                      <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-center drop-shadow-lg">
                        <span className="text-white drop-shadow-lg">Hourly</span>{" "}
                        <span className="text-gold drop-shadow-lg">Transfer</span>
                      </h1>
                    </div>
                  </div>
                </div>

                {/* Desktop Trust Indicators */}
                <div className="flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-6 text-gray-600 text-sm">
                  <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                    <FontAwesomeIcon icon={faClock} className="text-royal-blue" />
                    <span className="text-gray-700 font-medium">3-24 Hours</span>
                  </div>
                  <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                    <FontAwesomeIcon icon={faRoute} className="text-royal-blue" />
                    <span className="text-gray-700 font-medium">Multiple Stops</span>
                  </div>
                  <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-emerald-500" />
                    <span className="text-gray-700 font-medium">Personal Service</span>
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
                    <h1 className="text-hero text-center drop-shadow-lg">
                      <span className="text-white drop-shadow-lg">Hourly</span>{" "}
                      <span className="text-gold drop-shadow-lg">Transfer</span>
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
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center text-gray-600 text-xs">
                <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-royal-blue/20 shadow-md">
                  <FontAwesomeIcon icon={faClock} className="text-royal-blue text-sm" />
                  <span className="text-gray-700 font-medium">3-24 Hours</span>
                </div>
                <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-royal-blue/20 shadow-md">
                  <FontAwesomeIcon icon={faRoute} className="text-royal-blue text-sm" />
                  <span className="text-gray-700 font-medium">Multiple Stops</span>
                </div>
                <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-royal-blue/20 shadow-md">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-emerald-500 text-sm" />
                  <span className="text-gray-700 font-medium">Personal Service</span>
                </div>
              </div>
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

      {/* Features Section with Darker Cream Background */}
      <div className="bg-gradient-to-br from-cream to-warm-gray py-20">
        <div className="container-default">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-semibold mb-6 text-gray-700">
                Why Choose Our <span className="text-royal-blue">Hourly</span> Service
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience ultimate flexibility with our premium hourly chauffeur service. 
                Perfect for business, leisure, and special occasions requiring personalized attention.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {features.map((feature, index) => (
                <div key={index} className="bg-cream-light/90 p-6 rounded-lg border border-royal-blue/15 text-center hover:border-royal-blue/30 transition-all duration-300 shadow-md hover:shadow-lg">
                  <div className="w-16 h-16 bg-royal-blue/15 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FontAwesomeIcon icon={feature.icon} className="text-royal-blue text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-700">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Hourly Services */}
            <div className="mb-20">
              <h2 className="text-4xl font-semibold mb-12 text-center text-gray-700">
                <span className="text-royal-blue">Perfect</span> for Every Occasion
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {hourlyServices.map((service, index) => (
                  <div key={index} className="bg-cream-light/90 p-8 rounded-lg border border-royal-blue/15 hover:border-royal-blue/30 transition-all duration-300 shadow-md hover:shadow-lg">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-royal-blue/15 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={service.icon} className="text-royal-blue text-2xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-700">{service.title}</h3>
                        <div className="text-royal-blue text-sm font-medium">{service.duration}</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Service Includes:</h4>
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1 h-1 bg-royal-blue rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Activities */}
            <div className="mb-20">
              <h2 className="text-4xl font-semibold mb-12 text-center text-gray-700">
                <span className="text-royal-blue">Popular</span> Hourly Experiences
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularActivities.map((activity, index) => (
                  <div key={index} className="bg-cream-light/90 p-6 rounded-lg border border-royal-blue/15 hover:border-royal-blue/30 transition-all duration-300 shadow-md hover:shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-700 text-lg">{activity.activity}</h3>
                      <div className="bg-royal-blue/15 text-royal-blue px-3 py-1 rounded-full text-sm font-medium">
                        {activity.duration}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Experience Highlights:</h4>
                      {activity.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1 h-1 bg-royal-blue rounded-full"></div>
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Information */}
            <div className="mb-20">
              <h2 className="text-4xl font-semibold mb-12 text-center text-gray-700">
                <span className="text-royal-blue">Transparent</span> Hourly Rates
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {pricingTiers.map((tier, index) => (
                  <div key={index} className="bg-gradient-to-br from-cream-light/95 to-darker-cream/90 p-8 rounded-lg border border-royal-blue/15 text-center hover:border-royal-blue/30 transition-all duration-300 shadow-md hover:shadow-lg">
                    <h3 className="text-2xl font-semibold mb-4 text-royal-blue-dark">{tier.duration}</h3>
                    <div className="text-3xl font-bold text-gray-700 mb-6">{tier.price}</div>
                    
                    <div className="space-y-3">
                      {tier.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-royal-blue rounded-full flex-shrink-0"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <p className="text-gray-600 text-sm">
                  * Prices shown are starting rates for premium vehicles. Final pricing depends on vehicle selection and specific requirements.
                </p>
              </div>
            </div>

            {/* Service Benefits */}
            <div className="bg-gradient-to-br from-royal-blue/10 to-gold/5 p-8 rounded-lg border border-royal-blue/20 mb-20">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-semibold mb-6 text-royal-blue-dark">Hourly Service Benefits</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faClock} className="text-royal-blue text-lg mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-700">Maximum Flexibility</h4>
                        <p className="text-gray-600 text-sm">Adjust your schedule, add stops, or extend your booking as needed</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faGlobe} className="text-royal-blue text-lg mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-700">Local Expertise</h4>
                        <p className="text-gray-600 text-sm">Professional chauffeurs with local knowledge and recommendations</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faStar} className="text-gold text-lg mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-700">Premium Experience</h4>
                        <p className="text-gray-600 text-sm">Luxury vehicles with amenities for comfort and productivity</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-cream-light/95 p-6 rounded-lg border border-royal-blue/20">
                  <h3 className="text-xl font-semibold mb-4 text-royal-blue-dark">What's Included</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-royal-blue rounded-full"></div>
                      <span className="text-gray-700">Professional chauffeur for entire duration</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-royal-blue rounded-full"></div>
                      <span className="text-gray-700">Parking and tolls included</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-royal-blue rounded-full"></div>
                      <span className="text-gray-700">Multiple destination flexibility</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-royal-blue rounded-full"></div>
                      <span className="text-gray-700">Real-time schedule adjustments</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-royal-blue rounded-full"></div>
                      <span className="text-gray-700">Complimentary WiFi and refreshments</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-cream-light/90 p-8 rounded-lg border border-royal-blue/20">
              <h2 className="text-3xl font-semibold mb-4 text-royal-blue-dark">Ready for Flexible Luxury?</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Book your hourly chauffeur service today and experience the ultimate in flexible, 
                personalized transportation across Switzerland.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <UTMLink to="/booking">
                  <Button 
                    variant="secondary"
                  >
                    Book Hourly Service
                  </Button>
                </UTMLink>
                <Button 
                  variant="primary"
                  onClick={() => window.location.href = '/contact'}
                >
                  Plan Custom Tour
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HourlyTransfer;