import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";

/**
 * POST /api/webhooks/stripe
 * Stripe webhook endpoint — handles checkout.session.completed / expired.
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
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
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
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
      // Unhandled event type
      break;
  }

  return NextResponse.json({ received: true });
}

async function handleSessionCompleted(session: Stripe.Checkout.Session) {
  const order = await prisma.order.findFirst({
    where: { providerRef: session.id },
  });
  if (!order) {
    console.warn("Order not found for session:", session.id);
    return;
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "PAID" },
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
      },
    },
  });
}

async function handleSessionFailed(session: Stripe.Checkout.Session) {
  const order = await prisma.order.findFirst({
    where: { providerRef: session.id },
  });
  if (!order) return;

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
