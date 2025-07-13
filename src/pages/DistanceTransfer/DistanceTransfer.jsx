import { useEffect, useContext } from "react";
import ReservationContext from "../../contexts/ReservationContext";
import ReservationCard from "../../pages/Home/BannerSection/ReservationCard";
import Button from "../../components/Button";
import Image from "../../components/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faRoute, 
  faClock, 
  faShieldAlt, 
  faMapMarkedAlt, 
  faCalculator,
  faStar,
  faUsers
} from "@fortawesome/free-solid-svg-icons";
import distanceTransferImage from "../../assets/distance.jpg";
import { scrollToReservationCard } from "../../utils/scrollUtils";

const DistanceTransfer = ({ scrollUp }) => {
  const { clearReservation } = useContext(ReservationContext);

  useEffect(() => {
    scrollUp();
    // Clear any previous reservation data when user visits distance transfer page
    clearReservation();
  }, [scrollUp, clearReservation]);

  const features = [
    {
      icon: faRoute,
      title: "Direct Routes",
      description: "Efficient point-to-point transportation with optimal route planning and real-time traffic monitoring."
    },
    {
      icon: faCalculator,
      title: "Transparent Pricing",
      description: "Clear distance-based pricing with no hidden fees. Know your exact cost before you travel."
    },
    {
      icon: faClock,
      title: "Punctual Service",
      description: "Guaranteed on-time pickup and delivery with professional time management and scheduling."
    },
    {
      icon: faShieldAlt,
      title: "Safe & Secure",
      description: "GPS tracking, fully insured vehicles, and professional chauffeurs for your peace of mind."
    }
  ];

  const popularRoutes = [
    {
      from: "Zurich Airport",
      to: "Geneva",
      distance: "280 km",
      time: "3.0 hours",
      highlights: ["Lake Geneva views", "Highway comfort", "Business district access"]
    },
    {
      from: "Zurich",
      to: "Basel",
      distance: "85 km", 
      time: "1.0 hour",
      highlights: ["Rhine River route", "Cultural centers", "Cross-border access"]
    },
    {
      from: "Zurich",
      to: "Lausanne",
      distance: "225 km",
      time: "2.5 hours", 
      highlights: ["Lake Geneva region", "Olympic Museum", "Wine country views"]
    },
    {
      from: "Zurich",
      to: "Lucerne",
      distance: "55 km",
      time: "45 minutes",
      highlights: ["Alpine scenery", "Lake Lucerne", "Historic old town"]
    },
    {
      from: "Zurich",
      to: "Interlaken",
      distance: "125 km",
      time: "1.5 hours",
      highlights: ["Bernese Oberland", "Jungfrau region", "Alpine gateway"]
    },
    {
      from: "St. Gallen",
      to: "Zurich",
      distance: "95 km",
      time: "1.2 hours",
      highlights: ["Eastern Switzerland", "Textile heritage", "Abbey district"]
    }
  ];

  const serviceProcess = [
    {
      step: "1",
      title: "Book Your Route",
      description: "Enter your pickup and destination points for instant pricing and availability."
    },
    {
      step: "2", 
      title: "Route Optimization",
      description: "We plan the most efficient route considering traffic, road conditions, and your preferences."
    },
    {
      step: "3",
      title: "Professional Transport",
      description: "Enjoy comfortable travel with our experienced chauffeurs and luxury vehicles."
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="relative">
        {/* Hero Section with Reservation Card */}
        <div className="banner-home relative w-full rounded-[1.5rem] text-center mt-16 pb-32 md:pb-0 overflow-hidden md:overflow-visible min-h-[700px] lg:min-h-[800px]">
          {/* Optimized Background Image - Full Width */}
          <div className="absolute inset-0 z-0">
            <Image
              src={distanceTransferImage}
              alt="Luxury distance transfer service"
              className="w-[calc(100%+2rem)] md:w-[calc(100%+4rem)] lg:w-[calc(100%+8rem)] h-full object-cover"
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

          <div className="relative z-20 px-4 md:px-8 lg:px-16 md:mr-96 lg:mr-[28rem] xl:mr-[32rem] container-ultra-wide mx-auto">
            <div className="pt-32 md:pt-40 lg:pt-48 mb-8 md:mb-12 flex items-center justify-center min-h-[400px]">
              {/* Main Title with glassy background */}
              <div className="relative max-w-4xl mx-auto">
                <div className="absolute inset-0 bg-black/15 backdrop-blur-sm rounded-2xl transform translate-x-1 translate-y-1"></div>
                <div className="relative bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30 shadow-2xl">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-center drop-shadow-lg">
                    <span className="text-royal-blue drop-shadow-lg">Distance</span>{" "}
                    <span className="text-gold drop-shadow-lg">Transfer</span>
                  </h1>
                </div>
              </div>
            </div>
            
            {/* Description text hidden per request */}

            {/* Mobile Reservation Card - Right after description */}
            <div className="block md:hidden mb-12 px-4">
              <div className="relative z-50">
                <ReservationCard />
              </div>
              
              {/* Mobile Trust Indicators - After reservation card */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center text-gray-600 text-sm">
                <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                  <FontAwesomeIcon icon={faRoute} className="text-royal-blue" />
                  <span className="text-gray-700 font-medium">Direct Routes</span>
                </div>
                <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                  <FontAwesomeIcon icon={faCalculator} className="text-royal-blue" />
                  <span className="text-gray-700 font-medium">Fixed Pricing</span>
                </div>
                <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                  <FontAwesomeIcon icon={faClock} className="text-emerald-500" />
                  <span className="text-gray-700 font-medium">On-Time Guarantee</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Reservation Card - Original position */}
          <div className="hidden md:block">
            <ReservationCard />
          </div>
        </div>
        
        {/* Softer Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 z-20 -mb-1">
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
                Why Choose Our <span className="text-royal-blue">Point-to-Point</span> Service
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience seamless city-to-city transportation with our professional distance transfer service. 
                Perfect for business travel, airport connections, and intercity journeys.
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

            {/* Popular Routes */}
            <div className="mb-20">
              <h2 className="text-4xl font-semibold mb-12 text-center text-gray-700">
                <span className="text-royal-blue">Popular</span> Swiss Routes
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularRoutes.map((route, index) => (
                  <div key={index} className="bg-cream-light/90 p-6 rounded-lg border border-royal-blue/15 hover:border-royal-blue/30 transition-all duration-300 shadow-md hover:shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <FontAwesomeIcon icon={faMapMarkedAlt} className="text-royal-blue text-lg" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-700 text-lg">{route.from}</h3>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <span>→</span>
                          <span>{route.to}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center bg-royal-blue/10 p-3 rounded-lg">
                        <div className="text-royal-blue font-semibold">{route.distance}</div>
                        <div className="text-gray-600 text-xs">Distance</div>
                      </div>
                      <div className="text-center bg-royal-blue/10 p-3 rounded-lg">
                        <div className="text-royal-blue font-semibold">{route.time}</div>
                        <div className="text-gray-600 text-xs">Duration</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Route Highlights:</h4>
                      {route.highlights.map((highlight, idx) => (
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
            <div className="mb-20">
              <h2 className="text-4xl font-semibold mb-12 text-center text-gray-700">
                How Our <span className="text-royal-blue">Distance Service</span> Works
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {serviceProcess.map((process, index) => (
                  <div key={index} className="text-center bg-cream-light/90 p-8 rounded-lg border border-royal-blue/15">
                    <div className="w-20 h-20 bg-royal-blue/15 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-royal-blue text-2xl font-bold">{process.step}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">{process.title}</h3>
                    <p className="text-gray-600">{process.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Information */}
            <div className="bg-gradient-to-br from-royal-blue/10 to-gold/5 p-8 rounded-lg border border-royal-blue/20 mb-20">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-semibold mb-6 text-royal-blue-dark">Distance-Based Pricing</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faCalculator} className="text-royal-blue text-lg mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-700">Transparent Rates</h4>
                        <p className="text-gray-600 text-sm">Clear pricing based on distance with no hidden fees</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faStar} className="text-gold text-lg mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-700">Premium Vehicles</h4>
                        <p className="text-gray-600 text-sm">Luxury fleet with competitive rates for all distances</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faUsers} className="text-emerald-500 text-lg mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-700">Group Discounts</h4>
                        <p className="text-gray-600 text-sm">Special rates for multiple passengers and return trips</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-cream-light/95 p-6 rounded-lg border border-royal-blue/20">
                  <h3 className="text-xl font-semibold mb-4 text-royal-blue-dark">What's Included</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-royal-blue rounded-full"></div>
                      <span className="text-gray-700">Professional chauffeur service</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-royal-blue rounded-full"></div>
                      <span className="text-gray-700">All charges and tolls included</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-royal-blue rounded-full"></div>
                      <span className="text-gray-700">Complimentary waiting time</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-royal-blue rounded-full"></div>
                      <span className="text-gray-700">Route optimization and planning</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-royal-blue rounded-full"></div>
                      <span className="text-gray-700">Real-time GPS tracking</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-cream-light/90 p-8 rounded-lg border border-royal-blue/20">
              <h2 className="text-3xl font-semibold mb-4 text-royal-blue-dark">Ready for Your Journey?</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Book your point-to-point transfer today and experience premium transportation 
                across Switzerland's most beautiful routes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary"
                  onClick={scrollToReservationCard}
                >
                  Book Distance Transfer
                </Button>
                <Button 
                  variant="primary"
                  onClick={() => window.location.href = '/contact'}
                >
                  Get Custom Quote
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistanceTransfer;