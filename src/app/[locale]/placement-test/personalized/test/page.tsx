'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useI18n } from '@/i18n/i18n-context';
import QuestionRenderer from '@/components/placement-test/QuestionRenderer';
import {
  Clock,
  BookOpen,
  Headphones,
  PencilSimple,
  Microphone,
  ArrowRight,
  CheckCircle,
  WarningCircle,
  Spinner,
  X,
  Pause,
  Copy
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
  student_name: string;
}

export default function PersonalizedTestPage() {
  const { locale } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');

  const [session, setSession] = useState<SessionInfo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<string | string[] | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [, setAnsweredCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [baseTimeSeconds, setBaseTimeSeconds] = useState(0);
  const [codeCopied, setCodeCopied] = useState(false);

  // Timer - accounts for previously accumulated time on resume
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(baseTimeSeconds + Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, baseTimeSeconds]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get timer color based on elapsed time
  const getTimerColor = (seconds: number) => {
    if (seconds < 1800) return 'text-green-600 dark:text-green-400'; // < 30 min
    if (seconds < 2700) return 'text-yellow-600 dark:text-yellow-400'; // < 45 min
    if (seconds < 3600) return 'text-orange-600 dark:text-orange-400'; // < 60 min
    return 'text-red-600 dark:text-red-400 animate-pulse'; // > 60 min
  };

  const getTimerBg = (seconds: number) => {
    if (seconds < 1800) return 'bg-green-100 dark:bg-green-900/30';
    if (seconds < 2700) return 'bg-yellow-100 dark:bg-yellow-900/30';
    if (seconds < 3600) return 'bg-orange-100 dark:bg-orange-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  // Load session
  useEffect(() => {
    const loadSession = async () => {
      if (!sessionId) {
        router.push(`/${locale}/placement-test/personalized`);
        return;
      }

      try {
        const stored = sessionStorage.getItem('placement_session');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.id === sessionId) {
            setSession(parsed);
            setAnsweredCount(parsed.questions_answered || 0);
            // Restore progress state immediately for visual feedback
            if (parsed.total_questions) setTotalQuestions(parsed.total_questions);
            if (parsed.current_question_index) setCurrentIndex(parsed.current_question_index);
            // Restore accumulated time from previous session
            if (parsed.time_spent_seconds) {
              setBaseTimeSeconds(parsed.time_spent_seconds);
              setElapsedSeconds(parsed.time_spent_seconds);
            }
          }
        }

        // Query server for the first unanswered question index
        const response = await fetch(`/api/placement-test/session/${sessionId}/question?index=0`);
        const data = await response.json();

        if (data.success) {
          const startIndex = data.first_unanswered_index ?? 0;
          setTotalQuestions(data.total);

          // If all questions answered, go to results
          if (startIndex >= data.total) {
            router.push(`/${locale}/placement-test/personalized/results/${sessionId}`);
            return;
          }

          // Load the first unanswered question
          await loadQuestion(startIndex);
        } else {
          toast.error(data.error || 'Failed to load session');
          router.push(`/${locale}/placement-test/personalized`);
        }
      } catch {
        toast.error('Failed to load test session');
        router.push(`/${locale}/placement-test/personalized`);
      }
    };

    loadSession();
  }, [sessionId, locale, router]);

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
          setShowConfirmModal(true);
        } else {
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

  const finishTest = async () => {
    if (!sessionId) return;

    try {
      const response = await fetch(`/api/placement-test/session/${sessionId}/complete`, {
        method: 'POST'
      });

      const result = await response.json();

      if (result.success) {
        sessionStorage.removeItem('placement_session');
        router.push(`/${locale}/placement-test/personalized/results/${result.session_code || sessionId}`);
      } else {
        toast.error(result.error || 'Failed to complete test');
      }
    } catch {
      toast.error('Network error');
    }
  };

  const handleAnswer = (answer: string | string[]) => {
    setCurrentAnswer(answer);
  };

  const copySessionCode = () => {
    if (session?.session_code) {
      navigator.clipboard.writeText(session.session_code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const getSkillIcon = (skill: string) => {
    const icons: Record<string, React.ReactNode> = {
      reading: <BookOpen size={18} />,
      listening: <Headphones size={18} />,
      writing: <PencilSimple size={18} />,
      speaking: <Microphone size={18} />
    };
    return icons[skill] || <BookOpen size={18} />;
  };

  const getSkillColor = (skill: string) => {
    const colors: Record<string, string> = {
      reading: 'bg-blue-500 text-white',
      listening: 'bg-purple-500 text-white',
      writing: 'bg-amber-500 text-white',
      speaking: 'bg-pink-500 text-white'
    };
    return colors[skill] || 'bg-gray-500 text-white';
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
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-5">
          {/* Top row: Question counter, skill, pause, timer */}
          <div className="flex items-center justify-between mb-4">
            {/* Left: Question counter + Skill badge */}
            <div className="flex items-center gap-5">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {currentIndex + 1}
                </span>
                <span className="text-xl text-gray-500 dark:text-gray-400 mx-1">/</span>
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

            {/* Right: Pause + Timer */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowPauseModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary transition-colors"
              >
                <Pause size={18} weight="bold" />
                Pause
              </button>
              <div className={`flex items-center gap-3 px-5 py-2.5 rounded-xl font-mono text-xl font-bold transition-all ${getTimerBg(elapsedSeconds)} ${getTimerColor(elapsedSeconds)}`}>
                <Clock size={24} weight="bold" />
                <span>{formatTime(elapsedSeconds)}</span>
              </div>
            </div>
          </div>

          {/* Progress bar with percentage */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
                style={{ width: `${totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0}%` }}
              />
            </div>
            <span className="text-sm font-bold text-primary min-w-[3rem] text-right">
              {totalQuestions > 0 ? Math.round(((currentIndex + 1) / totalQuestions) * 100) : 0}%
            </span>
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
                No question available.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pause Modal */}
      {showPauseModal && session && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="authority-card p-8 max-w-md w-full">
            <button
              onClick={() => setShowPauseModal(false)}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>

            <div className="text-center">
              <Pause size={48} className="text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Test Paused
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your progress has been saved. Use this code to resume later:
              </p>

              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Session Code</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-2xl font-mono font-bold text-primary">
                    {session.session_code}
                  </code>
                  <button
                    onClick={copySessionCode}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                  >
                    <Copy size={20} className={codeCopied ? 'text-green-500' : 'text-gray-600 dark:text-gray-400'} />
                  </button>
                </div>
                {codeCopied && (
                  <p className="text-sm text-green-500 mt-2">Copied!</p>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowPauseModal(false)}
                  className="w-full btn-authority btn-primary-authority justify-center"
                >
                  Continue Test
                </button>
                <button
                  onClick={() => router.push(`/${locale}/placement-test`)}
                  className="w-full btn-authority btn-secondary-authority justify-center"
                >
                  Exit (Resume Later)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Finish Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="authority-card p-8 max-w-md w-full">
            <div className="text-center">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Ready to Submit?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You have completed all questions. Your writing and speaking responses will be reviewed by an expert within 24-48 hours.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 btn-authority btn-secondary-authority justify-center"
                >
                  Review Answers
                </button>
                <button
                  onClick={finishTest}
                  className="flex-1 btn-authority btn-primary-authority justify-center"
                >
                  Submit Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
