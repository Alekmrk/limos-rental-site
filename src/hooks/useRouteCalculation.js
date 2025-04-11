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

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const calculateFullRoute = async () => {
      if (!isLoaded || !origin || (destination && !destination.trim())) return;

      // Check if this is the same calculation as last time
      const sameOrigin = origin === lastCalculation.current.origin;
      const sameDestination = destination === lastCalculation.current.destination;
      const sameStops = JSON.stringify(extraStops) === JSON.stringify(lastCalculation.current.extraStops);
      
      if (sameOrigin && sameDestination && sameStops && routeInfo) {
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
          // For hourly bookings (no destination), just validate the origin
          if (!destination) {
            const route = {
              distance: '0 km',
              duration: '0 mins',
              distanceValue: 0,
              durationValue: 0,
              route: null,
              waypoints: []
            };
            setRouteInfo(route);
            setIsCalculating(false);
            return;
          }

          // Check cache first
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
          setRouteInfo(null);
        } finally {
          setIsCalculating(false);
        }
      }, DEBOUNCE_DELAY);
    };

    calculateFullRoute();
  }, [origin, destination, extraStops, isLoaded]);

  return { routeInfo, isCalculating, error };
};