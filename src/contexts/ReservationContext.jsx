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
    let value = e.target.value;
    
    if (e.target.type === 'time') {
      // Force 24-hour format and validate
      const [hours, minutes] = value.split(':').map(Number);
      if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
        value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      } else {
        return; // Invalid time
      }
    } else if (e.target.type === 'number') {
      value = value === '' ? '' : parseInt(value);
    }
    
    setReservationInfo({ 
      ...reservationInfo, 
      [e.target.name]: value,
      ...(e.target.type === 'number' && value === '' ? { [`${e.target.name}Value`]: 0 } : {})
    });
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
