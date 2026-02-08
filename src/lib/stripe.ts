import Stripe from "stripe";

let _stripe: Stripe | null = null;

/**
 * Get a Stripe instance using global environment secret key.
 * For backward compatibility and fallback scenarios.
 */
export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
}

/**
 * Get a Stripe instance using a hotel-specific secret key.
 * Use this for checkout flows where each hotel has its own Stripe account.
 */
export function getStripeForHotel(secretKey: string): Stripe {
  if (!secretKey) {
    throw new Error("Hotel Stripe secret key is required");
  }
  return new Stripe(secretKey);
}

