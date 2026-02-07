export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      offer: { select: { title: true } },
      hotel: { select: { name: true } },
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Comenzi</h1>
        <a
          href="/api/admin/export/orders"
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm text-white hover:bg-sky-700"
          download
        >
          Export CSV
        </a>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">Nu există comenzi încă.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Ofertă</th>
                <th className="px-4 py-3">Hotel</th>
                <th className="px-4 py-3">Sumă</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Creat la</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">
                    {order.id.slice(0, 12)}…
                  </td>
                  <td className="px-4 py-3">
                    {order.offer?.title || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {order.hotel?.name || "—"}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {(order.amountCents / 100).toFixed(2)} {order.currency}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                        order.provider === "STRIPE"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {order.provider}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                        order.status === "PAID"
                          ? "bg-green-100 text-green-700"
                          : order.status === "FAILED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {order.createdAt.toLocaleString("ro-RO")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
