import { useEffect } from "react";
import ReservationCard from "../../pages/Home/BannerSection/ReservationCard";
import Button from "../../components/Button";
import Image from "../../components/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMountain, faUsers, faShieldAlt, faCalendarAlt, faSnowflake, faCrown } from "@fortawesome/free-solid-svg-icons";
import davosForumImage from "../../assets/background2(u169).jpg";
import { Link } from "react-router-dom";

const DavosForum = ({ scrollUp }) => {
  useEffect(() => {
    scrollUp();
  }, [scrollUp]);

  // Preload critical banner image
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = davosForumImage;
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
      title: "Luxury Experience",
      description: "Premium vehicles and amenities for a first-class travel experience in Davos."
    },
    {
      icon: faUsers,
      title: "Executive Transport",
      description: "Specialized service for business leaders, delegates, and international dignitaries."
    },
    {
      icon: faCalendarAlt,
      title: "Event Coordination",
      description: "Coordinated transfers for multiple attendees with precise timing and scheduling."
    },
    {
      icon: faUsers,
      title: "Group Transfers",
      description: "Seamless transportation for teams, families, or delegations of any size."
    }
  ];

  const venues = [
    {
      name: "Congress Centre Davos",
      type: "Main Venue",
      description: "Primary location for World Economic Forum sessions"
    },
    {
      name: "Davos Klosters Hotels",
      type: "Accommodation",
      description: "Luxury hotels hosting international delegates"
    },
    {
      name: "Zurich Airport",
      type: "Transport Hub", 
      description: "150km, 2.5 hours via secure mountain routes"
    },
    {
      name: "Private Heliports",
      type: "Helicopter Transfers",
      description: "Connections to/from helicopter landing sites"
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="relative">
        {/* Hero Section with Reservation Card */}
        <div className="banner-home relative w-full rounded-[1.5rem] text-center mt-16 pb-32 md:pb-0 overflow-visible min-h-[700px] lg:min-h-[800px]">
          {/* Optimized Background Image - Full Width */}
          <div className="absolute inset-0 z-0">
            <Image
              src={davosForumImage}
              alt="Davos Forum luxury transportation"
              className="w-full h-full object-cover object-top"
              imageType="banner"
              priority={true}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-warm-gray/8 via-cream/5 to-soft-gray/8"></div>
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
                        <span className="text-royal-blue drop-shadow-lg">Davos</span>{" "}
                        <span className="text-gold drop-shadow-lg">Forum</span>
                      </h1>
                    </div>
                  </div>
                </div>

                {/* Desktop Trust Indicators */}
                <div className="flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-6 mb-8 md:mb-12 text-gray-600 text-sm">
                  <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                    <FontAwesomeIcon icon={faCrown} className="text-gold" />
                    <span className="text-gray-700 font-medium">Executive Class</span>
                  </div>
                  <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                    <FontAwesomeIcon icon={faMountain} className="text-royal-blue" />
                    <span className="text-gray-700 font-medium">Alpine Routes</span>
                  </div>
                  <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-royal-blue" />
                    <span className="text-gray-700 font-medium">24/7 Available</span>
                  </div>
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
                      <span className="text-royal-blue drop-shadow-lg">Davos</span>{" "}
                      <span className="text-gold drop-shadow-lg">Forum</span>
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
                <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                  <FontAwesomeIcon icon={faCrown} className="text-gold" />
                  <span className="text-gray-700 font-medium">Executive Class</span>
                </div>
                <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                  <FontAwesomeIcon icon={faMountain} className="text-royal-blue" />
                  <span className="text-gray-700 font-medium">Alpine Routes</span>
                </div>
                <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-royal-blue" />
                  <span className="text-gray-700 font-medium">24/7 Available</span>
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
                <stop offset="50%" stopColor="#F8F7F4" stopOpacity="0.8"/>
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
                <span className="text-royal-blue">Executive</span> Transportation
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Providing world-class transportation services for the World Economic Forum and other 
                prestigious events in Davos. Experience unmatched professionalism and discretion.
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

            {/* Davos Venues */}
            <div className="bg-cream-light/90 p-4 sm:p-8 rounded-lg border border-royal-blue/20 shadow-lg mb-20">
              <h2 className="text-3xl font-semibold mb-8 text-center text-royal-blue-dark">Key Davos Locations</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {venues.map((venue, index) => (
                  <div key={index} className="bg-warm-white/80 p-4 sm:p-6 rounded-lg border border-royal-blue/15 min-w-0">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-royal-blue/15 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FontAwesomeIcon icon={faMountain} className="text-royal-blue" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="font-semibold text-gray-700 text-sm sm:text-base break-words">{venue.name}</h3>
                          <span className="text-xs bg-royal-blue/20 text-royal-blue px-2 py-1 rounded-full self-start sm:self-auto whitespace-nowrap">{venue.type}</span>
                        </div>
                        <p className="text-gray-600 text-xs sm:text-sm break-words">{venue.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WEF Special Services */}
            <div className="mb-20">
              <h2 className="text-4xl font-semibold mb-12 text-center text-gray-700">
                <span className="text-royal-blue">World Economic Forum</span> Services
              </h2>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-royal-blue/15 to-gold/5 p-6 rounded-lg border border-royal-blue/20">
                    <h3 className="text-xl font-semibold mb-3 text-royal-blue-dark">Delegate Transportation</h3>
                    <p className="text-gray-600">
                      Coordinated transportation for conference delegates between venues, hotels, and networking events. 
                      Multiple vehicle coordination for large delegations.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-royal-blue/15 to-gold/5 p-6 rounded-lg border border-royal-blue/20">
                    <h3 className="text-xl font-semibold mb-3 text-royal-blue-dark">Airport Connections</h3>
                    <p className="text-gray-600">
                      Secure transfers from Zurich Airport to Davos with winter-equipped luxury vehicles. 
                      Flight monitoring and flexible scheduling for international arrivals.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-royal-blue/15 to-gold/5 p-6 rounded-lg border border-royal-blue/20">
                    <h3 className="text-xl font-semibold mb-3 text-royal-blue-dark">Multi-Day Packages</h3>
                    <p className="text-gray-600">
                      Comprehensive transportation packages for the entire forum duration. 
                      Dedicated vehicles and chauffeurs for maximum convenience and consistency.
                    </p>
                  </div>
                </div>
                
                <div className="bg-cream-light/90 p-8 rounded-lg border border-royal-blue/20 shadow-lg">
                  <h3 className="text-2xl font-semibold mb-6 text-royal-blue-dark">Executive Amenities</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-royal-blue rounded-full"></div>
                      <span className="text-gray-700">Privacy partitions and tinted windows</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-royal-blue rounded-full"></div>
                      <span className="text-gray-700">Business-grade WiFi and charging stations</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-royal-blue rounded-full"></div>
                      <span className="text-gray-700">Climate control and premium seating</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-royal-blue rounded-full"></div>
                      <span className="text-gray-700">Refreshment service and newspapers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-royal-blue rounded-full"></div>
                      <span className="text-gray-700">Multilingual chauffeurs</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-royal-blue rounded-full"></div>
                      <span className="text-gray-700">24/7 concierge support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Winter Preparations */}
            <div className="bg-cream-light/90 p-8 rounded-lg border border-royal-blue/20 shadow-lg mb-20">
              <h2 className="text-3xl font-semibold mb-8 text-center text-royal-blue-dark">Alpine Winter Readiness</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-royal-blue/15 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FontAwesomeIcon icon={faSnowflake} className="text-royal-blue text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-700">Winter Equipment</h3>
                  <p className="text-gray-600">
                    All vehicles equipped with winter tires, chains, and emergency equipment for safe alpine travel.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-royal-blue/15 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FontAwesomeIcon icon={faMountain} className="text-royal-blue text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-700">Route Expertise</h3>
                  <p className="text-gray-600">
                    Expert knowledge of mountain passes, alternative routes, and real-time weather monitoring.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-royal-blue/15 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-royal-blue text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-700">Safety Protocols</h3>
                  <p className="text-gray-600">
                    Enhanced safety measures including emergency communication and GPS tracking systems.
                  </p>
                </div>
              </div>
            </div>

            {/* Forum Season Booking */}
            <div className="bg-gradient-to-br from-royal-blue/10 to-gold/5 p-8 rounded-lg border border-royal-blue/20 mb-20">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-semibold mb-6 text-royal-blue-dark">Forum Season Booking</h2>
                  <p className="text-gray-600 mb-6">
                    The World Economic Forum in Davos represents the pinnacle of international business and political gatherings. 
                    Our executive transportation service ensures you arrive with the professionalism and punctuality that matches the event's prestige.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-royal-blue text-lg mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-700">Early Booking Recommended</h4>
                        <p className="text-gray-600 text-sm">Book 2-3 months in advance for Forum season</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faUsers} className="text-royal-blue text-lg mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-700">Group Coordination</h4>
                        <p className="text-gray-600 text-sm">Special rates for delegation and corporate groups</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-warm-white/80 p-6 rounded-lg border border-royal-blue/15">
                  <h3 className="text-xl font-semibold mb-4 text-royal-blue-dark">Contact Our Events Team</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    For World Economic Forum transportation, contact our specialized events coordination team 
                    for personalized service planning and group bookings.
                  </p>
                  <div className="space-y-3">
                    <Button 
                      variant="secondary"
                      onClick={() => window.location.href = 'mailto:info@elitewaylimo.ch?subject=Davos Forum Transportation'}
                      className="w-full"
                    >
                      Email Events Team
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = 'tel:+41782647970'}
                      className="w-full"
                    >
                      Call Direct Line
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-cream-light/90 p-8 rounded-lg border border-royal-blue/20">
              <h2 className="text-3xl font-semibold mb-4 text-royal-blue-dark">Ready for Executive Transport?</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Experience the highest level of professional transportation service for your Davos Forum attendance. 
                Book now for guaranteed availability during the event season.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/booking">
                  <Button 
                    variant="secondary"
                  >
                    Book Davos Transfer
                  </Button>
                </Link>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/contact'}
                >
                  Contact Events Team
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DavosForum;