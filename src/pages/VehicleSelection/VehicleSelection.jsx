import { useContext, useState, useEffect, useRef, useMemo, useCallback } from "react";
import ReservationContext from "../../contexts/ReservationContext";
import { useUTMPreservation } from "../../hooks/useUTMPreservation";
import Button from "../../components/Button";
import ProgressBar from "../../components/ProgressBar";
import AddressInput from "../../components/AddressInput";
import NumberDropdown from "../../components/NumberDropdown";
import VehicleImage from "../../components/VehicleImage";
import cars, { getMaxPassengers, getMaxBags } from "../../data/cars";
import MapPreview from "../../components/MapPreview";
import { calculatePrice, calculatePriceByDistance, addSurcharges, formatPrice } from "../../services/PriceCalculationService";

const VehicleSelection = ({ scrollUp }) => {
  const { navigateWithUTMs } = useUTMPreservation();
  const { 
    reservationInfo, 
    handleInput, 
    setSelectedVehicle, 
    addExtraStop,
    removeExtraStop,
    updateExtraStop
  } = useContext(ReservationContext);
  const [errors, setErrors] = useState({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const latestStopsRef = useRef(reservationInfo.extraStops);
  const [prices, setPrices] = useState({});

  // Scroll to top immediately when component mounts - run this first
  useEffect(() => {
    scrollUp && scrollUp();
  }, [scrollUp]);

  useEffect(() => {
    latestStopsRef.current = reservationInfo.extraStops;
  }, [reservationInfo.extraStops]);

  // Check if we have the required data from the previous step
  useEffect(() => {
    // For special requests, skip vehicle selection
    if (reservationInfo.isSpecialRequest) {
      navigateWithUTMs('/customer-details');
      return;
    }

    // Normal validation for other booking types
    if (!reservationInfo.pickup || 
        (!reservationInfo.isHourly && !reservationInfo.dropoff) || 
        !reservationInfo.date || 
        !reservationInfo.time ||
        (reservationInfo.isHourly && (!reservationInfo.hours || reservationInfo.hours < 3 || reservationInfo.hours > 24))
    ) {
      navigateWithUTMs('/');
    }
  }, [reservationInfo, navigateWithUTMs]);

  const hasEmptyStops = useMemo(() => {
    return reservationInfo.extraStops.some(stop => !stop.trim());
  }, [reservationInfo.extraStops]);

  const validateFormErrors = (stops = reservationInfo.extraStops) => {
    const newErrors = {};
    const passengerCount = reservationInfo.passengers === '' ? 0 : parseInt(reservationInfo.passengers);
    const bagCount = reservationInfo.bags === '' ? 0 : parseInt(reservationInfo.bags);
    
    if (reservationInfo.passengers === '' || passengerCount < 1) {
      newErrors.passengers = "Please select number of passengers";
    }
    if (reservationInfo.bags === '') {
      newErrors.bags = "Please select number of bags";
    }
    if (!reservationInfo.selectedVehicle && shouldShowVehicles) {
      newErrors.vehicle = "Please select a vehicle";
    }
    
    // Use memoized empty stops check if using current stops
    if (stops === reservationInfo.extraStops) {
      if (hasEmptyStops) {
        newErrors.extraStops = "All extra stops must be filled";
      }
    } else {
      // For predicted state, check the provided stops
      const predictedHasEmptyStops = stops.some(stop => !stop.trim());
      if (predictedHasEmptyStops) {
        newErrors.extraStops = "All extra stops must be filled";
      }
    }

    return newErrors;
  };

  const updateErrors = (newErrors) => {
    if (hasAttemptedSubmit) {
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = validateFormErrors();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setHasAttemptedSubmit(true);
      
      // If there are errors, scroll to the first error field
      const firstErrorField = Object.keys(newErrors)[0];
      scrollToErrorField(firstErrorField);
      
      return false;
    }
    return true;
  };

  // Function to scroll to the error field
  const scrollToErrorField = (fieldName) => {
    setTimeout(() => {
      let fieldElement = null;
      
      // Handle different field types
      if (fieldName === 'passengers' || fieldName === 'bags') {
        // For NumberDropdown components, find by ID but don't focus
        fieldElement = document.getElementById(fieldName);
      } else if (fieldName === 'vehicle') {
        // For vehicle selection, scroll to the specific error message by ID
        fieldElement = document.getElementById('vehicle-error');
        if (!fieldElement) {
          // Fallback to vehicles section if error message not found
          fieldElement = document.querySelector('h2[class*="text-2xl"]');
        }
      } else if (fieldName === 'extraStops') {
        // For extra stops, find the first empty stop input
        const stopInputs = document.querySelectorAll('[name^="extraStop-"]');
        fieldElement = stopInputs[0];
      }
      
      if (fieldElement) {
        fieldElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
        
        // Only focus on specific input elements, not NumberDropdown components
        if (fieldElement.tagName === 'INPUT' && fieldElement.name && fieldElement.name.startsWith('extraStop-')) {
          fieldElement.focus();
        }
      }
    }, 100); // Small delay to ensure error state is rendered
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      navigateWithUTMs('/customer-details');
    }
  };

  const handleBack = () => {
    // Check if user came from booking page
    const hasBookingHistory = window.history.length > 1;
    if (hasBookingHistory) {
      navigateWithUTMs(-1); // Go back to previous page
    } else {
      navigateWithUTMs('/'); // Default to homepage
    }
  };

  const handleRemoveExtraStop = useCallback((index) => {
    const newStops = [...latestStopsRef.current];
    newStops.splice(index, 1);
    removeExtraStop(index);
    
    if (hasAttemptedSubmit) {
      updateErrors(validateFormErrors(newStops));
    }
  }, [removeExtraStop, hasAttemptedSubmit, validateFormErrors]);

  const updateStop = useCallback((index, value, placeInfo) => {
    const newStops = [...reservationInfo.extraStops];
    newStops[index] = placeInfo?.formattedAddress || value;
    updateExtraStop(index, value, placeInfo);

    if (hasAttemptedSubmit) {
      updateErrors(validateFormErrors(newStops));
    }
  }, [reservationInfo.extraStops, hasAttemptedSubmit, updateExtraStop, validateFormErrors]);

  const handleVehicleSelect = (vehicle) => {
    // Only allow selection if vehicle is available
    if (!vehicle.isAvailable) {
      return;
    }
    
    // If the vehicle is already selected, unselect it
    if (reservationInfo.selectedVehicle?.id === vehicle.id) {
      setSelectedVehicle(null);
      return;
    }
    
    setSelectedVehicle(vehicle);
    if (hasAttemptedSubmit) {
      const newErrors = validateFormErrors();
      // Clear vehicle error when vehicle is selected
      delete newErrors.vehicle;
      updateErrors(newErrors);
    }
  };

  const handleAddExtraStop = useCallback(() => {
    addExtraStop();
    if (hasAttemptedSubmit) {
      const newStops = [...reservationInfo.extraStops, ""];
      updateErrors(validateFormErrors(newStops));
    }
  }, [addExtraStop, hasAttemptedSubmit, reservationInfo.extraStops, validateFormErrors]);

  // Memoize vehicle availability to prevent recalculation on every render
  const vehicleAvailability = useMemo(() => {
    const passengerCount = reservationInfo.passengers === '' ? 0 : parseInt(reservationInfo.passengers);
    const bagCount = reservationInfo.bags === '' ? 0 : parseInt(reservationInfo.bags);
    
    return cars.map(car => ({
      ...car,
      isAvailable: car.seats >= passengerCount && car.luggage >= bagCount,
      insufficientSeats: car.seats < passengerCount,
      insufficientLuggage: car.luggage < bagCount
    }));
  }, [reservationInfo.passengers, reservationInfo.bags]);

  // Keep the original availableVehicles for backward compatibility with pricing logic
  const availableVehicles = useMemo(() => {
    return vehicleAvailability.filter(vehicle => vehicle.isAvailable);
  }, [vehicleAvailability]);

  // Sorted vehicles for display - prioritize available vehicles and sort by quality/price
  const sortedVehiclesForDisplay = useMemo(() => {
    return [...vehicleAvailability].sort((a, b) => {
      // First, prioritize available vehicles
      if (a.isAvailable !== b.isAvailable) {
        return b.isAvailable - a.isAvailable; // Available vehicles first
      }
      
      // For vehicles with the same availability status, sort by class priority
      const classOrder = {
        'First Class': 1,
        'First Class Van': 2, 
        'Business Class': 3,
        'Business Van': 4
      };
      
      const aClassPriority = classOrder[a.class] || 999;
      const bClassPriority = classOrder[b.class] || 999;
      
      if (aClassPriority !== bClassPriority) {
        return aClassPriority - bClassPriority; // Lower number = higher priority
      }
      
      // If same class priority, sort by hourly rate (lower rate first for same class)
      return (a.hourlyRate || 0) - (b.hourlyRate || 0);
    });
  }, [vehicleAvailability]);

  // Check if we should show vehicles (both passengers and bags must be selected)
  const shouldShowVehicles = useMemo(() => {
    return reservationInfo.passengers !== '' && reservationInfo.bags !== '';
  }, [reservationInfo.passengers, reservationInfo.bags]);

  // Effect to handle vehicle unselection when it becomes unavailable
  useEffect(() => {
    if (reservationInfo.selectedVehicle) {
      const currentVehicle = vehicleAvailability.find(car => 
        car.id === reservationInfo.selectedVehicle.id
      );
      
      if (currentVehicle && !currentVehicle.isAvailable) {
        setSelectedVehicle(null);
        if (hasAttemptedSubmit) {
          updateErrors(validateFormErrors());
        }
      }
    }
  }, [vehicleAvailability, reservationInfo.selectedVehicle]);

  useEffect(() => {
    if (reservationInfo.routeInfo) {
      // Calculate prices for each vehicle category
      const newPrices = {};
      availableVehicles.forEach(vehicle => {
        const basePrice = calculatePriceByDistance(
          reservationInfo.routeInfo.distanceValue,
          vehicle.category,
          reservationInfo.routeInfo.durationValue
        );
        
        // Check if pickup or dropoff is at an airport
        const isAirport = reservationInfo.pickupDetails?.isAirport || 
                         reservationInfo.dropoffDetails?.isAirport;
        
        // Check if it's night time (between 22:00 and 06:00)
        const time = reservationInfo.time;
        const hour = parseInt(time.split(':')[0]);
        const isNightTime = hour >= 22 || hour < 6;
        
        // Check if it's weekend
        const date = new Date(reservationInfo.date);
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        
        const finalPrice = addSurcharges(basePrice, {
          isAirport,
          isNightTime,
          isWeekend
        });
        
        newPrices[vehicle.id] = finalPrice;
      });
      setPrices(newPrices);
    }
  }, [reservationInfo.routeInfo, availableVehicles, reservationInfo.time, reservationInfo.date]);

  // Format date to dd-mm-yyyy
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  // Calculate prices for all vehicles
  useEffect(() => {
    const newPrices = {};
    vehicleAvailability.forEach(vehicle => {
      if (reservationInfo.isHourly) {
        // Calculate hourly price
        newPrices[vehicle.id] = calculatePrice(
          0, // distance not used for hourly
          0, // duration not used
          vehicle.name,
          0, // extra stops not used
          true, // isHourly
          reservationInfo.hours || 3 // use current hours or minimum 3
        );
      } else {
        // Calculate transfer price
        const basePrice = calculatePrice(
          reservationInfo.totalDistance / 1000 || 0, // Convert meters to km or use default
          0, // duration not used
          vehicle.name,
          reservationInfo.extraStops?.length || 0,
          false // not hourly
        );
        
        // Apply surcharges
        const isAirport = reservationInfo.pickupDetails?.isAirport || reservationInfo.dropoffDetails?.isAirport;
        const hour = parseInt(reservationInfo.time?.split(':')[0]) || 0;
        const isNightTime = hour >= 22 || hour < 6;
        const date = new Date(reservationInfo.date);
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        
        newPrices[vehicle.id] = addSurcharges(basePrice, {
          isAirport,
          isNightTime,
          isWeekend
        });
      }
    });
    setPrices(newPrices);
  }, [reservationInfo, vehicleAvailability]);

  // Add handler to clear errors when dropdown values change
  const handleDropdownChange = (e) => {
    handleInput(e);
    
    // Clear specific errors when values are selected
    if (hasAttemptedSubmit && errors) {
      const { name } = e.target;
      const newErrors = { ...errors };
      
      // Clear field-specific error when value is selected
      if (name === 'passengers' && e.target.value !== '') {
        delete newErrors.passengers;
      }
      if (name === 'bags' && e.target.value !== '') {
        delete newErrors.bags;
      }
      
      // Clear vehicle-related errors when selections change
      if ((name === 'passengers' || name === 'bags') && e.target.value !== '') {
        delete newErrors.vehicle;
      }
      
      setErrors(newErrors);
    }
  };

  return (
    <div className="bg-gradient-to-br from-warm-gray/5 via-cream/3 to-soft-gray/5">
      {/* Softer Animated Background Elements */}
      <div className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }}>
        <div className="absolute top-20 left-10 w-20 h-20 bg-royal-blue/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gold/15 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-warm-gray/20 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-royal-blue/8 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-cream/15 to-gold/10 rounded-full blur-xl animate-float"></div>
      </div>

      <div className="container-default mt-28 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-semibold mb-8 text-gray-700">
            <span className="text-royal-blue">Select</span> Vehicle
          </h1>
          
          <ProgressBar />

          <div className="h-[400px] md:h-[500px] w-full mb-6">
            {reservationInfo.pickup && (
              <MapPreview
                origin={reservationInfo.pickup}
                destination={!reservationInfo.isHourly ? reservationInfo.dropoff : null}
                extraStops={!reservationInfo.isHourly ? reservationInfo.extraStops : []}
                routeInfo={reservationInfo.routeInfo}
              />
            )}
          </div>
          
          <div className="bg-warm-white/90 backdrop-blur-md p-6 rounded-xl border border-royal-blue/20 shadow-lg">
            <div className="mb-4">
              <p className="text-sm">{formatDate(reservationInfo.date)}</p>
              <p className="text-sm">{reservationInfo.time} (Swiss Time)</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="inline-flex items-center">
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"/>
                    <circle cx="12" cy="9" r="2.5"/>
                  </svg>
                  {reservationInfo.isHourly ? 'HOURLY SERVICE' : 'DISTANCE TRANSFER'}
                </span>
                <span>• {reservationInfo.isHourly ? `${reservationInfo.hours || 0} hours` : `${reservationInfo.distance || '0'} KM`}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <div className="flex flex-col items-center">
                    <svg className="w-5 h-5 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    {!reservationInfo.isHourly && (
                      <div className="h-8 w-[1px] bg-zinc-600"></div>
                    )}
                  </div>
                  <div>
                    <p>{reservationInfo.pickup || 'ZÜRICH,'}</p>
                    {reservationInfo.isHourly && (
                      <p className="text-sm text-zinc-400 mt-1">Service area coverage: Within Switzerland</p>
                    )}
                  </div>
                </div>

                {!reservationInfo.isHourly && (
                  <>
                    {/* Extra stops section - hidden but preserved */}
                    <div className="hidden">
                      {reservationInfo.extraStops.map((stop, index) => (
                        <div key={index} className="pl-4">
                          <div className="flex items-start gap-2">
                            <div className="flex flex-col items-center">
                              <svg className="w-5 h-5 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                              </svg>
                              <div className="h-8 w-[1px] bg-zinc-600"></div>
                            </div>
                            <div className="w-full flex gap-2 items-start">
                              <AddressInput
                                name={`extraStop-${index}`}
                                value={stop}
                                onChange={(e) => updateStop(index, e.target.value)}
                                placeholder="Enter extra stop location"
                                className={hasAttemptedSubmit && !stop.trim() && errors.extraStops ? 'border-red-500' : ''}
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveExtraStop(index)}
                                className="text-zinc-400 hover:text-white transition-colors p-2"
                                title="Remove this stop"
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="pl-4">
                        <button 
                          type="button"
                          onClick={handleAddExtraStop}
                          className="text-sm text-zinc-400 hover:text-white transition-colors my-2 flex items-center gap-1"
                          disabled={reservationInfo.extraStops.length >= 10}
                        >
                          <div className="w-5 flex justify-center">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                              <path d="M12 8v8m-4-4h8" strokeWidth="2"/>
                            </svg>
                          </div>
                          <span>
                            ADD EXTRA STOP {reservationInfo.extraStops.length < 10 ? '(' + (10 - reservationInfo.extraStops.length) + ' REMAINING)' : '(MAX REACHED)'}
                          </span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col items-center">
                        <svg className="w-5 h-5 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                        </svg>
                      </div>
                      <div>
                        <p>{reservationInfo.dropoff}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

            </div>

            {!reservationInfo.isHourly ? (
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="bg-royal-blue/10 border border-royal-blue/20 rounded-lg p-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-royal-blue" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Total Distance: {reservationInfo.routeInfo?.distance || '0 km'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-royal-blue" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Total Duration: {reservationInfo.routeInfo?.duration || '0 min'}</span>
                    </div>
                  </div>
                  <p className="hidden text-xs text-gray-600 mt-3">
                    * Total duration includes estimated traffic and processing time at each stop.
                  </p>
                </div>

                <div className="bg-cream-light/80 border border-royal-blue/20 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    Need multiple stops? Consider:
                    <br/>• <span className="font-medium text-royal-blue">Hourly booking</span> - Vehicle at your disposal
                    <br/>• <span className="font-medium text-royal-blue">Special request</span> - Craft a custom plan just for you
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 bg-royal-blue/10 border border-royal-blue/20 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-royal-blue" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Duration: {reservationInfo.hours || 3} hours</span>
                </div>
                <div className="mt-3 space-y-1">
                  <p className="text-xs text-gray-600">
                    * For hourly bookings, the vehicle and chauffeur will remain at your disposal throughout the duration, starting from the pickup location.
                  </p>
                  <p className="text-xs text-gray-600">
                    * Each hour includes up to 20km of driving. Distance exceeding this limit will be billed additionally at service completion.
                  </p>
                </div>
              </div>
            )}
          </div>

          <form 
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
              // Only prevent form submission for regular inputs, allow new lines in textareas
              if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
                e.preventDefault();
              }
            }}
          >
            <div className="grid md:grid-cols-2 gap-6 mb-8 mt-8">
              <NumberDropdown
                id="passengers"
                name="passengers"
                value={reservationInfo.passengers}
                onChange={handleDropdownChange}
                min={1}
                max={getMaxPassengers()}
                label="Number of Passengers *"
                error={errors.passengers}
              />
              
              <NumberDropdown
                id="bags"
                name="bags"
                value={reservationInfo.bags}
                onChange={handleDropdownChange}
                min={0}
                max={getMaxBags()}
                label="Number of Bags"
                error={errors.bags}
              />
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-medium mb-4 text-gray-700">Our Vehicle Fleet</h2>
              
              {/* Vehicle Selection Error - positioned below Available Vehicles heading */}
              {hasAttemptedSubmit && errors.vehicle && (
                <div id="vehicle-error" className="mb-4 text-red-500 text-sm bg-red-500/10 px-4 py-3 rounded-lg border border-red-500/20">
                  <svg className="w-4 h-4 inline-block mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  {errors.vehicle}
                </div>
              )}
              
              {!shouldShowVehicles ? (
                <div className="bg-cream-light/80 backdrop-blur-sm border border-royal-blue/20 rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <svg className="w-12 h-12 text-royal-blue/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
                      <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
                      <path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5"/>
                    </svg>
                    <div>
                      <p className="text-lg font-medium text-gray-700 mb-2">Select Passenger and Bag Count</p>
                      <p className="text-sm text-gray-600">
                        Please choose the number of passengers and bags above to see our vehicle fleet.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {sortedVehiclesForDisplay.map((vehicle) => {
                    const isSelected = reservationInfo.selectedVehicle?.id === vehicle.id;
                    const isLocked = !vehicle.isAvailable;
                    
                    return (
                      <div
                        key={vehicle.id}
                        onClick={() => handleVehicleSelect(vehicle)}
                        className={`p-6 rounded-lg transition-all duration-300 ${
                          isLocked
                            ? "bg-gray-100/80 border border-gray-300/50 cursor-not-allowed opacity-60"
                            : isSelected
                            ? "bg-gradient-to-br from-gold/20 to-royal-blue/10 border-2 border-gold shadow-lg transform scale-105 cursor-pointer"
                            : "bg-warm-white/80 backdrop-blur-sm border border-royal-blue/20 hover:border-gold/50 hover:shadow-lg hover:transform hover:scale-102 cursor-pointer"
                        }`}
                      >
                        <div className="relative">
                          <VehicleImage
                            src={vehicle.image}
                            alt={vehicle.name}
                            containerClassName="h-48 mb-4"
                          />
                          {isLocked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center">
                                <svg className="w-8 h-8 text-gray-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                <p className="text-xs font-medium text-red-600">
                                  {vehicle.insufficientSeats && vehicle.insufficientLuggage
                                    ? "Too many passengers and bags"
                                    : vehicle.insufficientSeats
                                    ? "Too many passengers selected"
                                    : "Too many bags selected"}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <h3 className={`text-xl font-medium mb-2 ${isLocked ? 'text-gray-500' : 'text-gray-700'}`}>
                          {vehicle.name}
                        </h3>
                        
                        <div className={`text-sm mb-4 ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
                          <p className="flex items-center gap-1">
                            Seats: {vehicle.seats}
                            {vehicle.insufficientSeats && (
                              <span className="text-red-500 text-xs">
                                (you selected {reservationInfo.passengers})
                              </span>
                            )}
                          </p>
                          <p className="flex items-center gap-1">
                            Luggage: {vehicle.luggage}
                            {vehicle.insufficientLuggage && (
                              <span className="text-red-500 text-xs">
                                (you selected {reservationInfo.bags})
                              </span>
                            )}
                          </p>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-royal-blue/20">
                          <div className={`text-sm font-medium ${isLocked ? 'text-gray-400' : 'text-royal-blue'}`}>
                            {reservationInfo.isHourly ? (
                              <p>{formatPrice(prices[vehicle.id] || 0)} for {reservationInfo.hours || 3} hours</p>
                            ) : (
                              <p>{formatPrice(prices[vehicle.id] || 0)}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleBack}
                  className="bg-warm-white/80 backdrop-blur-sm border-royal-blue/30 text-gray-700 hover:bg-royal-blue/10"
                >
                  Back
                </Button>
                <div className="flex flex-col items-end gap-2">
                  <Button 
                    type="submit" 
                    variant="secondary"
                    className={`bg-gradient-to-r from-royal-blue to-royal-blue-light hover:from-royal-blue-light hover:to-royal-blue text-white shadow-lg hover:shadow-xl transition-all duration-300 ${hasAttemptedSubmit && (errors.vehicle || errors.extraStops || errors.passengers || errors.bags) ? 'border-red-500 ring-1 ring-red-500/50' : ''}`}
                  >
                    Continue
                  </Button>
                  {hasAttemptedSubmit && errors.extraStops && (
                    <div className="text-red-500 text-sm bg-red-500/10 px-3 py-1.5 rounded border border-red-500/20">
                      <svg className="w-4 h-4 inline-block mr-1" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                      {"Please fill in or remove empty stops"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VehicleSelection;