import { useEffect } from "react";
import ReservationCard from "../../pages/Home/BannerSection/ReservationCard";
import Button from "../../components/Button";
import Image from "../../components/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMountain, faUsers, faShieldAlt, faCalendarAlt, faSnowflake, faCrown } from "@fortawesome/free-solid-svg-icons";
import davosForumImage from "../../assets/banner-image1.jpg";

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
        <div className="relative container-big rounded-[1.5rem] text-center mt-16 pb-32 md:pb-0 md:pr-[480px] lg:pr-[520px] xl:pr-[480px] min-h-[600px] md:min-h-[700px] lg:min-h-[800px] overflow-hidden">
          {/* Optimized Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={davosForumImage}
              alt="Davos Forum luxury transportation"
              className="w-full h-full object-cover"
              imageType="banner"
              priority={true}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50"></div>
          </div>

          {/* Animated Background Elements - Dark Theme */}
          <div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }}>
            <div className="absolute top-20 left-10 w-20 h-20 bg-zinc-700/20 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-gold/20 rounded-full animate-bounce"></div>
            <div className="absolute bottom-40 left-20 w-12 h-12 bg-zinc-600/20 rounded-full animate-ping"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-gray-700/20 rounded-full animate-pulse"></div>
          </div>

          <div className="relative z-20">
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-semibold pt-48 tracking-wide mb-16 md:mb-20">
              <span className="text-gold">Davos</span> Forum
            </h1>
            <p className="md:w-[50ch] mx-auto mb-24 md:mb-28 px-4 md:px-0 text-lg">
              Executive transportation for the World Economic Forum and prestigious Davos events. 
              Professional service for global leaders and delegates.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 md:mb-24 md:mt-28">
              <div className="flex items-center gap-2 text-gold">
                <FontAwesomeIcon icon={faShieldAlt} />
                <span>VIP Security</span>
              </div>
              <div className="flex items-center gap-2 text-gold">
                <FontAwesomeIcon icon={faMountain} />
                <span>Alpine Routes</span>
              </div>
              <div className="flex items-center gap-2 text-gold">
                <FontAwesomeIcon icon={faCrown} />
                <span>Executive Class</span>
              </div>
            </div>
          </div>
          
          {/* Reservation Card */}
          <ReservationCard />
        </div>

        {/* Improved Decorative Bottom Wave - Moved outside banner container */}
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
              <span className="text-gold">Executive</span> Transportation
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Providing world-class transportation services for the World Economic Forum and other 
              prestigious events in Davos. Experience unmatched professionalism and discretion.
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

          {/* Davos Venues */}
          <div className="bg-zinc-800/30 p-8 rounded-lg border border-zinc-700/50 mb-20">
            <h2 className="text-3xl font-semibold mb-8 text-center text-gold">Key Davos Locations</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {venues.map((venue, index) => (
                <div key={index} className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-700/30">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faMountain} className="text-gold" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-white">{venue.name}</h3>
                        <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded-full">{venue.type}</span>
                      </div>
                      <p className="text-zinc-400 text-sm">{venue.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WEF Special Services */}
          <div className="mb-20">
            <h2 className="text-4xl font-semibold mb-12 text-center">
              <span className="text-gold">World Economic Forum</span> Services
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gold/20 to-gold/5 p-6 rounded-lg border border-gold/20">
                  <h3 className="text-xl font-semibold mb-3 text-gold">Delegate Transportation</h3>
                  <p className="text-zinc-300">
                    Coordinated transportation for conference delegates between venues, hotels, and networking events. 
                    Multiple vehicle coordination for large delegations.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-gold/20 to-gold/5 p-6 rounded-lg border border-gold/20">
                  <h3 className="text-xl font-semibold mb-3 text-gold">Airport Connections</h3>
                  <p className="text-zinc-300">
                    Secure transfers from Zurich Airport to Davos with winter-equipped luxury vehicles. 
                    Flight monitoring and flexible scheduling for international arrivals.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-gold/20 to-gold/5 p-6 rounded-lg border border-gold/20">
                  <h3 className="text-xl font-semibold mb-3 text-gold">Multi-Day Packages</h3>
                  <p className="text-zinc-300">
                    Comprehensive transportation packages for the entire forum duration. 
                    Dedicated vehicles and chauffeurs for maximum convenience and consistency.
                  </p>
                </div>
              </div>
              
              <div className="bg-zinc-800/30 p-8 rounded-lg border border-zinc-700/50">
                <h3 className="text-2xl font-semibold mb-6 text-gold">Executive Amenities</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-zinc-300">Privacy partitions and tinted windows</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-zinc-300">Business-grade WiFi and charging stations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-zinc-300">Climate control and premium seating</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-zinc-300">Refreshment service and newspapers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-zinc-300">Multilingual chauffeurs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-zinc-300">24/7 concierge support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Winter Preparations */}
          <div className="bg-zinc-800/30 p-8 rounded-lg border border-zinc-700/50 mb-20">
            <h2 className="text-3xl font-semibold mb-8 text-center text-gold">Alpine Winter Readiness</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FontAwesomeIcon icon={faSnowflake} className="text-gold text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Winter Equipment</h3>
                <p className="text-zinc-400">
                  All vehicles equipped with winter tires, chains, and emergency equipment for safe alpine travel.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FontAwesomeIcon icon={faMountain} className="text-gold text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Route Expertise</h3>
                <p className="text-zinc-400">
                  Expert knowledge of mountain passes, alternative routes, and real-time weather monitoring.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-gold text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Safety Protocols</h3>
                <p className="text-zinc-400">
                  Enhanced safety measures including emergency communication and GPS tracking systems.
                </p>
              </div>
            </div>
          </div>

          {/* Booking Information */}
          <div className="bg-gradient-to-br from-gold/20 to-gold/5 p-8 rounded-lg border border-gold/20 mb-20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-semibold mb-6 text-gold">Forum Season Booking</h2>
                <p className="text-zinc-300 mb-6">
                  The World Economic Forum in Davos represents the pinnacle of international business and political gatherings. 
                  Our executive transportation service ensures you arrive with the professionalism and punctuality that matches the event's prestige.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-gold text-lg mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Early Booking Recommended</h4>
                      <p className="text-zinc-400 text-sm">Book 2-3 months in advance for Forum season</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faUsers} className="text-gold text-lg mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Group Coordination</h4>
                      <p className="text-zinc-400 text-sm">Special rates for delegation and corporate groups</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-700/30">
                <h3 className="text-xl font-semibold mb-4 text-gold">Contact Our Events Team</h3>
                <p className="text-zinc-300 text-sm mb-6">
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
          <div className="text-center bg-zinc-800/30 p-8 rounded-lg border border-zinc-700/50">
            <h2 className="text-3xl font-semibold mb-4 text-gold">Ready for Executive Transport?</h2>
            <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
              Experience the highest level of professional transportation service for your Davos Forum attendance. 
              Book now for guaranteed availability during the event season.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary"
                onClick={() => document.querySelector('.reservation').scrollIntoView({ behavior: 'smooth' })}
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
  );
};

export default DavosForum;