"use client";

/**
 * TEMPORARY RAZORPAY TEST PAYMENT PAGE
 * ─────────────────────────────────────
 * This page is only accessible when ENABLE_TEST_PAYMENT=true is set on the
 * server. It creates a real ₹10 Razorpay order so you can verify the full
 * integration: order creation → checkout → signature verification →
 * webhook delivery → Firestore event storage.
 *
 * To disable after testing:
 *   1. Set ENABLE_TEST_PAYMENT=false (or remove the variable).
 *   2. Redeploy — the page will render "not found" because the API will
 *      reject the test plan and the UI shows a clear disabled state.
 *
 * DO NOT link to this page from public navigation or marketing copy.
 */

import { useRouter } from "next/navigation";
import { useState } from "react";

// Razorpay checkout.js global — loaded dynamically to avoid SSR issues.
declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout.js"));
    document.body.appendChild(script);
  });
}

type Status = "idle" | "creating" | "opening" | "verifying" | "success" | "dismissed" | "error";

export default function PaymentTestPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successPaymentId, setSuccessPaymentId] = useState<string | null>(null);

  const resetError = () => {
    setErrorMessage(null);
    setStatus("idle");
  };

  const handleTestPayment = async () => {
    setErrorMessage(null);
    setStatus("creating");

    try {
      // ── Step 1: Create Razorpay order ────────────────────────────────────
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: "razorpay_test_10" }),
      });

      const orderData = (await orderRes.json()) as {
        error?: string;
        keyId?: string;
        order?: { id: string; amount: number; currency: string };
        plan?: { id: string; name: string };
      };

      if (!orderRes.ok || !orderData.keyId || !orderData.order?.id) {
        setErrorMessage(
          orderData.error ??
            "Failed to create test order. Is ENABLE_TEST_PAYMENT=true set on the server?",
        );
        setStatus("error");
        return;
      }

      // ── Step 2: Load Razorpay checkout.js ───────────────────────────────
      setStatus("opening");
      try {
        await loadRazorpayScript();
      } catch {
        setErrorMessage("Could not load Razorpay checkout. Check your internet connection.");
        setStatus("error");
        return;
      }

      // ── Step 3: Open Razorpay checkout modal ─────────────────────────────
      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        order_id: orderData.order.id,
        name: "ZeptAI",
        description: "Temporary ₹10 payment flow test",
        prefill: {
          name: "Test User",
          email: "test@zeptai.com",
          contact: "9999999999",
        },
        theme: { color: "#0ea5e9" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          // ── Step 4: Verify signature server-side ─────────────────────────
          setStatus("verifying");
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                planId: "razorpay_test_10",
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = (await verifyRes.json()) as {
              ok?: boolean;
              redirectUrl?: string;
              error?: string;
            };

            if (!verifyRes.ok || !verifyData.ok || !verifyData.redirectUrl) {
              setErrorMessage(
                verifyData.error ?? "Payment verification failed. Check server logs.",
              );
              setStatus("error");
              return;
            }

            setSuccessPaymentId(response.razorpay_payment_id);
            setStatus("success");

            // ── Step 5: Redirect to success page ─────────────────────────
            router.push(verifyData.redirectUrl);
          } catch {
            setErrorMessage("Network error during payment verification. Payment may still have gone through — check your Razorpay dashboard.");
            setStatus("error");
          }
        },
        modal: {
          ondismiss: () => {
            setStatus("dismissed");
          },
        },
      });

      rzp.open();
    } catch {
      setErrorMessage("Unexpected error during test payment. Check browser console.");
      setStatus("error");
    }
  };

  const isLoading =
    status === "creating" || status === "opening" || status === "verifying";

  const statusLabel: Record<Status, string> = {
    idle: "Pay ₹10 Test",
    creating: "Creating order…",
    opening: "Loading checkout…",
    verifying: "Verifying payment…",
    success: "Verified! Redirecting…",
    dismissed: "Pay ₹10 Test",
    error: "Pay ₹10 Test",
  };

  return (
    <main className="min-h-screen bg-yellow-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border-2 border-yellow-400 rounded-2xl shadow-lg p-8 space-y-6">

        {/* ── Warning banner ─────────────────────────────────────────── */}
        <div className="rounded-lg bg-yellow-100 border border-yellow-400 px-4 py-3 text-sm text-yellow-800 font-medium text-center">
          ⚠️ Temporary Razorpay test payment page
          <br />
          <span className="font-normal">
            Internal use only. Do not share this URL publicly.
          </span>
        </div>

        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">₹10 Payment Test</h1>
          <p className="text-sm text-gray-500">
            Verifies order creation, checkout, signature verification,
            webhook delivery, and Firestore event storage.
          </p>
        </div>

        {/* ── Amount card ────────────────────────────────────────────── */}
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">Test amount</span>
          <span className="text-2xl font-bold text-gray-900">₹10</span>
        </div>

        {/* ── Plan info ──────────────────────────────────────────────── */}
        <dl className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <dt>Plan ID</dt>
            <dd className="font-mono text-gray-700">razorpay_test_10</dd>
          </div>
          <div className="flex justify-between">
            <dt>Currency</dt>
            <dd className="font-mono text-gray-700">INR</dd>
          </div>
          <div className="flex justify-between">
            <dt>Report credits</dt>
            <dd className="font-mono text-gray-700">0 (test only)</dd>
          </div>
          <div className="flex justify-between">
            <dt>Webhook URL</dt>
            <dd className="font-mono text-gray-700 truncate max-w-[200px]">
              /api/razorpay/webhook
            </dd>
          </div>
        </dl>

        {/* ── Success state ──────────────────────────────────────────── */}
        {status === "success" && successPaymentId && (
          <div className="rounded-lg bg-green-50 border border-green-300 px-4 py-3 text-sm text-green-800">
            <p className="font-semibold">Payment verified successfully.</p>
            <p className="font-mono text-xs mt-1 break-all">{successPaymentId}</p>
            <p className="text-xs mt-1 text-green-600">Redirecting to success page…</p>
          </div>
        )}

        {/* ── Dismissed state ────────────────────────────────────────── */}
        {status === "dismissed" && (
          <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-600 text-center">
            Checkout closed without payment.
          </div>
        )}

        {/* ── Error state ────────────────────────────────────────────── */}
        {status === "error" && errorMessage && (
          <div className="rounded-lg bg-red-50 border border-red-300 px-4 py-3 text-sm text-red-800 space-y-2">
            <p className="font-semibold">Error</p>
            <p>{errorMessage}</p>
            <button
              onClick={resetError}
              className="text-xs text-red-600 underline hover:text-red-800 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ── Pay button ─────────────────────────────────────────────── */}
        {status !== "success" && (
          <button
            onClick={() => void handleTestPayment()}
            disabled={isLoading}
            className="w-full rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 transition-colors text-base"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                {statusLabel[status]}
              </span>
            ) : (
              statusLabel[status]
            )}
          </button>
        )}

        {/* ── Footer note ────────────────────────────────────────────── */}
        <p className="text-xs text-center text-gray-400">
          This page is gated by{" "}
          <span className="font-mono">ENABLE_TEST_PAYMENT=true</span>.
          <br />
          Remove the variable or set it to <span className="font-mono">false</span> to disable
          after testing.
        </p>
      </div>
    </main>
  );
}
