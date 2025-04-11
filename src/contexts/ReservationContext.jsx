import { createContext, useState, useCallback } from "react";
import { calculateRoute, getPlaceDetails, validateAddresses } from "../services/GoogleMapsService";

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
    // Enhanced route-related fields
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

    // Validate Switzerland location requirement
    if (newReservationInfo.pickupPlaceInfo || newReservationInfo.dropoffPlaceInfo) {
      const validation = await validateAddresses(
        newReservationInfo.pickupPlaceInfo,
        newReservationInfo.dropoffPlaceInfo
      );

      // Only update state if validation passes
      if (validation.isValid) {
        setReservationInfo(newReservationInfo);
      } else {
        throw new Error(validation.error);
      }
    }

    if (type === 'route') {
      // Update route information
      setReservationInfo(prev => ({
        ...prev,
        routeInfo: placeInfo.routeInfo,
        optimizedWaypoints: placeInfo.routeInfo?.waypoints || null,
        totalDistance: placeInfo.routeInfo?.distanceValue || 0,
        totalDuration: placeInfo.routeInfo?.durationValue || 0
      }));
      return;
    }

    // Handle pickup, dropoff, or extra stop selection
    setReservationInfo(prev => ({
      ...prev,
      [`${type}Details`]: placeInfo
    }));

    // If we have both pickup and dropoff locations and any extra stops, allow the route to be calculated
    const updatedInfo = {
      ...reservationInfo,
      [`${type}Details`]: placeInfo
    };

    if (!updatedInfo.isHourly && updatedInfo.pickupDetails && updatedInfo.dropoffDetails) {
      try {
        const route = await calculateRoute(
          updatedInfo.pickupDetails.formattedAddress,
          updatedInfo.dropoffDetails.formattedAddress,
          updatedInfo.extraStops
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
