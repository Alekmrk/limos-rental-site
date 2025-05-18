// Test deployment - Frontend workflow update - May 2, 2025 - v2
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useEffect } from "react";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import BackToTopButton from "./components/BackToTopButton";
import { useState } from "react";
import cars from "./data/cars";
import { ReservationContextProvider } from "./contexts/ReservationContext";
import { useGoogleMapsApi } from "./hooks/useGoogleMapsApi";
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load route components with proper paths
const Home = lazy(() => import('./pages/Home/Home'));
const ServicesPage = lazy(() => import('./pages/ServicesPage/ServicesPage'));
const Vehicles = lazy(() => import('./pages/Vehicles/Vehicles'));
const VehicleSelection = lazy(() => import('./pages/VehicleSelection/VehicleSelection'));
const CustomerDetails = lazy(() => import('./pages/CustomerDetails/CustomerDetails'));
const PaymentPage = lazy(() => import('./pages/Payment/PaymentPage'));
const PaymentSuccess = lazy(() => import('./pages/Payment/PaymentSuccess'));
const PaymentCancel = lazy(() => import('./pages/Payment/PaymentCancel'));
const ThankYou = lazy(() => import('./pages/ThankYou/ThankYou'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

function App() {
  const { isLoaded, loadError } = useGoogleMapsApi();
  
  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const [selectedVehicle, setSelectedVehicle] = useState(cars[0]);

  if (loadError) {
    console.error('Error loading Google Maps:', loadError);
  }

  return (
    <>
      <Header />
      <ReservationContextProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home scrollUp={scrollUp} setSelectedVehicle={setSelectedVehicle} />} />
            <Route path="/services" element={<ServicesPage scrollUp={scrollUp} />} />
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
            <Route path="*" element={<NotFound scrollUp={scrollUp} />} />
          </Routes>
        </Suspense>
      </ReservationContextProvider>
      <Footer />
      <BackToTopButton scrollUp={scrollUp} />
    </>
  );
}

export default App;
