// Simple in-memory cache for availability data
class AvailabilityCache {
    constructor() {
        this.cache = new Map();
        this.ttl = 5 * 60 * 1000; // 5 minutes in milliseconds
    }

    // Generate cache key
    generateKey(roomId, month, year) {
        return `${roomId}-${month}-${year}`;
    }

    // Get cached data
    get(roomId, month, year) {
        const key = this.generateKey(roomId, month, year);
        const cached = this.cache.get(key);
        
        if (cached && Date.now() - cached.timestamp < this.ttl) {
            return cached.data;
        }
        
        // Remove expired cache entry
        if (cached) {
            this.cache.delete(key);
        }
        
        return null;
    }

    // Set cache data
    set(roomId, month, year, data) {
        const key = this.generateKey(roomId, month, year);
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    // Clear cache for a specific room (when bookings change)
    clearRoom(roomId) {
        for (const [key] of this.cache) {
            if (key.startsWith(`${roomId}-`)) {
                this.cache.delete(key);
            }
        }
    }

    // Clear all cache
    clear() {
        this.cache.clear();
    }

    // Get cache stats
    getStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

export default new AvailabilityCache();
