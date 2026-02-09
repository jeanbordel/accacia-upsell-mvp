/**
 * Simple in-memory rate limiting for API endpoints
 * For production, consider Redis-based solution (Upstash, Vercel KV)
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

// Cleanup old entries every hour
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetAt < now) {
      delete store[key];
    }
  });
}, 60 * 60 * 1000);

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Rate limit a request
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param limit - Maximum requests per window
 * @param windowMs - Time window in milliseconds
 */
export function rateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60 * 1000 // 1 minute default
): RateLimitResult {
  const now = Date.now();
  const key = identifier;

  if (!store[key] || store[key].resetAt < now) {
    // Initialize or reset
    store[key] = {
      count: 1,
      resetAt: now + windowMs,
    };

    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: store[key].resetAt,
    };
  }

  // Increment count
  store[key].count++;

  if (store[key].count > limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: store[key].resetAt,
    };
  }

  return {
    success: true,
    limit,
    remaining: limit - store[key].count,
    reset: store[key].resetAt,
  };
}

/**
 * Get client identifier from request
 * Uses IP address or forwarded header
 */
export function getClientIdentifier(request: Request): string {
  // Vercel provides x-forwarded-for or x-real-ip
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback (shouldn't happen on Vercel)
  return "unknown";
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Very strict for authentication
  auth: { limit: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes

  // Moderate for checkout (prevent payment spam)
  checkout: { limit: 10, windowMs: 60 * 1000 }, // 10 per minute

  // Generous for QR scans (high traffic expected)
  qrScan: { limit: 100, windowMs: 60 * 1000 }, // 100 per minute

  // Moderate for general API
  api: { limit: 60, windowMs: 60 * 1000 }, // 60 per minute

  // Strict for admin exports
  export: { limit: 10, windowMs: 60 * 1000 }, // 10 per minute
};
