import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-50 to-white">
      <main className="mx-4 w-full max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <Image 
            src="/accacia-logo.svg" 
            alt="ACCACIA" 
            width={200} 
            height={125}
            priority
            className="h-auto w-48"
          />
        </div>
        <p className="mb-8 text-lg text-gray-600">
          Platformă de upsell pentru hoteluri — oferte personalizate prin QR
          code, plăți online instant.
        </p>

        <div className="mb-10 grid grid-cols-3 gap-4 text-center">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="text-2xl font-bold text-sky-600">QR</div>
            <div className="mt-1 text-xs text-gray-500">Scan &amp; Go</div>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="text-2xl font-bold text-sky-600">💳</div>
            <div className="mt-1 text-xs text-gray-500">Plată online</div>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="text-2xl font-bold text-sky-600">📊</div>
            <div className="mt-1 text-xs text-gray-500">Rapoarte</div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/api/qr?s=bacolux-lobby"
            className="inline-block rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700"
          >
            Demo: Scanează QR
          </Link>
          <Link
            href="/admin/orders"
            className="inline-block rounded-xl border-2 border-sky-600 bg-white px-6 py-3 font-semibold text-sky-600 transition hover:bg-sky-50"
          >
            Admin Panel
          </Link>
        </div>

        <p className="mt-12 text-xs text-gray-400">
          ACCACIA Upsell MVP • {new Date().getFullYear()}
        </p>
      </main>
    </div>
  );
}
