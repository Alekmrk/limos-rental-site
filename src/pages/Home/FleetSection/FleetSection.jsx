import SectionHeading from "../../../components/SectionHeading";
import CarSlider from "./CarSlider";
import { FaCar, FaStar, FaShieldAlt } from "react-icons/fa";

const FleetSection = ({ setSelectedVehicle }) => {
  return (
    <div className="mt-32 overflow-x-hidden">
      {/* Harmonious Background with Softer Tones */}
      <div className="relative bg-gradient-to-br from-warm-gray via-cream to-cream-light py-24">
        {/* Softer Decorative Elements */}
        <div className="absolute inset-0 opacity-12">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234169E1' fill-opacity='0.3'%3E%3Cpath d='M20 20h60v60H20z' stroke='%234169E1' stroke-width='1' fill='none'/%3E%3C/g%3E%3Cg fill='%23D4AF37' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3Ccircle cx='70' cy='70' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="container-wide relative z-10">
          {/* Harmonious Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-royal-blue/15 backdrop-blur-sm text-royal-blue-dark px-6 py-3 rounded-full text-sm font-medium mb-6 border border-royal-blue/25 shadow-md">
              <FaCar className="text-lg" />
              <span className="text-base font-semibold">Premium Fleet</span>
            </div>

            <SectionHeading
              title="Our Luxury Fleet"
              text="We offer an extensive fleet of premium vehicles including executive sedans, luxury limousines and premium crossovers, each maintained to the highest standards"
            />

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
