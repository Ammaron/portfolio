'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/i18n-context';
import {
  Lightning,
  Clock,
  Headphones,
  BookOpen,
  CheckCircle,
  WarningCircle,
  ArrowLeft,
  ArrowRight,
  Spinner
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';

export default function QuickTestIntroPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);
  const [name, setName] = useState('');

  const pt = (key: string) => t('placementTest', key);

  const instructions = [
    'This test contains 20 questions covering Reading and Listening skills',
    'Questions adapt to your level - they get easier or harder based on your answers',
    'You cannot pause or go back once you start',
    'Make sure you have a stable internet connection',
    'Use headphones for the listening section'
  ];

  const tips = [
    'Find a quiet place without distractions',
    'Read each question carefully before answering',
    "Don't spend too long on any single question",
    "If you're unsure, make your best guess and move on"
  ];

  const handleStart = async () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsStarting(true);

    try {
      const response = await fetch('/api/placement-test/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test_mode: 'quick',
          student_name: name.trim()
        })
      });

      const result = await response.json();

      if (result.success) {
        // Store session info and redirect to test
        sessionStorage.setItem('placement_session', JSON.stringify(result.session));
        router.push(`/${locale}/placement-test/quick/test?session=${result.session.id}`);
      } else {
        toast.error(result.error || 'Failed to start test');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container-authority px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-6">
              <Lightning size={20} weight="fill" className="text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Quick Assessment</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {pt('quick.intro.title')}
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400">
              {pt('quick.intro.subtitle')}
            </p>
          </div>

          {/* Test Overview */}
          <div className="authority-card p-8 mb-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <Clock size={32} className="text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">~25</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">minutes</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <BookOpen size={32} className="text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">20</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">questions</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <Headphones size={32} className="text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">skills tested</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Before you start:
              </h2>
              <ul className="space-y-3">
                {instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle size={20} weight="fill" className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-300 flex items-center gap-2">
                <WarningCircle size={20} />
                Tips for best results
              </h3>
              <ul className="space-y-2">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-blue-700 dark:text-blue-400">
                    <span className="text-blue-500">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Name Input & Start Button */}
          <div className="authority-card p-8">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={isStarting}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push(`/${locale}/placement-test`)}
                className="btn-authority btn-secondary-authority flex-1 justify-center"
                disabled={isStarting}
              >
                <ArrowLeft size={20} className="mr-2" />
                {pt('quick.intro.backButton')}
              </button>

              <button
                onClick={handleStart}
                disabled={isStarting || !name.trim()}
                className="btn-authority btn-primary-authority flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isStarting ? (
                  <>
                    <Spinner size={20} className="mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    {pt('quick.intro.startButton')}
                    <ArrowRight size={20} className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
