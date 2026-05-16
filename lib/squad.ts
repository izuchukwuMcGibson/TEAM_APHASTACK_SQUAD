const SQUAD_BASE = process.env.SQUAD_BASE_URL!;
const SQUAD_SECRET = process.env.SQUAD_SECRET_KEY!;

export async function initiatePayment({
  email,
  verificationId,
  amount = 50000,
}: {
  email: string;
  verificationId: string;
  amount?: number;
}) {
  const transaction_ref = `VERIDOC-${verificationId}-${Date.now()}`;

  const response = await fetch(`${SQUAD_BASE}/transaction/initiate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SQUAD_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      email,
      currency: "NGN",
      initiate_type: "inline",
      transaction_ref,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-callback`,
      pass_charge: false,
      customer_name: "VeriDoc User",
    }),
  });

  const data = await response.json();

  if (data.status !== 200) {
    throw new Error(data.message || "Payment initiation failed");
  }

  return {
    checkout_url: data.data?.checkout_url,
    transaction_ref,
    amount,
  };
}

export async function verifyTransaction(transaction_ref: string) {
  const response = await fetch(
    `${SQUAD_BASE}/transaction/verify/${transaction_ref}`,
    {
      headers: {
        Authorization: `Bearer ${SQUAD_SECRET}`,
      },
    },
  );
  return response.json();
}

export function validateWebhookSignature(
  payload: string,
  signature: string,
): boolean {
  const crypto = require("crypto");
  const hash = crypto
    .createHmac("sha512", SQUAD_SECRET)
    .update(payload)
    .digest("hex");
  return hash.toUpperCase() === signature.toUpperCase();
}
