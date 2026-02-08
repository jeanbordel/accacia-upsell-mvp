export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import PaymentConfigForm from "./PaymentConfigForm";

export default async function PaymentsPage() {
  // Get all hotels
  const hotels = await prisma.hotel.findMany({
    orderBy: { name: "asc" },
    include: {
      paymentConfig: true,
    },
  });

  // For MVP, use the first hotel
  const selectedHotel = hotels[0];

  if (!selectedHotel) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Payment Integrations</h1>
        <p className="text-red-600">No hotels found. Please create a hotel first.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Integrations</h1>
        <p className="mt-2 text-sm text-gray-600">
          Configure payment providers for: <strong>{selectedHotel.name}</strong>
        </p>
        <p className="mt-1 text-xs text-amber-600">
          ⚠️ ACCACIA does NOT handle money. Each hotel connects its own payment provider.
        </p>
      </div>

      <PaymentConfigForm hotel={selectedHotel} config={selectedHotel.paymentConfig} />
    </div>
  );
}
