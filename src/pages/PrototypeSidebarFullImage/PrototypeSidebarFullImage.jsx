import { useEffect } from "react";
import SidebarFullImageForm from "./SidebarFullImageForm";
import Image from "../../components/Image";
import bannerImage from "../../assets/luxury-car-speeds-by-modern-building-dusk-generative-ai.jpg";

const PrototypeSidebarFullImage = ({ scrollUp }) => {
  useEffect(() => {
    scrollUp && scrollUp();
  }, [scrollUp]);

  return (
    <div className="min-h-screen">
      {/* Full Page Layout with Image Background */}
      <div className="relative w-full min-h-screen flex">
        {/* Full Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImage}
            alt="Elite Way Limo luxury transportation"
            className="w-full h-full object-cover"
            imageType="banner"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/60"></div>
        </div>

        {/* Left Side - Logo and Title Overlay */}
        <div className="flex-1 relative z-10 flex flex-col justify-center items-center text-white p-8">
          <div className="text-center max-w-lg">
            <h1 className="text-6xl md:text-8xl font-light mb-6 drop-shadow-2xl">
              Elite Way
            </h1>
            <p className="text-2xl md:text-3xl font-light opacity-90 drop-shadow-lg mb-4">
              Swiss Luxury
            </p>
            <p className="text-xl md:text-2xl font-light opacity-80 drop-shadow-lg mb-8">
              Transportation
            </p>
            
            {/* Feature Highlights */}
            <div className="space-y-4 opacity-80">
              <div className="flex items-center justify-center gap-4">
                <div className="w-3 h-3 bg-gold rounded-full"></div>
                <span className="text-lg">Premium Service</span>
              </div>
              <div className="flex items-center justify-center gap-4">
                <div className="w-3 h-3 bg-gold rounded-full"></div>
                <span className="text-lg">Professional Chauffeurs</span>
              </div>
              <div className="flex items-center justify-center gap-4">
                <div className="w-3 h-3 bg-gold rounded-full"></div>
                <span className="text-lg">24/7 Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Reservation Form */}
        <div className="w-full max-w-lg relative z-20 bg-white/95 backdrop-blur-lg flex items-center justify-center p-8 shadow-2xl">
          <SidebarFullImageForm />
        </div>
      </div>

      {/* Simple Footer - positioned over the image */}
      <footer className="relative z-30 bg-gray-900/90 backdrop-blur-sm text-white py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-300">&copy; 2024 Elite Way Limo. Premium transportation services in Switzerland.</p>
        </div>
      </footer>
    </div>
  );
};

export default PrototypeSidebarFullImage;
