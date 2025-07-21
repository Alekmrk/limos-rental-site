import { useEffect, useContext } from "react";
import ReservationContext from "../../contexts/ReservationContext";
import Footer from "../../components/Footer/Footer";
import Image from "../../components/Image";
import bannerImage from "../../assets/background1.jpg";
import SplitVerticalForm from "./SplitVerticalForm";

const PrototypeSplitVertical = ({ scrollUp }) => {
  const { clearReservation } = useContext(ReservationContext);

  useEffect(() => {
    scrollUp();
    clearReservation();
  }, [scrollUp, clearReservation]);

  return (
    <>
      {/* Vertical Split Layout */}
      <div className="relative mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen rounded-[1.5rem] overflow-hidden shadow-2xl">
          {/* Left Side - Form First (Different Order) */}
          <div className="bg-gradient-to-br from-cream to-warm-gray flex items-center justify-center p-8 lg:p-12 order-2 lg:order-1">
            <div className="w-full max-w-md">
              <SplitVerticalForm />
            </div>
          </div>

          {/* Right Side - Image (Different Order) */}
          <div className="relative order-1 lg:order-2">
            <Image
              src={bannerImage}
              alt="Elite Way Limo luxury chauffeur service"
              className="w-full h-full object-cover"
              imageType="banner"
              priority={true}
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20"></div>
            
            {/* Title Overlay on Right Image */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-center text-white">
                <div className="bg-black/40 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-light drop-shadow-lg mb-4">
                    <span className="text-white">Swiss</span>
                    <br />
                    <span className="text-gold font-bold">Elite Way</span>
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 drop-shadow-lg mb-6">
                    Premium Chauffeur Experience
                  </p>
                  
                  {/* Elegant Feature List */}
                  <div className="space-y-3 text-sm text-white/80">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-2 h-2 bg-gold rounded-full"></div>
                      <span>Luxury Fleet</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-2 h-2 bg-gold rounded-full"></div>
                      <span>Professional Service</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-2 h-2 bg-gold rounded-full"></div>
                      <span>Swiss Excellence</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default PrototypeSplitVertical;
