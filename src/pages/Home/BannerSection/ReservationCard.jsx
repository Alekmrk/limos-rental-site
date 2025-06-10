import { useState, useContext, useRef, useEffect } from "react";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import ReservationContext from "../../../contexts/ReservationContext";
import TimeInput from "../../../components/TimeInput";
import DateInput from "../../../components/DateInput";
import { validateAddresses } from "../../../services/GoogleMapsService";
import { useGoogleMapsApi } from "../../../hooks/useGoogleMapsApi";

const ReservationCard = () => {
  const navigate = useNavigate();
  const { 
    reservationInfo, 
    handleInput: originalHandleInput, 
    setIsHourly, 
    setIsSpecialRequest,
    handlePlaceSelection 
  } = useContext(ReservationContext);
  const { isLoaded } = useGoogleMapsApi();
  const [errors, setErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);
  
  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);
  const pickupAutocomplete = useRef(null);
  const dropoffAutocomplete = useRef(null);

  useEffect(() => {
    if (!isLoaded || !window.google) return;
    if (reservationInfo.isHourly || reservationInfo.isSpecialRequest) return; // Don't initialize if in hourly or special mode

    // Swiss bounds
    const switzerlandBounds = {
      north: 47.8084,
      south: 45.8179,
      west: 5.9566,
      east: 10.4915
    };

    const bounds = new window.google.maps.LatLngBounds(
      { lat: switzerlandBounds.south, lng: switzerlandBounds.west },
      { lat: switzerlandBounds.north, lng: switzerlandBounds.east }
    );

    const setupAutocomplete = (inputRef, autocompleteRef, type) => {
      if (!inputRef.current) return; // Don't initialize if input doesn't exist
      
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }

      const options = {
        bounds,
        fields: ["formatted_address", "geometry", "place_id", "address_components", "name", "types"],
        strictBounds: false,
        componentRestrictions: { country: ['ch', 'de', 'fr', 'it', 'at', 'li'] }
      };

      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, options);
      autocompleteRef.current.addListener("place_changed", () => {
        // Clear error when place is selected
        setErrors(prev => ({ ...prev, [type]: undefined }));
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
          const countryComponent = place.address_components?.find(
            component => component.types.includes("country")
          );

          const isSwiss = countryComponent?.short_name === "CH";
          const isSpecialLocation = place.types?.some(type => 
            ['airport', 'train_station', 'transit_station', 'premise', 'point_of_interest'].includes(type)
          );

          const displayName = isSpecialLocation ? place.name : place.formatted_address;

          handlePlaceSelection(type, {
            formattedAddress: displayName,
            location: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            },
            placeId: place.place_id,
            isSwiss,
            originalName: place.name,
            types: place.types
          });
          
          inputRef.current.value = displayName;
        }
      });
    };

    setupAutocomplete(pickupRef, pickupAutocomplete, 'pickup');
    if (!reservationInfo.isHourly) {
      setupAutocomplete(dropoffRef, dropoffAutocomplete, 'dropoff');
    }

    return () => {
      if (window.google) {
        if (pickupAutocomplete.current) {
          window.google.maps.event.clearInstanceListeners(pickupAutocomplete.current);
        }
        if (dropoffAutocomplete.current) {
          window.google.maps.event.clearInstanceListeners(dropoffAutocomplete.current);
        }
      }
    };
  }, [isLoaded, handlePlaceSelection, reservationInfo.isHourly, reservationInfo.isSpecialRequest]);

  const handleModeChange = (mode) => {
    // Clear all errors when switching modes
    setErrors({});
    
    if (mode === 'hourly') {
      setIsHourly(true);
    } else if (mode === 'special') {
      setIsSpecialRequest(true);
    } else {
      setIsHourly(false);
      setIsSpecialRequest(false);
    }
  };

  const validateForm = async () => {
    const newErrors = {};
    
    // Date and time validation
    if (!reservationInfo.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(reservationInfo.date);
      const now = new Date();
      
      // Convert current time to Swiss timezone
      const swissNow = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Zurich' }));
      
      // Set both dates to start of day for comparison
      const selectedDateStart = new Date(selectedDate);
      selectedDateStart.setHours(0, 0, 0, 0);
      const swissNowStart = new Date(swissNow);
      swissNowStart.setHours(0, 0, 0, 0);
      
      if (selectedDateStart < swissNowStart) {
        newErrors.date = "Date cannot be in the past";
      }
      
      // If date is today, check if time is at least 3 hours in advance
      if (reservationInfo.time && selectedDateStart.getTime() === swissNowStart.getTime()) {
        const [hours, minutes] = reservationInfo.time.split(':').map(Number);
        const selectedTime = new Date(selectedDate);
        selectedTime.setHours(hours, minutes);
        
        const minAllowedTime = new Date(swissNow);
        minAllowedTime.setHours(swissNow.getHours() + 3);
        
        if (selectedTime < minAllowedTime) {
          newErrors.time = "Must book 3h in advance";
        }
      }
    }
    
    if (!reservationInfo.time) {
      newErrors.time = "Time is required";
    }

    if (!reservationInfo.isSpecialRequest) {
      if (!pickupRef.current.value) newErrors.pickup = "Pick up location is required";
      if (!reservationInfo.isHourly && !dropoffRef.current.value) {
        newErrors.dropoff = "Drop off location is required";
      }
      if (reservationInfo.isHourly) {
        const hours = parseInt(reservationInfo.hours) || 0;
        if (hours < 2 || hours > 24) {
          newErrors.hours = "Hours must be between 2 and 24";
        }
      }

      // Validate Switzerland location requirement only if addresses are provided
      if (!Object.keys(newErrors).length && reservationInfo.pickupPlaceInfo) {
        try {
          const validation = await validateAddresses(
            reservationInfo.pickupPlaceInfo,
            reservationInfo.dropoffPlaceInfo
          );
          if (!validation.isValid) {
            newErrors.pickup = validation.error;
          }
        } catch (error) {
          console.error('Error validating addresses:', error);
          newErrors.pickup = "Error validating addresses. Please try again.";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInput = (e) => {
    // Clear error for the field being typed in
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
    originalHandleInput(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValidating) return;

    setIsValidating(true);
    const isValid = await validateForm();
    setIsValidating(false);

    if (isValid) {
      if (reservationInfo.isSpecialRequest) {
        navigate('/customer-details');
      } else {
        navigate('/vehicle-selection');
      }
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      onKeyDown={(e) => {
        // Only prevent form submission for regular inputs, allow new lines in textareas
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
          e.preventDefault();
        }
      }}
      className="reservation reserve-card w-[90%] max-w-[420px] p-8 sm:p-8 mx-auto md:mx-0 md:absolute md:bottom-12 md:right-8 lg:right-16 shadow-2xl bg-zinc-800/70 backdrop-blur-md border border-zinc-700/30 rounded-[2rem] text-left text-[14px] transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-zinc-600/40 z-50"
    >
      <div className="flex justify-center gap-3 pb-4 relative">
        <button
          type="button"
          onClick={() => handleModeChange('distance')}
          className={
            !reservationInfo.isHourly && !reservationInfo.isSpecialRequest
              ? "py-2.5 px-4 rounded-xl active shadow-lg transform transition-all duration-200"
              : "py-2.5 px-4 rounded-xl text-neutral-400 hover:text-gold transition-all duration-200 hover:bg-zinc-800/50"
          }
        >
          Distance
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('hourly')}
          className={
            reservationInfo.isHourly
              ? "py-2.5 px-4 rounded-xl active shadow-lg transform transition-all duration-200"
              : "py-2.5 px-4 rounded-xl text-neutral-400 hover:text-gold transition-all duration-200 hover:bg-zinc-800/50"
          }
        >
          Hourly
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('special')}
          className={
            reservationInfo.isSpecialRequest
              ? "py-2.5 px-4 rounded-xl active shadow-lg transform transition-all duration-200"
              : "py-2.5 px-4 rounded-xl text-neutral-400 hover:text-gold transition-all duration-200 hover:bg-zinc-800/50"
          }
        >
          Special
        </button>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r"></div>
      </div>
      
      <div className="space-y-5 mt-2 min-h-[250px]">
        {!reservationInfo.isSpecialRequest ? (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm uppercase mb-2 tracking-wide" htmlFor="pickup">
                  Pick-up point
                </label>
                <div className="relative">
                  <input
                    ref={pickupRef}
                    type="text"
                    placeholder="TYPE LOCATION..."
                    name="pickup"
                    id="pickup"
                    defaultValue={reservationInfo.pickup}
                    onChange={handleInput}
                    className={`bg-zinc-800/30 rounded-xl py-3 px-4 w-full border text-white transition-all duration-200 hover:border-zinc-600 focus:border-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] ${
                      errors.pickup && errors.pickup !== "At least one location must be in Switzerland" ? 'border-red-500 ring-1 ring-red-500/50 animate-shake' : 'border-zinc-700/50'
                    }`}
                    autoComplete="off"
                  />
                  {errors.pickup && errors.pickup !== "At least one location must be in Switzerland" && (
                    <div className="absolute left-1/8 right-0 bottom-0 w-4/4 translate-y-1/2 bg-zinc-800/40 text-red-500 text-[11px] py-1 px-3 rounded-2xl z-10 text-right backdrop-blur-sm">
                      {errors.pickup}
                    </div>
                  )}
                </div>
              </div>

              {!reservationInfo.isHourly && (
                <div>
                  <label className="block text-sm uppercase mb-2 tracking-wide" htmlFor="dropoff">
                    Drop-off point
                  </label>
                  <div className="relative">
                    <input
                      ref={dropoffRef}
                      type="text"
                      placeholder="TYPE LOCATION..."
                      name="dropoff"
                      id="dropoff"
                      defaultValue={reservationInfo.dropoff}
                      onChange={handleInput}
                      className={`bg-zinc-800/30 rounded-xl py-3 px-4 w-full border text-white transition-all duration-200 hover:border-zinc-600 focus:border-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] ${
                        errors.dropoff && errors.dropoff !== "At least one location must be in Switzerland" ? 'border-red-500 ring-1 ring-red-500/50 animate-shake' : 'border-zinc-700/50'
                      }`}
                      autoComplete="off"
                    />
                    {errors.dropoff && errors.dropoff !== "At least one location must be in Switzerland" && (
                      <div className="absolute left-1/8 right-0 bottom-0 w-4/4 translate-y-1/2 bg-zinc-800/40 text-red-500 text-[11px] py-1 px-3 rounded-2xl z-10 text-right backdrop-blur-sm">
                        {errors.dropoff}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {reservationInfo.isHourly && (
                <div>
                  <label className="block text-sm uppercase mb-2 tracking-wide" htmlFor="hours">
                    Duration (hours)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      onInvalid={(e) => e.preventDefault()}
                      min="2"
                      max="24"
                      name="hours"
                      id="hours"
                      value={reservationInfo.hours || ''}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        // Only clear the error, validation will happen on form submit
                        setErrors(prev => ({ ...prev, hours: undefined }));
                        handleInput(e);
                      }}
                      className={`bg-zinc-800/30 rounded-xl py-3 px-4 w-full border text-white transition-all duration-200 hover:border-zinc-600 focus:border-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] ${
                        errors.hours ? 'border-red-500 ring-1 ring-red-500/50 animate-shake' : 'border-zinc-700/50'
                      }`}
                      placeholder="Enter hours (2-24)"
                    />
                    {errors.hours && (
                      <div className="absolute left-1/8 right-0 bottom-0 w-4/4 translate-y-1/2 bg-zinc-800/40 text-red-500 text-[11px] py-1 px-3 rounded-2xl z-10 text-right backdrop-blur-sm">
                        {errors.hours}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm uppercase mb-2 tracking-wide" htmlFor="date">
                  Date
                </label>
                <div className="relative">
                  <DateInput
                    value={reservationInfo.date}
                    onChange={(e) => {
                      setErrors(prev => ({ ...prev, date: undefined }));
                      handleInput(e);
                    }}
                    name="date"
                    id="date"
                    className={`bg-zinc-800/30 rounded-xl py-3 px-4 w-full border text-white transition-all duration-200 hover:border-zinc-600 focus:border-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] ${
                      errors.date ? 'border-red-500 ring-1 ring-red-500/50 animate-shake' : 'border-zinc-700/50'
                    }`}
                  />
                  {errors.date && (
                    <div className="absolute left-1/8 right-0 bottom-0 w-4/4 translate-y-1/2 bg-zinc-800/40 text-red-500 text-[11px] py-1 px-3 rounded-2xl z-10 text-right backdrop-blur-sm">
                      {errors.date}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm uppercase mb-2 tracking-wide" htmlFor="time">
                  When do you want to be picked up?
                </label>
                <div className="relative">
                  <TimeInput
                    value={reservationInfo.time}
                    onChange={(e) => {
                      setErrors(prev => ({ ...prev, time: undefined }));
                      handleInput(e);
                    }}
                    name="time"
                    id="time"
                    className={`bg-zinc-800/30 rounded-xl py-3 px-4 w-full border text-white transition-all duration-200 hover:border-zinc-600 focus:border-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] ${
                      errors.time ? 'border-red-500 ring-1 ring-red-500/50 animate-shake' : 'border-zinc-700/50'
                    }`}
                  />
                  {errors.time && (
                    <div className="absolute left-1/8 right-0 bottom-0 w-4/4 translate-y-1/2 bg-zinc-800/40 text-red-500 text-[11px] py-1 px-3 rounded-2xl z-10 text-right backdrop-blur-sm">
                      {errors.time}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-sm text-neutral-400 mt-4">
                <p>For non-airport rides the chauffeur will wait 15m at no cost.</p>
                <p>For airport transfers the chauffeur will wait 60m at no cost.</p>
                {reservationInfo.isHourly && (
                  <p className="mt-2">For hourly bookings, the vehicle and chauffeur will remain at your disposal throughout the duration.</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 text-neutral-400 text-sm border border-gold/20 rounded-xl p-4 bg-gold/5">
              <p>Enter your preferred date and time.</p>
              <p>We'll discuss your requirements in the next step.</p>
              <p className="mt-2">Perfect for:</p>
              <ul className="list-disc ml-5 mt-1">
                <li>Multi-city tours</li>
                <li>Wedding transportation</li>
                <li>Corporate events</li>
                <li>Custom itineraries</li>
              </ul>
            </div>

            <div>
              <label className="block text-sm uppercase mb-2 tracking-wide" htmlFor="date">
                Date
              </label>
              <div className="relative">
                <DateInput
                  value={reservationInfo.date}
                  onChange={(e) => {
                    setErrors(prev => ({ ...prev, date: undefined }));
                    handleInput(e);
                  }}
                  name="date"
                  id="date"
                  className={`bg-zinc-800/30 rounded-xl py-3 px-4 w-full border text-white transition-all duration-200 hover:border-zinc-600 focus:border-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] ${
                    errors.date ? 'border-red-500 ring-1 ring-red-500/50 animate-shake' : 'border-zinc-700/50'
                  }`}
                />
                {errors.date && (
                  <div className="absolute left-1/8 right-0 bottom-0 w-4/4 translate-y-1/2 bg-zinc-800/40 text-red-500 text-[11px] py-1 px-3 rounded-2xl z-10 text-right backdrop-blur-sm">
                    {errors.date}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm uppercase mb-2 tracking-wide" htmlFor="time">
                Preferred pick-up time
              </label>
              <div className="relative">
                <TimeInput
                  value={reservationInfo.time}
                  onChange={(e) => {
                    setErrors(prev => ({ ...prev, time: undefined }));
                    handleInput(e);
                  }}
                  name="time"
                  id="time"
                  className={`bg-zinc-800/30 rounded-xl py-3 px-4 w-full border text-white transition-all duration-200 hover:border-zinc-600 focus:border-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] ${
                    errors.time ? 'border-red-500 ring-1 ring-red-500/50 animate-shake' : 'border-zinc-700/50'
                  }`}
                />
                {errors.time && (
                  <div className="absolute left-1/8 right-0 bottom-0 w-4/4 translate-y-1/2 bg-zinc-800/40 text-red-500 text-[11px] py-1 px-3 rounded-2xl z-10 text-right backdrop-blur-sm">
                    {errors.time}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Error container with error on the button's top border */}
        <div className="relative">
          <div className="flex justify-center mt-8">
            <div className="relative w-full">
              {(errors.pickup === "At least one location must be in Switzerland" || errors.dropoff === "At least one location must be in Switzerland") && (
                <div className="absolute left-1/8 right-0 top-0 w-4/4 translate-y-[-50%] bg-zinc-800/40 text-red-500 text-[11px] py-1 px-3 rounded-2xl z-10 text-right backdrop-blur-sm">
                  At least one location must be in Switzerland
                </div>
              )}
              <Button 
                type="submit" 
                variant="secondary" 
                className={`w-full py-4 text-base font-medium tracking-wide transition-all duration-200 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] ${
                  (errors.pickup === "At least one location must be in Switzerland" || errors.dropoff === "At least one location must be in Switzerland")
                    ? 'border-red-500 ring-1 ring-red-500/50 animate-shake'
                    : ''
                }`}
                disabled={isValidating}
              >
                {isValidating ? "Validating..." : (reservationInfo.isSpecialRequest ? "Continue to Request Details" : "Reserve Now")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ReservationCard;
