"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, File, AlertCircle } from "lucide-react";

export default function VerifyPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [documentType, setDocumentType] = useState("degree");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !email || !documentType) {
      setError("Please fill all required fields and upload a file.");
      return;
    }

    try {
      setIsUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("document", file);
      formData.append("email", email);
      formData.append("documentType", documentType);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      router.push(`/results/${data.verificationId}`);
    } catch (err: any) {
      setError(err.message);
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center py-20 px-6">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold mb-2">Analyze Document</h1>
        <p className="text-slate-400 mb-8">Upload a credential for AI forensic verification.</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-start gap-3 mb-6">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:border-slate-500 hover:bg-slate-800/50 transition-colors cursor-pointer relative"
          >
            <input
              type="file"
              accept="image/jpeg, image/png, image/webp, application/pdf"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
            />
            {file ? (
              <>
                <File size={40} className="text-[#00ff88] mb-4" />
                <p className="font-medium text-lg">{file.name}</p>
                <p className="text-slate-400 text-sm mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </>
            ) : (
              <>
                <UploadCloud size={40} className="text-slate-400 mb-4" />
                <p className="font-medium text-lg mb-1">Drag & drop your file here</p>
                <p className="text-slate-500 text-sm">Supports JPEG, PNG, WEBP, PDF</p>
              </>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Your Email Address (required)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00ff88] focus:border-transparent transition-all text-slate-50"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Document Type (required)
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00ff88] focus:border-transparent transition-all text-slate-50 appearance-none"
              >
                <option value="degree">University Degree Certificate</option>
                <option value="nysc">NYSC Discharge / Exemption Certificate</option>
                <option value="waec">WAEC / NECO Result</option>
                <option value="professional">Professional Certification</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isUploading || !file || !email}
            className="w-full bg-[#00ff88] hover:bg-[#00cc6a] text-slate-950 font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {isUploading ? "Forensic analysis in progress..." : "Analyze Document"}
          </button>
        </form>
      </div>
    </main>
  );
}
