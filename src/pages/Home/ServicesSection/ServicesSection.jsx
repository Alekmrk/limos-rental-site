import SectionHeading from "../../../components/SectionHeading";
import ServiceCard from "./ServiceCard";
import services from "../../../data/services";
import { FaQuoteLeft, FaAward, FaUsers, FaGlobeEurope } from "react-icons/fa";

const ServicesSection = () => {
  const stats = [
    { icon: FaUsers, number: "10,000+", label: "Happy Clients" },
    { icon: FaAward, number: "15+", label: "Years Experience" },
    { icon: FaGlobeEurope, number: "50+", label: "Destinations" },
  ];

  return (
    <div className="relative bg-zinc-900 py-20 mt-0">
      {/* Decorative Background Pattern - Dark Theme */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="container-default relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-zinc-800/60 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-zinc-700/50">
            <FaAward />
            <span>Premium Services</span>
          </div>

          <SectionHeading
            title="Our Exclusive Services"
            text="We invite you to experience our world-class services, backed by our personal guarantee of complete satisfaction and luxury beyond expectations."
          />

          {/* Quote - Dark Theme */}
          <div className="max-w-2xl mx-auto mt-8 p-6 bg-zinc-800/60 backdrop-blur-sm rounded-lg shadow-lg border border-zinc-700/50">
            <FaQuoteLeft className="text-2xl text-yellow-400 mb-3 mx-auto" />
            <p className="text-gray-300 italic text-lg">
              "Excellence is not a skill, it's an attitude. Every journey with Elite
              Way Limo is crafted to exceed your expectations."
            </p>
            <div className="text-sm text-gray-400 mt-3">
              - Elite Way Limo Promise
            </div>
          </div>
        </div>

        {/* Stats Section - Dark Theme */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-zinc-800/60 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-zinc-700/50"
            >
              <stat.icon className="text-3xl text-yellow-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">
                {stat.number}
              </div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Enhanced Services Grid */}
        <div className="services grid gap-8 lg:grid-cols-2 justify-center">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="transform hover:scale-[1.02] transition-transform duration-300"
            >
              <ServiceCard {...service} />
            </div>
          ))}
        </div>

        {/* Call to Action - Dark Theme */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 text-white p-8 rounded-2xl shadow-xl border border-zinc-600/50">
            <h3 className="text-2xl font-bold mb-4 text-yellow-400">
              Ready to Experience Luxury?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied clients who trust Elite Way Limo for their
              transportation needs. Book your premium experience today.
            </p>
            <button className="bg-yellow-400 text-black hover:bg-yellow-300 px-8 py-3 rounded-lg font-semibold transition-colors duration-300 shadow-lg">
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
