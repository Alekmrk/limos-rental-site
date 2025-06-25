import { useEffect, useContext } from "react";
import ReservationContext from "../../contexts/ReservationContext";
import ReservationCard from "../Home/BannerSection/ReservationCard";
import Button from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faBusinessTime, faMapMarkedAlt, faUsers, faCalendarCheck, faRoute, faStar, faHandshake, faGlobe } from "@fortawesome/free-solid-svg-icons";
import hourlyTransferImage from "../../assets/banner-image1.jpg";

const HourlyTransfer = ({ scrollUp }) => {
  const { clearReservation, setIsHourly } = useContext(ReservationContext);

  useEffect(() => {
    scrollUp();
    // Clear any previous reservation data when user visits hourly transfer page
    clearReservation();
    // Set the reservation card to hourly mode
    setIsHourly(true);
  }, [scrollUp, clearReservation, setIsHourly]);

  const features = [
    {
      icon: faClock,
      title: "Flexible Duration",
      description: "Book for 3-24 hours with complete flexibility. Extend or modify your booking as needed."
    },
    {
      icon: faBusinessTime,
      title: "Professional Service",
      description: "Dedicated chauffeur at your disposal for meetings, events, or leisure activities."
    },
    {
      icon: faRoute,
      title: "Multiple Destinations",
      description: "Visit multiple locations efficiently with optimized routing and professional guidance."
    },
    {
      icon: faHandshake,
      title: "Personalized Experience",
      description: "Tailored service with local expertise, recommendations, and attention to your preferences."
    }
  ];

  const hourlyServices = [
    {
      title: "Business Meetings",
      duration: "3-8 hours",
      icon: faBusinessTime,
      description: "Professional transportation for business meetings, conferences, and corporate events.",
      features: ["Office to office transfers", "Conference center pickups", "Airport connections", "Flexible scheduling"]
    },
    {
      title: "City Tours & Sightseeing", 
      duration: "4-12 hours",
      icon: faMapMarkedAlt,
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
      title: "Wedding & Events",
      duration: "6-12 hours",
      icon: faCalendarCheck,
      description: "Special occasion transportation with luxury vehicles and professional service.",
      features: ["Wedding venues", "Photo locations", "Guest transportation", "Event coordination"]
    }
  ];

  const pricingTiers = [
    {
      duration: "3-4 Hours",
      price: "From CHF 450",
      features: ["Perfect for meetings", "City center tours", "Shopping trips", "Business appointments"]
    },
    {
      duration: "5-8 Hours", 
      price: "From CHF 650",
      features: ["Extended sightseeing", "Multiple destinations", "Day-long events", "Corporate services"]
    },
    {
      duration: "9-12 Hours",
      price: "From CHF 950",
      features: ["Full day tours", "Wedding events", "Long-distance trips", "VIP experiences"]
    }
  ];

  const popularActivities = [
    {
      activity: "Rhine Falls & Schaffhausen",
      duration: "6 hours",
      highlights: ["Europe's most powerful waterfall", "Medieval old town", "Castle views"]
    },
    {
      activity: "Lake Geneva Wine Tour",
      duration: "8 hours", 
      highlights: ["UNESCO vineyard terraces", "Wine tastings", "Lakeside villages"]
    },
    {
      activity: "Jungfraujoch Day Trip",
      duration: "10 hours",
      highlights: ["Top of Europe", "Alpine railway", "Glacier views"]
    },
    {
      activity: "Zurich Business District",
      duration: "4 hours",
      highlights: ["Financial center", "Corporate meetings", "Hotel transfers"]
    },
    {
      activity: "Lucerne & Mount Pilatus",
      duration: "8 hours",
      highlights: ["Historic city center", "Lake cruise", "Mountain experience"]
    },
    {
      activity: "St. Moritz Luxury Tour",
      duration: "12 hours",
      highlights: ["Alpine resort", "Luxury shopping", "Scenic mountain roads"]
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="relative">
        {/* Hero Section with Reservation Card */}
        <div 
          className="relative container-big rounded-[1.5rem] text-center mt-16 pb-32 md:pb-0 md:pr-[480px] lg:pr-[520px] xl:pr-[480px] bg-cover bg-center min-h-[600px] md:min-h-[700px] lg:min-h-[800px] overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(${hourlyTransferImage})`,
          }}
        >
          {/* Animated Background Elements - Dark Theme */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-20 left-10 w-20 h-20 bg-zinc-700/20 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-gold/20 rounded-full animate-bounce"></div>
            <div className="absolute bottom-40 left-20 w-12 h-12 bg-zinc-600/20 rounded-full animate-ping"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-gray-700/20 rounded-full animate-pulse"></div>
          </div>

          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-semibold pt-48 tracking-wide mb-16 md:mb-20">
              <span className="text-gold">Hourly</span> Transfer
            </h1>
            <p className="md:w-[50ch] mx-auto mb-24 md:mb-28 px-4 md:px-0 text-lg">
              Premium chauffeur service by the hour. Perfect for business meetings, 
              sightseeing tours, and flexible transportation needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 md:mb-24 md:mt-28">
              <div className="flex items-center gap-2 text-gold">
                <FontAwesomeIcon icon={faClock} />
                <span>3-24 Hours</span>
              </div>
              <div className="flex items-center gap-2 text-gold">
                <FontAwesomeIcon icon={faRoute} />
                <span>Multiple Stops</span>
              </div>
              <div className="flex items-center gap-2 text-gold">
                <FontAwesomeIcon icon={faHandshake} />
                <span>Personal Service</span>
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
              Why Choose Our <span className="text-gold">Hourly</span> Service
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Experience ultimate flexibility with our premium hourly chauffeur service. 
              Perfect for business, leisure, and special occasions requiring personalized attention.
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

          {/* Hourly Services */}
          <div className="mb-20">
            <h2 className="text-4xl font-semibold mb-12 text-center">
              <span className="text-gold">Perfect</span> for Every Occasion
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {hourlyServices.map((service, index) => (
                <div key={index} className="bg-zinc-800/30 p-8 rounded-lg border border-zinc-700/50 hover:border-gold/30 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={service.icon} className="text-gold text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                      <div className="text-gold text-sm font-medium">{service.duration}</div>
                    </div>
                  </div>
                  
                  <p className="text-zinc-400 mb-6">{service.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-zinc-300">Service Includes:</h4>
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-zinc-400">
                        <div className="w-1 h-1 bg-gold rounded-full"></div>
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
            <h2 className="text-4xl font-semibold mb-12 text-center">
              <span className="text-gold">Popular</span> Hourly Experiences
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularActivities.map((activity, index) => (
                <div key={index} className="bg-zinc-800/30 p-6 rounded-lg border border-zinc-700/50 hover:border-gold/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white text-lg">{activity.activity}</h3>
                    <div className="bg-gold/20 text-gold px-3 py-1 rounded-full text-sm font-medium">
                      {activity.duration}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-zinc-300">Experience Highlights:</h4>
                    {activity.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-zinc-400">
                        <div className="w-1 h-1 bg-gold rounded-full"></div>
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
            <h2 className="text-4xl font-semibold mb-12 text-center">
              <span className="text-gold">Transparent</span> Hourly Rates
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {pricingTiers.map((tier, index) => (
                <div key={index} className="bg-gradient-to-br from-zinc-800/60 to-zinc-900/60 p-8 rounded-lg border border-zinc-700/50 text-center hover:border-gold/30 transition-all duration-300">
                  <h3 className="text-2xl font-semibold mb-4 text-gold">{tier.duration}</h3>
                  <div className="text-3xl font-bold text-white mb-6">{tier.price}</div>
                  
                  <div className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-zinc-300">
                        <div className="w-2 h-2 bg-gold rounded-full flex-shrink-0"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <p className="text-zinc-400 text-sm">
                * Prices shown are starting rates for premium vehicles. Final pricing depends on vehicle selection and specific requirements.
              </p>
            </div>
          </div>

          {/* Service Benefits */}
          <div className="bg-gradient-to-br from-gold/20 to-gold/5 p-8 rounded-lg border border-gold/20 mb-20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-semibold mb-6 text-gold">Hourly Service Benefits</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faClock} className="text-gold text-lg mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Maximum Flexibility</h4>
                      <p className="text-zinc-400 text-sm">Adjust your schedule, add stops, or extend your booking as needed</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faGlobe} className="text-gold text-lg mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Local Expertise</h4>
                      <p className="text-zinc-400 text-sm">Professional chauffeurs with local knowledge and recommendations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faStar} className="text-gold text-lg mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Premium Experience</h4>
                      <p className="text-zinc-400 text-sm">Luxury vehicles with amenities for comfort and productivity</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-700/30">
                <h3 className="text-xl font-semibold mb-4 text-gold">What's Included</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-zinc-300">Professional chauffeur for entire duration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-zinc-300">Fuel, parking, and tolls included</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-zinc-300">Multiple destination flexibility</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-zinc-300">Real-time schedule adjustments</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-zinc-300">Complimentary WiFi and refreshments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-zinc-800/30 p-8 rounded-lg border border-zinc-700/50">
            <h2 className="text-3xl font-semibold mb-4 text-gold">Ready for Flexible Luxury?</h2>
            <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
              Book your hourly chauffeur service today and experience the ultimate in flexible, 
              personalized transportation across Switzerland.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary"
                onClick={() => document.querySelector('.reservation').scrollIntoView({ behavior: 'smooth' })}
              >
                Book Hourly Service
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/contact'}
              >
                Plan Custom Tour
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HourlyTransfer;