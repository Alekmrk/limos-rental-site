import features from "../pages/Home/FeaturesSection/features";
import FeatureItem from "../pages/Home/FeaturesSection/FeatureItem";
import SectionHeading from "./SectionHeading";
import { FaStar, FaShieldAlt } from "react-icons/fa";

const TestimonialStatsSection = () => {
  return (
    <div className="relative py-24 mt-0 bg-gradient-to-br from-cream to-warm-gray overflow-hidden">
      {/* Softer Decorative Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-royal-blue/10 to-royal-blue-light/10 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gold/10 to-cream-dark/10 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-br from-soft-gray/15 to-warm-gray/15 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container-wide relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-primary-gold/15 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-full text-sm font-medium mb-6 border border-primary-gold/25 shadow-md">
            <FaShieldAlt className="text-lg text-primary-gold" />
            <span className="text-base font-semibold">Trusted Excellence</span>
          </div>
          
          <SectionHeading
            title="Why Elite Way Leads"
          />
          
          <p className="text-gray-700 text-lg max-w-2xl mx-auto mt-4">
            From seamless booking to proven results, discover what sets us apart and why thousands trust us for their luxury transportation needs.
          </p>
        </div>
        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-24">
          {features.map((feature, index) => (
            <div key={feature.id} className="group h-full">
              <div className="relative h-full">
                {/* Softer decorative border */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-gold/15 to-primary-gold/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-102"></div>
                <div className="relative bg-cream-light/90 backdrop-blur-sm p-1 rounded-xl h-full">
                  <div className="bg-cream-light/95 rounded-xl p-6 shadow-md group-hover:shadow-lg transition-all duration-300 border border-primary-gold/15 group-hover:border-primary-gold/25 h-full min-h-[280px] flex">
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
        <div className="text-center">
          <div className="bg-gradient-to-r from-cream-light/98 via-darker-cream/95 to-cream-light/98 backdrop-blur-sm p-10 md:p-16 rounded-3xl shadow-lg border border-royal-blue/20 max-w-6xl mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center gap-1 text-4xl text-gold mb-6">
                ★★★★★
              </div>
              <blockquote className="text-xl md:text-2xl lg:text-3xl font-light italic mb-8 leading-relaxed text-gray-700">
                "Excellence is not a skill, it's an attitude. Every journey with Elite Way Limo is crafted to exceed your expectations."
              </blockquote>
              <div className="text-royal-blue-dark font-semibold text-lg">- Elite Way Limo Promise</div>
              
              <div className="mt-12 pt-8 border-t border-royal-blue/20">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div className="bg-royal-blue/8 rounded-xl p-6 border border-royal-blue/15">
                    <div className="text-3xl font-bold text-royal-blue-dark">4.9/5</div>
                    <div className="text-gray-700 text-base mt-2">Average Rating</div>
                  </div>
                  <div className="bg-emerald-500/8 rounded-xl p-6 border border-emerald-500/15">
                    <div className="text-3xl font-bold text-emerald-600">98%</div>
                    <div className="text-gray-700 text-base mt-2">Customer Satisfaction</div>
                  </div>
                  <div className="bg-gold/8 rounded-xl p-6 border border-gold/15">
                    <div className="text-3xl font-bold text-gold">24/7</div>
                    <div className="text-gray-700 text-base mt-2">Customer Support</div>
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

export default TestimonialStatsSection;
