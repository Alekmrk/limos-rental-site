import { useEffect, useContext } from "react";
import ReservationContext from "../../contexts/ReservationContext";
import ReservationCard from "../../pages/Home/BannerSection/ReservationCard";
import Button from "../../components/Button";
import Image from "../../components/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faClock, faShieldAlt, faUserTie, faWifi, faCoffee } from "@fortawesome/free-solid-svg-icons";
import airportTransferImage from "../../assets/airport(u169).jpg";
import { Link } from "react-router-dom";

const AirportTransfer = ({ scrollUp }) => {
  const { clearReservation } = useContext(ReservationContext);

  useEffect(() => {
    scrollUp();
    // Clear any previous reservation data when user visits airport transfer page
    clearReservation();
  }, [scrollUp, clearReservation]);

  // Preload critical banner image
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = airportTransferImage;
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
      title: "Flight Tracking",
      description: "We monitor your flight in real-time and adjust pickup times accordingly."
    },
    {
      icon: faShieldAlt,
      title: "Meet & Greet",
      description: "Professional chauffeur waiting with your name sign in the arrival hall."
    },
    {
      icon: faUserTie,
      title: "Professional Service",
      description: "Experienced drivers familiar with all Swiss airports and routes."
    },
    {
      icon: faWifi,
      title: "Premium Comfort",
      description: "WiFi, refreshments, and luxury amenities in all our vehicles."
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
              src={airportTransferImage}
              alt="Luxury airport transfer service"
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
              <div className="col-span-7 flex flex-col justify-center pt-20">
                {/* Main Title with glassy background */}
                <div className="relative mb-8 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-black/15 backdrop-blur-sm rounded-2xl transform translate-x-1 translate-y-1"></div>
                    <div className="relative bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30 shadow-2xl">
                      <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-center drop-shadow-lg">
                        <span className="text-white drop-shadow-lg">Airport</span>{" "}
                        <span className="text-gold drop-shadow-lg">Transfer</span>
                      </h1>
                    </div>
                  </div>
                </div>

                {/* Desktop Trust Indicators */}
                <div className="flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-6 text-gray-600 text-sm">
                  <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                    <FontAwesomeIcon icon={faPlane} className="text-royal-blue" />
                    <span className="text-gray-700 font-medium">Flight Tracking</span>
                  </div>
                  <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                    <FontAwesomeIcon icon={faClock} className="text-royal-blue" />
                    <span className="text-gray-700 font-medium">60min Free Wait</span>
                  </div>
                  <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-emerald-500" />
                    <span className="text-gray-700 font-medium">Meet & Greet</span>
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
            <div className="pt-40 mb-8">
              {/* Main Title with glassy background */}
              <div className="relative mb-8 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-black/15 backdrop-blur-sm rounded-2xl transform translate-x-1 translate-y-1"></div>
                  <div className="relative bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30 shadow-2xl">
                    <h1 className="text-3xl sm:text-4xl font-semibold text-center drop-shadow-lg">
                      <span className="text-white drop-shadow-lg">Airport</span>{" "}
                      <span className="text-gold drop-shadow-lg">Transfer</span>
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
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center text-gray-600 text-sm">
                <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                  <FontAwesomeIcon icon={faPlane} className="text-royal-blue" />
                  <span className="text-gray-700 font-medium">Flight Tracking</span>
                </div>
                <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                  <FontAwesomeIcon icon={faClock} className="text-royal-blue" />
                  <span className="text-gray-700 font-medium">60min Free Wait</span>
                </div>
                <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-emerald-500" />
                  <span className="text-gray-700 font-medium">Meet & Greet</span>
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
                Why Choose Our <span className="text-royal-blue">Airport Service</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We understand that airport transfers require precision, reliability, and comfort. 
                Our specialized service ensures a stress-free journey every time.
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

            {/* Special Features for Airport Transfers */}
            <div className="bg-gradient-to-br from-royal-blue/10 to-gold/5 p-8 rounded-lg border border-royal-blue/20 mb-20">
              <h2 className="text-3xl font-semibold mb-6 text-center text-royal-blue-dark">Airport Transfer Perks</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <FontAwesomeIcon icon={faClock} className="text-royal-blue text-xl mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">Free Wait Time</h3>
                      <p className="text-gray-600 text-sm">60 minutes complimentary waiting time included for all scheduled flights arrivals.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-emerald-500 text-xl mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">Flight Monitoring</h3>
                      <p className="text-gray-600 text-sm">Real-time flight tracking ensures we're always ready when you land.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <FontAwesomeIcon icon={faUserTie} className="text-royal-blue text-xl mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">Meet & Greet Service</h3>
                      <p className="text-gray-600 text-sm">Personal assistance with luggage and navigation through the airport.</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <FontAwesomeIcon icon={faWifi} className="text-royal-blue text-xl mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">Premium Amenities</h3>
                      <p className="text-gray-600 text-sm">Complimentary WiFi, bottled water, and phone chargers in all vehicles.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <FontAwesomeIcon icon={faCoffee} className="text-gold text-xl mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">Refreshments</h3>
                      <p className="text-gray-600 text-sm">Complimentary beverages and snacks available upon request.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <FontAwesomeIcon icon={faPlane} className="text-royal-blue text-xl mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">Airport Expertise</h3>
                      <p className="text-gray-600 text-sm">Our drivers know all terminals, shortcuts, and optimal pickup points.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Process */}
            <div className="mb-20">
              <h2 className="text-4xl font-semibold mb-12 text-center text-gray-700">
                How Our <span className="text-royal-blue">Airport Service</span> Works
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center bg-cream-light/90 p-8 rounded-lg border border-royal-blue/15">
                  <div className="w-20 h-20 bg-royal-blue/15 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-royal-blue text-2xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-700">Book Your Transfer</h3>
                  <p className="text-gray-600">
                    Provide your flight details and destination. We'll handle the rest with real-time flight tracking.
                  </p>
                </div>
                
                <div className="text-center bg-cream-light/90 p-8 rounded-lg border border-royal-blue/15">
                  <div className="w-20 h-20 bg-royal-blue/15 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-royal-blue text-2xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-700">Meet & Greet</h3>
                  <p className="text-gray-600">
                    Your chauffeur will be waiting in arrivals with a personalized name sign, ready to assist with luggage.
                  </p>
                </div>
                
                <div className="text-center bg-cream-light/90 p-8 rounded-lg border border-royal-blue/15">
                  <div className="w-20 h-20 bg-royal-blue/15 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-royal-blue text-2xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-700">Luxury Journey</h3>
                  <p className="text-gray-600">
                    Relax in comfort as we transport you to your destination via the most efficient route.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-cream-light/90 p-8 rounded-lg border border-royal-blue/20">
              <h2 className="text-3xl font-semibold mb-4 text-royal-blue-dark">Ready for Your Airport Transfer?</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Book now and experience the difference of professional airport transfer service. 
                No stress, no delays, just luxury transportation when you need it most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/booking">
                  <Button 
                    variant="secondary"
                  >
                    Book Airport Transfer
                  </Button>
                </Link>
                <Button 
                  variant="primary"
                  onClick={() => window.location.href = 'tel:+41782647970'}
                >
                  Call for Urgent Booking
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirportTransfer;