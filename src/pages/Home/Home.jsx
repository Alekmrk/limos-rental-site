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
