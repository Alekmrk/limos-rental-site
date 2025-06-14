import { useContext } from 'react';
import ReservationContext from '../contexts/ReservationContext';

const RouteErrorModal = ({ isOpen, onClose, errorType, onSwitchToHourly, onSwitchToSpecial }) => {
  const { reservationInfo } = useContext(ReservationContext);

  if (!isOpen) return null;

  const isNoRouteFound = errorType === 'no_route_found';
  const isApiError = errorType === 'api_error';

  const handleEmailContact = () => {
    const subject = encodeURIComponent('Route Calculation Issue - Limo Booking');
    const body = encodeURIComponent(
      `Hello,\n\nI'm trying to book a limo service but there's an issue calculating the route.\n\nDetails:\n` +
      `From: ${reservationInfo.pickup}\n` +
      `To: ${reservationInfo.dropoff}\n` +
      `Date: ${reservationInfo.date}\n` +
      `Time: ${reservationInfo.time}\n\n` +
      `Please assist me with this booking.\n\nThank you!`
    );
    window.open(`mailto:info@elitewaylimo.ch?subject=${subject}&body=${body}`);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-[90%] max-w-md mx-4 bg-zinc-800 border border-zinc-700/50 rounded-2xl shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-center mb-4 text-white">
            {isNoRouteFound ? 'Route Not Available' : 'Service Temporarily Unavailable'}
          </h2>

          {/* Message */}
          <p className="text-zinc-300 text-center mb-6 leading-relaxed">
            {isNoRouteFound ? (
              <>
                We cannot calculate a driving route between these locations. 
                This may be due to geographic restrictions or lack of road connections.
              </>
            ) : (
              <>
                Google services are currently down. Please try again in a few minutes 
                or use one of the alternative booking options below.
              </>
            )}
          </p>

          {/* Alternative Options */}
          <div className="space-y-3 mb-6">
            <p className="text-sm font-medium text-zinc-400 text-center">Alternative Options:</p>
            
            <button
              onClick={onSwitchToHourly}
              className="w-full py-3 px-4 bg-gold/20 border border-gold/30 rounded-xl text-gold hover:bg-gold/30 transition-all duration-200 font-medium"
            >
              Switch to Hourly Booking
            </button>

            <button
              onClick={onSwitchToSpecial}
              className="w-full py-3 px-4 bg-zinc-700/50 border border-zinc-600/50 rounded-xl text-white hover:bg-zinc-700/70 transition-all duration-200 font-medium"
            >
              Create Special Request
            </button>

            <button
              onClick={handleEmailContact}
              className="w-full py-3 px-4 bg-zinc-700/30 border border-zinc-600/30 rounded-xl text-zinc-300 hover:text-white hover:border-zinc-500/50 transition-all duration-200 text-sm"
            >
              Contact Us: info@elitewaylimo.ch
            </button>
          </div>

          {/* Additional Info */}
          <p className="text-xs text-zinc-500 text-center">
            {isNoRouteFound ? (
              'Hourly bookings and special requests don\'t require route calculation.'
            ) : (
              'You can also try refreshing the page and attempting your booking again.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RouteErrorModal;