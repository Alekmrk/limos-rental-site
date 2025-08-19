import SectionHeading from "../../../components/SectionHeading";
import CarSlider from "./CarSlider";
import { FaCar, FaStar, FaShieldAlt } from "react-icons/fa";

const FleetSection = ({ setSelectedVehicle }) => {
  return (
    <div className="overflow-x-hidden">
      {/* Harmonious Background with Soft Gradient and a Large Blurred Gold Accent */}
      <div className="relative bg-gradient-to-br from-warm-gray via-cream to-cream-light py-8">
        {/* Decorative Gold Accent Blob */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-gold/30 to-cream/0 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
        {/* Decorative Blue Accent Blob */}
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-gradient-to-tr from-royal-blue/20 to-cream/0 rounded-full blur-2xl opacity-30 pointer-events-none"></div>

        <div className="container-wide relative z-10">
          {/* Harmonious Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-primary-gold/15 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-2xl border border-primary-gold/30 shadow-lg mb-4">
              <FaCar className="text-xl md:text-2xl text-primary-gold" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-700">
                Our Luxury Fleet
              </h2>
            </div>

            {/* Softer Fleet Features */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 text-gray-700">
              <div className="flex items-center gap-2 bg-cream-light/90 backdrop-blur-sm px-3 py-1 rounded-full border border-primary-gold/20 shadow-md">
                <FaStar className="text-primary-gold text-sm md:text-lg" />
                <span className="font-medium text-sm md:text-base">Premium Selection</span>
              </div>
              <div className="flex items-center gap-2 bg-cream-light/90 backdrop-blur-sm px-3 py-1 rounded-full border border-primary-gold/20 shadow-md">
                <FaShieldAlt className="text-emerald-500 text-sm md:text-lg" />
                <span className="font-medium text-sm md:text-base">Fully Maintained</span>
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
