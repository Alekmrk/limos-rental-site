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
    passengers: "", // Changed from 1 to empty string
    bags: "", // Changed from 0 to empty string
    flightNumber: "",
    meetingBoard: "",
    childSeats: 0,
    babySeats: 0,
    skiEquipment: 0,
    additionalRequests: "",
    referenceNumber: "",
    email: "",
    phone: "",
    selectedVehicle: null,
    isHourly: false,
    isSpecialRequest: false,
    hours: 3,
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
    const { name, value, placeInfo } = e.target;
    
    console.log('🔄 [ReservationContext] handleInput called:', {
      field: name,
      value: value,
      hasPlaceInfo: !!placeInfo,
      placeInfo: placeInfo
    });
    
    setReservationInfo(prev => {
      const newInfo = {
        ...prev,
        [name]: value
      };
      
      // Handle placeInfo updates for address fields
      if (placeInfo) {
        if (name === 'pickup') {
          newInfo.pickupPlaceInfo = placeInfo;
        } else if (name === 'dropoff') {
          newInfo.dropoffPlaceInfo = placeInfo;
        }
      }
      
      console.log('📊 [ReservationContext] State update:', {
        field: name,
        oldValue: prev[name],
        newValue: value,
        placeInfoUpdate: placeInfo ? 'Updated' : 'None',
        wasManuallyEdited: placeInfo?.wasManuallyEdited
      });
      
      return newInfo;
    });
  };

  const handlePlaceSelection = async (type, placeInfo) => {
    console.group(`📍 [ReservationContext] Place selection: ${type}`);
    console.log('Place info received:', placeInfo);
    
    let newReservationInfo = { ...reservationInfo };

    switch (type) {
      case 'pickup':
        console.log('🚗 Setting pickup location');
        newReservationInfo.pickup = placeInfo.formattedAddress;
        newReservationInfo.pickupPlaceInfo = placeInfo;
        newReservationInfo.pickupDetails = placeInfo;
        break;
      case 'dropoff':
        console.log('🏁 Setting dropoff location');
        newReservationInfo.dropoff = placeInfo.formattedAddress;
        newReservationInfo.dropoffPlaceInfo = placeInfo;
        newReservationInfo.dropoffDetails = placeInfo;
        break;
      default:
        console.log('⚠️ Unknown place selection type:', type);
        console.groupEnd();
        return;
    }

    console.log('📊 Updated reservation info:', newReservationInfo);
    setReservationInfo(newReservationInfo);

    // Only calculate route if both locations are confirmed from autocomplete suggestions
    if (!reservationInfo.isHourly && 
        newReservationInfo.pickup && 
        newReservationInfo.dropoff && 
        type !== 'route') {
      
      // Check if both locations are properly confirmed from suggestions
      const pickupIsConfirmed = newReservationInfo.pickupPlaceInfo?.isConfirmed && !newReservationInfo.pickupPlaceInfo?.wasManuallyEdited;
      const dropoffIsConfirmed = newReservationInfo.dropoffPlaceInfo?.isConfirmed && !newReservationInfo.dropoffPlaceInfo?.wasManuallyEdited;
      
      if (pickupIsConfirmed && dropoffIsConfirmed) {
        console.log('🗺️ Both locations confirmed from suggestions - triggering route calculation...');
        console.log('📍 Route calculation inputs:', {
          pickupDisplay: newReservationInfo.pickup,
          dropoffDisplay: newReservationInfo.dropoff,
          pickupPlaceInfo: newReservationInfo.pickupPlaceInfo,
          dropoffPlaceInfo: newReservationInfo.dropoffPlaceInfo
        });
        
        try {
          // Use routing addresses (full formatted addresses) for more reliable international routing
          const originData = newReservationInfo.pickupPlaceInfo?.routingAddress || 
                            newReservationInfo.pickupPlaceInfo?.formattedAddress || 
                            newReservationInfo.pickup;
          const destinationData = newReservationInfo.dropoffPlaceInfo?.routingAddress || 
                                 newReservationInfo.dropoffPlaceInfo?.formattedAddress || 
                                 newReservationInfo.dropoff;
          
          console.log('🎯 Using full addresses for routing:', {
            origin: originData,
            destination: destinationData,
            pickupRouting: newReservationInfo.pickupPlaceInfo?.routingAddress,
            dropoffRouting: newReservationInfo.dropoffPlaceInfo?.routingAddress
          });
          
          const route = await calculateRoute(
            originData,
            destinationData,
            newReservationInfo.extraStops || []
          );
          
          console.log('✅ Route calculated:', route);
          
          if (route.noRouteFound) {
            console.log('⚠️ No route found between locations - proceeding without route info');
            setReservationInfo(prev => ({
              ...prev,
              [`${type}Details`]: placeInfo,
              routeInfo: route,
              distance: 'Route not available',
              duration: 'Route not available',
              totalDistance: 0,
              totalDuration: 0,
              optimizedWaypoints: []
            }));
          } else {
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
          }
        } catch (error) {
          console.error('💥 Error calculating route:', error);
          // Don't block the form submission if route calculation fails
          console.log('🔄 Proceeding without route calculation due to error');
          setReservationInfo(prev => ({
            ...prev,
            [`${type}Details`]: placeInfo,
            routeInfo: null,
            distance: 'Unable to calculate',
            duration: 'Unable to calculate',
            totalDistance: 0,
            totalDuration: 0,
            optimizedWaypoints: []
          }));
        }
      } else {
        console.log('⚠️ Skipping route calculation - locations not confirmed from suggestions:', {
          pickupIsConfirmed,
          dropoffIsConfirmed,
          pickupWasEdited: newReservationInfo.pickupPlaceInfo?.wasManuallyEdited,
          dropoffWasEdited: newReservationInfo.dropoffPlaceInfo?.wasManuallyEdited
        });
      }
    }
    
    console.groupEnd();
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
      hours: isHourly ? 3 : '', // Using number 3 instead of 2
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
