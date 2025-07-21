import { useState, useContext, useRef } from "react";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import ReservationContext from "../../contexts/ReservationContext";
import TimeInput from "../../components/TimeInput";
import DateInput from "../../components/DateInput";
import RouteErrorModal from "../../components/RouteErrorModal";
import AddressInput from "../../components/AddressInput";
import { validateAddresses } from "../../services/GoogleMapsService";

const HybridReservationCard = () => {
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
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Book Your Journey</h2>
          <p className="text-gray-600">Premium transportation at your service</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Horizontal Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Pickup Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <AddressInput
                name="pickupLocation"
                value={reservationInfo.pickupLocation}
                onChange={handleInput}
                onPlaceSelect={handlePlaceSelection}
                placeholder="Pickup location"
                className={`w-full px-4 py-3 border rounded-xl ${
                  errors.pickupLocation ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-royal-blue focus:border-transparent transition-all`}
              />
              {errors.pickupLocation && (
                <p className="text-red-500 text-sm mt-1">{errors.pickupLocation}</p>
              )}
            </div>

            {/* Drop-off Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <AddressInput
                name="dropoffLocation"
                value={reservationInfo.dropoffLocation}
                onChange={handleInput}
                onPlaceSelect={handlePlaceSelection}
                placeholder="Drop-off location"
                className={`w-full px-4 py-3 border rounded-xl ${
                  errors.dropoffLocation ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-royal-blue focus:border-transparent transition-all`}
              />
              {errors.dropoffLocation && (
                <p className="text-red-500 text-sm mt-1">{errors.dropoffLocation}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <DateInput
                name="date"
                value={reservationInfo.date}
                onChange={handleInput}
                className={`w-full px-4 py-3 border rounded-xl ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-royal-blue focus:border-transparent transition-all`}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <TimeInput
                name="time"
                value={reservationInfo.time}
                onChange={handleInput}
                className={`w-full px-4 py-3 border rounded-xl ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-royal-blue focus:border-transparent transition-all`}
              />
              {errors.time && (
                <p className="text-red-500 text-sm mt-1">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <Button 
              type="submit" 
              variant="primary"
              className="px-12 py-4 text-lg font-semibold"
            >
              Continue to Vehicle Selection
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

export default HybridReservationCard;
