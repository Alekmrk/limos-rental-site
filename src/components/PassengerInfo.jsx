import { useContext } from "react";
import ReservationContext from "../contexts/ReservationContext";
import NumberDropdown from "./NumberDropdown";

const PassengerInfo = () => {
  const { reservationInfo, handleInput } = useContext(ReservationContext);

  return (
    <div className="space-y-4">
      <NumberDropdown
        id="childrenWithBabySeats"
        name="childrenWithBabySeats"
        value={reservationInfo.childrenWithBabySeats}
        onChange={handleInput}
        min={0}
        max={4}
        label="Children Requiring Baby Seats"
      />

      <NumberDropdown
        id="bags"
        name="bags"
        value={reservationInfo.bags}
        onChange={handleInput}
        min={0}
        max={8}
        label="Number of Bags"
      />
    </div>
  );
};

export default PassengerInfo;