import SectionHeading from "../../../components/SectionHeading";
import { FaCheckCircle, FaMedal, FaHeart, FaShieldAlt } from "react-icons/fa";

const FeaturesSection = () => {
  return (
    <div className="relative py-8 mt-0 bg-gradient-to-br from-cream to-warm-gray overflow-hidden">
      {/* Softer Decorative Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-royal-blue/10 to-royal-blue-light/10 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gold/10 to-cream-dark/10 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-br from-soft-gray/15 to-warm-gray/15 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container-wide relative z-10">
        {/* Harmonious Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-royal-blue/15 backdrop-blur-sm text-royal-blue-dark px-6 py-3 rounded-full text-sm font-medium mb-6 border border-royal-blue/25 shadow-md">
            <FaMedal className="text-lg" />
            <span className="text-base font-semibold">Why Choose Elite Way</span>
          </div>
          
          <SectionHeading
            title="Unmatched Excellence"
          />

          {/* Enhanced Value Proposition Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="card-base card-hover space-md text-center">
              <div className="w-16 h-16 bg-success/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-2xl text-success" />
              </div>
              <h3 className="text-card-title text-gray-700 mb-3">Swiss Precision</h3>
              <p className="text-body text-gray-600">Every detail meticulously planned for the perfect luxury experience</p>
            </div>
            
            <div className="card-base card-hover space-md text-center">
              <div className="w-16 h-16 bg-gold/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMedal className="text-2xl text-gold" />
              </div>
              <h3 className="text-card-title text-gray-700 mb-3">Unparalleled Comfort</h3>
              <p className="text-body text-gray-600">Luxurious interiors and premium amenities for the ultimate travel experience</p>
            </div>
            
            <div className="card-base card-hover space-md text-center">
              <div className="w-16 h-16 bg-info/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-2xl text-info" />
              </div>
              <h3 className="text-card-title text-gray-700 mb-3">Customer First</h3>
              <p className="text-body text-gray-600">Your comfort and satisfaction is our top priority</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
