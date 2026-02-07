import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

/**
 * GET /api/qr?s=<screenSlug>&o=<offerId optional>
 * Logs a QR_SCAN event and redirects to the offer landing page.
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("s");
    const offerId = url.searchParams.get("o");

    if (!slug) {
      logger.warn("QR scan missing screen slug");
      return NextResponse.json({ error: "missing s (screen slug)" }, { status: 400 });
    }

    const screen = await prisma.screen.findUnique({
      where: { qrSlug: slug },
      include: { hotel: true },
    });

    if (!screen) {
      logger.warn("QR scan: screen not found", { slug });
      return NextResponse.json(
        { error: "QR code not found. Please contact hotel staff." },
        { status: 404 }
      );
    }

    logger.qr("QR scan processed", { screenSlug: slug, hotelId: screen.hotelId });

    // Log QR_SCAN event (fire-and-forget style but awaited for reliability)
    await prisma.event.create({
      data: {
        hotelId: screen.hotelId,
        screenId: screen.id,
        offerId: offerId || undefined,
        type: "QR_SCAN",
        data: {
          userAgent: req.headers.get("user-agent") || "",
          ip: req.headers.get("x-forwarded-for") || "",
        },
      },
    });

    // Build redirect URL — prefer APP_URL, fall back to request origin
    const appUrl = process.env.APP_URL || url.origin;
    const landingSlug = offerId || "default";
    const redirectUrl = `${appUrl}/o/${landingSlug}?s=${slug}`;

    return NextResponse.redirect(redirectUrl, 302);
  } catch (error) {
    logger.error("QR scan error", error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
