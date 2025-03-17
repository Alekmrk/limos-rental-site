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
    selectedVehicle: null,
    isHourly: false,
    hours: "",
    plannedActivities: "",
    distance: 0,
    duration: 0
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
    
    setReservationInfo(prev => ({ 
      ...prev, 
      [e.target.name]: value
    }));
  };

  const setSelectedVehicle = (vehicle) => {
    setReservationInfo(prev => ({ ...prev, selectedVehicle: vehicle }));
  };

  const setIsHourly = (isHourly) => {
    setReservationInfo(prev => ({ 
      ...prev, 
      isHourly,
      // Clear or preserve fields based on mode
      dropoff: isHourly ? '' : prev.dropoff,
      hours: isHourly ? prev.hours : '',
      plannedActivities: isHourly ? prev.plannedActivities : '',
      extraStops: isHourly ? [] : prev.extraStops,
      // Reset distance and duration for hourly mode
      distance: isHourly ? 0 : (prev.distance || 46.5),
      duration: isHourly ? 0 : (prev.duration || 36)
    }));
  };

  const addExtraStop = () => {
    if (!reservationInfo.isHourly && reservationInfo.extraStops.length < 10) {
      setReservationInfo(prev => ({
        ...prev,
        extraStops: [...prev.extraStops, ""]
      }));
    }
  };

  const removeExtraStop = (index) => {
    setReservationInfo(prev => ({
      ...prev,
      extraStops: prev.extraStops.filter((_, i) => i !== index)
    }));
  };

  const updateExtraStop = (index, value) => {
    setReservationInfo(prev => ({
      ...prev,
      extraStops: prev.extraStops.map((stop, i) => i === index ? value : stop)
    }));
  };

  return (
    <ReservationContext.Provider value={{ 
      reservationInfo, 
      handleInput, 
      setSelectedVehicle,
      setIsHourly,
      addExtraStop,
      removeExtraStop,
      updateExtraStop
    }}>
      {children}
    </ReservationContext.Provider>
  );
};

export default ReservationContext;
