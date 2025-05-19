import { useState, useEffect } from 'react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Cache promise to prevent multiple loads
let loadPromise = null;

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
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initGoogleMaps&libraries=places`;
  script.async = true;
  script.defer = true;
  
  // Add performance optimization attributes
  script.fetchPriority = 'high';
  script.crossOrigin = 'anonymous';
  
  // Cache the promise
  loadPromise = new Promise((resolve, reject) => {
    window.initGoogleMaps = () => {
      if (window.google?.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error('Failed to load Google Maps API'));
      }
      delete window.initGoogleMaps;
      script.remove();
    };

    script.onerror = () => {
      reject(new Error('Failed to load Google Maps API script'));
      delete window.initGoogleMaps;
      script.remove();
    };

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