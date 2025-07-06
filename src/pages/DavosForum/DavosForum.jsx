import { useEffect } from "react";
import ReservationCard from "../../pages/Home/BannerSection/ReservationCard";
import Button from "../../components/Button";
import Image from "../../components/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMountain, faUsers, faShieldAlt, faCalendarAlt, faSnowflake, faCrown } from "@fortawesome/free-solid-svg-icons";
import davosForumImage from "../../assets/banner-image1.jpg";
import { scrollToReservationCard } from "../../utils/scrollUtils";

const DavosForum = ({ scrollUp }) => {
  useEffect(() => {
    scrollUp();
  }, [scrollUp]);

  const features = [
    {
      icon: faShieldAlt,
      title: "VIP Security",
      description: "Enhanced security protocols and discrete professional service for high-profile clients."
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
      icon: faSnowflake,
      title: "Alpine Expertise", 
      description: "Winter driving specialists familiar with mountain roads and weather conditions."
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
        <div className="relative w-full rounded-[1.5rem] text-center mt-16 pb-32 md:pb-0 md:pr-[480px] lg:pr-[520px] xl:pr-[480px] min-h-[600px] md:min-h-[700px] lg:min-h-[800px] overflow-hidden">
          {/* Optimized Background Image - Full Width */}
          <div className="absolute inset-0 z-0 -mx-4 md:-mx-8 lg:-mx-16">
            <Image
              src={davosForumImage}
              alt="Davos Forum luxury transportation"
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

          <div className="relative z-20 container-big mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-semibold pt-48 tracking-wide mb-16 md:mb-20 text-gray-700">
              <span className="text-royal-blue">Davos</span> Forum
            </h1>
            <p className="md:w-[50ch] mx-auto mb-12 md:mb-28 px-4 md:px-0 text-lg text-gray-600 font-medium">
              Executive transportation for the World Economic Forum and prestigious Davos events. 
              Professional service for global leaders and delegates.
            </p>

            {/* Mobile Reservation Card - Right after description */}
            <div className="block md:hidden mb-12 px-4">
              <ReservationCard />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 md:mb-24 md:mt-28">
              <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                <FontAwesomeIcon icon={faShieldAlt} className="text-royal-blue" />
                <span className="text-gray-700 font-medium">VIP Security</span>
              </div>
              <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                <FontAwesomeIcon icon={faMountain} className="text-royal-blue" />
                <span className="text-gray-700 font-medium">Alpine Routes</span>
              </div>
              <div className="flex items-center gap-2 bg-cream-light/80 backdrop-blur-sm px-4 py-2 rounded-full border border-royal-blue/20 shadow-md">
                <FontAwesomeIcon icon={faCrown} className="text-gold" />
                <span className="text-gray-700 font-medium">Executive Class</span>
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
          <svg className="w-full h-16 text-cream" viewBox="0 0 1200 80" preserveAspectRatio="none">
            <path d="M0,80V40c200,0,400,-20,600,0s400,20,600,0V80Z" fill="currentColor" opacity="0.8"/>
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
            <div className="bg-cream-light/90 p-8 rounded-lg border border-royal-blue/20 shadow-lg mb-20">
              <h2 className="text-3xl font-semibold mb-8 text-center text-royal-blue-dark">Key Davos Locations</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {venues.map((venue, index) => (
                  <div key={index} className="bg-warm-white/80 p-6 rounded-lg border border-royal-blue/15">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-royal-blue/15 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FontAwesomeIcon icon={faMountain} className="text-royal-blue" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-700">{venue.name}</h3>
                          <span className="text-xs bg-royal-blue/20 text-royal-blue px-2 py-1 rounded-full">{venue.type}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{venue.description}</p>
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
                <Button 
                  variant="secondary"
                  onClick={scrollToReservationCard}
                >
                  Book Davos Transfer
                </Button>
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