import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import ReservationContext from "../../contexts/ReservationContext";
import BannerSection from "./BannerSection/BannerSection";
import FeaturesSection from "./FeaturesSection/FeaturesSection";
import FleetSection from "./FleetSection/FleetSection";
import ServicesSection from "./ServicesSection/ServicesSection";
import PricingTransparency from "../../components/PricingTransparency";
import EventsSection from "../../components/EventsSection";
import TestimonialsSection from "../../components/TestimonialsSection";
import TestimonialStatsSection from "../../components/TestimonialStatsSection";

const Home = ({ scrollUp, setSelectedVehicle }) => {
  const { clearReservation } = useContext(ReservationContext);

  useEffect(() => {
    scrollUp();
    // Clear any previous reservation data when user visits homepage
    clearReservation();
  }, [scrollUp, clearReservation]);

  return (
    <>
      {/* Development Notice - Remove in production */}
      <div className="fixed top-20 right-4 z-50">
        <Link 
          to="/prototypes" 
          className="bg-royal-blue text-white px-4 py-2 rounded-lg shadow-lg hover:bg-royal-blue-dark transition-colors text-sm font-medium"
        >
          View Prototypes
        </Link>
      </div>
      
      <BannerSection />
      <ServicesSection />
      <FeaturesSection />
      <FleetSection setSelectedVehicle={setSelectedVehicle} />
      <TestimonialStatsSection />
      <PricingTransparency />
      <EventsSection />
    </>
  );
};

export default Home;
