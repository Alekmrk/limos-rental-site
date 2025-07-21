import { useState, useContext, useRef } from "react";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import ReservationContext from "../../contexts/ReservationContext";
import TimeInput from "../../components/TimeInput";
import DateInput from "../../components/DateInput";
import RouteErrorModal from "../../components/RouteErrorModal";
import AddressInput from "../../components/AddressInput";
import { validateAddresses } from "../../services/GoogleMapsService";
import { DateTime } from 'luxon';

const SplitReservationForm = () => {
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
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-royal-blue/10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Book Your Ride</h2>
          <p className="text-gray-600">Fill in your journey details</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pickup Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              From
            </label>
            <AddressInput
              name="pickupLocation"
              value={reservationInfo.pickupLocation}
              onChange={handleInput}
              onPlaceSelect={handlePlaceSelection}
              placeholder="Pickup location"
              className={`w-full px-4 py-3 border-2 rounded-xl text-lg ${
                errors.pickupLocation ? 'border-red-500' : 'border-gray-200'
              } focus:ring-2 focus:ring-royal-blue focus:border-royal-blue transition-all`}
            />
            {errors.pickupLocation && (
              <p className="text-red-500 text-sm mt-2">{errors.pickupLocation}</p>
            )}
          </div>

          {/* Drop-off Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              To
            </label>
            <AddressInput
              name="dropoffLocation"
              value={reservationInfo.dropoffLocation}
              onChange={handleInput}
              onPlaceSelect={handlePlaceSelection}
              placeholder="Drop-off location"
              className={`w-full px-4 py-3 border-2 rounded-xl text-lg ${
                errors.dropoffLocation ? 'border-red-500' : 'border-gray-200'
              } focus:ring-2 focus:ring-royal-blue focus:border-royal-blue transition-all`}
            />
            {errors.dropoffLocation && (
              <p className="text-red-500 text-sm mt-2">{errors.dropoffLocation}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date
            </label>
            <DateInput
              name="date"
              value={reservationInfo.date}
              onChange={handleInput}
              className={`w-full px-4 py-3 border-2 rounded-xl text-lg ${
                errors.date ? 'border-red-500' : 'border-gray-200'
              } focus:ring-2 focus:ring-royal-blue focus:border-royal-blue transition-all`}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-2">{errors.date}</p>
            )}
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Time
            </label>
            <TimeInput
              name="time"
              value={reservationInfo.time}
              onChange={handleInput}
              className={`w-full px-4 py-3 border-2 rounded-xl text-lg ${
                errors.time ? 'border-red-500' : 'border-gray-200'
              } focus:ring-2 focus:ring-royal-blue focus:border-royal-blue transition-all`}
            />
            {errors.time && (
              <p className="text-red-500 text-sm mt-2">{errors.time}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button 
              type="submit" 
              variant="primary"
              className="w-full py-4 text-lg font-bold rounded-xl"
            >
              Get Your Quote
            </Button>
          </div>
        </form>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>✓ Instant confirmation</p>
          <p>✓ Professional chauffeurs</p>
          <p>✓ Luxury vehicles</p>
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

export default SplitReservationForm;
