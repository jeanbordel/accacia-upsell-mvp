import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { PaymentProvider } from "@prisma/client";

/**
 * POST /api/admin/payment-config
 * Save hotel payment configuration
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hotelId, defaultPsp, ...configFields } = body;

    if (!hotelId) {
      return NextResponse.json({ error: "hotelId required" }, { status: 400 });
    }

    // Validate hotel exists
    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    // Validate defaultPsp if provided
    if (defaultPsp && !["STRIPE", "NETOPIA", "PAYU"].includes(defaultPsp)) {
      return NextResponse.json({ error: "Invalid defaultPsp value" }, { status: 400 });
    }

    // Upsert configuration
    const config = await prisma.hotelPaymentConfig.upsert({
      where: { hotelId },
      create: {
        hotelId,
        defaultPsp: defaultPsp || null,
        stripeSecret: configFields.stripeSecret || null,
        stripeWebhook: configFields.stripeWebhook || null,
        netopiaSignature: configFields.netopiaSignature || null,
        netopiaTestMode: configFields.netopiaTestMode ?? true,
        netopiaHostedUrlTest: configFields.netopiaHostedUrlTest || null,
        netopiaHostedUrlLive: configFields.netopiaHostedUrlLive || null,
        netopiaPublicKeyPem: configFields.netopiaPublicKeyPem || null,
        netopiaPrivateKeyPem: configFields.netopiaPrivateKeyPem || null,
        payuMerchantId: configFields.payuMerchantId || null,
        payuSecret: configFields.payuSecret || null,
        payuEnv: configFields.payuEnv || null,
      },
      update: {
        defaultPsp: defaultPsp || null,
        stripeSecret: configFields.stripeSecret || null,
        stripeWebhook: configFields.stripeWebhook || null,
        netopiaSignature: configFields.netopiaSignature || null,
        netopiaTestMode: configFields.netopiaTestMode ?? true,
        netopiaHostedUrlTest: configFields.netopiaHostedUrlTest || null,
        netopiaHostedUrlLive: configFields.netopiaHostedUrlLive || null,
        netopiaPublicKeyPem: configFields.netopiaPublicKeyPem || null,
        netopiaPrivateKeyPem: configFields.netopiaPrivateKeyPem || null,
        payuMerchantId: configFields.payuMerchantId || null,
        payuSecret: configFields.payuSecret || null,
        payuEnv: configFields.payuEnv || null,
      },
    });

    logger.info("Payment config saved", { hotelId, defaultPsp });

    return NextResponse.json({ success: true, config });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("Failed to save payment config", { error: message });
    return NextResponse.json({ error: "Failed to save configuration" }, { status: 500 });
  }
}
