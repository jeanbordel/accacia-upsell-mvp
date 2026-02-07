import { prisma } from "@/lib/prisma";
import {
  getHotelKPIs,
  getScreenKPIs,
  getOfferKPIs,
  getDailyRevenue,
} from "@/lib/kpi";

export default async function AdminKPIPage() {
  // For MVP, get KPIs for the first hotel (Bacolux)
  const hotel = await prisma.hotel.findFirst();

  if (!hotel) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">KPIs & Analytics</h1>
        <p className="text-gray-600">No hotel data found.</p>
      </div>
    );
  }

  // Default: Last 30 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const [overallKPIs, screenKPIs, offerKPIs, dailyRevenue] = await Promise.all([
    getHotelKPIs(hotel.id, startDate, endDate),
    getScreenKPIs(hotel.id, startDate, endDate),
    getOfferKPIs(hotel.id, startDate, endDate),
    getDailyRevenue(hotel.id, startDate, endDate),
  ]);

  const formatCurrency = (cents: number) => {
    return `${(cents / 100).toFixed(2)} RON`;
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">KPIs & Analytics</h1>
          <p className="text-gray-600">
            {hotel.name} • Last 30 days
          </p>
        </div>
        <a
          href="/api/admin/export/kpi"
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm text-white hover:bg-sky-700"
          download
        >
          Export CSV
        </a>
      </div>

      {/* Overall Metrics */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Overall Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">QR Scans</div>
            <div className="text-2xl font-bold">{overallKPIs.totalScans}</div>
          </div>
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Page Views</div>
            <div className="text-2xl font-bold">{overallKPIs.totalViews}</div>
          </div>
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Total Orders</div>
            <div className="text-2xl font-bold">{overallKPIs.totalOrders}</div>
          </div>
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Paid Orders</div>
            <div className="text-2xl font-bold text-green-600">
              {overallKPIs.paidOrders}
            </div>
          </div>
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(overallKPIs.totalRevenue)}
            </div>
          </div>
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Conversion Rate</div>
            <div className="text-2xl font-bold">
              {formatPercent(overallKPIs.conversionRate)}
            </div>
          </div>
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Avg Order Value</div>
            <div className="text-2xl font-bold">
              {formatCurrency(overallKPIs.averageOrderValue)}
            </div>
          </div>
        </div>
      </section>

      {/* Screen Performance */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">QR Code Performance</h2>
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Screen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  QR Slug
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                  Scans
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                  Orders
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-gray-700">
              {screenKPIs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No screen data
                  </td>
                </tr>
              ) : (
                screenKPIs.map((screen) => (
                  <tr key={screen.screenId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {screen.screenName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      {screen.qrSlug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {screen.scans}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {screen.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-semibold">
                      {formatCurrency(screen.revenue)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Offer Performance */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Offer Performance</h2>
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Offer
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                  Views
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                  Orders
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                  Paid
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                  Revenue
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                  Conv. Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-gray-700">
              {offerKPIs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No offer data
                  </td>
                </tr>
              ) : (
                offerKPIs.map((offer) => (
                  <tr key={offer.offerId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {offer.offerTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {offer.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {offer.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-green-600 font-semibold">
                      {offer.paidOrders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-semibold">
                      {formatCurrency(offer.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {formatPercent(offer.conversionRate)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Daily Revenue */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Daily Revenue (Last 30 Days)</h2>
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                  Orders
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-gray-700">
              {dailyRevenue.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    No revenue data
                  </td>
                </tr>
              ) : (
                dailyRevenue.map((day) => (
                  <tr key={day.date}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(day.date).toLocaleDateString("ro-RO", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {day.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-green-600">
                      {formatCurrency(day.revenue)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
