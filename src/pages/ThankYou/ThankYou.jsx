import { useEffect } from "react";
import ProgressBar from "../../components/ProgressBar";
import { useContext } from "react";
import ReservationContext from "../../contexts/ReservationContext";

const ThankYou = ({ scrollUp }) => {
  useEffect(() => scrollUp(), []);
  const { reservationInfo } = useContext(ReservationContext);

  return (
    <div className="container-default mt-28">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-semibold mb-8 text-center">
          <span className="text-gold">Booking Confirmed!</span>
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
            <p className="text-zinc-400 text-lg">Your luxury transfer has been successfully booked.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-black/20 p-6 rounded-lg h-full">
              <h3 className="text-gold font-medium mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                </svg>
                Transfer Details
              </h3>
              <div className="space-y-2 text-zinc-300">
                <p>From: {reservationInfo.pickup}</p>
                {reservationInfo.extraStops.map((stop, index) => (
                  <p key={index} className="pl-4 flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span>Extra Stop {index + 1}: {stop}</span>
                  </p>
                ))}
                <p>To: {reservationInfo.dropoff}</p>
                <p>Date: {reservationInfo.date}</p>
                <p>Time: {reservationInfo.time}</p>
              </div>
            </div>

            <div className="bg-black/20 p-6 rounded-lg h-full">
              <h3 className="text-gold font-medium mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 12v-2h-2V7l-3-3-2 2-2-2-2 2-2-2-3 3v3H3v2h2v7h14v-7h2zm-5-3.5l2 2V10h-4V8.5l2-2zm-4 0l2 2V10h-4V8.5l2-2zm-4 0l2 2V10H6V8.5l2-2z"/>
                </svg>
                Vehicle Details
              </h3>
              <div className="space-y-2 text-zinc-300">
                <p>Vehicle: {reservationInfo.selectedVehicle?.name}</p>
                <p>Passengers: {reservationInfo.passengers}</p>
                <p>Bags: {reservationInfo.bags}</p>
                {reservationInfo.childSeats > 0 && (
                  <p>Child Seats: {reservationInfo.childSeats}</p>
                )}
                {reservationInfo.babySeats > 0 && (
                  <p>Baby Seats: {reservationInfo.babySeats}</p>
                )}
                {reservationInfo.skiEquipment > 0 && (
                  <p>Ski Equipment: {reservationInfo.skiEquipment}</p>
                )}
              </div>
            </div>

            <div className="bg-black/20 p-6 rounded-lg h-full">
              <h3 className="text-gold font-medium mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                Customer Details
              </h3>
              <div className="space-y-2 text-zinc-300">
                <p>Email: {reservationInfo.email}</p>
                <p>Phone: {reservationInfo.phone}</p>
                {reservationInfo.flightNumber && (
                  <p>Flight Number: {reservationInfo.flightNumber}</p>
                )}
                {reservationInfo.additionalRequests && (
                  <p>Additional Requests: {reservationInfo.additionalRequests}</p>
                )}
              </div>
            </div>
          </div>

          <div className="text-center text-zinc-400">
            <p className="mb-2">A confirmation email has been sent to {reservationInfo.email}</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
