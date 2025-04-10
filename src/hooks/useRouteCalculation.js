import { useState, useEffect, useRef } from 'react';
import { calculateRoute } from '../services/GoogleMapsService';
import cacheService from '../services/CacheService';
import { useGoogleMapsApi } from './useGoogleMapsApi';

const DEBOUNCE_DELAY = 1000; // 1 second debounce

export const useRouteCalculation = (origin, destination, extraStops = []) => {
  const [routeInfo, setRouteInfo] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimer = useRef(null);
  const { isLoaded } = useGoogleMapsApi();
  const lastCalculation = useRef({
    origin: null,
    destination: null,
    extraStops: []
  });

  // Clear debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const calculateFullRoute = async () => {
      if (!isLoaded || !origin || !destination) return;

      // Check if this is the same calculation as last time
      const sameOrigin = origin === lastCalculation.current.origin;
      const sameDestination = destination === lastCalculation.current.destination;
      const sameStops = JSON.stringify(extraStops) === JSON.stringify(lastCalculation.current.extraStops);
      
      if (sameOrigin && sameDestination && sameStops) {
        return;
      }

      // Update last calculation reference
      lastCalculation.current = {
        origin,
        destination,
        extraStops: [...extraStops]
      };

      // Clear any existing timeout
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Set up new debounced calculation
      debounceTimer.current = setTimeout(async () => {
        setIsCalculating(true);
        setError(null);

        try {
          const cachedResult = cacheService.getCachedRoute(origin, destination, extraStops);
          if (cachedResult) {
            setRouteInfo(cachedResult);
            setIsCalculating(false);
            return;
          }

          const result = await calculateRoute(origin, destination, extraStops);
          setRouteInfo(result);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsCalculating(false);
        }
      }, DEBOUNCE_DELAY);
    };

    calculateFullRoute();
  }, [origin, destination, extraStops, isLoaded]);

  return { routeInfo, isCalculating, error };
};