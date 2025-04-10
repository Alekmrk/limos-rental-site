// Cache duration in milliseconds
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

class CacheService {
  constructor() {
    this.routeCache = new Map();
    this.placeCache = new Map();
    this.geocodeCache = new Map();
  }

  // Generate a unique key for a route
  getRouteKey(origin, destination, waypoints = []) {
    const waypointStr = waypoints
      .filter(wp => wp && wp.trim())
      .sort()
      .join('|');
    return `${origin}|${destination}|${waypointStr}`;
  }

  // Cache a route result
  cacheRoute(origin, destination, waypoints = [], result) {
    const key = this.getRouteKey(origin, destination, waypoints);
    this.routeCache.set(key, {
      data: result,
      timestamp: Date.now()
    });
  }

  // Get a cached route
  getCachedRoute(origin, destination, waypoints = []) {
    const key = this.getRouteKey(origin, destination, waypoints);
    const cached = this.routeCache.get(key);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return cached.data;
    }
    
    this.routeCache.delete(key);
    return null;
  }

  // Cache place details
  cachePlaceDetails(placeId, details) {
    this.placeCache.set(placeId, {
      data: details,
      timestamp: Date.now()
    });
  }

  // Get cached place details
  getCachedPlaceDetails(placeId) {
    const cached = this.placeCache.get(placeId);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return cached.data;
    }
    
    this.placeCache.delete(placeId);
    return null;
  }

  // Cache geocoding results
  cacheGeocode(address, result) {
    this.geocodeCache.set(address.toLowerCase(), {
      data: result,
      timestamp: Date.now()
    });
  }

  // Get cached geocoding results
  getCachedGeocode(address) {
    const cached = this.geocodeCache.get(address.toLowerCase());
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return cached.data;
    }
    
    this.geocodeCache.delete(address.toLowerCase());
    return null;
  }

  // Clear expired cache entries
  clearExpiredCache() {
    const now = Date.now();
    
    for (const [key, value] of this.routeCache.entries()) {
      if (now - value.timestamp > CACHE_DURATION) {
        this.routeCache.delete(key);
      }
    }
    
    for (const [key, value] of this.placeCache.entries()) {
      if (now - value.timestamp > CACHE_DURATION) {
        this.placeCache.delete(key);
      }
    }
    
    for (const [key, value] of this.geocodeCache.entries()) {
      if (now - value.timestamp > CACHE_DURATION) {
        this.geocodeCache.delete(key);
      }
    }
  }
}

// Create a singleton instance
const cacheService = new CacheService();

// Clear expired cache entries periodically
setInterval(() => {
  cacheService.clearExpiredCache();
}, 60 * 60 * 1000); // Every hour

export default cacheService;