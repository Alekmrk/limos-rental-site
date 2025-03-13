import { createContext, useState } from "react";

export const ReservationContext = createContext(null);

export const ReservationContextProvider = ({ children }) => {
  const [reservationInfo, setReservationInfo] = useState({
    pickup: "",
    dropoff: "",
    date: "",
    time: "",
    passengers: 1,
    bags: 0,
    flightNumber: "",
    childSeats: 0,
    babySeats: 0,
    skiEquipment: 0,
    additionalRequests: "",
    email: "",
    phone: "",
    selectedVehicle: null
  });

  const handleInput = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setReservationInfo({ ...reservationInfo, [e.target.name]: value });
  };

  const setSelectedVehicle = (vehicle) => {
    setReservationInfo({ ...reservationInfo, selectedVehicle: vehicle });
  };

  return (
    <ReservationContext.Provider value={{ reservationInfo, handleInput, setSelectedVehicle }}>
      {children}
    </ReservationContext.Provider>
  );
};

export default ReservationContext;
