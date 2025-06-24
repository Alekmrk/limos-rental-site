import SectionHeading from "../../../components/SectionHeading";
import CarSlider from "./CarSlider";

const FleetSection = ({ setSelectedVehicle }) => {
  return (
    <div className="mt-32 overflow-x-hidden">
      <div className="container-default">
        <SectionHeading
          title="Our Fleet"
          text="We offer an extensive fleet of vehicles including sedans, limousines and crossovers"
        />
      </div>
      <CarSlider setSelectedVehicle={setSelectedVehicle} />
    </div>
  );
};

export default FleetSection;
