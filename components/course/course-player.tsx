"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoPlayer } from "./video-player";
import { QuizComponent } from "./quiz-component";

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl: string | null;
  duration: number | null;
  order: number;
  quizzes: Quiz[];
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  questions: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string | null;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: Lesson[];
}

interface CoursePlayerProps {
  courseId: string;
  modules: Module[];
  currentLessonId?: string;
  progress: number;
}

export function CoursePlayer({ courseId, modules, currentLessonId, progress }: CoursePlayerProps) {
  const router = useRouter();
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentLessonId) {
      for (const module of modules) {
        const lesson = module.lessons.find((l) => l.id === currentLessonId);
        if (lesson) {
          setCurrentLesson(lesson);
          setCurrentModule(module);
          break;
        }
      }
    } else if (modules.length > 0 && modules[0].lessons.length > 0) {
      setCurrentLesson(modules[0].lessons[0]);
      setCurrentModule(modules[0]);
    }
  }, [currentLessonId, modules]);

  const handleLessonComplete = async () => {
    if (!currentLesson) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/progress/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: currentLesson.id,
          completed: true,
        }),
      });

      if (response.ok) {
        setLessonCompleted(true);
        if (currentLesson.quizzes.length > 0) {
          setShowQuiz(true);
        }
      }
    } catch (error) {
      console.error("Failed to mark lesson complete:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextLesson = () => {
    if (!currentModule || !currentLesson) return;

    const currentLessonIndex = currentModule.lessons.findIndex((l) => l.id === currentLesson.id);
    
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      // Next lesson in same module
      const nextLesson = currentModule.lessons[currentLessonIndex + 1];
      router.push(`/courses/${courseId}/lessons/${nextLesson.id}`);
    } else {
      // Find next module
      const currentModuleIndex = modules.findIndex((m) => m.id === currentModule.id);
      if (currentModuleIndex < modules.length - 1) {
        const nextModule = modules[currentModuleIndex + 1];
        if (nextModule.lessons.length > 0) {
          router.push(`/courses/${courseId}/lessons/${nextModule.lessons[0].id}`);
        }
      } else {
        // Course completed
        router.push(`/courses/${courseId}/complete`);
      }
    }
  };

  if (!currentLesson) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">{currentModule?.title}</h2>
          <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
          {/* Video/Content Area */}
          <div className="lg:col-span-2 bg-black flex items-center justify-center">
            {currentLesson.videoUrl ? (
              <VideoPlayer
                videoUrl={currentLesson.videoUrl}
                lessonId={currentLesson.id}
                onVideoComplete={handleLessonComplete}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#1e3a8f] to-[#1e3a8f]/80 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                  <h3 className="text-2xl font-bold mb-2">Text Lesson</h3>
                  <p className="text-blue-100">Read the content below to continue</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Lesson Content & Tabs */}
          <div className="bg-gray-50 border-l border-gray-200 overflow-y-auto">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{currentLesson.title}</h1>
              
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content" className="space-y-4 mt-4">
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                  />

                  {!lessonCompleted && (
                    <Button
                      onClick={handleLessonComplete}
                      disabled={isLoading}
                      className="w-full bg-[#1e3a8f] hover:bg-[#1e3a8f]/90 text-white"
                    >
                      {isLoading ? "Saving..." : "Mark as Complete"}
                    </Button>
                  )}

                  {lessonCompleted && !showQuiz && (
                    <div className="space-y-2">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <svg className="w-12 h-12 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <p className="text-green-800 font-semibold">Lesson Complete!</p>
                      </div>
                      <Button
                        onClick={handleNextLesson}
                        className="w-full bg-[#d4af37] hover:bg-[#d4af37]/90 text-[#1e3a8f] font-semibold"
                      >
                        Next Lesson →
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="notes" className="mt-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-4 min-h-[200px]">
                    <textarea
                      className="w-full h-full min-h-[180px] resize-none border-0 focus:ring-0 text-sm"
                      placeholder="Take notes while you learn..."
                    />
                  </div>
                </TabsContent>

                <TabsContent value="resources" className="mt-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500 text-center py-8">
                      No additional resources for this lesson
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && currentLesson.quizzes.length > 0 && (
        <QuizComponent
          quiz={currentLesson.quizzes[0]}
          onComplete={(passed) => {
            setShowQuiz(false);
            if (passed) {
              handleNextLesson();
            }
          }}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </div>
  );
}