import cacheService from './CacheService';

// Switzerland has specific patterns in addresses and postal codes
const SWISS_POSTAL_CODE_PATTERN = /\b[1-9][0-9]{3}\b/; // Swiss postal codes are 4 digits and don't start with 0
const SWISS_CITIES = [
  'zürich', 'genève', 'geneva', 'basel', 'bern', 'lausanne', 'winterthur', 
  'luzern', 'st. gallen', 'lugano', 'biel', 'thun', 'köniz', 'fribourg', 'chur',
  'neuchâtel', 'vernier', 'uster', 'sion', 'zug', 'bellinzona', 'montreux', 'interlaken',
  'davos', 'gstaad', 'locarno', 'st. moritz', 'verbier', 'zermatt'
];

// Queue for managing API requests
const requestQueue = [];
let isProcessing = false;

const processQueue = async () => {
  if (isProcessing || requestQueue.length === 0) return;
  
  isProcessing = true;
  const { request, resolve, reject } = requestQueue.shift();
  
  try {
    const result = await request();
    resolve(result);
  } catch (error) {
    reject(error);
  } finally {
    isProcessing = false;
    processQueue();
  }
};

const enqueueRequest = (requestFn) => {
  return new Promise((resolve, reject) => {
    requestQueue.push({
      request: requestFn,
      resolve,
      reject
    });
    processQueue();
  });
};

// Calculate distance and duration between two points
export const calculateRoute = async (origin, destination, extraStops = []) => {
  if (!origin) {
    throw new Error("Origin is required");
  }

  if (!window.google || !window.google.maps) {
    throw new Error("Google Maps not loaded");
  }

  // Check cache first
  const cachedRoute = cacheService.getCachedRoute(origin, destination, extraStops);
  if (cachedRoute) {
    return cachedRoute;
  }

  return enqueueRequest(async () => {
    try {
      const directionsService = new window.google.maps.DirectionsService();
      
      const request = {
        origin: origin,
        destination: destination || origin, // Use origin as destination for hourly bookings
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true
      };

      if (extraStops && extraStops.length > 0) {
        const validStops = extraStops.filter(stop => stop && stop.trim());
        if (validStops.length > 0) {
          request.waypoints = validStops.map(stop => ({
            location: stop,
            stopover: true
          }));
        }
      }

      const result = await new Promise((resolve, reject) => {
        let retryCount = 0;
        const maxRetries = 3;

        const tryCalculateRoute = () => {
          directionsService.route(request, (response, status) => {
            if (status === 'OK') {
              resolve(response);
            } else if (status === 'OVER_QUERY_LIMIT' && retryCount < maxRetries) {
              retryCount++;
              setTimeout(tryCalculateRoute, 1000 * retryCount); // Exponential backoff
            } else {
              reject(new Error(status === 'OVER_QUERY_LIMIT' 
                ? 'Rate limit exceeded. Please try again in a few moments.'
                : `Route calculation failed: ${status}`));
            }
          });
        };

        tryCalculateRoute();
      });

      // Calculate total distance and duration across all legs
      const totalDistance = result.routes[0].legs.reduce((acc, leg) => acc + leg.distance.value, 0);
      const totalDuration = result.routes[0].legs.reduce((acc, leg) => acc + leg.duration.value, 0);

      // Format the total distance and duration
      const formatDistance = (meters) => {
        const km = meters / 1000;
        return `${km.toFixed(1)} km`;
      };

      const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
          return `${hours} hr ${minutes} min`;
        }
        return `${minutes} min`;
      };

      const routeInfo = {
        route: result.routes[0],
        distance: formatDistance(totalDistance),
        duration: formatDuration(totalDuration),
        distanceValue: totalDistance,
        durationValue: totalDuration,
        waypoints: result.routes[0].waypoint_order
      };

      // Cache the result
      cacheService.cacheRoute(origin, destination, extraStops, routeInfo);

      return routeInfo;
    } catch (error) {
      throw error;
    }
  });
};

// Get place details including coordinates
export const getPlaceDetails = async (address) => {
  // Check geocode cache first
  const cachedGeocode = cacheService.getCachedGeocode(address);
  if (cachedGeocode) {
    return cachedGeocode;
  }

  return enqueueRequest(async () => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results[0]) {
            resolve(results[0]);
          } else {
            reject(new Error(status === 'OVER_QUERY_LIMIT'
              ? 'Rate limit exceeded. Please try again in a few moments.'
              : 'Address not found'));
          }
        });
      });
      
      const isSpecialLocation = result.types?.some(type => 
        ['airport', 'train_station', 'transit_station', 'premise', 'point_of_interest'].includes(type)
      );

      const displayName = isSpecialLocation ? result.name : result.formatted_address;
      
      const placeInfo = {
        formattedAddress: displayName,
        location: {
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
        },
        placeId: result.place_id,
        types: result.types,
        originalName: result.name
      };

      // Cache the result
      cacheService.cacheGeocode(address, placeInfo);

      return placeInfo;
    } catch (error) {
      throw error;
    }
  });
};

// Validate if addresses are in Switzerland
export const validateAddresses = async (pickup, dropoff) => {
  try {
    if (!pickup && !dropoff) {
      return {
        isValid: false,
        error: "At least one location is required"
      };
    }

    // Enhanced validation for pickup location
    if (pickup) {
      const pickupInSwitzerland = await isAddressInSwitzerland(pickup);
      const isPickupAirport = pickup.types?.includes('airport');
      
      // Special handling for airports near Switzerland's borders
      if (!pickupInSwitzerland && isPickupAirport) {
        const distanceToSwissBorder = await calculateDistanceToSwissBorder(pickup.location);
        if (distanceToSwissBorder <= 50000) { // Within 50km of Swiss border
          return { isValid: true, error: null };
        }
      }
    }

    // Enhanced validation for dropoff location
    if (dropoff) {
      const dropoffInSwitzerland = await isAddressInSwitzerland(dropoff);
      const isDropoffAirport = dropoff.types?.includes('airport');
      
      if (!dropoffInSwitzerland && isDropoffAirport) {
        const distanceToSwissBorder = await calculateDistanceToSwissBorder(dropoff.location);
        if (distanceToSwissBorder <= 50000) {
          return { isValid: true, error: null };
        }
      }
    }

    // Check if at least one location is in Switzerland
    const pickupInSwitzerland = pickup ? await isAddressInSwitzerland(pickup) : false;
    const dropoffInSwitzerland = dropoff ? await isAddressInSwitzerland(dropoff) : false;

    if (!pickupInSwitzerland && !dropoffInSwitzerland) {
      return {
        isValid: false,
        error: "At least one location must be in Switzerland"
      };
    }

    return {
      isValid: true,
      error: null
    };
  } catch (error) {
    console.error("Address validation error:", error);
    return {
      isValid: false,
      error: "Error validating addresses"
    };
  }
};

// Check if place is in Switzerland using both address components and coordinates
export const isAddressInSwitzerland = async (placeInfo) => {
  if (!placeInfo) return false;

  // If we have address components, check the country code
  if (placeInfo.isSwiss) {
    return true;
  }

  // Fallback to coordinate-based check using bounding box of Switzerland
  const switzerlandBounds = {
    north: 47.8084,
    south: 45.8179,
    west: 5.9566,
    east: 10.4915
  };

  const { lat, lng } = placeInfo.location;
  return lat >= switzerlandBounds.south &&
         lat <= switzerlandBounds.north &&
         lng >= switzerlandBounds.west &&
         lng <= switzerlandBounds.east;
};

// Helper function to calculate distance to Swiss border
const calculateDistanceToSwissBorder = async (location) => {
  const switzerlandBounds = {
    north: 47.8084,
    south: 45.8179,
    west: 5.9566,
    east: 10.4915
  };

  // Calculate minimum distance to any edge of Switzerland's bounding box
  const distanceNorth = Math.abs(location.lat - switzerlandBounds.north) * 111000;
  const distanceSouth = Math.abs(location.lat - switzerlandBounds.south) * 111000;
  const distanceWest = Math.abs(location.lng - switzerlandBounds.west) * 111000;
  const distanceEast = Math.abs(location.lng - switzerlandBounds.east) * 111000;

  return Math.min(distanceNorth, distanceSouth, distanceWest, distanceEast);
};