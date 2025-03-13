import { useContext } from "react";
import ReservationContext from "../contexts/ReservationContext";

const PassengerInfo = () => {
  const { reservationInfo, handleInput } = useContext(ReservationContext);

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block font-medium" htmlFor="adults">
          Number of Adults
        </label>
        <input
          type="number"
          min="1"
          max="8"
          id="adults"
          name="adults"
          value={reservationInfo.adults}
          onChange={handleInput}
          className="bg-zinc-800/30 mb-3 rounded-[0.6rem] py-2 px-4 w-full border border-zinc-700/50 text-white"
        />
      </div>

      <div>
        <label className="mb-1 block font-medium" htmlFor="childrenWithBabySeats">
          Children Requiring Baby Seats
        </label>
        <input
          type="number"
          min="0"
          max="4"
          id="childrenWithBabySeats"
          name="childrenWithBabySeats"
          value={reservationInfo.childrenWithBabySeats}
          onChange={handleInput}
          className="bg-zinc-800/30 mb-3 rounded-[0.6rem] py-2 px-4 w-full border border-zinc-700/50 text-white"
        />
      </div>

      <div>
        <label className="mb-1 block font-medium" htmlFor="bags">
          Number of Bags
        </label>
        <input
          type="number"
          min="1"
          max="8"
          id="bags"
          name="bags"
          value={reservationInfo.bags}
          onChange={handleInput}
          className="bg-zinc-800/30 mb-3 rounded-[0.6rem] py-2 px-4 w-full border border-zinc-700/50 text-white"
        />
      </div>
    </div>
  );
};

export default PassengerInfo; 