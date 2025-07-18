import { useEffect, useContext } from "react";
import ReservationContext from "../../contexts/ReservationContext";
import ReservationCard from "../../pages/Home/BannerSection/ReservationCard";
import Button from "../../components/Button";
import Image from "../../components/Image";
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
import bannerImage from "../../assets/special.jpg";
import { scrollToReservationCard } from "../../utils/scrollUtils";

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
        <div className="banner-home relative w-full rounded-[1.5rem] text-center mt-16 pb-32 md:pb-0 overflow-hidden md:overflow-visible min-h-[700px] lg:min-h-[800px]">
          {/* Optimized Background Image - Full Width */}
          <div className="absolute inset-0 z-0">
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
                    <span className="text-royal-blue drop-shadow-lg">Special</span>{" "}
                    <span className="text-gold drop-shadow-lg">Request</span>
                  </h1>
                </div>
              </div>
            </div>
            
            {/* Description text hidden per request */}

            {/* Mobile Layout: Reservation Card */}
            <div className="block md:hidden mb-8">
              <div className="relative z-50">
                <ReservationCard />
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
                Why Choose Our <span className="text-royal-blue">Special Request</span> Service
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                When standard services aren't enough, our special request team creates 
                extraordinary transportation experiences tailored to your unique vision and requirements.
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

            {/* Special Services */}
            <div className="mb-20">
              <h2 className="text-4xl font-semibold mb-12 text-center text-gray-700">
                <span className="text-royal-blue">Specialized</span> Transportation Services
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {specialServices.map((service, index) => (
                  <div key={index} className="bg-cream-light/90 p-8 rounded-lg border border-royal-blue/15 hover:border-royal-blue/30 transition-all duration-300 shadow-md hover:shadow-lg">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-royal-blue/15 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={service.icon} className="text-royal-blue text-2xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-700">{service.title}</h3>
                        {service.duration && <div className="text-royal-blue text-sm font-medium">{service.duration}</div>}
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

            {/* Popular Experiences */}
            <div className="mb-20">
              <h2 className="text-4xl font-semibold mb-12 text-center text-gray-700">
                <span className="text-royal-blue">Signature</span> Experiences
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularExperiences.map((experience, index) => (
                  <div key={index} className="bg-cream-light/90 p-6 rounded-lg border border-royal-blue/15 hover:border-royal-blue/30 transition-all duration-300 shadow-md hover:shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <FontAwesomeIcon icon={faMapMarkedAlt} className="text-royal-blue text-lg" />
                      <div>
                        <h3 className="font-semibold text-gray-700">{experience.experience}</h3>
                        <div className="text-royal-blue text-sm">{experience.duration}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Experience Highlights:</h4>
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
            <div className="mb-20">
              <h2 className="text-4xl font-semibold mb-12 text-center text-gray-700">
                How Our <span className="text-royal-blue">Custom Service</span> Works
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
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
                <Button 
                  variant="secondary"
                  onClick={scrollToReservationCard}
                >
                  Submit Special Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialRequest;