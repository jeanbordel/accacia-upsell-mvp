import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ s?: string }>;
}

export default async function OfferPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { s: screenSlug } = await searchParams;

  let offer;
  let hotel;

  if (slug === "default") {
    // Resolve active offer based on screen
    if (!screenSlug) {
      notFound();
    }
    const screen = await prisma.screen.findUnique({
      where: { qrSlug: screenSlug },
      include: { hotel: true },
    });
    if (!screen) notFound();

    hotel = screen.hotel;

    offer = await prisma.offer.findFirst({
      where: { hotelId: screen.hotelId, isActive: true },
      orderBy: { createdAt: "desc" },
    });
  } else {
    // slug is an offerId
    offer = await prisma.offer.findUnique({
      where: { id: slug },
      include: { hotel: true },
    });
    
    if (offer) {
      hotel = offer.hotel;
    }
  }

  if (!offer || !hotel) notFound();

  // Resolve screen for event logging
  let screenId: string | undefined;
  if (screenSlug) {
    const screen = await prisma.screen.findUnique({
      where: { qrSlug: screenSlug },
    });
    screenId = screen?.id;
  }

  // Log PAGE_VIEW event
  await prisma.event.create({
    data: {
      hotelId: offer.hotelId,
      screenId: screenId || undefined,
      offerId: offer.id,
      type: "PAGE_VIEW",
    },
  });

  const priceFormatted = (offer.priceCents / 100).toFixed(2);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-50 to-white">
      <main className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        {/* Hotel Branding */}
        <div className="mb-6 flex flex-col items-center gap-3">
          {hotel.logoUrl ? (
            <Image 
              src={hotel.logoUrl} 
              alt={hotel.name}
              width={120}
              height={120}
              className="max-h-20 w-auto object-contain"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-cyan-100">
              <span className="text-3xl">🏨</span>
            </div>
          )}
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-700">{hotel.name}</div>
            <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
              <span>Powered by</span>
              <Image 
                src="/accacia-logo.svg" 
                alt="ACCACIA" 
                width={60}
                height={20}
                className="opacity-60"
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6 text-center">
          <span className="inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
            Ofertă specială
          </span>
        </div>

        <h1 className="mb-4 text-center text-2xl font-bold text-gray-900">
          {offer.title}
        </h1>

        {offer.description && (
          <p className="mb-6 text-center text-gray-600">{offer.description}</p>
        )}

        <div className="mb-8 text-center">
          <span className="text-4xl font-extrabold text-sky-600">
            {priceFormatted}
          </span>
          <span className="ml-1 text-lg font-medium text-gray-500">
            {offer.currency}
          </span>
        </div>

        <div className="space-y-3">
          {/* Stripe checkout */}
          <form action="/api/checkout" method="POST">
            <input type="hidden" name="offerId" value={offer.id} />
            {screenSlug && (
              <input type="hidden" name="screenSlug" value={screenSlug} />
            )}
            <button
              type="submit"
              className="w-full rounded-xl bg-sky-600 py-3 text-lg font-semibold text-white transition hover:bg-sky-700 active:bg-sky-800"
            >
              Plătește cu cardul
            </button>
          </form>

          {/* Netopia checkout */}
          <form action="/api/netopia/create" method="POST">
            <input type="hidden" name="offerId" value={offer.id} />
            {screenSlug && (
              <input type="hidden" name="screenSlug" value={screenSlug} />
            )}
            <button
              type="submit"
              className="w-full rounded-xl border-2 border-sky-600 bg-white py-3 text-lg font-semibold text-sky-600 transition hover:bg-sky-50 active:bg-sky-100"
            >
              Plătește prin Netopia
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Plată securizată • Monedă: {offer.currency}
        </p>
      </main>
    </div>
  );
}
