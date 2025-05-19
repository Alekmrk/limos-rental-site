// CacheService.js

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const GEOCODE_CACHE_KEY = 'geocode_cache';
const ROUTE_CACHE_KEY = 'route_cache';

class CacheService {
  constructor() {
    // Initialize caches
    this.geocodeCache = {};
    this.routeCache = {};
    
    // Load persisted cache from localStorage if available
    this.loadCache();
  }

  loadCache() {
    try {
      this.geocodeCache = JSON.parse(localStorage.getItem(GEOCODE_CACHE_KEY)) || {};
      this.routeCache = JSON.parse(localStorage.getItem(ROUTE_CACHE_KEY)) || {};
      
      // Clean expired entries
      this.cleanCache();
    } catch (error) {
      console.warn('Error loading cache:', error);
      this.geocodeCache = {};
      this.routeCache = {};
    }
  }

  cleanCache() {
    const now = Date.now();
    Object.keys(this.geocodeCache).forEach(key => {
      if (now - this.geocodeCache[key].timestamp > CACHE_DURATION) {
        delete this.geocodeCache[key];
      }
    });
    Object.keys(this.routeCache).forEach(key => {
      if (now - this.routeCache[key].timestamp > CACHE_DURATION) {
        delete this.routeCache[key];
      }
    });
    this.saveCache();
  }

  saveCache() {
    try {
      localStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(this.geocodeCache));
      localStorage.setItem(ROUTE_CACHE_KEY, JSON.stringify(this.routeCache));
    } catch (error) {
      console.warn('Error saving cache:', error);
    }
  }

  // Generate a unique key for a route
  getCacheKey(origin, destination, extraStops = []) {
    return JSON.stringify({
      origin,
      destination,
      extraStops: extraStops.sort()
    });
  }

  // Get a cached route
  getCachedRoute(origin, destination, extraStops = []) {
    const key = this.getCacheKey(origin, destination, extraStops);
    const cached = this.routeCache[key];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  // Cache a route result
  cacheRoute(origin, destination, extraStops = [], routeInfo) {
    const key = this.getCacheKey(origin, destination, extraStops);
    this.routeCache[key] = {
      data: routeInfo,
      timestamp: Date.now()
    };
    this.saveCache();
  }

  // Get cached geocode data
  getCachedGeocode(address) {
    const cached = this.geocodeCache[address];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  // Cache geocode data
  cacheGeocode(address, placeInfo) {
    this.geocodeCache[address] = {
      data: placeInfo,
      timestamp: Date.now()
    };
    this.saveCache();
  }
}

export default new CacheService();