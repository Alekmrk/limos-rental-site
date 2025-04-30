import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ReservationContext from "../../contexts/ReservationContext";
import AddressInput from "../../components/AddressInput";
import MapPreview from "../../components/MapPreview";
import Button from "../../components/Button";
import TimeInput from "../../components/TimeInput";
import PassengerInfo from "../../components/PassengerInfo";

const Reservation = ({ scrollUp, selectedVehicle }) => {
  useEffect(() => scrollUp(), []);

  const navigate = useNavigate();
  const { reservationInfo, handleInput, handlePlaceSelection } = useContext(ReservationContext);
  const [validPickup, setValidPickup] = useState(!!reservationInfo.pickup);
  const [validDropoff, setValidDropoff] = useState(!!reservationInfo.dropoff);
  const [validDate, setValidDate] = useState(!!reservationInfo.date);
  const [validTime, setValidTime] = useState(!!reservationInfo.time);
  const [validPassengers, setValidPassengers] = useState(true);

  useEffect(() => {
    const totalPassengers = reservationInfo.adults + reservationInfo.childrenWithBabySeats;
    setValidPassengers(totalPassengers <= selectedVehicle.seats);
  }, [reservationInfo.adults, reservationInfo.childrenWithBabySeats, selectedVehicle.seats]);

  const canProceed = validPickup && validDate && validDropoff && validTime && validPassengers;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reservationInfo.pickup || !reservationInfo.dropoff) {
      setValidPickup(!!reservationInfo.pickup);
      setValidDropoff(!!reservationInfo.dropoff);
      return;
    }
    navigate("/vehicle-selection");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="reservation container-default text-center md:text-left mt-28">
      <h1 className="text-5xl md:text-7xl font-semibold">Reservation</h1>
      <div className="my-8 rounded-[1.5rem] overflow-hidden bg-zinc-800 shadow-default grid md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 px-4 flex justify-center items-center">
          <img src={selectedVehicle.image} alt="selected-vehicle" />
        </div>
        <form onSubmit={handleSubmit} className="p-8 text-white">
          <label
            className="mb-1 flex justify-between font-medium"
            htmlFor="pick-up"
          >
            <span>Pick Up:</span>
            {!validPickup && (
              <span className="text-red-500">This field is required</span>
            )}
          </label>
          <AddressInput
            value={reservationInfo.pickup}
            onChange={handleInput}
            onPlaceSelected={(placeInfo) => handlePlaceSelection('pickup', placeInfo)}
            onBlur={() => {
              if (reservationInfo.pickup === "") setValidPickup(false);
              else setValidPickup(true);
            }}
            name="pickup"
            placeholder="Pick Up Address"
          />
          <label
            className="mb-1 flex justify-between font-medium"
            htmlFor="drop-off"
          >
            <span>Drop Off:</span>
            {!validDropoff && (
              <span className="text-red-500">This field is required</span>
            )}
          </label>
          <AddressInput
            value={reservationInfo.dropoff}
            onChange={handleInput}
            onPlaceSelected={(placeInfo) => handlePlaceSelection('dropoff', placeInfo)}
            onBlur={() => {
              if (reservationInfo.dropoff === "") setValidDropoff(false);
              else setValidDropoff(true);
            }}
            name="dropoff"
            placeholder="Drop Off Address"
          />
          <label className="mb-1 block font-medium" htmlFor="one-way">
            One/Two way:
          </label>
          <select
            className="bg-zinc-700 mb-3 rounded-[0.6rem] py-2 px-4 w-full"
            style={{ appearance: "none" }}
            disabled
            name=""
            id="one-way"
          >
            <option value="one_way">One Way</option>
          </select>
          <label
            className="mb-1 flex justify-between font-medium"
            htmlFor="date"
          >
            <span>Choose Date:</span>
            {!validDate && (
              <span className="text-red-500">This field is required</span>
            )}
          </label>
          <input
            onChange={handleInput}
            onBlur={() => {
              if (reservationInfo.date === "") setValidDate(false);
              else setValidDate(true);
            }}
            value={reservationInfo.date}
            type="date"
            name="date"
            id="date"
            className="bg-zinc-700 mb-3 rounded-[0.6rem] py-2 px-4 w-full"
          />
          <label
            className="mb-1 flex justify-between font-medium"
            htmlFor="time"
          >
            <span>Choose Time:</span>
            {!validTime && (
              <span className="text-red-500">This field is required</span>
            )}
          </label>
          <TimeInput
            id="time"
            name="time"
            value={reservationInfo.time}
            onChange={handleInput}
            className="bg-zinc-700 mb-3 rounded-[0.6rem] py-2 px-4 w-full"
          />

          <div className="mt-6">
            <h3 className="text-xl font-medium mb-4">Passenger Information</h3>
            <PassengerInfo />
            {!validPassengers && (
              <p className="text-red-500 mt-2">
                Total passengers exceed vehicle capacity ({selectedVehicle.seats} seats)
              </p>
            )}
          </div>

          {reservationInfo.pickup && reservationInfo.dropoff && (
            <MapPreview
              origin={reservationInfo.pickup}
              destination={reservationInfo.dropoff}
              onRouteCalculated={(routeInfo) => {
                handlePlaceSelection('route', { routeInfo });
              }}
            />
          )}

          {reservationInfo.routeInfo && (
            <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/50">
              <h3 className="font-medium mb-2">Route Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-neutral-400">Distance:</span>
                  <span className="ml-2">{reservationInfo.routeInfo.distance}</span>
                </div>
                <div>
                  <span className="text-neutral-400">Duration:</span>
                  <span className="ml-2">{reservationInfo.routeInfo.duration}</span>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-between px-8">
        <Button type="button" variant="secondary" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} className="text-white mr-4" />
          Select Vehicle
        </Button>
        <Link to={canProceed ? "/thankyou" : "/reservation"}>
          <Button variant="secondary">Reserve Now</Button>
        </Link>
      </div>
    </div>
  );
};

export default Reservation;
