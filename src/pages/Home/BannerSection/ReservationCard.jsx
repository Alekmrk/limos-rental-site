import { useState, useContext } from "react";
import Button from "../../../components/Button";
import { Link } from "react-router-dom";
import ReservationContext from "../../../contexts/ReservationContext";
import AddressInput from "../../../components/AddressInput";

const ReservationCard = () => {
  const [activeMethod, setActiveMethod] = useState(1);

  const handleClick = (e, method) => {
    setActiveMethod(method);
    e.preventDefault();
  };

  // Reservation Inputs
  const { reservationInfo, handleInput } = useContext(ReservationContext);
  console.log(reservationInfo);

  return (
    <form className="reservation reserve-card w-[320px] p-8 pt-[4.5rem] mx-auto md:mx-0 md:absolute md:bottom-8 md:right-16 shadow-xl bg-zinc-800/80 backdrop-blur-md border border-zinc-700/50 rounded-[1.5rem] text-left text-[15px]">
      <div className="text-sm absolute px-3 right-0 left-0 top-4 flex justify-center gap-4">
        <button
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
      <AddressInput
        value={reservationInfo.pickup}
        onChange={handleInput}
        name="pickup"
        placeholder="Pick Up Address"
      />
      <AddressInput
        value={reservationInfo.dropoff}
        onChange={handleInput}
        name="dropoff"
        placeholder="Drop Off Address"
      />
      <select
        className="bg-zinc-800/30 mb-3 rounded-[0.6rem] py-2 px-4 w-full border border-zinc-700/50 text-white"
        style={{ appearance: "none" }}
        disabled
        name=""
        id=""
      >
        <option value="one_way">One Way</option>
      </select>
      <input
        onChange={handleInput}
        value={reservationInfo.date}
        name="date"
        type="date"
        className="bg-zinc-800/30 mb-3 rounded-[0.6rem] py-2 px-4 w-full border border-zinc-700/50 text-white"
      />
      <div className="flex items-center space-x-2">
        <label className="text-neutral-400 w-5/6 mb-3 pl-2" htmlFor="time">
          Pick Up Time
        </label>
        <input
          onChange={handleInput}
          value={reservationInfo.time}
          name="time"
          type="time"
          id="time"
          className="bg-zinc-800/30 mb-3 rounded-[0.6rem] py-2 px-4 w-full border border-zinc-700/50 text-white"
        />
      </div>
      <div className="flex justify-center mt-4">
        <Link to={"/vehicles"}>
          <Button variant="secondary">Reserve Now</Button>
        </Link>
      </div>
    </form>
  );
};

export default ReservationCard;
