'use client';

import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/i18n-context';
import Link from 'next/link';
import {
  ChartBar,
  Users,
  ClipboardText,
  Clock,
  CheckCircle,
  Eye,
  GearSix,
  Database,
  Upload,
  LockIcon,
  ShieldCheck,
  Spinner,
  CaretRight
} from '@phosphor-icons/react';

interface Analytics {
  totalTests: number;
  completedTests: number;
  pendingReview: number;
  averageTimeMinutes: number;
  levelDistribution: Record<string, number>;
  testsByMode: Record<string, number>;
}

interface Session {
  id: string;
  session_code: string;
  student_name: string;
  student_email?: string;
  test_mode: string;
  status: string;
  calculated_level?: string;
  started_at: string;
  completed_at?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export default function PlacementTestAdminDashboard() {
  const { locale } = useI18n();
  // const router = useRouter();

  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null
  });
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      verifyToken(token);
    } else {
      setAuthState({ isAuthenticated: false, isLoading: false, error: null });
    }
  }, []);

  // Verify token
  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/certificates/admin/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setAuthState({ isAuthenticated: true, isLoading: false, error: null });
        loadDashboardData(token);
      } else {
        localStorage.removeItem('admin_token');
        setAuthState({ isAuthenticated: false, isLoading: false, error: null });
      }
    } catch {
      localStorage.removeItem('admin_token');
      setAuthState({ isAuthenticated: false, isLoading: false, error: null });
    }
  };

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState({ ...authState, isLoading: true, error: null });

    try {
      const response = await fetch('/api/certificates/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('admin_token', result.token);
        setAuthState({ isAuthenticated: true, isLoading: false, error: null });
        setCredentials({ username: '', password: '' });
        loadDashboardData(result.token);
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: result.error || 'Invalid credentials'
        });
      }
    } catch {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: 'Network error. Please try again.'
      });
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setAuthState({ isAuthenticated: false, isLoading: false, error: null });
    setAnalytics(null);
    setRecentSessions([]);
  };

  // Load dashboard data
  const loadDashboardData = async (token: string) => {
    setIsLoadingData(true);

    try {
      const response = await fetch('/api/placement-test/admin?limit=10', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await response.json();

      if (result.success) {
        setAnalytics(result.analytics);
        setRecentSessions(result.sessions || []);
      }
    } catch {
      console.error('Failed to load dashboard data');
    } finally {
      setIsLoadingData(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Status badge
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'in_progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'completed': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'pending_review': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      'reviewed': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'expired': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles['expired']}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  // Login form
  if (!authState.isAuthenticated) {
    if (authState.isLoading) {
      return (
        <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <Spinner size={48} className="text-primary animate-spin" />
        </div>
      );
    }

    return (
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="authority-card p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <LockIcon size={32} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-text-authority mb-2">
                Admin Access Required
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to manage placement tests
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              {authState.error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  {authState.error}
                </div>
              )}

              <button
                type="submit"
                disabled={authState.isLoading}
                className="w-full btn-authority btn-primary-authority justify-center disabled:opacity-50"
              >
                {authState.isLoading ? (
                  <>
                    <Spinner size={20} className="mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={20} className="mr-2" />
                    Sign In
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container-authority px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text-authority mb-2">
              Placement Test Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and review placement test submissions
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-red-600 px-3 py-1 border border-gray-300 rounded hover:border-red-300"
          >
            Sign Out
          </button>
        </div>

        {/* Stats Cards */}
        {analytics && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="authority-card p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Users size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.totalTests}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Tests</p>
                </div>
              </div>
            </div>

            <div className="authority-card p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.completedTests}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                </div>
              </div>
            </div>

            <div className="authority-card p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                  <ClipboardText size={24} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.pendingReview}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pending Review</p>
                </div>
              </div>
            </div>

            <div className="authority-card p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <Clock size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.averageTimeMinutes} min
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Time</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            href={`/${locale}/admin/placement-test/submissions`}
            className="authority-card p-4 flex items-center gap-3 hover:shadow-lg transition-shadow"
          >
            <ClipboardText size={24} className="text-primary" />
            <span className="font-medium text-gray-900 dark:text-white">All Submissions</span>
            <CaretRight size={18} className="text-gray-400 ml-auto" />
          </Link>

          <Link
            href={`/${locale}/admin/placement-test/questions`}
            className="authority-card p-4 flex items-center gap-3 hover:shadow-lg transition-shadow"
          >
            <Database size={24} className="text-primary" />
            <span className="font-medium text-gray-900 dark:text-white">Question Bank</span>
            <CaretRight size={18} className="text-gray-400 ml-auto" />
          </Link>

          <Link
            href={`/${locale}/admin/placement-test/questions/import`}
            className="authority-card p-4 flex items-center gap-3 hover:shadow-lg transition-shadow"
          >
            <Upload size={24} className="text-primary" />
            <span className="font-medium text-gray-900 dark:text-white">Import Questions</span>
            <CaretRight size={18} className="text-gray-400 ml-auto" />
          </Link>

          <Link
            href={`/${locale}/admin/placement-test/settings`}
            className="authority-card p-4 flex items-center gap-3 hover:shadow-lg transition-shadow"
          >
            <GearSix size={24} className="text-primary" />
            <span className="font-medium text-gray-900 dark:text-white">Settings</span>
            <CaretRight size={18} className="text-gray-400 ml-auto" />
          </Link>
        </div>

        {/* Level Distribution */}
        {analytics && (
          <div className="authority-card p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ChartBar size={20} className="text-primary" />
              Level Distribution
            </h2>
            <div className="grid grid-cols-6 gap-4">
              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => {
                const count = analytics.levelDistribution[level] || 0;
                const maxCount = Math.max(...Object.values(analytics.levelDistribution), 1);
                const percentage = (count / maxCount) * 100;

                return (
                  <div key={level} className="text-center">
                    <div className="h-24 flex items-end justify-center mb-2">
                      <div
                        className="w-8 bg-gradient-to-t from-primary to-secondary rounded-t"
                        style={{ height: `${Math.max(percentage, 10)}%` }}
                      />
                    </div>
                    <p className="font-bold text-gray-900 dark:text-white">{level}</p>
                    <p className="text-sm text-gray-500">{count}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Submissions */}
        <div className="authority-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Submissions
            </h2>
            <Link
              href={`/${locale}/admin/placement-test/submissions`}
              className="text-primary hover:text-primary-dark text-sm font-medium"
            >
              View All
            </Link>
          </div>

          {isLoadingData ? (
            <div className="text-center py-8">
              <Spinner size={32} className="text-primary animate-spin mx-auto" />
            </div>
          ) : recentSessions.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No submissions yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Student</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Mode</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Level</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentSessions.map((session) => (
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
                      <td className="py-3 px-4 capitalize">{session.test_mode}</td>
                      <td className="py-3 px-4">{getStatusBadge(session.status)}</td>
                      <td className="py-3 px-4">
                        {session.calculated_level && (
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded font-medium">
                            {session.calculated_level}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {formatDate(session.started_at)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/${locale}/admin/placement-test/submissions/${session.id}`}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg inline-flex"
                        >
                          <Eye size={18} className="text-gray-600 dark:text-gray-400" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
