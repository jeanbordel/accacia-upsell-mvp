import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/qr?s=<screenSlug>&o=<offerId optional>
 * Logs a QR_SCAN event and redirects to the offer landing page.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("s");
  const offerId = url.searchParams.get("o");

  if (!slug) {
    return NextResponse.json({ error: "missing s (screen slug)" }, { status: 400 });
  }

  const screen = await prisma.screen.findUnique({
    where: { qrSlug: slug },
    include: { hotel: true },
  });

  if (!screen) {
    return NextResponse.json({ error: "screen not found" }, { status: 404 });
  }

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
}
