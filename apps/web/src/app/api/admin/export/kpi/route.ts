import { NextRequest, NextResponse } from "next/server";
import {
  getHotelKPIs,
  getScreenKPIs,
  getOfferKPIs,
  getDailyRevenue,
} from "@/lib/kpi";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

/**
 * GET /api/admin/export/kpi?startDate=...&endDate=...
 * Export KPIs as CSV
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const startDateParam = url.searchParams.get("startDate");
    const endDateParam = url.searchParams.get("endDate");

    const endDate = endDateParam ? new Date(endDateParam) : new Date();
    const startDate = startDateParam
      ? new Date(startDateParam)
      : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get first hotel (MVP: single hotel)
    const hotel = await prisma.hotel.findFirst();
    if (!hotel) {
      return NextResponse.json({ error: "No hotel found" }, { status: 404 });
    }

    const [overallKPIs, screenKPIs, offerKPIs, dailyRevenue] =
      await Promise.all([
        getHotelKPIs(hotel.id, startDate, endDate),
        getScreenKPIs(hotel.id, startDate, endDate),
        getOfferKPIs(hotel.id, startDate, endDate),
        getDailyRevenue(hotel.id, startDate, endDate),
      ]);

    logger.info("Exporting KPIs to CSV", { hotelId: hotel.id });

    // Build CSV sections
    const sections = [];

    // Overall KPIs
    sections.push("OVERALL METRICS");
    sections.push("Metric,Value");
    sections.push(`Total Scans,${overallKPIs.totalScans}`);
    sections.push(`Total Views,${overallKPIs.totalViews}`);
    sections.push(`Total Orders,${overallKPIs.totalOrders}`);
    sections.push(`Paid Orders,${overallKPIs.paidOrders}`);
    sections.push(
      `Total Revenue (RON),${(overallKPIs.totalRevenue / 100).toFixed(2)}`
    );
    sections.push(
      `Conversion Rate (%),${overallKPIs.conversionRate.toFixed(2)}`
    );
    sections.push(
      `Average Order Value (RON),${(overallKPIs.averageOrderValue / 100).toFixed(2)}`
    );
    sections.push("");

    // Screen KPIs
    sections.push("SCREEN PERFORMANCE");
    sections.push("Screen,QR Slug,Scans,Orders,Revenue (RON)");
    screenKPIs.forEach((screen) => {
      sections.push(
        [
          screen.screenName,
          screen.qrSlug,
          screen.scans,
          screen.orders,
          (screen.revenue / 100).toFixed(2),
        ]
          .map((field) => `"${String(field).replace(/"/g, '""')}"`)
          .join(",")
      );
    });
    sections.push("");

    // Offer KPIs
    sections.push("OFFER PERFORMANCE");
    sections.push(
      "Offer,Views,Orders,Paid Orders,Revenue (RON),Conversion Rate (%)"
    );
    offerKPIs.forEach((offer) => {
      sections.push(
        [
          offer.offerTitle,
          offer.views,
          offer.orders,
          offer.paidOrders,
          (offer.revenue / 100).toFixed(2),
          offer.conversionRate.toFixed(2),
        ]
          .map((field) => `"${String(field).replace(/"/g, '""')}"`)
          .join(",")
      );
    });
    sections.push("");

    // Daily Revenue
    sections.push("DAILY REVENUE");
    sections.push("Date,Orders,Revenue (RON)");
    dailyRevenue.forEach((day) => {
      sections.push(
        `${day.date},${day.orders},${(day.revenue / 100).toFixed(2)}`
      );
    });

    const csv = sections.join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="kpi-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    logger.error(
      "KPI CSV export error",
      error instanceof Error ? error : new Error(String(error))
    );
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
