import { useEffect, useContext } from "react";
import ReservationContext from "../../contexts/ReservationContext";
import Footer from "../../components/Footer/Footer";
import Image from "../../components/Image";
import bannerImage from "../../assets/bannerNew(u169).jpg";
import HorizontalReservationBar from "./HorizontalReservationBar";

const PrototypeHorizontal = ({ scrollUp }) => {
  const { clearReservation } = useContext(ReservationContext);

  useEffect(() => {
    scrollUp();
    clearReservation();
  }, [scrollUp, clearReservation]);

  return (
    <>
      {/* Banner with Horizontal Reservation Bar */}
      <div className="relative">
        <div className="relative w-full rounded-[1.5rem] mt-16 overflow-hidden min-h-[80vh]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={bannerImage}
              alt="Elite Way Limo luxury chauffeur service"
              className="w-full h-full object-cover object-center"
              imageType="banner"
              priority={true}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40"></div>
          </div>

          {/* Title Content */}
          <div className="relative z-20 flex items-center justify-center h-full px-8">
            <div className="text-center max-w-4xl">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-black/15 backdrop-blur-sm rounded-2xl transform translate-x-1 translate-y-1"></div>
                <div className="relative bg-white/20 backdrop-blur-md rounded-2xl px-8 py-6 border border-white/30 shadow-2xl">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold drop-shadow-lg">
                    <span className="text-royal-blue drop-shadow-lg">Switzerland's Elite</span>{" "}
                    <span className="text-gold drop-shadow-lg">Chauffeur Service</span>
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal Reservation Bar at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 z-30">
            <HorizontalReservationBar />
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default PrototypeHorizontal;
