"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string | null;
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  passingScore: number;
  questions: QuizQuestion[];
}

interface QuizComponentProps {
  quiz: Quiz;
  onComplete: (passed: boolean) => void;
  onClose: () => void;
}

export function QuizComponent({ quiz, onComplete, onClose }: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleAnswerSelect = (answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      calculateScore();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const calculateScore = async () => {
    let correct = 0;
    quiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });

    const percentage = (correct / quiz.questions.length) * 100;
    setScore(percentage);
    setShowResults(true);

    // Submit quiz attempt to backend
    try {
      await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quiz.id,
          answers,
          score: percentage,
        }),
      });
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    }
  };

  const passed = score >= quiz.passingScore;

  if (showResults) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
          <div className="text-center">
            {passed ? (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Congratulations!</h2>
                <p className="text-gray-600 mb-6">You passed the quiz!</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Almost There!</h2>
                <p className="text-gray-600 mb-6">You need {quiz.passingScore}% to pass</p>
              </>
            )}

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-5xl font-bold text-[#1e3a8f] mb-2">{Math.round(score)}%</p>
              <p className="text-sm text-gray-600">
                {quiz.questions.filter((q) => answers[q.id] === q.correctAnswer).length} of {quiz.questions.length} correct
              </p>
            </div>

            <div className="space-y-2">
              {passed ? (
                <Button
                  onClick={() => onComplete(true)}
                  className="w-full bg-[#d4af37] hover:bg-[#d4af37]/90 text-[#1e3a8f] font-semibold"
                >
                  Continue to Next Lesson
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setShowResults(false);
                    setCurrentQuestionIndex(0);
                    setAnswers({});
                  }}
                  className="w-full bg-[#1e3a8f] hover:bg-[#1e3a8f]/90 text-white font-semibold"
                >
                  Try Again
                </Button>
              )}
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e3a8f] to-[#1e3a8f]/90 px-8 py-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-white">{quiz.title}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-between text-sm text-blue-100">
            <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
            <span>Passing Score: {quiz.passingScore}%</span>
          </div>
          <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#d4af37] h-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQuestion.question}
          </h3>

          <RadioGroup
            value={answers[currentQuestion.id] || ""}
            onValueChange={handleAnswerSelect}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  answers[currentQuestion.id] === option
                    ? "border-[#1e3a8f] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer text-gray-700"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 flex items-center justify-between border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            ← Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
            className="bg-[#1e3a8f] hover:bg-[#1e3a8f]/90 text-white"
          >
            {isLastQuestion ? "Submit Quiz" : "Next →"}
          </Button>
        </div>
      </div>
    </div>
  );
}