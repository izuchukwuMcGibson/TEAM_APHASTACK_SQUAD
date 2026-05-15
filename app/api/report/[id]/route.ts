import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyTransaction } from "@/lib/squad";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("verifications")
      .select(
        "id, preliminary_result, full_report, unlocked, squad_transaction_ref"
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!data.unlocked && data.squad_transaction_ref) {
      const squadResult = await verifyTransaction(data.squad_transaction_ref);

      if (squadResult?.data?.transaction_status === "success") {
        await supabase
          .from("verifications")
          .update({ unlocked: true })
          .eq("id", id);

        data.unlocked = true;
      }
    }

    return NextResponse.json({
      id: data.id,
      preliminary: data.preliminary_result,
      full_report: data.unlocked ? data.full_report : null,
      unlocked: data.unlocked,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
