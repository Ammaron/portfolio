'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/i18n-context';
import {
  Users,
  Clock,
  BookOpen,
  Headphones,
  PencilSimple,
  Microphone,
  CheckCircle,
  WarningCircle,
  ArrowLeft,
  ArrowRight,
  Spinner,
  Pause
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';

export default function PersonalizedTestIntroPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);
  const [showResumeForm, setShowResumeForm] = useState(false);
  const [resumeCode, setResumeCode] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    consent: false
  });

  const pt = (key: string) => t('placementTest', key);

  const instructions = [
    'This test evaluates all 4 skills: Reading, Listening, Writing, and Speaking',
    'You can pause and resume the test using your session code',
    'Writing and Speaking sections require typed and recorded responses',
    'An expert will review your responses and provide personalized feedback',
    'Results will be available within 24-48 hours'
  ];

  const handleStart = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.consent) {
      toast.error('Please agree to the terms to continue');
      return;
    }

    setIsStarting(true);

    try {
      const response = await fetch('/api/placement-test/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test_mode: 'personalized',
          student_name: formData.name.trim(),
          student_email: formData.email.trim(),
          student_phone: formData.phone.trim() || undefined
        })
      });

      const result = await response.json();

      if (result.success) {
        sessionStorage.setItem('placement_session', JSON.stringify(result.session));
        router.push(`/${locale}/placement-test/personalized/test?session=${result.session.id}`);
      } else {
        toast.error(result.error || 'Failed to start test');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleResume = async () => {
    if (!resumeCode.trim()) {
      toast.error('Please enter your session code');
      return;
    }

    setIsStarting(true);

    try {
      const response = await fetch('/api/placement-test/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_code: resumeCode.toUpperCase().trim() })
      });

      const result = await response.json();

      if (result.success) {
        sessionStorage.setItem('placement_session', JSON.stringify(result.session));
        router.push(`/${locale}/placement-test/personalized/test?session=${result.session.id}`);
      } else {
        toast.error(result.error || 'Failed to resume test');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  const formatCode = (value: string) => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleaned.length > 4) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}`;
    }
    return cleaned;
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container-authority px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Users size={20} weight="fill" className="text-primary" />
              <span className="text-sm font-medium text-primary">Comprehensive Assessment</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {pt('personalized.intro.title')}
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300">
              {pt('personalized.intro.subtitle')}
            </p>
          </div>

          {/* Test Overview */}
          <div className="authority-card p-8 mb-8">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <Clock size={32} className="text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">45-60</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">minutes</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <BookOpen size={32} className="text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">40-50</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">questions</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex justify-center gap-1 mb-2">
                  <BookOpen size={20} className="text-primary" />
                  <Headphones size={20} className="text-primary" />
                  <PencilSimple size={20} className="text-primary" />
                  <Microphone size={20} className="text-primary" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">4</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">skills tested</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <Pause size={32} className="text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">Yes</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">pause/resume</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                What to expect:
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

            {/* Important Note */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-300 flex items-center gap-2">
                <WarningCircle size={20} />
                Important
              </h3>
              <ul className="space-y-2 text-blue-700 dark:text-blue-400 text-sm">
                <li>• You will need a microphone for the speaking section</li>
                <li>• Find a quiet place for recording your responses</li>
                <li>• Your session code will allow you to resume if interrupted</li>
                <li>• Results include expert feedback within 24-48 hours</li>
              </ul>
            </div>
          </div>

          {/* Resume Section */}
          {showResumeForm ? (
            <div className="authority-card p-8 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                {pt('personalized.pause.resume')}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {pt('personalized.pause.sessionCode')}
                  </label>
                  <input
                    type="text"
                    value={resumeCode}
                    onChange={(e) => setResumeCode(formatCode(e.target.value))}
                    placeholder="XXXX-XXXX"
                    maxLength={9}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-xl font-mono tracking-wider"
                    disabled={isStarting}
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowResumeForm(false)}
                    className="flex-1 btn-authority btn-secondary-authority justify-center"
                    disabled={isStarting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResume}
                    disabled={isStarting || !resumeCode.trim()}
                    className="flex-1 btn-authority btn-primary-authority justify-center disabled:opacity-50"
                  >
                    {isStarting ? (
                      <>
                        <Spinner size={20} className="mr-2 animate-spin" />
                        Resuming...
                      </>
                    ) : (
                      <>
                        {pt('personalized.pause.resumeButton')}
                        <ArrowRight size={20} className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowResumeForm(true)}
              className="w-full text-center text-primary hover:text-primary-dark font-medium mb-8"
            >
              Have a session code? Click here to resume
            </button>
          )}

          {/* Registration Form */}
          {!showResumeForm && (
            <div className="authority-card p-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                {pt('personalized.intro.registrationTitle')}
              </h2>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {pt('personalized.registration.name')} *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={pt('personalized.registration.namePlaceholder')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      disabled={isStarting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {pt('personalized.registration.email')} *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={pt('personalized.registration.emailPlaceholder')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      disabled={isStarting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {pt('personalized.registration.phone')} <span className="font-normal text-gray-500 dark:text-gray-400">{pt('personalized.registration.phoneOptional')}</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={pt('personalized.registration.phonePlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={isStarting}
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-1 w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                    disabled={isStarting}
                  />
                  <label htmlFor="consent" className="text-sm text-gray-600 dark:text-gray-400">
                    {pt('personalized.registration.consentText')}
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={() => router.push(`/${locale}/placement-test`)}
                    className="btn-authority btn-secondary-authority flex-1 justify-center"
                    disabled={isStarting}
                  >
                    <ArrowLeft size={20} className="mr-2" />
                    Back
                  </button>

                  <button
                    onClick={handleStart}
                    disabled={isStarting || !formData.name.trim() || !formData.email.trim() || !formData.consent}
                    className="btn-authority btn-primary-authority flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isStarting ? (
                      <>
                        <Spinner size={20} className="mr-2 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      <>
                        {pt('personalized.registration.startButton')}
                        <ArrowRight size={20} className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
