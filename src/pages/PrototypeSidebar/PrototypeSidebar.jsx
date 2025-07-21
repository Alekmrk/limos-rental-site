import { useEffect } from "react";
import SidebarReservationForm from "./SidebarReservationForm";
import Image from "../../components/Image";
import bannerImage from "../../assets/luxury-car-speeds-by-modern-building-dusk-generative-ai.jpg";

const PrototypeSidebar = ({ scrollUp }) => {
  useEffect(() => {
    scrollUp && scrollUp();
  }, [scrollUp]);

  return (
    <div className="min-h-screen">
      {/* Main Section */}
      <div className="relative w-full h-screen flex">
        {/* Left Side - Image */}
        <div className="flex-1 relative overflow-hidden">
          <Image
            src={bannerImage}
            alt="Elite Way Limo luxury transportation"
            className="w-full h-full object-cover"
            imageType="banner"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
          
          {/* Logo and Title Overlay */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8">
            <div className="text-center">
              <h1 className="text-6xl md:text-8xl font-light mb-4 drop-shadow-2xl">
                Elite Way
              </h1>
              <p className="text-2xl md:text-3xl font-light opacity-90 drop-shadow-lg">
                Swiss Luxury
              </p>
              <p className="text-xl md:text-2xl font-light opacity-80 drop-shadow-lg">
                Transportation
              </p>
            </div>
            
            {/* Feature Icons */}
            <div className="absolute bottom-16 left-8 right-8">
              <div className="flex justify-center space-x-8 opacity-80">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm">Premium</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm">Punctual</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <p className="text-sm">Professional</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Reservation Form */}
        <div className="w-full max-w-lg bg-gray-50 flex items-center justify-center p-8">
          <SidebarReservationForm />
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

export default PrototypeSidebar;
