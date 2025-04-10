import { useState, useContext } from "react";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import ReservationContext from "../../../contexts/ReservationContext";
import AddressInput from "../../../components/AddressInput";
import TimeInput from "../../../components/TimeInput";

const ReservationCard = () => {
  const navigate = useNavigate();
  const { reservationInfo, handleInput, setIsHourly, setIsSpecialRequest } = useContext(ReservationContext);
  const [errors, setErrors] = useState({});

  const handleModeChange = (mode) => {
    if (mode === 'hourly') {
      setIsHourly(true);
    } else if (mode === 'special') {
      setIsSpecialRequest(true);
    } else {
      setIsHourly(false);
      setIsSpecialRequest(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!reservationInfo.date) newErrors.date = "Date is required";
    if (!reservationInfo.time) newErrors.time = "Time is required";

    // Only validate other fields if not a special request
    if (!reservationInfo.isSpecialRequest) {
      if (!reservationInfo.pickup) newErrors.pickup = "Pick up location is required";
      if (!reservationInfo.isHourly && !reservationInfo.dropoff) {
        newErrors.dropoff = "Drop off location is required";
      }
      if (reservationInfo.isHourly) {
        const hours = parseInt(reservationInfo.hours) || 0;
        if (hours < 2 || hours > 24) {
          newErrors.hours = "Hours must be between 2 and 24";
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (reservationInfo.isSpecialRequest) {
        navigate('/customer-details');
      } else {
        navigate('/vehicle-selection');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="reservation reserve-card w-[90%] max-w-[420px] p-8 sm:p-8 mx-auto md:mx-0 md:absolute md:bottom-12 md:right-8 lg:right-16 shadow-2xl bg-zinc-800/70 backdrop-blur-md border border-zinc-700/30 rounded-[2rem] text-left text-[14px] transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-zinc-600/40">
      <div className="flex justify-center gap-3 pb-4 relative">
        <button
          type="button"
          onClick={() => handleModeChange('distance')}
          className={
            !reservationInfo.isHourly && !reservationInfo.isSpecialRequest
              ? "py-2.5 px-4 rounded-xl active shadow-lg transform transition-all duration-200"
              : "py-2.5 px-4 rounded-xl text-neutral-400 hover:text-gold transition-all duration-200 hover:bg-zinc-800/50"
          }
        >
          Distance
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('hourly')}
          className={
            reservationInfo.isHourly
              ? "py-2.5 px-4 rounded-xl active shadow-lg transform transition-all duration-200"
              : "py-2.5 px-4 rounded-xl text-neutral-400 hover:text-gold transition-all duration-200 hover:bg-zinc-800/50"
          }
        >
          Hourly
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('special')}
          className={
            reservationInfo.isSpecialRequest
              ? "py-2.5 px-4 rounded-xl active shadow-lg transform transition-all duration-200"
              : "py-2.5 px-4 rounded-xl text-neutral-400 hover:text-gold transition-all duration-200 hover:bg-zinc-800/50"
          }
        >
          Special
        </button>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r"></div>
      </div>
      
      <div className="space-y-5 mt-2">
        {!reservationInfo.isSpecialRequest ? (
          <>
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

            {!reservationInfo.isHourly && (
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
            )}

            {reservationInfo.isHourly && (
              <div className="relative">
                <input
                  type="number"
                  min="2"
                  max="24"
                  name="hours"
                  value={reservationInfo.hours || ''}
                  onChange={handleInput}
                  className="bg-zinc-800/30 rounded-xl py-3 px-4 w-full border border-zinc-700/50 text-white transition-all duration-200 hover:border-zinc-600 focus:border-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                  placeholder="Enter hours (2-24)"
                />
                {errors.hours && <span className="text-red-500 text-sm absolute -bottom-5">{errors.hours}</span>}
              </div>
            )}
          </>
        ) : (
          <div className="mb-4 text-neutral-400 text-sm border border-gold/20 rounded-xl p-4 bg-gold/5">
            <p>Tell us about your special requirements in the next step. This could be:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Wedding transportation</li>
              <li>Corporate event</li>
              <li>Airport VIP service</li>
              <li>Custom tour packages</li>
            </ul>
          </div>
        )}

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
              {reservationInfo.isSpecialRequest ? 'Preferred Time' : 'Pick Up Time'}
            </label>
            <TimeInput
              value={reservationInfo.time}
              onChange={handleInput}
              name="time"
              id="time"
              className="bg-zinc-800/30 rounded-xl py-3 px-4 w-7/12 border border-zinc-700/50 text-white transition-all duration-200 hover:border-zinc-600 focus:border-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.1)]"
            />
          </div>
          {errors.time && <span className="text-red-500 text-sm absolute -bottom-5">{errors.time}</span>}
        </div>

        <div className="flex justify-center mt-8">
          <Button type="submit" variant="secondary" className="w-full py-4 text-base font-medium tracking-wide transition-all duration-200 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            {reservationInfo.isSpecialRequest ? "Continue to Request Details" : "Reserve Now"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ReservationCard;
