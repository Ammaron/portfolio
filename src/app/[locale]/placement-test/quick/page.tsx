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
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  Spinner,
  User
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
    <div className="min-h-screen pt-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-full mb-6 shadow-lg shadow-amber-500/30">
            <Lightning size={20} weight="fill" />
            <span className="text-sm font-bold uppercase tracking-wide">Quick Assessment</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            {pt('quick.intro.title')}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {pt('quick.intro.subtitle')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center transform hover:scale-105 transition-transform">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={28} weight="bold" className="text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">~25</p>
            <p className="text-base font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">Minutes</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center transform hover:scale-105 transition-transform">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={28} weight="bold" className="text-green-600 dark:text-green-400" />
            </div>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">20</p>
            <p className="text-base font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">Questions</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center transform hover:scale-105 transition-transform">
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Headphones size={28} weight="bold" className="text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">2</p>
            <p className="text-base font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">Skills Tested</p>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
            <CheckCircle size={28} weight="fill" className="text-green-500" />
            Before You Start
          </h2>

          <ul className="space-y-4 mb-8">
            {instructions.map((instruction, index) => (
              <li key={index} className="flex items-start gap-4">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle size={16} weight="fill" className="text-green-600 dark:text-green-400" />
                </div>
                <span className="text-lg text-gray-700 dark:text-gray-200">{instruction}</span>
              </li>
            ))}
          </ul>

          {/* Tips Section */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
            <h3 className="text-xl font-bold mb-4 text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <Lightbulb size={24} weight="fill" className="text-amber-500" />
              Tips for Best Results
            </h3>
            <ul className="space-y-3">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3 text-amber-900 dark:text-amber-200">
                  <span className="text-amber-500 font-bold">•</span>
                  <span className="text-base">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Name Input & Start Button */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <label className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-3">
              <User size={20} weight="bold" />
              Your Name
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-5 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl
                         focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                         placeholder-gray-400 dark:placeholder-gray-500 transition-all"
              disabled={isStarting}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push(`/${locale}/placement-test`)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold
                         bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200
                         hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all
                         border-2 border-gray-300 dark:border-gray-600"
              disabled={isStarting}
            >
              <ArrowLeft size={20} weight="bold" />
              {pt('quick.intro.backButton')}
            </button>

            <button
              onClick={handleStart}
              disabled={isStarting || !name.trim()}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-lg font-bold
                         rounded-xl transition-all ${
                           name.trim() && !isStarting
                             ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 cursor-pointer'
                             : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed'
                         }`}
            >
              {isStarting ? (
                <>
                  <Spinner size={20} className="animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  {pt('quick.intro.startButton')}
                  <ArrowRight size={20} weight="bold" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
