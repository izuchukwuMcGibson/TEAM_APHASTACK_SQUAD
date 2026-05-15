<div align="center">

```
██╗   ██╗███████╗██████╗ ██╗██████╗  ██████╗  ██████╗
██║   ██║██╔════╝██╔══██╗██║██╔══██╗██╔═══██╗██╔════╝
██║   ██║█████╗  ██████╔╝██║██║  ██║██║   ██║██║
╚██╗ ██╔╝██╔══╝  ██╔══██╗██║██║  ██║██║   ██║██║
 ╚████╔╝ ███████╗██║  ██║██║██████╔╝╚██████╔╝╚██████╗
  ╚═══╝  ╚══════╝╚═╝  ╚═╝╚═╝╚═════╝  ╚═════╝  ╚═════╝
```

### **AI-Powered Certificate & Academic Document Fraud Detector**
*Squad Hackathon 3.0 — Smart Systems: The Intelligent Economy*

---

![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Squad](https://img.shields.io/badge/Squad_API-E30613?style=for-the-badge&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

## The Problem

Every year, Nigerian employers hire people with fake certificates. University degrees, NYSC discharge certificates, WAEC results, professional certifications — all of them are being forged at scale.

**The damage is real:**
- A hospital hires a doctor with a fake medical degree
- A construction firm employs an engineer whose COREN certificate never existed
- A fintech onboards a "chartered accountant" whose ICAN certificate was made in Photoshop

There is no fast, accessible way to verify credentials before it is too late. Calling institutions takes days. Most employers simply don't bother. Fraudsters know this and exploit it.

**VeriDoc changes that.**

---

## What VeriDoc Does

Upload any academic or professional certificate. VeriDoc's forensic AI engine analyzes it across 8 dimensions and returns a detailed fraud report in seconds.

The full report is unlocked via a **₦500 Squad payment** — making Squad not a footnote, but the actual gate between suspicion and truth.

```
User uploads certificate
         │
         ▼
  Gemini AI analyzes document
  across 8 forensic dimensions
         │
         ▼
  Risk level revealed instantly
  "3 suspicious signals detected"  ← teaser, always free
         │
         ▼
  ┌─────────────────────────┐
  │  Full report is LOCKED  │
  │  Unlock for ₦500        │  ← Squad payment here
  └─────────────────────────┘
         │
         ▼
  Squad confirms payment via webhook
         │
         ▼
  Full forensic report unlocks
  in real time — every flag explained
```

---

## What the AI Actually Checks

VeriDoc's forensic engine examines 8 dimensions on every document:

| Dimension | What It Looks For |
|---|---|
| **Typography** | Font inconsistencies, spacing irregularities, misaligned text blocks — signs of editing |
| **Institutional Markers** | Logo quality, seal presence, official formatting standards for the institution type |
| **Date Logic** | Whether issue dates, course duration, and graduation dates are logically consistent |
| **Reference Numbers** | Whether matric numbers, certificate numbers, and reg numbers match known Nigerian formats |
| **Language & Grammar** | Spelling errors or awkward phrasing on supposedly official documents |
| **Signature Fields** | Whether all required signatories for this document type are present |
| **Security Features** | References to holograms, security paper, embossed seals |
| **Content Consistency** | Whether all information on the document logically aligns with itself |

**Output:** A risk rating (LOW / MEDIUM / HIGH / CRITICAL), a confidence score, and a detailed breakdown of every flag found — with plain-language explanations of what each flag means.

---

## Supported Document Types

- 🎓 University Degree Certificates
- 📋 NYSC Discharge & Exemption Certificates
- 📝 WAEC / NECO Results
- 🏅 Professional Certifications (ICAN, COREN, NIM, NSE, CIPM, and more)

---

## Squad API Integration

Squad is the **backbone** of VeriDoc's business model — not a token integration.

The full forensic report is analyzed and saved at upload time, but **locked in the database**. It only unlocks when Squad confirms payment. This means:

- Without Squad, the product does not function
- Every verification generates revenue
- The payment flow is real, tested, and production-ready

**Squad endpoints used:**

| Endpoint | Purpose |
|---|---|
| `POST /transaction/initiate` | Opens Squad checkout when user clicks "Unlock Report" |
| `GET /transaction/verify/:ref` | Fallback manual check if webhook is delayed |
| Webhook: `charge_completed` | Real-time report unlock on payment confirmation |

**Webhook security:** Every incoming webhook is validated against a SHA-512 HMAC signature before any database update is made. Unverified requests are rejected with 401.

**Fallback safety:** If the Squad webhook fires late, the results page polls `/api/report/:id` which manually calls Squad's verify endpoint — so no user ever pays and sees a locked report.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | Frontend + API routes in one repo, zero config deployment |
| AI Core | Google Gemini 1.5 Flash | Multimodal vision — reads images and PDFs natively |
| Database | Supabase (Postgres + Storage) | Instant setup, real-time, document file storage |
| Payments | Squad API | Nigerian-first payment infrastructure |
| Deployment | Vercel | Push to GitHub, it's live |

---

## Project Structure

```
veridoc/
├── app/
│   ├── page.tsx                      ← Landing page
│   ├── verify/page.tsx               ← Document upload page
│   ├── results/[id]/page.tsx         ← Locked / unlocked report page
│   └── api/
│       ├── analyze/route.ts          ← Gemini AI analysis engine
│       ├── initiate-payment/route.ts ← Squad payment initiation
│       ├── report/[id]/route.ts      ← Report fetch + unlock check
│       └── webhook/squad/route.ts    ← Squad webhook handler
├── lib/
│   ├── supabase.ts                   ← Supabase client
│   ├── gemini.ts                     ← Gemini AI integration
│   └── squad.ts                      ← Squad API integration
└── .env.local
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account
- A [Squad sandbox](https://sandbox.squadco.com) account
- A [Google AI Studio](https://aistudio.google.com) API key (free)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/veridoc.git
cd veridoc
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
GEMINI_API_KEY=your_gemini_api_key
SQUAD_SECRET_KEY=sandbox_sk_your_squad_secret_key
SQUAD_PUBLIC_KEY=sandbox_pk_your_squad_public_key
SQUAD_BASE_URL=https://sandbox-api-d.squadco.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up Supabase

Run this SQL in your Supabase SQL editor:

```sql
create table verifications (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  document_name text,
  document_url text,
  document_type text,
  preliminary_result jsonb,
  full_report jsonb,
  unlocked boolean default false,
  squad_transaction_ref text,
  amount_paid integer,
  created_at timestamp default now()
);

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false);
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## How the Payment Flow Works (Technical)

```
1. User uploads document → POST /api/analyze
   └── Gemini analyzes document
   └── Full report saved to Supabase (unlocked: false)
   └── Only teaser returned to frontend

2. User clicks "Unlock" → POST /api/initiate-payment
   └── Squad transaction created with unique ref: VERIDOC-{id}-{timestamp}
   └── Transaction ref saved to DB
   └── Checkout URL returned → user redirected to Squad

3. User pays → Squad fires webhook → POST /api/webhook/squad
   └── Signature validated (SHA-512 HMAC)
   └── Transaction ref matched to verification record
   └── DB updated: unlocked: true

4. User redirected back → GET /api/report/{id}
   └── If unlocked: full report returned
   └── If not yet unlocked: Squad verify endpoint called as fallback
   └── Frontend polls every 2s until unlocked
```

---

## The Four Pillars — How VeriDoc Scores

| Pillar | How VeriDoc Addresses It |
|---|---|
| **AI Automation** | Gemini Vision automates forensic document analysis end-to-end — no human reviewer needed |
| **Use of Data** | 8 forensic signals analyzed per document, producing a predictive risk score with interpretable flags |
| **Squad APIs** | Payment is the unlock mechanism — Squad is structurally inseparable from the product |
| **Financial Innovation** | Creates a new verification economy — institutions pay per check rather than maintaining expensive compliance teams |

---

## The Business Model

| Tier | Price | Target |
|---|---|---|
| Single verification | ₦500 | Individual employers, landlords |
| Business bundle (50 checks) | ₦15,000 | SMEs, recruitment agencies |
| Institutional API access | Custom | Universities, banks, government agencies |

**Year 1 target:** 10,000 verifications = ₦5,000,000 in revenue

---

## Squad Sandbox Test Card

For testing the payment flow:

```
Card Number : 4084 0840 8408 4081
Expiry      : Any future date
CVV         : 408
OTP         : 12345
```

---

## Built For

**Squad Hackathon 3.0** — *Smart Systems: The Intelligent Economy*

> "Financial inclusion is not a charity problem. It is a technology problem."

VeriDoc attacks the trust layer of Nigeria's economy. You cannot have financial inclusion without verified identity. You cannot have verified identity without accessible, fast, affordable document verification. That is what VeriDoc provides.

---

<div align="center">

Built solo in one night · Powered by Gemini AI · Payments by Squad

</div>
