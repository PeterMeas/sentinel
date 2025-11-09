interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export class Cache {
  private store: Map<string, CacheEntry<any>>;
  private defaultTTL: number;

  constructor(defaultTTLMinutes: number = 5) {
    this.store = new Map();
    this.defaultTTL = defaultTTLMinutes * 60 * 1000; // Convert to milliseconds
  }

  set<T>(key: string, data: T, ttlMinutes?: number): void {
    const ttl = ttlMinutes ? ttlMinutes * 60 * 1000 : this.defaultTTL;
    const now = Date.now();

    this.store.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.store.get(key);

    if (!entry) {
      return false;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }

  // Get cache stats
  getStats() {
    const now = Date.now();
    let activeEntries = 0;
    let expiredEntries = 0;

    for (const [, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        expiredEntries++;
      } else {
        activeEntries++;
      }
    }

    return {
      total: this.store.size,
      active: activeEntries,
      expired: expiredEntries
    };
  }
}

// Singleton instance
export const sentimentCache = new Cache(3); // 3 minute cache for sentiment data
