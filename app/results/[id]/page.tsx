"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  Lock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Shield,
  AlertOctagon,
} from "lucide-react";

export default function ResultsPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const paymentComplete = searchParams.get("payment") === "complete";

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unlockEmail, setUnlockEmail] = useState("");
  const [paying, setPaying] = useState(false);

  const fetchReport = async () => {
    try {
      const res = await fetch(`/api/report/${id}`);
      const data = await res.json();
      if (res.ok) {
        setReport(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();

    // Polling if report is still locked
    let interval: NodeJS.Timeout;
    if (report && !report.unlocked) {
      interval = setInterval(() => {
        fetchReport();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [id, report?.unlocked]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlockEmail) return;

    try {
      setPaying(true);
      // Open a blank window immediately to avoid popup blockers
      const paymentWindow = window.open("about:blank", "_blank");

      const res = await fetch("/api/initiate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationId: id, email: unlockEmail }),
      });
      const data = await res.json();

      if (data.checkout_url) {
        if (paymentWindow) {
          paymentWindow.location.href = data.checkout_url;
        } else {
          window.location.href = data.checkout_url; // Fallback if popup blocked
        }
      } else if (paymentWindow) {
        paymentWindow.close();
        setPaying(false);
      }
    } catch (err) {
      console.error(err);
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center'>
        Loading...
      </div>
    );
  }

  if (!report) {
    return (
      <div className='min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center'>
        Report not found
      </div>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "LOW":
        return "text-green-500 bg-green-500/10 border-green-500/50";
      case "MEDIUM":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/50";
      case "HIGH":
        return "text-orange-500 bg-orange-500/10 border-orange-500/50";
      case "CRITICAL":
        return "text-red-500 bg-red-500/10 border-red-500/50";
      default:
        return "text-slate-500 bg-slate-500/10 border-slate-500/50";
    }
  };

  if (!report.unlocked) {
    return (
      <main className='min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center py-20 px-6'>
        <div className='w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center'>
          <div
            className={`inline-flex px-4 py-2 rounded-full border mb-6 font-bold ${getRiskColor(report.preliminary.risk_level)}`}
          >
            RISK LEVEL: {report.preliminary.risk_level}
          </div>

          <h1 className='text-3xl font-bold mb-4'>Verification Complete</h1>
          <p className='text-xl text-slate-300 mb-6'>
            Our forensic engine detected{" "}
            <span className='text-[#00ff88] font-bold'>
              {report.preliminary.flag_count}
            </span>{" "}
            suspicious signal(s) in this document
          </p>

          <div className='bg-slate-800/50 border border-slate-700 p-6 rounded-2xl mb-8 text-left italic text-slate-400'>
            "{report.preliminary.teaser}"
          </div>

          <div className='bg-slate-950 border border-slate-800 p-8 rounded-2xl relative overflow-hidden group'>
            <div className='absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90 z-10 flex flex-col items-center justify-end pb-8'>
              <Lock size={48} className='text-slate-500 mb-4' />
              <p className='text-lg font-bold text-slate-300 mb-6'>
                Full forensic report locked
              </p>

              <form
                onSubmit={handleUnlock}
                className='flex flex-col w-full max-w-sm gap-3 px-4 z-20'
              >
                <input
                  type='email'
                  required
                  value={unlockEmail}
                  onChange={(e) => setUnlockEmail(e.target.value)}
                  placeholder='Enter email to receive receipt'
                  className='w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-50'
                />
                <button
                  type='submit'
                  disabled={paying}
                  className='w-full bg-[#00ff88] text-slate-950 font-bold py-3 rounded-xl hover:bg-[#00cc6a] transition-colors disabled:opacity-50'
                >
                  {paying ? "Awaiting Payment..." : "Unlock Full Report — ₦500"}
                </button>
              </form>
            </div>

            <div className='opacity-20 blur-sm select-none'>
              <h3 className='font-bold text-xl mb-4'>Detailed Findings</h3>
              <div className='space-y-4'>
                <div className='h-20 bg-slate-800 rounded-xl w-full'></div>
                <div className='h-20 bg-slate-800 rounded-xl w-full'></div>
                <div className='h-20 bg-slate-800 rounded-xl w-full'></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const full = report.full_report;

  return (
    <main className='min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center py-20 px-6'>
      <div className='w-full max-w-4xl space-y-8'>
        <div className='bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6'>
          <div>
            <h1 className='text-3xl font-bold mb-2'>Forensic Report</h1>
            <p className='text-slate-400'>
              Document Type: {full.document_type_detected}
            </p>
          </div>
          <div className='flex gap-4 items-center'>
            <div className='text-center'>
              <p className='text-sm text-slate-400 mb-1'>Confidence Score</p>
              <p className='text-2xl font-bold'>{full.confidence}%</p>
            </div>
            <div
              className={`px-6 py-3 rounded-2xl border font-bold text-lg ${getRiskColor(full.overall_risk)}`}
            >
              RISK: {full.overall_risk}
            </div>
          </div>
        </div>

        <div className='bg-slate-900 border border-slate-800 rounded-3xl p-8'>
          <h2 className='text-xl font-bold mb-4 flex items-center gap-2'>
            <Shield className='text-[#00ff88]' />
            Expert Summary
          </h2>
          <p className='text-slate-300 leading-relaxed text-lg'>
            {full.summary}
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-8'>
          <div className='space-y-6'>
            <h2 className='text-xl font-bold flex items-center gap-2'>
              <AlertOctagon className='text-orange-500' />
              Detected Flags ({full.flags.length})
            </h2>
            {full.flags.map((flag: any, i: number) => (
              <div
                key={i}
                className='bg-slate-900 border border-slate-800 rounded-2xl p-6'
              >
                <div className='flex justify-between items-start mb-4'>
                  <span className='font-bold text-slate-300'>
                    {flag.category}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded border ${getRiskColor(flag.severity)}`}
                  >
                    {flag.severity}
                  </span>
                </div>
                <p className='text-slate-200 mb-2 font-medium'>
                  {flag.finding}
                </p>
                <p className='text-slate-400 text-sm'>
                  Implies: {flag.implication}
                </p>
              </div>
            ))}
            {full.flags.length === 0 && (
              <div className='bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-400 italic'>
                No major flags detected.
              </div>
            )}
          </div>

          <div className='space-y-6'>
            <h2 className='text-xl font-bold flex items-center gap-2'>
              <CheckCircle className='text-[#00ff88]' />
              Authentic Signals
            </h2>
            <div className='bg-slate-900 border border-slate-800 rounded-2xl p-6'>
              <ul className='space-y-3'>
                {full.authentic_signals.map((signal: string, i: number) => (
                  <li key={i} className='flex gap-3 text-slate-300'>
                    <CheckCircle
                      size={20}
                      className='text-[#00ff88] shrink-0'
                    />
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </div>

            <h2 className='text-xl font-bold flex items-center gap-2 pt-4'>
              <AlertTriangle className='text-yellow-500' />
              Recommendation
            </h2>
            <div className='bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6'>
              <p className='text-yellow-200 font-medium'>
                {full.recommendation}
              </p>
            </div>
          </div>
        </div>

        <div className='text-center text-slate-500 pt-12'>
          Powered by VeriDoc AI Framework
        </div>
      </div>
    </main>
  );
}
