import { useState, useContext, useRef } from "react";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import ReservationContext from "../../contexts/ReservationContext";
import TimeInput from "../../components/TimeInput";
import DateInput from "../../components/DateInput";
import RouteErrorModal from "../../components/RouteErrorModal";
import AddressInput from "../../components/AddressInput";
import { validateAddresses } from "../../services/GoogleMapsService";

const FloatingReservationCard = () => {
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
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-royal-blue to-gold bg-clip-text text-transparent mb-3">
            Reserve Your Ride
          </h2>
          <p className="text-gray-600 text-lg">Experience luxury in motion</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
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
                  placeholder="Enter pickup location"
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl text-lg ${
                    errors.pickupLocation ? 'border-red-500' : 'border-gray-200'
                  } focus:ring-2 focus:ring-royal-blue focus:border-royal-blue transition-all`}
                />
              </div>
              {errors.pickupLocation && (
                <p className="text-red-500 text-sm mt-2">{errors.pickupLocation}</p>
              )}
            </div>

            <div className="relative">
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
                  placeholder="Enter drop-off location"
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl text-lg ${
                    errors.dropoffLocation ? 'border-red-500' : 'border-gray-200'
                  } focus:ring-2 focus:ring-royal-blue focus:border-royal-blue transition-all`}
                />
              </div>
              {errors.dropoffLocation && (
                <p className="text-red-500 text-sm mt-2">{errors.dropoffLocation}</p>
              )}
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
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
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl text-lg ${
                    errors.date ? 'border-red-500' : 'border-gray-200'
                  } focus:ring-2 focus:ring-royal-blue focus:border-royal-blue transition-all`}
                />
              </div>
              {errors.date && (
                <p className="text-red-500 text-sm mt-2">{errors.date}</p>
              )}
            </div>

            <div className="relative">
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
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl text-lg ${
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
          <div className="text-center pt-4">
            <Button 
              type="submit" 
              variant="primary"
              className="px-16 py-4 text-xl font-bold rounded-2xl bg-gradient-to-r from-royal-blue to-royal-blue-dark hover:from-royal-blue-dark hover:to-royal-blue shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Book Your Journey
            </Button>
          </div>
        </form>
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

export default FloatingReservationCard;
