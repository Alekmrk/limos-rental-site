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
import ServicesPage from "./pages/ServicesPage/ServicesPage";
import PaymentPage from "./pages/Payment/PaymentPage";
import BackToTopButton from "./components/BackToTopButton";
import { useState } from "react";
import cars from "./data/cars";
import { ReservationContextProvider } from "./contexts/ReservationContext";
import { useGoogleMapsApi } from "./hooks/useGoogleMapsApi";

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
          <Route path="/thankyou" element={<ThankYou scrollUp={scrollUp} />} />
          <Route path="*" element={<NotFound scrollUp={scrollUp} />} />
        </Routes>
      </ReservationContextProvider>
      <Footer />
      <BackToTopButton scrollUp={scrollUp} />
    </>
  );
}

export default App;
