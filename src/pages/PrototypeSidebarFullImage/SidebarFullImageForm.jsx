import { useState, useContext, useRef } from "react";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import ReservationContext from "../../contexts/ReservationContext";
import TimeInput from "../../components/TimeInput";
import DateInput from "../../components/DateInput";
import RouteErrorModal from "../../components/RouteErrorModal";
import AddressInput from "../../components/AddressInput";
import { validateAddresses } from "../../services/GoogleMapsService";

const SidebarFullImageForm = () => {
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

  const debugRef = useRef({
    formSubmissions: 0,
    validationAttempts: 0,
    lastValidationResult: null
  });

  const handleInput = (e) => {
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
    originalHandleInput(e);
  };

  const handleSwitchToHourly = () => {
    setShowRouteErrorModal(false);
    setIsHourly(true);
    setIsSpecialRequest(false);
    navigate('/hourly-transfer');
  };

  const handleSwitchToSpecial = () => {
    setShowRouteErrorModal(false);
    setIsSpecialRequest(true);
    setIsHourly(false);
    navigate('/special-request');
  };

  const validateForm = async () => {
    debugRef.current.validationAttempts++;
    const newErrors = {};

    if (!reservationInfo.pickupLocation) {
      newErrors.pickupLocation = "Pickup location is required";
    }
    if (!reservationInfo.dropoffLocation) {
      newErrors.dropoffLocation = "Drop-off location is required";
    }
    if (!reservationInfo.date) {
      newErrors.date = "Date is required";
    }
    if (!reservationInfo.time) {
      newErrors.time = "Time is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    if (reservationInfo.pickupLocation && reservationInfo.dropoffLocation) {
      try {
        const validation = await validateAddresses(
          reservationInfo.pickupLocation, 
          reservationInfo.dropoffLocation
        );
        
        if (!validation.isValid) {
          setRouteErrorType(validation.errorType);
          setShowRouteErrorModal(true);
          return false;
        }
      } catch (error) {
        console.error('Validation error:', error);
        newErrors.general = "Unable to validate route. Please try again.";
        setErrors(newErrors);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    debugRef.current.formSubmissions++;
    
    const isValid = await validateForm();
    if (isValid) {
      navigate("/vehicle-selection");
    }
  };

  return (
    <>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-royal-blue to-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Reserve Now
            </h2>
            <p className="text-gray-600">Experience luxury in motion</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pickup Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Pickup Location
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-royal-blue">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <AddressInput
                  name="pickupLocation"
                  value={reservationInfo.pickupLocation}
                  onChange={handleInput}
                  onPlaceSelect={handlePlaceSelection}
                  placeholder="Where can we pick you up?"
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl ${
                    errors.pickupLocation ? 'border-red-500' : 'border-gray-200'
                  } focus:ring-2 focus:ring-royal-blue focus:border-royal-blue transition-all`}
                />
              </div>
              {errors.pickupLocation && (
                <p className="text-red-500 text-sm mt-2">{errors.pickupLocation}</p>
              )}
            </div>

            {/* Drop-off Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Drop-off Location
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-royal-blue">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <AddressInput
                  name="dropoffLocation"
                  value={reservationInfo.dropoffLocation}
                  onChange={handleInput}
                  onPlaceSelect={handlePlaceSelection}
                  placeholder="Where are you going?"
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl ${
                    errors.dropoffLocation ? 'border-red-500' : 'border-gray-200'
                  } focus:ring-2 focus:ring-royal-blue focus:border-royal-blue transition-all`}
                />
              </div>
              {errors.dropoffLocation && (
                <p className="text-red-500 text-sm mt-2">{errors.dropoffLocation}</p>
              )}
            </div>

            {/* Date & Time Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Date
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-royal-blue">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <DateInput
                    name="date"
                    value={reservationInfo.date}
                    onChange={handleInput}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl ${
                      errors.date ? 'border-red-500' : 'border-gray-200'
                    } focus:ring-2 focus:ring-royal-blue focus:border-royal-blue transition-all`}
                  />
                </div>
                {errors.date && (
                  <p className="text-red-500 text-sm mt-2">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Time
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-royal-blue">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <TimeInput
                    name="time"
                    value={reservationInfo.time}
                    onChange={handleInput}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl ${
                      errors.time ? 'border-red-500' : 'border-gray-200'
                    } focus:ring-2 focus:ring-royal-blue focus:border-royal-blue transition-all`}
                  />
                </div>
                {errors.time && (
                  <p className="text-red-500 text-sm mt-2">{errors.time}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                variant="primary"
                className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-royal-blue to-royal-blue-dark hover:from-royal-blue-dark hover:to-royal-blue transform hover:scale-105 transition-all duration-300"
              >
                Book Journey
              </Button>
            </div>
          </form>

          {/* Trust Indicators */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-4 text-center text-xs text-gray-500">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mb-1">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Instant booking</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span>Secure payment</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center mb-1">
                  <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <span>Premium service</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Route Error Modal */}
      <RouteErrorModal
        isOpen={showRouteErrorModal}
        onClose={() => setShowRouteErrorModal(false)}
        errorType={routeErrorType}
        onSwitchToHourly={handleSwitchToHourly}
        onSwitchToSpecial={handleSwitchToSpecial}
      />
    </>
  );
};

export default SidebarFullImageForm;
