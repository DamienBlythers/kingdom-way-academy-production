import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const videoProgressSchema = z.object({
  lessonId: z.string(),
  watchTime: z.number(),
});

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { lessonId, watchTime } = videoProgressSchema.parse(body);

    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
      update: {
        watchTime,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        lessonId,
        watchTime,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Video progress error:", error);
    return NextResponse.json(
      { error: "Failed to save video progress" },
      { status: 500 }
    );
  }
}