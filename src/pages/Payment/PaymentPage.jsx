import { useState, useContext, useEffect } from "react";
import { useUTMPreservation } from "../../hooks/useUTMPreservation";
import { DateTime } from 'luxon';
import ReservationContext from "../../contexts/ReservationContext";
import Button from "../../components/Button";
import ProgressBar from "../../components/ProgressBar";
import { calculatePrice, formatPrice } from "../../services/PriceCalculationService";
import { sendPaymentConfirmation, sendCryptoPaymentConfirmation } from "../../services/EmailService";
import StripePayment from '../../components/StripePayment';
import usePaymentFlowCookieSuppression from '../../hooks/usePaymentFlowCookieSuppression';

const PaymentPage = ({ scrollUp }) => {
  const { navigateWithUTMs } = useUTMPreservation();
  const { reservationInfo, handleInput } = useContext(ReservationContext);
  
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [price, setPrice] = useState(0);
  const [usdtAddress, setUsdtAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [isButtonSticky, setIsButtonSticky] = useState(false);
  const [paymentHandler, setPaymentHandler] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const maxRetries = 3;

  // Suppress cookie consent during payment flow
  const { clearSuppression } = usePaymentFlowCookieSuppression(true, 60000); // 60 seconds

  useEffect(() => {
    // Skip validation if user is retrying payment from cancel page
    if (reservationInfo.isRetryingPayment) {
      // Clear the retry flag after a short delay
      setTimeout(() => {
        handleInput({
          target: {
            name: 'isRetryingPayment',
            value: false
          }
        });
      }, 1000);
      return;
    }

    if (!reservationInfo.email ||
        !reservationInfo.pickup ||
        (!reservationInfo.isHourly && !reservationInfo.dropoff) ||
        !reservationInfo.date ||
        !reservationInfo.time ||
        !reservationInfo.selectedVehicle ||
        (reservationInfo.isHourly && (!reservationInfo.hours || reservationInfo.hours < 3 || reservationInfo.hours > 24))
    ) {
      navigateWithUTMs('/customer-details');
    }
  }, [reservationInfo, navigateWithUTMs, handleInput]);

  // Remove the separate useEffect for cookie suppression since we're using the hook now

  useEffect(() => {
    scrollUp();
  }, [scrollUp]);

  // Sticky button behavior
  useEffect(() => {
    const handleScroll = () => {
      // Only on mobile
      if (window.innerWidth >= 768) {
        setIsButtonSticky(false);
        return;
      }

      // Find the stripe payment section (the actual button area)
      const submitSection = document.getElementById('stripe-payment-section');
      if (!submitSection) return;

      const rect = submitSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Trigger 30px earlier (when bottom is 30px below viewport)
      const triggerOffset = 30;
      // Add buffer to prevent glitching at the boundary
      const buffer = 30;
      
      // If the bottom of the payment section is 30px below the viewport (with buffer), make button sticky
      if (rect.bottom > windowHeight - triggerOffset + buffer) {
        setIsButtonSticky(true);
      } else if (rect.bottom < windowHeight - triggerOffset - buffer) {
        setIsButtonSticky(false);
      }
      // Don't change state when within the buffer zone to prevent flickering
    };

    // Add a small delay to ensure the component is fully rendered
    const timeoutId = setTimeout(() => {
      if (window.innerWidth < 768) {
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        
        // Initial check
        handleScroll();
      }
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [paymentMethod]); // Re-run when payment method changes

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
      // TEMPORARY: Override price to 0.5 CHF for testing - REMOVE THIS LATER
    setPaymentMethod("card");
    setPrice(calculatedPrice || 0);
  }, [reservationInfo]);

  const handlePaymentMethodSelect = (method) => {
    if (isProcessing) return;
    setPaymentMethod(method);
    setErrorMessage('');
    setRetryCount(0);
    if (method === 'crypto') {
      setUsdtAddress("TRX7NHqkeAhVrKdZrHQJ2RRf2MeL5132cr");
    }
    
    // Scroll to payment method selection when card is selected
    if (method === 'card') {
      setTimeout(() => {
        const paymentMethodSection = document.querySelector('[data-payment-methods]');
        if (paymentMethodSection) {
          paymentMethodSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 150); // Reduced delay slightly for more responsive feel
    }
  };

  const handleBack = () => {
    if (!isProcessing) {
      navigateWithUTMs('/customer-details');
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
      navigateWithUTMs('/thankyou');
    } catch (error) {
      console.error("Error processing successful payment:", error);
      navigateWithUTMs('/thankyou');
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

      navigateWithUTMs('/thankyou');
    } catch (error) {
      console.error("Error processing crypto payment:", error);
      setErrorMessage("There was a problem processing your payment. Please try again or contact support.");
      setIsProcessing(false);
    }
  };

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
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-semibold mb-8 text-gray-700">
            <span className="text-royal-blue">Payment</span>
          </h1>
          
          <ProgressBar />

          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Order Summary Section */}
            <div className="bg-warm-white/90 backdrop-blur-md p-6 rounded-xl border border-royal-blue/20 shadow-lg">
              <h2 className="text-xl font-medium mb-6 text-gray-700">Order Summary</h2>
              
              {/* Customer Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4 text-gray-700">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {reservationInfo.firstName && (
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Name</p>
                      <p className="text-base font-medium break-words text-gray-700">{reservationInfo.firstName}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Email</p>
                    <p className="text-base font-medium break-words text-gray-700">{reservationInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Phone</p>
                    <p className="text-base font-medium break-words text-gray-700">{reservationInfo.phone}</p>
                  </div>
                </div>
              </div>

              {/* Service & Schedule */}
              <div className="border-t border-royal-blue/20 pt-6 mb-8">
                <h3 className="text-lg font-medium mb-4 text-gray-700">Service & Schedule</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Vehicle</p>
                    <p className="text-base font-medium break-words text-gray-700">{reservationInfo.selectedVehicle?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Date</p>
                    <p className="text-base font-medium break-words text-gray-700">{formatDate(reservationInfo.date)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Time</p>
                    <p className="text-base font-medium break-words text-gray-700">{reservationInfo.time} (Swiss time)</p>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="border-t border-royal-blue/20 pt-6 mb-8">
                <h3 className="text-lg font-medium mb-4 text-gray-700">Trip Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Pick Up Location</p>
                    <p className="text-base font-medium break-words text-gray-700">{reservationInfo.pickup}</p>
                  </div>
                  {!reservationInfo.isHourly ? (
                    <>
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Drop Off Location</p>
                        <p className="text-base font-medium break-words text-gray-700">{reservationInfo.dropoff}</p>
                      </div>
                      {/* Extra stops */}
                      {reservationInfo.extraStops.some(stop => stop) && (
                        <div className="col-span-1 md:col-span-2">
                          <p className="text-gray-600 text-sm mb-2">Additional Stops</p>
                          <div className="space-y-1">
                            {reservationInfo.extraStops.map((stop, index) => (
                              stop && (
                                <p key={index} className="text-base font-medium break-words text-gray-700 pl-4">• {stop}</p>
                              )
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Route Information */}
                      {reservationInfo.routeInfo && (
                        <div className="col-span-1 md:col-span-2">
                          <p className="text-gray-600 text-sm mb-2">Route Information</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-royal-blue/5 p-3 rounded-lg">
                            <p className="text-base break-words text-gray-700">Distance: {reservationInfo.routeInfo.distance}</p>
                            <p className="text-base break-words text-gray-700">Duration: {reservationInfo.routeInfo.duration}</p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Service Duration</p>
                      <p className="text-base font-medium break-words text-gray-700">{reservationInfo.hours} hours</p>
                    </div>
                  )}
                </div>
                
                {reservationInfo.isHourly && reservationInfo.plannedActivities && (
                  <div className="mt-6">
                    <p className="text-gray-600 text-sm mb-2">Planned Activities</p>
                    <p className="text-base bg-royal-blue/5 p-3 rounded-lg break-words text-gray-700">{reservationInfo.plannedActivities}</p>
                  </div>
                )}
              </div>

              {/* Passenger & Requirements */}
              <div className="border-t border-royal-blue/20 pt-6 mb-8">
                <h3 className="text-lg font-medium mb-4 text-gray-700">Passenger & Requirements</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Passengers</p>
                    <p className="text-base font-medium break-words text-gray-700">{reservationInfo.passengers}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Bags</p>
                    <p className="text-base font-medium break-words text-gray-700">{reservationInfo.bags}</p>
                  </div>
                  {reservationInfo.childSeats > 0 && (
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Child Seats (0-3)</p>
                      <p className="text-base font-medium break-words text-gray-700">{reservationInfo.childSeats}</p>
                    </div>
                  )}
                  {reservationInfo.boosterSeats > 0 && (
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Booster Seats (4-7)</p>
                      <p className="text-base font-medium break-words text-gray-700">{reservationInfo.boosterSeats}</p>
                    </div>
                  )}
                  {reservationInfo.skiEquipment > 0 && (
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Ski Equipment</p>
                      <p className="text-base font-medium break-words text-gray-700">{reservationInfo.skiEquipment}</p>
                    </div>
                  )}
                  {reservationInfo.flightNumber && (
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Flight Number</p>
                      <p className="text-base font-medium break-words text-gray-700">{reservationInfo.flightNumber}</p>
                    </div>
                  )}
                  {reservationInfo.meetingBoard && (
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Meeting Board Name</p>
                      <p className="text-base font-medium break-words text-gray-700">{reservationInfo.meetingBoard}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              {(reservationInfo.additionalRequests || reservationInfo.referenceNumber) && (
                <div className="border-t border-royal-blue/20 pt-6 mb-8">
                  <h3 className="text-lg font-medium mb-4 text-gray-700">Additional Information</h3>
                  
                  {reservationInfo.additionalRequests && (
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm mb-2">{reservationInfo.isSpecialRequest ? 'Special Request Details' : 'Additional Requests'}</p>
                      <p className="text-base bg-royal-blue/5 p-3 rounded-lg break-words text-gray-700">{reservationInfo.additionalRequests}</p>
                    </div>
                  )}
                  
                  {reservationInfo.referenceNumber && (
                    <div>
                      <p className="text-gray-600 text-sm mb-2">Reference Information</p>
                      <div className="text-base bg-royal-blue/5 p-3 rounded-lg text-gray-700">
                        <p><span className="font-medium">Reference:</span> {reservationInfo.referenceNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Price Summary */}
              <div className="border-t border-royal-blue/20 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">Total Amount</span>
                  <span className="text-xl font-medium text-royal-blue">{formatPrice(price)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-4 bg-warm-white/90 backdrop-blur-md p-6 rounded-xl border border-royal-blue/20 shadow-lg" data-payment-methods>
              <h2 className="text-xl font-medium text-gray-700">Selected Payment Method</h2>
              
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => handlePaymentMethodSelect('card')}
                  disabled={isProcessing}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    paymentMethod === 'card'
                      ? 'border-gold bg-gradient-to-br from-gold/20 to-royal-blue/10 shadow-lg'
                      : isProcessing 
                        ? 'border-royal-blue/20 bg-warm-white/50 opacity-50 cursor-not-allowed'
                        : 'border-royal-blue/20 bg-warm-white/80 hover:border-gold/50 hover:shadow-lg'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8 text-royal-blue" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                    </svg>
                    <span className="text-gray-700 font-medium">Card</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Payment Forms */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 bg-warm-white/90 backdrop-blur-md p-6 rounded-xl border border-royal-blue/20 shadow-lg" data-payment-form="card">
                <StripePayment
                  amount={price}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  reservationInfo={reservationInfo}
                  isButtonSticky={isButtonSticky}
                  onPaymentHandler={(handler, processing) => {
                    setPaymentHandler(() => handler);
                    setPaymentProcessing(processing);
                  }}
                />
                
                {/* Payment Information List */}
                <div className="mt-4 text-sm text-gray-600">
                  <li>You will be redirected to Stripe's secure payment page</li>
                  <li>Your payment information is handled securely by Stripe</li>
                  <li>Your card will be charged immediately</li>
                  <li>You will receive a confirmation email</li>
                  <li>In case of issues, contact our support at info@elitewaylimo.ch</li>
                </div>
              </div>
            )}

            {/* Only show bottom error box for processing errors or system issues */}
            {errorMessage && retryCount > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                <p className="text-red-400">{errorMessage}</p>
                {retryCount >= maxRetries - 1 && (
                  <p className="text-sm text-red-400 mt-2">
                    Need help? Contact our support at info@elitewaylimo.ch
                  </p>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="secondary"
                onClick={handleBack}
                disabled={isProcessing}
                className="bg-warm-white/80 backdrop-blur-sm border-royal-blue/30 text-gray-700 hover:bg-royal-blue/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </Button>
            </div>
          </div>
        </div>

        {/* Sticky Mobile Button - appears when scrolled past original button */}
        {isButtonSticky && paymentMethod === 'card' && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 transform translate-y-0 transition-all duration-300 ease-out">
            {/* Enhanced gradient background with brand colors */}
            <div className="absolute inset-0 bg-gradient-to-t from-warm-white via-cream-light/95 to-warm-white/80 backdrop-blur-lg"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-gold/5 via-transparent to-primary-gold/5"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-gold/30 to-transparent"></div>
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-primary-gold/10 to-transparent"></div>
            
            <div className="relative container mx-auto px-4 py-4">
              <div className="flex justify-center">
                <Button
                  onClick={paymentHandler}
                  disabled={paymentProcessing}
                  className="w-full max-w-sm py-3 px-8 text-base font-semibold tracking-wide transition-all duration-300 hover:shadow-[0_0_25px_rgba(65,105,225,0.2)] hover:transform hover:scale-105"
                >
                  {paymentProcessing ? 'Opening Payment Window...' : `Pay ${formatPrice(price)}`}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;