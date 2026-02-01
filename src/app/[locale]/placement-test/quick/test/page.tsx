'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useI18n } from '@/i18n/i18n-context';
import QuestionRenderer from '@/components/placement-test/QuestionRenderer';
import {
  Clock,
  BookOpen,
  Headphones,
  ArrowRight,
  CheckCircle,
  WarningCircle,
  Spinner,
  X
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';

interface Question {
  id: string;
  question_code: string;
  skill_type: string;
  question_type: string;
  question_text: string;
  question_text_es?: string;
  passage_text?: string;
  passage_text_es?: string;
  audio_url?: string;
  options?: { id: string; text: string; text_es?: string }[];
  max_points: number;
  time_limit_seconds?: number;
}

interface SessionInfo {
  id: string;
  session_code: string;
  test_mode: string;
  skills_tested: string[];
  total_questions: number;
}

export default function QuickTestPage() {
  const { locale } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');

  const [, setSession] = useState<SessionInfo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<string | string[] | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [, setAnsweredCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Load session from storage or API
  useEffect(() => {
    const loadSession = async () => {
      if (!sessionId) {
        router.push(`/${locale}/placement-test/quick`);
        return;
      }

      try {
        // Try to get from session storage first
        const stored = sessionStorage.getItem('placement_session');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.id === sessionId) {
            setSession(parsed);
            setTotalQuestions(parsed.total_questions);
          }
        }

        // Load first question
        await loadQuestion(0);
      } catch {
        toast.error('Failed to load test session');
        router.push(`/${locale}/placement-test/quick`);
      }
    };

    loadSession();
  }, [sessionId, locale, router]);

  // Load question
  const loadQuestion = useCallback(async (index: number) => {
    if (!sessionId) return;

    setIsLoading(true);
    setCurrentAnswer(null);

    try {
      const response = await fetch(`/api/placement-test/session/${sessionId}/question?index=${index}`);
      const result = await response.json();

      if (result.success) {
        setCurrentQuestion(result.question);
        setCurrentIndex(index);
        setTotalQuestions(result.total);
        setStartTime(Date.now());
      } else {
        toast.error(result.error || 'Failed to load question');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  // Submit answer and load next question
  const submitAnswer = async () => {
    if (!sessionId || !currentQuestion || currentAnswer === null) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/placement-test/session/${sessionId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_index: currentIndex,
          answer: currentAnswer,
          time_spent_seconds: Math.floor((Date.now() - startTime) / 1000)
        })
      });

      const result = await response.json();

      if (result.success) {
        setAnsweredCount(prev => prev + 1);

        if (result.is_last || result.next_index === null) {
          // Finish test
          await finishTest();
        } else {
          // Load next question
          await loadQuestion(result.next_index);
        }
      } else {
        toast.error(result.error || 'Failed to submit answer');
      }
    } catch {
      toast.error('Network error. Your answer may not have been saved.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Finish test
  const finishTest = async () => {
    if (!sessionId) return;

    try {
      const response = await fetch(`/api/placement-test/session/${sessionId}/complete`, {
        method: 'POST'
      });

      const result = await response.json();

      if (result.success) {
        // Clear session storage
        sessionStorage.removeItem('placement_session');

        // Redirect to results
        router.push(`/${locale}/placement-test/quick/results/${result.session_code || sessionId}`);
      } else {
        toast.error(result.error || 'Failed to complete test');
      }
    } catch {
      toast.error('Network error');
    }
  };

  // Handle answer change
  const handleAnswer = (answer: string | string[]) => {
    setCurrentAnswer(answer);
  };

  // Get skill icon
  const getSkillIcon = (skill: string) => {
    switch (skill) {
      case 'reading':
        return <BookOpen size={18} />;
      case 'listening':
        return <Headphones size={18} />;
      default:
        return <BookOpen size={18} />;
    }
  };

  // Get skill color
  const getSkillColor = (skill: string) => {
    switch (skill) {
      case 'reading':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'listening':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (isLoading && !currentQuestion) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Spinner size={48} className="text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading test...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      {/* Header / Progress Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-10">
        <div className="container-authority px-4 md:px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              {currentQuestion && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getSkillColor(currentQuestion.skill_type)}`}>
                  {getSkillIcon(currentQuestion.skill_type)}
                  {currentQuestion.skill_type.charAt(0).toUpperCase() + currentQuestion.skill_type.slice(1)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Clock size={18} />
              <span className="font-mono">{formatTime(elapsedSeconds)}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-authority px-4 md:px-6 py-8">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="authority-card p-8 text-center">
              <Spinner size={32} className="text-primary animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading question...</p>
            </div>
          ) : currentQuestion ? (
            <div className="authority-card p-8">
              <QuestionRenderer
                question={currentQuestion}
                locale={locale}
                onAnswer={handleAnswer}
                currentAnswer={currentAnswer || undefined}
                disabled={isSubmitting}
              />

              {/* Submit Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={submitAnswer}
                  disabled={currentAnswer === null || isSubmitting}
                  className="btn-authority btn-primary-authority px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size={20} className="mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : currentIndex === totalQuestions - 1 ? (
                    <>
                      <CheckCircle size={20} className="mr-2" />
                      Finish Test
                    </>
                  ) : (
                    <>
                      Next Question
                      <ArrowRight size={20} className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="authority-card p-8 text-center">
              <WarningCircle size={48} className="text-amber-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No question available. Please try again.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Finish Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="authority-card p-8 max-w-md w-full">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <div className="text-center">
              <WarningCircle size={48} className="text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Finish Test?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to finish? You cannot change your answers after submitting.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 btn-authority btn-secondary-authority justify-center"
                >
                  Cancel
                </button>
                <button
                  onClick={finishTest}
                  className="flex-1 btn-authority btn-primary-authority justify-center"
                >
                  Finish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
