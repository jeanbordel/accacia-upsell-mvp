export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function toggleOffer(formData: FormData) {
  "use server";
  const offerId = formData.get("offerId") as string;
  const currentlyActive = formData.get("isActive") === "true";

  await prisma.offer.update({
    where: { id: offerId },
    data: { isActive: !currentlyActive },
  });

  revalidatePath("/admin/offers");
}

export default async function OffersPage() {
  const offers = await prisma.offer.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      hotel: { select: { name: true } },
      _count: { select: { orders: true } },
    },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Oferte</h1>

      {offers.length === 0 ? (
        <p className="text-gray-500">Nu există oferte încă.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Titlu</th>
                <th className="px-4 py-3">Hotel</th>
                <th className="px-4 py-3">Preț</th>
                <th className="px-4 py-3">Comenzi</th>
                <th className="px-4 py-3">Activă</th>
                <th className="px-4 py-3">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {offers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{offer.title}</td>
                  <td className="px-4 py-3">{offer.hotel?.name || "—"}</td>
                  <td className="px-4 py-3">
                    {(offer.priceCents / 100).toFixed(2)} {offer.currency}
                  </td>
                  <td className="px-4 py-3">{offer._count.orders}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                        offer.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {offer.isActive ? "Da" : "Nu"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleOffer}>
                      <input
                        type="hidden"
                        name="offerId"
                        value={offer.id}
                      />
                      <input
                        type="hidden"
                        name="isActive"
                        value={String(offer.isActive)}
                      />
                      <button
                        type="submit"
                        className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                          offer.isActive
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                      >
                        {offer.isActive ? "Dezactivează" : "Activează"}
                      </button>
                    </form>
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
