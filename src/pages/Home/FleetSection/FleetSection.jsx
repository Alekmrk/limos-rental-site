import SectionHeading from "../../../components/SectionHeading";
import CarSlider from "./CarSlider";
import { FaCar, FaStar, FaShieldAlt } from "react-icons/fa";

const FleetSection = ({ setSelectedVehicle }) => {
  return (
    <div className="mt-32 overflow-x-hidden">
      {/* Harmonious Background with Soft Gradient and a Large Blurred Gold Accent */}
      <div className="relative bg-gradient-to-br from-warm-gray via-cream to-cream-light py-24">
        {/* Decorative Gold Accent Blob */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-gold/30 to-cream/0 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
        {/* Decorative Blue Accent Blob */}
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-gradient-to-tr from-royal-blue/20 to-cream/0 rounded-full blur-2xl opacity-30 pointer-events-none"></div>

        <div className="container-wide relative z-10">
          {/* Harmonious Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-4 bg-royal-blue/20 backdrop-blur-sm text-royal-blue-dark px-8 py-4 rounded-2xl border border-royal-blue/30 shadow-lg mb-8">
              <FaCar className="text-2xl" />
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-royal-blue-dark">
                Our Luxury Fleet
              </h2>
            </div>

            {/* Softer Fleet Features */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-12 text-gray-600">
              <div className="flex items-center gap-3 bg-cream-light/90 backdrop-blur-sm px-6 py-3 rounded-full border border-royal-blue/20 shadow-md">
                <FaStar className="text-gold text-lg" />
                <span className="font-medium">Premium Selection</span>
              </div>
              <div className="flex items-center gap-3 bg-cream-light/90 backdrop-blur-sm px-6 py-3 rounded-full border border-royal-blue/20 shadow-md">
                <FaShieldAlt className="text-emerald-500 text-lg" />
                <span className="font-medium">Fully Maintained</span>
              </div>
            </div>
          </div>

          <CarSlider setSelectedVehicle={setSelectedVehicle} />
        </div>
      </div>
    </div>
  );
};

export default FleetSection;
