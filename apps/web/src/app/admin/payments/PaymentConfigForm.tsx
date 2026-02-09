"use client";

import { useState } from "react";
import { HotelPaymentConfig, PaymentProvider } from "@prisma/client";

type Props = {
  hotel: { id: string; name: string };
  config: HotelPaymentConfig | null;
};

export default function PaymentConfigForm({ hotel, config }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [testing, setTesting] = useState<PaymentProvider | null>(null);

  const [defaultPsp, setDefaultPsp] = useState<PaymentProvider | "">(
    config?.defaultPsp || ""
  );

  // Stripe fields
  const [stripeSecret, setStripeSecret] = useState(config?.stripeSecret || "");
  const [stripeWebhook, setStripeWebhook] = useState(config?.stripeWebhook || "");

  // Netopia fields
  const [netopiaSignature, setNetopiaSignature] = useState(
    config?.netopiaSignature || ""
  );
  const [netopiaTestMode, setNetopiaTestMode] = useState(
    config?.netopiaTestMode ?? true
  );
  const [netopiaHostedUrlTest, setNetopiaHostedUrlTest] = useState(
    config?.netopiaHostedUrlTest || "https://sandbox.netopia-payments.com/payment/card/start"
  );
  const [netopiaHostedUrlLive, setNetopiaHostedUrlLive] = useState(
    config?.netopiaHostedUrlLive || "https://secure.netopia-payments.com/payment/card/start"
  );
  const [netopiaPublicKeyPem, setNetopiaPublicKeyPem] = useState(
    config?.netopiaPublicKeyPem || ""
  );
  const [netopiaPrivateKeyPem, setNetopiaPrivateKeyPem] = useState(
    config?.netopiaPrivateKeyPem || ""
  );

  // PayU fields (placeholder)
  const [payuMerchantId, setPayuMerchantId] = useState(config?.payuMerchantId || "");
  const [payuSecret, setPayuSecret] = useState(config?.payuSecret || "");
  const [payuEnv, setPayuEnv] = useState(config?.payuEnv || "test");

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/payment-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId: hotel.id,
          defaultPsp: defaultPsp || null,
          stripeSecret,
          stripeWebhook,
          netopiaSignature,
          netopiaTestMode,
          netopiaHostedUrlTest,
          netopiaHostedUrlLive,
          netopiaPublicKeyPem,
          netopiaPrivateKeyPem,
          payuMerchantId,
          payuSecret,
          payuEnv,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save configuration");
      }

      setSuccess("Payment configuration saved successfully!");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async (provider: PaymentProvider) => {
    setTesting(provider);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/test-payment-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotelId: hotel.id, provider }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Connection test failed");
      }

      setSuccess(`${provider} connection test successful!`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Connection test failed");
    } finally {
      setTesting(null);
    }
  };

  const isStripeConfigured = stripeSecret.trim() !== "";
  const isNetopiaConfigured = netopiaSignature.trim() !== "";
  const isPayuConfigured = payuMerchantId.trim() !== "" && payuSecret.trim() !== "";

  return (
    <div className="space-y-6">
      {/* Error/Success Messages */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
          <strong>Success:</strong> {success}
        </div>
      )}

      {/* Default Provider Selection */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Default Payment Provider
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          Select which provider should be used for checkouts by default.
        </p>
        <div className="space-y-2">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="defaultPsp"
              value="STRIPE"
              checked={defaultPsp === "STRIPE"}
              onChange={(e) => setDefaultPsp(e.target.value as PaymentProvider)}
              disabled={!isStripeConfigured}
              className="h-4 w-4"
            />
            <span className={isStripeConfigured ? "" : "text-gray-400"}>
              Stripe {!isStripeConfigured && "(not configured)"}
            </span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="defaultPsp"
              value="NETOPIA"
              checked={defaultPsp === "NETOPIA"}
              onChange={(e) => setDefaultPsp(e.target.value as PaymentProvider)}
              disabled={!isNetopiaConfigured}
              className="h-4 w-4"
            />
            <span className={isNetopiaConfigured ? "" : "text-gray-400"}>
              Netopia {!isNetopiaConfigured && "(not configured)"}
            </span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="defaultPsp"
              value="PAYU"
              checked={defaultPsp === "PAYU"}
              onChange={(e) => setDefaultPsp(e.target.value as PaymentProvider)}
              disabled={!isPayuConfigured}
              className="h-4 w-4"
            />
            <span className={isPayuConfigured ? "" : "text-gray-400"}>
              PayU {!isPayuConfigured && "(not configured)"} - Coming Soon
            </span>
          </label>
        </div>
      </div>

      {/* Stripe Configuration */}
      <div className="rounded-lg border bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Stripe</h2>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              isStripeConfigured
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {isStripeConfigured ? "Connected" : "Not Connected"}
          </span>
        </div>
        <p className="mb-4 text-sm text-gray-600">
          Supports: Card, Apple Pay, Google Pay (if merchant account enabled)
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Stripe Secret Key
            </label>
            <input
              type="password"
              value={stripeSecret}
              onChange={(e) => setStripeSecret(e.target.value)}
              placeholder="sk_test_... or sk_live_..."
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Webhook Secret (Optional - per-hotel)
            </label>
            <input
              type="password"
              value={stripeWebhook}
              onChange={(e) => setStripeWebhook(e.target.value)}
              placeholder="whsec_..."
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave empty to use global webhook secret from environment.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleTestConnection("STRIPE")}
            disabled={!isStripeConfigured || testing === "STRIPE"}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {testing === "STRIPE" ? "Testing..." : "Test Connection"}
          </button>
        </div>
      </div>

      {/* Netopia Configuration */}
      <div className="rounded-lg border bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Netopia</h2>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              isNetopiaConfigured
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {isNetopiaConfigured ? "Connected" : "Not Connected"}
          </span>
        </div>
        <p className="mb-4 text-sm text-gray-600">
          Netopia Hosted Payment (mobilPay)
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Merchant Signature
            </label>
            <input
              type="text"
              value={netopiaSignature}
              onChange={(e) => setNetopiaSignature(e.target.value)}
              placeholder="XXXX-XXXX-XXXX-XXXX-XXXX"
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={netopiaTestMode}
              onChange={(e) => setNetopiaTestMode(e.target.checked)}
              className="h-4 w-4"
            />
            <label className="text-sm text-gray-700">Test Mode (Sandbox)</label>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Hosted URL (Test)
            </label>
            <input
              type="text"
              value={netopiaHostedUrlTest}
              onChange={(e) => setNetopiaHostedUrlTest(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Hosted URL (Live)
            </label>
            <input
              type="text"
              value={netopiaHostedUrlLive}
              onChange={(e) => setNetopiaHostedUrlLive(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Public Key (PEM)
            </label>
            <textarea
              value={netopiaPublicKeyPem}
              onChange={(e) => setNetopiaPublicKeyPem(e.target.value)}
              placeholder="-----BEGIN PUBLIC KEY-----..."
              rows={4}
              className="w-full rounded-lg border px-3 py-2 text-sm font-mono"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Private Key (PEM)
            </label>
            <textarea
              value={netopiaPrivateKeyPem}
              onChange={(e) => setNetopiaPrivateKeyPem(e.target.value)}
              placeholder="-----BEGIN PRIVATE KEY-----..."
              rows={4}
              className="w-full rounded-lg border px-3 py-2 text-sm font-mono"
            />
            <p className="mt-1 text-xs text-amber-600">
              ⚠️ WARNING: Private keys should be stored in environment variables or a vault. DB storage is for MVP only.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleTestConnection("NETOPIA")}
            disabled={!isNetopiaConfigured || testing === "NETOPIA"}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {testing === "NETOPIA" ? "Testing..." : "Test Connection"}
          </button>
        </div>
      </div>

      {/* PayU Configuration (Placeholder) */}
      <div className="rounded-lg border bg-white p-6 opacity-60">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">PayU</h2>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            Coming Soon
          </span>
        </div>
        <p className="mb-4 text-sm text-gray-600">
          Supports: Card, Apple Pay, Google Pay (where available)
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Merchant POS ID
            </label>
            <input
              type="text"
              value={payuMerchantId}
              onChange={(e) => setPayuMerchantId(e.target.value)}
              placeholder="12345"
              className="w-full rounded-lg border px-3 py-2 text-sm"
              disabled
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Client Secret
            </label>
            <input
              type="password"
              value={payuSecret}
              onChange={(e) => setPayuSecret(e.target.value)}
              placeholder="secret_..."
              className="w-full rounded-lg border px-3 py-2 text-sm"
              disabled
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Environment
            </label>
            <select
              value={payuEnv}
              onChange={(e) => setPayuEnv(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              disabled
            >
              <option value="test">Test (Sandbox)</option>
              <option value="live">Live (Production)</option>
            </select>
          </div>
          <button
            type="button"
            className="rounded-lg bg-gray-400 px-4 py-2 text-sm text-white"
            disabled
          >
            Test Connection
          </button>
        </div>
      </div>

      {/* Apple Pay / Google Pay Info */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-blue-900">
          Apple Pay / Google Pay
        </h3>
        <p className="text-xs text-blue-700">
          These payment methods are available through Stripe and PayU if your merchant account supports them.
          No additional configuration needed - they will appear automatically at checkout if enabled on your
          Stripe/PayU account.
        </p>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-sky-600 px-6 py-3 text-white hover:bg-sky-700 disabled:bg-gray-400"
        >
          {saving ? "Saving..." : "Save Configuration"}
        </button>
      </div>
    </div>
  );
}
