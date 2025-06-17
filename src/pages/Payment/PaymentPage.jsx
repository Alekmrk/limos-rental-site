import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DateTime } from 'luxon';
import ReservationContext from "../../contexts/ReservationContext";
import Button from "../../components/Button";
import ProgressBar from "../../components/ProgressBar";
import { calculatePrice, formatPrice } from "../../services/PriceCalculationService";
import { sendPaymentConfirmation, sendCryptoPaymentConfirmation } from "../../services/EmailService";
import StripePayment from '../../components/StripePayment';

const PaymentPage = ({ scrollUp }) => {
  const navigate = useNavigate();
  const { reservationInfo, handleInput } = useContext(ReservationContext);
  
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [price, setPrice] = useState(0);
  const [usdtAddress, setUsdtAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    if (!reservationInfo.email ||
        !reservationInfo.pickup ||
        (!reservationInfo.isHourly && !reservationInfo.dropoff) ||
        !reservationInfo.date ||
        !reservationInfo.time ||
        !reservationInfo.selectedVehicle ||
        (reservationInfo.isHourly && (!reservationInfo.hours || reservationInfo.hours < 3 || reservationInfo.hours > 24)) ||
        (reservationInfo.isHourly && !reservationInfo.plannedActivities?.trim())
    ) {
      navigate('/customer-details');
    }
  }, [reservationInfo, navigate]);

  useEffect(() => {
    scrollUp();
  }, [scrollUp]);

  useEffect(() => {
    if (!reservationInfo.selectedVehicle) return;

    const calculatedPrice = calculatePrice(
      reservationInfo.totalDistance / 1000 || 0,
      0,
      reservationInfo.selectedVehicle.name,
      0,
      reservationInfo.isHourly,
      reservationInfo.isHourly ? parseInt(reservationInfo.hours) : 0
    );
    
    //setPrice(calculatedPrice || 0);
    // Overriding the price to a fixed value for cheap testing
    setPrice(0.5);
  }, [reservationInfo]);

  const handlePaymentMethodSelect = (method) => {
    if (isProcessing) return;
    setPaymentMethod(method);
    setErrorMessage('');
    setRetryCount(0);
    if (method === 'crypto') {
      setUsdtAddress("TRX7NHqkeAhVrKdZrHQJ2RRf2MeL5132cr");
    }
  };

  const handleBack = () => {
    if (!isProcessing) {
      navigate('/customer-details');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return DateTime.fromFormat(dateString, 'yyyy-MM-dd', { zone: 'Europe/Zurich' }).toFormat('dd-MM-yyyy');
    } catch {
      return dateString;
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      setIsProcessing(true);
      const now = DateTime.now().setZone('Europe/Zurich');
      const swissTime = now.toFormat('HH:mm:ss');
      const paymentDetails = {
        method: 'stripe',
        amount: price,
        currency: 'CHF',
        timestamp: now.toISO(),
        swissTimestamp: swissTime,
        reference: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      };
      await handleInput({
        target: {
          name: 'paymentDetails',
          value: paymentDetails
        }
      });
      navigate('/thankyou');
    } catch (error) {
      console.error("Error processing successful payment:", error);
      navigate('/thankyou');
    }
  };

  const handlePaymentError = (error) => {
    console.error("Payment error:", error);
    setIsProcessing(false);

    // Don't show payment validation errors in the bottom error box
    if (error.userMessage && (error.type === 'validation_error' || error.type === 'card_error')) {
      setErrorMessage('');
    } else {
      setErrorMessage(error.userMessage || "There was a problem processing your payment. Please try again.");
      setRetryCount(prev => prev + 1);

      if (retryCount >= maxRetries - 1) {
        setErrorMessage(
          "We're having trouble processing your card. You might want to try our alternative payment method below or contact support."
        );
      }
    }
  };

  const handleCryptoPayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      const now = new Date();
      const swissTime = now.toLocaleString('en-CH', {
        timeZone: 'Europe/Zurich',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      
      const paymentDetails = {
        method: 'crypto',
        amount: price,
        currency: 'USDT',
        timestamp: now.toISOString(),
        swissTimestamp: swissTime,
        reference: `USDT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      };

      // Update reservation context
      await handleInput({
        target: {
          name: 'paymentDetails',
          value: paymentDetails
        }
      });

      // Send crypto-specific payment confirmation
      try {
        await sendCryptoPaymentConfirmation({
          ...reservationInfo,
          paymentDetails
        });
      } catch (emailError) {
        console.error("Error sending crypto payment confirmation:", emailError);
        // Don't block the flow for email errors
      }

      navigate('/thankyou');
    } catch (error) {
      console.error("Error processing crypto payment:", error);
      setErrorMessage("There was a problem processing your payment. Please try again or contact support.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="container-default mt-28">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl md:text-7xl font-semibold mb-8">Payment</h1>
        
        <ProgressBar />

        <div className="space-y-6 max-w-5xl mx-auto">
          {/* Order Summary Section */}
          <div className="bg-zinc-800/30 p-6 rounded-lg border border-zinc-700/50">
            <h2 className="text-xl font-medium mb-6">Order Summary</h2>
            
            {/* Basic Info */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-zinc-400 text-sm mb-1">Vehicle</p>
                <p className="font-medium break-words">{reservationInfo.selectedVehicle?.name}</p>
              </div>
              <div>
                <p className="text-zinc-400 text-sm mb-1">Date</p>
                <p className="font-medium break-words">{formatDate(reservationInfo.date)}</p>
              </div>
              <div>
                <p className="text-zinc-400 text-sm mb-1">Time</p>
                <p className="font-medium break-words">{reservationInfo.time} (Swiss time)</p>
              </div>
            </div>

            {/* Transfer Details */}
            <div className="border-t border-zinc-700/50 pt-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Transfer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-zinc-400 text-sm mb-1">Pick Up</p>
                  <p className="font-medium break-words">{reservationInfo.pickup}</p>
                </div>
                {!reservationInfo.isHourly ? (
                  <>
                    {/* Extra stops */}
                    {reservationInfo.extraStops.map((stop, index) => (
                      stop && (
                        <div key={index} className="col-span-1 md:col-span-2 pl-4">
                          <p className="font-medium break-words">• {stop}</p>
                        </div>
                      )
                    ))}
                    <div>
                      <p className="text-zinc-400 text-sm mb-1">Drop Off</p>
                      <p className="font-medium break-words">{reservationInfo.dropoff}</p>
                    </div>
                    {/* Route Information */}
                    {reservationInfo.routeInfo && (
                      <div className="col-span-1 md:col-span-2 mt-4">
                        <p className="text-zinc-400 text-sm mb-2">Route Information</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/20 p-3 rounded-lg">
                          <p className="text-sm break-words">Distance: {reservationInfo.routeInfo.distance}</p>
                          <p className="text-sm break-words">Duration: {reservationInfo.routeInfo.duration}</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <p className="text-zinc-400 text-sm mb-1">Duration</p>
                    <p className="font-medium break-words">{reservationInfo.hours} hours</p>
                  </div>
                )}
                {/* Passenger Details */}
                <div className="col-span-1 md:col-span-2 mt-4">
                  <p className="text-zinc-400 text-sm mb-2">Passenger Details</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/20 p-3 rounded-lg">
                    <p className="text-sm break-words">Passengers: {reservationInfo.passengers}</p>
                    <p className="text-sm break-words">Bags: {reservationInfo.bags}</p>
                    {reservationInfo.childSeats > 0 && (
                      <p className="text-sm break-words">Child Seats (4-7): {reservationInfo.childSeats}</p>
                    )}
                    {reservationInfo.babySeats > 0 && (
                      <p className="text-sm break-words">Baby Seats (0-3): {reservationInfo.babySeats}</p>
                    )}
                    {reservationInfo.skiEquipment > 0 && (
                      <p className="text-sm break-words">Ski Equipment: {reservationInfo.skiEquipment}</p>
                    )}
                  </div>
                </div>
                {reservationInfo.flightNumber && (
                  <div>
                    <p className="text-zinc-400 text-sm mb-1">Flight Number</p>
                    <p className="font-medium break-words">{reservationInfo.flightNumber}</p>
                  </div>
                )}
                {reservationInfo.meetingBoard && (
                  <div>
                    <p className="text-zinc-400 text-sm mb-1">Meeting Board Name</p>
                    <p className="font-medium break-words">{reservationInfo.meetingBoard}</p>
                  </div>
                )}
              </div>
              {reservationInfo.isHourly && reservationInfo.plannedActivities && (
                <div className="mt-6">
                  <p className="text-zinc-400 text-sm mb-2">Planned Activities</p>
                  <p className="text-sm bg-black/20 p-3 rounded-lg break-words">{reservationInfo.plannedActivities}</p>
                </div>
              )}
              {reservationInfo.additionalRequests && (
                <div className="mt-6">
                  <p className="text-zinc-400 text-sm mb-2">{reservationInfo.isSpecialRequest ? 'Special Request Details' : 'Additional Requests'}</p>
                  <p className="text-sm bg-black/20 p-3 rounded-lg break-words">{reservationInfo.additionalRequests}</p>
                </div>
              )}
            </div>

            {/* Price Summary */}
            <div className="border-t border-zinc-700/50 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total Amount</span>
                <span className="text-xl font-medium text-gold">{formatPrice(price)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Select Payment Method</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handlePaymentMethodSelect('card')}
                disabled={isProcessing}
                className={`p-4 rounded-lg border transition-all ${
                  paymentMethod === 'card'
                    ? 'border-gold bg-gold/20'
                    : isProcessing 
                      ? 'border-zinc-700/50 bg-zinc-800/30 opacity-50 cursor-not-allowed'
                      : 'border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                  <span>Card</span>
                </div>
              </button>

              <button
                onClick={() => handlePaymentMethodSelect('crypto')}
                disabled={isProcessing}
                className={`p-4 rounded-lg border transition-all ${
                  paymentMethod === 'crypto'
                    ? 'border-gold bg-gold/20'
                    : isProcessing 
                      ? 'border-zinc-700/50 bg-zinc-800/30 opacity-50 cursor-not-allowed'
                      : 'border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.31-8.86c-1.77-.45-2.34-.94-2.34-1.67"/>
                  </svg>
                  <span>USDT (TRC20)</span>
                </div>
              </button>
            </div>
          </div>

          {/* Payment Forms */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <StripePayment
                amount={price}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                reservationInfo={reservationInfo}
              />
              
              <div className="mt-4 text-sm text-zinc-400">
                <p>• Secure card payment powered by Stripe</p>
                <p>• Your card will be charged immediately</p>
                <p>• You will receive a confirmation email</p>
                <p>• In case of issues, contact our support</p>
              </div>
            </div>
          )}

          {paymentMethod === 'crypto' && (
            <div className="space-y-4">
              <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-700">
                <p className="text-sm mb-2">Send {price} USDT (TRC20) to:</p>
                <p className="font-mono text-xs bg-black/30 p-2 rounded break-all">
                  {usdtAddress}
                </p>
                <div className="mt-4 text-sm text-zinc-400">
                  <p>• Send only USDT on TRC20 network</p>
                  <p>• Payment will be automatically detected</p>
                  <p>• Rate will be locked for 15 minutes</p>
                  <p>• In case of issues, contact our support</p>
                </div>
              </div>

              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleBack}
                  disabled={isProcessing}
                >
                  Back
                </Button>
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={handleCryptoPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'I\'ve Sent the Payment'}
                </Button>
              </div>
            </div>
          )}

          {/* Only show bottom error box for processing errors or system issues */}
          {errorMessage && retryCount > 0 && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-400">{errorMessage}</p>
              {retryCount >= maxRetries - 1 && (
                <p className="text-sm text-red-400 mt-2">
                  Need help? Contact our support at info@elitewaylimo.ch
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;