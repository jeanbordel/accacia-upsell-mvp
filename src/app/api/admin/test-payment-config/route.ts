import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import Stripe from "stripe";

/**
 * POST /api/admin/test-payment-config
 * Test payment provider connection
 */
export async function POST(req: NextRequest) {
  try {
    const { hotelId, provider } = await req.json();

    if (!hotelId || !provider) {
      return NextResponse.json(
        { error: "hotelId and provider required" },
        { status: 400 }
      );
    }

    const config = await prisma.hotelPaymentConfig.findUnique({
      where: { hotelId },
    });

    if (!config) {
      return NextResponse.json(
        { error: "Payment configuration not found for this hotel" },
        { status: 404 }
      );
    }

    switch (provider) {
      case "STRIPE":
        return await testStripe(config.stripeSecret);
      case "NETOPIA":
        return await testNetopia(config.netopiaSignature);
      case "PAYU":
        return NextResponse.json(
          { error: "PayU testing not implemented yet" },
          { status: 501 }
        );
      default:
        return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("Payment config test failed", { error: message });
    return NextResponse.json({ error: "Connection test failed" }, { status: 500 });
  }
}

async function testStripe(secret: string | null): Promise<NextResponse> {
  if (!secret) {
    return NextResponse.json(
      { error: "Stripe secret key not configured" },
      { status: 400 }
    );
  }

  try {
    const stripe = new Stripe(secret);
    // Test by retrieving account info
    await stripe.balance.retrieve();
    logger.info("Stripe connection test successful");
    return NextResponse.json({ success: true, message: "Stripe connection successful" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.warn("Stripe connection test failed", { error: message });
    return NextResponse.json({ error: `Stripe test failed: ${message}` }, { status: 400 });
  }
}

async function testNetopia(signature: string | null): Promise<NextResponse> {
  if (!signature) {
    return NextResponse.json(
      { error: "Netopia signature not configured" },
      { status: 400 }
    );
  }

  // For Netopia, we'll do a basic validation
  // In a real implementation, you might want to make a test API call
  if (signature.length < 10) {
    return NextResponse.json(
      { error: "Netopia signature appears invalid (too short)" },
      { status: 400 }
    );
  }

  logger.info("Netopia connection test passed (basic validation)");
  return NextResponse.json({
    success: true,
    message: "Netopia configuration appears valid (basic check)",
  });
}
