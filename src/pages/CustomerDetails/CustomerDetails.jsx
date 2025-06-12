import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReservationContext from "../../contexts/ReservationContext";
import Button from "../../components/Button";
import ProgressBar from "../../components/ProgressBar";

const CustomerDetails = ({ scrollUp }) => {
  const navigate = useNavigate();
  const { reservationInfo, handleInput } = useContext(ReservationContext);
  const [errors, setErrors] = useState({});

  // Check if we have the required data from previous steps
  useEffect(() => {
    if (reservationInfo.isSpecialRequest) {
      if (!reservationInfo.date || !reservationInfo.time) {
        navigate('/');
      }
    } else {
      if (!reservationInfo.pickup || 
          (!reservationInfo.isHourly && !reservationInfo.dropoff) || 
          !reservationInfo.date || 
          !reservationInfo.time || 
          (reservationInfo.isHourly && (!reservationInfo.hours || reservationInfo.hours < 2 || reservationInfo.hours > 24))
      ) {
        navigate('/');
      } else if (!reservationInfo.selectedVehicle || !reservationInfo.passengers || reservationInfo.passengers < 1) {
        navigate('/vehicle-selection');
      }
    }
  }, [reservationInfo, navigate]);

  const validateForm = () => {
    const newErrors = {};
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
    return Object.keys(newErrors).length === 0;
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


  useEffect(() => {
    const ensureScrollUp = () => {
      window.scrollTo(0, 0);
    };

    const timeoutId = setTimeout(ensureScrollUp, 100); // Add a slightly longer delay for reliability

    return () => clearTimeout(timeoutId); // Cleanup timeout on unmount
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
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={reservationInfo.email}
                onChange={handleInput}
                className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50"
                required
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
                onChange={handleInput}
                className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50"
                required
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
                    onChange={handleInput}
                    rows="4"
                    wrap="soft"
                    className={`bg-zinc-800/30 rounded-lg py-2 px-4 w-full border whitespace-pre-wrap ${
                      errors.plannedActivities ? 'border-red-500' : 'border-zinc-700/50'
                    }`}
                    placeholder="Please describe your planned activities during the rental period..."
                    style={{ resize: 'vertical', minHeight: '100px' }}
                  ></textarea>
                  {errors.plannedActivities && (
                    <span className="text-red-500 text-sm">{errors.plannedActivities}</span>
                  )}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="flightNumber">
                    Flight Number
                  </label>
                  <input
                    type="text"
                    id="flightNumber"
                    name="flightNumber"
                    value={reservationInfo.flightNumber}
                    onChange={handleInput}
                    className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="skiEquipment">
                    Number of Ski Equipment
                  </label>
                  <input
                    type="number"
                    id="skiEquipment"
                    name="skiEquipment"
                    min="0"
                    value={reservationInfo.skiEquipment}
                    onChange={handleInput}
                    className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="childSeats">
                    Child Seats (Ages 4-7)
                  </label>
                  <input
                    type="number"
                    id="childSeats"
                    name="childSeats"
                    min="0"
                    value={reservationInfo.childSeats}
                    onChange={handleInput}
                    className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="babySeats">
                    Baby Seats (Ages 0-3)
                  </label>
                  <input
                    type="number"
                    id="babySeats"
                    name="babySeats"
                    min="0"
                    value={reservationInfo.babySeats}
                    onChange={handleInput}
                    className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="mb-8">
              <div className="p-4 mb-6 bg-gold/10 rounded-lg border border-gold/20">
                <h3 className="text-lg font-medium text-gold mb-2">Your Special Request</h3>
                <p className="text-zinc-300">{reservationInfo.specialRequestDetails}</p>
                <div className="mt-3 text-sm text-zinc-400">
                  <p>Date: {reservationInfo.date}</p>
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
                onChange={handleInput}
                rows="6"
                wrap="soft"
                className={`bg-zinc-800/30 rounded-lg py-2 px-4 w-full border whitespace-pre-wrap ${
                  errors.additionalRequests ? 'border-red-500' : 'border-zinc-700/50'
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
                {reservationInfo.isSpecialRequest ? 'Special Request Details' : 'Additional Requests'}
              </label>
              <textarea
                id="additionalRequests"
                name="additionalRequests"
                value={reservationInfo.additionalRequests}
                onChange={handleInput}
                rows="4"
                wrap="soft"
                className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50 whitespace-pre-wrap"
                placeholder={reservationInfo.isSpecialRequest 
                  ? "Please provide any details about your special request..."
                  : "Any special requirements or requests..."}
                style={{ resize: 'vertical', minHeight: '100px' }}
              ></textarea>
            </div>
          )}

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