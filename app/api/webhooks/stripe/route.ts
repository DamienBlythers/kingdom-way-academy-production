import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { enrollmentEmailTemplate } from "@/lib/email-templates";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: "Missing metadata" },
        { status: 400 }
      );
    }

    // Create enrollment
    await prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
    });

    console.log(`✅ Enrollment created: User ${userId} → Course ${courseId}`);

    // Get user and course details for email
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const course = await prisma.course.findUnique({ where: { id: courseId } });

    if (user && course) {
      try {
        const emailContent = enrollmentEmailTemplate({
          userName: user.name || user.email,
          courseName: course.title,
          courseUrl: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}`,
        });

        await resend.emails.send({
          from: "Kingdom Way Academy <onboarding@resend.dev>",
          to: user.email,
          subject: emailContent.subject,
          html: emailContent.html,
        });

        console.log(`📧 Enrollment email sent to ${user.email}`);
      } catch (emailError) {
        console.error("Failed to send enrollment email:", emailError);
        // Don't fail the webhook if email fails
      }
    }
  }

  return NextResponse.json({ received: true });
}
