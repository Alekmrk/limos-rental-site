import { useState, useContext } from "react";
import Button from "../../../components/Button";
import { Link, useNavigate } from "react-router-dom";
import ReservationContext from "../../../contexts/ReservationContext";
import AddressInput from "../../../components/AddressInput";

const ReservationCard = () => {
  const [activeMethod, setActiveMethod] = useState(1);
  const navigate = useNavigate();
  const { reservationInfo, handleInput } = useContext(ReservationContext);
  const [errors, setErrors] = useState({});

  const handleClick = (e, method) => {
    setActiveMethod(method);
    e.preventDefault();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!reservationInfo.pickup) newErrors.pickup = "Pick up location is required";
    if (!reservationInfo.dropoff) newErrors.dropoff = "Drop off location is required";
    if (!reservationInfo.date) newErrors.date = "Date is required";
    if (!reservationInfo.time) newErrors.time = "Time is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      navigate('/vehicle-selection');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="reservation reserve-card w-[400px] p-10 pt-[4.5rem] mx-auto md:mx-0 md:absolute md:bottom-8 md:right-[15%] shadow-xl bg-zinc-800/80 backdrop-blur-md border border-zinc-700/50 rounded-[1.5rem] text-left text-[15px]">
      <div className="text-sm absolute px-3 right-0 left-0 top-4 flex justify-center gap-4">
        <button
          type="button"
          onClick={(e) => handleClick(e, 1)}
          className={
            activeMethod === 1
              ? "py-2 px-4 h-full rounded-[0.6rem] active"
              : "py-2 px-4 h-full rounded-[0.6rem] text-neutral-400 hover:text-gold"
          }
        >
          Distance
        </button>
        <button
          type="button"
          onClick={(e) => handleClick(e, 2)}
          className={
            activeMethod === 2
              ? "py-2 px-4 h-full rounded-[0.6rem] active"
              : "py-2 px-4 h-full rounded-[0.6rem] text-neutral-400 hover:text-gold"
          }
        >
          Hourly
        </button>
      </div>
      
      <div className="mb-3">
        <AddressInput
          value={reservationInfo.pickup}
          onChange={handleInput}
          name="pickup"
          placeholder="Pick Up Address"
        />
        {errors.pickup && <span className="text-red-500 text-sm">{errors.pickup}</span>}
      </div>

      <div className="mb-3">
        <AddressInput
          value={reservationInfo.dropoff}
          onChange={handleInput}
          name="dropoff"
          placeholder="Drop Off Address"
        />
        {errors.dropoff && <span className="text-red-500 text-sm">{errors.dropoff}</span>}
      </div>

      <select
        className="bg-zinc-800/30 mb-3 rounded-[0.6rem] py-2 px-4 w-full border border-zinc-700/50 text-white"
        style={{ appearance: "none" }}
        disabled
        name=""
        id=""
      >
        <option value="one_way">One Way</option>
      </select>

      <div className="mb-3">
        <input
          onChange={handleInput}
          value={reservationInfo.date}
          name="date"
          type="date"
          className="bg-zinc-800/30 rounded-[0.6rem] py-2 px-4 w-full border border-zinc-700/50 text-white"
        />
        {errors.date && <span className="text-red-500 text-sm">{errors.date}</span>}
      </div>

      <div className="mb-3">
        <div className="flex items-center space-x-2">
          <label className="text-neutral-400 w-5/6 pl-2" htmlFor="time">
            Pick Up Time
          </label>
          <input
            onChange={handleInput}
            value={reservationInfo.time}
            name="time"
            type="time"
            id="time"
            className="bg-zinc-800/30 rounded-[0.6rem] py-2 px-4 w-full border border-zinc-700/50 text-white"
          />
        </div>
        {errors.time && <span className="text-red-500 text-sm">{errors.time}</span>}
      </div>

      <div className="flex justify-center mt-4">
        <Button type="submit" variant="secondary">Reserve Now</Button>
      </div>
    </form>
  );
};

export default ReservationCard;
