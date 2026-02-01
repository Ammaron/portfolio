'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/i18n-context';
import {
  MagnifyingGlass,
  Spinner,
  ArrowLeft,
  Certificate
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';

export default function VerifyResultsPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [sessionCode, setSessionCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const pt = (key: string) => t('placementTest', key);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sessionCode.trim()) {
      toast.error('Please enter a session code');
      return;
    }

    setIsLoading(true);

    try {
      // First try to resume (in case it's in progress)
      const resumeResponse = await fetch('/api/placement-test/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_code: sessionCode.toUpperCase().trim() })
      });

      const resumeResult = await resumeResponse.json();

      if (resumeResult.success) {
        // Session is still in progress, redirect to test
        sessionStorage.setItem('placement_session', JSON.stringify(resumeResult.session));
        const mode = resumeResult.session.test_mode;
        router.push(`/${locale}/placement-test/${mode}/test?session=${resumeResult.session.id}`);
        return;
      }

      // Try to get results
      const resultsResponse = await fetch(`/api/placement-test/results/${sessionCode.toUpperCase().trim()}`);
      const resultsResult = await resultsResponse.json();

      if (resultsResult.success) {
        // Redirect to results page based on mode
        const mode = resultsResult.test_mode;
        router.push(`/${locale}/placement-test/${mode}/results/${sessionCode.toUpperCase().trim()}`);
      } else {
        toast.error(pt('verify.noResults'));
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCode = (value: string) => {
    // Remove non-alphanumeric characters and uppercase
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Add dash after 4 characters
    if (cleaned.length > 4) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}`;
    }
    return cleaned;
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="container-authority px-4 md:px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="authority-card p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Certificate size={32} className="text-white" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {pt('verify.title')}
              </h1>

              <p className="text-gray-600 dark:text-gray-400">
                {pt('verify.subtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {pt('verify.enterCode')}
                </label>
                <input
                  type="text"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(formatCode(e.target.value))}
                  placeholder={pt('verify.codePlaceholder')}
                  maxLength={9}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-xl font-mono tracking-wider"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !sessionCode.trim()}
                className="w-full btn-authority btn-primary-authority justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Spinner size={20} className="mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <MagnifyingGlass size={20} className="mr-2" />
                    {pt('verify.verifyButton')}
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <button
                onClick={() => router.push(`/${locale}/placement-test`)}
                className="text-primary hover:text-primary-dark font-medium inline-flex items-center gap-2"
              >
                <ArrowLeft size={18} />
                Back to Placement Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
