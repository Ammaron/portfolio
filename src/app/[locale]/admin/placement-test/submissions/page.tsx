'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/i18n-context';
import Link from 'next/link';
import {
  MagnifyingGlass,
  Funnel,
  Eye,
  CaretLeft,
  CaretRight,
  Spinner,
  ArrowsClockwise,
  Student,
  ClockCountdown
} from '@phosphor-icons/react';

interface Session {
  id: string;
  session_code: string;
  student_name: string;
  student_email?: string;
  test_mode: string;
  status: string;
  skills_tested: string[];
  calculated_level?: string;
  admin_adjusted_level?: string;
  started_at: string;
  completed_at?: string;
  time_spent_seconds: number;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  in_progress: {
    label: 'In Progress',
    bg: 'bg-sky-100 dark:bg-sky-900/40',
    text: 'text-sky-800 dark:text-sky-200',
    dot: 'bg-sky-500',
  },
  completed: {
    label: 'Completed',
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
    text: 'text-emerald-800 dark:text-emerald-200',
    dot: 'bg-emerald-500',
  },
  pending_review: {
    label: 'Pending Review',
    bg: 'bg-amber-100 dark:bg-amber-900/40',
    text: 'text-amber-800 dark:text-amber-200',
    dot: 'bg-amber-500',
  },
  reviewed: {
    label: 'Reviewed',
    bg: 'bg-violet-100 dark:bg-violet-900/40',
    text: 'text-violet-800 dark:text-violet-200',
    dot: 'bg-violet-500',
  },
  expired: {
    label: 'Expired',
    bg: 'bg-slate-200 dark:bg-slate-700/60',
    text: 'text-slate-700 dark:text-slate-300',
    dot: 'bg-slate-400',
  },
};

export default function SubmissionsListPage() {
  const { locale } = useI18n();
  const router = useRouter();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({
    status: '',
    mode: '',
    search: ''
  });

  const limit = 20;

  const loadSessions = useCallback(async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push(`/${locale}/admin/placement-test`);
      return;
    }

    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: (page * limit).toString()
      });

      if (filters.status) params.append('status', filters.status);
      if (filters.mode) params.append('mode', filters.mode);

      const response = await fetch(`/api/placement-test/admin?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await response.json();

      if (result.success) {
        setSessions(result.sessions || []);
        setTotal(result.total || 0);
      } else if (response.status === 401) {
        router.push(`/${locale}/admin/placement-test`);
      }
    } catch {
      console.error('Failed to load sessions');
    } finally {
      setIsLoading(false);
    }
  }, [filters.status, filters.mode, page, locale, router]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  const totalPages = Math.ceil(total / limit);

  const filteredSessions = sessions.filter(s =>
    !filters.search ||
    s.student_name.toLowerCase().includes(filters.search.toLowerCase()) ||
    s.student_email?.toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${locale}/admin/placement-test`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light transition-colors mb-3"
          >
            <CaretLeft size={14} weight="bold" />
            Dashboard
          </Link>

          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Submissions
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {total} total submission{total !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => loadSessions()}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowsClockwise size={16} weight="bold" />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Funnel size={16} weight="bold" />
              <span className="text-xs font-semibold uppercase tracking-wider">Filters</span>
            </div>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

            <select
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value });
                setPage(0);
              }}
              className="cursor-pointer px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/40 focus:border-primary"
            >
              <option value="">All Statuses</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="pending_review">Pending Review</option>
              <option value="reviewed">Reviewed</option>
              <option value="expired">Expired</option>
            </select>

            <select
              value={filters.mode}
              onChange={(e) => {
                setFilters({ ...filters, mode: e.target.value });
                setPage(0);
              }}
              className="cursor-pointer px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/40 focus:border-primary"
            >
              <option value="">All Modes</option>
              <option value="quick">Quick</option>
              <option value="personalized">Personalized</option>
            </select>

            <div className="flex-1 min-w-[220px]">
              <div className="relative">
                <MagnifyingGlass size={16} weight="bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-9 pr-4 py-2 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Spinner size={28} className="text-primary animate-spin" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading submissions...</p>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Student size={40} weight="duotone" className="text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No submissions found</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">Student</th>
                    <th className="text-left py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">Code</th>
                    <th className="text-left py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">Mode</th>
                    <th className="text-left py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">Status</th>
                    <th className="text-left py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">Level</th>
                    <th className="text-left py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">Time</th>
                    <th className="text-left py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">Date</th>
                    <th className="text-right py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.map((session, idx) => {
                    const status = STATUS_CONFIG[session.status] || STATUS_CONFIG.expired;
                    const level = session.admin_adjusted_level || session.calculated_level;

                    return (
                      <tr
                        key={session.id}
                        className={`border-b border-slate-100 dark:border-slate-800 hover:bg-primary/[0.03] dark:hover:bg-primary/[0.06] transition-colors ${
                          idx % 2 === 1 ? 'bg-slate-50/50 dark:bg-slate-800/20' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                            {session.student_name}
                          </p>
                          {session.student_email && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {session.student_email}
                            </p>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <code className="text-xs font-mono font-semibold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {session.session_code}
                          </code>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                            {session.test_mode}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {level ? (
                            <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2 py-1 text-xs font-bold rounded-md bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-300 ring-1 ring-primary/20 dark:ring-primary/30">
                              {level}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 dark:text-slate-500">&mdash;</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
                            <ClockCountdown size={13} weight="bold" className="text-slate-400 dark:text-slate-500" />
                            {formatDuration(session.time_spent_seconds)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            {formatDate(session.started_at)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/${locale}/admin/placement-test/submissions/${session.id}`}
                            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-primary dark:text-blue-300 bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/20 ring-1 ring-primary/10 dark:ring-primary/20 hover:ring-primary/30 transition-all"
                          >
                            <Eye size={14} weight="bold" />
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3.5 border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {page * limit + 1}&ndash;{Math.min((page + 1) * limit, total)} of {total}
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="cursor-pointer p-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-700 transition-colors"
                >
                  <CaretLeft size={16} weight="bold" />
                </button>
                <span className="px-3 text-sm font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="cursor-pointer p-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-700 transition-colors"
                >
                  <CaretRight size={16} weight="bold" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
