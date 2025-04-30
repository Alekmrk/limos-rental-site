// Cache duration in milliseconds
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

class CacheService {
  constructor() {
    this.routeCache = new Map();
    this.placeCache = new Map();
    this.geocodeCache = new Map();
    this.partialMatchCache = new Map();
    this.cleanupInterval = setInterval(this.cleanup.bind(this), 3600000); // Cleanup every hour
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

  normalizeAddress(address) {
    return address.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  generatePartialKey(address) {
    const words = this.normalizeAddress(address).split(' ');
    return words.filter(word => word.length > 3).join(' '); // Only use significant words
  }

  // Cache geocoding results
  cacheGeocode(address, result) {
    const normalizedAddress = this.normalizeAddress(address);
    this.geocodeCache.set(normalizedAddress, {
      data: result,
      timestamp: Date.now(),
      accessCount: 0
    });

    // Cache partial matches for better suggestions
    const partialKey = this.generatePartialKey(address);
    if (!this.partialMatchCache.has(partialKey)) {
      this.partialMatchCache.set(partialKey, new Set());
    }
    this.partialMatchCache.get(partialKey).add(normalizedAddress);
  }

  // Get cached geocoding results
  getCachedGeocode(address) {
    const normalizedAddress = this.normalizeAddress(address);
    const cached = this.geocodeCache.get(normalizedAddress);
    
    if (cached) {
      const age = Date.now() - cached.timestamp;
      if (age < 24 * 3600 * 1000) { // 24 hours
        cached.accessCount++;
        return cached.data;
      }
      this.geocodeCache.delete(normalizedAddress);
      return null;
    }

    // Try partial matches
    const partialKey = this.generatePartialKey(address);
    const partialMatches = this.partialMatchCache.get(partialKey);
    if (partialMatches) {
      for (const cachedAddress of partialMatches) {
        const cached = this.geocodeCache.get(cachedAddress);
        if (cached && cachedAddress.includes(normalizedAddress)) {
          cached.accessCount++;
          return cached.data;
        }
      }
    }
    
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

  cleanup() {
    const now = Date.now();
    const DAY = 24 * 3600 * 1000;
    
    // Clear old entries
    for (const [key, value] of this.geocodeCache.entries()) {
      const age = now - value.timestamp;
      // Keep frequently accessed items longer
      const maxAge = value.accessCount > 10 ? 7 * DAY : DAY;
      if (age > maxAge) {
        this.geocodeCache.delete(key);
        // Clean up partial matches
        for (const [partialKey, addresses] of this.partialMatchCache.entries()) {
          addresses.delete(key);
          if (addresses.size === 0) {
            this.partialMatchCache.delete(partialKey);
          }
        }
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