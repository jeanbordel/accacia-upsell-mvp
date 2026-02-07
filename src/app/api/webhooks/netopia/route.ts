import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getNetopiaConfig, decryptFromNetopia } from "@/lib/netopia";

/**
 * POST /api/webhooks/netopia
 * Netopia IPN callback endpoint.
 * Receives env_key + data, decrypts, parses XML, updates order status.
 *
 * TODO: Replace stub decryption with real Netopia crypto when keys are available.
 */
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const envKey = form.get("env_key") as string;
    const data = form.get("data") as string;

    if (!envKey || !data) {
      return new NextResponse(
        buildResponse("1", "missing env_key or data"),
        { status: 400, headers: { "Content-Type": "application/xml" } }
      );
    }

    const config = getNetopiaConfig();
    const xml = decryptFromNetopia(envKey, data, config.privateKeyPem);

    // TODO: Parse XML properly with a real XML parser.
    // Skeleton parsing: extract orderId and action (confirmed / paid / etc.)
    const orderIdMatch = xml.match(/id="([^"]+)"/);
    const actionMatch = xml.match(/action="([^"]+)"/);

    const orderId = orderIdMatch?.[1];
    const action = actionMatch?.[1]; // e.g., "confirmed", "paid", "credit"

    if (!orderId) {
      console.warn("[Netopia] Could not extract orderId from IPN XML");
      return new NextResponse(
        buildResponse("1", "could not parse orderId"),
        { status: 400, headers: { "Content-Type": "application/xml" } }
      );
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      console.warn("[Netopia] Order not found:", orderId);
      return new NextResponse(
        buildResponse("1", "order not found"),
        { status: 404, headers: { "Content-Type": "application/xml" } }
      );
    }

    // Determine status from action
    const isPaid = action === "confirmed" || action === "paid" || action === "credit";
    const newStatus = isPaid ? "PAID" : "FAILED";
    const eventType = isPaid ? "PAYMENT_SUCCESS" : "PAYMENT_FAILED";

    await prisma.order.update({
      where: { id: order.id },
      data: { status: newStatus },
    });

    await prisma.event.create({
      data: {
        hotelId: order.hotelId,
        screenId: order.screenId || undefined,
        offerId: order.offerId || undefined,
        orderId: order.id,
        type: eventType,
        data: { provider: "NETOPIA", action: action || "unknown", raw: xml.slice(0, 500) },
      },
    });

    // Netopia expects a specific XML response
    return new NextResponse(
      buildResponse("0", "OK"),
      { status: 200, headers: { "Content-Type": "application/xml" } }
    );
  } catch (error: unknown) {
    console.error("Netopia webhook error:", error);
    return new NextResponse(
      buildResponse("1", "internal error"),
      { status: 500, headers: { "Content-Type": "application/xml" } }
    );
  }
}

function buildResponse(code: string, message: string): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<crc>${message}</crc>`;
}
