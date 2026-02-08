import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import Image from "next/image";

const ADMIN_COOKIE = "admin_auth";

async function isAuthenticated(): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return true; // No password set = no gate

  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === password;
}

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const authed = await isAuthenticated();

  if (!authed) {
    redirect("/admin-login");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="border-b bg-white px-6 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Image 
              src="/accacia-logo.svg" 
              alt="ACCACIA" 
              width={120} 
              height={40}
              priority
            />
            <span className="text-sm font-medium text-gray-600">Admin</span>
          </div>
          <div className="flex gap-4 text-sm">
            <a
              href="/admin/kpi"
              className="text-sky-600 hover:underline"
            >
              KPIs
            </a>
            <a
              href="/admin/orders"
              className="text-sky-600 hover:underline"
            >
              Comenzi
            </a>
            <a
              href="/admin/offers"
              className="text-sky-600 hover:underline"
            >
              Oferte
            </a>
            <a
              href="/admin/payments"
              className="text-sky-600 hover:underline"
            >
              Payments
            </a>
            <form action="/admin/logout" method="POST">
              <button
                type="submit"
                className="text-red-500 hover:underline"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
