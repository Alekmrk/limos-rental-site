import { useEffect, useContext } from "react";
import ReservationContext from "../../contexts/ReservationContext";
import ReservationCard from "../../pages/Home/BannerSection/ReservationCard";
import Button from "../../components/Button";
import Image from "../../components/Image";
import { UTMLink } from "../../components/UTMLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faStar, 
  faUsers, 
  faRoute, 
  faHandshake, 
  faCrown,
  faMapMarkedAlt,
  faGlobe,
  faHeart,
  faClock,
  faGem,
  faUserTie,
  faWineGlass,
  faCamera,
  faGift,
  faShieldAlt,
  faPlaneDeparture,
  faSkiing
} from "@fortawesome/free-solid-svg-icons";
import bannerImage from "../../assets/background/special(u169_2k).jpg";

const SpecialRequest = ({ scrollUp }) => {
  const { clearReservation, setIsSpecialRequest } = useContext(ReservationContext);

  useEffect(() => {
    scrollUp();
    // Clear any previous reservation data when user visits special request page
    clearReservation();
    // Set the reservation card to special request mode
    setIsSpecialRequest(true);
  }, [scrollUp, clearReservation, setIsSpecialRequest]);

  // Preload critical banner image
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = bannerImage;
    document.head.appendChild(link);
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const features = [
    {
      icon: faCrown,
      title: "Bespoke Service",
      description: "Completely customized transportation solutions tailored to your unique requirements and preferences."
    },
    {
      icon: faUsers,
      title: "Group Coordination",
      description: "Professional management of multiple vehicles and complex logistics for large groups and events."
    },
    {
      icon: faRoute,
      title: "Custom Itineraries",
      description: "Personalized routes and schedules designed around your specific destinations and timing needs."
    },
    {
      icon: faHandshake,
      title: "Dedicated Support",
      description: "Personal consultation and planning assistance from our luxury transportation specialists."
    }
  ];

  const specialServices = [
    {
      title: "Corporate Events",
      duration: "Full event coverage",
      icon: faUserTie,
      description: "Professional transportation for conferences, corporate retreats, and executive meetings with VIP service.",
      features: ["Executive fleet", "Multi-location coordination", "Airport pickups", "Confidential service"]
    },
    {
      title: "Wine Tours & Cultural Experiences",
      duration: "Full day experiences",
      icon: faWineGlass,
      description: "Curated tours of Swiss vineyards, cultural sites, and scenic routes with knowledgeable guides.",
      features: ["Vineyard visits", "Cultural attractions", "Local expertise", "Gourmet experiences"]
    },
    {
      title: "Photography & Film Services",
      duration: "Location shoots",
      icon: faCamera,
      description: "Transportation for photo shoots, film productions, and content creation with equipment support.",
      features: ["Equipment transport", "Location scouting", "Crew coordination", "Flexible scheduling"]
    },
    {
      title: "VIP & Celebrity Services",
      duration: "Discreet luxury",
      icon: faGem,
      description: "Ultra-discreet transportation for high-profile clients requiring privacy and exceptional service.",
      features: ["Maximum privacy", "Security coordination", "Luxury amenities", "24/7 availability"]
    },
    {
      title: "Special Occasions",
      duration: "Memorable moments",
      icon: faGift,
      description: "Transportation for anniversaries, proposals, birthday celebrations, and other milestone events.",
      features: ["Surprise coordination", "Special decorations", "Champagne service", "Memory making"]
    },
    {
      title: "Alpine Resort & Ski Transfers",
      duration: "Mountain luxury",
      icon: faSkiing,
      description: "Premium transportation to exclusive Alpine resorts, ski destinations, and mountain retreats with specialized equipment handling.",
      features: ["Ski equipment transport", "Resort coordination", "Mountain weather expertise", "Après-ski arrangements"]
    }
  ];

  const popularExperiences = [
    {
      experience: "Swiss Alpine Romance",
      duration: "2-3 days",
      highlights: ["Mountain resorts", "Scenic railways", "Luxury hotels"]
    },
    {
      experience: "Cultural Heritage Tour",
      duration: "1-2 days", 
      highlights: ["Historic cities", "Museums & galleries", "Local traditions"]
    },
    {
      experience: "Lake Geneva Wine Experience",
      duration: "Full day",
      highlights: ["UNESCO vineyards", "Wine tastings", "Lakeside dining"]
    },
    {
      experience: "Jungfraujoch & Interlaken Adventure",
      duration: "Full day",
      highlights: ["Top of Europe", "Alpine railways", "Adventure sports"]
    },
    {
      experience: "Zurich Business & Luxury",
      duration: "Half day",
      highlights: ["Financial district", "Luxury shopping", "Fine dining"]
    },
    {
      experience: "St. Moritz Winter Elegance",
      duration: "2-3 days",
      highlights: ["Luxury resort", "Winter sports", "Exclusive venues"]
    }
  ];

  const serviceProcess = [
    {
      step: "1",
      title: "Consultation",
      description: "Share your vision and requirements with our luxury transportation specialists."
    },
    {
      step: "2", 
      title: "Custom Planning",
      description: "We design a personalized transportation solution with detailed itinerary and pricing."
    },
    {
      step: "3",
      title: "Flawless Execution",
      description: "Experience seamless service delivery with dedicated coordination and premium vehicles."
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
                src={bannerImage}
                alt="Luxury special request service"
                className="w-full h-full object-cover object-top"
                imageType="banner"
                priority={true}
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-warm-gray/8 via-cream/5 to-soft-gray/8"></div>
            </div>
            
            {/* Mobile Luxury Background - Premium Special Theme */}
            <div className="block md:hidden w-full h-full relative">
              {/* Rich luxury gradient base */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-900"></div>
              
              {/* Premium gold overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-gold/25 via-gold/15 to-primary-gold/30"></div>
              
              {/* Elegant decorative elements */}
              <div className="absolute inset-0 opacity-12">
                {/* Ornate corner flourishes */}
                <div className="absolute top-12 left-8 w-16 h-16 border-2 border-primary-gold/40 rounded-full"></div>
                <div className="absolute top-16 left-12 w-8 h-8 border border-gold/60 rounded-full"></div>
                <div className="absolute top-12 right-8 w-20 h-20 border-2 border-primary-gold/30 rounded-full"></div>
                <div className="absolute top-18 right-14 w-6 h-6 border border-gold/50 rounded-full"></div>
                
                <div className="absolute bottom-16 left-12 w-18 h-18 border-2 border-primary-gold/35 rounded-full"></div>
                <div className="absolute bottom-20 left-16 w-10 h-10 border border-gold/45 rounded-full"></div>
                <div className="absolute bottom-12 right-10 w-14 h-14 border-2 border-primary-gold/40 rounded-full"></div>
                
                {/* Elegant connecting lines */}
                <div className="absolute top-32 left-16 w-32 h-0.5 bg-gradient-to-r from-transparent via-primary-gold/50 to-transparent transform rotate-12"></div>
                <div className="absolute top-48 right-20 w-28 h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent transform -rotate-8"></div>
                <div className="absolute bottom-40 left-24 w-36 h-0.5 bg-gradient-to-r from-transparent via-primary-gold/45 to-transparent transform rotate-6"></div>
                
                {/* Diamond accents */}
                <div className="absolute top-28 left-32 w-2 h-2 bg-primary-gold/60 rotate-45"></div>
                <div className="absolute top-52 right-28 w-2 h-2 bg-gold/50 rotate-45"></div>
                <div className="absolute bottom-36 left-40 w-2 h-2 bg-primary-gold/55 rotate-45"></div>
                <div className="absolute bottom-48 right-32 w-2 h-2 bg-gold/45 rotate-45"></div>
              </div>
              
              {/* Luxury texture pattern */}
              <div className="absolute inset-0 opacity-8" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(212, 175, 55, 0.15) 2px, transparent 2px),
                                 radial-gradient(circle at 75% 75%, rgba(212, 175, 55, 0.1) 1px, transparent 1px)`,
                backgroundSize: '60px 60px'
              }}></div>
              
              {/* Soft premium corner accents */}
              <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-primary-gold/25 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-gold/30 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-300/20 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 right-0 w-52 h-52 bg-gradient-to-tl from-primary-gold/20 to-transparent rounded-full blur-3xl"></div>
              
              {/* Elegant center glow */}
              <div className="absolute inset-0 bg-gradient-radial from-gold/15 via-transparent to-transparent"></div>
              
              {/* Sophisticated depth vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 via-transparent to-indigo-800/30"></div>
            </div>
          </div>

          {/* Softer Animated Background Elements */}
          <div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }}>
            <div className="absolute top-20 left-10 w-20 h-20 bg-royal-blue/20 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-gold/25 rounded-full animate-bounce"></div>
            <div className="absolute bottom-40 left-20 w-12 h-12 bg-warm-gray/30 rounded-full animate-ping"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-royal-blue/15 rounded-full animate-pulse"></div>
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
                        <span className="text-royal-blue drop-shadow-lg">Special</span>{" "}
                        <span className="text-gold drop-shadow-lg">Request</span>
                      </h1>
                    </div>
                  </div>
                </div>

                {/* Desktop Trust Indicators */}
                <div className="flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-6 mb-8 md:mb-12 text-gray-600 text-sm">
                  <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                    <FontAwesomeIcon icon={faCrown} className="text-gold" />
                    <span className="text-gray-700 font-medium">Luxury Experience</span>
                  </div>
                  <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                    <FontAwesomeIcon icon={faHandshake} className="text-royal-blue" />
                    <span className="text-gray-700 font-medium">Custom Service</span>
                  </div>
                  <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                    <FontAwesomeIcon icon={faGem} className="text-emerald-500" />
                    <span className="text-gray-700 font-medium">Exclusive</span>
                  </div>
                </div>
              </div>

              {/* Right Reservation Card Area - Takes up 5 columns */}
              <div className="col-span-5 relative h-full flex items-end z-30">
                <div className="w-full pb-8">
                  <ReservationCard idPrefix="desktop-" />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout: Reservation Card */}
          <div className="block md:hidden relative z-20 px-4">
            <div className="pt-12 mb-6">
              {/* Main Title with glassy background */}
              <div className="relative mb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-black/15 backdrop-blur-sm rounded-xl transform translate-x-1 translate-y-1"></div>
                  <div className="relative bg-white/20 backdrop-blur-md rounded-xl px-4 py-3 border border-white/30 shadow-2xl">
                    <h1 className="text-hero text-center drop-shadow-lg">
                      <span className="text-royal-blue drop-shadow-lg">Special</span>{" "}
                      <span className="text-gold drop-shadow-lg">Request</span>
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
                  <FontAwesomeIcon icon={faCrown} className="text-gold text-sm" />
                  <span className="text-gray-700 font-medium">Luxury Experience</span>
                </div>
                <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-royal-blue/20 shadow-md">
                  <FontAwesomeIcon icon={faHandshake} className="text-royal-blue text-sm" />
                  <span className="text-gray-700 font-medium">Custom Service</span>
                </div>
                <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-royal-blue/20 shadow-md">
                  <FontAwesomeIcon icon={faGem} className="text-emerald-500 text-sm" />
                  <span className="text-gray-700 font-medium">Exclusive</span>
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

      {/* Features Section with Darker Cream Background */}
      <div className="bg-gradient-to-br from-cream to-warm-gray py-12 md:py-20">
        <div className="container-default">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-section-title mb-4 md:mb-6 text-gray-700">
                Why Choose Our <span className="text-royal-blue">Special Request</span> Service
              </h2>
              <p className="text-body text-gray-600 max-w-2xl mx-auto">
                When standard services aren't enough, our special request team creates 
                extraordinary transportation experiences tailored to your unique vision and requirements.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-12 md:mb-20">
              {features.map((feature, index) => (
                <div key={index} className="bg-cream-light/90 p-4 md:p-6 rounded-lg border border-royal-blue/15 text-center hover:border-royal-blue/30 transition-all duration-300 shadow-md hover:shadow-lg">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-royal-blue/15 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <FontAwesomeIcon icon={feature.icon} className="text-royal-blue text-lg md:text-2xl" />
                  </div>
                  <h3 className="text-card-title mb-2 md:mb-3 text-gray-700">{feature.title}</h3>
                  <p className="text-body text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Special Services */}
            <div className="mb-12 md:mb-20">
              <h2 className="text-section-title mb-8 md:mb-12 text-center text-gray-700">
                <span className="text-royal-blue">Specialized</span> Transportation Services
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 md:gap-8">
                {specialServices.map((service, index) => (
                  <div key={index} className="bg-cream-light/90 p-4 md:p-8 rounded-lg border border-royal-blue/15 hover:border-royal-blue/30 transition-all duration-300 shadow-md hover:shadow-lg">
                    <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-royal-blue/15 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={service.icon} className="text-royal-blue text-lg md:text-2xl" />
                      </div>
                      <div>
                        <h3 className="text-card-title text-gray-700">{service.title}</h3>
                        {service.duration && <div className="text-royal-blue text-xs md:text-sm font-medium">{service.duration}</div>}
                      </div>
                    </div>
                    
                    <p className="text-body text-gray-600 mb-4 md:mb-6">{service.description}</p>
                    
                    <div className="space-y-1 md:space-y-2">
                      <h4 className="text-xs md:text-sm font-medium text-gray-700">Service Includes:</h4>
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                          <div className="w-1 h-1 bg-royal-blue rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Experiences */}
            <div className="mb-12 md:mb-20">
              <h2 className="text-section-title mb-8 md:mb-12 text-center text-gray-700">
                <span className="text-royal-blue">Signature</span> Experiences
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {popularExperiences.map((experience, index) => (
                  <div key={index} className="bg-cream-light/90 p-4 md:p-6 rounded-lg border border-royal-blue/15 hover:border-royal-blue/30 transition-all duration-300 shadow-md hover:shadow-lg">
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                      <FontAwesomeIcon icon={faMapMarkedAlt} className="text-royal-blue text-base md:text-lg" />
                      <div>
                        <h3 className="text-card-title text-gray-700">{experience.experience}</h3>
                        <div className="text-royal-blue text-xs md:text-sm">{experience.duration}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-1 md:space-y-2">
                      <h4 className="text-xs md:text-sm font-medium text-gray-700">Experience Highlights:</h4>
                      {experience.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-1 h-1 bg-royal-blue rounded-full"></div>
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Process */}
            <div className="mb-12 md:mb-20">
              <h2 className="text-section-title mb-8 md:mb-12 text-center text-gray-700">
                How Our <span className="text-royal-blue">Custom Service</span> Works
              </h2>
              
              <div className="grid md:grid-cols-3 gap-4 md:gap-8">
                {serviceProcess.map((process, index) => (
                  <div key={index} className="text-center bg-cream-light/90 p-8 rounded-lg border border-royal-blue/15">
                    <div className="w-20 h-20 bg-royal-blue/15 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-royal-blue text-2xl font-bold">{process.step}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">{process.title}</h3>
                    <p className="text-gray-600">
                      {process.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Benefits */}
            <div className="bg-gradient-to-br from-royal-blue/10 to-gold/5 p-8 rounded-lg border border-royal-blue/20 mb-20">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-semibold mb-6 text-royal-blue-dark">Special Request Benefits</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faClock} className="text-royal-blue text-lg mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-700">No Time Constraints</h4>
                        <p className="text-gray-600 text-sm">Flexible timing and duration to match your unique requirements</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faGlobe} className="text-royal-blue text-lg mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-700">Unlimited Destinations</h4>
                        <p className="text-gray-600 text-sm">Travel anywhere within Switzerland and neighboring countries</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faStar} className="text-gold text-lg mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-700">Premium Experience</h4>
                        <p className="text-gray-600 text-sm">Luxury vehicles with amenities tailored to your preferences</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-cream-light/95 p-6 rounded-lg border border-royal-blue/20">
                  <h3 className="text-xl font-semibold mb-4 text-royal-blue-dark">What's Included</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-royal-blue rounded-full"></div>
                      <span className="text-gray-700">Personal consultation and planning</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-royal-blue rounded-full"></div>
                      <span className="text-gray-700">Custom itinerary design</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-royal-blue rounded-full"></div>
                      <span className="text-gray-700">Dedicated event coordination</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-royal-blue rounded-full"></div>
                      <span className="text-gray-700">Premium vehicle selection</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-royal-blue rounded-full"></div>
                      <span className="text-gray-700">Professional chauffeur team</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-royal-blue rounded-full"></div>
                      <span className="text-gray-700">24/7 support during event</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div className="mb-20">
              <h2 className="text-4xl font-semibold mb-12 text-center text-gray-700">
                <span className="text-royal-blue">Transparent</span> Custom Pricing
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-royal-blue/15 to-gold/5 p-6 rounded-lg border border-royal-blue/20">
                    <h3 className="text-xl font-semibold mb-3 text-royal-blue-dark">Free Consultation</h3>
                    <p className="text-gray-600">
                      Submit your request with zero payment required. We'll provide a detailed quote 
                      and only proceed once you're completely satisfied with the proposal.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-royal-blue/15 to-gold/5 p-6 rounded-lg border border-royal-blue/20">
                    <h3 className="text-xl font-semibold mb-3 text-royal-blue-dark">Competitive Rates</h3>
                    <p className="text-gray-600">
                      Our pricing is based on the complexity, duration, and specific requirements 
                      of your request. We provide detailed breakdowns with no hidden fees.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-royal-blue/15 to-gold/5 p-6 rounded-lg border border-royal-blue/20">
                    <h3 className="text-xl font-semibold mb-3 text-royal-blue-dark">Flexible Payment</h3>
                    <p className="text-gray-600">
                      Multiple payment options available including corporate billing, 
                      installment plans for large events.
                    </p>
                  </div>
                </div>
                
                <div className="bg-cream-light/95 p-6 rounded-lg border border-royal-blue/20">
                  <h3 className="text-xl font-semibold mb-4 text-royal-blue-dark">Contact Our Specialists</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Ready to create something extraordinary? Our luxury transportation specialists 
                    are here to bring your vision to life with personalized service and attention to detail.
                  </p>
                  <div className="space-y-3">
                    <Button 
                      variant="secondary"
                      onClick={() => window.location.href = 'mailto:info@elitewaylimo.ch?subject=Special Request Consultation'}
                      className="w-full"
                    >
                      Email Our Team
                    </Button>
                    <Button 
                      variant="primary"
                      onClick={() => window.location.href = 'tel:+41782647970'}
                      className="w-full"
                    >
                      Call for Consultation
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-cream-light/90 p-8 rounded-lg border border-royal-blue/20">
              <h2 className="text-3xl font-semibold mb-4 text-royal-blue-dark">Ready to Create Something Special?</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Whether it's a once-in-a-lifetime celebration or a recurring luxury service, 
                we're here to exceed your expectations with our custom transportation solutions.
              </p>
              <div className="flex justify-center">
                <UTMLink to="/booking">
                  <Button 
                    variant="secondary"
                  >
                    Submit Special Request
                  </Button>
                </UTMLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialRequest;