import { useEffect, useRef, useState } from 'react';
import { useRouteCalculation } from '../hooks/useRouteCalculation';
import { useGoogleMapsApi } from '../hooks/useGoogleMapsApi';

const MapPreview = ({ origin, destination, extraStops = [], onRouteCalculated, routeInfo: preCalculatedRoute }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const { isLoaded } = useGoogleMapsApi();
  const [directionsServiceAvailable, setDirectionsServiceAvailable] = useState(false);
  
  // Only use useRouteCalculation if no pre-calculated route is provided
  const { routeInfo: hookRouteInfo, isCalculating, error } = useRouteCalculation(
    preCalculatedRoute ? null : origin, 
    preCalculatedRoute ? null : destination, 
    preCalculatedRoute ? [] : extraStops
  );
  
  // Use pre-calculated route if available, otherwise use hook result
  const routeInfo = preCalculatedRoute || hookRouteInfo;
  const mapInitializedRef = useRef(false);
  const directionsRendererRef = useRef(null);
  const hourlyMarkerRef = useRef(null);

  // Check if any stops are being edited (empty)
  const hasEmptyStops = extraStops.some(stop => !stop || !stop.trim());

  // Check for DirectionsService availability
  useEffect(() => {
    if (isLoaded) {
      const hasDirectionsService = !!(
        window.google &&
        window.google.maps &&
        window.google.maps.DirectionsService
      );
      setDirectionsServiceAvailable(hasDirectionsService);
    }
  }, [isLoaded]);

  // Initialize map only when we have all required data
  useEffect(() => {
    if (!isLoaded || !directionsServiceAvailable || !origin || mapInitializedRef.current) {
      return;
    }

    // Initialize map if not already done
    if (!map && mapRef.current) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        zoom: 8,
        center: { lat: 46.8182, lng: 8.2275 }, // Switzerland center
        // Minimal styles for better performance
        styles: [
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#455a64' }]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#ffffff' }]
          }
        ]
      });
      setMap(newMap);
      mapInitializedRef.current = true;

      // Always initialize DirectionsRenderer
      const newDirectionsRenderer = new window.google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#D4AF37',
          strokeWeight: 4
        }
      });
      newDirectionsRenderer.setMap(newMap);
      directionsRendererRef.current = newDirectionsRenderer;
      setDirectionsRenderer(newDirectionsRenderer);
    }
  }, [map, origin, destination, isLoaded, directionsServiceAvailable]);

  // Handle hourly mode marker separately
  useEffect(() => {
    if (!isLoaded || !map || !origin) {
      return;
    }

    // For hourly mode (no destination), show a prominent marker at the pickup location
    if (!destination) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: origin }, (results, status) => {
        if (status === 'OK') {
          // Clear any existing hourly marker
          if (hourlyMarkerRef.current) {
            hourlyMarkerRef.current.setMap(null);
          }

          // Clear any route display when switching to hourly mode
          if (directionsRendererRef.current) {
            directionsRendererRef.current.setDirections({ routes: [] });
          }

          // Create a prominent, animated marker for hourly pickup location
          hourlyMarkerRef.current = new window.google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: '#D4AF37',
              fillOpacity: 0.9,
              strokeColor: '#ffffff',
              strokeWeight: 3,
              scale: 12,
            },
            title: `Pickup Location: ${origin}`,
            animation: window.google.maps.Animation.BOUNCE
          });

          // Create an info window to show pickup details
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; font-family: system-ui, -apple-system, sans-serif;">
                <div style="font-weight: 600; color: #D4AF37; margin-bottom: 4px;">Pickup Location</div>
                <div style="color: #374151; font-size: 14px;">${origin}</div>
                <div style="color: #6B7280; font-size: 12px; margin-top: 4px;">Vehicle will wait at your disposal</div>
              </div>
            `
          });

          // Show info window initially and on marker click
          infoWindow.open(map, hourlyMarkerRef.current);
          
          hourlyMarkerRef.current.addListener('click', () => {
            infoWindow.open(map, hourlyMarkerRef.current);
          });

          // Stop the bounce animation after 3 seconds
          setTimeout(() => {
            if (hourlyMarkerRef.current) {
              hourlyMarkerRef.current.setAnimation(null);
            }
          }, 3000);
          
          map.setCenter(results[0].geometry.location);
          map.setZoom(8); // Reduced zoom for better context view
        }
      });
    } else if (destination && hourlyMarkerRef.current) {
      // Clear hourly marker when switching to route mode
      hourlyMarkerRef.current.setMap(null);
      hourlyMarkerRef.current = null;
    }
  }, [map, origin, destination, isLoaded]);

  // Update route on map when routeInfo changes
  useEffect(() => {
    if (directionsRendererRef.current && routeInfo?.route && !hasEmptyStops) {
      try {
        const directionsResult = {
          routes: [routeInfo.route],
          request: {
            origin,
            destination,
            travelMode: 'DRIVING'
          }
        };
        directionsRendererRef.current.setDirections(directionsResult);

        if (onRouteCalculated) {
          onRouteCalculated({
            ...routeInfo,
            optimizedWaypoints: routeInfo.waypoints
          });
        }

        // Fit bounds to show the entire route
        if (map && routeInfo.route.bounds) {
          map.fitBounds(routeInfo.route.bounds);
        }
      } catch (error) {
        console.error('Error setting directions:', error);
      }
    }
  }, [directionsRenderer, routeInfo, onRouteCalculated, map, origin, destination, hasEmptyStops]);

  return (
    <div className="relative w-full h-full">
      <div className="w-full h-full rounded-2xl overflow-hidden border border-zinc-700/50">
        {!isLoaded || !directionsServiceAvailable ? (
          <div className="w-full h-full flex items-center justify-center bg-zinc-800">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mb-2"></div>
              <div className="text-gold">
                {!isLoaded ? 'Loading Google Maps...' : 'Initializing navigation services...'}
              </div>
            </div>
          </div>
        ) : (
          <div ref={mapRef} className="w-full h-full" />
        )}
      </div>
      
      {isCalculating && !hasEmptyStops && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm rounded-xl">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mb-2"></div>
            <div className="text-gold">Calculating route...</div>
          </div>
        </div>
      )}
      
      {hasEmptyStops && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm rounded-xl">
          <div className="text-center">
            <div className="text-gold">Enter all stop locations to calculate the route</div>
          </div>
        </div>
      )}
      
      {error && !hasEmptyStops && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm rounded-xl">
          <div className="bg-zinc-800 p-6 rounded-lg border border-red-500/20 max-w-[80%] text-center">
            <svg className="w-8 h-8 text-red-500 mx-auto mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <div className="text-red-500 font-medium mb-1">Route Calculation Error</div>
            <div className="text-sm text-zinc-300">{error}</div>
            <div className="text-xs text-zinc-400 mt-2">
              The system will automatically retry in a few moments
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPreview;