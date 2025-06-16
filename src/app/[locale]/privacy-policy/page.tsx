'use client';

import { useI18n } from '@/i18n/i18n-context';

export default function PrivacyPolicy() {
  const { t, tRaw } = useI18n();

  // Helper function to safely handle arrays
  const safeArray = (value: any): string[] => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return [value];
    return [];
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container-authority section-padding-authority">
        <div className="max-w-4xl mx-auto">
          <div className="authority-card p-8 md:p-12">
            <h1 className="text-section-title-authority mb-6 gradient-text-authority">
              {t('privacyPolicy', 'title')}
            </h1>
            
            <p className="text-gray-600 mb-8">
              <strong>{t('privacyPolicy', 'lastUpdated')}</strong>
            </p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacyPolicy', 'introduction.title')}</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('privacyPolicy', 'introduction.content')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacyPolicy', 'informationWeCollect.title')}</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{t('privacyPolicy', 'informationWeCollect.websiteAnalytics.title')}</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('privacyPolicy', 'informationWeCollect.websiteAnalytics.description')}
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  {safeArray(tRaw('privacyPolicy', 'informationWeCollect.websiteAnalytics.items')).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">{t('privacyPolicy', 'informationWeCollect.contactInformation.title')}</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('privacyPolicy', 'informationWeCollect.contactInformation.description')}
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  {safeArray(tRaw('privacyPolicy', 'informationWeCollect.contactInformation.items')).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacyPolicy', 'howWeUse.title')}</h2>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  {safeArray(tRaw('privacyPolicy', 'howWeUse.items')).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacyPolicy', 'whatWeDont.title')}</h2>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <ul className="list-disc list-inside text-green-800 space-y-2">
                    {safeArray(tRaw('privacyPolicy', 'whatWeDont.items')).map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacyPolicy', 'yourRights.title')}</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('privacyPolicy', 'yourRights.description')}
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  {safeArray(tRaw('privacyPolicy', 'yourRights.items')).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacyPolicy', 'dataSecurity.title')}</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('privacyPolicy', 'dataSecurity.content')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacyPolicy', 'thirdPartyServices.title')}</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('privacyPolicy', 'thirdPartyServices.description')}
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  {safeArray(tRaw('privacyPolicy', 'thirdPartyServices.items')).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('privacyPolicy', 'thirdPartyServices.footer')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacyPolicy', 'contactUs.title')}</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('privacyPolicy', 'contactUs.description')}
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-700 mb-2"><strong>Email:</strong> ammaron99@gmail.com</p>
                  <p className="text-gray-700 mb-2"><strong>Phone:</strong> (435) 893-6006</p>
                  <p className="text-gray-700"><strong>Location:</strong> Cedar City, Utah</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacyPolicy', 'changes.title')}</h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('privacyPolicy', 'changes.content')}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}