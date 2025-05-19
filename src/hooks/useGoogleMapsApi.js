import { useState, useEffect } from 'react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const LOADING_TIMEOUT = 30000; // 30 seconds timeout

// Cache promise to prevent multiple loads
let loadPromise = null;
let initializationTimer = null;

export const loadGoogleMapsApi = () => {
  if (loadPromise) {
    return loadPromise;
  }

  // Add preconnect hints to head
  if (!document.querySelector('link[href="https://maps.googleapis.com"]')) {
    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = 'https://maps.googleapis.com';
    document.head.appendChild(preconnectLink);

    const preconnectLinkStatic = document.createElement('link');
    preconnectLinkStatic.rel = 'preconnect';
    preconnectLinkStatic.href = 'https://maps.gstatic.com';
    document.head.appendChild(preconnectLinkStatic);
  }

  // Create script element with optimized loading
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
  script.async = true;
  script.defer = true;
  
  // Add performance optimization attributes
  script.fetchPriority = 'high';
  script.crossOrigin = 'anonymous';
  
  // Cache the promise
  loadPromise = new Promise((resolve, reject) => {
    // Set a timeout to prevent hanging
    initializationTimer = setTimeout(() => {
      reject(new Error('Google Maps initialization timed out'));
      loadPromise = null; // Reset the promise to allow retry
    }, LOADING_TIMEOUT);

    // Success handler
    const handleLoad = () => {
      clearTimeout(initializationTimer);
      if (window.google?.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error('Failed to load Google Maps API'));
      }
      cleanup();
    };

    // Error handler
    const handleError = () => {
      clearTimeout(initializationTimer);
      reject(new Error('Failed to load Google Maps API script'));
      loadPromise = null; // Reset the promise to allow retry
      cleanup();
    };

    // Cleanup function
    const cleanup = () => {
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
      script.remove();
    };

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);
    document.head.appendChild(script);
  });

  return loadPromise;
};

export const useGoogleMapsApi = () => {
  const [isLoaded, setIsLoaded] = useState(!!window.google?.maps);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (!isLoaded) {
      loadGoogleMapsApi()
        .then(() => {
          if (isMounted) {
            setIsLoaded(true);
            setLoadError(null);
          }
        })
        .catch(error => {
          if (isMounted) {
            console.error('Error loading Google Maps:', error);
            setLoadError(error);
            // Reset loaded state to allow retry
            setIsLoaded(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [isLoaded]);

  return { isLoaded, loadError };
};