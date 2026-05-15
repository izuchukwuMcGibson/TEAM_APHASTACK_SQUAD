import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { analyzeDocument } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("document") as File;
    const email = formData.get("email") as string;
    const documentType = formData.get("documentType") as string;

    if (!file || !email || !documentType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const mediaType = file.type;

    const fileName = `${Date.now()}-${file.name}`;
    await supabase.storage.from("documents").upload(fileName, file);

    const analysis = await analyzeDocument(base64, mediaType, documentType);

    const preliminary_result = {
      risk_level: analysis.overall_risk,
      flag_count: analysis.flag_count,
      confidence: analysis.confidence,
      teaser: analysis.teaser,
      document_type_detected: analysis.document_type_detected,
    };

    const { data, error } = await supabase
      .from("verifications")
      .insert({
        email,
        document_name: file.name,
        document_url: fileName,
        document_type: documentType,
        preliminary_result,
        full_report: analysis,
        unlocked: false,
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({
      verificationId: data.id,
      preliminary: preliminary_result,
    });
  } catch (err: any) {
    console.error("Analyze error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
