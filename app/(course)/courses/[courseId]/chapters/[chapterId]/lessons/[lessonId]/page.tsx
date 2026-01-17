import { redirect } from "next/navigation";
import { auth } from "@/lib/clerk-auth-helper";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { LessonContent } from "./_components/lesson-content";
import { LessonSidebar } from "./_components/lesson-sidebar";
import { LabSubmission } from "./_components/lab-submission";

interface LessonPageProps {
  params: Promise<{
    courseId: string;
    chapterId: string;
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseId, chapterId, lessonId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Get course with all chapters and lessons
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
      isPublished: true,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
        include: {
          lessons: {
            where: {
              isPublished: true,
            },
            orderBy: {
              position: "asc",
            },
          },
        },
      },
    },
  });

  if (!course) {
    redirect("/browse");
  }

  // Get current lesson with Kingdom Labs
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
      chapterId,
      isPublished: true,
    },
    include: {
      chapter: true,
      kingdomLabs: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!lesson) {
    redirect(`/courses/${courseId}`);
  }

  // Check enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId,
      },
    },
  });

  // Check if lesson is accessible (enrolled OR free chapter)
  const isAccessible = enrollment || lesson.chapter.isFree;

  if (!isAccessible) {
    redirect(`/courses/${courseId}`);
  }

  // Get user progress
  const userProgress = await prisma.userProgress.findUnique({
    where: {
      userId_lessonId: {
        userId: session.user.id,
        lessonId,
      },
    },
  });

  // Get lab submissions for this user
  const labSubmissions = await prisma.labSubmission.findMany({
    where: {
      userId: session.user.id,
      labId: {
        in: lesson.kingdomLabs.map((lab) => lab.id),
      },
    },
  });

  // Create a map of lab submissions by labId
  const submissionMap = new Map(
    labSubmissions.map((sub) => [sub.labId, sub])
  );

  return (
    <div className="h-full flex">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <LessonContent
          lesson={lesson}
          courseId={courseId}
          chapterId={chapterId}
          isCompleted={!!userProgress?.isCompleted}
          isLocked={!lesson.isFree && !enrollment}
        />

        {/* Kingdom Labs Section */}
        {lesson.kingdomLabs.length > 0 && (
          <div className="max-w-4xl mx-auto px-6 pb-10">
            <div className="mt-8 space-y-6">
              {lesson.kingdomLabs.map((lab) => {
                const existingSubmission = submissionMap.get(lab.id);
                
                return (
                  <LabSubmission
                    key={lab.id}
                    lab={lab}
                    existingSubmission={existingSubmission}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="hidden md:flex md:w-80 flex-col border-l">
        <LessonSidebar
          course={course}
          currentLessonId={lessonId}
          currentChapterId={chapterId}
        />
      </div>
    </div>
  );
}
