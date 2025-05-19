// Test deployment - Frontend workflow update - May 2, 2025 - v2
import { Suspense, lazy, useCallback, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useGoogleMapsApi } from "./hooks/useGoogleMapsApi";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import BackToTopButton from "./components/BackToTopButton";
import LoadingSpinner from './components/LoadingSpinner';
import { ReservationContextProvider } from "./contexts/ReservationContext";
import cars from "./data/cars";

// Lazy load route components with error boundaries and retry logic
const lazyWithRetry = (componentImport) => lazy(() => 
  componentImport.catch(error => {
    console.error('Error loading component:', error);
    return new Promise((resolve) => {
      // Retry after a short delay
      setTimeout(() => {
        resolve(componentImport);
      }, 1000);
    });
  })
);

// Lazy load route components with proper paths
const Home = lazyWithRetry(import('./pages/Home/Home'));
const ServicesPage = lazyWithRetry(import('./pages/ServicesPage/ServicesPage'));
const Vehicles = lazyWithRetry(import('./pages/Vehicles/Vehicles'));
const VehicleSelection = lazyWithRetry(import('./pages/VehicleSelection/VehicleSelection'));
const CustomerDetails = lazyWithRetry(import('./pages/CustomerDetails/CustomerDetails'));
const PaymentPage = lazyWithRetry(import('./pages/Payment/PaymentPage'));
const PaymentSuccess = lazyWithRetry(import('./pages/Payment/PaymentSuccess'));
const PaymentCancel = lazyWithRetry(import('./pages/Payment/PaymentCancel'));
const ThankYou = lazyWithRetry(import('./pages/ThankYou/ThankYou'));
const NotFound = lazyWithRetry(import('./pages/NotFound/NotFound'));

function App() {
  const { isLoaded, loadError } = useGoogleMapsApi();
  
  const scrollUp = useCallback(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  }, []);

  const [selectedVehicle, setSelectedVehicle] = useState(cars[0]);

  if (loadError) {
    console.error('Error loading Google Maps:', loadError);
  }

  return (
    <ReservationContextProvider>
      <div className="app">
        <Header />
        <main>
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
        </main>
        <Footer />
        <BackToTopButton scrollUp={scrollUp} />
      </div>
    </ReservationContextProvider>
  );
}

export default App;
