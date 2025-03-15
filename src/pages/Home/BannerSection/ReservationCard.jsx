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
    <form onSubmit={handleSubmit} className="reservation reserve-card w-[90%] max-w-[380px] p-6 sm:p-10 pt-12 mx-auto md:mx-0 md:absolute md:bottom-12 md:right-8 lg:right-16 shadow-2xl bg-zinc-800/70 backdrop-blur-md border border-zinc-700/30 rounded-[2rem] text-left text-[14px] transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-zinc-600/40">
      <div className="text-sm absolute px-3 sm:px-5 right-0 left-0 top-2 sm:top-3 flex justify-center gap-3 sm:gap-5">
        <button
          type="button"
          onClick={(e) => handleClick(e, 1)}
          className={
            activeMethod === 1
              ? "py-2 px-3 sm:px-5 h-full rounded-xl active shadow-lg transform transition-all duration-200"
              : "py-2 px-3 sm:px-5 h-full rounded-xl text-neutral-400 hover:text-gold transition-all duration-200 hover:bg-zinc-800/50"
          }
        >
          Distance
        </button>
        <button
          type="button"
          onClick={(e) => handleClick(e, 2)}
          className={
            activeMethod === 2
              ? "py-2 px-3 sm:px-5 h-full rounded-xl active shadow-lg transform transition-all duration-200"
              : "py-2 px-3 sm:px-5 h-full rounded-xl text-neutral-400 hover:text-gold transition-all duration-200 hover:bg-zinc-800/50"
          }
        >
          Hourly
        </button>
      </div>
      
      <div className="space-y-4 mt-2">
        <div className="relative">
          <AddressInput
            value={reservationInfo.pickup}
            onChange={handleInput}
            name="pickup"
            placeholder="Pick Up Address"
            className="transition-all duration-200 hover:border-zinc-600 focus:border-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.1)]"
          />
          {errors.pickup && <span className="text-red-500 text-sm absolute -bottom-5">{errors.pickup}</span>}
        </div>

        <div className="relative">
          <AddressInput
            value={reservationInfo.dropoff}
            onChange={handleInput}
            name="dropoff"
            placeholder="Drop Off Address"
            className="transition-all duration-200 hover:border-zinc-600 focus:border-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.1)]"
          />
          {errors.dropoff && <span className="text-red-500 text-sm absolute -bottom-5">{errors.dropoff}</span>}
        </div>

        <select
          className="bg-zinc-800/30 rounded-xl py-3 px-4 w-full border border-zinc-700/50 text-white transition-all duration-200 hover:border-zinc-600"
          style={{ appearance: "none" }}
          disabled
          name=""
          id=""
        >
          <option value="one_way">One Way</option>
        </select>

        <div className="relative">
          <input
            onChange={handleInput}
            value={reservationInfo.date}
            name="date"
            type="date"
            className="bg-zinc-800/30 rounded-xl py-3 px-4 w-full border border-zinc-700/50 text-white transition-all duration-200 hover:border-zinc-600 focus:border-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.1)]"
          />
          {errors.date && <span className="text-red-500 text-sm absolute -bottom-5">{errors.date}</span>}
        </div>

        <div className="relative">
          <div className="flex items-center gap-3">
            <label className="text-neutral-400 w-5/12 pl-2" htmlFor="time">
              Pick Up Time
            </label>
            <input
              onChange={handleInput}
              value={reservationInfo.time}
              name="time"
              type="time"
              id="time"
              className="bg-zinc-800/30 rounded-xl py-3 px-4 w-7/12 border border-zinc-700/50 text-white transition-all duration-200 hover:border-zinc-600 focus:border-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.1)]"
            />
          </div>
          {errors.time && <span className="text-red-500 text-sm absolute -bottom-5">{errors.time}</span>}
        </div>

        <div className="flex justify-center mt-8">
          <Button type="submit" variant="secondary" className="w-full py-4 text-base font-medium tracking-wide transition-all duration-200 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            Reserve Now
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ReservationCard;
