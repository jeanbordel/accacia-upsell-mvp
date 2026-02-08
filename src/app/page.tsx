"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [showAdminHint, setShowAdminHint] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900">
      {/* Navigation */}
      <nav className="absolute top-0 z-10 w-full border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Image 
            src="/accacia-logo.svg" 
            alt="ACCACIA" 
            width={140} 
            height={40}
            priority
            className="h-auto w-32 brightness-0 invert"
          />
          <div className="flex items-center gap-4">
            <Link
              href="/client-login"
              className="rounded-lg bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Client Login
            </Link>
            <button
              onClick={() => setShowAdminHint(!showAdminHint)}
              className="text-xs text-gray-500 opacity-30 transition hover:opacity-100"
              title="Admin access"
            >
              ⚙
            </button>
          </div>
        </div>
        {showAdminHint && (
          <div className="absolute right-6 top-16 rounded-lg border border-white/10 bg-black/90 p-3 text-xs text-gray-400 backdrop-blur-sm">
            Admin? → <Link href="/admin-login" className="text-sky-400 underline">Click here</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pb-20 pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(56,189,248,0.1),transparent)]" />
        
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: Hero Content */}
            <div className="flex flex-col justify-center">
              <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-sm text-sky-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
                </span>
                Transforming Hotel Revenue
              </div>
              
              <h1 className="mb-6 text-5xl font-bold leading-tight text-white lg:text-6xl">
                Turn Every Guest Interaction Into
                <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent"> Revenue</span>
              </h1>
              
              <p className="mb-8 text-lg leading-relaxed text-gray-300">
                ACCACIA is the <strong>master of the upsell experience</strong>. Hotels keep their payment providers, we deliver the magic: QR-activated offers, instant bookings, and actionable insights.
              </p>

              <div className="mb-8 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/20">
                    <span className="text-2xl">🏨</span>
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-white">Your Payment Provider</h3>
                    <p className="text-sm text-gray-400">Connect Stripe, Netopia, or PayU. You control the money.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-white">Real-Time Analytics</h3>
                    <p className="text-sm text-gray-400">Track conversions, revenue, and guest behavior.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/20">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-white">Zero Setup Friction</h3>
                    <p className="text-sm text-gray-400">Place QR codes, create offers, go live in minutes.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/20">
                    <span className="text-2xl">💳</span>
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-white">Guest-Friendly UX</h3>
                    <p className="text-sm text-gray-400">Scan → Discover → Pay. Apple Pay & Google Pay ready.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/client-login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-sky-600/50 transition hover:shadow-sky-600/70"
                >
                  Get Started →
                </Link>
                <Link
                  href="/demo/bacolux-board"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
                >
                  See Demo
                </Link>
              </div>
            </div>

            {/* Right: Visual Demo */}
            <div className="relative flex items-center justify-center">
              <div className="relative">
                {/* Floating QR Card */}
                <div className="relative z-10 animate-float rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-xl shadow-2xl">
                  <div className="mb-4 text-center text-sm font-semibold text-gray-300">
                    Scan to unlock exclusive offers
                  </div>
                  <div className="rounded-xl bg-white p-6">
                    <div className="grid grid-cols-3 gap-2">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="aspect-square rounded bg-slate-900"></div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 text-center text-xs text-gray-400">
                    Bacolux Hotel • Lobby Display
                  </div>
                </div>
                
                {/* Background glow */}
                <div className="absolute inset-0 -z-10 animate-pulse bg-gradient-to-r from-sky-500/20 to-cyan-500/20 blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="demo" className="border-t border-white/10 bg-black/20 px-6 py-20 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">How It Works</h2>
            <p className="text-lg text-gray-400">Simple, fast, and revenue-focused</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-sm transition hover:border-sky-500/50">
              <div className="mb-4 text-5xl">1️⃣</div>
              <h3 className="mb-3 text-2xl font-bold text-white">Hotel Setup</h3>
              <p className="text-gray-400">
                Connect your Stripe/Netopia/PayU account. Create offers (spa packages, room upgrades, dining). Place QR codes around your property.
              </p>
              <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-sky-500/10 blur-2xl transition group-hover:bg-sky-500/20"></div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-sm transition hover:border-cyan-500/50">
              <div className="mb-4 text-5xl">2️⃣</div>
              <h3 className="mb-3 text-2xl font-bold text-white">Guest Scans</h3>
              <p className="text-gray-400">
                Guests scan QR codes with their phone. They see a beautiful offer landing page. No app download needed—just scan and go.
              </p>
              <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl transition group-hover:bg-cyan-500/20"></div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-sm transition hover:border-purple-500/50">
              <div className="mb-4 text-5xl">3️⃣</div>
              <h3 className="mb-3 text-2xl font-bold text-white">Instant Revenue</h3>
              <p className="text-gray-400">
                Payment goes directly to your account. ACCACIA tracks activations and provides KPI dashboards. You keep 100% control.
              </p>
              <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl transition group-hover:bg-purple-500/20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-12 backdrop-blur-sm">
            <div className="grid gap-8 text-center md:grid-cols-4">
              <div>
                <div className="mb-2 text-5xl font-bold text-sky-400">0%</div>
                <div className="text-sm text-gray-400">Commission Fee</div>
              </div>
              <div>
                <div className="mb-2 text-5xl font-bold text-cyan-400">100%</div>
                <div className="text-sm text-gray-400">Your Revenue</div>
              </div>
              <div>
                <div className="mb-2 text-5xl font-bold text-purple-400">&lt;2min</div>
                <div className="text-sm text-gray-400">Setup Time</div>
              </div>
              <div>
                <div className="mb-2 text-5xl font-bold text-green-400">24/7</div>
                <div className="text-sm text-gray-400">Automatic Upsells</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-white/10 bg-black/20 px-6 py-20 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold text-white lg:text-5xl">
            Ready to Maximize Your Hotel Revenue?
          </h2>
          <p className="mb-8 text-xl text-gray-300">
            Join hotels already using ACCACIA to turn every guest touchpoint into a revenue opportunity.
          </p>
          <Link
            href="/client-login"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 px-10 py-5 text-xl font-semibold text-white shadow-2xl shadow-sky-600/50 transition hover:shadow-sky-600/70"
          >
            Start Free Trial →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto max-w-7xl text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} ACCACIA. Master of the Experience. Hotels Keep the Money.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
