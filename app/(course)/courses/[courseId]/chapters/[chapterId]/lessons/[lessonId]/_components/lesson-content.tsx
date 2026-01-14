"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lesson, Chapter } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Lock } from "lucide-react";
import { toast } from "sonner";

type LessonWithChapter = Lesson & {
  chapter: Chapter;
};

interface LessonContentProps {
  lesson: LessonWithChapter;
  courseId: string;
  chapterId: string;
  isCompleted: boolean;
  isLocked: boolean;
}

// Extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

export function LessonContent({
  lesson,
  courseId,
  chapterId,
  isCompleted,
  isLocked,
}: LessonContentProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onToggleComplete() {
    try {
      setIsLoading(true);

      await fetch(`/api/courses/${courseId}/chapters/${chapterId}/lessons/${lesson.id}/progress`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !isCompleted }),
      });

      toast.success(isCompleted ? "Marked as incomplete" : "Marked as complete");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  const videoId = lesson.videoUrl ? getYouTubeVideoId(lesson.videoUrl) : null;

  return (
    <div className="flex flex-col h-full">
      {/* Video/Content Area */}
      <div className="relative aspect-video bg-slate-900">
        {isLocked ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-slate-800">
            <Lock className="h-12 w-12 mb-4" />
            <p className="text-lg font-semibold">This lesson is locked</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please enroll in the course to access this lesson
            </p>
          </div>
        ) : !videoId ? (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <p className="text-lg">No video available for this lesson</p>
              <p className="text-sm text-muted-foreground mt-2">
                The instructor hasn't uploaded a video yet
              </p>
            </div>
          </div>
        ) : (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?rel=0`}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      {/* Lesson Info */}
      <div className="p-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
          {!isLocked && (
            <Button
              onClick={onToggleComplete}
              disabled={isLoading}
              variant={isCompleted ? "outline" : "default"}
            >
              {isCompleted ? (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Mark as Incomplete
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Complete
                </>
              )}
            </Button>
          )}
        </div>

        {lesson.description && (
          <div className="prose max-w-none">
            <p className="text-muted-foreground">{lesson.description}</p>
          </div>
        )}

        {!lesson.description && (
          <p className="text-sm text-muted-foreground italic">
            No description available
          </p>
        )}
      </div>
    </div>
  );
}
