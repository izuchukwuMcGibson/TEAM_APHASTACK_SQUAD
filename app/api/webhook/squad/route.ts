import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { validateWebhookSignature } from "@/lib/squad";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-squad-encrypted-body") || "";

    if (!validateWebhookSignature(rawBody, signature)) {
      console.error("Invalid Squad webhook signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    if (
      event.Event === "charge_completed" &&
      event.Body.transaction_status === "success"
    ) {
      const transaction_ref = event.Body.transaction_ref;

      const { data: verification } = await supabase
        .from("verifications")
        .select("id")
        .eq("squad_transaction_ref", transaction_ref)
        .single();

      if (verification) {
        await supabase
          .from("verifications")
          .update({ unlocked: true })
          .eq("id", verification.id);
      }
    }

    return NextResponse.json({ status: "received" }, { status: 200 });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return NextResponse.json({ status: "received" }, { status: 200 });
  }
}
