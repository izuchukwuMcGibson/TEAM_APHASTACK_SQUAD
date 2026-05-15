import Link from "next/link";
import { Shield, Sparkles, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center">
      <div className="flex-1 w-full max-w-5xl px-6 py-20 flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Veri<span className="text-[#00ff88]">Doc</span>
        </h1>
        <p className="text-xl md:text-3xl font-medium mb-4 text-slate-300">
          Detect Fake Certificates Before They Cost You
        </p>
        <p className="text-lg text-slate-400 mb-12 max-w-2xl">
          AI forensic analysis of academic and professional credentials in seconds.
        </p>
        
        <Link 
          href="/verify" 
          className="bg-[#00ff88] text-slate-950 px-8 py-4 rounded-full font-bold text-lg hover:bg-[#00cc6a] transition-colors shadow-[0_0_30px_rgba(0,255,136,0.3)] mb-20"
        >
          Verify a Document
        </Link>

        <div className="grid md:grid-cols-3 gap-8 w-full mt-12 text-left">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="bg-slate-800 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="text-[#00ff88]" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Upload Any Certificate</h3>
            <p className="text-slate-400">Drag and drop degree certificates, NYSC discharges, WAEC results, and professional certifications.</p>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="bg-slate-800 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="text-[#00ff88]" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">AI Forensic Analysis</h3>
            <p className="text-slate-400">Our advanced model scans for anomalies in typography, date logic, institutional markers, and more.</p>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="bg-slate-800 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="text-[#00ff88]" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Instant Results</h3>
            <p className="text-slate-400">Get a risk assessment in seconds and unlock the full forensic report securely via Squad payments.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
