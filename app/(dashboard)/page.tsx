import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EnrolledCourses } from "@/components/dashboard/enrolled-courses";
import { ProgressStats } from "@/components/dashboard/progress-stats";
import { RecommendedCourses } from "@/components/dashboard/recommended-courses";

export default async function DashboardPage() {
  const user = await requireAuth();

  const [enrollments, stats] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId: user.id },
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
      orderBy: { lastAccessedAt: "desc" },
    }),
    prisma.lessonProgress.aggregate({
      where: {
        userId: user.id,
        completed: true,
      },
      _count: true,
    }),
  ]);

  const totalLessonsCompleted = stats._count || 0;
  const totalCoursesEnrolled = enrollments.length;
  const coursesCompleted = enrollments.filter((e) => e.completedAt).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name || "Learner"}! 👋
          </h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>

        {/* Stats Grid */}
        <ProgressStats
          lessonsCompleted={totalLessonsCompleted}
          coursesEnrolled={totalCoursesEnrolled}
          coursesCompleted={coursesCompleted}
        />

        {/* Enrolled Courses */}
        <div className="mt-8">
          <EnrolledCourses enrollments={enrollments} />
        </div>

        {/* Recommended Courses */}
        <div className="mt-8">
          <RecommendedCourses />
        </div>
      </main>
    </div>
  );
}