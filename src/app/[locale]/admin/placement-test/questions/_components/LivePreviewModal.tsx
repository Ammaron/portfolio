'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  X,
  Eye,
  BookOpen,
  Headphones,
  PencilLine,
  MicrophoneStage,
  CheckCircle,
  WarningCircle,
  ArrowRight,
  ArrowsClockwise,
  Check,
  XCircle,
  Translate,
  Info
} from '@phosphor-icons/react';
import QuestionRenderer from '@/components/placement-test/QuestionRenderer';
import { Question, getSkillColor, getLevelColor, getQuestionTypeLabel } from './types';

interface LivePreviewModalProps {
  question: Question;
  open: boolean;
  onClose: () => void;
}

export default function LivePreviewModal({ question, open, onClose }: LivePreviewModalProps) {
  const [currentAnswer, setCurrentAnswer] = useState<string | string[] | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [locale, setLocale] = useState<'en' | 'es'>('en');

  // Map admin Question type to QuestionRenderer's expected shape
  const rendererQuestion = useMemo(() => ({
    id: question.id,
    question_code: question.question_code,
    skill_type: question.skill_type,
    question_type: question.question_type,
    question_text: question.question_text,
    passage_text: question.passage_text,
    audio_url: question.audio_url,
    image_url: question.image_url,
    options: question.options,
    max_points: question.max_points,
  }), [question]);

  const handleAnswer = useCallback((answer: string | string[]) => {
    setCurrentAnswer(answer);
  }, []);

  const handleSubmit = useCallback(() => {
    if (currentAnswer !== null) {
      setSubmitted(true);
    }
  }, [currentAnswer]);

  const handleReset = useCallback(() => {
    setCurrentAnswer(null);
    setSubmitted(false);
  }, []);

  // Check if the answer is correct
  const isCorrect = useMemo(() => {
    if (!submitted || currentAnswer === null) return null;

    const correctAnswer = question.correct_answer;
    const qType = question.question_type;

    if (qType === 'mcq' || qType === 'true_false' || qType === 'gap_fill') {
      // Simple string comparison (case-insensitive for gap_fill)
      const given = typeof currentAnswer === 'string' ? currentAnswer : '';
      if (qType === 'gap_fill') {
        // Gap fill may have pipe-separated answers with semicolon alternatives
        const givenParts = given.split('|').map(s => s.trim().toLowerCase());
        const correctParts = correctAnswer.split('|').map(s => s.trim().toLowerCase());
        return givenParts.every((gp, i) => {
          if (!correctParts[i]) return false;
          const alternatives = correctParts[i].split(';').map(a => a.trim().toLowerCase());
          return alternatives.includes(gp);
        });
      }
      return given === correctAnswer;
    }

    if (qType === 'true_false_multi') {
      // Compare id:value pairs
      const givenArr = Array.isArray(currentAnswer) ? currentAnswer : [];
      const givenMap = new Map<string, string>();
      givenArr.forEach(s => {
        const [id, val] = s.split(':');
        givenMap.set(id, val);
      });
      const correctPairs = correctAnswer.split(',').map(p => p.trim());
      return correctPairs.every(pair => {
        const [id, val] = pair.split(':');
        return givenMap.get(id) === val;
      });
    }

    if (qType === 'matching') {
      // Compare id:id pairs
      const givenArr = Array.isArray(currentAnswer) ? currentAnswer : [];
      const correctPairs = new Set(correctAnswer.split(',').map(p => p.trim()));
      if (givenArr.length !== correctPairs.size) return false;
      return givenArr.every(pair => correctPairs.has(pair.trim()));
    }

    // Open response / speaking - can't auto-check
    return null;
  }, [submitted, currentAnswer, question]);

  // Get skill icon and color
  const getSkillIcon = (skill: string) => {
    switch (skill) {
      case 'reading': return <BookOpen size={18} weight="bold" />;
      case 'listening': return <Headphones size={18} weight="bold" />;
      case 'writing': return <PencilLine size={18} weight="bold" />;
      case 'speaking': return <MicrophoneStage size={18} weight="bold" />;
      default: return <BookOpen size={18} weight="bold" />;
    }
  };

  const getSkillBadgeColor = (skill: string) => {
    switch (skill) {
      case 'reading': return 'bg-blue-500 text-white';
      case 'listening': return 'bg-purple-500 text-white';
      case 'writing': return 'bg-amber-500 text-white';
      case 'speaking': return 'bg-pink-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal content - full screen feel */}
      <div className="relative z-10 flex flex-col w-full h-full max-w-5xl mx-auto">
        {/* Top bar - admin controls (dark, clearly admin) */}
        <div className="bg-slate-900 border-b border-slate-700 px-4 py-2 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Eye size={20} className="text-amber-400" />
            <span className="text-sm font-bold text-amber-400 uppercase tracking-wide">Live Preview</span>
            <span className="text-slate-500">|</span>
            <code className="text-xs bg-slate-700 text-gray-300 px-2 py-0.5 rounded font-mono">
              {question.question_code}
            </code>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSkillColor(question.skill_type)}`}>
              {question.skill_type}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getLevelColor(question.cefr_level)}`}>
              {question.cefr_level}
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-600/50 text-gray-300">
              {getQuestionTypeLabel(question.question_type)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Locale toggle */}
            <button
              onClick={() => setLocale(locale === 'en' ? 'es' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer"
              title="Toggle language"
            >
              <Translate size={14} />
              {locale === 'en' ? 'EN' : 'ES'}
            </button>
            {/* Reset */}
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer"
              title="Reset answer"
            >
              <ArrowsClockwise size={14} />
              Reset
            </button>
            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Student-facing area - exact replica of what students see */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {/* Simulated test header - matches quick test UI */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="max-w-4xl mx-auto px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">1</span>
                    <span className="text-xl text-gray-400 dark:text-gray-500 mx-1">/</span>
                    <span className="text-xl text-gray-500 dark:text-gray-400">1</span>
                  </div>
                  <span className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 uppercase tracking-wide ${getSkillBadgeColor(question.skill_type)}`}>
                    {getSkillIcon(question.skill_type)}
                    {question.skill_type}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm">
                  <Info size={16} />
                  <span>Preview Mode</span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
                    style={{ width: submitted ? '100%' : '50%' }}
                  />
                </div>
                <span className="text-sm font-bold text-primary min-w-[3rem] text-right">
                  {submitted ? '100' : '50'}%
                </span>
              </div>
            </div>
          </div>

          {/* Question content - matches quick test layout */}
          <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
              <QuestionRenderer
                question={rendererQuestion}
                locale={locale}
                onAnswer={handleAnswer}
                currentAnswer={currentAnswer || undefined}
                disabled={submitted}
                onSubmit={currentAnswer !== null && !submitted ? handleSubmit : undefined}
              />

              {/* Submit / Result area */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                {submitted ? (
                  <div className="space-y-4">
                    {/* Result banner */}
                    {isCorrect === true && (
                      <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                        <Check size={24} weight="bold" className="text-green-600 dark:text-green-400 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-green-700 dark:text-green-300">Correct!</p>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            The answer matches the expected correct answer.
                          </p>
                        </div>
                      </div>
                    )}
                    {isCorrect === false && (
                      <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                        <XCircle size={24} weight="bold" className="text-red-600 dark:text-red-400 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-red-700 dark:text-red-300">Incorrect</p>
                          <p className="text-sm text-red-600 dark:text-red-400">
                            Expected: <code className="bg-red-100 dark:bg-red-900/40 px-1.5 py-0.5 rounded text-xs">{question.correct_answer}</code>
                          </p>
                        </div>
                      </div>
                    )}
                    {isCorrect === null && (
                      <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                        <Info size={24} weight="bold" className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-blue-700 dark:text-blue-300">Submitted</p>
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            This question type requires manual review. Rubric/criteria: <code className="bg-blue-100 dark:bg-blue-900/40 px-1.5 py-0.5 rounded text-xs">{question.correct_answer}</code>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Answer details */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Your answer:</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-mono break-all">
                        {Array.isArray(currentAnswer) ? currentAnswer.join(', ') : currentAnswer}
                      </p>
                    </div>

                    {/* Try again button */}
                    <div className="flex justify-end">
                      <button
                        onClick={handleReset}
                        className="btn-authority btn-secondary-authority px-6 py-3 cursor-pointer"
                      >
                        <ArrowsClockwise size={20} className="mr-2" />
                        Try Again
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
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
                      onClick={handleSubmit}
                      disabled={currentAnswer === null}
                      className={`btn-authority px-8 py-3 font-semibold transition-all duration-200 cursor-pointer ${
                        currentAnswer !== null
                          ? 'btn-primary-authority shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Submit Answer
                      <ArrowRight size={20} className="ml-2" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
