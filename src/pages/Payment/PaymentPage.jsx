import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReservationContext from "../../contexts/ReservationContext";
import Button from "../../components/Button";
import ProgressBar from "../../components/ProgressBar";
import { calculatePrice, formatPrice } from "../../services/PriceCalculationService";
import { sendPaymentConfirmation } from "../../services/EmailService";

const PaymentPage = ({ scrollUp }) => {
  const navigate = useNavigate();
  // Get everything from context
  const { 
    reservationInfo,
    handleInput  // We'll use this to update the reservation context
  } = useContext(ReservationContext);
  
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [price, setPrice] = useState(0);
  const [usdtAddress, setUsdtAddress] = useState("");

  // Check if we have the required data from previous steps
  useEffect(() => {
    if (!reservationInfo.email || 
        !reservationInfo.pickup || 
        (!reservationInfo.isHourly && !reservationInfo.dropoff) || 
        !reservationInfo.date || 
        !reservationInfo.time || 
        !reservationInfo.selectedVehicle ||
        (reservationInfo.isHourly && (!reservationInfo.hours || reservationInfo.hours < 2 || reservationInfo.hours > 24)) ||
        (reservationInfo.isHourly && !reservationInfo.plannedActivities?.trim())
    ) {
      navigate('/customer-details');
    }
  }, [reservationInfo, navigate]);

  useEffect(() => {
    // Calculate price based on reservation details
    if (reservationInfo.selectedVehicle) {
      console.log('Calculating price with:', {
        distance: reservationInfo.distance || 46.5,
        duration: reservationInfo.duration || 36,
        vehicle: reservationInfo.selectedVehicle.name,
        extraStops: reservationInfo.extraStops?.length || 0,
        isHourly: reservationInfo.isHourly,
        hours: reservationInfo.isHourly ? parseInt(reservationInfo.hours) : 0
      });
      
      const calculatedPrice = calculatePrice(
        reservationInfo.distance || 46.5, // Default distance if not set
        reservationInfo.duration || 36, // Default duration if not set
        reservationInfo.selectedVehicle.name,
        reservationInfo.extraStops?.length || 0,
        reservationInfo.isHourly,
        reservationInfo.isHourly ? parseInt(reservationInfo.hours) : 0
      );
      
      console.log('Calculated price:', calculatedPrice);
      setPrice(calculatedPrice || 0); // Ensure we never set NaN by defaulting to 0
    }
  }, [reservationInfo]);

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    if (method === 'crypto') {
      // In a real app, this would be generated on the backend
      setUsdtAddress("TRX7NHqkeAhVrKdZrHQJ2RRf2MeL5132cr");
    }
  };

  const handleBack = () => {
    navigate('/customer-details');
  };

  // Process payment and send confirmation email
  const processPayment = async () => {
    setIsProcessing(true);
    console.log('Payment processing started');
    console.log('Payment method:', paymentMethod);
    console.log('Amount:', formatPrice(price));
    
    try {
      // In a real implementation, this would be an API call to process payment
      console.log(`Processing ${paymentMethod} payment for ${formatPrice(price)}`);
      
      // Create payment details object
      const paymentDetails = {
        method: paymentMethod,
        amount: price,
        currency: 'CHF',
        timestamp: new Date().toISOString(),
        reference: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      };
      
      // Update reservation context with payment details
      // We need to use synthetic events to work with handleInput
      const syntheticEvent = {
        target: {
          name: 'paymentDetails',
          value: paymentDetails
        }
      };
      
      console.log('Updating reservation with payment details:', paymentDetails);
      await handleInput(syntheticEvent);
      
      // Get the updated reservation info with payment details
      const updatedReservationInfo = {
        ...reservationInfo,
        paymentDetails: paymentDetails
      };
      
      console.log('Sending payment confirmation emails...');
      
      // Send payment confirmation emails
      const emailResult = await sendPaymentConfirmation(updatedReservationInfo);
      console.log('Email sending result:', emailResult);
      
      if (!emailResult.success) {
        console.warn('Payment confirmation emails may not have been sent properly');
      } else {
        console.log('Payment confirmation emails sent successfully!');
      }
      
      // Short delay to ensure everything is processed
      setTimeout(() => {
        // Payment processed, navigate to thank you page
        console.log('Navigating to thank you page');
        navigate('/thankyou');
      }, 500);
    } catch (error) {
      console.error("Payment processing error:", error);
      console.error("Error details:", error.stack);
      alert("There was a problem processing your payment. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await processPayment();
  };

  const handleCryptoPayment = async () => {
    await processPayment();
  };

  return (
    <div className="container-default mt-28">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-semibold mb-8">Payment</h1>
        
        <ProgressBar />

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-zinc-800/30 p-6 rounded-lg border border-zinc-700/50">
              <h2 className="text-xl font-medium mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <p>Vehicle: {reservationInfo.selectedVehicle?.name}</p>
                <p>Date: {reservationInfo.date}</p>
                <p>Time: {reservationInfo.time}</p>
                {reservationInfo.isHourly ? (
                  <p>Duration: {reservationInfo.hours} hours</p>
                ) : (
                  <p>Distance: {reservationInfo.distance || '46.5'} km</p>
                )}
                <hr className="border-zinc-700/50 my-4" />
                <div className="flex justify-between font-medium">
                  <span>Total Amount:</span>
                  <span className="text-gold">{formatPrice(price)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-medium">Select Payment Method</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handlePaymentMethodSelect('card')}
                  className={`p-4 rounded-lg border transition-all ${
                    paymentMethod === 'card'
                      ? 'border-gold bg-gold/20'
                      : 'border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                    </svg>
                    <span>Credit Card</span>
                  </div>
                </button>
                
                <button
                  onClick={() => handlePaymentMethodSelect('crypto')}
                  className={`p-4 rounded-lg border transition-all ${
                    paymentMethod === 'crypto'
                      ? 'border-gold bg-gold/20'
                      : 'border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
                    </svg>
                    <span>USDT (TRC20)</span>
                  </div>
                </button>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="cardNumber">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="expiry">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiry"
                      placeholder="MM/YY"
                      className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="cvc">
                      CVC
                    </label>
                    <input
                      type="text"
                      id="cvc"
                      placeholder="123"
                      className="bg-zinc-800/30 rounded-lg py-2 px-4 w-full border border-zinc-700/50"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="secondary" onClick={handleBack}>
                    Back
                  </Button>
                  <Button type="submit" variant="secondary" disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Pay Now'}
                  </Button>
                </div>
              </form>
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
                  <Button type="button" variant="secondary" onClick={handleBack}>
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
          </div>

          <div className="bg-zinc-800/30 p-6 rounded-lg border border-zinc-700/50 h-fit">
            <h2 className="text-xl font-medium mb-4">Reservation Details</h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-zinc-400">Pick-up Location</p>
                <p>{reservationInfo.pickup}</p>
              </div>
              {!reservationInfo.isHourly && reservationInfo.extraStops.length > 0 && (
                <div>
                  <p className="text-zinc-400">Extra Stops</p>
                  {reservationInfo.extraStops.map((stop, index) => (
                    <p key={index}>{stop}</p>
                  ))}
                </div>
              )}
              {!reservationInfo.isHourly && (
                <div>
                  <p className="text-zinc-400">Drop-off Location</p>
                  <p>{reservationInfo.dropoff}</p>
                </div>
              )}
              <div>
                <p className="text-zinc-400">Date & Time</p>
                <p>{reservationInfo.date} at {reservationInfo.time}</p>
                {reservationInfo.isHourly && (
                  <p>Duration: {reservationInfo.hours} hours</p>
                )}
              </div>
              {reservationInfo.isHourly && (
                <div>
                  <p className="text-zinc-400">Planned Activities</p>
                  <p>{reservationInfo.plannedActivities}</p>
                </div>
              )}
              <div>
                <p className="text-zinc-400">Vehicle</p>
                <p>{reservationInfo.selectedVehicle?.name}</p>
              </div>
              <div>
                <p className="text-zinc-400">Passengers</p>
                <p>{reservationInfo.passengers} passengers, {reservationInfo.bags} bags</p>
              </div>
              {(reservationInfo.childSeats > 0 || reservationInfo.babySeats > 0) && (
                <div>
                  <p className="text-zinc-400">Additional Seats</p>
                  {reservationInfo.childSeats > 0 && (
                    <p>{reservationInfo.childSeats} child seat(s)</p>
                  )}
                  {reservationInfo.babySeats > 0 && (
                    <p>{reservationInfo.babySeats} baby seat(s)</p>
                  )}
                </div>
              )}
              {reservationInfo.additionalRequests && (
                <div>
                  <p className="text-zinc-400">Additional Requests</p>
                  <p>{reservationInfo.additionalRequests}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;