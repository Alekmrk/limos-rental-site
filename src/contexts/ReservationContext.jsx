import { createContext, useState, useCallback } from "react";

export const ReservationContext = createContext({
  reservationInfo: null,
  handleInput: () => {},
  handlePlaceSelection: () => {},
  setIsHourly: () => {},
  setIsSpecialRequest: () => {},
  setSelectedVehicle: () => {},
  addExtraStop: () => {},
  removeExtraStop: () => {},
  updateExtraStop: () => {},
  setPaymentDetails: () => {}
});

const getInitialTime = () => {
  const now = new Date();
  const swissTime = now.toLocaleTimeString('en-CH', {
    timeZone: 'Europe/Zurich',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });
  return swissTime;
};

const getInitialDate = () => {
  const now = new Date();
  const swissDate = now.toLocaleDateString('en-CH', {
    timeZone: 'Europe/Zurich',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).split('.').reverse().join('-');
  return swissDate;
};

export const ReservationContextProvider = ({ children }) => {
  const [reservationInfo, setReservationInfo] = useState({
    pickup: "",
    dropoff: "",
    date: getInitialDate(),
    time: getInitialTime(),
    passengers: "",
    bags: "",
    hours: "",
    extraStops: [],
    selectedVehicle: null,
    isHourly: false,
    isSpecialRequest: false,
    pickupDetails: null,
    dropoffDetails: null,
    routeInfo: null,
    email: "",
    phone: "",
    flightNumber: "",
    childSeats: 0,
    babySeats: 0,
    skiEquipment: 0,
    plannedActivities: "",
    additionalRequests: "",
    paymentDetails: null
  });

  const handleInput = useCallback((e) => {
    const { name, value, placeInfo } = e.target;
    setReservationInfo(prev => ({
      ...prev,
      [name]: value,
      ...(placeInfo && name === 'pickup' ? { pickupDetails: placeInfo } : {}),
      ...(placeInfo && name === 'dropoff' ? { dropoffDetails: placeInfo } : {})
    }));
  }, []);

  const handlePlaceSelection = useCallback((type, placeInfo) => {
    setReservationInfo(prev => ({
      ...prev,
      [`${type}Details`]: placeInfo
    }));
  }, []);

  const setIsHourly = useCallback((value) => {
    setReservationInfo(prev => ({
      ...prev,
      isHourly: value,
      dropoff: value ? "" : prev.dropoff,
      hours: value ? "2" : "",
      extraStops: []
    }));
  }, []);

  const setIsSpecialRequest = useCallback((value) => {
    setReservationInfo(prev => ({
      ...prev,
      isSpecialRequest: value,
      pickup: "",
      dropoff: "",
      hours: "",
      extraStops: [],
      selectedVehicle: null
    }));
  }, []);

  const setSelectedVehicle = useCallback((vehicle) => {
    setReservationInfo(prev => ({
      ...prev,
      selectedVehicle: vehicle
    }));
  }, []);

  const addExtraStop = useCallback(() => {
    setReservationInfo(prev => ({
      ...prev,
      extraStops: [...prev.extraStops, ""]
    }));
  }, []);

  const removeExtraStop = useCallback((index) => {
    setReservationInfo(prev => ({
      ...prev,
      extraStops: prev.extraStops.filter((_, i) => i !== index)
    }));
  }, []);

  const updateExtraStop = useCallback((index, value) => {
    setReservationInfo(prev => ({
      ...prev,
      extraStops: prev.extraStops.map((stop, i) => 
        i === index ? value : stop
      )
    }));
  }, []);

  const setPaymentDetails = useCallback((details) => {
    setReservationInfo(prev => ({
      ...prev,
      paymentDetails: details
    }));
  }, []);

  const value = {
    reservationInfo,
    handleInput,
    handlePlaceSelection,
    setIsHourly,
    setIsSpecialRequest,
    setSelectedVehicle,
    addExtraStop,
    removeExtraStop,
    updateExtraStop,
    setPaymentDetails
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
};

export default ReservationContext;
