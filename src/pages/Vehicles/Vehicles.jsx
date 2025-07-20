import { useEffect, useRef } from "react";
import cars from "../../data/cars";
import SliderCard from "../../components/SliderCard";
import Button from "../../components/Button";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Vehicles = ({ scrollUp, selectedVehicle, setSelectedVehicle }) => {
  const imageRef = useRef(null);

  useEffect(() => {
    scrollUp();
  }, []);

  // Scroll to image when selected vehicle changes
  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [selectedVehicle]);

  const chooseVehicle = (name) => {
    setSelectedVehicle(cars.find((car) => car.name === name));
    // Always scroll to image when a car is selected, even if it's the same one
    if (imageRef.current) {
      imageRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  return (
    <div className="container-default text-center md:text-left mt-28">
      <h1 className="text-5xl md:text-7xl font-semibold text-gray-700">
        <span className="text-royal-blue">Our</span> Vehicles
      </h1>
      <p className="md:w-2/3 text-gray-600">
        We offer a variety of luxurious vehicles for you to choose. Select your
        vehicle of choice from our collection of luxury, premium van and business
        class vehicles.
      </p>
      <div className="grid md:grid-cols-2 gap-12 my-16">
        <div 
          ref={imageRef}
          className="bg-cream-light/90 p-4 rounded-[1rem] flex items-center border border-royal-blue/20 shadow-lg"
        >
          <img className="w-full" src={selectedVehicle.image} alt="" />
        </div>
        <div className="mt-4">
          <h2 className="text-4xl font-semibold text-royal-blue">
            {selectedVehicle.name}
          </h2>
          <p className="text-gray-600 mt-4">{selectedVehicle.detail}</p>
          <hr className="mt-4 border-royal-blue/20" />
          <h3 className="mt-8 text-2xl font-medium text-gray-700">Capacity</h3>
          <p className="mt-1 text-gray-600">
            Luggage:{" "}
            <span className="font-medium text-royal-blue">
              {selectedVehicle.luggage}
            </span>
          </p>
          <p className="mt-1 mb-12 text-gray-600">
            Seats:{" "}
            <span className="font-medium text-royal-blue">
              {selectedVehicle.seats}
            </span>
          </p>
          <Link to={"/booking"}>
            <Button variant="secondary">
              Book Now
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-white ml-4"
              />
            </Button>
          </Link>
        </div>
      </div>
      <h2 className="text-4xl font-semibold mb-6 text-royal-blue">Our Fleet</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3">
        {cars.map((car, i) => (
          <SliderCard {...car} key={i} chooseVehicle={chooseVehicle} />
        ))}
      </div>
    </div>
  );
};

export default Vehicles;
