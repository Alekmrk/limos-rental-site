import { useState, useContext, useRef, useEffect } from "react";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import ReservationContext from "../../../contexts/ReservationContext";
import TimeInput from "../../../components/TimeInput";
import DateInput from "../../../components/DateInput";
import RouteErrorModal from "../../../components/RouteErrorModal";
import AddressInput from "../../../components/AddressInput";
import { validateAddresses } from "../../../services/GoogleMapsService";
import { DateTime } from 'luxon';

const ReservationCard = () => {
  const navigate = useNavigate();
  const { 
    reservationInfo, 
    handleInput: originalHandleInput, 
    setIsHourly, 
    setIsSpecialRequest,
    handlePlaceSelection 
  } = useContext(ReservationContext);
  const [errors, setErrors] = useState({});
  const [showRouteErrorModal, setShowRouteErrorModal] = useState(false);
  const [routeErrorType, setRouteErrorType] = useState(null);

  // Debug logging refs
  const debugRef = useRef({
    formSubmissions: 0,
    validationAttempts: 0,
    lastValidationResult: null
  });

  const handleInput = (e) => {
    console.log('📝 Input change:', {
      field: e.target.name,
      value: e.target.value,
      previousErrors: errors
    });
    
    // Clear error for the field being typed in
    setErrors(prev => {
      const newErrors = { ...prev, [e.target.name]: undefined };
      console.log('🧹 Cleared error for field:', e.target.name, 'New errors:', newErrors);
      return newErrors;
    });
    originalHandleInput(e);
  };

  // Modal action handlers
  const handleSwitchToHourly = () => {
    console.log('🔄 Switching to hourly mode from route error modal');
    setIsHourly(true);
    setShowRouteErrorModal(false);
  };

  const handleSwitchToSpecial = () => {
    console.log('🔄 Switching to special request mode from route error modal');
    setIsSpecialRequest(true);
    setShowRouteErrorModal(false);
  };

  // Debug logging for mode changes
  const handleModeChange = (mode) => {
    console.log('🔄 Mode change:', {
      newMode: mode,
      previousMode: {
        isHourly: reservationInfo.isHourly,
        isSpecialRequest: reservationInfo.isSpecialRequest
      }
    });
    
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

  // Format date to dd-MM-yyyy (Swiss format)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return DateTime.fromFormat(dateString, 'yyyy-MM-dd', { zone: 'Europe/Zurich' }).toFormat('dd-MM-yyyy');
    } catch {
      return dateString;
    }
  };

  const validateForm = async () => {
    debugRef.current.validationAttempts++;
    const validationId = `validation-${Date.now()}-${debugRef.current.validationAttempts}`;
    
    console.group(`🔍 [${validationId}] Form Validation Started`);
    console.log('📊 Validation Context:', {
      isSpecialRequest: reservationInfo.isSpecialRequest,
      isHourly: reservationInfo.isHourly,
      reservationPickup: reservationInfo.pickup,
      reservationDropoff: reservationInfo.dropoff,
      pickupPlaceInfo: reservationInfo.pickupPlaceInfo,
      dropoffPlaceInfo: reservationInfo.dropoffPlaceInfo,
      date: reservationInfo.date,
      time: reservationInfo.time,
      hours: reservationInfo.hours
    });

    const newErrors = {};
    
    // Date and time validation
    console.log('📅 Validating date and time...');
    if (!reservationInfo.date) {
      newErrors.date = "Date is required";
      console.log('❌ Date validation failed: Date is required');
    } else {
      // Use luxon for Swiss time comparison
      const selectedDate = DateTime.fromFormat(reservationInfo.date, 'yyyy-MM-dd', { zone: 'Europe/Zurich' });
      const swissNow = DateTime.now().setZone('Europe/Zurich');
      const selectedDateStart = selectedDate.startOf('day');
      const swissNowStart = swissNow.startOf('day');
      if (selectedDateStart < swissNowStart) {
        newErrors.date = "Date cannot be in the past";
        console.log('❌ Date validation failed: Date in the past');
      }
      
      // If date is today, check if time is at least 3 hours in advance
      if (reservationInfo.time && selectedDateStart.equals(swissNowStart)) {
        const [hours, minutes] = reservationInfo.time.split(':').map(Number);
        const selectedTime = selectedDate.set({ hour: hours, minute: minutes });
        const minAllowedTime = swissNow.plus({ hours: 3 });
        if (selectedTime < minAllowedTime) {
          newErrors.time = "Must book 3h in advance";
          console.log('❌ Time validation failed: Less than 3 hours in advance');
        }
      }
    }
    
    if (!reservationInfo.time) {
      newErrors.time = "Time is required";
      console.log('❌ Time validation failed: Time is required');
    }

    if (!reservationInfo.isSpecialRequest) {
      console.log('🚗 Validating non-special request fields...');
      
      // Location validation
      if (!reservationInfo.pickup) {
        newErrors.pickup = "Pick up location is required";
        console.log('❌ Pickup validation failed: No pickup location');
      }
      
      if (!reservationInfo.isHourly && !reservationInfo.dropoff) {
        newErrors.dropoff = "Drop off location is required";
        console.log('❌ Dropoff validation failed: No dropoff location');
      }
      
      if (reservationInfo.isHourly) {
        const hours = parseInt(reservationInfo.hours) || 0;
        if (hours < 2 || hours > 24) {
          newErrors.hours = "Hours must be between 2 and 24";
          console.log('❌ Hours validation failed:', hours);
        }
      }

      // Switzerland validation - check if we have locations to validate
      const hasPickupValue = reservationInfo.pickup?.trim();
      const hasDropoffValue = !reservationInfo.isHourly ? reservationInfo.dropoff?.trim() : null;
      
      console.log('🇨🇭 Switzerland validation check:', {
        hasPickupValue,
        hasDropoffValue,
        hasPickupPlaceInfo: !!reservationInfo.pickupPlaceInfo,
        hasDropoffPlaceInfo: !!reservationInfo.dropoffPlaceInfo,
        pickupIsConfirmed: reservationInfo.pickupPlaceInfo?.isConfirmed,
        dropoffIsConfirmed: reservationInfo.dropoffPlaceInfo?.isConfirmed,
        pickupWasManuallyEdited: reservationInfo.pickupPlaceInfo?.wasManuallyEdited,
        dropoffWasManuallyEdited: reservationInfo.dropoffPlaceInfo?.wasManuallyEdited
      });
      
      if (hasPickupValue || hasDropoffValue) {
        // First check: require autocomplete selection for any typed locations
        // Also check if the address was manually edited after being confirmed
        if (hasPickupValue && (!reservationInfo.pickupPlaceInfo?.isConfirmed || reservationInfo.pickupPlaceInfo?.wasManuallyEdited)) {
          newErrors.pickup = "Please select a location from the suggestions";
          console.log('❌ Pickup validation failed:', {
            hasValue: hasPickupValue,
            isConfirmed: reservationInfo.pickupPlaceInfo?.isConfirmed,
            wasManuallyEdited: reservationInfo.pickupPlaceInfo?.wasManuallyEdited
          });
        }
        if (hasDropoffValue && (!reservationInfo.dropoffPlaceInfo?.isConfirmed || reservationInfo.dropoffPlaceInfo?.wasManuallyEdited)) {
          newErrors.dropoff = "Please select a location from the suggestions";
          console.log('❌ Dropoff validation failed:', {
            hasValue: hasDropoffValue,
            isConfirmed: reservationInfo.dropoffPlaceInfo?.isConfirmed,
            wasManuallyEdited: reservationInfo.dropoffPlaceInfo?.wasManuallyEdited
          });
        }
        
        // Second check: if we have both place infos and they're confirmed (not manually edited), validate Switzerland requirement
        if (reservationInfo.pickupPlaceInfo?.isConfirmed && !reservationInfo.pickupPlaceInfo?.wasManuallyEdited && 
            (!reservationInfo.isHourly ? (reservationInfo.dropoffPlaceInfo?.isConfirmed && !reservationInfo.dropoffPlaceInfo?.wasManuallyEdited) : true)) {
          console.log('🔄 Using address validation service...');
          try {
            const validation = await validateAddresses(
              reservationInfo.pickupPlaceInfo,
              reservationInfo.dropoffPlaceInfo
            );
            console.log('📍 Address validation result:', validation);
            if (!validation.isValid) {
              newErrors.pickup = validation.error;
              console.log('❌ Address validation failed:', validation.error);
            }
          } catch (error) {
            console.error('💥 Error validating addresses:', error);
            newErrors.pickup = "Error validating addresses. Please try again.";
          }
        }
      }
    }

    console.log('📋 Final validation errors:', newErrors);
    setErrors(newErrors);
    
    const isValid = Object.keys(newErrors).length === 0;
    debugRef.current.lastValidationResult = { isValid, errors: newErrors, timestamp: Date.now() };
    
    console.log(`✅ Validation ${isValid ? 'PASSED' : 'FAILED'}`);
    console.groupEnd();
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    debugRef.current.formSubmissions++;
    const submissionId = `submission-${Date.now()}-${debugRef.current.formSubmissions}`;
    
    console.group(`🚀 [${submissionId}] Form Submission Started`);
    console.log('📝 Form submission event:', e);
    console.log('🎯 preventDefault called');
    e.preventDefault();
    
    console.log('📊 Pre-validation state:', {
      reservationInfo: {
        pickup: reservationInfo.pickup,
        dropoff: reservationInfo.dropoff,
        pickupPlaceInfo: reservationInfo.pickupPlaceInfo,
        dropoffPlaceInfo: reservationInfo.dropoffPlaceInfo,
        isSpecialRequest: reservationInfo.isSpecialRequest,
        isHourly: reservationInfo.isHourly
      },
      currentErrors: errors
    });
    
    console.log('🔄 Calling validateForm...');
    const isValid = await validateForm();
    
    console.log('📊 Post-validation state:', {
      isValid,
      lastValidationResult: debugRef.current.lastValidationResult,
      willNavigate: isValid
    });

    if (isValid) {
      // For distance mode, check if route calculation failed
      if (!reservationInfo.isHourly && !reservationInfo.isSpecialRequest) {
        console.log('🗺️ Checking route calculation status for distance mode...');
        
        if (reservationInfo.routeInfo === null) {
          // API error - Google services down
          console.log('❌ Route calculation failed due to API error');
          setRouteErrorType('api_error');
          setShowRouteErrorModal(true);
          console.groupEnd();
          return;
        } else if (reservationInfo.routeInfo?.noRouteFound) {
          // No route exists between locations
          console.log('❌ No route found between locations');
          setRouteErrorType('no_route_found');
          setShowRouteErrorModal(true);
          console.groupEnd();
          return;
        }
        
        console.log('✅ Route calculation successful - proceeding with navigation');
      }
      
      console.log('✅ Form valid - navigating...');
      if (reservationInfo.isSpecialRequest) {
        console.log('🎯 Navigating to customer-details (special request)');
        navigate('/customer-details');
      } else {
        console.log('🎯 Navigating to vehicle-selection');
        navigate('/vehicle-selection');
      }
    } else {
      console.log('❌ Form invalid - staying on page');
      console.log('🔧 Current errors that prevent submission:', debugRef.current.lastValidationResult?.errors);
    }
    
    console.groupEnd();
  };

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
                  <AddressInput
                    value={reservationInfo.pickup}
                    onChange={handleInput}
                    onPlaceSelected={(placeInfo) => handlePlaceSelection('pickup', placeInfo)}
                    name="pickup"
                    placeholder="TYPE LOCATION..."
                    className={`${
                      errors.pickup && errors.pickup !== "At least one location must be in Switzerland" 
                        ? 'border-red-500 ring-1 ring-red-500/50 animate-shake' 
                        : 'border-zinc-700/50'
                    }`}
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
                    <AddressInput
                      value={reservationInfo.dropoff}
                      onChange={handleInput}
                      onPlaceSelected={(placeInfo) => handlePlaceSelection('dropoff', placeInfo)}
                      name="dropoff"
                      placeholder="TYPE LOCATION..."
                      className={`${
                        errors.dropoff && errors.dropoff !== "At least one location must be in Switzerland" 
                          ? 'border-red-500 ring-1 ring-red-500/50 animate-shake' 
                          : 'border-zinc-700/50'
                      }`}
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
                      name="hours"
                      id="hours"
                      value={reservationInfo.hours}
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
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm uppercase mb-2 tracking-wide" htmlFor="date">
                  When will the service take place?
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
              <Button 
                type="submit" 
                variant="secondary" 
                className={`w-full py-4 text-base font-medium tracking-wide transition-all duration-200 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] ${
                  (errors.pickup === "At least one location must be in Switzerland" || errors.dropoff === "At least one location must be in Switzerland")
                    ? 'border-red-500 ring-1 ring-red-500/50 animate-shake'
                    : ''
                }`}
              >
                {reservationInfo.isSpecialRequest ? "Continue to Request Details" : "Reserve Now"}
              </Button>
              {(errors.pickup === "At least one location must be in Switzerland" || errors.dropoff === "At least one location must be in Switzerland") && (
                <div className="absolute left-1/8 right-0 top-0 w-4/4 translate-y-[-50%] bg-zinc-800/40 text-red-500 text-[11px] py-1 px-3 rounded-2xl z-10 text-right backdrop-blur-sm">
                  At least one location must be in Switzerland
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Route error modal */}
        <RouteErrorModal 
          isOpen={showRouteErrorModal} 
          onClose={() => setShowRouteErrorModal(false)} 
          errorType={routeErrorType}
          onSwitchToHourly={handleSwitchToHourly}
          onSwitchToSpecial={handleSwitchToSpecial}
        />
      </div>
    </form>
  );
};

export default ReservationCard;
