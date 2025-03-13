import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReservationContext from "../../contexts/ReservationContext";
import Button from "../../components/Button";
import ProgressBar from "../../components/ProgressBar";
import cars from "../../data/cars";

const VehicleSelection = ({ scrollUp }) => {
  const navigate = useNavigate();
  const { reservationInfo, handleInput, setSelectedVehicle } = useContext(ReservationContext);
  const [errors, setErrors] = useState({});

  // Check if we have the required data from the previous step
  useEffect(() => {
    if (!reservationInfo.pickup || !reservationInfo.dropoff || !reservationInfo.date || !reservationInfo.time) {
      navigate('/');
    }
  }, [reservationInfo, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!reservationInfo.passengers || reservationInfo.passengers < 1) {
      newErrors.passengers = "At least 1 passenger is required";
    }
    if (reservationInfo.bags === undefined || reservationInfo.bags < 0) {
      newErrors.bags = "Number of bags cannot be negative";
    }
    if (!reservationInfo.selectedVehicle) {
      newErrors.vehicle = "Please select a vehicle";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      navigate('/customer-details');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  // Filter vehicles based on passenger count and bags
  const availableVehicles = cars.filter(car => 
    car.seats >= reservationInfo.passengers && 
    car.luggage >= (reservationInfo.bags || 0)
  );

  return (
    <div className="container-default mt-28">
      <h1 className="text-5xl md:text-7xl font-semibold mb-8">Select Vehicle</h1>
      
      <ProgressBar />
      
      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="passengers">
              Number of Passengers *
            </label>
            <input
              type="number"
              id="passengers"
              name="passengers"
              min="1"
              max="8"
              value={reservationInfo.passengers}
              onChange={handleInput}
              className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50"
              required
            />
            {errors.passengers && (
              <span className="text-red-500 text-sm">{errors.passengers}</span>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="bags">
              Number of Bags
            </label>
            <input
              type="number"
              id="bags"
              name="bags"
              min="0"
              max="8"
              value={reservationInfo.bags}
              onChange={handleInput}
              className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50"
            />
            {errors.bags && (
              <span className="text-red-500 text-sm">{errors.bags}</span>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-medium mb-4">Available Vehicles</h2>
          {errors.vehicle && (
            <span className="text-red-500 text-sm block mb-2">{errors.vehicle}</span>
          )}
          <div className="grid md:grid-cols-2 gap-6">
            {availableVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle)}
                className={`p-6 rounded-lg cursor-pointer transition-all ${
                  reservationInfo.selectedVehicle?.id === vehicle.id
                    ? "bg-gold/20 border-2 border-gold"
                    : "bg-zinc-800/30 border border-zinc-700/50 hover:border-gold/50"
                }`}
              >
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-48 object-contain mb-4"
                />
                <h3 className="text-xl font-medium mb-2">{vehicle.name}</h3>
                <div className="text-sm text-zinc-400">
                  <p>Seats: {vehicle.seats}</p>
                  <p>Luggage: {vehicle.luggage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={handleBack}
          >
            Back
          </Button>
          <Button type="submit" variant="secondary">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VehicleSelection; 