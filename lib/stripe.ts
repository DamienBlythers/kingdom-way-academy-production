import Stripe from "stripe";
import { env } from "./env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

export const STRIPE_PLANS = {
  STARTER: {
    name: "Starter",
    priceId: process.env.STRIPE_PRICE_STARTER!,
    price: 1900, // $19.00
    features: [
      "Access to 1 course",
      "Basic support",
      "Community access",
      "Mobile app access",
    ],
  },
  PRO: {
    name: "Pro",
    priceId: process.env.STRIPE_PRICE_PRO!,
    price: 4900, // $49.00
    features: [
      "Access to all courses",
      "Priority support",
      "Certificates",
      "Downloadable resources",
      "Community access",
      "Mobile app access",
    ],
    popular: true,
  },
  TEAM: {
    name: "Team",
    priceId: process.env.STRIPE_PRICE_TEAM!,
    price: 14900, // $149.00
    features: [
      "5 team seats",
      "Admin dashboard",
      "Usage reporting",
      "Priority support",
      "All Pro features",
    ],
  },
} as const;

export async function createCheckoutSession(
  userId: string,
  priceId: string,
  email: string
) {
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    client_reference_id: userId,
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${env.NEXTAUTH_URL}/pricing?canceled=true`,
    metadata: {
      userId,
    },
  });

  return session;
}

export async function createCustomerPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${env.NEXTAUTH_URL}/dashboard/billing`,
  });

  return session;
}
