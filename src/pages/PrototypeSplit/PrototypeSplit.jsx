import { useEffect, useContext } from "react";
import ReservationContext from "../../contexts/ReservationContext";
import Footer from "../../components/Footer/Footer";
import Image from "../../components/Image";
import bannerImage from "../../assets/bannerNew(u169).jpg";
import SplitReservationForm from "./SplitReservationForm";

const PrototypeSplit = ({ scrollUp }) => {
  const { clearReservation } = useContext(ReservationContext);

  useEffect(() => {
    scrollUp();
    clearReservation();
  }, [scrollUp, clearReservation]);

  return (
    <>
      {/* Split Screen Layout */}
      <div className="relative mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen rounded-[1.5rem] overflow-hidden">
          {/* Left Side - Image */}
          <div className="relative">
            <Image
              src={bannerImage}
              alt="Elite Way Limo luxury chauffeur service"
              className="w-full h-full object-cover"
              imageType="banner"
              priority={true}
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
            
            {/* Title Overlay on Image */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-center text-white">
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-lg mb-4">
                    <span className="text-white">Elite Way</span>
                    <br />
                    <span className="text-gold">Limo Service</span>
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 drop-shadow-lg">
                    Switzerland's Premier Chauffeur Experience
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-gradient-to-br from-warm-gray to-cream-light flex items-center justify-center p-8 lg:p-12">
            <div className="w-full max-w-md">
              <SplitReservationForm />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default PrototypeSplit;
