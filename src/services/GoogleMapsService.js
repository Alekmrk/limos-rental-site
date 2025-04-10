import cacheService from './CacheService';

// Switzerland has specific patterns in addresses and postal codes
const SWISS_POSTAL_CODE_PATTERN = /\b[1-9][0-9]{3}\b/; // Swiss postal codes are 4 digits and don't start with 0
const SWISS_CITIES = [
  'zürich', 'genève', 'geneva', 'basel', 'bern', 'lausanne', 'winterthur', 
  'luzern', 'st. gallen', 'lugano', 'biel', 'thun', 'köniz', 'fribourg', 'chur',
  'neuchâtel', 'vernier', 'uster', 'sion', 'zug', 'bellinzona', 'montreux', 'interlaken',
  'davos', 'gstaad', 'locarno', 'st. moritz', 'verbier', 'zermatt'
];

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 1000; // 1 second
let lastRequestTime = 0;
let requestQueue = [];

const waitForRateLimit = () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < RATE_LIMIT_WINDOW) {
    return new Promise(resolve => {
      setTimeout(resolve, RATE_LIMIT_WINDOW - timeSinceLastRequest);
    });
  }
  return Promise.resolve();
};

const enqueueRequest = (requestFn) => {
  return new Promise((resolve, reject) => {
    const executeRequest = async () => {
      try {
        await waitForRateLimit();
        lastRequestTime = Date.now();
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        requestQueue.shift();
        if (requestQueue.length > 0) {
          requestQueue[0]();
        }
      }
    };

    requestQueue.push(executeRequest);
    if (requestQueue.length === 1) {
      executeRequest();
    }
  });
};

// Calculate distance and duration between two points
export const calculateRoute = async (origin, destination, extraStops = []) => {
  // Check cache first
  const cachedRoute = cacheService.getCachedRoute(origin, destination, extraStops);
  if (cachedRoute) {
    return cachedRoute;
  }

  return enqueueRequest(async () => {
    try {
      const directionsService = new window.google.maps.DirectionsService();
      
      const request = {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      if (extraStops.length > 0) {
        request.waypoints = extraStops
          .filter(stop => stop.trim())
          .map(stop => ({
            location: stop,
            stopover: true
          }));
        request.optimizeWaypoints = true;
      }

      const result = await new Promise((resolve, reject) => {
        directionsService.route(request, (response, status) => {
          if (status === 'OK') {
            resolve(response);
          } else {
            reject(new Error(status === 'OVER_QUERY_LIMIT' 
              ? 'Rate limit exceeded. Please try again in a few moments.'
              : `Route calculation failed: ${status}`));
          }
        });
      });

      const routeInfo = {
        route: result.routes[0],
        distance: result.routes[0].legs[0].distance.text,
        duration: result.routes[0].legs[0].duration.text,
        distanceValue: result.routes[0].legs[0].distance.value,
        durationValue: result.routes[0].legs[0].duration.value,
        waypoints: result.routes[0].waypoint_order,
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
      
      const placeInfo = {
        formattedAddress: result.formatted_address,
        location: {
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
        },
        placeId: result.place_id,
        types: result.types,
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
    const pickupInSwitzerland = await isAddressInSwitzerland(pickup);
    const dropoffInSwitzerland = dropoff ? await isAddressInSwitzerland(dropoff) : true;

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

// Check if place is a hotel
export const isHotel = (placeTypes) => {
  const hotelTypes = ['lodging', 'hotel', 'resort'];
  return placeTypes.some(type => hotelTypes.includes(type));
};

// Client-side Swiss address validation
export const isAddressInSwitzerland = async (address) => {
  if (!address) return false;
  
  const lowercaseAddress = address.toLowerCase();
  
  // Static checks first to avoid API calls
  const swissIndicators = [
    'switzerland', 'schweiz', 'suisse', 'svizzera',
    'ch-', ', ch', /\b[1-9][0-9]{3}\b/ // Swiss postal code pattern
  ];
  
  if (swissIndicators.some(indicator => {
    if (typeof indicator === 'string') {
      return lowercaseAddress.includes(indicator);
    }
    return indicator.test(lowercaseAddress);
  })) {
    return true;
  }

  // Check cache before making API call
  const cachedResult = cacheService.getCachedGeocode(address);
  if (cachedResult) {
    return cachedResult.types.includes('country') && 
           cachedResult.formattedAddress.toLowerCase().includes('switzerland');
  }

  try {
    const details = await getPlaceDetails(address);
    return details.types.includes('country') && 
           details.formattedAddress.toLowerCase().includes('switzerland');
  } catch (error) {
    console.error('Error validating Swiss address:', error);
    return false;
  }
};