import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { logger } from "@/lib/logger";
import { notifyOrderPaid } from "@/lib/notifications";
import Stripe from "stripe";

/**
 * POST /api/webhooks/stripe
 * Stripe webhook endpoint — handles checkout.session.completed / expired.
 * Idempotent: Will not double-process orders already marked PAID/FAILED.
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    logger.warn("Stripe webhook missing signature");
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "invalid signature";
    logger.error("Stripe webhook signature verification failed", { error: message });
    return NextResponse.json({ error: message }, { status: 400 });
  }

  logger.webhook("Stripe webhook received", { type: event.type, id: event.id });

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

async function handleSessionCompleted(session: Stripe.Checkout.Session) {
  const order = await prisma.order.findFirst({
    where: { providerRef: session.id },
    include: {
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
