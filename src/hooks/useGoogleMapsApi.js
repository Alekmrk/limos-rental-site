import { useState, useEffect } from 'react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const useGoogleMapsApi = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (window.google) {
      setIsLoaded(true);
      return;
    }

    window.initGoogleMaps = () => {
      setIsLoaded(true);
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initGoogleMaps&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      setLoadError(new Error('Failed to load Google Maps API'));
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      delete window.initGoogleMaps;
    };
  }, []);

  return { isLoaded, loadError };
};