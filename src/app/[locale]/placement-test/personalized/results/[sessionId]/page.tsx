'use client';

import { useState, useEffect, use } from 'react';
// import { useRouter } from 'next/navigation';
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
  ChatCircleDots,
  Star
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { sendPlacementResultsEmail } from '@/lib/placement-test-email';

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
  certificate_issued_at?: string;
}

interface DetailedAnswer {
  question_text: string;
  skill_type: string;
  question_type: string;
  student_answer: string;
  is_correct?: boolean;
  points_earned: number;
  max_points: number;
  admin_score?: number;
  admin_feedback?: string;
  requires_review: boolean;
}

// Level colors
const LEVEL_COLORS: Record<string, { bg: string; text: string; gradient: string }> = {
  'A1': { bg: 'bg-emerald-500', text: 'text-emerald-700', gradient: 'from-emerald-400 to-emerald-600' },
  'A2': { bg: 'bg-teal-500', text: 'text-teal-700', gradient: 'from-teal-400 to-teal-600' },
  'B1': { bg: 'bg-blue-500', text: 'text-blue-700', gradient: 'from-blue-400 to-blue-600' },
  'B2': { bg: 'bg-indigo-500', text: 'text-indigo-700', gradient: 'from-indigo-400 to-indigo-600' },
  'C1': { bg: 'bg-purple-500', text: 'text-purple-700', gradient: 'from-purple-400 to-purple-600' },
  'C2': { bg: 'bg-amber-500', text: 'text-amber-700', gradient: 'from-amber-400 to-amber-600' }
};

// Level descriptions
const LEVEL_DESCRIPTIONS: Record<string, string> = {
  'A1': 'Beginner - You can understand and use familiar everyday expressions and basic phrases.',
  'A2': 'Elementary - You can communicate in simple tasks requiring direct exchange of information.',
  'B1': 'Intermediate - You can handle most situations while traveling and describe experiences.',
  'B2': 'Upper Intermediate - You can interact fluently with native speakers.',
  'C1': 'Advanced - You can express ideas fluently without obvious searching for expressions.',
  'C2': 'Proficient - You can understand virtually everything and express yourself spontaneously.'
};

// Skill icons
const SKILL_ICONS: Record<string, React.ReactNode> = {
  'reading': <BookOpen size={24} />,
  'listening': <Headphones size={24} />,
  'writing': <PencilSimple size={24} />,
  'speaking': <Microphone size={24} />
};

export default function ResultsPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const { t, locale } = useI18n();
  // const router = useRouter();
  const [results, setResults] = useState<ResultsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailedAnswers, setDetailedAnswers] = useState<DetailedAnswer[]>([]);
  const [certificateCode, setCertificateCode] = useState<string | null>(null);

  const pt = (key: string) => t('placementTest', key);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/placement-test/results/${sessionId}`);
        const data = await response.json();

        if (data.success) {
          setResults(data);

          // If reviewed, fetch detailed results with per-answer feedback
          if (data.status === 'reviewed') {
            try {
              const detailedRes = await fetch(`/api/placement-test/results/${sessionId}/detailed`);
              const detailedData = await detailedRes.json();
              if (detailedData.success) {
                setDetailedAnswers(detailedData.answers || []);
                if (detailedData.certificate_code) {
                  setCertificateCode(detailedData.certificate_code);
                }
              }
            } catch {
              // Non-critical: detailed feedback just won't show
            }
          }
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

  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleEmailResults = async () => {
    if (!results) return;

    // Check if we have an email (for personalized mode, we should have it)
    const studentEmail = sessionStorage.getItem('placement_student_email');
    if (!studentEmail) {
      toast.error('No email address found. Please enter your email.');
      const email = prompt('Enter your email address:');
      if (!email) return;
      sessionStorage.setItem('placement_student_email', email);
      handleEmailResultsWithEmail(email);
      return;
    }
    handleEmailResultsWithEmail(studentEmail);
  };

  const handleEmailResultsWithEmail = async (email: string) => {
    if (!results) return;
    setIsSendingEmail(true);

    try {
      const finalLevel = results.admin_adjusted_level || results.calculated_level;
      const result = await sendPlacementResultsEmail({
        studentName: results.student_name,
        studentEmail: email,
        sessionCode: results.session_code,
        testMode: results.test_mode as 'quick' | 'personalized',
        calculatedLevel: finalLevel,
        skillBreakdown: results.level_breakdown,
        adminFeedback: results.admin_feedback,
        resultsUrl: window.location.href
      });

      if (result.success) {
        toast.success('Results sent to your email!');
      } else {
        toast.error('Failed to send email. Please try again.');
      }
    } catch {
      toast.error('Failed to send email.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const getAbilityPercentage = (level: string): number => {
    const levels: Record<string, number> = {
      'A1': 16, 'A2': 33, 'B1': 50, 'B2': 67, 'C1': 83, 'C2': 100
    };
    return levels[level] || 50;
  };

  const getAssessment = (confidence: number): { text: string; color: string } => {
    if (confidence >= 0.8) return { text: 'Strong', color: 'text-green-600' };
    if (confidence >= 0.5) return { text: 'Good', color: 'text-blue-600' };
    return { text: 'Developing', color: 'text-amber-600' };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Spinner size={48} className="text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="authority-card p-8 max-w-md text-center">
          <WarningCircle size={48} className="text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Results Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'Unable to load your results. Please check your session code.'}
          </p>
          <Link
            href={`/${locale}/placement-test/verify`}
            className="btn-authority btn-primary-authority justify-center"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  const finalLevel = results.admin_adjusted_level || results.calculated_level;
  const levelColors = LEVEL_COLORS[finalLevel] || LEVEL_COLORS['B1'];

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container-authority px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Pending Review Notice */}
          {results.status === 'pending_review' && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <Clock size={24} className="text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">
                    {pt('results.pendingReview')}
                  </h3>
                  <p className="text-amber-700 dark:text-amber-400 text-sm">
                    {pt('results.pendingMessage')}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm text-amber-600 dark:text-amber-400">
                      {pt('results.sessionCode')}:
                    </span>
                    <code className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded font-mono text-sm">
                      {results.session_code}
                    </code>
                    <button
                      onClick={copySessionCode}
                      className="p-1 hover:bg-amber-200 dark:hover:bg-amber-800 rounded"
                    >
                      <Copy size={16} className="text-amber-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hero - Main Level */}
          <div className="authority-card p-8 md:p-12 text-center mb-8">
            <div className="mb-6">
              <Trophy size={48} className="text-amber-500 mx-auto mb-4" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {pt('results.congratulations')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {results.student_name}
              </p>
            </div>

            {/* Level Badge */}
            <div className="inline-block mb-6">
              <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${levelColors.gradient} flex items-center justify-center text-white shadow-xl`}>
                <div className="text-center">
                  <span className="text-4xl font-bold">{finalLevel}</span>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {pt('results.yourLevel')}: {finalLevel}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
              {LEVEL_DESCRIPTIONS[finalLevel]}
            </p>

            {results.level_confidence !== undefined && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                <CheckCircle size={18} className="text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {pt('results.confidence')}: {Math.round(results.level_confidence * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Skill Breakdown */}
          {results.level_breakdown && Object.keys(results.level_breakdown).length > 0 && (
            <div className="authority-card p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                {pt('results.skillBreakdown')}
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(results.level_breakdown).map(([skill, data]) => {
                  const skillLevel = data.level;
                  const skillColors = LEVEL_COLORS[skillLevel] || LEVEL_COLORS['B1'];
                  const assessment = getAssessment(data.confidence);

                  return (
                    <div
                      key={skill}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${skillColors.bg} text-white`}>
                            {SKILL_ICONS[skill]}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                              {pt(`results.${skill}`)}
                            </h4>
                            <span className={`text-sm ${assessment.color}`}>
                              {assessment.text}
                            </span>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full font-bold ${skillColors.bg} text-white`}>
                          {skillLevel}
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${skillColors.gradient} transition-all duration-500`}
                          style={{ width: `${getAbilityPercentage(skillLevel)}%` }}
                        />
                      </div>

                      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
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
            <div className="authority-card p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Star size={24} weight="fill" className="text-amber-500" />
                {pt('results.expertFeedback') || 'Expert Feedback'}
              </h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {results.admin_feedback}
                </p>
              </div>
            </div>
          )}

          {/* Detailed Per-Answer Feedback (only reviewed writing/speaking) */}
          {results.status === 'reviewed' && detailedAnswers.filter(a => a.requires_review && (a.admin_score !== undefined || a.admin_feedback)).length > 0 && (
            <div className="authority-card p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <ChatCircleDots size={24} className="text-indigo-500" />
                {pt('results.detailedFeedback') || 'Your Detailed Feedback'}
              </h3>
              <div className="space-y-6">
                {detailedAnswers
                  .filter(a => a.requires_review && (a.admin_score !== undefined || a.admin_feedback))
                  .map((answer, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          answer.skill_type === 'writing' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          answer.skill_type === 'speaking' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {answer.skill_type === 'writing' ? <PencilSimple size={12} className="inline mr-1" /> :
                           answer.skill_type === 'speaking' ? <Microphone size={12} className="inline mr-1" /> : null}
                          {answer.skill_type.charAt(0).toUpperCase() + answer.skill_type.slice(1)}
                        </span>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 font-medium mb-3">
                        {answer.question_text}
                      </p>

                      {/* Student's answer */}
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-3">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                          {pt('results.yourAnswer') || 'Your Answer'}
                        </p>
                        {answer.student_answer.startsWith('data:audio') ? (
                          <audio controls className="w-full">
                            <source src={answer.student_answer} />
                          </audio>
                        ) : (
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line text-sm">
                            {answer.student_answer}
                          </p>
                        )}
                      </div>

                      {/* Score and feedback */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        {answer.admin_score !== undefined && (
                          <div className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                              {pt('results.expertScore') || 'Expert Score'}:
                            </span>
                            <span className="font-bold text-indigo-700 dark:text-indigo-300">
                              {answer.admin_score} / {answer.max_points}
                            </span>
                          </div>
                        )}
                      </div>

                      {answer.admin_feedback && (
                        <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-400">
                          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
                            {pt('results.expertComment') || 'Expert Comment'}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            {answer.admin_feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Certificate Code (if issued) */}
          {certificateCode && (
            <div className="authority-card p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                    <Certificate size={16} />
                    {pt('results.certificateCode') || 'Certificate Code'}
                  </p>
                  <code className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                    {certificateCode}
                  </code>
                </div>
                <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle size={16} weight="fill" />
                  {pt('results.certificateReady') || 'Certificate Ready'}
                </div>
              </div>
            </div>
          )}

          {/* Test Stats */}
          <div className="authority-card p-8 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Test Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-2xl font-bold text-primary">{results.total_questions}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Questions</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-2xl font-bold text-green-500">
                  {results.auto_scored_correct}/{results.auto_scored_total}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Correct</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                  {results.time_spent_minutes}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Minutes</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                  {results.skills_tested.length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Skills Tested</p>
              </div>
            </div>
          </div>

          {/* Session Code (always show for reference) */}
          <div className="authority-card p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {pt('results.sessionCode')}
                </p>
                <code className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                  {results.session_code}
                </code>
              </div>
              <button
                onClick={copySessionCode}
                className="btn-authority btn-secondary-authority"
              >
                <Copy size={18} className="mr-2" />
                Copy Code
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {results.status === 'reviewed' && certificateCode ? (
              <button
                onClick={async () => {
                  try {
                    const { generatePersonalizedCertificatePDF } = await import('@/lib/placement-test-certificate');
                    generatePersonalizedCertificatePDF({
                      studentName: results.student_name,
                      level: finalLevel,
                      skillBreakdown: results.level_breakdown
                        ? Object.fromEntries(
                            Object.entries(results.level_breakdown).map(([k, v]) => [k, { level: v.level }])
                          ) as Record<string, { level: string }>
                        : {},
                      completedAt: results.completed_at,
                      certificateCode: certificateCode,
                      issuedAt: results.certificate_issued_at || new Date().toISOString()
                    });
                    toast.success('Certificate downloaded!');
                  } catch {
                    toast.error('Failed to generate certificate');
                  }
                }}
                className="btn-authority btn-primary-authority justify-center py-4"
              >
                <Certificate size={20} className="mr-2" />
                {pt('results.downloadCertificate')}
              </button>
            ) : (
              <button
                disabled
                className="btn-authority btn-primary-authority justify-center py-4 opacity-50 cursor-not-allowed"
                title={results.status === 'pending_review' ? 'Certificate available after review' : 'Certificate not available'}
              >
                <Certificate size={20} className="mr-2" />
                {pt('results.downloadCertificate')}
              </button>
            )}

            <button
              onClick={handleEmailResults}
              disabled={isSendingEmail}
              className="btn-authority btn-secondary-authority justify-center py-4 disabled:opacity-50"
            >
              {isSendingEmail ? (
                <Spinner size={20} className="mr-2 animate-spin" />
              ) : (
                <EnvelopeSimple size={20} className="mr-2" />
              )}
              {isSendingEmail ? 'Sending...' : pt('results.emailResults')}
            </button>

            <Link
              href={`/${locale}/placement-test/quick`}
              className="btn-authority btn-secondary-authority justify-center py-4"
            >
              <ArrowsClockwise size={20} className="mr-2" />
              {pt('results.tryAgain')}
            </Link>

            {results.test_mode === 'quick' && (
              <Link
                href={`/${locale}/placement-test/personalized`}
                className="btn-authority bg-gradient-primary text-white justify-center py-4 hover:opacity-90"
              >
                <ArrowRight size={20} className="mr-2" />
                {pt('results.takePersonalized')}
              </Link>
            )}
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link
              href={`/${locale}`}
              className="text-primary hover:text-primary-dark font-medium inline-flex items-center gap-2"
            >
              <House size={18} />
              {pt('results.backToHome')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
