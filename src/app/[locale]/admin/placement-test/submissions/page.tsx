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
  Spinner
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
    return `${mins} min`;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'in_progress': 'bg-blue-100 text-blue-700',
      'completed': 'bg-green-100 text-green-700',
      'pending_review': 'bg-amber-100 text-amber-700',
      'reviewed': 'bg-purple-100 text-purple-700',
      'expired': 'bg-gray-100 text-gray-700'
    };

    const labels: Record<string, string> = {
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'pending_review': 'Pending Review',
      'reviewed': 'Reviewed',
      'expired': 'Expired'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status] || status}
      </span>
    );
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container-authority px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href={`/${locale}/admin/placement-test`}
              className="text-primary hover:text-primary-dark text-sm mb-2 inline-flex items-center gap-1"
            >
              <CaretLeft size={16} />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              All Submissions
            </h1>
          </div>
          <p className="text-gray-500">{total} total submissions</p>
        </div>

        {/* Filters */}
        <div className="authority-card p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Funnel size={18} className="text-gray-400" />
              <span className="text-sm text-gray-500">Filters:</span>
            </div>

            <select
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value });
                setPage(0);
              }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
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
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
            >
              <option value="">All Modes</option>
              <option value="quick">Quick</option>
              <option value="personalized">Personalized</option>
            </select>

            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="authority-card overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <Spinner size={32} className="text-primary animate-spin mx-auto" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No submissions found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Student</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Code</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Mode</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Level</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Duration</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {sessions
                    .filter(s =>
                      !filters.search ||
                      s.student_name.toLowerCase().includes(filters.search.toLowerCase()) ||
                      s.student_email?.toLowerCase().includes(filters.search.toLowerCase())
                    )
                    .map((session) => (
                      <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {session.student_name}
                            </p>
                            {session.student_email && (
                              <p className="text-sm text-gray-500">{session.student_email}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <code className="text-sm text-gray-600 dark:text-gray-400">
                            {session.session_code}
                          </code>
                        </td>
                        <td className="py-3 px-4 capitalize text-sm">{session.test_mode}</td>
                        <td className="py-3 px-4">{getStatusBadge(session.status)}</td>
                        <td className="py-3 px-4">
                          {(session.admin_adjusted_level || session.calculated_level) && (
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded font-medium text-sm">
                              {session.admin_adjusted_level || session.calculated_level}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {formatDuration(session.time_spent_seconds)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {formatDate(session.started_at)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/${locale}/admin/placement-test/submissions/${session.id}`}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg inline-flex items-center gap-1 text-primary"
                          >
                            <Eye size={18} />
                            <span className="text-sm">View</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500">
                Showing {page * limit + 1} to {Math.min((page + 1) * limit, total)} of {total}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <CaretLeft size={18} />
                </button>
                <span className="text-sm text-gray-600">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <CaretRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
