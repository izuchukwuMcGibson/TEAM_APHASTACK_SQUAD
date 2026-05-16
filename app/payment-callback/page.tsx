"use client";

import { useEffect } from "react";

export default function PaymentCallback() {
  useEffect(() => {
    // Attempt to automatically close the tab after 2 seconds
    setTimeout(() => {
      window.close();
    }, 2000);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center text-center p-6">
      <div>
        <h1 className="text-3xl font-bold mb-4 text-[#00ff88]">Payment Successful!</h1>
        <p className="text-slate-400 text-lg mb-8">
          Your forensic report is unlocking in the main window.
        </p>
        <p className="text-slate-500 text-sm">
          Please close this tab to continue.
        </p>
      </div>
    </main>
  );
}
