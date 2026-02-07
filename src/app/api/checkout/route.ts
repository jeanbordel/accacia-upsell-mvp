import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

/**
 * POST /api/checkout
 * Body (form or JSON): { offerId, screenSlug? }
 * Creates a Stripe Checkout Session and redirects to it.
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
      return NextResponse.json({ error: "offerId required" }, { status: 400 });
    }

    const offer = await prisma.offer.findUnique({ where: { id: offerId } });
    if (!offer) {
      return NextResponse.json({ error: "offer not found" }, { status: 404 });
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

    // Create Stripe Checkout Session
    const session = await getStripe().checkout.sessions.create({
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
      cancel_url: `${appUrl}/o/${offerId}${screenSlug ? `?s=${screenSlug}` : ""}`,
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
      },
    });

    // Redirect to Stripe Checkout
    return NextResponse.redirect(session.url!, 303);
  } catch (error: unknown) {
    console.error("Checkout error:", error);
    const message =
      error instanceof Error ? error.message : "internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
