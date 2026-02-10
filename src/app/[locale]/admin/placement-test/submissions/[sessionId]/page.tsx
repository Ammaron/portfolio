'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/i18n-context';
import Link from 'next/link';
import {
  CaretLeft,
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
  Eye
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { sendReviewCompleteEmail } from '@/lib/placement-test-email';

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
  question?: {
    question_code: string;
    skill_type: string;
    question_type: string;
    question_text: string;
    correct_answer: string;
    rubric?: Record<string, unknown>;
  };
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

const SKILL_ICONS: Record<string, React.ReactNode> = {
  reading: <BookOpen size={16} />,
  listening: <Headphones size={16} />,
  writing: <PencilSimple size={16} />,
  speaking: <Microphone size={16} />
};

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

        // Initialize grades from existing data
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
          // Send notification email to student
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

          // Short delay so admin can see the certificate code
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Spinner size={48} className="text-primary animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Submission not found</p>
          <Link href={`/${locale}/admin/placement-test/submissions`} className="text-primary">
            Back to submissions
          </Link>
        </div>
      </div>
    );
  }

  const reviewRequired = answers.filter(a => a.requires_review);
  const autoScored = answers.filter(a => !a.requires_review);

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container-authority px-4 md:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${locale}/admin/placement-test/submissions`}
            className="text-primary hover:text-primary-dark text-sm mb-2 inline-flex items-center gap-1"
          >
            <CaretLeft size={16} />
            Back to Submissions
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Review Submission
            </h1>
            <code className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">
              {session.session_code}
            </code>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Info */}
            <div className="authority-card p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User size={20} />
                Student Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{session.student_name}</p>
                </div>
                {session.student_email && (
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <EnvelopeSimple size={16} />
                      {session.student_email}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Test Mode</p>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">{session.test_mode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Clock size={16} />
                    {Math.round(session.time_spent_seconds / 60)} minutes
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Started</p>
                  <p className="text-gray-700 dark:text-gray-300">{formatDate(session.started_at)}</p>
                </div>
                {session.completed_at && (
                  <div>
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-gray-700 dark:text-gray-300">{formatDate(session.completed_at)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Auto-Scored Answers */}
            {autoScored.length > 0 && (
              <div className="authority-card p-6">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Auto-Scored ({autoScored.length})
                </h2>
                <div className="space-y-4">
                  {autoScored.map((answer, index) => (
                    <div
                      key={answer.id}
                      className={`p-4 rounded-lg border ${
                        answer.is_correct
                          ? 'border-green-200 bg-green-50 dark:bg-green-900/10'
                          : 'border-red-200 bg-red-50 dark:bg-red-900/10'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-500">Q{index + 1}</span>
                          {answer.question && (
                            <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${
                              answer.question.skill_type === 'reading' ? 'bg-blue-100 text-blue-700' :
                              answer.question.skill_type === 'listening' ? 'bg-purple-100 text-purple-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {SKILL_ICONS[answer.question.skill_type]}
                              {answer.question.skill_type}
                            </span>
                          )}
                        </div>
                        {answer.is_correct ? (
                          <CheckCircle size={20} weight="fill" className="text-green-500" />
                        ) : (
                          <XCircle size={20} weight="fill" className="text-red-500" />
                        )}
                      </div>
                      {answer.question && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          {answer.question.question_text}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">
                          Answer: <strong>{answer.student_answer}</strong>
                        </span>
                        {!answer.is_correct && answer.question && (
                          <span className="text-green-600">
                            Correct: <strong>{answer.question.correct_answer}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Manual Review Answers */}
            {reviewRequired.length > 0 && (
              <div className="authority-card p-6">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <PencilSimple size={20} />
                  Manual Review Required ({reviewRequired.length})
                </h2>
                <div className="space-y-6">
                  {reviewRequired.map((answer, index) => (
                    <div key={answer.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-gray-500">Q{autoScored.length + index + 1}</span>
                        {answer.question && (
                          <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${
                            answer.question.skill_type === 'writing' ? 'bg-amber-100 text-amber-700' :
                            answer.question.skill_type === 'speaking' ? 'bg-pink-100 text-pink-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {SKILL_ICONS[answer.question.skill_type]}
                            {answer.question.skill_type}
                          </span>
                        )}
                      </div>

                      {answer.question && (
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          {answer.question.question_text}
                        </p>
                      )}

                      {/* Student Response */}
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                        <p className="text-sm font-medium text-gray-500 mb-2">Student Response:</p>
                        {answer.student_answer.startsWith('data:audio') ? (
                          <audio controls className="w-full">
                            <source src={answer.student_answer} />
                          </audio>
                        ) : (
                          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                            {answer.student_answer}
                          </p>
                        )}
                      </div>

                      {/* Grading */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Score (0-{answer.max_points})
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={answer.max_points}
                            value={answerGrades[answer.id]?.score ?? ''}
                            onChange={(e) => updateAnswerGrade(answer.id, 'score', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Feedback
                          </label>
                          <input
                            type="text"
                            value={answerGrades[answer.id]?.feedback ?? ''}
                            onChange={(e) => updateAnswerGrade(answer.id, 'feedback', e.target.value)}
                            placeholder="Brief feedback..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Calculated Level */}
            {session.calculated_level && (
              <div className="authority-card p-6 text-center">
                <p className="text-sm text-gray-500 mb-2">Calculated Level</p>
                <div className="text-4xl font-bold text-primary mb-2">
                  {session.calculated_level}
                </div>
                {session.level_confidence !== undefined && (
                  <p className="text-sm text-gray-500">
                    {Math.round(session.level_confidence * 100)}% confidence
                  </p>
                )}
              </div>
            )}

            {/* Level Breakdown */}
            {session.level_breakdown && (
              <div className="authority-card p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Skill Breakdown
                </h3>
                <div className="space-y-3">
                  {Object.entries(session.level_breakdown).map(([skill, data]) => (
                    <div key={skill} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize flex items-center gap-2">
                        {SKILL_ICONS[skill]}
                        {skill}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {data.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Actions */}
            <div className="authority-card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Review Actions
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Adjust Level (optional)
                  </label>
                  <select
                    value={adjustedLevel}
                    onChange={(e) => setAdjustedLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Overall Feedback
                  </label>
                  <textarea
                    rows={4}
                    value={adminFeedback}
                    onChange={(e) => setAdminFeedback(e.target.value)}
                    placeholder="Provide overall feedback for the student..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 resize-none"
                  />
                </div>

                <button
                  onClick={() => saveProgress(false)}
                  disabled={isSaving}
                  className="w-full btn-authority btn-secondary-authority justify-center"
                >
                  <FloppyDisk size={18} className="mr-2" />
                  {isSaving ? 'Saving...' : 'Save Progress'}
                </button>

                <button
                  onClick={() => saveProgress(true)}
                  disabled={isSaving || session.status === 'reviewed'}
                  className="w-full btn-authority btn-primary-authority justify-center disabled:opacity-50"
                >
                  <Certificate size={18} className="mr-2" />
                  {isSaving ? 'Saving...' : session.status === 'reviewed' ? 'Review Completed' : 'Complete Review & Issue Certificate'}
                </button>
              </div>
            </div>

            {/* Certificate Status */}
            <div className="authority-card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Certificate size={20} />
                Certificate Status
              </h3>
              {certificateCode || session.status === 'reviewed' ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} weight="fill" className="text-green-500" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">Certificate Issued</span>
                  </div>
                  {certificateCode && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                      <p className="text-xs text-green-600 dark:text-green-400 mb-1">Certificate Code</p>
                      <code className="text-sm font-mono font-bold text-green-800 dark:text-green-200">
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
                    className="w-full btn-authority btn-secondary-authority justify-center text-sm"
                  >
                    <Eye size={16} className="mr-2" />
                    Preview Certificate PDF
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Not yet issued. Complete the review to issue a certificate.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
