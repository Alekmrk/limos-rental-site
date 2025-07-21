import { useEffect } from "react";
import HybridReservationCard from "./HybridReservationCard";
import Image from "../../components/Image";
import bannerImage from "../../assets/banner-image.jpg";

const PrototypeHybrid = ({ scrollUp }) => {
  useEffect(() => {
    scrollUp && scrollUp();
  }, [scrollUp]);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Full Banner */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImage}
            alt="Elite Way Limo luxury transportation"
            className="w-full h-full object-cover"
            imageType="banner"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40"></div>
        </div>

        {/* Centered Content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full px-8">
          {/* Main Title - Centered */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
              Elite Way
            </h1>
            <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg">
              Luxury Transportation in Switzerland
            </p>
          </div>

          {/* Centered Card with Horizontal Layout */}
          <div className="w-full max-w-6xl">
            <HybridReservationCard />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-1/4 left-10 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-20 w-12 h-12 bg-royal-blue/20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-1/4 left-20 w-20 h-20 bg-gold/15 rounded-full animate-ping"></div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">&copy; 2024 Elite Way Limo. Premium transportation services in Switzerland.</p>
        </div>
      </footer>
    </div>
  );
};

export default PrototypeHybrid;
