import { useContext, useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ReservationContext from "../../contexts/ReservationContext";
import Button from "../../components/Button";
import ProgressBar from "../../components/ProgressBar";
import AddressInput from "../../components/AddressInput";
import cars from "../../data/cars";

const VehicleSelection = ({ scrollUp }) => {
  const navigate = useNavigate();
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

  useEffect(() => {
    latestStopsRef.current = reservationInfo.extraStops;
  }, [reservationInfo.extraStops]);

  // Check if we have the required data from the previous step
  useEffect(() => {
    if (!reservationInfo.pickup || 
        (!reservationInfo.isHourly && !reservationInfo.dropoff) || 
        !reservationInfo.date || 
        !reservationInfo.time ||
        (reservationInfo.isHourly && (!reservationInfo.hours || reservationInfo.hours < 2 || reservationInfo.hours > 24))
    ) {
      navigate('/');
    }
  }, [reservationInfo, navigate]);

  const hasEmptyStops = useMemo(() => {
    return reservationInfo.extraStops.some(stop => !stop.trim());
  }, [reservationInfo.extraStops]);

  const validateFormErrors = (stops = reservationInfo.extraStops) => {
    const newErrors = {};
    const passengerCount = reservationInfo.passengers === '' ? 0 : reservationInfo.passengers;
    const bagCount = reservationInfo.bags === '' ? 0 : reservationInfo.bags;
    
    if (passengerCount < 1) {
      newErrors.passengers = "At least 1 passenger is required";
    }
    if (bagCount < 0) {
      newErrors.bags = "Number of bags cannot be negative";
    }
    if (!reservationInfo.selectedVehicle) {
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
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      navigate('/customer-details');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleRemoveExtraStop = (index) => {
    const newStops = [...latestStopsRef.current];
    newStops.splice(index, 1);
    removeExtraStop(index);
    
    // Only validate if user has attempted to submit
    if (hasAttemptedSubmit) {
      updateErrors(validateFormErrors(newStops));
    }
  };

  const updateStop = (index, value) => {
    const newStops = [...reservationInfo.extraStops];
    newStops[index] = value;
    updateExtraStop(index, value);

    if (hasAttemptedSubmit) {
      updateErrors(validateFormErrors(newStops));
    }
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    if (hasAttemptedSubmit) {
      const newErrors = validateFormErrors();
      // Clear vehicle error when vehicle is selected
      delete newErrors.vehicle;
      updateErrors(newErrors);
    }
  };

  const handleAddExtraStop = () => {
    addExtraStop();
    if (hasAttemptedSubmit) {
      const newStops = [...reservationInfo.extraStops, ""];
      updateErrors(validateFormErrors(newStops));
    }
  };

  // Memoize available vehicles to prevent recalculation on every render
  const availableVehicles = useMemo(() => {
    const passengerCount = reservationInfo.passengers === '' ? 0 : reservationInfo.passengers;
    const bagCount = reservationInfo.bags === '' ? 0 : reservationInfo.bags;
    return cars.filter(car => 
      car.seats >= passengerCount && 
      car.luggage >= bagCount
    );
  }, [reservationInfo.passengers, reservationInfo.bags]);

  // Effect to handle vehicle unselection when it becomes unavailable
  useEffect(() => {
    if (reservationInfo.selectedVehicle) {
      const isCurrentVehicleAvailable = availableVehicles.some(car => 
        car.id === reservationInfo.selectedVehicle.id
      );
      
      if (!isCurrentVehicleAvailable) {
        setSelectedVehicle(null);
        if (hasAttemptedSubmit) {
          updateErrors(validateFormErrors());
        }
      }
    }
  }, [availableVehicles, reservationInfo.selectedVehicle]);

  return (
    <div className="container-default mt-28">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-semibold mb-8">Select Vehicle</h1>
        
        <ProgressBar />
        
        <div className="bg-zinc-800/30 p-6 rounded-lg border border-zinc-700/50 mb-8">
          <div className="mb-4">
            <p className="text-sm">{reservationInfo.date}</p>
            <p className="text-sm">{reservationInfo.time} (CET/CEST)</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="inline-flex items-center">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
                {reservationInfo.isHourly ? 'HOURLY TRANSFER' : 'DISTANCE TRANSFER'}
              </span>
              <span>• {reservationInfo.isHourly ? `${reservationInfo.hours || 2} hours` : `${reservationInfo.distance || '46.5'} KM`}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-start gap-2">
              <div className="flex flex-col items-center">
                <svg className="w-5 h-5 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <div className="h-8 w-[1px] bg-zinc-600"></div>
              </div>
              <div>
                <p>{reservationInfo.pickup || 'ZÜRICH,'}</p>
              </div>
            </div>
            
            {reservationInfo.extraStops.map((stop, index) => (
              <div key={index} className="pl-4">
                <div className="flex items-start gap-2">
                  <div className="flex flex-col items-center">
                    <svg className="w-5 h-5 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                    </svg>
                    <div className="h-8 w-[1px] bg-zinc-600"></div>
                  </div>
                  <div className="w-1/2 flex gap-2 items-start">
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
                    {errors.extraStops && !stop.trim() && (
                      <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                    )}
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

            <div className="flex items-start gap-2">
              <div className="flex flex-col items-center">
                <svg className="w-5 h-5 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                </svg>
              </div>
              <div>
                <p>{reservationInfo.dropoff || 'AARAU,'}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span>TOTAL DISTANCE</span>
              <span>•</span>
              <span>{reservationInfo.distance || '46.5'} km</span>
              <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <path d="M12 8v8M8 12h8" strokeWidth="2"/>
              </svg>
            </div>
            <div className="flex items-center gap-1">
              <span>TOTAL DURATION</span>
              <span>•</span>
              <span>{reservationInfo.duration || '36'} minutes</span>
              <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <path d="M12 8v8M8 12h8" strokeWidth="2"/>
              </svg>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="passengers">
                Number of Passengers *
              </label>
              <input
                type="number"
                id="passengers"
                name="passengers"
                min="1"
                max="8"
                value={reservationInfo.passengers}
                onChange={handleInput}
                className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50"
                required
              />
              {errors.passengers && (
                <span className="text-red-500 text-sm">{errors.passengers}</span>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="bags">
                Number of Bags
              </label>
              <input
                type="number"
                id="bags"
                name="bags"
                min="0"
                max="8"
                value={reservationInfo.bags}
                onChange={handleInput}
                className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50"
              />
              {errors.bags && (
                <span className="text-red-500 text-sm">{errors.bags}</span>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-medium mb-4">Available Vehicles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {availableVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  onClick={() => handleVehicleSelect(vehicle)}
                  className={`p-6 rounded-lg cursor-pointer transition-all ${
                    reservationInfo.selectedVehicle?.id === vehicle.id
                      ? "bg-gold/20 border-2 border-gold"
                      : "bg-zinc-800/30 border border-zinc-700/50 hover:border-gold/50"
                  }`}
                >
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-48 object-contain mb-4"
                  />
                  <h3 className="text-xl font-medium mb-2">{vehicle.name}</h3>
                  <div className="text-sm text-zinc-400">
                    <p>Seats: {vehicle.seats}</p>
                    <p>Luggage: {vehicle.luggage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <Button
                type="button"
                variant="secondary"
                onClick={handleBack}
              >
                Back
              </Button>
              <div className="flex flex-col items-end gap-1">
                {hasAttemptedSubmit && (errors.vehicle || errors.extraStops) && (
                  <div className="text-red-500 text-sm bg-red-500/10 px-3 py-1.5 rounded border border-red-500/20 mb-1">
                    <svg className="w-4 h-4 inline-block mr-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    {errors.vehicle || "Please fill in or remove empty stops"}
                  </div>
                )}
                <Button type="submit" variant="secondary">
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleSelection;