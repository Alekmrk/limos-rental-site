import { useEffect, useContext } from "react";
import ReservationContext from "../../contexts/ReservationContext";
import Footer from "../../components/Footer/Footer";
import Image from "../../components/Image";
import bannerImage from "../../assets/bannerNew(u169).jpg";
import CenteredReservationCard from "./CenteredReservationCard";

const PrototypeCentered = ({ scrollUp }) => {
  const { clearReservation } = useContext(ReservationContext);

  useEffect(() => {
    scrollUp();
    clearReservation();
  }, [scrollUp, clearReservation]);

  return (
    <>
      {/* Full Screen Banner with Centered Overlay */}
      <div className="relative">
        <div className="relative w-full rounded-[1.5rem] mt-16 overflow-hidden min-h-screen">
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
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40"></div>
          </div>

          {/* Centered Content */}
          <div className="relative z-20 flex items-center justify-center h-full px-8">
            <div className="text-center max-w-5xl">
              {/* Title */}
              <div className="mb-12">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-semibold drop-shadow-2xl mb-6">
                  <span className="text-white drop-shadow-lg">Elite Way</span>
                  <br />
                  <span className="text-gold drop-shadow-lg">Limo Service</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg font-light">
                  Switzerland's Premier Chauffeur Experience
                </p>
              </div>

              {/* Centered Reservation Card */}
              <CenteredReservationCard />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default PrototypeCentered;
