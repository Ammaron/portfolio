'use client';

import { useI18n } from '@/i18n/i18n-context';
import Link from 'next/link';
import {
  Lightning,
  Users,
  Clock,
  Certificate,
  CheckCircle,
  Headphones,
  BookOpen,
  PencilSimple,
  Microphone,
  ArrowRight
} from '@phosphor-icons/react';

export default function PlacementTestLandingPage() {
  const { t, locale } = useI18n();

  const pt = (key: string) => t('placementTest', key);

  const benefits = [
    'Get an accurate assessment of your current English level',
    'Receive personalized recommendations for improvement',
    'Understand your strengths and areas for development',
    'Get a certificate to verify your English proficiency'
  ];

  const quickFeatures = [
    '20 adaptive questions',
    'Instant results',
    'Automated scoring',
    'Basic certificate'
  ];

  const personalizedFeatures = [
    '40-50 adaptive questions',
    'Writing & Speaking included',
    'Expert review & feedback',
    'Detailed certificate',
    'Pause & resume anytime'
  ];

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="container-authority px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <BookOpen size={20} className="text-primary" />
              <span className="text-sm font-medium text-primary">CEFR Levels A1-C2</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="gradient-text-authority">{pt('landing.title')}</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">
              {pt('landing.subtitle')}
            </p>

            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
              {pt('landing.description')}
            </p>

            {/* Benefits */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-16">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                {pt('landing.whyTakeTest')}
              </h2>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle size={24} weight="fill" className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mode Selection */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container-authority px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            {pt('landing.selectMode')}
          </h2>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Quick Mode Card */}
            <div className="authority-card p-8 relative overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium rounded-full">
                  {pt('modes.quick.badge')}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl text-white">
                  <Lightning size={28} weight="fill" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pt('modes.quick.title')}
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {pt('modes.quick.description')}
              </p>

              <div className="flex items-center gap-6 mb-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>{pt('modes.quick.duration')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones size={18} />
                  <span>{pt('modes.quick.skills')}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {quickFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <CheckCircle size={20} weight="fill" className="text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/${locale}/placement-test/quick`}
                className="btn-authority btn-primary-authority w-full justify-center group-hover:scale-[1.02] transition-transform"
              >
                {pt('modes.quick.cta')}
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>

            {/* Personalized Mode Card */}
            <div className="authority-card p-8 relative overflow-hidden group hover:shadow-xl transition-shadow border-2 border-primary/20">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                  {pt('modes.personalized.badge')}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-primary rounded-xl text-white">
                  <Users size={28} weight="fill" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pt('modes.personalized.title')}
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {pt('modes.personalized.description')}
              </p>

              <div className="flex items-center gap-6 mb-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>{pt('modes.personalized.duration')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Certificate size={18} />
                  <span>{pt('modes.personalized.skills')}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {personalizedFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <CheckCircle size={20} weight="fill" className="text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/${locale}/placement-test/personalized`}
                className="btn-authority btn-secondary-authority w-full justify-center group-hover:scale-[1.02] transition-transform"
              >
                {pt('modes.personalized.cta')}
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16">
        <div className="container-authority px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            {pt('modes.compare.title')}
          </h2>

          <div className="max-w-3xl mx-auto overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300 font-semibold"></th>
                  <th className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
                      <Lightning size={20} weight="fill" />
                      <span className="font-semibold">Quick</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <Users size={20} weight="fill" />
                      <span className="font-semibold">Personalized</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">
                    {pt('modes.compare.skillsCovered')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <BookOpen size={18} className="text-gray-500 dark:text-gray-400" />
                      <Headphones size={18} className="text-gray-500 dark:text-gray-400" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <BookOpen size={18} className="text-primary" />
                      <Headphones size={18} className="text-primary" />
                      <PencilSimple size={18} className="text-primary" />
                      <Microphone size={18} className="text-primary" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">
                    {pt('modes.compare.reviewType')}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">
                    {pt('modes.compare.automated')}
                  </td>
                  <td className="px-6 py-4 text-center text-primary font-medium">
                    {pt('modes.compare.manual')}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">
                    {pt('modes.compare.results')}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">
                    {pt('modes.compare.instant')}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">
                    {pt('modes.compare.adminReview')}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">
                    {pt('modes.compare.pauseResume')}
                  </td>
                  <td className="px-6 py-4 text-center text-red-600 dark:text-red-400">
                    {pt('modes.compare.no')}
                  </td>
                  <td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-medium">
                    {pt('modes.compare.yes')}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">
                    {pt('modes.compare.certificate')}
                  </td>
                  <td className="px-6 py-4 text-center text-green-500">
                    <CheckCircle size={20} weight="fill" className="mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center text-green-500">
                    <CheckCircle size={20} weight="fill" className="mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Resume Section */}
      <section className="py-12 bg-gray-100 dark:bg-gray-800/50">
        <div className="container-authority px-4 md:px-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Already started a test?
          </p>
          <Link
            href={`/${locale}/placement-test/verify`}
            className="text-primary hover:text-primary-dark font-medium inline-flex items-center gap-2"
          >
            Resume or view your results
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
