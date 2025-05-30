import { useEffect, useState } from "react";
import ProgressBar from "../../components/ProgressBar";
import { useContext } from "react";
import ReservationContext from "../../contexts/ReservationContext";
import { sendTransferConfirmationToAdmin } from "../../services/EmailService";

const ThankYou = ({ scrollUp }) => {
  const [emailStatus, setEmailStatus] = useState({
    sent: false,
    error: null
  });
  const { reservationInfo } = useContext(ReservationContext);

  useEffect(() => {
    scrollUp();
  }, [scrollUp]);
  
  // Log reservation info for debugging
  useEffect(() => {
    console.log('ThankYou component loaded');
    console.log('reservationInfo:', reservationInfo);
    console.log('Has payment details?', !!reservationInfo.paymentDetails);
  }, [reservationInfo]);
  
  // Send email confirmations when the component mounts
  useEffect(() => {
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
        
        if (!result.success) {
          console.warn("Email notification may not have been sent properly");
        } else {
          console.log("Email notification sent successfully!");
        }
      } catch (error) {
        console.error("Error sending confirmation emails:", error);
        setEmailStatus({ sent: false, error: error.message });
      }
    };

    // Send emails only for special requests or non-payment bookings
    sendEmails();
  }, [reservationInfo]);

  // Format date to dd-mm-yyyy
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="container-default mt-28">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-semibold mb-8 text-center">
          <span className="text-gold">
            {reservationInfo.isSpecialRequest ? "Request Received!" : "Booking Confirmed!"}
          </span>
        </h1>
        
        <ProgressBar />
        
        <div className="bg-zinc-800/30 p-8 rounded-lg border border-gold/50 mt-8">
          <div className="text-center mb-8">
            <div className="inline-block p-4 rounded-full bg-gold/20 mb-4">
              <svg className="w-16 h-16 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-medium mb-2">Thank You for Choosing Us!</h2>
            <p className="text-zinc-400 text-lg">
              {reservationInfo.isSpecialRequest 
                ? "We'll review your request and get back to you shortly with a customized quote."
                : "Your luxury transfer has been successfully booked."}
            </p>
          </div>

          {/* Payment Details Section - Shown at the top if payment exists */}
          {reservationInfo.paymentDetails && (
            <div className="mb-8">
              <div className="bg-gold/10 p-6 rounded-lg border border-gold/20">
                <h3 className="text-gold font-medium mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                  Payment Information
                </h3>
                <div className="space-y-2 text-zinc-300">
                  <p>Method: {reservationInfo.paymentDetails.method}</p>
                  <p>Amount: {reservationInfo.paymentDetails.currency} {reservationInfo.paymentDetails.amount}</p>
                  <p>Reference: {reservationInfo.paymentDetails.reference}</p>
                </div>
              </div>
            </div>
          )}

          {/* Grid container for all boxes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
            {/* Transfer/Request Details Section */}
            <div className="bg-black/20 p-4 lg:p-6 rounded-lg">
              <h3 className="text-gold font-medium mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {reservationInfo.isSpecialRequest ? 'Request Details' : 'Transfer Details'}
              </h3>
              <div className="space-y-2 text-zinc-300">
                <p className="break-words">Date: {formatDate(reservationInfo.date)}</p>
                <p className="break-words">{reservationInfo.isSpecialRequest ? 'Preferred Time' : 'Pick Up Time'}: {reservationInfo.time} (CET)</p>
                {!reservationInfo.isSpecialRequest && (
                  <>
                    <p className="break-words">From: {reservationInfo.pickup}</p>
                    {!reservationInfo.isHourly && reservationInfo.extraStops.map((stop, index) => (
                      stop && <p key={index} className="break-words pl-4">• {stop}</p>
                    ))}
                    {!reservationInfo.isHourly ? (
                      <p className="break-words">To: {reservationInfo.dropoff}</p>
                    ) : (
                      <p className="break-words">Duration: {reservationInfo.hours} hours</p>
                    )}
                    {reservationInfo.isHourly && reservationInfo.plannedActivities && (
                      <>
                        <p className="mt-4 text-sm text-zinc-400">Planned Activities:</p>
                        <p className="text-sm break-words">{reservationInfo.plannedActivities}</p>
                      </>
                    )}
                    {reservationInfo.routeInfo && !reservationInfo.isHourly && (
                      <>
                        <p className="mt-4 text-sm text-zinc-400">Route Information:</p>
                        <p className="text-sm break-words">Distance: {reservationInfo.routeInfo.distance}</p>
                        <p className="text-sm break-words">Duration: {reservationInfo.routeInfo.duration}</p>
                      </>
                    )}
                  </>
                )}
                {reservationInfo.isSpecialRequest && (
                  <>
                    <p className="mt-4 text-sm text-zinc-400">Special Request:</p>
                    <p className="text-sm break-words">{reservationInfo.specialRequestDetails}</p>
                  </>
                )}
              </div>
            </div>

            {/* Vehicle Details Section - Hidden for Special Requests */}
            {!reservationInfo.isSpecialRequest && (
              <div className="bg-black/20 p-4 lg:p-6 rounded-lg">
                <h3 className="text-gold font-medium mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 12v-2h-2V7l-3-3-2 2-2-2-2 2-2-2-3 3v3H3v2h2v7h14v-7h2zm-5-3.5l2 2V10h-4V8.5l2-2zm-4 0l2 2V10h-4V8.5l2-2zm-4 0l2 2V10H6V8.5l2-2z"/>
                  </svg>
                  Vehicle Details
                </h3>
                <div className="space-y-2 text-zinc-300">
                  <p className="break-words">Vehicle: {reservationInfo.selectedVehicle?.name}</p>
                  <p className="break-words">Passengers: {reservationInfo.passengers}</p>
                  <p className="break-words">Bags: {reservationInfo.bags}</p>
                  {reservationInfo.childSeats > 0 && (
                    <p className="break-words">Child Seats (4-7): {reservationInfo.childSeats}</p>
                  )}
                  {reservationInfo.babySeats > 0 && (
                    <p className="break-words">Baby Seats (0-3): {reservationInfo.babySeats}</p>
                  )}
                  {reservationInfo.skiEquipment > 0 && (
                    <p className="break-words">Ski Equipment: {reservationInfo.skiEquipment}</p>
                  )}
                </div>
              </div>
            )}

            {/* Customer Details Section */}
            <div className="bg-black/20 p-4 lg:p-6 rounded-lg">
              <h3 className="text-gold font-medium mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                Customer Details
              </h3>
              <div className="space-y-2 text-zinc-300">
                <p className="break-words">Email: {reservationInfo.email}</p>
                <p className="break-words">Phone: {reservationInfo.phone}</p>
                {reservationInfo.flightNumber && (
                  <p className="break-words">Flight Number: {reservationInfo.flightNumber}</p>
                )}
                {reservationInfo.additionalRequests &&  !reservationInfo.isSpecialRequest &&(
                  <>
                    <p className="mt-4 text-sm text-zinc-400">{ 'Additional Requests'}:</p>
                    <p className="text-sm break-words">{reservationInfo.additionalRequests}</p>
                  </>
                )}
              </div>
            </div>

            {/* Additional Information Section - Only shown for Special Requests */}
            {reservationInfo.isSpecialRequest && reservationInfo.additionalRequests && (
              <div className="bg-black/20 p-4 lg:p-6 rounded-lg">
                <h3 className="text-gold font-medium mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"/>
                  </svg>
                  Request Information
                </h3>
                <div className="space-y-2 text-zinc-300">
                  <p className="text-sm break-words">{reservationInfo.additionalRequests}</p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center text-zinc-400">
            <p className="mb-2 break-words">
              {reservationInfo.isSpecialRequest 
                ? `We'll send a detailed response to ${reservationInfo.email}`
                : `A confirmation email has been sent to ${reservationInfo.email}`}
            </p>
            <p className="break-words">If you have any questions, please don't hesitate to contact us.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
