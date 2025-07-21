import { useEffect } from "react";
import FloatingReservationCard from "./FloatingReservationCard";
import Image from "../../components/Image";
import bannerImage from "../../assets/background1.jpg";

const PrototypeFloating = ({ scrollUp }) => {
  useEffect(() => {
    scrollUp && scrollUp();
  }, [scrollUp]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-24 h-24 bg-royal-blue/10 rounded-full animate-float"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gold/15 rounded-full animate-float-delay"></div>
          <div className="absolute bottom-1/3 left-1/5 w-32 h-32 bg-white/5 rounded-full animate-float-slow"></div>
        </div>

        {/* Content */}
        <div className="relative z-20 h-full flex flex-col">
          {/* Top Title */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center px-8">
              <h1 className="text-6xl md:text-8xl font-light text-white mb-6 drop-shadow-2xl">
                Elite Way
              </h1>
              <p className="text-xl md:text-3xl text-white/80 font-light drop-shadow-lg">
                Swiss Luxury Transportation
              </p>
            </div>
          </div>

          {/* Floating Reservation Card */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-8">
            <FloatingReservationCard />
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">&copy; 2024 Elite Way Limo. Premium transportation services in Switzerland.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 8s ease-in-out infinite 2s;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite 1s;
        }
      `}</style>
    </div>
  );
};

export default PrototypeFloating;
