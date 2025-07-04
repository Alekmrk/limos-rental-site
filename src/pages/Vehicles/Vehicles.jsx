import { useEffect } from "react";
import cars from "../../data/cars";
import SliderCard from "../../components/SliderCard";
import Button from "../../components/Button";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Vehicles = ({ scrollUp, selectedVehicle, setSelectedVehicle }) => {
  useEffect(() => {
    scrollUp();
  }, []);

  const chooseVehicle = (name) => {
    setSelectedVehicle(cars.find((car) => car.name === name));
  };

  return (
    <div className="container-default text-center md:text-left mt-28">
      <h1 className="text-5xl md:text-7xl font-semibold">Vehicles</h1>
      <p className="md:w-2/3 text-zinc-600">
        We offer a variety of luxurious vehicles for you to choose. Select your
        vehicle of choice from our collection of luxury, crossover and business
        class vehicles.
      </p>
      <div className="grid md:grid-cols-2 gap-12 my-16">
        <div className="bg-accent/40 p-4 rounded-[1rem] flex items-center">
          <img className="w-full" src={selectedVehicle.image} alt="" />
        </div>
        <div className="mt-4">
          <h2 className="text-4xl font-semibold">{selectedVehicle.name}</h2>
          <p className="text-zinc-600 mt-4">{selectedVehicle.detail}</p>
          <hr className="mt-4" />
          <h3 className="mt-8 text-2xl font-medium">Capacity</h3>
          <p className="mt-1">
            Luggage:{" "}
            <span className="font-medium">{selectedVehicle.luggage}</span>
          </p>
          <p className="mt-1 mb-12">
            Seats: <span className="font-medium">{selectedVehicle.seats}</span>
          </p>
          <Link to={"/"}>
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
      <h2 className="text-4xl font-semibold mb-6">Our Fleet</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3">
        {cars.map((car, i) => (
          <SliderCard {...car} key={i} chooseVehicle={chooseVehicle} />
        ))}
      </div>
    </div>
  );
};

export default Vehicles;
