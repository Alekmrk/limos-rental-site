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
import distanceTransferImage from "../../assets/banner-image.jpg";

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
      from: "Geneva",
      to: "Lausanne",
      distance: "65 km",
      time: "0.8 hours", 
      highlights: ["Lake Leman scenic", "Olympic Museum", "Wine region"]
    },
    {
      from: "Zurich",
      to: "Lucerne",
      distance: "55 km",
      time: "0.7 hours",
      highlights: ["Alpine scenery", "Lake Lucerne", "Historic old town"]
    },
    {
      from: "Bern",
      to: "Interlaken",
      distance: "60 km",
      time: "0.8 hours",
      highlights: ["Bernese Oberland", "Jungfrau region", "Adventure tourism"]
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
        <div className="relative container-big rounded-[1.5rem] text-center mt-16 pb-32 md:pb-0 md:pr-[480px] lg:pr-[520px] xl:pr-[480px] min-h-[600px] md:min-h-[700px] lg:min-h-[800px] overflow-hidden">
          {/* Optimized Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={distanceTransferImage}
              alt="Luxury distance transfer service"
              className="w-full h-full object-cover"
              imageType="banner"
              priority={true}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/40"></div>
          </div>

          {/* Animated Background Elements - Dark Theme */}
          <div className="absolute inset-0 z-10">
            <div className="absolute top-20 left-10 w-20 h-20 bg-zinc-700/20 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-gold/20 rounded-full animate-bounce"></div>
            <div className="absolute bottom-40 left-20 w-12 h-12 bg-zinc-600/20 rounded-full animate-ping"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-gray-700/20 rounded-full animate-pulse"></div>
          </div>

          <div className="relative z-20">
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-semibold pt-48 tracking-wide mb-16 md:mb-20">
              <span className="text-gold">Distance</span> Transfer
            </h1>
            <p className="md:w-[50ch] mx-auto mb-24 md:mb-28 px-4 md:px-0 text-lg">
              Professional point-to-point transportation across Switzerland and beyond. 
              Reliable, comfortable, and efficient luxury transfers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 md:mb-24 md:mt-28">
              <div className="flex items-center gap-2 text-gold">
                <FontAwesomeIcon icon={faRoute} />
                <span>Direct Routes</span>
              </div>
              <div className="flex items-center gap-2 text-gold">
                <FontAwesomeIcon icon={faCalculator} />
                <span>Fixed Pricing</span>
              </div>
              <div className="flex items-center gap-2 text-gold">
                <FontAwesomeIcon icon={faClock} />
                <span>On-Time Guarantee</span>
              </div>
            </div>
          </div>
          
          {/* Reservation Card */}
          <ReservationCard />
        </div>

        {/* Improved Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg className="w-full h-16 text-zinc-900" viewBox="0 0 1200 80" preserveAspectRatio="none">
            <path d="M0,80V40c200,0,400,-20,600,0s400,20,600,0V80Z" fill="currentColor" opacity="0.8"/>
            <path d="M0,80V50c150,0,350,-15,600,10s450,-10,600,5V80Z" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="container-default mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-semibold mb-6">
              Why Choose Our <span className="text-gold">Point-to-Point</span> Service
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Experience seamless city-to-city transportation with our professional distance transfer service. 
              Perfect for business travel, airport connections, and intercity journeys.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {features.map((feature, index) => (
              <div key={index} className="bg-zinc-800/30 p-6 rounded-lg border border-zinc-700/50 text-center hover:border-gold/30 transition-all duration-300">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={feature.icon} className="text-gold text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Popular Routes */}
          <div className="mb-20">
            <h2 className="text-4xl font-semibold mb-12 text-center">
              <span className="text-gold">Popular</span> Swiss Routes
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularRoutes.map((route, index) => (
                <div key={index} className="bg-zinc-800/30 p-6 rounded-lg border border-zinc-700/50 hover:border-gold/30 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <FontAwesomeIcon icon={faMapMarkedAlt} className="text-gold text-lg" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg">{route.from}</h3>
                      <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <span>→</span>
                        <span>{route.to}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center bg-black/20 p-3 rounded-lg">
                      <div className="text-gold font-semibold">{route.distance}</div>
                      <div className="text-zinc-400 text-xs">Distance</div>
                    </div>
                    <div className="text-center bg-black/20 p-3 rounded-lg">
                      <div className="text-gold font-semibold">{route.time}</div>
                      <div className="text-zinc-400 text-xs">Duration</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-zinc-300">Route Highlights:</h4>
                    {route.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-zinc-400">
                        <div className="w-1 h-1 bg-gold rounded-full"></div>
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
            <h2 className="text-4xl font-semibold mb-12 text-center">
              How Our <span className="text-gold">Distance Service</span> Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {serviceProcess.map((process, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-gold text-2xl font-bold">{process.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{process.title}</h3>
                  <p className="text-zinc-400">{process.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Information */}
          <div className="bg-gradient-to-br from-gold/20 to-gold/5 p-8 rounded-lg border border-gold/20 mb-20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-semibold mb-6 text-gold">Distance-Based Pricing</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faCalculator} className="text-gold text-lg mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Transparent Rates</h4>
                      <p className="text-zinc-400 text-sm">Clear pricing based on distance with no hidden fees</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faStar} className="text-gold text-lg mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Premium Vehicles</h4>
                      <p className="text-zinc-400 text-sm">Luxury fleet with competitive rates for all distances</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faUsers} className="text-gold text-lg mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Group Discounts</h4>
                      <p className="text-zinc-400 text-sm">Special rates for multiple passengers and return trips</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-700/30">
                <h3 className="text-xl font-semibold mb-4 text-gold">What's Included</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-zinc-300">Professional chauffeur service</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-zinc-300">Fuel and toll charges included</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-zinc-300">Complimentary waiting time</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-zinc-300">Route optimization and planning</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-zinc-300">Real-time GPS tracking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-zinc-800/30 p-8 rounded-lg border border-zinc-700/50">
            <h2 className="text-3xl font-semibold mb-4 text-gold">Ready for Your Journey?</h2>
            <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
              Book your point-to-point transfer today and experience premium transportation 
              across Switzerland's most beautiful routes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary"
                onClick={() => document.querySelector('.reservation').scrollIntoView({ behavior: 'smooth' })}
              >
                Book Distance Transfer
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/contact'}
              >
                Get Custom Quote
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistanceTransfer;