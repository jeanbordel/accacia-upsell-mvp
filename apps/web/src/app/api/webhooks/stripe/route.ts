import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe, getStripeForHotel } from "@/lib/stripe";
import { logger } from "@/lib/logger";
import { notifyOrderPaid } from "@/lib/notifications";
import Stripe from "stripe";

/**
 * POST /api/webhooks/stripe
 * Stripe webhook endpoint — handles checkout.session.completed / expired.
 * Idempotent: Will not double-process orders already marked PAID/FAILED.
 * 
 * Supports both global webhook secret (env) and per-hotel webhook secrets.
 * For per-hotel webhooks, the hotelId must be in the session metadata.
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    logger.warn("Stripe webhook missing signature");
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  let stripe: Stripe;

  // Try global webhook secret first (backward compatibility)
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    try {
      stripe = getStripe();
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      logger.webhook("Stripe webhook received (global)", { type: event.type, id: event.id });
    } catch (err: unknown) {
      // If global validation fails, try per-hotel validation
      const result = await tryPerHotelWebhook(body, sig);
      if (!result) {
        const message = err instanceof Error ? err.message : "invalid signature";
        logger.error("Stripe webhook signature verification failed", { error: message });
        return NextResponse.json({ error: message }, { status: 400 });
      }
      event = result;
      logger.webhook("Stripe webhook received (per-hotel)", { type: event.type, id: event.id });
    }
  } else {
    // No global secret, try per-hotel
    const result = await tryPerHotelWebhook(body, sig);
    if (!result) {
      logger.error("Stripe webhook signature verification failed (no valid secrets)");
      return NextResponse.json({ error: "invalid signature" }, { status: 400 });
    }
    event = result;
    logger.webhook("Stripe webhook received (per-hotel)", { type: event.type, id: event.id });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleSessionCompleted(session);
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleSessionFailed(session);
      break;
    }
    default:
      logger.debug("Unhandled Stripe webhook event", { type: event.type });
      break;
  }

  return NextResponse.json({ received: true });
}

/**
 * Try to validate webhook using per-hotel webhook secrets.
 * Returns the event if successful, null otherwise.
 */
async function tryPerHotelWebhook(
  body: string,
  sig: string
): Promise<Stripe.Event | null> {
  // Extract session info to find the hotel
  // This is a simplified approach - in production you might want to parse the event first
  try {
    const tempEvent = JSON.parse(body);
    const session = tempEvent.data?.object;
    const hotelId = session?.metadata?.hotelId;

    if (!hotelId) {
      return null;
    }

    const config = await prisma.hotelPaymentConfig.findUnique({
      where: { hotelId },
    });

    if (!config?.stripeWebhook || !config.stripeSecret) {
      return null;
    }

    const stripe = getStripeForHotel(config.stripeSecret);
    return stripe.webhooks.constructEvent(body, sig, config.stripeWebhook);
  } catch {
    return null;
  }
}

async function handleSessionCompleted(session: Stripe.Checkout.Session) {
  const order = await prisma.order.findFirst({
    where: { providerRef: session.id },
    select: {
      id: true,
      hotelId: true,
      screenId: true,
      offerId: true,
      status: true,
      amountCents: true,
      currency: true,
      customerEmail: true,
      hotel: { select: { name: true } },
      offer: { select: { title: true, fulfillmentNotes: true } },
    },
  });
  
  if (!order) {
    logger.warn("Order not found for Stripe session", { sessionId: session.id });
    return;
  }

  // IDEMPOTENCY: Skip if already processed
  if (order.status === "PAID") {
    logger.info("Order already marked PAID, skipping", { orderId: order.id });
    return;
  }

  logger.payment("Stripe checkout completed", {
    orderId: order.id,
    sessionId: session.id,
    amount: order.amountCents,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { 
      status: "PAID",
      customerEmail: session.customer_email || undefined,
    },
  });

  await prisma.event.create({
    data: {
      hotelId: order.hotelId,
      screenId: order.screenId || undefined,
      offerId: order.offerId || undefined,
      orderId: order.id,
      type: "PAYMENT_SUCCESS",
      data: {
        provider: "STRIPE",
        sessionId: session.id,
        paymentIntent:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id || null,
        customerEmail: session.customer_email,
      },
    },
  });

  // Send fulfillment notifications
  await notifyOrderPaid({
    orderId: order.id,
    hotelName: order.hotel.name,
    offerTitle: order.offer?.title || "Unknown Offer",
    amountCents: order.amountCents,
    currency: order.currency,
    customerEmail: session.customer_email || undefined,
    fulfillmentNotes: order.offer?.fulfillmentNotes || undefined,
  });
}

async function handleSessionFailed(session: Stripe.Checkout.Session) {
  const order = await prisma.order.findFirst({
    where: { providerRef: session.id },
  });
  
  if (!order) {
    logger.warn("Order not found for expired Stripe session", { sessionId: session.id });
    return;
  }

  // IDEMPOTENCY: Skip if already processed
  if (order.status === "FAILED") {
    logger.info("Order already marked FAILED, skipping", { orderId: order.id });
    return;
  }

  logger.payment("Stripe checkout expired", {
    orderId: order.id,
    sessionId: session.id,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "FAILED" },
  });

  await prisma.event.create({
    data: {
      hotelId: order.hotelId,
      screenId: order.screenId || undefined,
      offerId: order.offerId || undefined,
      orderId: order.id,
      type: "PAYMENT_FAILED",
      data: {
        provider: "STRIPE",
        sessionId: session.id,
        reason: "session_expired",
      },
    },
  });
}
