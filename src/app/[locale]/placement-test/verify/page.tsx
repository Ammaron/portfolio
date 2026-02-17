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
    <div className="min-h-screen pt-20 bg-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary/15 rounded-full blur-[100px]" />

      <div className="relative container-authority px-4 md:px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto mb-5 flex items-center justify-center shadow-lg shadow-primary/25">
                <Certificate size={32} className="text-white" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {pt('verify.title')}
              </h1>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {pt('verify.subtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                  {pt('verify.enterCode')}
                </label>
                <input
                  type="text"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(formatCode(e.target.value))}
                  placeholder={pt('verify.codePlaceholder')}
                  maxLength={9}
                  className="w-full px-4 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-center text-2xl font-mono tracking-[0.3em] placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:tracking-[0.3em]"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !sessionCode.trim()}
                className="w-full btn-authority btn-primary-authority justify-center py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="text-primary dark:text-blue-400 hover:text-primary-dark dark:hover:text-blue-300 font-semibold inline-flex items-center gap-2 transition-colors"
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
