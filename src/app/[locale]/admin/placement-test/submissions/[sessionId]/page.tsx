'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/i18n-context';
import Link from 'next/link';
import {
  CaretLeft,
  CaretDown,
  CaretRight,
  Spinner,
  CheckCircle,
  XCircle,
  Clock,
  User,
  EnvelopeSimple,
  BookOpen,
  Headphones,
  PencilSimple,
  Microphone,
  FloppyDisk,
  Certificate,
  Eye,
  EyeSlash,
  WarningCircle,
  SpeakerHigh,
  Timer,
  Target,
  ChartBar,
  Lightning,
  Question
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { sendReviewCompleteEmail } from '@/lib/placement-test-email';

// ─── Types ────────────────────────────────────────────────────

interface QuestionOption {
  id: string;
  text: string;
  text_es?: string;
  audio_url?: string;
}

interface QuestionData {
  question_code: string;
  skill_type: string;
  question_type: string;
  question_text: string;
  question_text_es?: string;
  passage_text?: string;
  passage_text_es?: string;
  audio_url?: string;
  image_url?: string;
  options?: QuestionOption[];
  correct_answer: string;
  rubric?: Record<string, unknown>;
  cefr_level?: string;
  max_points?: number;
}

interface Answer {
  id: string;
  question_id: string;
  student_answer: string;
  is_correct?: boolean;
  points_earned: number;
  max_points: number;
  time_spent_seconds: number;
  requires_review: boolean;
  admin_score?: number;
  admin_feedback?: string;
  question?: QuestionData;
}

interface Session {
  id: string;
  session_code: string;
  student_name: string;
  student_email?: string;
  student_phone?: string;
  test_mode: string;
  status: string;
  skills_tested: string[];
  started_at: string;
  completed_at?: string;
  time_spent_seconds: number;
  calculated_level?: string;
  level_confidence?: number;
  level_breakdown?: Record<string, { level: string; confidence: number }>;
  admin_feedback?: string;
  admin_adjusted_level?: string;
}

// ─── Constants ────────────────────────────────────────────────

const SKILL_ICONS: Record<string, React.ReactNode> = {
  reading: <BookOpen size={14} weight="bold" />,
  listening: <Headphones size={14} weight="bold" />,
  writing: <PencilSimple size={14} weight="bold" />,
  speaking: <Microphone size={14} weight="bold" />
};

const SKILL_COLORS: Record<string, { bg: string; text: string; ring: string; accent: string }> = {
  reading: {
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    text: 'text-blue-800 dark:text-blue-200',
    ring: 'ring-blue-200 dark:ring-blue-800',
    accent: 'text-blue-600 dark:text-blue-400',
  },
  listening: {
    bg: 'bg-violet-100 dark:bg-violet-900/40',
    text: 'text-violet-800 dark:text-violet-200',
    ring: 'ring-violet-200 dark:ring-violet-800',
    accent: 'text-violet-600 dark:text-violet-400',
  },
  writing: {
    bg: 'bg-amber-100 dark:bg-amber-900/40',
    text: 'text-amber-800 dark:text-amber-200',
    ring: 'ring-amber-200 dark:ring-amber-800',
    accent: 'text-amber-600 dark:text-amber-400',
  },
  speaking: {
    bg: 'bg-rose-100 dark:bg-rose-900/40',
    text: 'text-rose-800 dark:text-rose-200',
    ring: 'ring-rose-200 dark:ring-rose-800',
    accent: 'text-rose-600 dark:text-rose-400',
  },
};

const QUESTION_TYPE_LABELS: Record<string, string> = {
  mcq: 'Multiple Choice',
  true_false: 'True / False',
  true_false_multi: 'Multiple T/F',
  gap_fill: 'Fill in the Blank',
  matching: 'Matching',
  open_response: 'Open Response',
  form_filling: 'Form Filling',
  short_message: 'Short Message',
  picture_description: 'Picture Description',
  interview: 'Interview',
};

// ─── Main Component ───────────────────────────────────────────

export default function SubmissionDetailPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const { locale } = useI18n();
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Grading state
  const [answerGrades, setAnswerGrades] = useState<Record<string, { score: number; feedback: string }>>({});
  const [adminFeedback, setAdminFeedback] = useState('');
  const [adjustedLevel, setAdjustedLevel] = useState('');
  const [certificateCode, setCertificateCode] = useState<string | null>(null);

  // Interactive state
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(new Set());
  const [activeSkillFilter, setActiveSkillFilter] = useState<string | null>(null);

  useEffect(() => {
    loadSubmission();
  }, [sessionId]);

  const loadSubmission = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push(`/${locale}/admin/placement-test`);
      return;
    }

    try {
      const response = await fetch(`/api/placement-test/admin/submissions/${sessionId}/grade`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await response.json();

      if (result.success) {
        setSession(result.session);
        setAnswers(result.answers || []);
        setAdminFeedback(result.session.admin_feedback || '');
        setAdjustedLevel(result.session.admin_adjusted_level || '');

        const grades: Record<string, { score: number; feedback: string }> = {};
        for (const answer of result.answers || []) {
          if (answer.admin_score !== undefined || answer.admin_feedback) {
            grades[answer.id] = {
              score: answer.admin_score || 0,
              feedback: answer.admin_feedback || ''
            };
          }
        }
        setAnswerGrades(grades);
      } else if (response.status === 401) {
        router.push(`/${locale}/admin/placement-test`);
      }
    } catch {
      toast.error('Failed to load submission');
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = async (markComplete = false) => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    setIsSaving(true);

    try {
      const response = await fetch(`/api/placement-test/admin/submissions/${sessionId}/grade`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          answer_grades: Object.entries(answerGrades).map(([id, data]) => ({
            answer_id: id,
            score: data.score,
            feedback: data.feedback
          })),
          admin_feedback: adminFeedback,
          admin_adjusted_level: adjustedLevel || undefined,
          mark_complete: markComplete
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success(markComplete ? 'Review completed!' : 'Progress saved');

        if (markComplete && result.certificate_error) {
          toast.error(`Certificate failed: ${result.certificate_error}`, { duration: 8000 });
        }

        if (markComplete && result.certificate_code) {
          setCertificateCode(result.certificate_code);
          toast.success(`Certificate issued: ${result.certificate_code}`);
        }

        if (markComplete && session?.student_email) {
          const finalLevel = adjustedLevel || session.calculated_level || 'B1';
          const resultsUrl = `${window.location.origin}/${locale}/placement-test/personalized/results/${session.session_code}`;

          sendReviewCompleteEmail(
            session.student_name,
            session.student_email,
            session.session_code,
            finalLevel,
            resultsUrl,
            result.certificate_code
          ).then(emailResult => {
            if (emailResult.success) {
              toast.success('Student notified via email');
            }
          });

          setTimeout(() => {
            router.push(`/${locale}/admin/placement-test/submissions`);
          }, 2000);
        } else if (markComplete) {
          setTimeout(() => {
            router.push(`/${locale}/admin/placement-test/submissions`);
          }, 2000);
        }
      } else {
        toast.error(result.error || 'Failed to save');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setIsSaving(false);
    }
  };

  const updateAnswerGrade = (answerId: string, field: 'score' | 'feedback', value: string | number) => {
    setAnswerGrades(prev => ({
      ...prev,
      [answerId]: {
        ...prev[answerId],
        [field]: value
      }
    }));
  };

  const toggleCard = (id: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleReveal = (id: string) => {
    setRevealedAnswers(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpandedCards(new Set(answers.map(a => a.id)));
  const collapseAll = () => setExpandedCards(new Set());
  const revealAll = () => setRevealedAnswers(new Set(answers.map(a => a.id)));
  const hideAll = () => setRevealedAnswers(new Set());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  };

  // ─── Loading / Error states ─────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner size={32} className="text-primary animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading submission...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen pt-20 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <WarningCircle size={40} weight="duotone" className="text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Submission not found</p>
          <Link
            href={`/${locale}/admin/placement-test/submissions`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <CaretLeft size={14} weight="bold" />
            Back to submissions
          </Link>
        </div>
      </div>
    );
  }

  // ─── Computed Data ──────────────────────────────────────────

  const reviewRequired = answers.filter(a => a.requires_review);
  const autoScored = answers.filter(a => !a.requires_review);

  const totalPoints = answers.reduce((s, a) => s + a.max_points, 0);
  const earnedPoints = answers.reduce((s, a) => s + a.points_earned, 0);
  const correctCount = autoScored.filter(a => a.is_correct).length;

  // Skill stats
  const skillStats = answers.reduce((acc, a) => {
    const skill = a.question?.skill_type || 'unknown';
    if (!acc[skill]) acc[skill] = { total: 0, earned: 0, count: 0, correct: 0, time: 0 };
    acc[skill].total += a.max_points;
    acc[skill].earned += a.points_earned;
    acc[skill].count += 1;
    acc[skill].correct += a.is_correct ? 1 : 0;
    acc[skill].time += a.time_spent_seconds;
    return acc;
  }, {} as Record<string, { total: number; earned: number; count: number; correct: number; time: number }>);

  const filteredAnswers = activeSkillFilter
    ? answers.filter(a => a.question?.skill_type === activeSkillFilter)
    : answers;

  const getSkillStyle = (skill: string) => SKILL_COLORS[skill] || {
    bg: 'bg-slate-100 dark:bg-slate-700',
    text: 'text-slate-700 dark:text-slate-300',
    ring: 'ring-slate-200 dark:ring-slate-600',
    accent: 'text-slate-600 dark:text-slate-400',
  };

  // ─── Render ─────────────────────────────────────────────────

  return (
    <div className="min-h-screen pt-20 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/${locale}/admin/placement-test/submissions`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light transition-colors mb-3"
          >
            <CaretLeft size={14} weight="bold" />
            Submissions
          </Link>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {session.student_name}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                {session.student_email && (
                  <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <EnvelopeSimple size={13} weight="bold" />
                    {session.student_email}
                  </span>
                )}
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock size={13} weight="bold" />
                  {formatTime(session.time_spent_seconds)}
                </span>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                  {session.test_mode} mode
                </span>
              </div>
            </div>
            <code className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-1 ring-slate-300 dark:ring-slate-700">
              {session.session_code}
            </code>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ═══ Main Content ═══ */}
          <div className="lg:col-span-2 space-y-5">

            {/* ─── Score Summary Strip ─── */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-sm overflow-hidden">
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-200 dark:divide-slate-700/80">
                <StatCell
                  icon={<Target size={16} weight="bold" />}
                  label="Score"
                  value={`${earnedPoints}/${totalPoints}`}
                  sub={totalPoints > 0 ? `${Math.round((earnedPoints / totalPoints) * 100)}%` : ''}
                />
                <StatCell
                  icon={<CheckCircle size={16} weight="bold" />}
                  label="Correct"
                  value={`${correctCount}/${autoScored.length}`}
                  sub={autoScored.length > 0 ? `${Math.round((correctCount / autoScored.length) * 100)}%` : ''}
                />
                <StatCell
                  icon={<PencilSimple size={16} weight="bold" />}
                  label="Needs Review"
                  value={`${reviewRequired.length}`}
                  sub={`of ${answers.length} total`}
                />
                <StatCell
                  icon={<Timer size={16} weight="bold" />}
                  label="Avg Time"
                  value={answers.length > 0 ? formatTime(Math.round(answers.reduce((s, a) => s + a.time_spent_seconds, 0) / answers.length)) : '—'}
                  sub="per question"
                />
              </div>
            </div>

            {/* ─── Skill Breakdown Chips ─── */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveSkillFilter(null)}
                className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  !activeSkillFilter
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                All ({answers.length})
              </button>
              {Object.entries(skillStats).map(([skill, stats]) => {
                const style = getSkillStyle(skill);
                const isActive = activeSkillFilter === skill;
                const pct = stats.total > 0 ? Math.round((stats.earned / stats.total) * 100) : 0;
                return (
                  <button
                    key={skill}
                    onClick={() => setActiveSkillFilter(isActive ? null : skill)}
                    className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      isActive
                        ? `${style.bg} ${style.text} ring-2 ${style.ring} shadow-sm`
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {SKILL_ICONS[skill]}
                    {skill}
                    <span className="opacity-70">({stats.count})</span>
                    <span className={`ml-0.5 tabular-nums ${pct >= 70 ? 'text-emerald-600 dark:text-emerald-400' : pct >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                      {pct}%
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ─── Toolbar ─── */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex gap-2">
                <button onClick={expandAll} className="cursor-pointer px-2.5 py-1.5 rounded-md font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                  Expand All
                </button>
                <button onClick={collapseAll} className="cursor-pointer px-2.5 py-1.5 rounded-md font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                  Collapse All
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={revealAll} className="cursor-pointer px-2.5 py-1.5 rounded-md font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-1">
                  <Eye size={13} weight="bold" />
                  Show All Answers
                </button>
                <button onClick={hideAll} className="cursor-pointer px-2.5 py-1.5 rounded-md font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-1">
                  <EyeSlash size={13} weight="bold" />
                  Hide All
                </button>
              </div>
            </div>

            {/* ─── Question Cards ─── */}
            <div className="space-y-3">
              {filteredAnswers.map((answer, index) => (
                <QuestionCard
                  key={answer.id}
                  answer={answer}
                  index={activeSkillFilter ? index : answers.indexOf(answer)}
                  isExpanded={expandedCards.has(answer.id)}
                  isRevealed={revealedAnswers.has(answer.id)}
                  onToggleExpand={() => toggleCard(answer.id)}
                  onToggleReveal={() => toggleReveal(answer.id)}
                  grade={answerGrades[answer.id]}
                  onGradeChange={(field, value) => updateAnswerGrade(answer.id, field, value)}
                  formatTime={formatTime}
                />
              ))}
            </div>
          </div>

          {/* ═══ Sidebar ═══ */}
          <div className="space-y-5">

            {/* Calculated Level */}
            {session.calculated_level && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl p-6 shadow-sm text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Calculated Level</p>
                <div className="text-5xl font-black text-primary dark:text-blue-400 mb-2 tracking-tight">
                  {session.calculated_level}
                </div>
                {session.level_confidence !== undefined && (
                  <div className="mt-3">
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/80 dark:bg-blue-500 rounded-full transition-all"
                        style={{ width: `${Math.round(session.level_confidence * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1.5 tabular-nums">
                      {Math.round(session.level_confidence * 100)}% confidence
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Level Breakdown */}
            {session.level_breakdown && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <ChartBar size={16} weight="bold" className="text-slate-400" />
                  Skill Breakdown
                </h3>
                <div className="space-y-3">
                  {Object.entries(session.level_breakdown).map(([skill, data]) => {
                    const skillStyle = getSkillStyle(skill);
                    const stats = skillStats[skill];
                    const pct = stats && stats.total > 0 ? Math.round((stats.earned / stats.total) * 100) : 0;
                    return (
                      <div key={skill}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide capitalize ${skillStyle.text}`}>
                            {SKILL_ICONS[skill]}
                            {skill}
                          </span>
                          <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
                            {data.level}
                          </span>
                        </div>
                        {stats && (
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Admin Actions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">
                Review Actions
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Adjust Level
                  </label>
                  <select
                    value={adjustedLevel}
                    onChange={(e) => setAdjustedLevel(e.target.value)}
                    className="cursor-pointer w-full px-3 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  >
                    <option value="">Keep calculated level</option>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Overall Feedback
                  </label>
                  <textarea
                    rows={4}
                    value={adminFeedback}
                    onChange={(e) => setAdminFeedback(e.target.value)}
                    placeholder="Feedback for the student..."
                    className="w-full px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 resize-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-slate-400"
                  />
                </div>

                <button
                  onClick={() => saveProgress(false)}
                  disabled={isSaving}
                  className="cursor-pointer w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FloppyDisk size={16} weight="bold" />
                  {isSaving ? 'Saving...' : 'Save Progress'}
                </button>

                <button
                  onClick={() => saveProgress(true)}
                  disabled={isSaving || session.status === 'reviewed'}
                  className="cursor-pointer w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg text-white bg-primary hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <Certificate size={16} weight="bold" />
                  {isSaving ? 'Saving...' : session.status === 'reviewed' ? 'Review Completed' : 'Complete Review & Issue Certificate'}
                </button>
              </div>
            </div>

            {/* Certificate Status */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Certificate size={16} weight="bold" className="text-slate-400" />
                Certificate
              </h3>
              {certificateCode || session.status === 'reviewed' ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} weight="fill" className="text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Issued</span>
                  </div>
                  {certificateCode && (
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">Code</p>
                      <code className="text-sm font-mono font-black text-emerald-800 dark:text-emerald-200">
                        {certificateCode}
                      </code>
                    </div>
                  )}
                  <button
                    onClick={async () => {
                      try {
                        const { generatePersonalizedCertificatePDF } = await import('@/lib/placement-test-certificate');
                        const finalLevel = adjustedLevel || session.calculated_level || 'B1';
                        generatePersonalizedCertificatePDF({
                          studentName: session.student_name,
                          level: finalLevel,
                          skillBreakdown: (session.level_breakdown
                            ? Object.fromEntries(
                                Object.entries(session.level_breakdown).map(([k, v]) => [k, { level: v.level }])
                              )
                            : {}) as Record<string, { level: string }>,
                          completedAt: session.completed_at || new Date().toISOString(),
                          certificateCode: certificateCode || 'PREVIEW',
                          issuedAt: new Date().toISOString()
                        });
                      } catch {
                        toast.error('Failed to generate preview');
                      }
                    }}
                    className="cursor-pointer w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Eye size={14} weight="bold" />
                    Preview PDF
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Complete the review to issue.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── Stat Cell ────────────────────────────────────────────────

function StatCell({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="px-4 py-4 text-center">
      <div className="flex items-center justify-center gap-1.5 text-slate-400 dark:text-slate-500 mb-1">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-xl font-black text-slate-900 dark:text-white tabular-nums">{value}</p>
      {sub && <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}


// ─── Question Card ────────────────────────────────────────────

function QuestionCard({
  answer,
  index,
  isExpanded,
  isRevealed,
  onToggleExpand,
  onToggleReveal,
  grade,
  onGradeChange,
  formatTime,
}: {
  answer: Answer;
  index: number;
  isExpanded: boolean;
  isRevealed: boolean;
  onToggleExpand: () => void;
  onToggleReveal: () => void;
  grade?: { score: number; feedback: string };
  onGradeChange: (field: 'score' | 'feedback', value: string | number) => void;
  formatTime: (s: number) => string;
}) {
  const q = answer.question;
  const skill = q?.skill_type || 'unknown';
  const skillStyle = SKILL_COLORS[skill] || SKILL_COLORS.reading;
  const isMultiTF = q?.question_type === 'true_false_multi';
  const hasPartialPoints = isMultiTF && !answer.is_correct && answer.points_earned > 0;

  let statusColor: string;
  let statusIcon: React.ReactNode;
  if (answer.requires_review) {
    statusColor = 'border-l-amber-500';
    statusIcon = <PencilSimple size={16} weight="bold" className="text-amber-500" />;
  } else if (answer.is_correct) {
    statusColor = 'border-l-emerald-500';
    statusIcon = <CheckCircle size={16} weight="fill" className="text-emerald-500" />;
  } else if (hasPartialPoints) {
    statusColor = 'border-l-amber-500';
    statusIcon = <Lightning size={16} weight="fill" className="text-amber-500" />;
  } else {
    statusColor = 'border-l-red-500';
    statusIcon = <XCircle size={16} weight="fill" className="text-red-500" />;
  }

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-sm overflow-hidden border-l-4 ${statusColor} transition-all`}>
      {/* Collapsed header — always visible */}
      <button
        onClick={onToggleExpand}
        className="cursor-pointer w-full text-left px-4 py-3.5 flex items-center gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
      >
        {/* Expand chevron */}
        <span className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
          <CaretRight size={14} weight="bold" />
        </span>

        {/* Q number */}
        <span className="text-xs font-black text-slate-400 dark:text-slate-500 tabular-nums w-7 flex-shrink-0">
          Q{index + 1}
        </span>

        {/* Status icon */}
        {statusIcon}

        {/* Skill + type badges */}
        {q && (
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ring-1 ${skillStyle.bg} ${skillStyle.text} ${skillStyle.ring}`}>
              {SKILL_ICONS[skill]}
              {skill}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              {QUESTION_TYPE_LABELS[q.question_type] || q.question_type}
            </span>
            {q.cefr_level && (
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                {q.cefr_level}
              </span>
            )}
            <code className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">
              {q.question_code}
            </code>
          </div>
        )}

        {/* Right side: points + time */}
        <div className="ml-auto flex items-center gap-3 flex-shrink-0">
          <span className="text-xs font-bold tabular-nums text-slate-600 dark:text-slate-400">
            {answer.points_earned}/{answer.max_points}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tabular-nums flex items-center gap-0.5">
            <Timer size={11} weight="bold" />
            {formatTime(answer.time_spent_seconds)}
          </span>
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-slate-100 dark:border-slate-800">

          {/* Question context: passage, audio, image */}
          {q && (
            <div className="px-5 pt-4 pb-2 space-y-3">

              {/* Passage */}
              {q.passage_text && (
                <div className="bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/50 rounded-lg p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-2">Passage</p>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                    {q.passage_text}
                  </p>
                </div>
              )}

              {/* Audio player */}
              {q.audio_url && (
                <AudioPreview url={q.audio_url} questionCode={q.question_code} />
              )}

              {/* Image */}
              {q.image_url && (
                <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                  <img src={q.image_url} alt="Question image" className="w-full max-h-64 object-contain" />
                </div>
              )}

              {/* Question text */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border-l-3 border-primary/50">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                  {q.question_text}
                </p>
              </div>
            </div>
          )}

          {/* Student's answer + interactive review */}
          <div className="px-5 pb-4 pt-2">

            {/* For MCQ: show all options with student selection */}
            {q?.question_type === 'mcq' && q.options && (
              <MCQReview
                options={q.options}
                studentAnswer={answer.student_answer}
                correctAnswer={q.correct_answer}
                isRevealed={isRevealed}
                isCorrect={!!answer.is_correct}
              />
            )}

            {/* For True/False */}
            {q?.question_type === 'true_false' && (
              <TrueFalseReview
                studentAnswer={answer.student_answer}
                correctAnswer={q.correct_answer}
                isRevealed={isRevealed}
                isCorrect={!!answer.is_correct}
              />
            )}

            {/* For True/False Multi */}
            {q?.question_type === 'true_false_multi' && q.options && (
              <TFMultiReview
                options={q.options}
                studentAnswer={answer.student_answer}
                correctAnswer={q.correct_answer}
                isRevealed={isRevealed}
                pointsEarned={answer.points_earned}
                maxPoints={answer.max_points}
              />
            )}

            {/* For Gap Fill */}
            {q?.question_type === 'gap_fill' && (
              <GapFillReview
                studentAnswer={answer.student_answer}
                correctAnswer={q.correct_answer}
                isRevealed={isRevealed}
                isCorrect={!!answer.is_correct}
              />
            )}

            {/* For Matching */}
            {q?.question_type === 'matching' && q.options && (
              <MatchingReview
                options={q.options}
                studentAnswer={answer.student_answer}
                correctAnswer={q.correct_answer}
                isRevealed={isRevealed}
              />
            )}

            {/* For open-ended types: open_response, form_filling, short_message, picture_description, interview */}
            {['open_response', 'form_filling', 'short_message', 'picture_description', 'interview'].includes(q?.question_type || '') && (
              <OpenResponseReview
                studentAnswer={answer.student_answer}
                skillType={q?.skill_type || ''}
                rubric={q?.rubric}
              />
            )}

            {/* Reveal / hide answer toggle */}
            {!answer.requires_review && (
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleReveal(); }}
                  className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isRevealed
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      : 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-300 hover:bg-primary/15'
                  }`}
                >
                  {isRevealed ? <EyeSlash size={13} weight="bold" /> : <Eye size={13} weight="bold" />}
                  {isRevealed ? 'Hide Correct Answer' : 'Show Correct Answer'}
                </button>
              </div>
            )}

            {/* Manual grading section for review-required answers */}
            {answer.requires_review && (
              <div className="mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-1.5">
                  <PencilSimple size={12} weight="bold" />
                  Manual Grading
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
                      Score (0&ndash;{answer.max_points})
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={answer.max_points}
                      value={grade?.score ?? ''}
                      onChange={(e) => onGradeChange('score', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
                      Feedback
                    </label>
                    <input
                      type="text"
                      value={grade?.feedback ?? ''}
                      onChange={(e) => onGradeChange('feedback', e.target.value)}
                      placeholder="Brief feedback..."
                      className="w-full px-3 py-2 text-sm text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


// ─── Audio Preview ────────────────────────────────────────────

function AudioPreview({ url, questionCode }: { url: string; questionCode?: string }) {
  const [missing, setMissing] = useState(false);

  return (
    <div className="bg-violet-50/80 dark:bg-violet-950/30 border border-violet-200/80 dark:border-violet-800/50 rounded-lg p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <SpeakerHigh size={13} weight="bold" className="text-violet-500 dark:text-violet-400" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">Audio</span>
      </div>
      {missing ? (
        <div className="flex items-center gap-2 py-2 px-3 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50">
          <WarningCircle size={14} weight="bold" className="text-red-500 flex-shrink-0" />
          <span className="text-xs font-semibold text-red-700 dark:text-red-300">Audio file not found on server</span>
          <code className="ml-auto text-[10px] font-mono text-red-500/70 dark:text-red-400/50 truncate max-w-[240px]">{url.split('/').pop()}</code>
          {questionCode && (
            <span className="text-[10px] font-bold text-red-500/70 dark:text-red-400/50 flex-shrink-0">({questionCode})</span>
          )}
        </div>
      ) : (
        <audio
          controls
          preload="auto"
          src={url}
          className="w-full"
          onError={() => setMissing(true)}
        />
      )}
    </div>
  );
}


// ─── MCQ Review ───────────────────────────────────────────────

function MCQReview({ options, studentAnswer, correctAnswer, isRevealed, isCorrect }: {
  options: QuestionOption[];
  studentAnswer: string;
  correctAnswer: string;
  isRevealed: boolean;
  isCorrect: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Options</p>
      {options.map((opt) => {
        const isSelected = opt.id === studentAnswer;
        const isCorrectOption = opt.id === correctAnswer || opt.text === correctAnswer;
        const showAsCorrect = isRevealed && isCorrectOption;

        let optStyle: string;
        if (isSelected && isCorrect) {
          // Student picked this and it's correct
          optStyle = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-700 ring-1 ring-emerald-300 dark:ring-emerald-800';
        } else if (isSelected && !isCorrect) {
          // Student picked this but it's wrong
          optStyle = 'bg-red-50 dark:bg-red-950/30 border-red-400 dark:border-red-700 ring-1 ring-red-300 dark:ring-red-800';
        } else if (showAsCorrect) {
          // Not selected, but this is the correct one (revealed)
          optStyle = 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 border-dashed';
        } else {
          optStyle = 'bg-white dark:bg-slate-800/30 border-slate-200 dark:border-slate-700/50';
        }

        return (
          <div key={opt.id} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg border text-sm transition-all ${optStyle}`}>
            {/* Selection indicator */}
            {isSelected ? (
              isCorrect
                ? <CheckCircle size={18} weight="fill" className="text-emerald-500 flex-shrink-0" />
                : <XCircle size={18} weight="fill" className="text-red-500 flex-shrink-0" />
            ) : showAsCorrect ? (
              <CheckCircle size={18} weight="fill" className="text-emerald-400 flex-shrink-0" />
            ) : (
              <span className="w-[18px] h-[18px] rounded-full border-2 border-slate-300 dark:border-slate-600 flex-shrink-0" />
            )}

            <span className={`flex-1 ${
              isSelected
                ? 'font-semibold text-slate-900 dark:text-slate-100'
                : showAsCorrect
                ? 'font-medium text-emerald-700 dark:text-emerald-300'
                : 'text-slate-600 dark:text-slate-400'
            }`}>
              {opt.text}
            </span>

            {/* Labels */}
            {isSelected && (
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                isCorrect
                  ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                  : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
              }`}>
                Selected
              </span>
            )}
            {showAsCorrect && !isSelected && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                Correct
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}


// ─── True/False Review ────────────────────────────────────────

function TrueFalseReview({ studentAnswer, correctAnswer, isRevealed, isCorrect }: {
  studentAnswer: string;
  correctAnswer: string;
  isRevealed: boolean;
  isCorrect: boolean;
}) {
  const choices = ['true', 'false'];
  return (
    <div className="flex gap-3">
      {choices.map(choice => {
        const isSelected = studentAnswer.toLowerCase() === choice;
        const isCorrectChoice = isRevealed && correctAnswer.toLowerCase() === choice;

        let style: string;
        if (isSelected && isCorrect) {
          style = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-700 ring-1 ring-emerald-300';
        } else if (isSelected && !isCorrect) {
          style = 'bg-red-50 dark:bg-red-950/30 border-red-400 dark:border-red-700 ring-1 ring-red-300';
        } else if (isCorrectChoice) {
          style = 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 border-dashed';
        } else {
          style = 'bg-white dark:bg-slate-800/30 border-slate-200 dark:border-slate-700/50';
        }

        return (
          <div key={choice} className={`flex-1 text-center py-3 rounded-lg border-2 text-sm font-bold capitalize transition-all ${style}`}>
            <span className={
              isSelected
                ? (isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300')
                : isCorrectChoice
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 dark:text-slate-400'
            }>
              {choice}
            </span>
            {isSelected && (
              <div className="mt-1">
                <span className={`text-[9px] font-bold uppercase tracking-widest ${
                  isCorrect ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {isCorrect ? 'Correct' : 'Selected'}
                </span>
              </div>
            )}
            {isCorrectChoice && !isSelected && (
              <div className="mt-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">
                  Correct
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


// ─── T/F Multi Review ─────────────────────────────────────────

function TFMultiReview({ options, studentAnswer, correctAnswer, isRevealed, pointsEarned, maxPoints }: {
  options: QuestionOption[];
  studentAnswer: string;
  correctAnswer: string;
  isRevealed: boolean;
  pointsEarned: number;
  maxPoints: number;
}) {
  // Parse student answers: "id1:true,id2:false" or ["id1:true", "id2:false"]
  const studentChoices = new Map<string, string>();
  const parts = typeof studentAnswer === 'string'
    ? studentAnswer.split(',').map(s => s.trim())
    : Array.isArray(studentAnswer) ? studentAnswer : [];
  for (const part of parts) {
    const [id, val] = part.split(':');
    if (id && val) studentChoices.set(id, val.toLowerCase());
  }

  // Parse correct answers the same way
  const correctChoices = new Map<string, string>();
  const correctParts = correctAnswer.split(',').map(s => s.trim());
  for (const part of correctParts) {
    const [id, val] = part.split(':');
    if (id && val) correctChoices.set(id, val.toLowerCase());
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Statements</p>
        <span className="text-xs font-bold tabular-nums text-slate-600 dark:text-slate-300">{pointsEarned}/{maxPoints} pts</span>
      </div>
      {options.map((opt) => {
        const studentVal = studentChoices.get(opt.id);
        const correctVal = correctChoices.get(opt.id);
        const isStatementCorrect = studentVal === correctVal;

        return (
          <div key={opt.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
            studentVal
              ? (isStatementCorrect
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50'
                : 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50')
              : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700/50'
          }`}>
            {isStatementCorrect ? (
              <CheckCircle size={16} weight="fill" className="text-emerald-500 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle size={16} weight="fill" className="text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-800 dark:text-slate-200">{opt.text}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${
                  studentVal ? (isStatementCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400') : 'text-slate-400'
                }`}>
                  Answered: {studentVal || '—'}
                </span>
                {isRevealed && !isStatementCorrect && correctVal && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    Correct: {correctVal}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}


// ─── Gap Fill Review ──────────────────────────────────────────

function GapFillReview({ studentAnswer, correctAnswer, isRevealed, isCorrect }: {
  studentAnswer: string;
  correctAnswer: string;
  isRevealed: boolean;
  isCorrect: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
        isCorrect
          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700'
          : 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700'
      }`}>
        {isCorrect
          ? <CheckCircle size={18} weight="fill" className="text-emerald-500 flex-shrink-0" />
          : <XCircle size={18} weight="fill" className="text-red-500 flex-shrink-0" />
        }
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-0.5">Student&apos;s Answer</p>
          <p className={`text-sm font-semibold ${isCorrect ? 'text-emerald-800 dark:text-emerald-200' : 'text-red-800 dark:text-red-200'}`}>
            &ldquo;{studentAnswer}&rdquo;
          </p>
        </div>
      </div>
      {isRevealed && !isCorrect && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20">
          <CheckCircle size={18} weight="fill" className="text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-0.5">Correct Answer</p>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              &ldquo;{correctAnswer}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── Matching Review ──────────────────────────────────────────

function MatchingReview({ options, studentAnswer, correctAnswer, isRevealed }: {
  options: QuestionOption[];
  studentAnswer: string;
  correctAnswer: string;
  isRevealed: boolean;
}) {
  const leftItems = options.filter((_, i) => i % 2 === 0);
  const rightItems = options.filter((_, i) => i % 2 === 1);
  const rightMap = new Map(rightItems.map(r => [r.id, r]));

  // Parse student pairs
  const studentPairs = new Map<string, string>();
  const parts = typeof studentAnswer === 'string'
    ? studentAnswer.split(',').map(s => s.trim())
    : Array.isArray(studentAnswer) ? studentAnswer : [];
  for (const part of parts) {
    const [left, right] = part.split(':');
    if (left && right) studentPairs.set(left, right);
  }

  // Parse correct pairs
  const correctPairs = new Map<string, string>();
  for (const part of correctAnswer.split(',').map(s => s.trim())) {
    const [left, right] = part.split(':');
    if (left && right) correctPairs.set(left, right);
  }

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Matching Pairs</p>
      {leftItems.map(left => {
        const studentRight = studentPairs.get(left.id);
        const correctRight = correctPairs.get(left.id);
        const isMatch = studentRight === correctRight;
        const studentRightItem = studentRight ? rightMap.get(studentRight) : null;
        const correctRightItem = correctRight ? rightMap.get(correctRight) : null;

        return (
          <div key={left.id} className={`flex items-center gap-2 p-3 rounded-lg border ${
            isMatch
              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50'
              : 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50'
          }`}>
            {isMatch
              ? <CheckCircle size={16} weight="fill" className="text-emerald-500 flex-shrink-0" />
              : <XCircle size={16} weight="fill" className="text-red-500 flex-shrink-0" />
            }
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex-1">{left.text}</span>
            <span className="text-slate-300 dark:text-slate-600 mx-1">&rarr;</span>
            <span className={`text-sm font-medium flex-1 text-right ${
              isMatch ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'
            }`}>
              {studentRightItem?.text || '(none)'}
            </span>
            {isRevealed && !isMatch && correctRightItem && (
              <>
                <span className="text-slate-300 dark:text-slate-600 mx-1">|</span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                  ={correctRightItem.text}
                </span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}


// ─── Open Response Review ─────────────────────────────────────

function OpenResponseReview({ studentAnswer, skillType, rubric }: {
  studentAnswer: string;
  skillType: string;
  rubric?: Record<string, unknown>;
}) {
  const isAudio = studentAnswer.startsWith('data:audio');

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
          {skillType === 'speaking' ? <Microphone size={11} weight="bold" /> : <PencilSimple size={11} weight="bold" />}
          Student Response
        </p>
        {isAudio ? (
          <audio controls className="w-full">
            <source src={studentAnswer} />
          </audio>
        ) : (
          <p className="text-sm text-slate-900 dark:text-slate-100 whitespace-pre-line leading-relaxed">
            {studentAnswer}
          </p>
        )}
        {!isAudio && (
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 tabular-nums">
            {studentAnswer.length} characters
          </p>
        )}
      </div>

      {/* Rubric hint */}
      {rubric && Object.keys(rubric).length > 0 && (
        <details className="group">
          <summary className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1">
            <Question size={11} weight="bold" />
            Grading Rubric
            <CaretDown size={10} weight="bold" className="group-open:rotate-180 transition-transform" />
          </summary>
          <div className="mt-2 p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-xs text-slate-700 dark:text-slate-300">
            <pre className="whitespace-pre-wrap font-mono text-[11px]">{JSON.stringify(rubric, null, 2)}</pre>
          </div>
        </details>
      )}
    </div>
  );
}


// ─── Helper ───────────────────────────────────────────────────

function InfoField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</div>
    </div>
  );
}
