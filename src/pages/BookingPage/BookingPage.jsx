import { useState, useContext, useRef, useEffect } from "react";
import { useUTMPreservation } from "../../hooks/useUTMPreservation";
import Button from "../../components/Button";
import ReservationContext from "../../contexts/ReservationContext";
import TimeInput from "../../components/TimeInput";
import DateInput from "../../components/DateInput";
import RouteErrorModal from "../../components/RouteErrorModal";
import AddressInput from "../../components/AddressInput";
import { validateAddresses } from "../../services/GoogleMapsService";
import { DateTime } from 'luxon';

const BookingPage = ({ scrollUp }) => {
  const { navigateWithUTMs } = useUTMPreservation();
  const { 
    reservationInfo, 
    handleInput: originalHandleInput, 
    setIsHourly, 
    setIsSpecialRequest,
    handlePlaceSelection,
    clearReservation
  } = useContext(ReservationContext);
  const [errors, setErrors] = useState({});
  const [showRouteErrorModal, setShowRouteErrorModal] = useState(false);
  const [routeErrorType, setRouteErrorType] = useState(null);
  const [isButtonSticky, setIsButtonSticky] = useState(false);

  // Debug logging refs
  const debugRef = useRef({
    formSubmissions: 0,
    validationAttempts: 0,
    lastValidationResult: null
  });

  // Scroll to top when component mounts
  useEffect(() => {
    scrollUp && scrollUp();
  }, [scrollUp]);

  // Sticky button behavior
  useEffect(() => {
    const handleScroll = () => {
      const submitSection = document.getElementById('submit-section');
      if (!submitSection) return;

      const rect = submitSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Trigger 30px earlier (when bottom is 30px below viewport)
      const triggerOffset = 30;
      // Add buffer to prevent glitching at the boundary
      const buffer = 30;
      
      // If the bottom of the submit section is 30px below the viewport (with buffer), make button sticky
      if (rect.bottom > windowHeight - triggerOffset + buffer) {
        setIsButtonSticky(true);
      } else if (rect.bottom < windowHeight - triggerOffset - buffer) {
        setIsButtonSticky(false);
      }
      // Don't change state when within the buffer zone to prevent flickering
    };

    // Only enable sticky behavior on mobile
    if (window.innerWidth < 768) {
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
      
      // Initial check
      handleScroll();
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

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

  // Function to scroll to Travel Details section
  const scrollToTravelDetails = (targetMode = null) => {
    // Use the passed targetMode or fall back to current state
    const isSpecialMode = targetMode === 'special' || (!targetMode && reservationInfo.isSpecialRequest);
    const targetId = isSpecialMode ? 'custom-request-details' : 'travel-details';
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - 100; // Scroll 100px above the element
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
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
    
    // Scroll to Travel Details section
    setTimeout(() => {
      scrollToTravelDetails(mode);
    }, 100);
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
    
    // Hours validation for hourly bookings
    if (reservationInfo.isHourly) {
      const hoursValue = reservationInfo.hours;
      
      // Check if hours field is empty
      if (!hoursValue || hoursValue.toString().trim() === '') {
        newErrors.hours = "Duration is required";
        console.log('❌ Hours validation failed: Hours is required');
      } 
      // Check if hours contains non-numeric characters
      else if (!/^\d+$/.test(hoursValue.toString())) {
        newErrors.hours = "Please enter numbers only";
        console.log('❌ Hours validation failed: Non-numeric input');
      } 
      // Check if hours is within valid range
      else {
        const hours = parseInt(hoursValue);
        if (hours < 3 || hours > 24) {
          newErrors.hours = "Hours must be between 3 and 24";
          console.log('❌ Hours validation failed:', hours);
        }
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
        scrollToErrorField('submit-section');
      } else {
        // Define priority order - address errors first, then form fields
        const errorPriority = ['pickup', 'dropoff', 'hours', 'date', 'time'];
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
        
        scrollToErrorField(firstErrorField);
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
        if (fieldName !== 'submit-section') {
          const fieldByName = document.querySelector(`[name="${fieldName}"]`);
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
          console.log('⚠️ Route calculation failed or pending');
          // Check if it's a timeout or API error
          if (reservationInfo.routeInfo?.apiError) {
            console.log('❌ Route calculation failed due to API error');
            setRouteErrorType('api_error');
            setShowRouteErrorModal(true);
            console.groupEnd();
            return;
          } else if (reservationInfo.routeInfo?.noRouteFound) {
            console.log('❌ No route found between locations');
            setRouteErrorType('no_route_found');
            setShowRouteErrorModal(true);
            console.groupEnd();
            return;
          }
          
          // If it's just a timeout, show generic error
          console.log('❌ Route calculation failed due to timeout');
          setRouteErrorType('timeout');
          setShowRouteErrorModal(true);
          console.groupEnd();
          return;
        } else if (reservationInfo.routeInfo?.apiError) {
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
    <div className="bg-gradient-to-br from-warm-gray/5 via-cream/3 to-soft-gray/5 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }}>
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-gold/5 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gold/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 left-20 w-16 h-16 bg-warm-gray/15 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary-gold/8 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-br from-cream/10 to-gold/5 rounded-full blur-xl animate-float"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-700 mt-[50px]">
              <span className="text-primary-gold">Book Your</span> 
              <br className="md:hidden" />
              <span className="text-gold"> Premium</span> Transfer
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Experience Switzerland's finest luxury transportation service. Choose from our premium fleet 
              and enjoy professional chauffeur service tailored to your needs.
            </p>
            
            {/* Key Features */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-warm-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-gold/10 shadow-lg">
                <div className="w-12 h-12 bg-primary-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-700 mb-2">24/7 Service</h3>
                <p className="text-gray-600 text-xs">Professional chauffeurs available around the clock</p>
              </div>
              <div className="bg-warm-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-gold/10 shadow-lg">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-700 mb-2">Luxury Fleet</h3>
                <p className="text-gray-600 text-xs">Premium vehicles maintained to highest standards</p>
              </div>
              <div className="bg-warm-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-gold/10 shadow-lg">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-700 mb-2">Switzerland Wide</h3>
                <p className="text-gray-600 text-xs">Comprehensive coverage across all Swiss regions</p>
              </div>
            </div>
          </div>

          {/* Main Booking Form */}
          <div className="bg-cream-light/95 backdrop-blur-md border border-primary-gold/30 rounded-3xl shadow-2xl p-8 md:p-12 max-w-5xl mx-auto">
            <form 
              id="booking-form"
              onSubmit={handleSubmit} 
              onKeyDown={(e) => {
                // Only prevent form submission for regular inputs, allow new lines in textareas
                if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
                  e.preventDefault();
                }
              }}
              className="space-y-10"
            >
              
              {/* Service Type Selection */}
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-700 mb-3">Select Your Service</h2>
                  <p className="text-gray-600 text-base">Choose the type of transportation that best fits your needs</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Distance Transfer */}
                  <div 
                    className={`group cursor-pointer transition-all duration-300 relative overflow-hidden ${
                      !reservationInfo.isHourly && !reservationInfo.isSpecialRequest
                        ? "bg-gradient-to-br from-primary-gold/10 to-primary-gold/5 border-2 border-primary-gold shadow-lg transform scale-105"
                        : "bg-warm-white/80 border border-primary-gold/20 hover:border-primary-gold/50 hover:shadow-xl hover:transform hover:scale-102"
                    } rounded-2xl p-6 backdrop-blur-sm`}
                    onClick={() => handleModeChange('distance')}
                  >
                    {/* Selection indicator */}
                    {!reservationInfo.isHourly && !reservationInfo.isSpecialRequest && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-primary-gold rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Click hint for unselected */}
                    {(reservationInfo.isHourly || reservationInfo.isSpecialRequest) && (
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 border-2 border-primary-gold/40 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary-gold/40 rounded-full"></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
                        !reservationInfo.isHourly && !reservationInfo.isSpecialRequest
                          ? "bg-primary-gold/20"
                          : "bg-primary-gold/10 group-hover:bg-primary-gold/15"
                      }`}>
                        <svg className={`w-8 h-8 transition-all duration-300 ${
                          !reservationInfo.isHourly && !reservationInfo.isSpecialRequest
                            ? "text-primary-gold"
                            : "text-primary-gold group-hover:scale-110"
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2 group-hover:text-primary-gold transition-colors duration-200">Distance Transfer</h3>
                      <p className="text-gray-600 text-xs mb-3">Point-to-point transportation with fixed pricing</p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>• Airport transfers</li>
                        <li>• City-to-city travel</li>
                        <li>• One-way trips</li>
                      </ul>
                    </div>
                    
                    {/* Subtle "Click to select" hint */}
                    {(reservationInfo.isHourly || reservationInfo.isSpecialRequest) && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                        <span className="text-xs text-primary-gold/70 bg-white/80 px-2 py-1 rounded-full">Click to select</span>
                      </div>
                    )}
                  </div>

                  {/* Hourly Service */}
                  <div 
                    className={`group cursor-pointer transition-all duration-300 relative overflow-hidden ${
                      reservationInfo.isHourly
                        ? "bg-gradient-to-br from-primary-gold/10 to-primary-gold/5 border-2 border-primary-gold shadow-lg transform scale-105"
                        : "bg-warm-white/80 border border-primary-gold/20 hover:border-primary-gold/50 hover:shadow-xl hover:transform hover:scale-102"
                    } rounded-2xl p-6 backdrop-blur-sm`}
                    onClick={() => handleModeChange('hourly')}
                  >
                    {/* Selection indicator */}
                    {reservationInfo.isHourly && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-primary-gold rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Click hint for unselected */}
                    {!reservationInfo.isHourly && (
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 border-2 border-primary-gold/40 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary-gold/40 rounded-full"></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
                        reservationInfo.isHourly
                          ? "bg-primary-gold/20"
                          : "bg-primary-gold/10 group-hover:bg-primary-gold/15"
                      }`}>
                        <svg className={`w-8 h-8 transition-all duration-300 ${
                          reservationInfo.isHourly
                            ? "text-primary-gold"
                            : "text-primary-gold group-hover:scale-110"
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2 group-hover:text-primary-gold transition-colors duration-200">Hourly Service</h3>
                      <p className="text-gray-600 text-xs mb-3">Vehicle at your disposal for multiple stops</p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>• Business meetings</li>
                        <li>• Shopping tours</li>
                        <li>• Wait & return service</li>
                      </ul>
                    </div>
                    
                    {/* Subtle "Click to select" hint */}
                    {!reservationInfo.isHourly && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                        <span className="text-xs text-primary-gold/70 bg-white/80 px-2 py-1 rounded-full">Click to select</span>
                      </div>
                    )}
                  </div>

                  {/* Special Request */}
                  <div 
                    className={`group cursor-pointer transition-all duration-300 relative overflow-hidden ${
                      reservationInfo.isSpecialRequest
                        ? "bg-gradient-to-br from-primary-gold/10 to-primary-gold/5 border-2 border-primary-gold shadow-lg transform scale-105"
                        : "bg-warm-white/80 border border-primary-gold/20 hover:border-primary-gold/50 hover:shadow-xl hover:transform hover:scale-102"
                    } rounded-2xl p-6 backdrop-blur-sm`}
                    onClick={() => handleModeChange('special')}
                  >
                    {/* Selection indicator */}
                    {reservationInfo.isSpecialRequest && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-primary-gold rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Click hint for unselected */}
                    {!reservationInfo.isSpecialRequest && (
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 border-2 border-primary-gold/40 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary-gold/40 rounded-full"></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
                        reservationInfo.isSpecialRequest
                          ? "bg-gold/20"
                          : "bg-gold/10 group-hover:bg-gold/15"
                      }`}>
                        <svg className={`w-8 h-8 transition-all duration-300 ${
                          reservationInfo.isSpecialRequest
                            ? "text-gold"
                            : "text-gold group-hover:scale-110"
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2 group-hover:text-primary-gold transition-colors duration-200">Special Request</h3>
                      <p className="text-gray-600 text-xs mb-3">Custom transportation solutions</p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>• Multi-city tours</li>
                        <li>• Corporate events</li>
                        <li>• Group transportation</li>
                      </ul>
                    </div>
                    
                    {/* Subtle "Click to select" hint */}
                    {!reservationInfo.isSpecialRequest && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                        <span className="text-xs text-primary-gold/70 bg-white/80 px-2 py-1 rounded-full">Click to select</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-8">
                {!reservationInfo.isSpecialRequest ? (
                  <>
                    {/* Location Fields */}
                    <div className="space-y-4">
                      <h3 id="travel-details" className="text-xl font-semibold text-gray-700 text-center">Travel Details</h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-3 text-gray-700" htmlFor="pickup">
                            Pick-up Location *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <AddressInput
                              value={reservationInfo.pickup}
                              onChange={handleInput}
                              onPlaceSelected={(placeInfo) => handlePlaceSelection('pickup', placeInfo)}
                              name="pickup"
                              placeholder="Enter pick-up location..."
                              error={errors.pickup && errors.pickup !== "At least one location must be in Switzerland" ? errors.pickup : null}
                              className="pl-10"
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
                            <label className="block text-sm font-medium mb-3 text-gray-700" htmlFor="dropoff">
                              Drop-off Location *
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </div>
                              <AddressInput
                                value={reservationInfo.dropoff}
                                onChange={handleInput}
                                onPlaceSelected={(placeInfo) => handlePlaceSelection('dropoff', placeInfo)}
                                name="dropoff"
                                placeholder="Enter drop-off location..."
                                error={errors.dropoff && errors.dropoff !== "At least one location must be in Switzerland" ? errors.dropoff : null}
                                className="pl-10"
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
                            <label className="block text-sm font-medium mb-3 text-gray-700" htmlFor="hours">
                              Duration (Hours) *
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                name="hours"
                                id="hours"
                                value={reservationInfo.hours}
                                onChange={(e) => {
                                  const inputValue = e.target.value;
                                  
                                  // Always update the input value first
                                  handleInput(e);
                                  
                                  // Check if input contains non-numeric characters and show error
                                  if (inputValue && !/^\d*$/.test(inputValue)) {
                                    setErrors(prev => ({ ...prev, hours: "Please enter numbers only" }));
                                  } else {
                                    // Clear errors if input is valid
                                    setErrors(prev => ({ ...prev, hours: undefined }));
                                  }
                                }}
                                onPaste={(e) => {
                                  // Allow paste to happen, then validate the result
                                  setTimeout(() => {
                                    const inputValue = e.target.value;
                                    if (inputValue && !/^\d*$/.test(inputValue)) {
                                      setErrors(prev => ({ ...prev, hours: "Please enter numbers only" }));
                                    } else {
                                      setErrors(prev => ({ ...prev, hours: undefined }));
                                    }
                                  }, 0);
                                }}
                                onFocus={(e) => e.target.select()}
                                className={`pl-10 bg-warm-white/80 rounded-xl py-3 px-4 w-full border text-gray-700 transition-all duration-200 hover:border-primary-gold/30 focus:border-primary-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.2)] ${
                                  errors.hours ? 'border-red-500 ring-1 ring-red-500/50 animate-shake' : 'border-primary-gold/20'
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
                    </div>

                    {/* Date and Time Fields */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-3 text-gray-700" htmlFor="date">
                          Service Date *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <DateInput
                            value={reservationInfo.date}
                            onChange={(e) => {
                              setErrors(prev => ({ ...prev, date: undefined }));
                              handleInput(e);
                            }}
                            name="date"
                            id="date"
                            className={`pl-10 bg-warm-white/80 rounded-xl py-3 px-4 w-full border text-gray-700 transition-all duration-200 hover:border-primary-gold/30 focus:border-primary-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.2)] ${
                              errors.date ? 'border-red-500 ring-1 ring-red-500/50 animate-shake' : 'border-primary-gold/20'
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
                        <label className="block text-sm font-medium mb-3 text-gray-700" htmlFor="time">
                          Preferred Time *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <TimeInput
                            value={reservationInfo.time}
                            onChange={(e) => {
                              setErrors(prev => ({ ...prev, time: undefined }));
                              handleInput(e);
                            }}
                            name="time"
                            id="time"
                            className={`pl-10 bg-warm-white/80 rounded-xl py-3 px-4 w-full border text-gray-700 transition-all duration-200 hover:border-primary-gold/30 focus:border-primary-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.2)] ${
                              errors.time ? 'border-red-500 ring-1 ring-red-500/50 animate-shake' : 'border-primary-gold/20'
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

                    {/* Additional Info */}
                    <div className="bg-primary-gold/5 border border-primary-gold/20 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-primary-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2 text-sm">Service Information</h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            <li>• Minimum 3 hours advance booking required</li>
                            <li>• All prices include professional chauffeur service</li>
                            <li>• Complimentary flight monitoring for airport transfers</li>
                            <li>• Child seats available upon request</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Special Request Information */}
                    <div className="space-y-4">
                      <h3 id="custom-request-details" className="text-xl font-semibold text-gray-700 text-center">Custom Transportation Request</h3>
                      
                      <div className="bg-gradient-to-br from-gold/10 to-royal-blue/5 border border-gold/30 rounded-2xl p-6">
                        <div className="text-center mb-4">
                          <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </div>
                          <h4 className="text-lg font-semibold text-gray-700 mb-3">Premium Custom Services</h4>
                          <p className="text-gray-600 text-base">
                            Tell us about your unique transportation needs and we'll create a personalized experience just for you.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm">Perfect for:</h5>
                            <ul className="space-y-2 text-xs text-gray-600">
                              <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-gold rounded-full"></span>
                                Multi-city tours & sightseeing
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-gold rounded-full"></span>
                                Corporate events & VIP services
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-gold rounded-full"></span>
                                Long-distance transfers
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-gold rounded-full"></span>
                                Group transportation
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-gold rounded-full"></span>
                                Custom itineraries
                              </li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm">What You Get:</h5>
                            <ul className="space-y-2 text-xs text-gray-600">
                              <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Free consultation & quote
                              </li>
                              <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Flexible scheduling & routing
                              </li>
                              <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Premium vehicle selection
                              </li>
                              <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                24/7 support during service
                              </li>
                              <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Transparent pricing
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <div id="submit-section" className="text-center pt-8 relative">
                  {/* Global Switzerland Error - Positioned absolutely to not affect layout */}
                  {(errors.pickup === "At least one location must be in Switzerland" || errors.dropoff === "At least one location must be in Switzerland") && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-red-50 border border-red-200 rounded-lg p-3 shadow-lg z-10 min-w-[300px]">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.598 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-red-600 text-sm">At least one location must be in Switzerland.</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Submit Button - Desktop and Mobile (in normal position) */}
                  <Button 
                    type="submit" 
                    variant="secondary" 
                    className={`w-full md:w-auto min-w-[200px] py-3 px-8 text-base font-semibold tracking-wide transition-all duration-300 hover:shadow-[0_0_25px_rgba(65,105,225,0.2)] hover:transform hover:scale-105 ${
                      isButtonSticky ? 'md:block hidden' : 'block'
                    }`}
                  >
                    {reservationInfo.isSpecialRequest ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        Continue to Request Details
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        Continue to Vehicle Selection
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </form>

            {/* Route error modal */}
            <RouteErrorModal 
              isOpen={showRouteErrorModal} 
              onClose={() => setShowRouteErrorModal(false)} 
              errorType={routeErrorType}
              onSwitchToHourly={handleSwitchToHourly}
              onSwitchToSpecial={handleSwitchToSpecial}
            />
          </div>

          {/* Sticky Mobile Button - appears when scrolled past original button */}
          {isButtonSticky && (
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 transform translate-y-0 transition-all duration-300 ease-out">
              {/* Enhanced gradient background with brand colors */}
              <div className="absolute inset-0 bg-gradient-to-t from-warm-white via-cream-light/95 to-warm-white/80 backdrop-blur-lg"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-gold/5 via-transparent to-primary-gold/5"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-gold/30 to-transparent"></div>
              <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-primary-gold/10 to-transparent"></div>
              
              <div className="relative container mx-auto px-4 py-4">
                <div className="flex justify-center">
                  <Button 
                    type="submit" 
                    form="booking-form"
                    variant="secondary" 
                    className="w-full max-w-sm py-3 px-8 text-base font-semibold tracking-wide transition-all duration-300 hover:shadow-[0_0_25px_rgba(65,105,225,0.2)] hover:transform hover:scale-105"
                  >
                    {reservationInfo.isSpecialRequest ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        Continue to Request Details
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        Continue to Vehicle Selection
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Additional Features Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-warm-white/60 backdrop-blur-sm rounded-xl border border-primary-gold/10">
              <div className="w-12 h-12 bg-primary-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">Reliability</h4>
              <p className="text-xs text-gray-600">On-time service guaranteed</p>
            </div>
            
            <div className="text-center p-4 bg-warm-white/60 backdrop-blur-sm rounded-xl border border-primary-gold/10">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">Fair Pricing</h4>
              <p className="text-xs text-gray-600">Transparent rates, no hidden fees</p>
            </div>
            
            <div className="text-center p-4 bg-warm-white/60 backdrop-blur-sm rounded-xl border border-primary-gold/10">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">Professional</h4>
              <p className="text-xs text-gray-600">Trained, licensed chauffeurs</p>
            </div>
            
            <div className="text-center p-4 bg-warm-white/60 backdrop-blur-sm rounded-xl border border-primary-gold/10">
              <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m4 0H3a2 2 0 000 4h.01M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">Comfort</h4>
              <p className="text-xs text-gray-600">Luxury amenities included</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
