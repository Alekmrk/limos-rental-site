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
        newReservationInfo.pickupDetails = placeInfo;
        break;
      case 'dropoff':
        newReservationInfo.dropoff = placeInfo.formattedAddress;
        newReservationInfo.dropoffPlaceInfo = placeInfo;
        newReservationInfo.dropoffDetails = placeInfo;
        break;
      case 'route':
        // Just update route info without recalculating
        setReservationInfo(prev => ({
          ...prev,
          routeInfo: placeInfo.routeInfo,
          distance: placeInfo.routeInfo?.distance || '',
          duration: placeInfo.routeInfo?.duration || '',
          optimizedWaypoints: placeInfo.routeInfo?.waypoints || null,
          totalDistance: placeInfo.routeInfo?.distanceValue || 0,
          totalDuration: placeInfo.routeInfo?.durationValue || 0
        }));
        return;
      default:
        break;
    }

    // Update state
    setReservationInfo(newReservationInfo);

    // Calculate route if we have both pickup and dropoff
    if (!reservationInfo.isHourly && newReservationInfo.pickup && newReservationInfo.dropoff) {
      try {
        const route = await calculateRoute(
          newReservationInfo.pickup,
          newReservationInfo.dropoff,
          newReservationInfo.extraStops || []
        );
        
        setReservationInfo(prev => ({
          ...prev,
          [`${type}Details`]: placeInfo,
          routeInfo: route,
          distance: route.distance,
          duration: route.duration,
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

  const addExtraStop = async () => {
    if (!reservationInfo.isHourly && !reservationInfo.isSpecialRequest && reservationInfo.extraStops.length < 10) {
      setReservationInfo(prev => ({
        ...prev,
        extraStops: [...prev.extraStops, ""],
        extraStopDetails: [...prev.extraStopDetails, null]
      }));
    }
  };

  const removeExtraStop = async (index) => {
    // Get current stops without the removed one
    const newExtraStops = reservationInfo.extraStops.filter((_, i) => i !== index);
    const newExtraStopDetails = reservationInfo.extraStopDetails.filter((_, i) => i !== index);

    setReservationInfo(prev => ({
      ...prev,
      extraStops: newExtraStops,
      extraStopDetails: newExtraStopDetails
    }));

    // Recalculate route if we have both pickup and dropoff
    if (!reservationInfo.isHourly && reservationInfo.pickup && reservationInfo.dropoff) {
      try {
        const route = await calculateRoute(
          reservationInfo.pickup,
          reservationInfo.dropoff,
          newExtraStops.filter(stop => stop.trim()) // Only include non-empty stops
        );
        
        setReservationInfo(prev => ({
          ...prev,
          extraStops: newExtraStops,
          extraStopDetails: newExtraStopDetails,
          routeInfo: route,
          distance: route.distance,
          duration: route.duration,
          totalDistance: route.distanceValue,
          totalDuration: route.durationValue,
          optimizedWaypoints: route.waypoints
        }));
      } catch (error) {
        console.error('Error recalculating route:', error);
      }
    }
  };

  const updateExtraStop = async (index, value, details = null) => {
    const newExtraStops = [...reservationInfo.extraStops];
    const newExtraStopDetails = [...reservationInfo.extraStopDetails];
    
    newExtraStops[index] = value;
    newExtraStopDetails[index] = details || newExtraStopDetails[index];

    setReservationInfo(prev => ({
      ...prev,
      extraStops: newExtraStops,
      extraStopDetails: newExtraStopDetails
    }));

    // Only recalculate if the stop is fully entered (not empty) and we have pickup/dropoff
    if (value.trim() && !reservationInfo.isHourly && reservationInfo.pickup && reservationInfo.dropoff) {
      try {
        const route = await calculateRoute(
          reservationInfo.pickup,
          reservationInfo.dropoff,
          newExtraStops.filter(stop => stop.trim()) // Only include non-empty stops
        );
        
        setReservationInfo(prev => ({
          ...prev,
          routeInfo: route,
          distance: route.distance,
          duration: route.duration,
          totalDistance: route.distanceValue,
          totalDuration: route.durationValue,
          optimizedWaypoints: route.waypoints
        }));
      } catch (error) {
        console.error('Error recalculating route:', error);
      }
    }
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
