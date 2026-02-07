/**
 * Netopia payment helpers.
 *
 * TODO: Implement actual encryption/decryption using Netopia's
 *       public/private key pair (RC4 + RSA or AES depending on API version).
 *       The placeholder functions below are stubs; replace them when you
 *       have the Netopia crypto documentation and keys.
 */

import crypto from "crypto";

// ---------- ENV helpers ----------

export function getNetopiaConfig() {
  return {
    signature: process.env.NETOPIA_SIGNATURE || "",
    isTest: process.env.NETOPIA_TEST_MODE === "true",
    hostedUrl:
      process.env.NETOPIA_TEST_MODE === "true"
        ? process.env.NETOPIA_HOSTED_URL_TEST ||
          "https://sandbox.netopia-payments.com/payment/card/start"
        : process.env.NETOPIA_HOSTED_URL_LIVE ||
          "https://secure.netopia-payments.com/payment/card/start",
    notifyUrl:
      process.env.NETOPIA_NOTIFY_URL ||
      "http://localhost:3000/api/webhooks/netopia",
    returnUrl:
      process.env.NETOPIA_RETURN_URL || "http://localhost:3000/o/success",
    privateKeyPem: process.env.NETOPIA_PRIVATE_KEY_PEM || "",
    publicKeyPem: process.env.NETOPIA_PUBLIC_KEY_PEM || "",
  };
}

// ---------- XML builder (minimal) ----------

export function buildPaymentXml(params: {
  orderId: string;
  amountCents: number;
  currency: string;
  description: string;
  signature: string;
  notifyUrl: string;
  returnUrl: string;
}): string {
  const amount = (params.amountCents / 100).toFixed(2);
  // Minimal mobilPay XML — structure depends on Netopia docs
  return `<?xml version="1.0" encoding="utf-8"?>
<order type="card" id="${params.orderId}" timestamp="${new Date().toISOString()}">
  <signature>${params.signature}</signature>
  <url>
    <confirm>${params.notifyUrl}</confirm>
    <return>${params.returnUrl}?orderId=${params.orderId}</return>
  </url>
  <invoice currency="${params.currency}" amount="${amount}">
    <details>${params.description}</details>
  </invoice>
</order>`;
}

// ---------- Encryption / Decryption stubs ----------

/**
 * TODO: Encrypt XML payload with Netopia's public key.
 *
 * Netopia mobilPay uses:
 *   1. Generate random DES/3DES/RC4 key
 *   2. Encrypt XML with that symmetric key
 *   3. Encrypt symmetric key with Netopia public RSA key
 *   4. Base64-encode both
 *
 * Replace this stub with real implementation when keys are available.
 */
export function encryptForNetopia(
  xml: string,
  _publicKeyPem: string
): { envKey: string; data: string } {
  // TODO: Real implementation
  console.warn(
    "[Netopia] Using STUB encryption — replace with real crypto before going live!"
  );
  const envKey = crypto.randomBytes(32).toString("base64");
  const data = Buffer.from(xml).toString("base64");
  return { envKey, data };
}

/**
 * TODO: Decrypt incoming IPN notification from Netopia.
 *
 * Netopia sends env_key + data in POST body.
 * 1. Decrypt env_key with merchant private RSA key to get symmetric key
 * 2. Decrypt data with symmetric key to get XML
 *
 * Replace this stub with real implementation.
 */
export function decryptFromNetopia(
  envKey: string,
  data: string,
  _privateKeyPem: string
): string {
  // TODO: Real implementation
  console.warn(
    "[Netopia] Using STUB decryption — replace with real crypto before going live!"
  );
  try {
    return Buffer.from(data, "base64").toString("utf-8");
  } catch {
    return "";
  }
}
