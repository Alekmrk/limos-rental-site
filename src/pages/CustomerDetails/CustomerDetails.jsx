import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DateTime } from 'luxon';
import ReservationContext from "../../contexts/ReservationContext";
import Button from "../../components/Button";
import ProgressBar from "../../components/ProgressBar";
import NumberDropdown from "../../components/NumberDropdown";
import DateInput from "../../components/DateInput";
import TimeInput from "../../components/TimeInput";

const CustomerDetails = ({ scrollUp }) => {
  const navigate = useNavigate();
  const { reservationInfo, handleInput } = useContext(ReservationContext);
  const [errors, setErrors] = useState({});
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false); // Start closed

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
        navigate('/');
      } else if (!reservationInfo.selectedVehicle || !reservationInfo.passengers || reservationInfo.passengers < 1) {
        navigate('/vehicle-selection');
      }
    }
  }, [reservationInfo, navigate]);

  // Add handler to clear errors when user types
  const handleInputChange = (e) => {
    // Clear the error for the field being edited
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
    }
    // Call the original handleInput
    handleInput(e);
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
    } else if (reservationInfo.isHourly && !reservationInfo.plannedActivities?.trim()) {
      newErrors.plannedActivities = "Please describe your planned activities";
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
      // For special requests, skip payment and go straight to thank you
      if (reservationInfo.isSpecialRequest) {
        navigate('/thankyou');
      } else {
        navigate('/payment');
      }
    }
  };

  const handleBack = () => {
    if (reservationInfo.isSpecialRequest) {
      navigate('/');
    } else {
      navigate('/vehicle-selection');
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

  return (
    <div className="container-default mt-28">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-semibold mb-8">
          {reservationInfo.isSpecialRequest ? "Contact Details" : "Additional Details"}
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
              <div className="p-4 mb-6 bg-gold/10 rounded-lg border border-gold/20">
                <h3 className="text-lg font-medium text-gold mb-2">Special Request Details</h3>
                <p className="text-zinc-300 mb-4">Please specify your preferred date and time for your custom transportation request.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="date">
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
                      className={`bg-zinc-800/30 rounded-lg py-3 px-4 w-full border text-white transition-all duration-200 hover:border-zinc-600 focus:border-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] ${
                        errors.date ? 'border-red-500 ring-1 ring-red-500/50' : 'border-zinc-700/50'
                      }`}
                      dropdownClassName="w-[90%] left-[5%]"
                    />
                    {errors.date && (
                      <span className="text-red-500 text-sm mt-1 block">{errors.date}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="time">
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
                      className={`bg-zinc-800/30 rounded-lg py-3 px-4 w-full border text-white transition-all duration-200 hover:border-zinc-600 focus:border-gold/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] ${
                        errors.time ? 'border-red-500 ring-1 ring-red-500/50' : 'border-zinc-700/50'
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
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                Email Address *
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={reservationInfo.email}
                onChange={handleInputChange}
                className={`bg-zinc-800/30 rounded-lg py-2 px-4 w-full border focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all duration-200 ${
                  errors.email ? 'border-red-500 focus:border-red-500' : 'border-zinc-700/50 focus:border-gold/40'
                }`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="phone">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={reservationInfo.phone}
                onChange={handleInputChange}
                className={`bg-zinc-800/30 rounded-lg py-2 px-4 w-full border focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all duration-200 ${
                  errors.phone ? 'border-red-500 focus:border-red-500' : 'border-zinc-700/50 focus:border-gold/40'
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
                  <label className="block text-sm font-medium mb-2" htmlFor="plannedActivities">
                    Planned Activities *
                  </label>
                  <textarea
                    id="plannedActivities"
                    name="plannedActivities"
                    value={reservationInfo.plannedActivities}
                    onChange={handleInputChange}
                    rows="4"
                    wrap="soft"
                    className={`bg-zinc-800/30 rounded-lg py-2 px-4 w-full border whitespace-pre-wrap focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all duration-200 ${
                      errors.plannedActivities ? 'border-red-500 focus:border-red-500' : 'border-zinc-700/50 focus:border-gold/40'
                    }`}
                    placeholder="Please describe your planned activities during the rental period..."
                    style={{ resize: 'vertical', minHeight: '100px' }}
                  ></textarea>
                  {errors.plannedActivities && (
                    <span className="text-red-500 text-sm">{errors.plannedActivities}</span>
                  )}
                </div>
              )}

              {/* Collapsible Additional Details Section */}
              <div className="mb-8">
                <button
                  type="button"
                  onClick={() => setShowAdditionalDetails(!showAdditionalDetails)}
                  className="flex items-center justify-between w-full p-4 bg-zinc-800/20 rounded-lg border border-zinc-700/50 hover:bg-zinc-800/30 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="m22 21-3-3"/>
                    </svg>
                    <span className="text-sm font-medium">Additional Passenger Details</span>
                    <span className="text-xs text-zinc-400">(Flight number, meeting board, child seats)</span>
                  </div>
                  <svg 
                    className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${
                      showAdditionalDetails ? 'rotate-180' : ''
                    }`} 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>

                {/* Expandable Content */}
                <div 
                  className={`transition-all ease-in-out ${
                    showAdditionalDetails 
                      ? 'max-h-[800px] opacity-100' 
                      : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
                  style={{ transitionDuration: showAdditionalDetails ? '1s' : '0.4s' }}
                >
                  <div 
                    className={`pt-6 space-y-6 transform transition-transform ease-in-out ${
                      showAdditionalDetails ? 'translate-y-0' : '-translate-y-4'
                    }`}
                    style={{ transitionDuration: showAdditionalDetails ? '1s' : '0.4s' }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="flightNumber">
                          Flight Number
                        </label>
                        <input
                          type="text"
                          id="flightNumber"
                          name="flightNumber"
                          value={reservationInfo.flightNumber}
                          onChange={handleInputChange}
                          className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all duration-200"
                          placeholder="e.g., LX123"
                        />
                      </div>
                      
                      <div className= "hidden">
                        <NumberDropdown
                          id="skiEquipment"
                          name="skiEquipment"
                          value={reservationInfo.skiEquipment}
                          onChange={handleInput}
                          min={0}
                          max={20}
                          label="Number of Ski Equipment"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="meetingBoard">
                          Meet & Greet Sign <span className="text-xs text-zinc-400 font-normal">(Name for pickup sign)</span>
                        </label>
                        <input
                          type="text"
                          id="meetingBoard"
                          name="meetingBoard"
                          value={reservationInfo.meetingBoard}
                          onChange={handleInputChange}
                          className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all duration-200"
                          placeholder="e.g., Mr. Smith, ABC Company"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <NumberDropdown
                          id="childSeats"
                          name="childSeats"
                          value={reservationInfo.childSeats}
                          onChange={handleInputChange}
                          min={0}
                          max={3}
                          label={
                            <span>
                              Child Seats <span className="text-xs text-zinc-400 font-normal">(Ages 4-7 / 15-36 kg)</span>
                            </span>
                          }
                        />
                      </div>
                      
                      <div>
                        <NumberDropdown
                          id="babySeats"
                          name="babySeats"
                          value={reservationInfo.babySeats}
                          onChange={handleInputChange}
                          min={0}
                          max={3}
                          label={
                            <span>
                              Baby Seats <span className="text-xs text-zinc-400 font-normal">(Ages 0-3 / up to 18 kg)</span>
                            </span>
                          }
                        />
                      </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="m9 12 2 2 4-4"/>
                        </svg>
                        <p className="text-xs text-blue-200">
                          Child and baby seats are provided free of charge. Please specify the exact number needed for your journey.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="mb-8">
              <div className="p-4 mb-6 bg-gold/10 rounded-lg border border-gold/20">
                <h3 className="text-lg font-medium text-gold mb-2">Your Special Request</h3>
                <p className="text-zinc-300">{reservationInfo.specialRequestDetails}</p>
                <div className="mt-3 text-sm text-zinc-400">
                  <p>Date: {formatDate(reservationInfo.date)}</p>
                  <p>Preferred Time: {reservationInfo.time} (Swiss time)</p>
                </div>
              </div>
              
              <label className="block text-sm font-medium mb-2" htmlFor="additionalRequests">
                Additional Information *
              </label>
              <textarea
                id="additionalRequests"
                name="additionalRequests"
                value={reservationInfo.additionalRequests}
                onChange={handleInputChange}
                rows="6"
                wrap="soft"
                className={`bg-zinc-800/30 rounded-lg py-2 px-4 w-full border whitespace-pre-wrap focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all duration-200 ${
                  errors.additionalRequests ? 'border-red-500 focus:border-red-500' : 'border-zinc-700/50 focus:border-gold/40'
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
              <label className="block text-sm font-medium mb-2" htmlFor="additionalRequests">
                Additional Requests
              </label>
              <textarea
                id="additionalRequests"
                name="additionalRequests"
                value={reservationInfo.additionalRequests}
                onChange={handleInputChange}
                rows="4"
                wrap="soft"
                className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50 whitespace-pre-wrap focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all duration-200"
                placeholder="Any special requirements or requests..."
                style={{ resize: 'vertical', minHeight: '100px' }}
              ></textarea>
            </div>
          )}

          <div className="mb-8">
            <label className="block text-sm font-medium mb-2" htmlFor="referenceNumber">
              Reference Number or Cost Center
            </label>
            <textarea
              id="referenceNumber"
              name="referenceNumber"
              value={reservationInfo.referenceNumber}
              onChange={handleInputChange}
              rows="3"
              wrap="soft"
              className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50 whitespace-pre-wrap focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all duration-200"
              placeholder="Reference number, cost center, project code, or billing info for your invoice..."
              style={{ resize: 'vertical', minHeight: '75px' }}
            ></textarea>
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button type="submit" variant="secondary">
              {reservationInfo.isSpecialRequest ? "Submit Request" : "Pay Now"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerDetails;