import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const lessonProgressSchema = z.object({
  lessonId: z.string(),
  completed: z.boolean(),
});

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { lessonId, completed } = lessonProgressSchema.parse(body);

    // Update or create lesson progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        lessonId,
        completed,
        completedAt: completed ? new Date() : null,
      },
    });

    // Update enrollment progress
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              include: {
                modules: {
                  include: {
                    lessons: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (lesson) {
      const courseId = lesson.module.courseId;
      const totalLessons = lesson.module.course.modules.reduce(
        (sum, module) => sum + module.lessons.length,
        0
      );

      const completedLessons = await prisma.lessonProgress.count({
        where: {
          userId: user.id,
          lesson: {
            module: {
              courseId,
            },
          },
          completed: true,
        },
      });

      const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

      await prisma.enrollment.update({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId,
          },
        },
        data: {
          progress: progressPercentage,
          lastAccessedAt: new Date(),
          completedAt: progressPercentage === 100 ? new Date() : null,
        },
      });
    }

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error("Lesson progress error:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}