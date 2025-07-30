// Test deployment - Frontend workflow update - May 2, 2025 - v2
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import Vehicles from "./pages/Vehicles/Vehicles";
import VehicleSelection from "./pages/VehicleSelection/VehicleSelection";
import CustomerDetails from "./pages/CustomerDetails/CustomerDetails";
import ThankYou from "./pages/ThankYou/ThankYou";
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
import { useState } from "react";
import cars from "./data/cars";
import { ReservationContextProvider } from "./contexts/ReservationContext";
import { useGoogleMapsApi } from "./hooks/useGoogleMapsApi";
import TermsOfService from "./pages/TermsOfService/TermsOfService";
import LegalNotice from "./pages/LegalNotice/LegalNotice";
import PrototypeHorizontal from "./pages/PrototypeHorizontal/PrototypeHorizontal";
import PrototypeCentered from "./pages/PrototypeCentered/PrototypeCentered";
import PrototypeSplit from "./pages/PrototypeSplit/PrototypeSplit";
import PrototypeNavigation from "./pages/PrototypeNavigation/PrototypeNavigation";
import PrototypeHybrid from "./pages/PrototypeHybrid/PrototypeHybrid";
import PrototypeFloating from "./pages/PrototypeFloating/PrototypeFloating";
import PrototypeSidebar from "./pages/PrototypeSidebar/PrototypeSidebar";
import PrototypeSidebarFullImage from "./pages/PrototypeSidebarFullImage/PrototypeSidebarFullImage";
import PrototypeSplitVertical from "./pages/PrototypeSplitVertical/PrototypeSplitVertical";
import useUTMTracking from "./hooks/useUTMTracking";
import GoogleTagManager from "./components/GoogleTagManager";
import useAnalytics from "./hooks/useAnalytics";

function App() {
  const { isLoaded, loadError } = useGoogleMapsApi();
  
  // Initialize UTM tracking for the entire application
  const { hasUTMs, utmData } = useUTMTracking({
    autoCapture: true,
    debug: import.meta.env.DEV, // Enable debug in development
    storeInContext: true
  });

  // Initialize analytics tracking
  const analytics = useAnalytics({
    autoTrackPageViews: true,
    debug: import.meta.env.DEV
  });
  
  // Scroll to top on next tick to ensure content is rendered before scrolling
  const scrollUp = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  };

  const [selectedVehicle, setSelectedVehicle] = useState(cars[0]);

  if (loadError) {
    console.error('Error loading Google Maps:', loadError);
  }

  // Log UTM tracking status in development
  useEffect(() => {
    if (import.meta.env.DEV && hasUTMs) {
      console.log('🎯 [App] UTM tracking active:', utmData);
    }
  }, [hasUTMs, utmData]);

  return (
    <>
      <ReservationContextProvider>
        {/* Google Tag Manager - Load early */}
        <GoogleTagManager 
          containerId="GTM-M54BVJHK" 
          initializeOnMount={true}
        />
        
        <div className="main-content">
          <Header selectedVehicle={selectedVehicle} />
          <main>
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
                element={<PaymentCancel />} 
              />
              <Route path="/thankyou" element={<ThankYou scrollUp={scrollUp} />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy scrollUp={scrollUp} />} />
              <Route path="/terms-of-service" element={<TermsOfService scrollUp={scrollUp} />} />
              <Route path="/legal-notice" element={<LegalNotice scrollUp={scrollUp} />} />
              
              {/* Prototype Routes */}
              <Route path="/prototypes" element={<PrototypeNavigation />} />
              <Route path="/prototype-horizontal" element={<PrototypeHorizontal scrollUp={scrollUp} />} />
              <Route path="/prototype-centered" element={<PrototypeCentered scrollUp={scrollUp} />} />
              <Route path="/prototype-split" element={<PrototypeSplit scrollUp={scrollUp} />} />
              <Route path="/prototype-hybrid" element={<PrototypeHybrid scrollUp={scrollUp} />} />
              <Route path="/prototype-floating" element={<PrototypeFloating scrollUp={scrollUp} />} />
              <Route path="/prototype-sidebar" element={<PrototypeSidebar scrollUp={scrollUp} />} />
              <Route path="/prototype-sidebar-full" element={<PrototypeSidebarFullImage scrollUp={scrollUp} />} />
              <Route path="/prototype-split-vertical" element={<PrototypeSplitVertical scrollUp={scrollUp} />} />
              
              <Route path="*" element={<NotFound scrollUp={scrollUp} />} />
            </Routes>
          </main>
        </div>
      </ReservationContextProvider>
      <Footer />
      <BackToTopButton scrollUp={scrollUp} />
      <ContactChannels />
      <CookieConsent />
    </>
  );
}

export default App;
