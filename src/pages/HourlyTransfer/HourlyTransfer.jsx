import { useEffect, useContext } from "react";
import ReservationContext from "../../contexts/ReservationContext";
import ReservationCard from "../../pages/Home/BannerSection/ReservationCard";
import Button from "../../components/Button";
import Image from "../../components/Image";
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
import hourlyTransferImage from "../../assets/banner-image1.jpg";
import { scrollToReservationCard } from "../../utils/scrollUtils";

const HourlyTransfer = ({ scrollUp }) => {
  const { clearReservation, setIsHourly } = useContext(ReservationContext);

  useEffect(() => {
    scrollUp();
    // Clear any previous reservation data when user visits hourly service page
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
      features: ["Full day tours", "Special events", "Long-distance trips", "VIP experiences"]
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
        <div className="banner-home relative w-full rounded-[1.5rem] text-center mt-16 pb-32 md:pb-0 overflow-hidden min-h-[700px] lg:min-h-[800px]">
          {/* Optimized Background Image - Full Width */}
          <div className="absolute inset-0 z-0">
            <Image
              src={hourlyTransferImage}
              alt="Luxury hourly transfer service"
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
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-transparent bg-gradient-to-r from-royal-blue via-gold to-royal-blue-light bg-clip-text mb-8 md:mb-10 text-center">
                <span className="text-royal-blue">Hourly</span> Transfer
              </h1>
            </div>
            
            <p className="max-w-[55ch] mx-auto mb-12 md:mb-16 text-gray-800 text-lg md:text-xl lg:text-2xl leading-relaxed font-semibold">
              Premium chauffeur service by the hour. Perfect for business meetings, 
              sightseeing tours, and flexible transportation needs.
            </p>

            {/* Mobile Reservation Card - Right after description */}
            <div className="block md:hidden mb-12 px-4">
              <div className="relative z-50">
                <ReservationCard />
              </div>
              
              {/* Mobile Trust Indicators - After reservation card */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center text-gray-600 text-sm">
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
          </div>

          {/* Desktop Reservation Card - Original position */}
          <div className="hidden md:block">
            <ReservationCard />
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
                        <span className="text-gray-700">Fuel, parking, and tolls included</span>
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
                  <Button 
                    variant="secondary"
                    onClick={scrollToReservationCard}
                  >
                    Book Hourly Service
                  </Button>
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
    </div>
  );
};

export default HourlyTransfer;