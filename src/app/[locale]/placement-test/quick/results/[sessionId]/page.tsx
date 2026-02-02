'use client';

import { useState, useEffect, use } from 'react';
import { useI18n } from '@/i18n/i18n-context';
import Link from 'next/link';
import {
  Trophy,
  BookOpen,
  Headphones,
  PencilSimple,
  Microphone,
  Certificate,
  EnvelopeSimple,
  ArrowsClockwise,
  ArrowRight,
  House,
  Spinner,
  CheckCircle,
  Clock,
  Copy,
  WarningCircle,
  Star,
  Target,
  Timer
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';

interface LevelBreakdown {
  [skill: string]: {
    level: string;
    confidence: number;
    ability_estimate: number;
    description: string;
  };
}

interface ResultsData {
  session_code: string;
  student_name: string;
  test_mode: string;
  skills_tested: string[];
  status: string;
  started_at: string;
  completed_at: string;
  time_spent_minutes: number;
  calculated_level: string;
  level_confidence: number;
  level_breakdown: LevelBreakdown;
  admin_feedback?: string;
  admin_adjusted_level?: string;
  total_questions: number;
  auto_scored_correct: number;
  auto_scored_total: number;
  pending_review: number;
}

// Level colors with better contrast
const LEVEL_COLORS: Record<string, { bg: string; text: string; gradient: string; light: string }> = {
  'A1': { bg: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', gradient: 'from-emerald-400 to-emerald-600', light: 'bg-emerald-100 dark:bg-emerald-900/30' },
  'A2': { bg: 'bg-teal-500', text: 'text-teal-600 dark:text-teal-400', gradient: 'from-teal-400 to-teal-600', light: 'bg-teal-100 dark:bg-teal-900/30' },
  'B1': { bg: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', gradient: 'from-blue-400 to-blue-600', light: 'bg-blue-100 dark:bg-blue-900/30' },
  'B2': { bg: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-400', gradient: 'from-indigo-400 to-indigo-600', light: 'bg-indigo-100 dark:bg-indigo-900/30' },
  'C1': { bg: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400', gradient: 'from-purple-400 to-purple-600', light: 'bg-purple-100 dark:bg-purple-900/30' },
  'C2': { bg: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', gradient: 'from-amber-400 to-amber-600', light: 'bg-amber-100 dark:bg-amber-900/30' }
};

// Level descriptions
const LEVEL_DESCRIPTIONS: Record<string, { title: string; desc: string }> = {
  'A1': { title: 'Beginner', desc: 'You can understand and use familiar everyday expressions and basic phrases.' },
  'A2': { title: 'Elementary', desc: 'You can communicate in simple tasks requiring direct exchange of information.' },
  'B1': { title: 'Intermediate', desc: 'You can handle most situations while traveling and describe experiences.' },
  'B2': { title: 'Upper Intermediate', desc: 'You can interact fluently with native speakers.' },
  'C1': { title: 'Advanced', desc: 'You can express ideas fluently without obvious searching for expressions.' },
  'C2': { title: 'Proficient', desc: 'You can understand virtually everything and express yourself spontaneously.' }
};

// Skill icons
const SKILL_ICONS: Record<string, React.ReactNode> = {
  'reading': <BookOpen size={24} weight="bold" />,
  'listening': <Headphones size={24} weight="bold" />,
  'writing': <PencilSimple size={24} weight="bold" />,
  'speaking': <Microphone size={24} weight="bold" />
};

export default function ResultsPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const { t, locale } = useI18n();
  const [results, setResults] = useState<ResultsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pt = (key: string) => t('placementTest', key);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/placement-test/results/${sessionId}`);
        const data = await response.json();

        if (data.success) {
          setResults(data);
        } else {
          setError(data.error || 'Failed to load results');
        }
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [sessionId]);

  const copySessionCode = () => {
    if (results?.session_code) {
      navigator.clipboard.writeText(results.session_code);
      toast.success('Session code copied!');
    }
  };

  const getAbilityPercentage = (level: string): number => {
    const levels: Record<string, number> = {
      'A1': 16, 'A2': 33, 'B1': 50, 'B2': 67, 'C1': 83, 'C2': 100
    };
    return levels[level] || 50;
  };

  const getAssessment = (confidence: number): { text: string; color: string } => {
    if (confidence >= 0.8) return { text: 'Strong', color: 'text-green-600 dark:text-green-400' };
    if (confidence >= 0.5) return { text: 'Good', color: 'text-blue-600 dark:text-blue-400' };
    return { text: 'Developing', color: 'text-amber-600 dark:text-amber-400' };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Spinner size={48} className="text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md text-center shadow-xl border border-gray-200 dark:border-gray-700">
          <WarningCircle size={48} className="text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Results Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error || 'Unable to load your results. Please check your session code.'}
          </p>
          <Link
            href={`/${locale}/placement-test/verify`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-all"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  const finalLevel = results.admin_adjusted_level || results.calculated_level;
  const levelColors = LEVEL_COLORS[finalLevel] || LEVEL_COLORS['B1'];
  const levelInfo = LEVEL_DESCRIPTIONS[finalLevel] || LEVEL_DESCRIPTIONS['B1'];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">

        {/* Pending Review Notice */}
        {results.status === 'pending_review' && (
          <div className="bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-300 dark:border-amber-700 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <Clock size={28} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-amber-800 dark:text-amber-200 text-lg mb-1">
                  {pt('results.pendingReview')}
                </h3>
                <p className="text-amber-700 dark:text-amber-300">
                  {pt('results.pendingMessage')}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-amber-700 dark:text-amber-300 font-medium">
                    Session Code:
                  </span>
                  <code className="px-3 py-1 bg-amber-200 dark:bg-amber-800 rounded-lg font-mono font-bold text-amber-900 dark:text-amber-100">
                    {results.session_code}
                  </code>
                  <button
                    onClick={copySessionCode}
                    className="p-2 hover:bg-amber-200 dark:hover:bg-amber-800 rounded-lg transition-colors"
                  >
                    <Copy size={18} className="text-amber-700 dark:text-amber-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero - Main Level Result */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 text-center mb-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/50 rounded-full mb-4">
              <Trophy size={32} weight="fill" className="text-amber-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {pt('results.congratulations')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
              {results.student_name}
            </p>
          </div>

          {/* Level Badge */}
          <div className="inline-block mb-8">
            <div className={`w-36 h-36 rounded-full bg-gradient-to-br ${levelColors.gradient} flex items-center justify-center text-white shadow-2xl shadow-${finalLevel === 'A1' ? 'emerald' : finalLevel === 'B1' ? 'blue' : 'amber'}-500/30`}>
              <div className="text-center">
                <span className="text-5xl font-bold">{finalLevel}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {levelInfo.title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
              {levelInfo.desc}
            </p>
          </div>

          {results.level_confidence !== undefined && (
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-200 dark:border-green-800">
              <CheckCircle size={22} weight="fill" className="text-green-600 dark:text-green-400" />
              <span className="font-semibold text-green-700 dark:text-green-300">
                {Math.round(results.level_confidence * 100)}% Confidence
              </span>
            </div>
          )}
        </div>

        {/* Skill Breakdown */}
        {results.level_breakdown && Object.keys(results.level_breakdown).length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <Target size={28} weight="bold" className="text-amber-500" />
              Skill Breakdown
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(results.level_breakdown).map(([skill, data]) => {
                const skillLevel = data.level;
                const skillColors = LEVEL_COLORS[skillLevel] || LEVEL_COLORS['B1'];
                const assessment = getAssessment(data.confidence);

                return (
                  <div
                    key={skill}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${skillColors.bg} text-white`}>
                          {SKILL_ICONS[skill]}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-lg capitalize">
                            {skill}
                          </h4>
                          <span className={`text-sm font-semibold ${assessment.color}`}>
                            {assessment.text}
                          </span>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-xl font-bold text-lg ${skillColors.bg} text-white`}>
                        {skillLevel}
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full bg-gradient-to-r ${skillColors.gradient} transition-all duration-500`}
                        style={{ width: `${getAbilityPercentage(skillLevel)}%` }}
                      />
                    </div>

                    <p className="text-gray-600 dark:text-gray-300">
                      {data.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Admin Feedback (if reviewed) */}
        {results.admin_feedback && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
              <Star size={28} weight="fill" className="text-amber-500" />
              Expert Feedback
            </h3>
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line text-lg leading-relaxed">
                {results.admin_feedback}
              </p>
            </div>
          </div>
        )}

        {/* Test Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <Timer size={28} weight="bold" className="text-amber-500" />
            Test Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-5 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{results.total_questions}</p>
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide mt-1">Questions</p>
            </div>
            <div className="text-center p-5 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-200 dark:border-green-800">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {results.auto_scored_correct}/{results.auto_scored_total}
              </p>
              <p className="text-sm font-semibold text-green-700 dark:text-green-300 uppercase tracking-wide mt-1">Correct</p>
            </div>
            <div className="text-center p-5 bg-purple-50 dark:bg-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-800">
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {results.time_spent_minutes}
              </p>
              <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide mt-1">Minutes</p>
            </div>
            <div className="text-center p-5 bg-amber-50 dark:bg-amber-900/30 rounded-xl border border-amber-200 dark:border-amber-800">
              <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {results.skills_tested.length}
              </p>
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide mt-1">Skills Tested</p>
            </div>
          </div>
        </div>

        {/* Session Code */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Your Session Code
              </p>
              <code className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
                {results.session_code}
              </code>
            </div>
            <button
              onClick={copySessionCode}
              className="flex items-center gap-2 px-5 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all border border-gray-300 dark:border-gray-600"
            >
              <Copy size={20} />
              Copy Code
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => toast('Certificate download coming soon!', { icon: '📜' })}
            className="flex items-center justify-center gap-2 px-5 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/30 hover:shadow-xl cursor-pointer"
          >
            <Certificate size={22} />
            Download Certificate
          </button>

          <button
            onClick={() => toast('Email feature coming soon! Use the session code to access your results.', { icon: '📧' })}
            className="flex items-center justify-center gap-2 px-5 py-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
          >
            <EnvelopeSimple size={22} />
            Email Results
          </button>

          <Link
            href={`/${locale}/placement-test/quick`}
            className="flex items-center justify-center gap-2 px-5 py-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all border-2 border-gray-300 dark:border-gray-600"
          >
            <ArrowsClockwise size={22} />
            Take Test Again
          </Link>

          {results.test_mode === 'quick' && (
            <Link
              href={`/${locale}/placement-test/personalized`}
              className="flex items-center justify-center gap-2 px-5 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl"
            >
              <ArrowRight size={22} />
              Full Assessment
            </Link>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold transition-colors"
          >
            <House size={20} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
