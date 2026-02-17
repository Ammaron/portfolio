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
  ArrowRight,
  XCircle,
  GraduationCap,
  ChartLineUp,
  Target,
  Sparkle
} from '@phosphor-icons/react';

export default function PlacementTestLandingPage() {
  const { t, locale } = useI18n();

  const pt = (key: string) => t('placementTest', key);

  const benefits = [
    {
      icon: <Target size={28} weight="duotone" />,
      text: 'Get an accurate assessment of your current English level',
    },
    {
      icon: <ChartLineUp size={28} weight="duotone" />,
      text: 'Receive personalized recommendations for improvement',
    },
    {
      icon: <Sparkle size={28} weight="duotone" />,
      text: 'Understand your strengths and areas for development',
    },
    {
      icon: <Certificate size={28} weight="duotone" />,
      text: 'Get a certificate to verify your English proficiency',
    },
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
    <div className="min-h-screen pt-20">
      {/* Hero Section - Dark for maximum contrast */}
      <section className="relative overflow-hidden bg-gray-900 py-20 lg:py-28">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
        {/* Accent glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 rounded-full blur-[120px]" />

        <div className="relative container-authority px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full mb-8">
              <GraduationCap size={20} className="text-amber-400" />
              <span className="text-sm font-semibold text-white/90 tracking-wide uppercase">CEFR Levels A1-C2</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              {pt('landing.title')}
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 mb-4 font-medium">
              {pt('landing.subtitle')}
            </p>

            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
              {pt('landing.description')}
            </p>

            {/* Benefits grid */}
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4 text-left"
                >
                  <span className="text-amber-400 flex-shrink-0 mt-0.5">{benefit.icon}</span>
                  <span className="text-gray-200 text-sm leading-snug">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mode Selection */}
      <section className="py-16 lg:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container-authority px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            {pt('landing.selectMode')}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-xl mx-auto">
            Choose the assessment that fits your needs and schedule.
          </p>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Quick Mode Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />

              <div className="absolute top-5 right-5">
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-bold rounded-full uppercase tracking-wide">
                  {pt('modes.quick.badge')}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl text-white shadow-lg shadow-amber-500/25">
                  <Lightning size={28} weight="fill" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pt('modes.quick.title')}
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {pt('modes.quick.description')}
              </p>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Clock size={18} className="text-gray-500 dark:text-gray-400" />
                  <span>{pt('modes.quick.duration')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Headphones size={18} className="text-gray-500 dark:text-gray-400" />
                  <span>{pt('modes.quick.skills')}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {quickFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <CheckCircle size={20} weight="fill" className="text-emerald-500 flex-shrink-0" />
                    <span className="text-sm font-medium">{feature}</span>
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 border-primary/30 dark:border-primary/40 shadow-lg shadow-primary/5">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />

              <div className="absolute top-5 right-5">
                <span className="px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-300 text-xs font-bold rounded-full uppercase tracking-wide">
                  {pt('modes.personalized.badge')}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-xl text-white shadow-lg shadow-primary/25">
                  <Users size={28} weight="fill" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pt('modes.personalized.title')}
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {pt('modes.personalized.description')}
              </p>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Clock size={18} className="text-gray-500 dark:text-gray-400" />
                  <span>{pt('modes.personalized.duration')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Certificate size={18} className="text-gray-500 dark:text-gray-400" />
                  <span>{pt('modes.personalized.skills')}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {personalizedFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <CheckCircle size={20} weight="fill" className="text-emerald-500 flex-shrink-0" />
                    <span className="text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/${locale}/placement-test/personalized`}
                className="btn-authority btn-primary-authority w-full justify-center group-hover:scale-[1.02] transition-transform"
              >
                {pt('modes.personalized.cta')}
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container-authority px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-10 text-gray-900 dark:text-white">
            {pt('modes.compare.title')}
          </h2>

          <div className="max-w-3xl mx-auto overflow-x-auto">
            <table className="w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-6 py-4 text-left text-gray-800 dark:text-gray-200 font-semibold text-sm"></th>
                  <th className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
                      <Lightning size={20} weight="fill" />
                      <span className="font-bold">Quick</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-primary dark:text-blue-400">
                      <Users size={20} weight="fill" />
                      <span className="font-bold">Personalized</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
                <tr>
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200 font-semibold text-sm">
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
                      <BookOpen size={18} className="text-primary dark:text-blue-400" />
                      <Headphones size={18} className="text-primary dark:text-blue-400" />
                      <PencilSimple size={18} className="text-primary dark:text-blue-400" />
                      <Microphone size={18} className="text-primary dark:text-blue-400" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200 font-semibold text-sm">
                    {pt('modes.compare.reviewType')}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300 text-sm font-medium">
                    {pt('modes.compare.automated')}
                  </td>
                  <td className="px-6 py-4 text-center text-primary dark:text-blue-400 text-sm font-bold">
                    {pt('modes.compare.manual')}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200 font-semibold text-sm">
                    {pt('modes.compare.results')}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300 text-sm font-medium">
                    {pt('modes.compare.instant')}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300 text-sm font-medium">
                    {pt('modes.compare.adminReview')}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200 font-semibold text-sm">
                    {pt('modes.compare.pauseResume')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <XCircle size={22} weight="fill" className="text-red-400 dark:text-red-400 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle size={22} weight="fill" className="text-emerald-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200 font-semibold text-sm">
                    {pt('modes.compare.certificate')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle size={22} weight="fill" className="text-emerald-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle size={22} weight="fill" className="text-emerald-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Resume Section */}
      <section className="py-12 bg-gray-100 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
        <div className="container-authority px-4 md:px-6 text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4 font-medium">
            Already started a test?
          </p>
          <Link
            href={`/${locale}/placement-test/verify`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-primary dark:text-blue-400 font-semibold hover:border-primary dark:hover:border-blue-400 hover:shadow-md transition-all"
          >
            Resume or view your results
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
