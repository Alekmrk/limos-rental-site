import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReservationContext from "../../contexts/ReservationContext";
import Button from "../../components/Button";
import ProgressBar from "../../components/ProgressBar";
import { calculatePrice, formatPrice } from "../../services/PriceCalculationService";
import { sendPaymentConfirmation } from "../../services/EmailService";
import axios from "axios";
import StripePayment from '../../components/StripePayment';

const PaymentPage = ({ scrollUp }) => {
  const navigate = useNavigate();
  // Get everything from context
  const { 
    reservationInfo,
    handleInput
  } = useContext(ReservationContext);
  
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [price, setPrice] = useState(0);
  const [usdtAddress, setUsdtAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

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
    scrollUp();
  }, [scrollUp]);

  useEffect(() => {
    // Calculate price based on reservation details
    if (!reservationInfo.selectedVehicle) {
      console.log('Calculating price with simplified pricing system...');
      
      // Calculate price using only distance or hours
      const calculatedPrice = calculatePrice(
        reservationInfo.totalDistance / 1000 || 46.5, // Convert meters to km, use default if not set
        0, // Duration not used in simplified calculation
        reservationInfo.selectedVehicle.name,
        0, // Extra stops not used in simplified calculation
        reservationInfo.isHourly,
        reservationInfo.isHourly ? parseInt(reservationInfo.hours) : 0
      );
      
      console.log('Calculated price:', calculatedPrice);
      setPrice(calculatedPrice || 0); // Ensure we never set NaN
    }

    // Override calculated price with fixed amount
    setPrice(1);
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
      
      // Create payment details object with Swiss timezone
      const now = new Date();
      const swissTime = now.toLocaleString('en-CH', {
        timeZone: 'Europe/Zurich',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      
      const paymentDetails = {
        method: paymentMethod,
        amount: price,
        currency: 'CHF',
        timestamp: now.toISOString(), // Keep ISO for backend
        swissTimestamp: swissTime,
        reference: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      };
      
      // Update reservation context with payment details
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

  // Format date to dd-mm-yyyy
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  const handlePaymentSuccess = async () => {
    try {
      setIsProcessing(true);
      
      // Create payment details object with Swiss timezone
      const now = new Date();
      const swissTime = now.toLocaleString('en-CH', {
        timeZone: 'Europe/Zurich',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      
      const paymentDetails = {
        method: 'stripe',
        amount: price,
        currency: 'CHF',
        timestamp: now.toISOString(),
        swissTimestamp: swissTime,
        reference: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      };

      // Update reservation context with payment details
      await handleInput({
        target: {
          name: 'paymentDetails',
          value: paymentDetails
        }
      });

      // Send confirmation emails with retries
      console.log('Sending payment confirmation emails...');
      const emailResult = await sendPaymentConfirmation({
        ...reservationInfo,
        paymentDetails
      });

      if (!emailResult.success) {
        console.warn('Payment confirmation emails may not have been sent properly:', emailResult.message);
        // Continue to thank you page even if emails fail - they will be retried
      }

      // Navigate to thank you page
      navigate('/thankyou');
      
    } catch (error) {
      console.error("Error processing successful payment:", error);
      alert("Payment was successful. If you don't receive a confirmation email within 5 minutes, please contact our support.");
      navigate('/thankyou');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error("Payment error:", error);
    setIsProcessing(false);
    
    // Show user-friendly error message if provided by Stripe component
    const message = error.userMessage || "There was a problem processing your payment. Please try again.";
    setErrorMessage(message);
    
    // Track retry attempts
    setRetryCount(prev => prev + 1);
    
    // If we've tried too many times, suggest alternative payment method
    if (retryCount >= maxRetries - 1) {
      setErrorMessage(
        "We're having trouble processing your card. You might want to try our alternative payment method below or contact support."
      );
    }
  };

  // Clear error when payment method changes
  useEffect(() => {
    setErrorMessage('');
    setRetryCount(0);
  }, [paymentMethod]);

  return (
    <div className="container-default mt-28">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl md:text-7xl font-semibold mb-8">Payment</h1>
        
        <ProgressBar />

        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="bg-zinc-800/30 p-6 rounded-lg border border-zinc-700/50">
            <h2 className="text-xl font-medium mb-6">Order Summary</h2>
            
            {/* Basic Info */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-zinc-400 text-sm mb-1">Vehicle</p>
                <p className="font-medium">{reservationInfo.selectedVehicle?.name}</p>
              </div>
              <div>
                <p className="text-zinc-400 text-sm mb-1">Date</p>
                <p className="font-medium">{formatDate(reservationInfo.date)}</p>
              </div>
              <div>
                <p className="text-zinc-400 text-sm mb-1">Time</p>
                <p className="font-medium">{reservationInfo.time} (CET)</p>
              </div>
            </div>

            {/* Transfer Details */}
            <div className="border-t border-zinc-700/50 pt-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Transfer Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {reservationInfo.isHourly ? (
                  <>
                    <div>
                      <p className="text-zinc-400 text-sm mb-1">Service Type</p>
                      <p className="font-medium">Hourly Rental ({reservationInfo.hours} hours)</p>
                    </div>
                    <div>
                      <p className="text-zinc-400 text-sm mb-1">Pickup Location</p>
                      <p className="font-medium">{reservationInfo.pickup}</p>
                    </div>
                    {reservationInfo.plannedActivities && (
                      <div className="md:col-span-2">
                        <p className="text-zinc-400 text-sm mb-1">Planned Activities</p>
                        <p className="text-sm bg-black/20 p-3 rounded-lg">{reservationInfo.plannedActivities}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-zinc-400 text-sm mb-1">From</p>
                      <p className="font-medium">{reservationInfo.pickup}</p>
                    </div>
                    <div>
                      <p className="text-zinc-400 text-sm mb-1">To</p>
                      <p className="font-medium">{reservationInfo.dropoff}</p>
                    </div>
                    {reservationInfo.extraStops?.length > 0 && (
                      <div className="md:col-span-2">
                        <p className="text-zinc-400 text-sm mb-2">Extra Stops</p>
                        <div className="space-y-1">
                          {reservationInfo.extraStops.map((stop, index) => (
                            stop && (
                              <div key={index} className="flex items-center gap-2">
                                <span className="text-gold">•</span>
                                <p className="text-sm">{stop}</p>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-zinc-400 text-sm mb-1">Total Distance</p>
                      <p className="font-medium">{((reservationInfo.totalDistance || 0) / 1000).toFixed(1)} km</p>
                    </div>
                    <div>
                      <p className="text-zinc-400 text-sm mb-1">Estimated Duration</p>
                      <p className="font-medium">{reservationInfo.routeInfo?.duration || '36 min'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Passenger & Additional Details */}
            <div className="border-t border-zinc-700/50 pt-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Passenger Details</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-zinc-400 text-sm mb-1">Passengers</p>
                  <p className="font-medium">{reservationInfo.passengers}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm mb-1">Bags</p>
                  <p className="font-medium">{reservationInfo.bags}</p>
                </div>
                {reservationInfo.childSeats > 0 && (
                  <div>
                    <p className="text-zinc-400 text-sm mb-1">Child Seats (4-7)</p>
                    <p className="font-medium">{reservationInfo.childSeats}</p>
                  </div>
                )}
                {reservationInfo.babySeats > 0 && (
                  <div>
                    <p className="text-zinc-400 text-sm mb-1">Baby Seats (0-3)</p>
                    <p className="font-medium">{reservationInfo.babySeats}</p>
                  </div>
                )}
                {reservationInfo.skiEquipment > 0 && (
                  <div>
                    <p className="text-zinc-400 text-sm mb-1">Ski Equipment</p>
                    <p className="font-medium">{reservationInfo.skiEquipment}</p>
                  </div>
                )}
                {reservationInfo.flightNumber && (
                  <div>
                    <p className="text-zinc-400 text-sm mb-1">Flight Number</p>
                    <p className="font-medium">{reservationInfo.flightNumber}</p>
                  </div>
                )}
              </div>
              {reservationInfo.additionalRequests && (
                <div className="mt-6">
                  <p className="text-zinc-400 text-sm mb-2">Additional Requests</p>
                  <p className="text-sm bg-black/20 p-3 rounded-lg">{reservationInfo.additionalRequests}</p>
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
            <div className="space-y-4">
              <StripePayment 
                amount={price}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
              
              <div className="mt-4 text-sm text-zinc-400">
                <p>• Secure payment powered by Stripe</p>
                <p>• Your card will be charged immediately</p>
                <p>• You will receive a confirmation email</p>
                <p>• In case of issues, contact our support</p>
              </div>

              {/* Keep myPOS as backup */}
              <div className="mt-8 pt-8 border-t border-zinc-700/50">
                <p className="text-sm text-zinc-400 mb-4">Alternative Payment Method:</p>
                <form
                  id="mypos-form"
                  action="https://www.mypos.eu/vmp/checkout"
                  method="POST"
                  target="_blank"
                  className="mt-4"
                  onSubmit={async e => {
                    e.preventDefault();
                    const sid = "1047772";
                    const amount = "1.00";
                    const currency = "CHF";
                    const orderID = `ORDER-${Date.now()}`;
                    const url_ok = "https://elitewaylimo.ch/payment-success";
                    const url_cancel = "https://elitewaylimo.ch/payment-cancel";
                    const keyindex = "1";
                    const cn = "40435659038";
                    
                    const requestData = { sid, amount, currency, orderID, url_ok, url_cancel, keyindex, cn };
                    console.log('Sending request to myPOS sign endpoint:', {
                      url: 'https://api.elitewaylimo.ch/api/mypos-sign',
                      data: requestData
                    });

                    try {
                      console.log('Making request to backend with data:', requestData);
                      const res = await axios.post(
                        "https://api.elitewaylimo.ch/api/mypos-sign",
                        requestData,
                        {
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          // Add timeout and full error response
                          timeout: 10000,
                          validateStatus: function (status) {
                            return status >= 200 && status < 600; // Don't reject any status codes
                          }
                        }
                      );
                      
                      if (res.status !== 200) {
                        console.error('Backend error response:', {
                          status: res.status,
                          statusText: res.statusText,
                          data: res.data,
                          headers: res.headers
                        });
                        throw new Error(res.data.details || res.data.error || 'Unknown error');
                      }

                      console.log('Backend response:', res.data);
                      const sign = res.data.sign;
                      
                      // Set form fields and submit
                      const form = document.getElementById("mypos-form");
                      form.sid.value = sid;
                      form.amount.value = amount;
                      form.currency.value = currency;
                      form.orderID.value = orderID;
                      form.url_ok.value = url_ok;
                      form.url_cancel.value = url_cancel;
                      form.keyindex.value = keyindex;
                      form.cn.value = cn;
                      form.sign.value = sign;
                      console.log('Submitting myPOS form with values:', {
                        sid, amount, currency, orderID, url_ok, url_cancel, keyindex, cn, sign
                      });
                      form.submit();
                    } catch (err) {
                      console.error('Failed to get myPOS sign:', {
                        error: err,
                        response: err.response?.data,
                        status: err.response?.status,
                        headers: err.response?.headers
                      });
                      alert("Failed to initiate payment. Please check browser console for details.");
                    }
                  }}
                >
                  <input type="hidden" name="sid" />
                  <input type="hidden" name="amount" />
                  <input type="hidden" name="currency" />
                  <input type="hidden" name="orderID" />
                  <input type="hidden" name="url_ok" />
                  <input type="hidden" name="url_cancel" />
                  <input type="hidden" name="keyindex" />
                  <input type="hidden" name="cn" />
                  <input type="hidden" name="sign" />
                  <button
                    type="submit"
                    className="p-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                  >
                    Pay 1 CHF with myPOS
                  </button>
                </form>
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

          {errorMessage && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-400">{errorMessage}</p>
              {retryCount >= maxRetries - 1 && (
                <p className="text-sm text-red-400 mt-2">
                  Need help? Contact our support at support@elitewaylimo.ch
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