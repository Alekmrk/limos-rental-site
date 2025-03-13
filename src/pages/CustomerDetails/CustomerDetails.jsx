import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReservationContext from "../../contexts/ReservationContext";
import Button from "../../components/Button";
import ProgressBar from "../../components/ProgressBar";

const CustomerDetails = ({ scrollUp }) => {
  const navigate = useNavigate();
  const { reservationInfo, handleInput } = useContext(ReservationContext);
  const [errors, setErrors] = useState({});

  // Check if we have the required data from previous steps
  useEffect(() => {
    if (!reservationInfo.pickup || !reservationInfo.dropoff || !reservationInfo.date || !reservationInfo.time) {
      navigate('/');
    } else if (!reservationInfo.selectedVehicle || !reservationInfo.passengers || reservationInfo.passengers < 1) {
      navigate('/vehicle-selection');
    }
  }, [reservationInfo, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!reservationInfo.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(reservationInfo.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      navigate('/thankyou');
    }
  };

  const handleBack = () => {
    navigate('/vehicle-selection');
  };

  return (
    <div className="container-default mt-28">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-semibold mb-8">Additional Details</h1>
        
        <ProgressBar />
        
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={reservationInfo.email}
                onChange={handleInput}
                className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50"
                required
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="phone">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={reservationInfo.phone}
                onChange={handleInput}
                className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="flightNumber">
                Flight Number
              </label>
              <input
                type="text"
                id="flightNumber"
                name="flightNumber"
                value={reservationInfo.flightNumber}
                onChange={handleInput}
                className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="skiEquipment">
                Number of Ski Equipment
              </label>
              <input
                type="number"
                id="skiEquipment"
                name="skiEquipment"
                min="0"
                value={reservationInfo.skiEquipment}
                onChange={handleInput}
                className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="childSeats">
                Child Seats (Ages 4-7)
              </label>
              <input
                type="number"
                id="childSeats"
                name="childSeats"
                min="0"
                value={reservationInfo.childSeats}
                onChange={handleInput}
                className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="babySeats">
                Baby Seats (Ages 0-3)
              </label>
              <input
                type="number"
                id="babySeats"
                name="babySeats"
                min="0"
                value={reservationInfo.babySeats}
                onChange={handleInput}
                className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium mb-2" htmlFor="additionalRequests">
              Additional Requests
            </label>
            <textarea
              id="additionalRequests"
              name="additionalRequests"
              value={reservationInfo.additionalRequests}
              onChange={handleInput}
              rows="4"
              className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50"
              placeholder="Any special requirements or requests..."
            ></textarea>
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
              Pay Now
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerDetails; 