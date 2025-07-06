import SectionHeading from "../../../components/SectionHeading";
import features from "./features";
import FeatureItem from "./FeatureItem";
import { FaCheckCircle, FaMedal, FaHeart, FaShieldAlt } from "react-icons/fa";

const FeaturesSection = () => {
  return (
    <div className="relative py-24 mt-0 bg-gradient-to-br from-cream to-warm-gray overflow-hidden">
      {/* Softer Decorative Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-royal-blue/10 to-royal-blue-light/10 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gold/10 to-cream-dark/10 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-br from-soft-gray/15 to-warm-gray/15 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container-wide relative z-10">
        {/* Harmonious Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-royal-blue/15 backdrop-blur-sm text-royal-blue-dark px-6 py-3 rounded-full text-sm font-medium mb-6 border border-royal-blue/25 shadow-md">
            <FaMedal className="text-lg" />
            <span className="text-base font-semibold">Why Choose Elite Way</span>
          </div>
          
          <SectionHeading
            title="Unmatched Excellence"
          />

          {/* Softer Value Proposition Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 mb-20">
            <div className="p-8 bg-cream-light/95 backdrop-blur-sm rounded-2xl border border-royal-blue/15 hover:border-royal-blue/25 transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg">
              <div className="w-16 h-16 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-2xl text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-700 mb-3 text-lg">Guaranteed Quality</h3>
              <p className="text-gray-600">Every service backed by our 100% satisfaction guarantee</p>
            </div>
            
            <div className="p-8 bg-cream-light/95 backdrop-blur-sm rounded-2xl border border-royal-blue/15 hover:border-royal-blue/25 transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg">
              <div className="w-16 h-16 bg-gold/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMedal className="text-2xl text-gold" />
              </div>
              <h3 className="font-semibold text-gray-700 mb-3 text-lg">Award Winning</h3>
              <p className="text-gray-600">Recognized excellence in luxury transportation</p>
            </div>
            
            <div className="p-8 bg-cream-light/95 backdrop-blur-sm rounded-2xl border border-royal-blue/15 hover:border-royal-blue/25 transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg">
              <div className="w-16 h-16 bg-pink-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-2xl text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-700 mb-3 text-lg">Customer First</h3>
              <p className="text-gray-600">Your comfort and satisfaction is our top priority</p>
            </div>
          </div>
        </div>

        {/* Softer Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div key={feature.id} className="group">
              <div className="relative">
                {/* Softer decorative border */}
                <div className="absolute inset-0 bg-gradient-to-r from-royal-blue/15 to-gold/15 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-102"></div>
                <div className="relative bg-cream-light/90 backdrop-blur-sm p-1 rounded-xl">
                  <div className="bg-cream-light/95 rounded-xl p-6 shadow-md group-hover:shadow-lg transition-all duration-300 border border-royal-blue/15 group-hover:border-royal-blue/25">
                    <FeatureItem
                      key={feature.id}
                      icon={feature.featureIcon}
                      heading={feature.heading}
                      text={feature.text}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Harmonious Bottom Section */}
        <div className="mt-24 text-center">
          <div className="bg-gradient-to-r from-cream-light/98 via-darker-cream/95 to-cream-light/98 backdrop-blur-sm p-10 md:p-16 rounded-3xl shadow-lg border border-royal-blue/20 max-w-6xl mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center gap-1 text-4xl text-gold mb-6">
                ★★★★★
              </div>
              <blockquote className="text-xl md:text-2xl lg:text-3xl font-light italic mb-8 leading-relaxed text-gray-600">
                "My flight was delayed by 2 hours, but the driver was tracking it and adjusted pickup automatically. 
                He was waiting with a sign when I finally arrived at 11 PM. Professional service when I needed it most."
              </blockquote>
              <div className="text-royal-blue-dark font-semibold text-lg">Marcus Chen</div>
              <div className="text-gray-600 text-base">Business Executive, Geneva</div>
              
              <div className="mt-12 pt-8 border-t border-royal-blue/20">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div className="bg-royal-blue/8 rounded-xl p-6 border border-royal-blue/15">
                    <div className="text-3xl font-bold text-royal-blue-dark">4.9/5</div>
                    <div className="text-gray-600 text-base mt-2">Average Rating</div>
                  </div>
                  <div className="bg-emerald-500/8 rounded-xl p-6 border border-emerald-500/15">
                    <div className="text-3xl font-bold text-emerald-600">98%</div>
                    <div className="text-gray-600 text-base mt-2">Customer Satisfaction</div>
                  </div>
                  <div className="bg-gold/8 rounded-xl p-6 border border-gold/15">
                    <div className="text-3xl font-bold text-gold">24/7</div>
                    <div className="text-gray-600 text-base mt-2">Customer Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
