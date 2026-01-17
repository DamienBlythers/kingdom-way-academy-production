import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    await requireAdmin();
    const { courseId } = params;

    const course = await prisma.course.update({
      where: { id: courseId },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("Course approval error:", error);
    return NextResponse.json(
      { error: "Failed to approve course" },
      { status: 500 }
    );
  }
}