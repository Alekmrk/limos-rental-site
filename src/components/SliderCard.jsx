import { faBriefcase, faPerson } from "@fortawesome/free-solid-svg-icons";
import CapacityItem from "../pages/Home/FleetSection/CapacityItem";
import Image from "./Image";
import { UTMLink } from "./UTMLink";

const SliderCard = ({ index, image, name, seats, luggage, chooseVehicle }) => {
  try {
    return (
    <UTMLink to={"/vehicles"} state={name}>
      <div
        onClick={() => chooseVehicle(name)}
        className={`slider-card mx-2 pb-8 cursor-pointer ${index === 0 && ""}`}
      >
        <div
          className={`car-image w-full h-[290px] flex items-center justify-center ${
            index === 0 ? "bg-royal-blue/20" : "bg-cream-light/90"
          } rounded-[1.5rem] hover:shadow-lg border border-royal-blue/20 px-8 transition-all duration-300`}
        >
          <Image
            className="car w-full transition"
            src={image}
            alt={name + " - image"}
            sizes="(max-width: 768px) 300px, (max-width: 1280px) 400px, 500px"
            imageType="car"
            priority={true}
            loading="eager"
          />
        </div>
        <div className="vehicle-info bg-cream-light/70 backdrop-blur-sm px-4 py-3 rounded-lg border border-royal-blue/15 shadow-sm my-4">
          <h2 className="text-lg font-medium text-gray-700 mb-2">{name}</h2>
          <div className="capacity-info flex flex-wrap gap-3">
            <CapacityItem text={seats} icon={faPerson} />
            <CapacityItem text={luggage} icon={faBriefcase} />
          </div>
        </div>
      </div>
    </UTMLink>
  );
  } catch (error) {
    console.error('Error in SliderCard:', error);
    return <div className="bg-red-100 p-4 rounded">Error loading car card</div>;
  }
};

export default SliderCard;
