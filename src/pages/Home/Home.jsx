import { useEffect } from "react";
import BannerSection from "./BannerSection/BannerSection";
import FeaturesSection from "./FeaturesSection/FeaturesSection";
import FleetSection from "./FleetSection/FleetSection";
import ServicesSection from "./ServicesSection/ServicesSection";
import PricingTransparency from "../../components/PricingTransparency";
import EventsSection from "../../components/EventsSection";
import TestimonialsSection from "../../components/TestimonialsSection";

const Home = ({ scrollUp, setSelectedVehicle }) => {
  useEffect(() => {
    scrollUp();
  }, []);

  return (
    <>
      <BannerSection />
      <ServicesSection />
      <FleetSection setSelectedVehicle={setSelectedVehicle} />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingTransparency />
      <EventsSection />
    </>
  );
};

export default Home;
