import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useContext } from "react";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import Vehicles from "./pages/Vehicles/Vehicles";
import VehicleSelection from "./pages/VehicleSelection/VehicleSelection";
import CustomerDetails from "./pages/CustomerDetails/CustomerDetails";
import ThankYou from "./pages/ThankYou/ThankYou";
import ThankYouSpecial from "./pages/ThankYou/ThankYouSpecial";
import PaymentPage from "./pages/Payment/PaymentPage";
import PaymentSuccess from "./pages/Payment/PaymentSuccess";
import PaymentCancel from "./pages/Payment/PaymentCancel";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import Contact from "./pages/Contact/Contact";
import AirportTransfer from "./pages/AirportTransfer/AirportTransfer";
import DistanceTransfer from "./pages/DistanceTransfer/DistanceTransfer";
import HourlyTransfer from "./pages/HourlyTransfer/HourlyTransfer";
import SpecialRequest from "./pages/SpecialRequest/SpecialRequest";
import DavosForum from "./pages/DavosForum/DavosForum";
import BookingPage from "./pages/BookingPage/BookingPage";
import BackToTopButton from "./components/BackToTopButton";
import CookieConsent from "./components/CookieConsent";
import ContactChannels from "./components/ContactChannels";
import DesignSystemShowcase from "./components/DesignSystemShowcase";
import { useState } from "react";
import cars from "./data/cars";
import { ReservationContextProvider, ReservationContext } from "./contexts/ReservationContext";
import { useGoogleMapsApi } from "./hooks/useGoogleMapsApi";
import TermsOfService from "./pages/TermsOfService/TermsOfService";
import LegalNotice from "./pages/LegalNotice/LegalNotice";
import { captureUTMParameters, debugUTMState, getStoredUTMParameters, extractAndStoreUTMFromURL, initUTMTracking, trackConversion, enableCrossTabSync, captureUTMWithConsent, validateUTM, getUTMDebugInfo, initUTMTrackingWithURLPreservation, preserveUTMsOnNavigation, preserveUTMsInURL } from "./utils/utmTracking";
import { useNavigate } from "react-router-dom";

// Protected Design System Component
const ProtectedDesignSystem = ({ children }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('access');
  
  // Simple access token check - you can change this token to whatever you prefer
  const validToken = 'eliteway2025';
  
  if (accessToken !== validToken) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center space-lg">
          <h1 className="text-section-title text-gray-700 mb-4">Access Required</h1>
          <p className="text-body text-gray-600">This page requires special access.</p>
          <p className="text-caption text-gray-500 mt-4">Please use the correct link with access token.</p>
        </div>
      </div>
    );
  }
  
  return children;
};

// Protected Payment Cancel Component - prevents return to payment cancel after leaving
const ProtectedPaymentCancel = () => {
  const { reservationInfo } = useContext(ReservationContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user has already visited payment cancel and tries to access it again, redirect to home
    if (reservationInfo?.hasVisitedPaymentCancel) {
      console.log('🚫 Preventing access to payment cancel page, redirecting to home');
      navigate('/', { replace: true });
      return;
    }
  }, [reservationInfo?.hasVisitedPaymentCancel, navigate]);
  
  // Only render PaymentCancel if user hasn't visited it before
  if (reservationInfo?.hasVisitedPaymentCancel) {
    return null; // Don't render anything while redirecting
  }
  
  return <PaymentCancel />;
};

function App() {
  const { isLoaded, loadError } = useGoogleMapsApi();
  const location = useLocation(); // Hook to detect route changes
  
  // Scroll to top on next tick to ensure content is rendered before scrolling
  const scrollUp = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  };

  const [selectedVehicle, setSelectedVehicle] = useState(cars[0]);

  useEffect(() => {
    // Initialize UTM tracking with URL preservation
    initUTMTrackingWithURLPreservation();
    
    // Make UTM utilities available globally for testing
    if (import.meta.env.DEV || window.location.search.includes('utm_debug=true')) {
      window.captureUTMParameters = captureUTMParameters;
      window.debugUTMState = debugUTMState;
      window.getStoredUTMParameters = getStoredUTMParameters;
      window.extractAndStoreUTMFromURL = extractAndStoreUTMFromURL;
      window.initUTMTracking = initUTMTracking;
      window.trackConversion = trackConversion;
      window.enableCrossTabSync = enableCrossTabSync;
      window.captureUTMWithConsent = captureUTMWithConsent;
      window.validateUTM = validateUTM;
      window.getUTMDebugInfo = getUTMDebugInfo;
      window.preserveUTMsInURL = preserveUTMsInURL;
      
      // Load UTM test console for development
      import('./utils/utmTestConsole.js').then(() => {
        console.log('🎯 UTM utilities and test console loaded! Try: utmTest.testComplete()');
      }).catch(err => {
        console.warn('Could not load UTM test console:', err);
      });
    }
  }, []);

  // Preserve UTMs in URL on route changes
  useEffect(() => {
    preserveUTMsOnNavigation();
  }, [location.pathname, location.search]);

  if (loadError) {
    console.error('Error loading Google Maps:', loadError);
  }

  return (
    <>
      <Header />
      <ReservationContextProvider>
        <Routes>
          <Route path="/" element={<Home scrollUp={scrollUp} setSelectedVehicle={setSelectedVehicle} />} />
          <Route path="/booking" element={<BookingPage scrollUp={scrollUp} />} />
          <Route path="/contact" element={<Contact scrollUp={scrollUp} />} />
          <Route path="/airport-transfer" element={<AirportTransfer scrollUp={scrollUp} />} />
          <Route path="/distance-transfer" element={<DistanceTransfer scrollUp={scrollUp} />} />
          <Route path="/hourly-transfer" element={<HourlyTransfer scrollUp={scrollUp} />} />
          <Route path="/special-request" element={<SpecialRequest scrollUp={scrollUp} />} />
          <Route path="/davos-forum" element={<DavosForum scrollUp={scrollUp} />} />
          <Route
            path="/vehicles"
            element={
              <Vehicles
                scrollUp={scrollUp}
                selectedVehicle={selectedVehicle}
                setSelectedVehicle={setSelectedVehicle}
              />
            }
          />
          <Route
            path="/vehicle-selection"
            element={<VehicleSelection scrollUp={scrollUp} isMapReady={isLoaded} />}
          />
          <Route
            path="/customer-details"
            element={<CustomerDetails scrollUp={scrollUp} />}
          />
          <Route
            path="/payment"
            element={<PaymentPage scrollUp={scrollUp} />}
          />
          <Route 
            path="/payment-success" 
            element={<PaymentSuccess />} 
          />
          <Route 
            path="/payment-cancel" 
            element={<ProtectedPaymentCancel />} 
          />
          <Route path="/thankyou" element={<ThankYou scrollUp={scrollUp} />} />
          <Route path="/thank-you-special" element={<ThankYouSpecial scrollUp={scrollUp} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy scrollUp={scrollUp} />} />
          <Route path="/terms-of-service" element={<TermsOfService scrollUp={scrollUp} />} />
          <Route path="/legal-notice" element={<LegalNotice scrollUp={scrollUp} />} />
          <Route 
            path="/design-system" 
            element={
              <ProtectedDesignSystem>
                <DesignSystemShowcase />
              </ProtectedDesignSystem>
            } 
          />
          
          <Route path="*" element={<NotFound scrollUp={scrollUp} />} />
        </Routes>
      </ReservationContextProvider>
      <Footer />
      <BackToTopButton scrollUp={scrollUp} />
      <ContactChannels />
      <CookieConsent />
    </>
  );
}

export default App;
