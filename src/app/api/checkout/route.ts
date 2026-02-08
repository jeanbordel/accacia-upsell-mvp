import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripeForHotel } from "@/lib/stripe";
import { logger } from "@/lib/logger";
import { buildPaymentXml, encryptForNetopia, getNetopiaConfigForHotel } from "@/lib/netopia";

/**
 * POST /api/checkout
 * Body (form or JSON): { offerId, screenSlug? }
 * Creates a payment session using the hotel's configured payment provider.
 */
export async function POST(req: NextRequest) {
  try {
    // Support both form data and JSON
    let offerId: string | null = null;
    let screenSlug: string | null = null;

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const form = await req.formData();
      offerId = form.get("offerId") as string;
      screenSlug = form.get("screenSlug") as string;
    } else {
      const body = await req.json();
      offerId = body.offerId;
      screenSlug = body.screenSlug;
    }

    if (!offerId) {
      logger.warn("Checkout missing offerId");
      return NextResponse.json({ error: "offerId required" }, { status: 400 });
    }

    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: { hotel: { include: { paymentConfig: true } } },
    });

    if (!offer) {
      logger.warn("Checkout: offer not found", { offerId });
      return NextResponse.json({ error: "offer not found" }, { status: 404 });
    }

    if (!offer.isActive) {
      logger.warn("Checkout: offer is not active", { offerId });
      return NextResponse.json(
        { error: "This offer is no longer available" },
        { status: 410 }
      );
    }

    // Check if hotel has payment config
    const paymentConfig = offer.hotel.paymentConfig;
    if (!paymentConfig || !paymentConfig.defaultPsp) {
      logger.error("No payment configuration for hotel", { hotelId: offer.hotelId });
      return NextResponse.json(
        { error: "Payment not configured for this hotel. Please contact support." },
        { status: 503 }
      );
    }

    // Resolve screen if provided
    let screenId: string | undefined;
    if (screenSlug) {
      const screen = await prisma.screen.findUnique({
        where: { qrSlug: screenSlug },
      });
      screenId = screen?.id;
    }

    const appUrl = process.env.APP_URL || "http://localhost:3000";

    logger.payment("Creating checkout", {
      offerId,
      hotelId: offer.hotelId,
      provider: paymentConfig.defaultPsp,
      amount: offer.priceCents,
    });

    // Route to appropriate payment provider
    switch (paymentConfig.defaultPsp) {
      case "STRIPE":
        return await createStripeCheckout(offer, paymentConfig, screenId, appUrl);
      case "NETOPIA":
        return await createNetopiaCheckout(offer, paymentConfig, screenId, appUrl);
      case "PAYU":
        logger.error("PayU not implemented yet");
        return NextResponse.json(
          { error: "PayU integration coming soon" },
          { status: 501 }
        );
      default:
        return NextResponse.json(
          { error: "Invalid payment provider configured" },
          { status: 500 }
        );
    }
  } catch (error: unknown) {
    logger.error("Checkout error", error instanceof Error ? error : new Error(String(error)));
    const message = error instanceof Error ? error.message : "internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function createStripeCheckout(
  offer: any,
  config: any,
  screenId: string | undefined,
  appUrl: string
): Promise<NextResponse> {
  if (!config.stripeSecret) {
    throw new Error("Stripe secret key not configured for this hotel");
  }

  const stripe = getStripeForHotel(config.stripeSecret);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    currency: offer.currency.toLowerCase(),
    line_items: [
      {
        price_data: {
          currency: offer.currency.toLowerCase(),
          unit_amount: offer.priceCents,
          product_data: {
            name: offer.title,
            description: offer.description || undefined,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/o/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/o/${offer.id}`,
    metadata: {
      offerId: offer.id,
      hotelId: offer.hotelId,
      screenId: screenId || "",
    },
  });

  // Create Order record
  await prisma.order.create({
    data: {
      hotelId: offer.hotelId,
      screenId: screenId || undefined,
      offerId: offer.id,
      provider: "STRIPE",
      providerRef: session.id,
      amountCents: offer.priceCents,
      currency: offer.currency,
      paymentOwner: "HOTEL",
    },
  });

  logger.payment("Stripe checkout created", { sessionId: session.id, offerId: offer.id });

  return NextResponse.redirect(session.url!, 303);
}

async function createNetopiaCheckout(
  offer: any,
  config: any,
  screenId: string | undefined,
  appUrl: string
): Promise<NextResponse> {
  if (!config.netopiaSignature) {
    throw new Error("Netopia signature not configured for this hotel");
  }

  const netopiaConfig = getNetopiaConfigForHotel(config);
  
  // Create order first to get orderId
  const order = await prisma.order.create({
    data: {
      hotelId: offer.hotelId,
      screenId: screenId || undefined,
      offerId: offer.id,
      provider: "NETOPIA",
      amountCents: offer.priceCents,
      currency: offer.currency,
      paymentOwner: "HOTEL",
    },
  });

  const xml = buildPaymentXml({
    orderId: order.id,
    amountCents: offer.priceCents,
    currency: offer.currency,
    description: offer.title,
    signature: netopiaConfig.signature,
    notifyUrl: netopiaConfig.notifyUrl,
    returnUrl: netopiaConfig.returnUrl,
  });

  const { envKey, data } = encryptForNetopia(xml, netopiaConfig.publicKeyPem);

  // Update order with providerRef (using order.id for now)
  await prisma.order.update({
    where: { id: order.id },
    data: { providerRef: order.id },
  });

  logger.payment("Netopia checkout created", { orderId: order.id, offerId: offer.id });

  // Build form to POST to Netopia
  const form = `
    <!DOCTYPE html>
    <html>
    <head><title>Redirecting to payment...</title></head>
    <body>
      <form id="netopiaForm" method="POST" action="${netopiaConfig.hostedUrl}">
        <input type="hidden" name="env_key" value="${envKey}" />
        <input type="hidden" name="data" value="${data}" />
      </form>
      <script>document.getElementById('netopiaForm').submit();</script>
    </body>
    </html>
  `;

  return new NextResponse(form, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}
