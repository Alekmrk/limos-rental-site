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

const HorizontalReservationBar = () => {
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
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
      <div className="bg-white/95 backdrop-blur-sm border-t border-royal-blue/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-4">
            {/* Pickup Location */}
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Pickup Location
              </label>
              <AddressInput
                name="pickupLocation"
                value={reservationInfo.pickupLocation}
                onChange={handleInput}
                onPlaceSelect={handlePlaceSelection}
                placeholder="Enter pickup location"
                className={`w-full px-3 py-2 border rounded-lg text-sm ${
                  errors.pickupLocation ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-royal-blue focus:border-transparent`}
              />
              {errors.pickupLocation && (
                <p className="text-red-500 text-xs mt-1">{errors.pickupLocation}</p>
              )}
            </div>

            {/* Drop-off Location */}
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Drop-off Location
              </label>
              <AddressInput
                name="dropoffLocation"
                value={reservationInfo.dropoffLocation}
                onChange={handleInput}
                onPlaceSelect={handlePlaceSelection}
                placeholder="Enter drop-off location"
                className={`w-full px-3 py-2 border rounded-lg text-sm ${
                  errors.dropoffLocation ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-royal-blue focus:border-transparent`}
              />
              {errors.dropoffLocation && (
                <p className="text-red-500 text-xs mt-1">{errors.dropoffLocation}</p>
              )}
            </div>

            {/* Date */}
            <div className="w-32">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Date
              </label>
              <DateInput
                name="date"
                value={reservationInfo.date}
                onChange={handleInput}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-royal-blue focus:border-transparent`}
              />
              {errors.date && (
                <p className="text-red-500 text-xs mt-1">{errors.date}</p>
              )}
            </div>

            {/* Time */}
            <div className="w-24">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Time
              </label>
              <TimeInput
                name="time"
                value={reservationInfo.time}
                onChange={handleInput}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-royal-blue focus:border-transparent`}
              />
              {errors.time && (
                <p className="text-red-500 text-xs mt-1">{errors.time}</p>
              )}
            </div>



            {/* Submit Button */}
            <div className="flex-shrink-0">
              <div className="h-8"></div> {/* Spacer for label alignment */}
              <Button 
                type="submit" 
                variant="primary"
                className="px-6 py-2 h-10 text-sm"
              >
                Book Now
              </Button>
            </div>
          </form>
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

export default HorizontalReservationBar;
