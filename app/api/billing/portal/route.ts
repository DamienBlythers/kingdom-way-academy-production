import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { createCustomerPortalSession } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const user = await requireAuth();

    const userWithStripe = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userWithStripe?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 400 }
      );
    }

    const session = await createCustomerPortalSession(userWithStripe.stripeCustomerId);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Billing portal error:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}