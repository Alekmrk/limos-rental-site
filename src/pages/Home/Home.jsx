import { useEffect } from "react";
import BannerSection from "./BannerSection/BannerSection";
import FeaturesSection from "./FeaturesSection/FeaturesSection";
import FleetSection from "./FleetSection/FleetSection";
import ServicesSection from "./ServicesSection/ServicesSection";

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
    </>
  );
};

export default Home;
