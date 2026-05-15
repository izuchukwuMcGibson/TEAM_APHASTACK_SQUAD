import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeDocument(
  documentBase64: string,
  mediaType: string,
  documentType: string,
) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const systemInstruction = `You are a forensic document verification expert specializing in Nigerian academic and professional credentials.
You have deep knowledge of:
- Nigerian university degree certificate formats (UNILAG, UI, OAU, UNIBEN, ABU, and others)
- NYSC discharge and exemption certificate formats
- WAEC, NECO, JAMB result formats and security features
- Professional body certificates (ICAN, COREN, NIM, NSE, CIPM, and others)
- Common fraud patterns in Nigerian document forgery

You analyze documents with extreme precision and flag inconsistencies that suggest forgery.
You ALWAYS respond with valid JSON only. No markdown, no explanation outside the JSON.`;

  const userPrompt = `Analyze this ${documentType} document for authenticity.

Examine these dimensions:
1. TYPOGRAPHY — Font consistency, spacing irregularities, misaligned text blocks
2. INSTITUTIONAL MARKERS — Logo quality, seal presence, official formatting standards
3. DATE LOGIC — Issue dates, expiry dates, course duration vs graduation date consistency
4. REFERENCE NUMBERS — Format correctness for matric numbers, certificate numbers, registration numbers
5. LANGUAGE AND GRAMMAR — Spelling errors or awkward phrasing on official documents
6. SIGNATURE FIELDS — Presence of required signatories for this document type
7. SECURITY FEATURES — References to security paper, holograms, embossed seals
8. CONTENT CONSISTENCY — Whether all information on the document logically aligns

Return exactly this JSON structure and nothing else:
{
  "overall_risk": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "confidence": <number 0-100>,
  "flag_count": <number>,
  "teaser": "<One sentence mentioning only the NUMBER of issues found, never what they are>",
  "flags": [
    {
      "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      "category": "<Typography|Dates|Reference Numbers|Institutional Markers|Language|Signatures|Security Features|Content>",
      "finding": "<Specific detailed description of the anomaly>",
      "implication": "<What this means in plain language>"
    }
  ],
  "summary": "<2-3 sentence expert summary of the document authenticity>",
  "recommendation": "<Clear action the user should take>",
  "authentic_signals": ["<list of things that appear genuine>"],
  "document_type_detected": "<what type of document this appears to be>"
}`;

  const prompt = systemInstruction + "\n\n" + userPrompt;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: documentBase64,
        mimeType: mediaType,
      },
    },
  ]);

  const text = result.response.text();
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}
