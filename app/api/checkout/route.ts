import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { createCheckoutSession } from "@/lib/stripe";
import { z } from "zod";

const checkoutSchema = z.object({
  priceId: z.string(),
});

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { priceId } = checkoutSchema.parse(body);

    if (!user.email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    const session = await createCheckoutSession(user.id, priceId, user.email);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}