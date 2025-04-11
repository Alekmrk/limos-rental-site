import { useEffect, useRef, useState } from 'react';
import { useRouteCalculation } from '../hooks/useRouteCalculation';
import { useGoogleMapsApi } from '../hooks/useGoogleMapsApi';

const MapPreview = ({ origin, destination, extraStops = [], onRouteCalculated }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const { isLoaded } = useGoogleMapsApi();
  const [directionsServiceAvailable, setDirectionsServiceAvailable] = useState(false);
  const { routeInfo, isCalculating, error } = useRouteCalculation(origin, destination, extraStops);

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

  useEffect(() => {
    if (!isLoaded || !directionsServiceAvailable || !origin) {
      return;
    }

    // Initialize map if not already done
    if (!map) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        zoom: 8,
        center: { lat: 46.8182, lng: 8.2275 }, // Switzerland center
        styles: [
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#0288d1' }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#81c784' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#455a64' }]
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{ color: '#66bb6a' }]
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: '#546e7a' }]
          },
          {
            featureType: 'administrative',
            elementType: 'geometry',
            stylers: [{ color: '#37474f' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#43a047' }]
          },
          {
            featureType: 'road',
            elementType: 'labels',
            stylers: [{ color: '#ffffff' }]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#263238' }, { weight: 3 }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#ffffff' }]
          }
        ]
      });
      setMap(newMap);

      // Only set up directionsRenderer if we have a destination
      if (destination) {
        const newDirectionsRenderer = new window.google.maps.DirectionsRenderer({
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: '#D4AF37', // Gold color for the route
            strokeWeight: 4
          }
        });
        newDirectionsRenderer.setMap(newMap);
        setDirectionsRenderer(newDirectionsRenderer);
      }
    }

    // For hourly mode (no destination), just show a marker at the pickup location
    if (!destination && map) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: origin }, (results, status) => {
        if (status === 'OK') {
          const marker = new window.google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: '#D4AF37',
              fillOpacity: 1,
              strokeColor: '#D4AF37',
              strokeWeight: 2,
              scale: 7,
            }
          });
          
          map.setCenter(results[0].geometry.location);
          map.setZoom(15);
        }
      });
    }
  }, [map, origin, destination, isLoaded, directionsServiceAvailable]);

  // Update route on map when routeInfo changes
  useEffect(() => {
    if (directionsRenderer && routeInfo) {
      const directionsResult = {
        routes: [routeInfo.route],
        request: {
          origin,
          destination,
          travelMode: 'DRIVING'
        }
      };
      directionsRenderer.setDirections(directionsResult);

      if (onRouteCalculated) {
        onRouteCalculated({
          distance: routeInfo.distance,
          duration: routeInfo.duration,
          distanceValue: routeInfo.distanceValue,
          durationValue: routeInfo.durationValue,
          waypoints: routeInfo.waypoints
        });
      }

      // Fit bounds to show the entire route
      if (map && routeInfo.route.bounds) {
        map.fitBounds(routeInfo.route.bounds);
      }
    }
  }, [directionsRenderer, routeInfo, onRouteCalculated, map, origin, destination]);

  return (
    <div className="relative w-full">
      <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden border border-zinc-700/50">
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
      
      {isCalculating && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm rounded-xl">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mb-2"></div>
            <div className="text-gold">Calculating route...</div>
          </div>
        </div>
      )}
      
      {error && (
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