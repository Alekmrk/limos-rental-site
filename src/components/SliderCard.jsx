import { faBriefcase, faPerson } from "@fortawesome/free-solid-svg-icons";
import CapacityItem from "../pages/Home/FleetSection/CapacityItem";
import Image from "./Image";
import { Link } from "react-router-dom";

const SliderCard = ({ index, image, name, seats, luggage, chooseVehicle }) => {
  return (
    <Link to={"/vehicles"} state={name}>
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
          />
        </div>
        <h2 className="text-lg font-medium my-4 text-gray-700">{name}</h2>
        <div className="capacity-info flex gap-2">
          <CapacityItem text={seats} icon={faPerson} />
          <CapacityItem text={luggage} icon={faBriefcase} />
        </div>
      </div>
    </Link>
  );
};

export default SliderCard;
