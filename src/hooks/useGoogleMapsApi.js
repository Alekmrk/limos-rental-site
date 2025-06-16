import { useState, useEffect } from 'react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
let loadPromise = null;

// Helper to preload Google Maps API with new Places API
const preloadGoogleMaps = () => {
  if (!loadPromise && typeof window !== 'undefined') {
    const callbackName = 'googleMapsCallback_' + Math.random().toString(36).substr(2, 9);
    loadPromise = new Promise((resolve, reject) => {
      if (window.google?.maps) {
        resolve(window.google.maps);
        return;
      }

      window[callbackName] = () => {
        if (window.google?.maps) {
          resolve(window.google.maps);
        } else {
          reject(new Error('Failed to load Google Maps API'));
        }
        delete window[callbackName];
      };

      const script = document.createElement('script');
      // Use beta channel to get access to new Places API features
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=${callbackName}&libraries=places&v=beta`;
      script.async = true;
      script.defer = true;
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Maps API script'));
        delete window[callbackName];
      };

      // Add preload hint to browser
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'script';
      preloadLink.href = script.src;
      document.head.appendChild(preloadLink);

      // Add the script
      document.head.appendChild(script);
    });
  }
  return loadPromise;
};

// Start preloading as soon as the module is imported
preloadGoogleMaps();

export const useGoogleMapsApi = () => {
  const [isLoaded, setIsLoaded] = useState(!!window.google?.maps);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (!isLoaded) {
      preloadGoogleMaps()
        .then(() => setIsLoaded(true))
        .catch(error => {
          console.error('Error loading Google Maps:', error);
          setLoadError(error);
        });
    }
  }, [isLoaded]);

  return { isLoaded, loadError };
};