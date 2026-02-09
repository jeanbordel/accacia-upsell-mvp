import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

/**
 * GET /api/admin/export/orders?startDate=...&endDate=...
 * Export orders as CSV
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const startDateParam = url.searchParams.get("startDate");
    const endDateParam = url.searchParams.get("endDate");

    const whereClause: {
      createdAt?: { gte: Date; lte: Date };
    } = {};

    if (startDateParam && endDateParam) {
      whereClause.createdAt = {
        gte: new Date(startDateParam),
        lte: new Date(endDateParam),
      };
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      select: {
        id: true,
        createdAt: true,
        status: true,
        provider: true,
        providerRef: true,
        amountCents: true,
        currency: true,
        customerEmail: true,
        customerPhone: true,
        hotel: { select: { name: true } },
        screen: { select: { name: true } },
        offer: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    logger.info("Exporting orders to CSV", { count: orders.length });

    // Generate CSV
    const csvRows = [
      // Header
      "Order ID,Created At,Hotel,Screen,Offer,Status,Provider,Provider Ref,Amount (cents),Currency,Customer Email,Customer Phone",
    ];

    orders.forEach((order) => {
      csvRows.push(
        [
          order.id,
          order.createdAt.toISOString(),
          order.hotel.name,
          order.screen?.name || "",
          order.offer?.title || "",
          order.status,
          order.provider,
          order.providerRef || "",
          order.amountCents,
          order.currency,
          order.customerEmail || "",
          order.customerPhone || "",
        ]
          .map((field) => `"${String(field).replace(/"/g, '""')}"`)
          .join(",")
      );
    });

    const csv = csvRows.join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    logger.error(
      "CSV export error",
      error instanceof Error ? error : new Error(String(error))
    );
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
