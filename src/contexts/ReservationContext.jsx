import { createContext, useState, useCallback } from "react";
import { calculateRoute, getPlaceDetails } from "../services/GoogleMapsService";

export const ReservationContext = createContext(null);

export const ReservationContextProvider = ({ children }) => {
  const [reservationInfo, setReservationInfo] = useState({
    pickup: "",
    pickupPlaceInfo: null,
    dropoff: "",
    dropoffPlaceInfo: null,
    extraStops: [],
    extraStopsPlaceInfo: [],
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
    isSpecialRequest: false,
    hours: 2,
    plannedActivities: "",
    specialRequestDetails: "",
    pickupDetails: null,
    dropoffDetails: null,
    extraStopDetails: [],
    routeInfo: null,
    optimizedWaypoints: null,
    totalDistance: 0,
    totalDuration: 0,
  });

  const handleInput = async (e) => {
    const { name, value } = e.target;
    setReservationInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceSelection = async (type, placeInfo) => {
    let newReservationInfo = { ...reservationInfo };

    switch (type) {
      case 'pickup':
        newReservationInfo.pickup = placeInfo.formattedAddress;
        newReservationInfo.pickupPlaceInfo = placeInfo;
        break;
      case 'dropoff':
        newReservationInfo.dropoff = placeInfo.formattedAddress;
        newReservationInfo.dropoffPlaceInfo = placeInfo;
        break;
      default:
        break;
    }

    // Update state without validation
    setReservationInfo(newReservationInfo);

    // Calculate route if we have both pickup and dropoff
    if (!reservationInfo.isHourly && newReservationInfo.pickupDetails && newReservationInfo.dropoffDetails) {
      try {
        const route = await calculateRoute(
          newReservationInfo.pickupDetails.formattedAddress,
          newReservationInfo.dropoffDetails.formattedAddress,
          newReservationInfo.extraStops
        );
        
        setReservationInfo(prev => ({
          ...prev,
          [`${type}Details`]: placeInfo,
          routeInfo: route,
          totalDistance: route.distanceValue,
          totalDuration: route.durationValue,
          optimizedWaypoints: route.waypoints
        }));
      } catch (error) {
        console.error('Error calculating route:', error);
      }
    }
  };

  const handleExtraStopSelection = (index, placeInfo) => {
    setReservationInfo(prev => {
      const newExtraStops = [...prev.extraStops];
      const newExtraStopsPlaceInfo = [...prev.extraStopsPlaceInfo];
      
      newExtraStops[index] = placeInfo.formattedAddress;
      newExtraStopsPlaceInfo[index] = placeInfo;

      return {
        ...prev,
        extraStops: newExtraStops,
        extraStopsPlaceInfo: newExtraStopsPlaceInfo,
      };
    });
  };

  const addExtraStop = () => {
    if (!reservationInfo.isHourly && !reservationInfo.isSpecialRequest && reservationInfo.extraStops.length < 10) {
      setReservationInfo(prev => ({
        ...prev,
        extraStops: [...prev.extraStops, ""],
        extraStopDetails: [...prev.extraStopDetails, null]
      }));
    }
  };

  const removeExtraStop = (index) => {
    setReservationInfo(prev => ({
      ...prev,
      extraStops: prev.extraStops.filter((_, i) => i !== index),
      extraStopDetails: prev.extraStopDetails.filter((_, i) => i !== index)
    }));
  };

  const updateExtraStop = (index, value, details = null) => {
    setReservationInfo(prev => ({
      ...prev,
      extraStops: prev.extraStops.map((stop, i) => i === index ? value : stop),
      extraStopDetails: prev.extraStopDetails.map((detail, i) => i === index ? (details || detail) : detail)
    }));
  };

  const setSelectedVehicle = (vehicle) => {
    setReservationInfo(prev => ({ ...prev, selectedVehicle: vehicle }));
  };

  const setIsHourly = (isHourly) => {
    setReservationInfo(prev => ({ 
      ...prev, 
      isHourly,
      isSpecialRequest: false,
      dropoff: isHourly ? '' : prev.dropoff,
      hours: isHourly ? '2' : '',
      plannedActivities: isHourly ? prev.plannedActivities : '',
      extraStops: [],
      extraStopDetails: [],
      routeInfo: null,
      optimizedWaypoints: null,
      totalDistance: 0,
      totalDuration: 0
    }));
  };

  const setIsSpecialRequest = (isSpecial) => {
    setReservationInfo(prev => ({
      ...prev,
      isSpecialRequest: isSpecial,
      isHourly: false,
      dropoff: '',
      hours: '',
      plannedActivities: '',
      extraStops: [],
      extraStopDetails: [],
      routeInfo: null,
      optimizedWaypoints: null,
      totalDistance: 0,
      totalDuration: 0,
      specialRequestDetails: isSpecial ? 'Special transportation request' : ''
    }));
  };

  return (
    <ReservationContext.Provider value={{ 
      reservationInfo, 
      handleInput,
      handlePlaceSelection,
      handleExtraStopSelection,
      setSelectedVehicle,
      setIsHourly,
      setIsSpecialRequest,
      addExtraStop,
      removeExtraStop,
      updateExtraStop
    }}>
      {children}
    </ReservationContext.Provider>
  );
};

export default ReservationContext;
