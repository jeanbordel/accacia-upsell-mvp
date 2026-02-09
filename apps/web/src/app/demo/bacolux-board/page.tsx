"use client";

import { useState } from "react";
import Image from "next/image";
import QRCodeWithLogo from "@/components/QRCodeWithLogo";

interface HotelUnit {
  id: string;
  name: string;
  logoUrl: string;
  location: string;
  offers: number;
  qrCodes: number;
  monthlyRevenue: string;
}

const bacoluxUnits: HotelUnit[] = [
  {
    id: "1",
    name: "Koralio",
    logoUrl: "/logos/koralio.svg",
    location: "Mamaia, Romania",
    offers: 8,
    qrCodes: 12,
    monthlyRevenue: "€24,500",
  },
  {
    id: "2",
    name: "Bacolux Resort",
    logoUrl: "/logos/bacolux.svg",
    location: "Constanța, Romania",
    offers: 12,
    qrCodes: 18,
    monthlyRevenue: "€38,200",
  },
  {
    id: "3",
    name: "Bacolux Spa",
    logoUrl: "/logos/bacolux.svg",
    location: "Eforie Nord, Romania",
    offers: 6,
    qrCodes: 8,
    monthlyRevenue: "€15,800",
  },
  {
    id: "4",
    name: "Bacolux Business",
    logoUrl: "/logos/bacolux.svg",
    location: "București, Romania",
    offers: 10,
    qrCodes: 15,
    monthlyRevenue: "€31,400",
  },
  {
    id: "5",
    name: "Bacolux Mountain",
    logoUrl: "/logos/bacolux.svg",
    location: "Brașov, Romania",
    offers: 7,
    qrCodes: 10,
    monthlyRevenue: "€19,600",
  },
];

export default function BacoluxBoardDemo() {
  const [selectedHotel, setSelectedHotel] = useState<HotelUnit | null>(null);
  const [showQRDemo, setShowQRDemo] = useState(false);

  const totalRevenue = bacoluxUnits.reduce((sum, unit) => {
    const value = parseFloat(unit.monthlyRevenue.replace(/[€,]/g, ""));
    return sum + value;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-pink-950 to-slate-900 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold">Bacolux Hotels Group</h1>
            <p className="text-lg text-pink-200">
              Multi-Unit Management Dashboard
            </p>
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
            <Image
              src="/logos/bacolux.svg"
              alt="Bacolux Hotels"
              width={100}
              height={100}
              className="h-auto w-full"
            />
          </div>
        </div>

        {/* KPI Summary */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-2 text-sm text-pink-200">Total Units</div>
            <div className="text-3xl font-bold">{bacoluxUnits.length}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-2 text-sm text-pink-200">Active Offers</div>
            <div className="text-3xl font-bold">
              {bacoluxUnits.reduce((sum, u) => sum + u.offers, 0)}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-2 text-sm text-pink-200">QR Codes Deployed</div>
            <div className="text-3xl font-bold">
              {bacoluxUnits.reduce((sum, u) => sum + u.qrCodes, 0)}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-2 text-sm text-pink-200">Monthly Revenue</div>
            <div className="text-3xl font-bold">€{totalRevenue.toLocaleString()}</div>
          </div>
        </div>

        {/* Hotel Units Grid */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Hotel Units</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bacoluxUnits.map((unit) => (
              <div
                key={unit.id}
                className="group cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition hover:border-pink-500/50 hover:bg-white/10"
                onClick={() => {
                  setSelectedHotel(unit);
                  setShowQRDemo(false);
                }}
              >
                {/* Logo Header */}
                <div className="flex h-32 items-center justify-center bg-white p-4">
                  <Image
                    src={unit.logoUrl}
                    alt={unit.name}
                    width={100}
                    height={100}
                    className="max-h-24 w-auto object-contain"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="mb-1 text-xl font-bold">{unit.name}</h3>
                  <p className="mb-4 text-sm text-pink-200">{unit.location}</p>

                  <div className="grid grid-cols-3 gap-2 rounded-lg bg-black/20 p-3">
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Offers</div>
                      <div className="text-lg font-bold">{unit.offers}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400">QR Codes</div>
                      <div className="text-lg font-bold">{unit.qrCodes}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Revenue</div>
                      <div className="text-sm font-bold">{unit.monthlyRevenue}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Hotel Details */}
        {selectedHotel && (
          <div className="rounded-xl border border-pink-500/50 bg-white/10 p-8 backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white p-2">
                  <Image
                    src={selectedHotel.logoUrl}
                    alt={selectedHotel.name}
                    width={48}
                    height={48}
                    className="h-auto w-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{selectedHotel.name}</h3>
                  <p className="text-pink-200">{selectedHotel.location}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedHotel(null)}
                className="rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
              >
                Close
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Hotel Info */}
              <div className="rounded-lg border border-white/10 bg-black/20 p-6">
                <h4 className="mb-4 text-lg font-semibold">Unit Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Offers:</span>
                    <span className="font-bold">{selectedHotel.offers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">QR Codes:</span>
                    <span className="font-bold">{selectedHotel.qrCodes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Monthly Revenue:</span>
                    <span className="font-bold text-green-400">
                      {selectedHotel.monthlyRevenue}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment Provider:</span>
                    <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-medium">
                      Stripe
                    </span>
                  </div>
                </div>
              </div>

              {/* QR Code Demo */}
              <div className="rounded-lg border border-white/10 bg-black/20 p-6">
                <h4 className="mb-4 text-lg font-semibold">
                  Branded QR Code Preview
                </h4>
                {showQRDemo ? (
                  <div className="flex justify-center">
                    <QRCodeWithLogo
                      url={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/o/demo?hotel=${selectedHotel.id}`}
                      hotelName={selectedHotel.name}
                      logoUrl={selectedHotel.logoUrl}
                      size={200}
                    />
                  </div>
                ) : (
                  <div className="flex h-[200px] items-center justify-center">
                    <button
                      onClick={() => setShowQRDemo(true)}
                      className="rounded-lg bg-pink-600 px-6 py-3 font-semibold transition hover:bg-pink-700"
                    >
                      Generate QR Code with Logo
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sample Offers */}
            <div className="mt-6 rounded-lg border border-white/10 bg-black/20 p-6">
              <h4 className="mb-4 text-lg font-semibold">Sample Offers</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-white/5 bg-white/5 p-4">
                  <div className="mb-2 text-2xl">🍷</div>
                  <h5 className="mb-1 font-semibold">Spa Package</h5>
                  <p className="text-sm text-gray-400">€120</p>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/5 p-4">
                  <div className="mb-2 text-2xl">🛏️</div>
                  <h5 className="mb-1 font-semibold">Room Upgrade</h5>
                  <p className="text-sm text-gray-400">€89</p>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/5 p-4">
                  <div className="mb-2 text-2xl">🍽️</div>
                  <h5 className="mb-1 font-semibold">Dinner Experience</h5>
                  <p className="text-sm text-gray-400">€65</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-8 rounded-xl border border-pink-500/30 bg-pink-500/10 p-6 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="text-3xl">✨</div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">
                Multi-Hotel Branding System
              </h3>
              <p className="text-sm leading-relaxed text-pink-100">
                Each hotel unit maintains its own brand identity with custom logos
                displayed across QR codes, offer pages, and guest experiences. All
                units share the same payment infrastructure while maintaining
                complete brand independence. Click any hotel above to see its
                branded QR code and preview the guest experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
