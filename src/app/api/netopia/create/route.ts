import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getNetopiaConfig,
  buildPaymentXml,
  encryptForNetopia,
} from "@/lib/netopia";

/**
 * POST /api/netopia/create
 * Body (form or JSON): { offerId, screenSlug? }
 * Creates an Order and returns an auto-submitting HTML form to Netopia.
 */
export async function POST(req: NextRequest) {
  try {
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

    let screenId: string | undefined;
    if (screenSlug) {
      const screen = await prisma.screen.findUnique({
        where: { qrSlug: screenSlug },
      });
      screenId = screen?.id;
    }

    // Create Order
    const order = await prisma.order.create({
      data: {
        hotelId: offer.hotelId,
        screenId: screenId || undefined,
        offerId: offer.id,
        provider: "NETOPIA",
        amountCents: offer.priceCents,
        currency: offer.currency,
      },
    });

    const config = getNetopiaConfig();

    // Build XML
    const xml = buildPaymentXml({
      orderId: order.id,
      amountCents: offer.priceCents,
      currency: offer.currency,
      description: offer.title,
      signature: config.signature,
      notifyUrl: config.notifyUrl,
      returnUrl: config.returnUrl,
    });

    // Encrypt (stub — TODO: replace with real encryption)
    const { envKey, data } = encryptForNetopia(xml, config.publicKeyPem);

    // Update order with providerRef
    await prisma.order.update({
      where: { id: order.id },
      data: { providerRef: order.id },
    });

    // Return auto-submitting HTML form
    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Redirectare către Netopia...</title></head>
<body onload="document.getElementById('netopia-form').submit();">
  <p>Se redirecționează către procesatorul de plăți...</p>
  <form id="netopia-form" method="POST" action="${config.hostedUrl}">
    <input type="hidden" name="env_key" value="${envKey}" />
    <input type="hidden" name="data" value="${data}" />
    <noscript><button type="submit">Click here if not redirected</button></noscript>
  </form>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error: unknown) {
    console.error("Netopia create error:", error);
    const message =
      error instanceof Error ? error.message : "internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
