import { useState, useEffect } from 'react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
let loadPromise = null;

const loadGoogleMapsScript = () => {
  if (!loadPromise && typeof window !== 'undefined') {
    const callbackName = 'googleMapsCallback_' + Math.random().toString(36).substr(2, 9);
    
    loadPromise = new Promise((resolve, reject) => {
      if (window.google?.maps) {
        resolve(window.google.maps);
        return;
      }

      // Create script element with optimized loading
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=${callbackName}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      // Add performance optimization attributes
      script.fetchPriority = 'high';
      script.crossOrigin = 'anonymous';
      
      window[callbackName] = () => {
        if (window.google?.maps) {
          resolve(window.google.maps);
        } else {
          reject(new Error('Failed to load Google Maps API'));
        }
        delete window[callbackName];
        script.remove();
      };

      script.onerror = () => {
        reject(new Error('Failed to load Google Maps API script'));
        delete window[callbackName];
        script.remove();
      };

      // Add resource hints
      const preconnectLink = document.createElement('link');
      preconnectLink.rel = 'preconnect';
      preconnectLink.href = 'https://maps.googleapis.com';
      document.head.appendChild(preconnectLink);

      const preconnectLinkStatic = document.createElement('link');
      preconnectLinkStatic.rel = 'preconnect';
      preconnectLinkStatic.href = 'https://maps.gstatic.com';
      document.head.appendChild(preconnectLinkStatic);

      document.head.appendChild(script);
    });
  }
  return loadPromise;
};

export const useGoogleMapsApi = () => {
  const [isLoaded, setIsLoaded] = useState(!!window.google?.maps);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (!isLoaded) {
      loadGoogleMapsScript()
        .then(() => {
          if (isMounted) setIsLoaded(true);
        })
        .catch(error => {
          if (isMounted) {
            console.error('Error loading Google Maps:', error);
            setLoadError(error);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [isLoaded]);

  return { isLoaded, loadError };
};