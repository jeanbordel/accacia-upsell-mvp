"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function ClientLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // TODO: Implement actual client authentication
    // For now, redirect to a client dashboard placeholder
    setTimeout(() => {
      if (email && password) {
        // Placeholder - implement proper auth
        router.push("/client/dashboard");
      } else {
        setError("Please enter your credentials");
        setLoading(false);
      }
    }, 1000);
  };

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
          {/* Card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl"></div>
            
            <div className="relative">
              <h1 className="mb-2 text-3xl font-bold text-white">
                Client Portal
              </h1>
              <p className="mb-8 text-gray-400">
                Sign in to manage your hotel's offers and analytics
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/50 p-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hotel@example.com"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-400">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-white/10 bg-white/5 text-sky-600 focus:ring-2 focus:ring-sky-500/50"
                    />
                    Remember me
                  </label>
                  <a href="#" className="text-sky-400 hover:text-sky-300">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-gradient-to-r from-sky-600 to-cyan-600 px-6 py-3 font-semibold text-white shadow-lg shadow-sky-600/50 transition hover:shadow-sky-600/70 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <div className="mt-8 border-t border-white/10 pt-6 text-center">
                <p className="text-sm text-gray-400">
                  Don't have an account?{" "}
                  <Link href="/#demo" className="text-sky-400 hover:text-sky-300">
                    Request a demo
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="mb-2 text-2xl">🔒</div>
              <h3 className="mb-1 text-sm font-semibold text-white">Secure Access</h3>
              <p className="text-xs text-gray-400">
                Bank-level encryption for all your data
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="mb-2 text-2xl">📊</div>
              <h3 className="mb-1 text-sm font-semibold text-white">Real-Time Insights</h3>
              <p className="text-xs text-gray-400">
                Track performance as it happens
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
