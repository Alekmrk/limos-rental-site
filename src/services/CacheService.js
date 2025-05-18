// CacheService.js

class CacheService {
  constructor() {
    // Initialize caches with size limits
    this.routeCache = new Map();
    this.placeCache = new Map();
    this.geocodeCache = new Map();
    this.partialMatchCache = new Map();
    
    // Cache configuration
    this.MAX_CACHE_SIZE = 100;
    this.CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    this.FREQUENTLY_USED_THRESHOLD = 5;
    
    // Start cleanup interval
    this.cleanupInterval = setInterval(this.cleanup.bind(this), 3600000); // Every hour
    
    // Load persisted cache from localStorage if available
    this.loadPersistedCache();
  }

  loadPersistedCache() {
    try {
      const persistedCache = localStorage.getItem('routeCache');
      if (persistedCache) {
        const { routes, timestamp } = JSON.parse(persistedCache);
        if (Date.now() - timestamp < this.CACHE_DURATION) {
          routes.forEach(([key, value]) => this.routeCache.set(key, value));
        } else {
          localStorage.removeItem('routeCache');
        }
      }
    } catch (error) {
      console.warn('Failed to load persisted cache:', error);
    }
  }

  persistCache() {
    try {
      const routes = Array.from(this.routeCache.entries());
      localStorage.setItem('routeCache', JSON.stringify({
        routes,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to persist cache:', error);
    }
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
      timestamp: Date.now(),
      accessCount: 0
    });
    
    // Persist updated cache
    this.persistCache();
    
    // Maintain cache size limit
    if (this.routeCache.size > this.MAX_CACHE_SIZE) {
      this.trimCache(this.routeCache);
    }
  }

  // Get a cached route
  getCachedRoute(origin, destination, waypoints = []) {
    const key = this.getRouteKey(origin, destination, waypoints);
    const cached = this.routeCache.get(key);
    
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
      cached.accessCount++;
      cached.lastAccessed = Date.now();
      return cached.data;
    }
    
    this.routeCache.delete(key);
    return null;
  }

  normalizeAddress(address) {
    return address.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  generatePartialKey(address) {
    return this.normalizeAddress(address).split(' ')[0];
  }

  // Cache place details
  cachePlaceDetails(placeId, details) {
    this.placeCache.set(placeId, {
      data: details,
      timestamp: Date.now(),
      accessCount: 0,
      lastAccessed: Date.now()
    });
    
    if (this.placeCache.size > this.MAX_CACHE_SIZE) {
      this.trimCache(this.placeCache);
    }
  }

  // Get cached place details
  getCachedPlaceDetails(placeId) {
    const cached = this.placeCache.get(placeId);
    
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
      cached.accessCount++;
      cached.lastAccessed = Date.now();
      return cached.data;
    }
    
    this.placeCache.delete(placeId);
    return null;
  }

  trimCache(cache) {
    // Remove least recently used items, but keep frequently accessed items
    const entries = Array.from(cache.entries());
    entries.sort((a, b) => {
      const aFrequent = a[1].accessCount >= this.FREQUENTLY_USED_THRESHOLD;
      const bFrequent = b[1].accessCount >= this.FREQUENTLY_USED_THRESHOLD;
      
      if (aFrequent !== bFrequent) return bFrequent - aFrequent;
      return (b[1].lastAccessed || 0) - (a[1].lastAccessed || 0);
    });
    
    const itemsToRemove = entries.slice(Math.floor(this.MAX_CACHE_SIZE * 0.8));
    itemsToRemove.forEach(([key]) => cache.delete(key));
  }

  // Clear expired cache entries
  clearExpiredCache() {
    const now = Date.now();
    
    for (const [key, value] of this.routeCache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.routeCache.delete(key);
      }
    }
    
    for (const [key, value] of this.placeCache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.placeCache.delete(key);
      }
    }
    
    for (const [key, value] of this.geocodeCache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.geocodeCache.delete(key);
      }
    }
  }

  cleanup() {
    const now = Date.now();
    
    // Clear expired entries from all caches
    [this.routeCache, this.placeCache, this.geocodeCache].forEach(cache => {
      for (const [key, value] of cache.entries()) {
        const age = now - value.timestamp;
        const isFrequentlyUsed = value.accessCount >= this.FREQUENTLY_USED_THRESHOLD;
        const maxAge = isFrequentlyUsed ? this.CACHE_DURATION * 2 : this.CACHE_DURATION;
        
        if (age > maxAge) {
          cache.delete(key);
        }
      }
    });
    
    // Clear partial matches cache
    for (const [key, addresses] of this.partialMatchCache.entries()) {
      if (addresses.size === 0) {
        this.partialMatchCache.delete(key);
      }
    }
    
    // Persist current cache state
    this.persistCache();
  }

  dispose() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.persistCache();
  }
}

export default new CacheService();