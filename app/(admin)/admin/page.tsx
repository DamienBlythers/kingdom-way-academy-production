import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { AdminStats } from "@/components/admin/admin-stats";
import { RecentUsers } from "@/components/admin/recent-users";
import { CourseApprovals } from "@/components/admin/course-approvals";

export default async function AdminDashboard() {
  await requireAdmin();

  const [stats, recentUsers, pendingCourses] = await Promise.all([
    // Get platform stats
    prisma.$transaction([
      prisma.user.count(),
      prisma.course.count({ where: { status: "PUBLISHED" } }),
      prisma.enrollment.count(),
      prisma.user.count({ where: { subscriptionStatus: "ACTIVE" } }),
    ]),
    // Get recent users
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        subscriptionStatus: true,
      },
    }),
    // Get pending courses
    prisma.course.findMany({
      where: { status: "DRAFT" },
      include: {
        instructor: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            modules: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const [totalUsers, totalCourses, totalEnrollments, activeSubscribers] = stats;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage platform operations and content</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#1e3a8f] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-[#d4af37]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <AdminStats
          totalUsers={totalUsers}
          totalCourses={totalCourses}
          totalEnrollments={totalEnrollments}
          activeSubscribers={activeSubscribers}
        />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Recent Users */}
          <RecentUsers users={recentUsers} />

          {/* Course Approvals */}
          <CourseApprovals courses={pendingCourses} />
        </div>
      </main>
    </div>
  );
}