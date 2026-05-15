import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { initiatePayment } from "@/lib/squad";

export async function POST(req: NextRequest) {
  try {
    const { verificationId, email } = await req.json();

    if (!verificationId || !email) {
      return NextResponse.json(
        { error: "Missing verificationId or email" },
        { status: 400 }
      );
    }

    const { checkout_url, transaction_ref, amount } = await initiatePayment({
      email,
      verificationId,
    });

    await supabase
      .from("verifications")
      .update({ squad_transaction_ref: transaction_ref, amount_paid: amount })
      .eq("id", verificationId);

    return NextResponse.json({ checkout_url, transaction_ref });
  } catch (err: any) {
    console.error("Payment initiation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
