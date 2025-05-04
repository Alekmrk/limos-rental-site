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
    handleInput, 
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
    setupAutocomplete(dropoffRef, dropoffAutocomplete, 'dropoff');

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
  }, [isLoaded, handlePlaceSelection]);

  const handleModeChange = (mode) => {
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
          newErrors.time = "Booking must be at least 3 hours in advance";
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
    <form onSubmit={handleSubmit} className="reservation reserve-card w-[90%] max-w-[420px] p-8 sm:p-8 mx-auto md:mx-0 md:absolute md:bottom-12 md:right-8 lg:right-16 shadow-2xl bg-zinc-800/70 backdrop-blur-md border border-zinc-700/30 rounded-[2rem] text-left text-[14px] transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-zinc-600/40">
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
            <div className="relative">
              <input
                ref={pickupRef}
                type="text"
                placeholder="Pick Up Address"
                name="pickup"
                defaultValue={reservationInfo.pickup}
                className={`bg-zinc-800/30 rounded-xl py-3 px-4 w-full border text-white transition-all duration-200 hover:border-zinc-600 focus:border-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] ${
                  errors.pickup ? 'border-red-500' : 'border-zinc-700/50'
                }`}
                autoComplete="off"
              />
              {errors.pickup && <span className="text-red-500 text-sm absolute -bottom-5">{errors.pickup}</span>}
            </div>

            {!reservationInfo.isHourly && (
              <div className="relative">
                <input
                  ref={dropoffRef}
                  type="text"
                  placeholder="Drop Off Address"
                  name="dropoff"
                  defaultValue={reservationInfo.dropoff}
                  className={`bg-zinc-800/30 rounded-xl py-3 px-4 w-full border text-white transition-all duration-200 hover:border-zinc-600 focus:border-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] ${
                    errors.dropoff ? 'border-red-500' : 'border-zinc-700/50'
                  }`}
                  autoComplete="off"
                />
                {errors.dropoff && <span className="text-red-500 text-sm absolute -bottom-5">{errors.dropoff}</span>}
              </div>
            )}

            {reservationInfo.isHourly && (
              <div className="relative">
                <input
                  type="number"
                  min="2"
                  max="24"
                  name="hours"
                  value={reservationInfo.hours || ''}
                  onChange={handleInput}
                  className="bg-zinc-800/30 rounded-xl py-3 px-4 w-full border border-zinc-700/50 text-white transition-all duration-200 hover:border-zinc-600 focus:border-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                  placeholder="Enter hours (2-24)"
                />
                {errors.hours && <span className="text-red-500 text-sm absolute -bottom-5">{errors.hours}</span>}
              </div>
            )}
          </>
        ) : (
          <div className="mb-4 text-neutral-400 text-sm border border-gold/20 rounded-xl p-4 bg-gold/5 min-h-[116px] flex flex-col justify-center">
            <p>Enter your preferred date and time.</p>
            <p>We'll discuss your requirements in the next step.</p>
          </div>
        )}

        <div className="relative">
          <DateInput
            value={reservationInfo.date}
            onChange={handleInput}
            name="date"
            id="date"
            className="bg-zinc-800/30 rounded-xl py-3 px-4 w-full border border-zinc-700/50 text-white transition-all duration-200 hover:border-zinc-600 focus:border-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.1)]"
          />
          {errors.date && <span className="text-red-500 text-sm absolute -bottom-5">{errors.date}</span>}
        </div>

        <div className="relative">
          <div className="flex items-center gap-3">
            <label className="text-neutral-400 w-5/12 pl-2" htmlFor="time">
              {reservationInfo.isSpecialRequest ? 'Preferred Time' : 'Pick Up Time'}
            </label>
            <TimeInput
              value={reservationInfo.time}
              onChange={handleInput}
              name="time"
              id="time"
              className="bg-zinc-800/30 rounded-xl py-3 px-4 w-7/12 border border-zinc-700/50 text-white transition-all duration-200 hover:border-zinc-600 focus:border-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.1)]"
            />
          </div>
          {errors.time && <span className="text-red-500 text-sm absolute -bottom-5">{errors.time}</span>}
        </div>

        <div className="flex justify-center mt-8">
          <Button 
            type="submit" 
            variant="secondary" 
            className="w-full py-4 text-base font-medium tracking-wide transition-all duration-200 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]"
            disabled={isValidating}
          >
            {isValidating ? "Validating..." : (reservationInfo.isSpecialRequest ? "Continue to Request Details" : "Reserve Now")}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ReservationCard;
