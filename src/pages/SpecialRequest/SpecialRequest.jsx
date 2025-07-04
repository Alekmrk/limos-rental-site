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
  faShieldAlt
} from "@fortawesome/free-solid-svg-icons";
import bannerImage from "../../assets/banner-image.jpg";

const SpecialRequest = ({ scrollUp }) => {
  const { clearReservation, setIsSpecialRequest } = useContext(ReservationContext);

  useEffect(() => {
    scrollUp();
    // Clear any previous reservation data when user visits special request page
    clearReservation();
    // Set the reservation card to special request mode
    setIsSpecialRequest(true);
  }, [scrollUp, clearReservation, setIsSpecialRequest]);

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
      title: "Wedding Transportation",
      icon: faHeart,
      description: "Elegant bridal transportation with decorated vehicles, coordination for wedding parties, and photography support.",
      features: ["Bridal car decoration", "Wedding party coordination", "Photography assistance", "Flexible timing"]
    },
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
        <div className="relative container-big rounded-[1.5rem] text-center mt-16 pb-32 md:pb-0 md:pr-[480px] lg:pr-[520px] xl:pr-[480px] min-h-[600px] md:min-h-[700px] lg:min-h-[800px] overflow-hidden">
          {/* Optimized Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={bannerImage}
              alt="Luxury special request service"
              className="w-full h-full object-cover"
              imageType="banner"
              priority={true}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40"></div>
          </div>
          
          <div className="relative z-20">
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-semibold pt-48 tracking-wide mb-16 md:mb-20">
              <span className="text-gold">Special</span> Request
            </h1>
            <p className="md:w-[50ch] mx-auto mb-12 md:mb-28 px-4 md:px-0 text-lg">
              Where imagination meets luxury transportation. We craft extraordinary experiences that transform ordinary journeys into unforgettable memories, tailored exclusively for your most special moments.
            </p>

            {/* Mobile Reservation Card - Right after description */}
            <div className="block md:hidden mb-12 px-4">
              <ReservationCard />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 md:mb-24 md:mt-28">
              <div className="flex items-center gap-2 text-gold">
                <FontAwesomeIcon icon={faCrown} />
                <span>Bespoke Service</span>
              </div>
              <div className="flex items-center gap-2 text-gold">
                <FontAwesomeIcon icon={faUsers} />
                <span>Group Coordination</span>
              </div>
              <div className="flex items-center gap-2 text-gold">
                <FontAwesomeIcon icon={faShieldAlt} />
                <span>No Upfront Payment</span>
              </div>
            </div>
          </div>
          
          {/* Desktop Reservation Card - Original position */}
          <div className="hidden md:block">
            <ReservationCard />
          </div>
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
              Why Choose Our <span className="text-gold">Special Request</span> Service
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              When standard services aren't enough, our special request team creates 
              extraordinary transportation experiences tailored to your unique vision and requirements.
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

          {/* Special Services */}
          <div className="mb-20">
            <h2 className="text-4xl font-semibold mb-12 text-center">
              <span className="text-gold">Specialized</span> Transportation Services
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {specialServices.map((service, index) => (
                <div key={index} className="bg-zinc-800/30 p-8 rounded-lg border border-zinc-700/50 hover:border-gold/30 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={service.icon} className="text-gold text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                      {service.duration && <div className="text-gold text-sm font-medium">{service.duration}</div>}
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

          {/* Popular Experiences */}
          <div className="mb-20">
            <h2 className="text-4xl font-semibold mb-12 text-center">
              <span className="text-gold">Signature</span> Experiences
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularExperiences.map((experience, index) => (
                <div key={index} className="bg-zinc-800/30 p-6 rounded-lg border border-zinc-700/50 hover:border-gold/30 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <FontAwesomeIcon icon={faMapMarkedAlt} className="text-gold text-lg" />
                    <div>
                      <h3 className="font-semibold text-white">{experience.experience}</h3>
                      <div className="text-gold text-sm">{experience.duration}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-zinc-300">Experience Highlights:</h4>
                    {experience.highlights.map((highlight, idx) => (
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
              How Our <span className="text-gold">Custom Service</span> Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {serviceProcess.map((process, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-gold text-2xl font-bold">{process.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{process.title}</h3>
                  <p className="text-zinc-400">
                    {process.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Service Benefits */}
          <div className="bg-gradient-to-br from-gold/20 to-gold/5 p-8 rounded-lg border border-gold/20 mb-20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-semibold mb-6 text-gold">Special Request Benefits</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faClock} className="text-gold text-lg mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">No Time Constraints</h4>
                      <p className="text-zinc-400 text-sm">Flexible timing and duration to match your unique requirements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faGlobe} className="text-gold text-lg mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Unlimited Destinations</h4>
                      <p className="text-zinc-400 text-sm">Travel anywhere within Switzerland and neighboring countries</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faStar} className="text-gold text-lg mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Premium Experience</h4>
                      <p className="text-zinc-400 text-sm">Luxury vehicles with amenities tailored to your preferences</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-700/30">
                <h3 className="text-xl font-semibold mb-4 text-gold">What's Included</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-zinc-300">Personal consultation and planning</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-zinc-300">Custom itinerary design</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-zinc-300">Dedicated event coordination</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-zinc-300">Premium vehicle selection</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-zinc-300">Professional chauffeur team</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-zinc-300">24/7 support during event</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="mb-20">
            <h2 className="text-4xl font-semibold mb-12 text-center">
              <span className="text-gold">Transparent</span> Custom Pricing
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gold/20 to-gold/5 p-6 rounded-lg border border-gold/20">
                  <h3 className="text-xl font-semibold mb-3 text-gold">No Upfront Payment</h3>
                  <p className="text-zinc-300">
                    Submit your request with zero payment required. We'll provide a detailed quote 
                    and only proceed once you're completely satisfied with the proposal.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-gold/20 to-gold/5 p-6 rounded-lg border border-gold/20">
                  <h3 className="text-xl font-semibold mb-3 text-gold">Competitive Rates</h3>
                  <p className="text-zinc-300">
                    Our pricing is based on the complexity, duration, and specific requirements 
                    of your request. We provide detailed breakdowns with no hidden fees.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-gold/20 to-gold/5 p-6 rounded-lg border border-gold/20">
                  <h3 className="text-xl font-semibold mb-3 text-gold">Flexible Payment</h3>
                  <p className="text-zinc-300">
                    Multiple payment options available including corporate billing, 
                    installment plans for large events, and premium cryptocurrency options.
                  </p>
                </div>
              </div>
              
              <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-700/30">
                <h3 className="text-xl font-semibold mb-4 text-gold">Contact Our Specialists</h3>
                <p className="text-zinc-300 text-sm mb-6">
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
                    variant="outline"
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
          <div className="text-center bg-zinc-800/30 p-8 rounded-lg border border-zinc-700/50">
            <h2 className="text-3xl font-semibold mb-4 text-gold">Ready to Create Something Special?</h2>
            <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
              Whether it's a once-in-a-lifetime celebration or a recurring luxury service, 
              we're here to exceed your expectations with our custom transportation solutions.
            </p>
            <div className="flex justify-center">
              <Button 
                variant="secondary"
                onClick={() => document.querySelector('.reservation').scrollIntoView({ behavior: 'smooth' })}
              >
                Submit Special Request
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialRequest;