"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  title: string;
  instructor: {
    name: string | null;
    email: string | null;
  };
  _count: {
    modules: number;
  };
  createdAt: Date;
}

interface CourseApprovalsProps {
  courses: Course[];
}

export function CourseApprovals({ courses }: CourseApprovalsProps) {
  const router = useRouter();
  const [processing, setProcessing] = useState<string | null>(null);

  const handleApprove = async (courseId: string) => {
    setProcessing(courseId);
    try {
      const response = await fetch(`/api/admin/courses/${courseId}/approve`, {
        method: "POST",
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Approval error:", error);
    } finally {
      setProcessing(null);
    }
  };

  if (courses.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Course Approvals</h2>
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p>No courses pending approval</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Pending Course Approvals ({courses.length})
      </h2>
      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-[#1e3a8f] transition-colors"
          >
            <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <span>By {course.instructor.name || course.instructor.email}</span>
              <span>{course._count.modules} modules</span>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={() => handleApprove(course.id)}
                disabled={processing === course.id}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {processing === course.id ? "Approving..." : "Approve"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push(`/admin/courses/${course.id}`)}
              >
                Review
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}