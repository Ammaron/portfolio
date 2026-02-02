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
  X,
  Keyboard
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
  const [showKeyboardHint, setShowKeyboardHint] = useState(true);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  // Hide keyboard hint after 10 seconds
  useEffect(() => {
    const timeout = setTimeout(() => setShowKeyboardHint(false), 10000);
    return () => clearTimeout(timeout);
  }, []);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get timer color based on elapsed time
  const getTimerColor = (seconds: number) => {
    if (seconds < 600) return 'text-green-600 dark:text-green-400'; // < 10 min
    if (seconds < 1200) return 'text-yellow-600 dark:text-yellow-400'; // < 20 min
    if (seconds < 1500) return 'text-orange-600 dark:text-orange-400'; // < 25 min
    return 'text-red-600 dark:text-red-400 animate-pulse'; // > 25 min
  };

  // Get timer background
  const getTimerBg = (seconds: number) => {
    if (seconds < 600) return 'bg-green-100 dark:bg-green-900/30';
    if (seconds < 1200) return 'bg-yellow-100 dark:bg-yellow-900/30';
    if (seconds < 1500) return 'bg-orange-100 dark:bg-orange-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  // Load session from storage or API
  useEffect(() => {
    const loadSession = async () => {
      if (!sessionId) {
        router.push(`/${locale}/placement-test/quick`);
        return;
      }

      try {
        // First, check session state by requesting index 0
        const response = await fetch(`/api/placement-test/session/${sessionId}/question?index=0`);
        const data = await response.json();

        if (data.success) {
          // Use the server's first_unanswered_index to resume at correct position
          const startIndex = data.first_unanswered_index ?? 0;
          setTotalQuestions(data.total);

          // If all questions answered, go to results
          if (startIndex >= data.total) {
            router.push(`/${locale}/placement-test/quick/results/${sessionId}`);
            return;
          }

          // Load the first unanswered question
          await loadQuestion(startIndex);
        } else {
          toast.error(data.error || 'Failed to load session');
          router.push(`/${locale}/placement-test/quick`);
        }
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

  // Submit answer and load next question (optimized - next question included in response)
  const submitAnswer = useCallback(async () => {
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
          await finishTest();
        } else if (result.next_question) {
          // Use the next question from the response (no second API call needed)
          setCurrentQuestion(result.next_question);
          setCurrentIndex(result.next_index);
          setTotalQuestions(result.total_questions || totalQuestions);
          setCurrentAnswer(null);
          setStartTime(Date.now());
        } else {
          // Fallback to loading question if not included in response
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
  }, [sessionId, currentQuestion, currentAnswer, currentIndex, startTime, loadQuestion, totalQuestions]);

  // Finish test
  const finishTest = async () => {
    if (!sessionId) return;

    try {
      const response = await fetch(`/api/placement-test/session/${sessionId}/complete`, {
        method: 'POST'
      });

      const result = await response.json();

      if (result.success) {
        sessionStorage.removeItem('placement_session');
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
        return <BookOpen size={18} weight="bold" />;
      case 'listening':
        return <Headphones size={18} weight="bold" />;
      default:
        return <BookOpen size={18} weight="bold" />;
    }
  };

  // Get skill color
  const getSkillColor = (skill: string) => {
    switch (skill) {
      case 'reading':
        return 'bg-blue-500 text-white';
      case 'listening':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Calculate progress percentage
  const progressPercent = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

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
      {/* Header / Progress Bar - Improved */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-5">
          {/* Top row: Question counter, skill, timer */}
          <div className="flex items-center justify-between mb-4">
            {/* Left: Question counter + Skill badge */}
            <div className="flex items-center gap-5">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {currentIndex + 1}
                </span>
                <span className="text-xl text-gray-400 dark:text-gray-500 mx-1">/</span>
                <span className="text-xl text-gray-500 dark:text-gray-400">
                  {totalQuestions}
                </span>
              </div>
              {currentQuestion && (
                <span className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 uppercase tracking-wide ${getSkillColor(currentQuestion.skill_type)}`}>
                  {getSkillIcon(currentQuestion.skill_type)}
                  {currentQuestion.skill_type}
                </span>
              )}
            </div>

            {/* Right: Timer with color coding */}
            <div className={`flex items-center gap-3 px-5 py-2.5 rounded-xl font-mono text-xl font-bold transition-all ${getTimerBg(elapsedSeconds)} ${getTimerColor(elapsedSeconds)}`}>
              <Clock size={24} weight="bold" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>
          </div>

          {/* Progress bar - More visible with percentage on right */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-sm font-bold text-primary min-w-[3rem] text-right">
              {Math.round(progressPercent)}%
            </span>
          </div>
        </div>
      </div>

      {/* Keyboard shortcut hint banner */}
      {showKeyboardHint && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800">
          <div className="container-authority px-4 md:px-6 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                <Keyboard size={18} />
                <span>
                  <strong>Tip:</strong> Use keyboard shortcuts! Press <kbd className="px-1.5 py-0.5 bg-blue-200 dark:bg-blue-800 rounded text-xs font-mono">1-9</kbd> to select, <kbd className="px-1.5 py-0.5 bg-blue-200 dark:bg-blue-800 rounded text-xs font-mono">Enter</kbd> to continue
                </span>
              </div>
              <button
                onClick={() => setShowKeyboardHint(false)}
                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container-authority px-4 md:px-6 py-8">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="authority-card p-8 text-center">
              <Spinner size={32} className="text-primary animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading question...</p>
            </div>
          ) : currentQuestion ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
              <QuestionRenderer
                question={currentQuestion}
                locale={locale}
                onAnswer={handleAnswer}
                currentAnswer={currentAnswer || undefined}
                disabled={isSubmitting}
                onSubmit={currentAnswer !== null ? submitAnswer : undefined}
              />

              {/* Submit Button - Enhanced with answer state indicator */}
              <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                {/* Answer status indicator */}
                <div className="flex items-center gap-2">
                  {currentAnswer !== null ? (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle size={20} weight="fill" />
                      <span className="text-sm font-medium">Answer selected</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                      <WarningCircle size={20} />
                      <span className="text-sm">Select an answer to continue</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={submitAnswer}
                  disabled={currentAnswer === null || isSubmitting}
                  className={`btn-authority px-8 py-3 font-semibold transition-all duration-200 ${
                    currentAnswer !== null
                      ? 'btn-primary-authority shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
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
          <div className="authority-card p-8 max-w-md w-full relative">
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
