export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Image from "next/image";

async function updateHotelLogo(formData: FormData) {
  "use server";
  // This is handled by the API route
}

export default async function HotelsPage() {
  const hotels = await prisma.hotel.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { 
        select: { 
          offers: true,
          orders: true,
          screens: true
        } 
      },
      paymentConfig: {
        select: {
          defaultPsp: true,
          stripeEnabled: true,
          netopiaEnabled: true,
          payuEnabled: true,
        }
      }
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Hotels / Units Management</h1>
        <p className="text-sm text-gray-500">Manage multiple hotel units and their branding</p>
      </div>

      {hotels.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <p className="text-gray-500">No hotels yet. Create your first hotel unit.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md"
            >
              {/* Logo Section */}
              <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100">
                {hotel.logoUrl ? (
                  <div className="flex h-full items-center justify-center p-4">
                    <Image
                      src={hotel.logoUrl}
                      alt={`${hotel.name} logo`}
                      width={120}
                      height={120}
                      className="max-h-28 w-auto object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="mb-2 text-4xl">🏨</div>
                      <p className="text-xs text-gray-400">No logo</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Hotel Info */}
              <div className="p-4">
                <h3 className="mb-3 text-lg font-bold text-gray-900">
                  {hotel.name}
                </h3>

                {/* Stats Grid */}
                <div className="mb-4 grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-3">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Offers</div>
                    <div className="text-lg font-bold text-gray-900">
                      {hotel._count.offers}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Orders</div>
                    <div className="text-lg font-bold text-gray-900">
                      {hotel._count.orders}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">QR Codes</div>
                    <div className="text-lg font-bold text-gray-900">
                      {hotel._count.screens}
                    </div>
                  </div>
                </div>

                {/* Payment Status */}
                {hotel.paymentConfig ? (
                  <div className="mb-4">
                    <div className="mb-1 text-xs font-medium text-gray-500">
                      Payment Providers
                    </div>
                    <div className="flex gap-2">
                      {hotel.paymentConfig.stripeEnabled && (
                        <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                          Stripe
                        </span>
                      )}
                      {hotel.paymentConfig.netopiaEnabled && (
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                          Netopia
                        </span>
                      )}
                      {hotel.paymentConfig.payuEnabled && (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                          PayU
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 rounded-lg bg-yellow-50 p-2">
                    <p className="text-xs text-yellow-800">
                      ⚠️ No payment provider configured
                    </p>
                  </div>
                )}

                {/* Logo Upload Section */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-700">
                    Hotel Logo
                    <span className="ml-1 text-gray-400">(SVG, PNG, max 2MB)</span>
                  </label>
                  
                  <form
                    id={`logo-form-${hotel.id}`}
                    className="flex gap-2"
                  >
                    <input
                      type="file"
                      name="logo"
                      accept=".svg,.png,.jpg,.jpeg,.webp"
                      className="block w-full rounded-md border border-gray-300 px-2 py-1 text-xs file:mr-2 file:rounded file:border-0 file:bg-gray-100 file:px-2 file:py-1 file:text-xs file:font-medium hover:file:bg-gray-200"
                      onChange={async (e) => {
                        const form = e.currentTarget.form;
                        if (!form) return;
                        
                        const formData = new FormData(form);
                        const file = formData.get("logo") as File;
                        
                        if (!file || file.size === 0) return;

                        try {
                          const response = await fetch(
                            `/api/admin/hotels/${hotel.id}/logo`,
                            {
                              method: "POST",
                              body: formData,
                            }
                          );

                          if (response.ok) {
                            window.location.reload();
                          } else {
                            const error = await response.json();
                            alert(error.error || "Failed to upload logo");
                          }
                        } catch (error) {
                          console.error("Upload error:", error);
                          alert("Failed to upload logo");
                        }
                      }}
                    />
                  </form>

                  {hotel.logoUrl && (
                    <button
                      onClick={async () => {
                        if (!confirm("Remove logo?")) return;

                        try {
                          const response = await fetch(
                            `/api/admin/hotels/${hotel.id}/logo`,
                            { method: "DELETE" }
                          );

                          if (response.ok) {
                            window.location.reload();
                          } else {
                            alert("Failed to remove logo");
                          }
                        } catch (error) {
                          console.error("Delete error:", error);
                          alert("Failed to remove logo");
                        }
                      }}
                      className="text-xs text-red-600 hover:text-red-700 hover:underline"
                    >
                      Remove logo
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Logo Requirements Info */}
      <div className="mt-8 rounded-lg border border-blue-100 bg-blue-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-blue-900">
          📋 Logo Upload Requirements
        </h3>
        <ul className="space-y-1 text-xs text-blue-800">
          <li>• <strong>Formats:</strong> SVG (recommended), PNG, JPEG, WebP</li>
          <li>• <strong>Maximum size:</strong> 2MB</li>
          <li>• <strong>Minimum dimensions:</strong> 200x200px</li>
          <li>• <strong>Recommended:</strong> Square format with transparent background</li>
          <li>• <strong>Usage:</strong> Logo appears in QR codes, offer pages, and guest experience</li>
        </ul>
      </div>
    </div>
  );
}
