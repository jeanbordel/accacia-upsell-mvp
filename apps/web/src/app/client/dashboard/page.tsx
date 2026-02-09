export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";

export default async function ClientDashboardPage() {
  // TODO: Implement actual client authentication check
  // For now, this is a placeholder

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50">
      {/* Navigation */}
      <nav className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Image 
            src="/accacia-logo.svg" 
            alt="ACCACIA" 
            width={140} 
            height={40}
            priority
            className="h-auto w-32"
          />
          <div className="flex items-center gap-6">
            <Link href="/client/offers" className="text-sm text-gray-600 hover:text-gray-900">
              My Offers
            </Link>
            <Link href="/client/payments" className="text-sm text-gray-600 hover:text-gray-900">
              Payment Settings
            </Link>
            <Link href="/client/analytics" className="text-sm text-gray-600 hover:text-gray-900">
              Analytics
            </Link>
            <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="text-gray-600">Welcome to your hotel management portal</p>
        </div>

        {/* Coming Soon Notice */}
        <div className="rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50 p-12 text-center">
          <div className="mb-4 text-6xl">🚧</div>
          <h2 className="mb-3 text-2xl font-bold text-gray-900">Client Portal Coming Soon</h2>
          <p className="mb-6 text-gray-600">
            We're building a comprehensive dashboard for hotel clients to manage their offers,
            view analytics, and configure payment providers.
          </p>
          <div className="mb-8 inline-flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/payments"
              className="rounded-lg bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700"
            >
              Configure Payment Providers
            </Link>
            <Link
              href="/admin/offers"
              className="rounded-lg border-2 border-sky-600 bg-white px-6 py-3 font-semibold text-sky-600 transition hover:bg-sky-50"
            >
              Manage Offers
            </Link>
          </div>
          
          <div className="mt-8 border-t border-sky-200 pt-8">
            <p className="text-sm text-gray-500">
              For now, you can access the admin panel to configure your hotel:
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <Link href="/admin/kpi" className="text-sm text-sky-600 hover:underline">
                View KPIs
              </Link>
              <Link href="/admin/orders" className="text-sm text-sky-600 hover:underline">
                View Orders
              </Link>
              <Link href="/admin/payments" className="text-sm text-sky-600 hover:underline">
                Payment Settings
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Preview */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-3 text-3xl">📊</div>
            <h3 className="mb-2 font-semibold text-gray-900">Analytics Dashboard</h3>
            <p className="text-sm text-gray-600">
              Real-time conversion tracking, revenue insights, and guest behavior analytics.
            </p>
          </div>
          
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-3 text-3xl">🎯</div>
            <h3 className="mb-2 font-semibold text-gray-900">Offer Management</h3>
            <p className="text-sm text-gray-600">
              Create, edit, and activate upsell offers with drag-and-drop simplicity.
            </p>
          </div>
          
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-3 text-3xl">💳</div>
            <h3 className="mb-2 font-semibold text-gray-900">Payment Setup</h3>
            <p className="text-sm text-gray-600">
              Connect your Stripe, Netopia, or PayU account in just a few clicks.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
