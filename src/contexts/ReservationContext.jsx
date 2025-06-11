import { createContext, useState, useCallback } from "react";
import { DateTime } from 'luxon';
import { calculateRoute, getPlaceDetails } from "../services/GoogleMapsService";

export const ReservationContext = createContext(null);

const getInitialTime = () => {
  // return DateTime.now().setZone('Europe/Zurich').toFormat('HH:mm');
  return "13:15";
};

const getInitialDate = () => {
  return DateTime.now().setZone('Europe/Zurich').toFormat('yyyy-MM-dd');
};

export const ReservationContextProvider = ({ children }) => {
  const [reservationInfo, setReservationInfo] = useState({
    pickup: "",
    pickupPlaceInfo: null,
    dropoff: "",
    dropoffPlaceInfo: null,
    extraStops: [],
    extraStopsPlaceInfo: [],
    date: getInitialDate(), // Initialize with current Swiss date
    time: getInitialTime(), // Initialize with current Swiss time
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

  // Memoize handlers to prevent unnecessary rerenders
  const handleExtraStopSelection = useCallback((index, placeInfo) => {
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
  }, []);

  const addExtraStop = useCallback(async () => {
    if (!reservationInfo.isHourly && !reservationInfo.isSpecialRequest && reservationInfo.extraStops.length < 10) {
      setReservationInfo(prev => ({
        ...prev,
        extraStops: [...prev.extraStops, ""],
        extraStopDetails: [...prev.extraStopDetails, null],
        extraStopsPlaceInfo: [...prev.extraStopsPlaceInfo, null]
      }));
    }
  }, [reservationInfo.isHourly, reservationInfo.isSpecialRequest, reservationInfo.extraStops.length]);

  const removeExtraStop = useCallback(async (index) => {
    setReservationInfo(prev => {
      const newExtraStops = prev.extraStops.filter((_, i) => i !== index);
      const newExtraStopDetails = prev.extraStopDetails.filter((_, i) => i !== index);
      const newExtraStopsPlaceInfo = prev.extraStopsPlaceInfo.filter((_, i) => i !== index);

      return {
        ...prev,
        extraStops: newExtraStops,
        extraStopDetails: newExtraStopDetails,
        extraStopsPlaceInfo: newExtraStopsPlaceInfo
      };
    });

    if (!reservationInfo.isHourly && reservationInfo.pickup && reservationInfo.dropoff) {
      try {
        const route = await calculateRoute(
          reservationInfo.pickup,
          reservationInfo.dropoff,
          reservationInfo.extraStops.filter((_, i) => i !== index).filter(stop => stop.trim())
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
  }, [reservationInfo.isHourly, reservationInfo.pickup, reservationInfo.dropoff, reservationInfo.extraStops]);

  const updateExtraStop = useCallback(async (index, value, placeInfo = null) => {
    setReservationInfo(prev => {
      const newExtraStops = [...prev.extraStops];
      const newExtraStopsPlaceInfo = [...prev.extraStopsPlaceInfo];
      
      // If we have placeInfo, use the formatted address from it
      newExtraStops[index] = placeInfo?.formattedAddress || value;
      newExtraStopsPlaceInfo[index] = placeInfo || null;

      return {
        ...prev,
        extraStops: newExtraStops,
        extraStopsPlaceInfo: newExtraStopsPlaceInfo
      };
    });

    // Only recalculate route if we have confirmed location and all required fields
    if (!reservationInfo.isHourly && reservationInfo.pickup && reservationInfo.dropoff) {
      try {
        const route = await calculateRoute(
          reservationInfo.pickup,
          reservationInfo.dropoff,
          reservationInfo.extraStops.map((stop, i) => i === index ? (placeInfo?.formattedAddress || value) : stop)
            .filter(stop => stop.trim())
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
  }, [reservationInfo.isHourly, reservationInfo.pickup, reservationInfo.dropoff, reservationInfo.extraStops]);

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
