// Simple in-memory rate limiter for WebContainer compatibility
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class SimpleRateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private points: number;
  private duration: number; // in seconds
  private keyPrefix: string;

  constructor(options: { keyPrefix: string; points: number; duration: number }) {
    this.keyPrefix = options.keyPrefix;
    this.points = options.points;
    this.duration = options.duration;
  }

  async consume(key: string): Promise<void> {
    const fullKey = `${this.keyPrefix}:${key}`;
    const now = Date.now();
    const entry = this.store.get(fullKey);

    // Clean up expired entries periodically
    if (Math.random() < 0.1) {
      this.cleanup();
    }

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired one
      this.store.set(fullKey, {
        count: 1,
        resetTime: now + (this.duration * 1000)
      });
      return;
    }

    if (entry.count >= this.points) {
      const msBeforeNext = entry.resetTime - now;
      throw {
        msBeforeNext,
        remainingPoints: 0,
        totalHits: entry.count
      };
    }

    // Increment count
    entry.count++;
    this.store.set(fullKey, entry);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

// Rate limiters for different endpoints
export const chatRateLimiter = new SimpleRateLimiter({
  keyPrefix: 'chat_rate_limit',
  points: 20, // Number of requests
  duration: 60, // Per 60 seconds
});

export const authRateLimiter = new SimpleRateLimiter({
  keyPrefix: 'auth_rate_limit',
  points: 5, // Number of attempts
  duration: 900, // Per 15 minutes
});

export const generalRateLimiter = new SimpleRateLimiter({
  keyPrefix: 'general_rate_limit',
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
});

export async function checkRateLimit(limiter: SimpleRateLimiter, key: string) {
  try {
    await limiter.consume(key);
    return { success: true };
  } catch (rejRes: any) {
    return {
      success: false,
      msBeforeNext: rejRes.msBeforeNext,
      remainingPoints: rejRes.remainingPoints,
    };
  }
}