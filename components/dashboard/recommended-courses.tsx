import Link from "next/link";
import { Button } from "@/components/ui/button";

export function RecommendedCourses() {
  // In production, fetch from API based on user interests
  const recommendedCourses = [
    {
      id: "1",
      title: "Biblical Leadership Foundations",
      description: "Discover timeless leadership principles from Scripture",
      thumbnail: null,
      instructor: "Dr. Sarah Johnson",
      duration: "6 weeks",
    },
    {
      id: "2",
      title: "Faith in the Workplace",
      description: "Integrating Christian values in professional settings",
      thumbnail: null,
      instructor: "Pastor Michael Chen",
      duration: "4 weeks",
    },
    {
      id: "3",
      title: "Spiritual Growth & Discipline",
      description: "Building lasting habits for spiritual maturity",
      thumbnail: null,
      instructor: "Rev. Emily Rodriguez",
      duration: "8 weeks",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
        <Link href="/courses">
          <Button variant="outline" size="sm">
            View All Courses
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendedCourses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-video bg-gradient-to-br from-[#1e3a8f] to-[#1e3a8f]/80 flex items-center justify-center">
              <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>

            <div className="p-5">
              <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-[#1e3a8f] transition-colors line-clamp-2">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {course.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{course.instructor}</span>
                <span>{course.duration}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}