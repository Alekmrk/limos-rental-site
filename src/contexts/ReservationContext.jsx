import { createContext, useState } from "react";

export const ReservationContext = createContext(null);

export const ReservationContextProvider = ({ children }) => {
  const [reservationInfo, setReservationInfo] = useState({
    pickup: "",
    dropoff: "",
    extraStops: [],
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

  const addExtraStop = () => {
    if (reservationInfo.extraStops.length < 10) {
      setReservationInfo({
        ...reservationInfo,
        extraStops: [...reservationInfo.extraStops, ""]
      });
    }
  };

  const removeExtraStop = (index) => {
    const newStops = [...reservationInfo.extraStops];
    newStops.splice(index, 1);
    setReservationInfo({
      ...reservationInfo,
      extraStops: newStops
    });
  };

  const updateExtraStop = (index, value) => {
    const newStops = [...reservationInfo.extraStops];
    newStops[index] = value;
    setReservationInfo({
      ...reservationInfo,
      extraStops: newStops
    });
  };

  return (
    <ReservationContext.Provider value={{ 
      reservationInfo, 
      handleInput, 
      setSelectedVehicle,
      addExtraStop,
      removeExtraStop,
      updateExtraStop
    }}>
      {children}
    </ReservationContext.Provider>
  );
};

export default ReservationContext;
