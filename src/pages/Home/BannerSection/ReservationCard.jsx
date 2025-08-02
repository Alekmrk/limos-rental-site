import { useState, useContext, useRef, useEffect } from "react";
import Button from "../../../components/Button";
import { useUTMPreservation } from "../../../hooks/useUTMPreservation";
import ReservationContext from "../../../contexts/ReservationContext";
import TimeInput from "../../../components/TimeInput";
import DateInput from "../../../components/DateInput";
import RouteErrorModal from "../../../components/RouteErrorModal";
import AddressInput from "../../../components/AddressInput";
import { validateAddresses } from "../../../services/GoogleMapsService";
import { DateTime } from 'luxon';

const ReservationCard = ({ idPrefix = '' }) => {
  const { navigateWithUTMs } = useUTMPreservation();
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
    
    // For special requests, no validation needed - just proceed
    if (reservationInfo.isSpecialRequest) {
      console.log('✅ Special request mode - skipping validation');
      console.groupEnd();
      return true;
    }
    
    // Date and time validation for non-special requests
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
      if (hours < 3 || hours > 24) {
        newErrors.hours = "Hours must be between 3 and 24";
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

    console.log('📋 Final validation errors:', newErrors);
    setErrors(newErrors);
    
    const isValid = Object.keys(newErrors).length === 0;
    debugRef.current.lastValidationResult = { isValid, errors: newErrors, timestamp: Date.now() };
    
    // If there are errors, scroll to the first error field with priority for address fields
    if (Object.keys(newErrors).length > 0) {
      // Check if we have the Switzerland error that's displayed globally
      const hasSwitzerlandError = newErrors.pickup === "At least one location must be in Switzerland" || 
                                  newErrors.dropoff === "At least one location must be in Switzerland";
      
      if (hasSwitzerlandError) {
        // For Switzerland errors, scroll to the submit button area where the global error is displayed
        scrollToErrorField(`${idPrefix}reserve-button`);
      } else {
        // Define priority order - address errors first
        const errorPriority = ['pickup', 'dropoff'];
        const allErrorFields = Object.keys(newErrors);
        
        // Find the highest priority error field
        let firstErrorField = null;
        for (const priorityField of errorPriority) {
          if (allErrorFields.includes(priorityField)) {
            firstErrorField = priorityField;
            break;
          }
        }
        
        // If no priority field has error, use the first error field
        if (!firstErrorField) {
          firstErrorField = allErrorFields[0];
        }
        
        scrollToErrorField(`${idPrefix}${firstErrorField}`);
      }
    }
    
    console.log(`✅ Validation ${isValid ? 'PASSED' : 'FAILED'}`);
    console.groupEnd();
    
    return isValid;
  };

  // Function to scroll to the error field
  const scrollToErrorField = (fieldName) => {
    setTimeout(() => {
      console.log('🔍 Attempting to scroll to error field:', fieldName);
      const fieldElement = document.getElementById(fieldName);
      console.log('📍 Found field element:', fieldElement);
      
      if (fieldElement) {
        console.log('✅ Scrolling to field:', fieldName);
        fieldElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      } else {
        console.warn('❌ Could not find field element with id:', fieldName);
        // Try to find the field by name attribute as fallback (only for form fields)
        if (!fieldName.includes('reserve-button')) {
          // Remove prefix to get the original field name for name attribute search
          const originalFieldName = fieldName.replace(idPrefix, '');
          const fieldByName = document.querySelector(`[name="${originalFieldName}"]`);
          if (fieldByName) {
            console.log('✅ Found field by name, scrolling to:', fieldName);
            fieldByName.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
          }
        }
      }
    }, 100); // Small delay to ensure error state is rendered
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
        navigateWithUTMs('/customer-details');
      } else {
        console.log('🎯 Navigating to vehicle-selection');
        navigateWithUTMs('/vehicle-selection');
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
      className="reservation reserve-card w-[95%] min-w-[280px] max-w-[420px] md:max-w-[380px] lg:max-w-[480px] pt-4 px-6 pb-10 sm:pt-6 sm:px-10 sm:pb-10 mx-auto md:mx-0 md:absolute md:bottom-12 md:right-4 lg:right-8 xl:right-16 shadow-2xl bg-cream-light/95 backdrop-blur-md border border-royal-blue/30 rounded-[2rem] text-left text-[15px] transition-all hover:shadow-[0_20px_50px_rgba(65,105,225,0.15)] hover:border-royal-blue/50 z-50"
    >
      <div className="flex justify-center gap-1 sm:gap-3 pb-4 mb-4 relative w-full">
        <button
          type="button"
          onClick={() => handleModeChange('distance')}
          className={
            !reservationInfo.isHourly && !reservationInfo.isSpecialRequest
              ? "py-2.5 px-2 sm:px-4 rounded-xl bg-royal-blue text-white shadow-lg transform transition-all duration-200 text-sm sm:text-base flex-1 max-w-[90px] sm:max-w-none"
              : "py-2.5 px-2 sm:px-4 rounded-xl text-gray-600 hover:text-royal-blue transition-all duration-200 hover:bg-royal-blue/10 text-sm sm:text-base flex-1 max-w-[90px] sm:max-w-none"
          }
        >
          Distance
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('hourly')}
          className={
            reservationInfo.isHourly
              ? "py-2.5 px-2 sm:px-4 rounded-xl bg-royal-blue text-white shadow-lg transform transition-all duration-200 text-sm sm:text-base flex-1 max-w-[90px] sm:max-w-none"
              : "py-2.5 px-2 sm:px-4 rounded-xl text-gray-600 hover:text-royal-blue transition-all duration-200 hover:bg-royal-blue/10 text-sm sm:text-base flex-1 max-w-[90px] sm:max-w-none"
          }
        >
          Hourly
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('special')}
          className={
            reservationInfo.isSpecialRequest
              ? "py-2.5 px-2 sm:px-4 rounded-xl bg-royal-blue text-white shadow-lg transform transition-all duration-200 text-sm sm:text-base flex-1 max-w-[90px] sm:max-w-none"
              : "py-2.5 px-2 sm:px-4 rounded-xl text-gray-600 hover:text-royal-blue transition-all duration-200 hover:bg-royal-blue/10 text-sm sm:text-base flex-1 max-w-[90px] sm:max-w-none"
          }
        >
          Special
        </button>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-royal-blue/20 via-royal-blue/40 to-royal-blue/20"></div>
      </div>
      
      <div className="space-y-5 min-h-[250px]">
        {!reservationInfo.isSpecialRequest ? (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm uppercase mb-2 tracking-wide text-gray-700 font-medium" htmlFor={`${idPrefix}pickup`}>
                  Pick-up point
                </label>
                <div className="relative">
                  <AddressInput
                    value={reservationInfo.pickup}
                    onChange={handleInput}
                    onPlaceSelected={(placeInfo) => handlePlaceSelection('pickup', placeInfo)}
                    name="pickup"
                    id={`${idPrefix}pickup`}
                    placeholder="TYPE LOCATION..."
                    className={`${
                      errors.pickup && errors.pickup !== "At least one location must be in Switzerland" 
                        ? 'border-red-500 ring-1 ring-red-500/50 animate-shake' 
                        : 'border-royal-blue/20'
                    }`}
                  />
                  {errors.pickup && errors.pickup !== "At least one location must be in Switzerland" && (
                    <div className="absolute left-1/8 right-0 bottom-0 w-4/4 translate-y-1/2 bg-warm-white/95 text-red-500 text-[11px] py-1 px-3 rounded-2xl z-10 text-right backdrop-blur-sm border border-red-500/30">
                      {errors.pickup}
                    </div>
                  )}
                </div>
              </div>

              {!reservationInfo.isHourly && (
                <div>
                  <label className="block text-sm uppercase mb-2 tracking-wide text-gray-700 font-medium" htmlFor={`${idPrefix}dropoff`}>
                    Drop-off point
                  </label>
                  <div className="relative">
                    <AddressInput
                      value={reservationInfo.dropoff}
                      onChange={handleInput}
                      onPlaceSelected={(placeInfo) => handlePlaceSelection('dropoff', placeInfo)}
                      name="dropoff"
                      id={`${idPrefix}dropoff`}
                      placeholder="TYPE LOCATION..."
                      className={`${
                        errors.dropoff && errors.dropoff !== "At least one location must be in Switzerland" 
                          ? 'border-red-500 ring-1 ring-red-500/50 animate-shake' 
                          : 'border-royal-blue/20'
                      }`}
                    />
                    {errors.dropoff && errors.dropoff !== "At least one location must be in Switzerland" && (
                      <div className="absolute left-1/8 right-0 bottom-0 w-4/4 translate-y-1/2 bg-warm-white/95 text-red-500 text-[11px] py-1 px-3 rounded-2xl z-10 text-right backdrop-blur-sm border border-red-500/30">
                        {errors.dropoff}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {reservationInfo.isHourly && (
                <div>
                  <label className="block text-sm uppercase mb-2 tracking-wide text-gray-700 font-medium" htmlFor={`${idPrefix}hours`}>
                    Duration (hours)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      onInvalid={(e) => e.preventDefault()}
                      name="hours"
                      id={`${idPrefix}hours`}
                      value={reservationInfo.hours}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        // Only clear the error, validation will happen on form submit
                        setErrors(prev => ({ ...prev, hours: undefined }));
                        handleInput(e);
                      }}
                      onFocus={(e) => e.target.select()}
                      className={`bg-warm-white/80 rounded-xl py-3 px-4 w-full border text-gray-700 transition-all duration-200 hover:border-royal-blue/30 focus:border-royal-blue/50 focus:shadow-[0_0_15px_rgba(65,105,225,0.2)] ${
                        errors.hours ? 'border-red-500 ring-1 ring-red-500/50 animate-shake' : 'border-royal-blue/20'
                      }`}
                      placeholder="Enter hours (3-24)"
                    />
                    {errors.hours && (
                      <div className="absolute left-1/8 right-0 bottom-0 w-4/4 translate-y-1/2 bg-warm-white/95 text-red-500 text-[11px] py-1 px-3 rounded-2xl z-10 text-right backdrop-blur-sm border border-red-500/30">
                        {errors.hours}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm uppercase mb-2 tracking-wide text-gray-700 font-medium" htmlFor={`${idPrefix}date`}>
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
                    id={`${idPrefix}date`}
                    className={`bg-warm-white/80 rounded-xl py-3 px-4 w-full border text-gray-700 transition-all duration-200 hover:border-royal-blue/30 focus:border-royal-blue/50 focus:shadow-[0_0_15px_rgba(65,105,225,0.2)] ${
                      errors.date ? 'border-red-500 ring-1 ring-red-500/50 animate-shake' : 'border-royal-blue/20'
                    }`}
                  />
                  {errors.date && (
                    <div className="absolute left-1/8 right-0 bottom-0 w-4/4 translate-y-1/2 bg-warm-white/95 text-red-500 text-[11px] py-1 px-3 rounded-2xl z-10 text-right backdrop-blur-sm border border-red-500/30">
                      {errors.date}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm uppercase mb-2 tracking-wide text-gray-700 font-medium" htmlFor={`${idPrefix}time`}>
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
                    id={`${idPrefix}time`}
                    className={`bg-warm-white/80 rounded-xl py-3 px-4 w-full border text-gray-700 transition-all duration-200 hover:border-royal-blue/30 focus:border-royal-blue/50 focus:shadow-[0_0_15px_rgba(65,105,225,0.2)] ${
                      errors.time ? 'border-red-500 ring-1 ring-red-500/50 animate-shake' : 'border-royal-blue/20'
                    }`}
                  />
                  {errors.time && (
                    <div className="absolute left-1/8 right-0 bottom-0 w-4/4 translate-y-1/2 bg-warm-white/95 text-red-500 text-[11px] py-1 px-3 rounded-2xl z-10 text-right backdrop-blur-sm border border-red-500/30">
                      {errors.time}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 text-gray-600 text-sm border border-royal-blue/20 rounded-xl p-4 bg-royal-blue/5">
              <p className="mb-3 text-gray-700 font-medium">Custom Transportation Request</p>
              <p className="mb-2">Tell us about your unique transportation needs and we'll create a personalized quote for you.</p>
              <p className="mt-3 text-royal-blue font-medium">Perfect for:</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Multi-city tours & sightseeing</li>
                <li>Corporate events & VIP services</li>
                <li>Custom itineraries & special occasions</li>
                <li>Long-distance transfers</li>
                <li>Group transportation</li>
              </ul>
              <div className="mt-4 pt-3 border-t border-royal-blue/20">
                <p className="text-xs text-royal-blue">✓ Free consultation & quote</p>
                <p className="text-xs text-royal-blue">✓ Flexible scheduling & routing</p>
              </div>
            </div>
          </>
        )}

        {/* Error container with error on the button's top border */}
        <div className="relative">
          <div className="flex justify-center mt-8">
            <div className="relative w-full">
              <Button 
                id={`${idPrefix}reserve-button`}
                type="submit" 
                variant="secondary" 
                className={`w-full py-4 text-base font-medium tracking-wide transition-all duration-200 hover:shadow-[0_0_20px_rgba(65,105,225,0.15)] ${
                  (errors.pickup === "At least one location must be in Switzerland" || errors.dropoff === "At least one location must be in Switzerland")
                    ? 'border-red-500 ring-1 ring-red-500/50 animate-shake'
                    : ''
                }`}
              >
                {reservationInfo.isSpecialRequest ? "Continue to Request Details" : "Reserve Now"}
              </Button>
              {(errors.pickup === "At least one location must be in Switzerland" || errors.dropoff === "At least one location must be in Switzerland") && (
                <div className="absolute left-1/8 right-0 top-0 w-4/4 translate-y-[-50%] bg-warm-white/95 text-red-500 text-[11px] py-1 px-3 rounded-2xl z-10 text-right backdrop-blur-sm border border-red-500/30">
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
