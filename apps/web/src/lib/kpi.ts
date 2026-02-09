/**
 * KPI aggregation helpers for ACCACIA Upsell
 * Provides business metrics for hotel management
 */

import { prisma } from "./prisma";

export interface KPIMetrics {
  totalScans: number;
  totalViews: number;
  totalOrders: number;
  paidOrders: number;
  totalRevenue: number; // in cents
  conversionRate: number; // scan → paid order %
  averageOrderValue: number; // in cents
}

export interface ScreenKPI {
  screenId: string;
  screenName: string;
  qrSlug: string;
  scans: number;
  orders: number;
  revenue: number;
}

export interface OfferKPI {
  offerId: string;
  offerTitle: string;
  views: number;
  orders: number;
  paidOrders: number;
  revenue: number;
  conversionRate: number;
}

export interface DailyRevenue {
  date: string; // ISO date string
  revenue: number;
  orders: number;
}

/**
 * Get overall KPIs for a hotel within a date range
 */
export async function getHotelKPIs(
  hotelId: string,
  startDate?: Date,
  endDate?: Date
): Promise<KPIMetrics> {
  const whereClause = {
    hotelId,
    ...(startDate && endDate
      ? { createdAt: { gte: startDate, lte: endDate } }
      : {}),
  };

  const [totalScans, totalViews, orders] = await Promise.all([
    prisma.event.count({
      where: { ...whereClause, type: "QR_SCAN" },
    }),
    prisma.event.count({
      where: { ...whereClause, type: "PAGE_VIEW" },
    }),
    prisma.order.findMany({
      where: whereClause,
      select: {
        status: true,
        amountCents: true,
      },
    }),
  ]);

  const totalOrders = orders.length;
  const paidOrders = orders.filter((o) => o.status === "PAID").length;
  const totalRevenue = orders
    .filter((o) => o.status === "PAID")
    .reduce((sum, o) => sum + o.amountCents, 0);

  const conversionRate =
    totalScans > 0 ? (paidOrders / totalScans) * 100 : 0;
  const averageOrderValue = paidOrders > 0 ? totalRevenue / paidOrders : 0;

  return {
    totalScans,
    totalViews,
    totalOrders,
    paidOrders,
    totalRevenue,
    conversionRate,
    averageOrderValue,
  };
}

/**
 * Get KPIs per screen (QR code performance)
 */
export async function getScreenKPIs(
  hotelId: string,
  startDate?: Date,
  endDate?: Date
): Promise<ScreenKPI[]> {
  const whereClause = {
    hotelId,
    ...(startDate && endDate
      ? { createdAt: { gte: startDate, lte: endDate } }
      : {}),
  };

  const screens = await prisma.screen.findMany({
    where: { hotelId },
    include: {
      _count: {
        select: {
          orders: {
            where: whereClause,
          },
        },
      },
      orders: {
        where: {
          ...whereClause,
          status: "PAID",
        },
        select: {
          amountCents: true,
        },
      },
    },
  });

  const scansPerScreen = await Promise.all(
    screens.map(async (screen) => {
      const scans = await prisma.event.count({
        where: {
          ...whereClause,
          screenId: screen.id,
          type: "QR_SCAN",
        },
      });
      return { screenId: screen.id, scans };
    })
  );

  return screens.map((screen) => {
    const scanData = scansPerScreen.find((s) => s.screenId === screen.id);
    const revenue = screen.orders.reduce((sum, o) => sum + o.amountCents, 0);

    return {
      screenId: screen.id,
      screenName: screen.name,
      qrSlug: screen.qrSlug,
      scans: scanData?.scans || 0,
      orders: screen._count.orders,
      revenue,
    };
  });
}

/**
 * Get KPIs per offer (product performance)
 */
export async function getOfferKPIs(
  hotelId: string,
  startDate?: Date,
  endDate?: Date
): Promise<OfferKPI[]> {
  const whereClause = {
    hotelId,
    ...(startDate && endDate
      ? { createdAt: { gte: startDate, lte: endDate } }
      : {}),
  };

  const offers = await prisma.offer.findMany({
    where: { hotelId },
    include: {
      _count: {
        select: {
          orders: {
            where: whereClause,
          },
        },
      },
      orders: {
        where: whereClause,
        select: {
          status: true,
          amountCents: true,
        },
      },
    },
  });

  const viewsPerOffer = await Promise.all(
    offers.map(async (offer) => {
      const views = await prisma.event.count({
        where: {
          ...whereClause,
          offerId: offer.id,
          type: "PAGE_VIEW",
        },
      });
      return { offerId: offer.id, views };
    })
  );

  return offers.map((offer) => {
    const viewData = viewsPerOffer.find((v) => v.offerId === offer.id);
    const paidOrders = offer.orders.filter((o) => o.status === "PAID");
    const revenue = paidOrders.reduce((sum, o) => sum + o.amountCents, 0);
    const views = viewData?.views || 0;
    const conversionRate = views > 0 ? (paidOrders.length / views) * 100 : 0;

    return {
      offerId: offer.id,
      offerTitle: offer.title,
      views,
      orders: offer._count.orders,
      paidOrders: paidOrders.length,
      revenue,
      conversionRate,
    };
  });
}

/**
 * Get daily revenue breakdown
 */
export async function getDailyRevenue(
  hotelId: string,
  startDate: Date,
  endDate: Date
): Promise<DailyRevenue[]> {
  const orders = await prisma.order.findMany({
    where: {
      hotelId,
      status: "PAID",
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      amountCents: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Group by date
  const dailyMap = new Map<string, { revenue: number; count: number }>();

  orders.forEach((order) => {
    const date = order.createdAt.toISOString().split("T")[0];
    const existing = dailyMap.get(date) || { revenue: 0, count: 0 };
    dailyMap.set(date, {
      revenue: existing.revenue + order.amountCents,
      count: existing.count + 1,
    });
  });

  return Array.from(dailyMap.entries())
    .map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orders: data.count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
