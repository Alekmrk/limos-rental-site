import { useContext, useState, useEffect } from "react";
import { useUTMPreservation } from "../../hooks/useUTMPreservation";
import { DateTime } from 'luxon';
import ReservationContext from "../../contexts/ReservationContext";
import Button from "../../components/Button";
import ProgressBar from "../../components/ProgressBar";
import NumberDropdown from "../../components/NumberDropdown";
import DateInput from "../../components/DateInput";
import TimeInput from "../../components/TimeInput";

const CustomerDetails = ({ scrollUp }) => {
  const { navigateWithUTMs } = useUTMPreservation();
  const { reservationInfo, handleInput } = useContext(ReservationContext);
  const [errors, setErrors] = useState({});
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false); // Start closed
  const [navbarStyle, setNavbarStyle] = useState('fixed');

  // Check if we have the required data from previous steps
  useEffect(() => {
    if (reservationInfo.isSpecialRequest) {
      // For special requests, no pre-requirements needed - date and time will be entered here
      return;
    } else {
      if (!reservationInfo.pickup || 
          (!reservationInfo.isHourly && !reservationInfo.dropoff) || 
          !reservationInfo.date || 
          !reservationInfo.time || 
          (reservationInfo.isHourly && (!reservationInfo.hours || reservationInfo.hours < 3 || reservationInfo.hours > 24))
      ) {
        navigateWithUTMs('/');
      } else if (!reservationInfo.selectedVehicle || !reservationInfo.passengers || reservationInfo.passengers < 1) {
        navigateWithUTMs('/vehicle-selection');
      }
    }
  }, [reservationInfo, navigateWithUTMs]);

  // Add handler to clear errors when user types
  const handleInputChange = (e) => {
    // Clear the error for the field being edited
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
    }
    
    // Always ensure receiveReceipt is false
    if (e.target.name === 'receiveReceipt') {
      const modifiedEvent = {
        ...e,
        target: {
          ...e.target,
          value: false
        }
      };
      handleInput(modifiedEvent);
    } else {
      handleInput(e);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Date and time validation for special requests
    if (reservationInfo.isSpecialRequest) {
      if (!reservationInfo.date) {
        newErrors.date = "Date is required";
      } else {
        // Use luxon for Swiss time comparison
        const selectedDate = DateTime.fromFormat(reservationInfo.date, 'yyyy-MM-dd', { zone: 'Europe/Zurich' });
        const swissNow = DateTime.now().setZone('Europe/Zurich');
        const selectedDateStart = selectedDate.startOf('day');
        const swissNowStart = swissNow.startOf('day');
        if (selectedDateStart < swissNowStart) {
          newErrors.date = "Date cannot be in the past";
        }
        
        // If date is today, check if time is at least 3 hours in advance
        if (reservationInfo.time && selectedDateStart.equals(swissNowStart)) {
          const [hours, minutes] = reservationInfo.time.split(':').map(Number);
          const selectedTime = selectedDate.set({ hour: hours, minute: minutes });
          const minAllowedTime = swissNow.plus({ hours: 3 });
          if (selectedTime < minAllowedTime) {
            newErrors.time = "Must book 3h in advance";
          }
        }
      }
      
      if (!reservationInfo.time) {
        newErrors.time = "Time is required";
      }
    }
    
    if (!reservationInfo.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(reservationInfo.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!reservationInfo.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (reservationInfo.isSpecialRequest) {
      if (!reservationInfo.additionalRequests?.trim()) {
        newErrors.additionalRequests = "Please provide any relevant details about your request";
      }
    }
    
    setErrors(newErrors);
    
    // If there are errors, scroll to the first error field
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      scrollToErrorField(firstErrorField);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  // Function to scroll to the error field
  const scrollToErrorField = (fieldName) => {
    setTimeout(() => {
      const fieldElement = document.getElementById(fieldName);
      if (fieldElement) {
        fieldElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
        // Optional: Focus on the field for better UX
        fieldElement.focus();
      }
    }, 100); // Small delay to ensure error state is rendered
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // For special requests, skip payment and go straight to thank you special page
      if (reservationInfo.isSpecialRequest) {
        navigateWithUTMs('/thank-you-special');
      } else {
        navigateWithUTMs('/payment');
      }
    }
  };

  const handleBack = () => {
    if (reservationInfo.isSpecialRequest) {
      navigateWithUTMs('/');
    } else {
      navigateWithUTMs('/vehicle-selection');
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

  useEffect(() => {
    const ensureScrollUp = () => {
      window.scrollTo(0, 0);
    };

    const timeoutId = setTimeout(ensureScrollUp, 100);
    
    // Trigger the animation to open Additional Details after page load
    const animationTimeout = setTimeout(() => {
      setShowAdditionalDetails(true);
    }, 500); // Wait 500ms after page load to start animation

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(animationTimeout);
    };
  }, []);

  // Footer detection effect for mobile navigation positioning
  useEffect(() => {
    const handleScroll = () => {
      // Only run on mobile devices
      if (window.innerWidth >= 768) return;
      
      const footer = document.querySelector('footer');
      if (!footer) return;
      
      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // If footer is visible in viewport (top of footer is above bottom of screen)
      if (footerRect.top < windowHeight) {
        setNavbarStyle('absolute');
      } else {
        setNavbarStyle('fixed');
      }
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    // Run once on mount
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Ensure receiveReceipt is always false
  useEffect(() => {
    if (reservationInfo.receiveReceipt !== false) {
      handleInput({
        target: {
          name: 'receiveReceipt',
          value: false
        }
      });
    }
  }, [reservationInfo.receiveReceipt, handleInput]);

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
            {reservationInfo.isSpecialRequest ? (
              <>
                <span className="text-royal-blue">Contact</span> Details
              </>
            ) : (
              <>
                <span className="text-royal-blue">Additional</span> Details
              </>
            )}
          </h1>
          
          <ProgressBar />
          
          <form 
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
              // Only prevent form submission for regular inputs, allow new lines in textareas
              if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
                e.preventDefault();
              }
            }}
          >
            {/* Date and Time Section for Special Requests */}
            {reservationInfo.isSpecialRequest && (
              <div className="mb-8">
                <div className="p-4 mb-6 bg-gradient-to-br from-gold/15 to-royal-blue/5 rounded-lg border border-gold/30 backdrop-blur-sm">
                  <h3 className="text-lg font-medium text-gold mb-2">Special Request Details</h3>
                  <p className="text-gray-600 mb-4">Please specify your preferred date and time for your custom transportation request.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="date">
                      Preferred Date *
                    </label>
                    <div className="relative">
                      <DateInput
                        value={reservationInfo.date}
                        onChange={(e) => {
                          setErrors(prev => ({ ...prev, date: undefined }));
                          handleInputChange(e);
                        }}
                        name="date"
                        id="date"
                        className={`bg-warm-white/80 backdrop-blur-sm rounded-lg py-3 px-4 w-full border text-gray-700 transition-all duration-200 hover:border-royal-blue/30 focus:border-royal-blue/50 focus:shadow-[0_0_15px_rgba(65,105,225,0.1)] ${
                          errors.date ? 'border-red-500 ring-1 ring-red-500/50' : 'border-royal-blue/20'
                        }`}
                        dropdownClassName="w-[90%] left-[5%]"
                      />
                      {errors.date && (
                        <span className="text-red-500 text-sm mt-1 block">{errors.date}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="time">
                      Preferred Time *
                    </label>
                    <div className="relative">
                      <TimeInput
                        value={reservationInfo.time}
                        onChange={(e) => {
                          setErrors(prev => ({ ...prev, time: undefined }));
                          handleInputChange(e);
                        }}
                        name="time"
                        id="time"
                        className={`bg-warm-white/80 backdrop-blur-sm rounded-lg py-3 px-4 w-full border text-gray-700 transition-all duration-200 hover:border-royal-blue/30 focus:border-royal-blue/50 focus:shadow-[0_0_15px_rgba(65,105,225,0.1)] ${
                          errors.time ? 'border-red-500 ring-1 ring-red-500/50' : 'border-royal-blue/20'
                        }`}
                        dropdownClassName="w-[90%] left-[5%]"
                      />
                      {errors.time && (
                        <span className="text-red-500 text-sm mt-1 block">{errors.time}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="email">
                  Email Address *
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={reservationInfo.email}
                  onChange={handleInputChange}
                  className={`bg-warm-white/80 backdrop-blur-sm rounded-lg py-2 px-4 w-full border text-gray-700 focus:outline-none focus:ring-1 focus:ring-royal-blue/20 transition-all duration-200 hover:border-royal-blue/30 focus:border-royal-blue/50 ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-royal-blue/20'
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email}</span>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="phone">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={reservationInfo.phone}
                  onChange={handleInputChange}
                  className={`bg-warm-white/80 backdrop-blur-sm rounded-lg py-2 px-4 w-full border text-gray-700 focus:outline-none focus:ring-1 focus:ring-royal-blue/20 transition-all duration-200 hover:border-royal-blue/30 focus:border-royal-blue/50 ${
                    errors.phone ? 'border-red-500 focus:border-red-500' : 'border-royal-blue/20'
                  }`}
                />
                {errors.phone && (
                  <span className="text-red-500 text-sm">{errors.phone}</span>
                )}
              </div>
            </div>

            {!reservationInfo.isSpecialRequest ? (
              <>
                {reservationInfo.isHourly && (
                  <div className="mb-8">
                    <div className="bg-gradient-to-br from-royal-blue/10 to-cream/5 p-4 mb-6 rounded-lg border border-royal-blue/20 backdrop-blur-sm">
                      <h3 className="text-lg font-medium text-royal-blue mb-2">Your Hourly Service</h3>
                      <p className="text-gray-600 mb-4">Please describe your planned activities during the booking to help us provide the best service.</p>
                      <div className="mt-3 text-sm text-gray-600">
                        <p>Date: {formatDate(reservationInfo.date)}</p>
                        <p>Service Duration: {reservationInfo.hours} hours</p>
                        <p>Time: {reservationInfo.time} (Swiss time)</p>
                      </div>
                    </div>
                    
                    <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="plannedActivities">
                      Planned Activities
                    </label>
                    <textarea
                      id="plannedActivities"
                      name="plannedActivities"
                      value={reservationInfo.plannedActivities}
                      onChange={handleInputChange}
                      rows="4"
                      wrap="soft"
                      className={`bg-warm-white/80 backdrop-blur-sm rounded-lg py-2 px-4 w-full border text-gray-700 whitespace-pre-wrap focus:outline-none focus:ring-1 focus:ring-royal-blue/20 transition-all duration-200 hover:border-royal-blue/30 focus:border-royal-blue/50 ${
                        errors.plannedActivities ? 'border-red-500 focus:border-red-500' : 'border-royal-blue/20'
                      }`}
                      placeholder="Optional: Describe your planned activities during the rental period..."
                      style={{ resize: 'vertical', minHeight: '100px' }}
                    ></textarea>
                    {errors.plannedActivities && (
                      <span className="text-red-500 text-sm">{errors.plannedActivities}</span>
                    )}
                  </div>
                )}

                {/* Additional Details Section */}
                <div className="mb-8">
                  <button
                    type="button"
                    onClick={() => setShowAdditionalDetails(!showAdditionalDetails)}
                    className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-cream-light/80 to-warm-white/80 backdrop-blur-sm rounded-lg border border-royal-blue/20 text-left hover:border-royal-blue/40 transition-all duration-300"
                  >
                    <span className="text-base font-medium text-gray-700">Additional Details <span className="text-sm text-gray-500">(Flight number, meeting board, booster/child seats)</span></span>
                    <svg
                      className={`w-4 h-4 text-royal-blue transition-transform duration-300 ${
                        showAdditionalDetails ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div
                    className={`transition-all duration-1000 ease-in-out ${
                      showAdditionalDetails 
                        ? 'max-h-[2000px] opacity-100 mt-6' 
                        : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
                  >
                    <div
                      className={`relative z-50 transform transition-all duration-1000 ease-in-out ${
                        showAdditionalDetails ? 'translate-y-0' : '-translate-y-4'
                      }`}
                      style={{ transitionDuration: showAdditionalDetails ? '1s' : '0.4s' }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="flightNumber">
                            Flight Number
                          </label>
                          <input
                            type="text"
                            id="flightNumber"
                            name="flightNumber"
                            value={reservationInfo.flightNumber}
                            onChange={handleInputChange}
                            className="bg-warm-white/80 backdrop-blur-sm rounded-lg py-2 px-4 w-full border border-royal-blue/20 text-gray-700 focus:border-royal-blue/40 focus:outline-none focus:ring-1 focus:ring-royal-blue/20 transition-all duration-200"
                            placeholder="e.g., LX123"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="meetingBoard">
                            Meet & Greet Sign <span className="text-xs text-gray-500 font-normal">(Name for pickup sign)</span>
                          </label>
                          <input
                            type="text"
                            id="meetingBoard"
                            name="meetingBoard"
                            value={reservationInfo.meetingBoard}
                            onChange={handleInputChange}
                            className="bg-warm-white/80 backdrop-blur-sm rounded-lg py-2 px-4 w-full border border-royal-blue/20 text-gray-700 focus:border-royal-blue/40 focus:outline-none focus:ring-1 focus:ring-royal-blue/20 transition-all duration-200"
                            placeholder="e.g., Mr. Smith, ABC Company"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <NumberDropdown
                            id="boosterSeats"
                            name="boosterSeats"
                            value={reservationInfo.boosterSeats}
                            onChange={handleInputChange}
                            min={0}
                            max={3}
                            label={
                              <span className="text-gray-700">
                                Booster Seats <span className="text-xs text-gray-500 font-normal">(Ages 4-7 / 15-36 kg)</span>
                              </span>
                            }
                          />
                        </div>
                        
                        <div>
                          <NumberDropdown
                            id="childSeats"
                            name="childSeats"
                            value={reservationInfo.childSeats}
                            onChange={handleInputChange}
                            min={0}
                            max={3}
                            label={
                              <span className="text-gray-700">
                                Child Seats <span className="text-xs text-gray-500 font-normal">(Ages 0-3 / up to 18 kg)</span>
                              </span>
                            }
                          />
                        </div>
                      </div>

                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mt-6">
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="m9 12 2 2 4-4"/>
                          </svg>
                          <p className="text-xs text-emerald-700">
                            Booster and child seats are provided free of charge. Please specify the exact number needed for your journey.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="mb-8">
                <div className="p-4 mb-6 bg-gradient-to-br from-gold/15 to-royal-blue/5 rounded-lg border border-gold/30 backdrop-blur-sm">
                  <h3 className="text-lg font-medium text-gold mb-2">Your Special Request</h3>
                  <p className="text-gray-600">{reservationInfo.specialRequestDetails}</p>
                  <div className="mt-3 text-sm text-gray-600">
                    <p>Date: {formatDate(reservationInfo.date)}</p>
                    <p>Preferred Time: {reservationInfo.time} (Swiss time)</p>
                  </div>
                </div>
                
                <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="additionalRequests">
                  Additional Information *
                </label>
                <textarea
                  id="additionalRequests"
                  name="additionalRequests"
                  value={reservationInfo.additionalRequests}
                  onChange={handleInputChange}
                  rows="6"
                  wrap="soft"
                  className={`bg-warm-white/80 backdrop-blur-sm rounded-lg py-2 px-4 w-full border text-gray-700 whitespace-pre-wrap focus:outline-none focus:ring-1 focus:ring-royal-blue/20 transition-all duration-200 hover:border-royal-blue/30 focus:border-royal-blue/50 ${
                    errors.additionalRequests ? 'border-red-500 focus:border-red-500' : 'border-royal-blue/20'
                  }`}
                  placeholder="Please provide any additional details that would help us understand your requirements better (e.g., number of guests, event type, specific vehicle preferences, budget constraints, etc.)"
                  style={{ resize: 'vertical', minHeight: '150px' }}
                ></textarea>
                {errors.additionalRequests && (
                  <span className="text-red-500 text-sm">{errors.additionalRequests}</span>
                )}
              </div>
            )}

            {!reservationInfo.isSpecialRequest && (
              <div className="mb-8">
                <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="additionalRequests">
                  Additional Requests
                </label>
                <textarea
                  id="additionalRequests"
                  name="additionalRequests"
                  value={reservationInfo.additionalRequests}
                  onChange={handleInputChange}
                  rows="4"
                  wrap="soft"
                  className="bg-warm-white/80 backdrop-blur-sm rounded-lg py-2 px-4 w-full border border-royal-blue/20 text-gray-700 whitespace-pre-wrap focus:border-royal-blue/40 focus:outline-none focus:ring-1 focus:ring-royal-blue/20 transition-all duration-200"
                  placeholder="Any special requirements or requests..."
                  style={{ resize: 'vertical', minHeight: '100px' }}
                ></textarea>
              </div>
            )}

            <div className="mb-8">
              {/* Reference Information Section - Always visible */}
              <div className="mb-2">
                <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="referenceNumber">
                  Reference Information <span className="text-xs text-gray-500 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="referenceNumber"
                  name="referenceNumber"
                  value={reservationInfo.referenceNumber}
                  onChange={handleInputChange}
                  rows="2"
                  wrap="soft"
                  className="bg-warm-white/90 backdrop-blur-sm rounded-lg py-3 px-4 w-full border border-royal-blue/20 text-gray-700 whitespace-pre-wrap focus:border-royal-blue/40 focus:outline-none focus:ring-2 focus:ring-royal-blue/10 transition-all duration-200"
                  placeholder="Reference number or billing info for your receipt..."
                  style={{ resize: 'vertical', minHeight: '60px' }}
                ></textarea>
              </div>
              
              <p className="text-xs text-gray-600 px-1">
                Reference information will appear on your invoice for accounting purposes.
              </p>
            </div>

            {/* Desktop Navigation Buttons */}
            <div className="hidden md:flex justify-between">
              <Button
                type="button"
                variant="secondary"
                onClick={handleBack}
                className="bg-warm-white/80 backdrop-blur-sm border-royal-blue/30 text-gray-700 hover:bg-royal-blue/10"
              >
                Back
              </Button>
              <Button 
                type="submit" 
                variant="secondary"
                className="bg-gradient-to-r from-royal-blue to-royal-blue-light hover:from-royal-blue-light hover:to-royal-blue text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {reservationInfo.isSpecialRequest ? "Submit Request" : "Pay Now"}
              </Button>
            </div>

            {/* Mobile Fixed/Absolute Bottom Navigation */}
            <div className={`md:hidden ${navbarStyle} bottom-0 left-0 right-0 z-50 transform translate-y-0 transition-all duration-300 ease-out`}>
              {/* Enhanced gradient background with brand colors - only when fixed */}
              {navbarStyle === 'fixed' && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-warm-white via-cream-light/95 to-warm-white/80 backdrop-blur-lg"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-gold/5 via-transparent to-primary-gold/5"></div>
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-gold/30 to-transparent"></div>
                  <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-primary-gold/10 to-transparent"></div>
                </>
              )}
              
              <div className="relative container mx-auto px-4 py-4">
                <div className="flex justify-between items-center gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleBack}
                    className="flex-1 bg-warm-white/80 backdrop-blur-sm border-royal-blue/30 text-gray-700 hover:bg-royal-blue/10 py-3"
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    variant="secondary"
                    className="flex-1 bg-gradient-to-r from-royal-blue to-royal-blue-light hover:from-royal-blue-light hover:to-royal-blue text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3"
                  >
                    {reservationInfo.isSpecialRequest ? "Submit Request" : "Pay Now"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile bottom padding to prevent content from being hidden behind fixed navbar */}
            <div className="md:hidden h-20"></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;