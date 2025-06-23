import SectionHeading from "../../../components/SectionHeading";
import features from "./features";
import FeatureItem from "./FeatureItem";
import { FaCheckCircle, FaMedal, FaHeart } from "react-icons/fa";

const FeaturesSection = () => {
  return (
    <div className="relative py-20 mt-0 bg-zinc-800 overflow-hidden">
      {/* Decorative Background Elements - Dark Theme */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-zinc-700/30 to-zinc-600/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-yellow-400/20 to-yellow-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-br from-zinc-600/30 to-zinc-700/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container-default relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-zinc-700/60 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-zinc-600/50">
            <FaMedal />
            <span>Why Choose Elite Way</span>
          </div>
          
          <SectionHeading
            title="Unmatched Excellence"
            text="At Elite Way we pride ourselves in delivering comprehensive services that fulfill all of your luxury transportation needs with first-rate customer care and attention to detail."
          />

          {/* Value Proposition Cards - Dark Theme */}
          <div className="grid md:grid-cols-3 gap-6 mt-12 mb-16">
            <div className="p-6 bg-gradient-to-br from-zinc-700/60 to-zinc-600/60 rounded-xl border border-zinc-600/50">
              <FaCheckCircle className="text-2xl text-green-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Guaranteed Quality</h3>
              <p className="text-sm text-gray-300">Every service backed by our 100% satisfaction guarantee</p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-zinc-700/60 to-zinc-600/60 rounded-xl border border-zinc-600/50">
              <FaMedal className="text-2xl text-yellow-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Award Winning</h3>
              <p className="text-sm text-gray-300">Recognized excellence in luxury transportation</p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-zinc-700/60 to-zinc-600/60 rounded-xl border border-zinc-600/50">
              <FaHeart className="text-2xl text-pink-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Customer First</h3>
              <p className="text-sm text-gray-300">Your comfort and satisfaction is our top priority</p>
            </div>
          </div>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, index) => (
            <div key={feature.id} className="group">
              <div className="relative">
                {/* Decorative border */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/50 to-yellow-300/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-105"></div>
                <div className="relative bg-zinc-800 p-1 rounded-lg">
                  <div className="bg-zinc-800/80 rounded-lg p-6 shadow-lg group-hover:shadow-xl transition-all duration-300 border border-zinc-700/50">
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

        {/* Bottom Section with Testimonial - Dark Theme */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-zinc-900 to-black text-white p-8 md:p-12 rounded-3xl shadow-2xl border border-zinc-700/50">
            <div className="max-w-4xl mx-auto">
              <div className="text-6xl text-yellow-400 mb-4">★★★★★</div>
              <blockquote className="text-xl md:text-2xl font-light italic mb-6">
                "Elite Way Limo transformed our wedding day into an unforgettable experience. 
                The attention to detail and luxury service exceeded all our expectations."
              </blockquote>
              <div className="text-yellow-400 font-semibold">Sarah & Michael</div>
              <div className="text-gray-300 text-sm">Wedding Clients, Zurich</div>
              
              <div className="mt-8 pt-8 border-t border-zinc-700">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">4.9/5</div>
                    <div className="text-gray-300 text-sm">Average Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">98%</div>
                    <div className="text-gray-300 text-sm">Customer Satisfaction</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">24/7</div>
                    <div className="text-gray-300 text-sm">Customer Support</div>
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
