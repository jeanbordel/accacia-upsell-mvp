import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getNetopiaConfig, decryptFromNetopia } from "@/lib/netopia";
import { logger } from "@/lib/logger";

/**
 * POST /api/webhooks/netopia
 * Netopia IPN callback endpoint.
 * Receives env_key + data, decrypts, parses XML, updates order status.
 * Idempotent: Will not double-process orders already marked PAID/FAILED.
 *
 * TODO: Replace stub decryption with real Netopia crypto when keys are available.
 */
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const envKey = form.get("env_key") as string;
    const data = form.get("data") as string;

    if (!envKey || !data) {
      logger.warn("Netopia webhook missing required fields");
      return new NextResponse(
        buildResponse("1", "missing env_key or data"),
        { status: 400, headers: { "Content-Type": "application/xml" } }
      );
    }

    logger.webhook("Netopia IPN received", { envKeyLength: envKey.length, dataLength: data.length });

    const config = getNetopiaConfig();
    const xml = decryptFromNetopia(envKey, data, config.privateKeyPem);

    // TODO: Parse XML properly with a real XML parser.
    // Skeleton parsing: extract orderId and action (confirmed / paid / etc.)
    const orderIdMatch = xml.match(/id="([^"]+)"/);
    const actionMatch = xml.match(/action="([^"]+)"/);

    const orderId = orderIdMatch?.[1];
    const action = actionMatch?.[1]; // e.g., "confirmed", "paid", "credit"

    if (!orderId) {
      logger.warn("Could not extract orderId from Netopia IPN XML");
      return new NextResponse(
        buildResponse("1", "could not parse orderId"),
        { status: 400, headers: { "Content-Type": "application/xml" } }
      );
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      logger.warn("Netopia IPN: Order not found", { orderId });
      return new NextResponse(
        buildResponse("1", "order not found"),
        { status: 404, headers: { "Content-Type": "application/xml" } }
      );
    }

    // Determine status from action
    const isPaid = action === "confirmed" || action === "paid" || action === "credit";
    const newStatus = isPaid ? "PAID" : "FAILED";
    const eventType = isPaid ? "PAYMENT_SUCCESS" : "PAYMENT_FAILED";

    // IDEMPOTENCY: Skip if already processed
    if (order.status === newStatus) {
      logger.info("Netopia order already processed", { orderId: order.id, status: newStatus });
      return new NextResponse(
        buildResponse("0", "OK"),
        { status: 200, headers: { "Content-Type": "application/xml" } }
      );
    }

    logger.payment("Netopia payment processed", {
      orderId: order.id,
      action: action || "unknown",
      newStatus,
    });

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
    logger.error("Netopia webhook error", error instanceof Error ? error : new Error(String(error)));
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
