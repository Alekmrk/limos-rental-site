import SectionHeading from "../../../components/SectionHeading";
import ServiceCard from "./ServiceCard";
import services from "../../../data/services";
import { FaQuoteLeft, FaAward, FaUsers, FaGlobeEurope, FaStar } from "react-icons/fa";
import { scrollToReservationCard } from "../../../utils/scrollUtils";

const ServicesSection = () => {
  const stats = [
    { icon: FaUsers, number: "7,500+", label: "Happy Clients" },
    { icon: FaAward, number: "13+", label: "Years Experience" },
    { icon: FaGlobeEurope, number: "35+", label: "Destinations" },
  ];

  return (
    <div className="relative bg-gradient-to-br from-cream-dark via-cream to-warm-gray py-24 mt-0">
      {/* Softer Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234169E1' fill-opacity='0.2'%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3C/g%3E%3Cg fill='%23D4AF37' fill-opacity='0.15'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3Ccircle cx='60' cy='20' r='2'/%3E%3Ccircle cx='20' cy='60' r='2'/%3E%3Ccircle cx='60' cy='60' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="container-wide relative z-10">
        {/* Harmonious Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-royal-blue/15 backdrop-blur-sm text-royal-blue-dark px-6 py-3 rounded-full text-sm font-medium mb-6 border border-royal-blue/25 shadow-md">
            <FaAward className="text-lg" />
            <span className="text-base font-semibold">Premium Services</span>
          </div>

          <SectionHeading
            title="Our Exclusive Services"
          />

          {/* Softer Quote Section */}
          <div className="max-w-3xl mx-auto mt-12 p-8 bg-darker-cream/90 backdrop-blur-sm rounded-2xl shadow-lg border border-royal-blue/15">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-royal-blue/15 rounded-full flex items-center justify-center">
                <FaQuoteLeft className="text-xl text-royal-blue-dark" />
              </div>
            </div>
            <p className="text-gray-600 italic text-xl leading-relaxed">
              "My flight was delayed by 2 hours, but the driver was tracking it and adjusted pickup automatically. 
              He was waiting with a sign when I finally arrived at 11 PM. Professional service when I needed it most."
            </p>
            <div className="text-base text-royal-blue-dark mt-4 font-medium">
              Marcus Chen
            </div>
            <div className="text-gray-600 text-sm">Business Executive, Zurich</div>
          </div>
        </div>

        {/* Harmonious Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 bg-cream-light/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-royal-blue/15 hover:border-royal-blue/25 transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-royal-blue/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="text-2xl text-royal-blue-dark" />
              </div>
              <div className="text-4xl font-bold text-gray-700 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="services grid gap-10 lg:grid-cols-2 xl:grid-cols-2 justify-center max-w-7xl mx-auto hidden">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl"
            >
              <ServiceCard {...service} />
            </div>
          ))}
        </div>

        {/* Harmonious Call to Action */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-cream-light/98 via-darker-cream/95 to-cream-light/98 backdrop-blur-sm p-10 rounded-3xl shadow-lg border border-royal-blue/20 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FaStar className="text-gold text-xl" />
              <FaStar className="text-gold text-xl" />
              <FaStar className="text-gold text-xl" />
              <FaStar className="text-gold text-xl" />
              <FaStar className="text-gold text-xl" />
            </div>
            <h3 className="text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-royal-blue-dark to-gold bg-clip-text text-transparent">
              Ready to Experience Luxury?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
              Join thousands of satisfied clients who trust Elite Way Limo for their
              transportation needs. Book your premium experience today.
            </p>
            <button 
              onClick={scrollToReservationCard}
              className="bg-gradient-to-r from-royal-blue-dark to-royal-blue text-white hover:from-royal-blue hover:to-royal-blue-light px-10 py-4 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-lg"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
