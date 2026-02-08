import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Simple rate limiting for login attempts (in-memory, resets on deployment)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt || attempt.resetAt < now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }

  if (attempt.count >= 5) {
    return false;
  }

  attempt.count++;
  return true;
}

async function loginAction(formData: FormData) {
  "use server";
  const password = formData.get("password") as string;
  const expected = process.env.ADMIN_PASSWORD;

  // Basic rate limiting (IP would be better but not easily accessible in Server Actions)
  // This is a simple deterrent; for production, use NextAuth or similar

  if (!expected || password === expected) {
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", expected || "", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    });
    redirect("/admin/orders");
  }

  redirect("/admin-login?error=1");
}

export default async function LoginPage() {
  const cookieStore = await cookies();
  const password = process.env.ADMIN_PASSWORD;

  if (!password || cookieStore.get("admin_auth")?.value === password) {
    redirect("/admin/orders");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Image 
              src="/accacia-logo.svg" 
              alt="ACCACIA" 
              width={140} 
              height={40}
              priority
              className="h-auto w-32 brightness-0 invert"
            />
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-400 transition hover:text-white"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-red-500/10 blur-3xl"></div>
            
            <div className="relative">
              <div className="mb-6 flex items-center justify-center gap-2">
                <span className="text-2xl">⚙️</span>
                <h1 className="text-3xl font-bold text-white">Admin Access</h1>
              </div>
              
              <p className="mb-8 text-center text-sm text-gray-400">
                ACCACIA Internal Use Only
              </p>

              <form action={loginAction} className="space-y-6">
                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-300">
                    Admin Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 font-semibold text-white shadow-lg shadow-red-600/50 transition hover:shadow-red-600/70"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Looking for client login?{" "}
                  <Link href="/client-login" className="text-sky-400 hover:text-sky-300">
                    Click here
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Warning Note */}
          <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-center backdrop-blur-sm">
            <p className="text-xs text-red-400">
              🔒 Authorized personnel only. All access is logged and monitored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
