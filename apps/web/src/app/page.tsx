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
                Digital Signage Meets Smart Revenue
              </div>
              
              <h1 className="mb-6 text-5xl font-bold leading-tight text-white lg:text-6xl">
                Transform Hotel Screens Into
                <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent"> Revenue Engines</span>
              </h1>
              
              <p className="mb-8 text-lg leading-relaxed text-gray-300">
                Complete <strong>digital signage platform</strong> with QR-powered upsells. We deliver the screens, you push offers. Guests scan, book extras, revenue flows to your account.
              </p>

              <div className="mb-8 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/20">
                    <span className="text-2xl">📺</span>
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-white">Screens Included</h3>
                    <p className="text-sm text-gray-400">We deliver digital signage adapted to your hotel size & needs</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-white">Custom Layouts</h3>
                    <p className="text-sm text-gray-400">Multiple screen types & content layouts for every location</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/20">
                    <span className="text-2xl">☁️</span>
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-white">Cloud Management</h3>
                    <p className="text-sm text-gray-400">Push messages, offers & bundles to all screens instantly</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/20">
                    <span className="text-2xl">💳</span>
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-white">Your Payment Gateway</h3>
                    <p className="text-sm text-gray-400">Stripe, Netopia, PayU — you keep 100% control & revenue</p>
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
                <a
                  href="#signage"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
                >
                  View Signage Options
                </a>
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

      {/* Digital Signage Showcase Section */}
      <section id="signage" className="border-t border-white/10 bg-black/30 px-6 py-24 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
              Professional Digital Signage
              <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent"> Included</span>
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-300">
              We deliver and install premium screens tailored to your hotel layout. From lobby displays to elevator screens, every touchpoint becomes a revenue opportunity.
            </p>
          </div>

          {/* Screen Types Grid */}
          <div className="mb-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Totem Digital SLIM */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm transition hover:border-sky-500/50">
              <div className="relative h-64 overflow-hidden bg-slate-900">
                <Image
                  src="/products/totem-digital-slim.jpg"
                  alt="Totem Digital SLIM Display"
                  fill
                  className="object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute bottom-2 right-2 rounded bg-black/70 px-3 py-1 text-sm text-gray-300 backdrop-blur-sm">
                  32"-65" Slim
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-white">Totem Digital SLIM</h3>
                <p className="mb-4 text-sm text-gray-400">
                  Ultra-slim profile (2.5cm depth) standing totems. Available 32"-65", portrait or landscape. White elegant design, touch-enabled. Perfect for hotel lobbies, boutiques, and reception areas.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs text-sky-300">2.5cm Ultra-Slim</span>
                  <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300">Touch Screen</span>
                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-300">Elegant White</span>
                </div>
              </div>
            </div>

            {/* Totem Digital Rotativ */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm transition hover:border-cyan-500/50">
              <div className="relative h-64 overflow-hidden bg-slate-900">
                <Image
                  src="/products/totem-digital-cu-ecran-rotativ.jpg"
                  alt="Totem Digital cu Ecran Rotativ"
                  fill
                  className="object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute bottom-2 right-2 rounded bg-black/70 px-3 py-1 text-sm text-gray-300 backdrop-blur-sm">
                  Rotating Screen
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-white">Totem Digital Rotativ</h3>
                <p className="mb-4 text-sm text-gray-400">
                  360° rotating displays with adjustable viewing angles. Switch between portrait and landscape modes. Touch-enabled, height-adjustable stand. Perfect for interactive presentations and wayfinding.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300">360° Rotation</span>
                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-300">Height Adjustable</span>
                  <span className="rounded-full bg-pink-500/20 px-3 py-1 text-xs text-pink-300">Touch Interactive</span>
                </div>
              </div>
            </div>

            {/* Poster Digital */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm transition hover:border-purple-500/50">
              <div className="relative h-64 overflow-hidden bg-slate-900">
                <Image
                  src="/products/poster-digital.jpg"
                  alt="Poster Digital Ultra-Slim"
                  fill
                  className="object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute bottom-2 right-2 rounded bg-black/70 px-3 py-1 text-sm text-gray-300 backdrop-blur-sm">
                  Ultra-Slim Poster
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-white">Poster Digital</h3>
                <p className="mb-4 text-sm text-gray-400">
                  Ultra-thin wall-mounted digital posters (15"-32"). Frameless design, 700+ nits brightness. Portrait orientation. Ideal for elevators, hallways, spa corridors, and room entrances.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-300">Ultra-Thin</span>
                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-300">Wall/Ceiling Mount</span>
                  <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs text-orange-300">Portrait</span>
                </div>
              </div>
            </div>

            {/* Totem Digital Dublu */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm transition hover:border-green-500/50">
              <div className="relative h-64 overflow-hidden bg-slate-900">
                <Image
                  src="/products/totem-digital-portabil-cu-ecran-rotativ.jpg"
                  alt="Totem Digital Portabil cu Rotile"
                  fill
                  className="object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute bottom-2 right-2 rounded bg-black/70 px-3 py-1 text-sm text-gray-300 backdrop-blur-sm">
                  Dual Display
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-white">Totem Portabil cu Rotile</h3>
                <p className="mb-4 text-sm text-gray-400">
                  Portable displays with integrated wheels. Easy repositioning, foldable stand (60° angle). 43" displays, 60x175cm dimensions. Perfect for events, conferences, and temporary installations.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-300">Mobile & Portable</span>
                  <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs text-sky-300">Integrated Wheels</span>
                  <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-300">Foldable Stand</span>
                </div>
              </div>
            </div>

            {/* Indoor Wall Mounted (10-110") */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm transition hover:border-orange-500/50">
              <div className="relative h-64 overflow-hidden bg-slate-900">
                <Image
                  src="/products/totem-digital-signage-de-interior.jpg"
                  alt="Totem Digital Signage de Interior"
                  fill
                  className="object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute bottom-2 right-2 rounded bg-black/70 px-3 py-1 text-sm text-gray-300 backdrop-blur-sm">
                  10" - 110" Range
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-white">Large Format Displays</h3>
                <p className="mb-4 text-sm text-gray-400">
                  Flexible wall-mounted displays (10"-110") for any space. Ultra-wide options for conference rooms, video walls, and immersive experiences.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs text-orange-300">10"-110"</span>
                  <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-300">Video Wall Ready</span>
                </div>
              </div>
            </div>

            {/* Interactive Touch Kiosks */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm transition hover:border-pink-500/50">
              <div className="relative h-64 overflow-hidden bg-slate-900">
                <Image
                  src="/products/oglinda-digitala-pentru-fitness.jpg"
                  alt="Oglindă Digitală pentru Fitness"
                  fill
                  className="object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute bottom-2 right-2 rounded bg-black/70 px-3 py-1 text-sm text-gray-300 backdrop-blur-sm">
                  PCAP/IR Touch
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-white">Smart Mirror Fitness Displays</h3>
                <p className="mb-4 text-sm text-gray-400">
                  Interactive mirror displays with body tracking technology. Perfect for hotel gyms and spa areas. Live fitness classes, wellness programs, and health monitoring. Elegant frameless mirror design.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-pink-500/20 px-3 py-1 text-xs text-pink-300">Body Tracking</span>
                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-300">Interactive Mirror</span>
                  <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300">Fitness Apps</span>
                </div>
              </div>
            </div>

            {/* Outdoor Weatherproof */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm transition hover:border-yellow-500/50">
              <div className="relative h-64 overflow-hidden bg-slate-900">
                <Image
                  src="/products/poster-digital-pentru-exterior.jpg"
                  alt="Totem Digital pentru Exterior - Weatherproof"
                  fill
                  className="object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute bottom-2 right-2 rounded bg-black/70 px-3 py-1 text-sm text-gray-300 backdrop-blur-sm">
                  1000+ Nits
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-white">Totemuri Exterioare Weatherproof</h3>
                <p className="mb-4 text-sm text-gray-400">
                  High-brightness displays (1500+ nits), IP65 weatherproof housing. Direct sunlight readable. Robust metal construction. Perfect for hotel terraces, pool areas, outdoor patios, and entrance signage.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-300">IP65 Weatherproof</span>
                  <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs text-orange-300">1500+ Nits</span>
                  <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-300">Anti-Glare</span>
                </div>
              </div>
            </div>

            {/* Conference Displays */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm transition hover:border-blue-500/50">
              <div className="relative h-64 overflow-hidden bg-slate-900">
                <Image
                  src="/products/totem-digital-dublu-de-interior-75-inch.jpg"
                  alt="Kiosk Premium cu Rame Albe"
                  fill
                  className="object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute bottom-2 right-2 rounded bg-black/70 px-3 py-1 text-sm text-gray-300 backdrop-blur-sm">
                  4K UHD
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-white">Kiosk-uri Premium cu Rame Albe</h3>
                <p className="mb-4 text-sm text-gray-400">
                  Elegant white-framed dual-display kiosks. Modern minimalist design for upscale hotels, boutiques, and shopping malls. Portrait/landscape rotation, touch-enabled, premium finish with integrated base.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300">Premium Design</span>
                  <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-300">White Frame</span>
                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-300">Dual Display</span>
                </div>
              </div>
            </div>

            {/* Elevator Compact */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm transition hover:border-teal-500/50">
              <div className="relative h-64 overflow-hidden bg-slate-900">
                <Image
                  src="/products/totem-digital-slim-2.jpg"
                  alt="Poster Digital pentru Ascensor"
                  fill
                  className="object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute bottom-2 right-2 rounded bg-black/70 px-3 py-1 text-sm text-gray-300 backdrop-blur-sm">
                  15"-32" Vertical
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-white">Elevator Displays</h3>
                <p className="mb-4 text-sm text-gray-400">
                  Compact vertical displays (15"-32") for elevators. Portrait orientation, loop content playback. Captive audience marketing.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-teal-500/20 px-3 py-1 text-xs text-teal-300">Portrait</span>
                  <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300">Auto-Loop</span>
                </div>
              </div>
            </div>
          </div>

          {/* Layout Options */}
          <div className="mb-12 text-center">
            <h3 className="mb-4 text-3xl font-bold text-white">Flexible Content Layouts</h3>
            <p className="mx-auto max-w-2xl text-gray-300">
              Choose from pre-designed templates or create custom layouts. All optimized for QR visibility and conversion.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-4 aspect-video rounded-lg bg-gradient-to-br from-sky-900/50 to-slate-900/50 p-4">
                <div className="mb-2 h-1/2 rounded border border-dashed border-white/30"></div>
                <div className="h-1/3 rounded border border-dashed border-white/30"></div>
              </div>
              <h4 className="mb-2 font-semibold text-white">Single Offer</h4>
              <p className="text-sm text-gray-400">Full-screen hero image with large QR code. Best for premium upsells.</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-4 aspect-video rounded-lg bg-gradient-to-br from-cyan-900/50 to-slate-900/50 p-4">
                <div className="mb-2 grid h-2/3 grid-cols-2 gap-2">
                  <div className="rounded border border-dashed border-white/30"></div>
                  <div className="rounded border border-dashed border-white/30"></div>
                </div>
                <div className="h-1/4 rounded border border-dashed border-white/30"></div>
              </div>
              <h4 className="mb-2 font-semibold text-white">Multi-Offer Grid</h4>
              <p className="text-sm text-gray-400">2-4 offers with separate QR codes. Maximize screen real estate.</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-4 aspect-video rounded-lg bg-gradient-to-br from-purple-900/50 to-slate-900/50 p-4">
                <div className="mb-2 h-1/3 rounded border border-dashed border-white/30"></div>
                <div className="h-1/2 rounded border border-dashed border-white/30"></div>
              </div>
              <h4 className="mb-2 font-semibold text-white">Video + QR</h4>
              <p className="text-sm text-gray-400">Loop promotional video with persistent QR overlay. High engagement.</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-4 aspect-video rounded-lg bg-gradient-to-br from-green-900/50 to-slate-900/50 p-4">
                <div className="mb-2 grid h-3/4 grid-cols-3 gap-1">
                  <div className="rounded border border-dashed border-white/30"></div>
                  <div className="rounded border border-dashed border-white/30"></div>
                  <div className="rounded border border-dashed border-white/30"></div>
                </div>
                <div className="h-1/5 rounded border border-dashed border-white/30"></div>
              </div>
              <h4 className="mb-2 font-semibold text-white">Carousel Mode</h4>
              <p className="text-sm text-gray-400">Auto-rotate through multiple offers. Keeps content fresh & dynamic.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="demo" className="border-t border-white/10 bg-black/20 px-6 py-20 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">How It Works</h2>
            <p className="text-lg text-gray-400">From setup to revenue in three simple steps</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-sm transition hover:border-sky-500/50">
              <div className="mb-4 text-5xl">1️⃣</div>
              <h3 className="mb-3 text-2xl font-bold text-white">We Install Screens</h3>
              <p className="text-gray-400">
                Select screen types & locations. We deliver, install, and configure all digital signage hardware. Connect your payment gateway (Stripe/Netopia/PayU).
              </p>
              <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-sky-500/10 blur-2xl transition group-hover:bg-sky-500/20"></div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-sm transition hover:border-cyan-500/50">
              <div className="mb-4 text-5xl">2️⃣</div>
              <h3 className="mb-3 text-2xl font-bold text-white">You Push Offers</h3>
              <p className="text-gray-400">
                Use the cloud dashboard to create offers, choose layouts, schedule content. Push messages & bundles to specific screens or all locations instantly.
              </p>
              <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl transition group-hover:bg-cyan-500/20"></div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-sm transition hover:border-purple-500/50">
              <div className="mb-4 text-5xl">3️⃣</div>
              <h3 className="mb-3 text-2xl font-bold text-white">Guests Scan & Book</h3>
              <p className="text-gray-400">
                Guests scan QR codes, enter 4-digit room number, book extras. Payment flows to your account. You track all revenue & conversions in real-time.
              </p>
              <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl transition group-hover:bg-purple-500/20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Features */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">Subscription Platform Includes</h2>
            <p className="text-lg text-gray-400">Everything you need to maximize upsell revenue</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 backdrop-blur-sm">
              <div className="mb-3 text-3xl">☁️</div>
              <h3 className="mb-2 text-xl font-semibold text-white">Cloud CMS</h3>
              <p className="text-gray-400">Manage all screens from one dashboard. Push content updates in seconds.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 backdrop-blur-sm">
              <div className="mb-3 text-3xl">📱</div>
              <h3 className="mb-2 text-xl font-semibold text-white">QR Generation</h3>
              <p className="text-gray-400">Auto-generate unique QR codes for each offer. Track scans per location.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 backdrop-blur-sm">
              <div className="mb-3 text-3xl">🎨</div>
              <h3 className="mb-2 text-xl font-semibold text-white">Template Library</h3>
              <p className="text-gray-400">Pre-designed layouts for all screen types. Customize colors & branding.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 backdrop-blur-sm">
              <div className="mb-3 text-3xl">🔑</div>
              <h3 className="mb-2 text-xl font-semibold text-white">Room Verification</h3>
              <p className="text-gray-400">Guests enter 4-digit room codes to activate offers. Prevents fraud.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 backdrop-blur-sm">
              <div className="mb-3 text-3xl">📊</div>
              <h3 className="mb-2 text-xl font-semibold text-white">Analytics Dashboard</h3>
              <p className="text-gray-400">Real-time KPIs: scans, conversions, revenue per screen & offer type.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 backdrop-blur-sm">
              <div className="mb-3 text-3xl">🔄</div>
              <h3 className="mb-2 text-xl font-semibold text-white">Content Scheduling</h3>
              <p className="text-gray-400">Schedule offers by time, date, season. Auto-switch breakfast/lunch/dinner.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 backdrop-blur-sm">
              <div className="mb-3 text-3xl">💳</div>
              <h3 className="mb-2 text-xl font-semibold text-white">Multi-Gateway Support</h3>
              <p className="text-gray-400">Stripe, Netopia, PayU — you choose. Payments go directly to your account.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 backdrop-blur-sm">
              <div className="mb-3 text-3xl">🎬</div>
              <h3 className="mb-2 text-xl font-semibold text-white">Video Support</h3>
              <p className="text-gray-400">Upload promotional videos. Loop content with QR overlays.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 backdrop-blur-sm">
              <div className="mb-3 text-3xl">📦</div>
              <h3 className="mb-2 text-xl font-semibold text-white">Bundle Builder</h3>
              <p className="text-gray-400">Create package deals: spa + dinner, room upgrade + late checkout.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-white/10 bg-black/20 px-6 py-20 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-12 backdrop-blur-sm">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-bold text-white">Why Hotels Choose ACCACIA</h2>
            </div>
            <div className="grid gap-8 text-center md:grid-cols-4">
              <div>
                <div className="mb-2 text-5xl font-bold text-sky-400">0%</div>
                <div className="text-sm text-gray-400">Commission Fee</div>
                <div className="mt-1 text-xs text-gray-500">We charge subscription, not per transaction</div>
              </div>
              <div>
                <div className="mb-2 text-5xl font-bold text-cyan-400">100%</div>
                <div className="text-sm text-gray-400">Your Revenue</div>
                <div className="mt-1 text-xs text-gray-500">Direct to your payment gateway</div>
              </div>
              <div>
                <div className="mb-2 text-5xl font-bold text-purple-400">&lt;1wk</div>
                <div className="text-sm text-gray-400">Installation Time</div>
                <div className="mt-1 text-xs text-gray-500">Screens installed & configured</div>
              </div>
              <div>
                <div className="mb-2 text-5xl font-bold text-green-400">24/7</div>
                <div className="text-sm text-gray-400">Automated Upsells</div>
                <div className="mt-1 text-xs text-gray-500">No staff intervention needed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-white/10 bg-black/20 px-6 py-20 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold text-white lg:text-5xl">
            Ready to Transform Your Hotel's Revenue?
          </h2>
          <p className="mb-8 text-xl text-gray-300">
            Join forward-thinking hotels already using ACCACIA digital signage to turn every guest touchpoint into revenue.
          </p>
          <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/client-login"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 px-10 py-5 text-xl font-semibold text-white shadow-2xl shadow-sky-600/50 transition hover:shadow-sky-600/70"
            >
              Start Free Trial →
            </Link>
            <a
              href="mailto:office@horecadepo.com"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/20 bg-white/5 px-10 py-5 text-xl font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              Contact Sales
            </a>
          </div>

          {/* Demo Links */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-4 border-t border-white/10 pt-8">
            <Link
              href="/demo/bacolux-board"
              className="inline-flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-6 py-3 text-sm font-semibold text-purple-300 transition hover:border-purple-500/50 hover:bg-purple-500/20"
            >
              <span>🏨</span> View Bacolux Demo Board
            </Link>
            <Link
              href="/admin-login"
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-6 py-3 text-sm font-semibold text-cyan-300 transition hover:border-cyan-500/50 hover:bg-cyan-500/20"
            >
              <span>📊</span> Admin KPI Dashboard
            </Link>
          </div>

          <p className="text-sm text-gray-400">
            Questions? Email us at <a href="mailto:office@horecadepo.com" className="text-sky-400 underline">office@horecadepo.com</a> or call +40745601215
          </p>
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
