import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../../components/ProgressBar";
import ReservationContext from "../../contexts/ReservationContext";
import { sendTransferConfirmationToAdmin } from "../../services/EmailService";
import { DateTime } from 'luxon';

const ThankYou = ({ scrollUp }) => {
  const navigate = useNavigate();
  const { reservationInfo, clearReservation, handleInput } = useContext(ReservationContext);
  const [emailStatus, setEmailStatus] = useState({
    sent: false,
    error: null
  });
  const [emailSent, setEmailSent] = useState(false); // Track if email was already sent
  const [displayData, setDisplayData] = useState(null); // Frozen copy of reservation data for display

  useEffect(() => {
    scrollUp();
  }, [scrollUp]);
  
  // Capture reservation data on first load and freeze it for display
  useEffect(() => {
    if (!displayData && reservationInfo.email) {
      console.log('📸 Capturing reservation data for display');
      setDisplayData({ ...reservationInfo }); // Create frozen copy
    } else if (!displayData || !displayData.email) {
      // Try to recover from payment success backup if no display data
      const backup = sessionStorage.getItem('payment-success-backup');
      if (backup) {
        try {
          const backupData = JSON.parse(backup);
          console.log('🔄 Recovering reservation data from payment backup');
          setDisplayData(backupData);
          
          // Also update context with backup data if it's empty
          if (!reservationInfo.email && backupData.email) {
            console.log('📝 Restoring context from backup data');
            Object.keys(backupData).forEach(key => {
              if (key !== 'sessionId' && key !== 'timestamp') {
                handleInput({
                  target: {
                    name: key,
                    value: backupData[key]
                  }
                });
              }
            });
          }
        } catch (error) {
          console.error('❌ Error parsing payment backup:', error);
        }
      }
    }
  }, [reservationInfo, displayData]);
  
  // Log reservation info for debugging
  useEffect(() => {
    console.log('🎉 ThankYou component loaded');
    console.log('📦 reservationInfo:', reservationInfo);
    console.log('📸 displayData:', displayData);
    console.log('💳 Has payment details?', !!reservationInfo.paymentDetails);
    console.log('📧 Has email?', !!reservationInfo.email);
    console.log('🌐 Current URL:', window.location.href);
    console.log('📖 Referrer:', document.referrer);
    
    // Check if user came from payment success
    const fromPaymentSuccess = document.referrer.includes('payment-success') || 
                               sessionStorage.getItem('from-payment-success') === 'true' ||
                               sessionStorage.getItem('thankyou-direct-access') === 'true';
    
    if (fromPaymentSuccess) {
      console.log('✅ User came from payment success page');
      // Clean up payment success markers
      sessionStorage.removeItem('from-payment-success');
      sessionStorage.removeItem('thankyou-direct-access'); 
      sessionStorage.removeItem('payment-redirect-active');
      sessionStorage.removeItem('skip-validation-redirects');
      console.log('🧹 Cleaned up payment success navigation markers');
    }
    
    // Warn if no valid data
    if (!reservationInfo.email && !displayData?.email) {
      console.warn('⚠️ ThankYou page loaded without valid reservation data');
      console.warn('💡 This could indicate a navigation issue or direct access');
    } else {
      console.log('✅ ThankYou page loaded with valid reservation data');
    }
  }, [reservationInfo, displayData]);
  
  // Send email confirmations when the component mounts
  useEffect(() => {
    // Don't send emails if already sent or if no email address
    if (emailSent || !reservationInfo.email) {
      return;
    }

    const sendEmails = async () => {
      try {
        // Only send emails for special requests or when no payment was needed
        // Regular bookings with payment have emails sent by the webhook handler
        if (!reservationInfo.isSpecialRequest && reservationInfo.paymentDetails) {
          console.log('Payment details found, skipping emails (already sent by webhook)');
          return;
        }

        console.log('Sending confirmation emails for non-payment booking');
        const result = await sendTransferConfirmationToAdmin(reservationInfo);
        console.log('Email sending result:', result);
        setEmailStatus({ sent: result.success, error: null });
        setEmailSent(true); // Mark email as sent
        
        if (!result.success) {
          console.warn("Email notification may not have been sent properly");
        } else {
          console.log("Email notification sent successfully!");
        }
      } catch (error) {
        console.error("Error sending confirmation emails:", error);
        setEmailStatus({ sent: false, error: error.message });
        setEmailSent(true); // Mark as attempted even if failed
      }
    };

    // Send emails only for special requests or non-payment bookings
    sendEmails();
  }, [reservationInfo.email, reservationInfo.isSpecialRequest, reservationInfo.paymentDetails, emailSent]);

  // Format date to dd-MM-yyyy (Swiss format)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return DateTime.fromFormat(dateString, 'yyyy-MM-dd', { zone: 'Europe/Zurich' }).toFormat('dd-MM-yyyy');
    } catch {
      return dateString;
    }
  };

  // Clear reservation data after successful completion
  useEffect(() => {
    // Only clear if we have valid reservation data (to avoid clearing on direct access)
    if (reservationInfo.email && (reservationInfo.paymentDetails || reservationInfo.isSpecialRequest)) {
      const timer = setTimeout(() => {
        console.log('✅ Booking completed successfully - clearing reservation data');
        clearReservation();
      }, 5000); // Clear after 5 seconds to allow user to see the thank you page

      return () => clearTimeout(timer);
    }
  }, [reservationInfo, clearReservation]);

  // Use displayData for rendering instead of reservationInfo
  const dataToShow = displayData || reservationInfo;

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-gray/5 via-cream/3 to-soft-gray/5">
      {/* Softer Animated Background Elements */}
      <div className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }}>
        <div className="absolute top-20 left-10 w-20 h-20 bg-royal-blue/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gold/15 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-warm-gray/20 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-royal-blue/8 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-cream/15 to-gold/10 rounded-full blur-xl animate-float"></div>
      </div>

      <div className="container-default mt-28 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-semibold mb-8 text-center text-gray-700">
            {dataToShow.isSpecialRequest ? (
              <>
                <span className="text-gold">Request</span> Received!
              </>
            ) : (
              <>
                <span className="text-gold">Booking</span> Confirmed!
              </>
            )}
          </h1>
          
          <ProgressBar reservationData={dataToShow} />
          
          <div className="bg-warm-white/90 backdrop-blur-md p-8 rounded-xl border border-gold/30 shadow-lg mt-8">
            <div className="text-center mb-8">
              <div className="inline-block p-4 rounded-full bg-gradient-to-br from-gold/20 to-royal-blue/10 mb-4 shadow-lg">
                <svg className="w-16 h-16 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-medium mb-2 text-gray-700">Thank You for Choosing Us!</h2>
              <p className="text-gray-600 text-lg">
                {dataToShow.isSpecialRequest 
                  ? "We'll review your request and get back to you shortly with a customized quote."
                  : "Your luxury transfer has been successfully booked."}
              </p>
            </div>

            {/* Payment Details Section - Shown at the top if payment exists */}
            {dataToShow.paymentDetails && (
              <div className="mb-8">
                <div className="bg-gradient-to-br from-gold/15 to-royal-blue/5 p-6 rounded-lg border border-gold/30 backdrop-blur-sm">
                  <h3 className="text-gold font-medium mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                    </svg>
                    Payment Information
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p className="break-words">Method: {dataToShow.paymentDetails.method}</p>
                    <p className="break-words">Amount: {dataToShow.paymentDetails.currency} {dataToShow.paymentDetails.amount}</p>
                    <p className="break-words">Reference: {dataToShow.paymentDetails.reference}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Grid container for all boxes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
              {/* Transfer/Request Details Section */}
              <div className="bg-royal-blue/5 backdrop-blur-sm p-4 lg:p-6 rounded-lg border border-royal-blue/20">
                <h3 className="text-royal-blue font-medium mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  {dataToShow.isSpecialRequest ? 'Request Details' : 'Transfer Details'}
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p className="break-words">Date: {formatDate(dataToShow.date)}</p>
                  <p className="break-words">{dataToShow.isSpecialRequest ? 'Preferred Time' : 'Pick Up Time'}: {dataToShow.time} (Swiss time)</p>
                  {!dataToShow.isSpecialRequest && (
                    <>
                      <p className="break-words">From: {dataToShow.pickup}</p>
                      {!dataToShow.isHourly && dataToShow.extraStops?.map((stop, index) => (
                        stop && <p key={index} className="break-words pl-4">• {stop}</p>
                      ))}
                      {!dataToShow.isHourly ? (
                        <p className="break-words">To: {dataToShow.dropoff}</p>
                      ) : (
                        <p className="break-words">Duration: {dataToShow.hours} hours</p>
                      )}
                      {dataToShow.isHourly && dataToShow.plannedActivities && (
                        <>
                          <p className="mt-4 text-sm text-gray-600">Planned Activities:</p>
                          <p className="text-sm break-words">{dataToShow.plannedActivities}</p>
                        </>
                      )}
                      {dataToShow.routeInfo && !dataToShow.isHourly && (
                        <>
                          <p className="mt-4 text-sm text-gray-600">Route Information:</p>
                          <p className="text-sm break-words">Distance: {dataToShow.routeInfo.distance}</p>
                          <p className="text-sm break-words">Duration: {dataToShow.routeInfo.duration}</p>
                        </>
                      )}
                    </>
                  )}
                  {dataToShow.isSpecialRequest && (
                    <>
                      <p className="mt-4 text-sm text-gray-600">Special Request:</p>
                      <p className="text-sm break-words">{dataToShow.specialRequestDetails}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Vehicle Details Section - Hidden for Special Requests */}
              {!dataToShow.isSpecialRequest && (
                <div className="bg-royal-blue/5 backdrop-blur-sm p-4 lg:p-6 rounded-lg border border-royal-blue/20">
                  <h3 className="text-royal-blue font-medium mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 12v-2h-2V7l-3-3-2 2-2-2-2 2-2-2-3 3v3H3v2h2v7h14v-7h2zm-5-3.5l2 2V10h-4V8.5l2-2zm-4 0l2 2V10h-4V8.5l2-2zm-4 0l2 2V10H6V8.5l2-2z"/>
                    </svg>
                    Vehicle Details
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p className="break-words">Vehicle: {dataToShow.selectedVehicle?.name}</p>
                    <p className="break-words">Passengers: {dataToShow.passengers}</p>
                    <p className="break-words">Bags: {dataToShow.bags}</p>
                    {dataToShow.boosterSeats > 0 && (
                      <p className="break-words">Booster Seats (4-7): {dataToShow.boosterSeats}</p>
                    )}
                    {dataToShow.childSeats > 0 && (
                      <p className="break-words">Child Seats (0-3): {dataToShow.childSeats}</p>
                    )}
                    {dataToShow.skiEquipment > 0 && (
                      <p className="break-words">Ski Equipment: {dataToShow.skiEquipment}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Customer Details Section */}
              <div className="bg-royal-blue/5 backdrop-blur-sm p-4 lg:p-6 rounded-lg border border-royal-blue/20">
                <h3 className="text-royal-blue font-medium mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  Customer Details
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p className="break-words">Email: {dataToShow.email}</p>
                  <p className="break-words">Phone: {dataToShow.phone}</p>
                  {dataToShow.flightNumber && (
                    <p className="break-words">Flight Number: {dataToShow.flightNumber}</p>
                  )}
                  {dataToShow.meetingBoard && (
                    <p className="break-words">Meeting Board Name: {dataToShow.meetingBoard}</p>
                  )}
                  {dataToShow.additionalRequests && !dataToShow.isSpecialRequest && (
                    <>
                      <p className="mt-4 text-sm text-gray-600">Additional Requests:</p>
                      <p className="text-sm break-words">{dataToShow.additionalRequests}</p>
                    </>
                  )}
                  {dataToShow.referenceNumber && (
                    <>
                      <p className="mt-4 text-sm text-gray-600">Reference Number or Cost Center:</p>
                      <p className="text-sm break-words">{dataToShow.referenceNumber}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Additional Information Section - Only shown for Special Requests */}
              {dataToShow.isSpecialRequest && dataToShow.additionalRequests && (
                <div className="bg-royal-blue/5 backdrop-blur-sm p-4 lg:p-6 rounded-lg border border-royal-blue/20">
                  <h3 className="text-royal-blue font-medium mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"/>
                    </svg>
                    Request Information
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p className="text-sm break-words">{dataToShow.additionalRequests}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center text-gray-600">
              <p className="mb-2 break-words">
                {dataToShow.isSpecialRequest 
                  ? `We'll send a detailed response to ${dataToShow.email}`
                  : `A confirmation email has been sent to ${dataToShow.email}`}
              </p>
              
              {/* Spam folder reminder */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4 max-w-md mx-auto backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                  </svg>
                  <span className="text-yellow-700 font-medium text-sm">Email Not Received?</span>
                </div>
                <p className="text-gray-700 text-sm break-words">
                  Please check your spam/junk folder. Sometimes confirmation emails can end up there. 
                  If you still can't find it, contact us at info@elitewaylimo.ch
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
