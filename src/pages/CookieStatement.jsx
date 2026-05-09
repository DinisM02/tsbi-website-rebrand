import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cookie, Settings, Eye, BarChart, Shield, Info } from 'lucide-react';

const CookieStatement = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Cookie className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('cookieStatementPage.hero.title')}</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {t('cookieStatementPage.hero.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              <strong>{t('cookieStatementPage.lastUpdatedLabel')}</strong> {t('cookieStatementPage.lastUpdatedValue')}
            </p>

            <div className="space-y-12">
              {/* What Are Cookies */}
              <section>
                <div className="flex items-center mb-6">
                  <Info className="w-8 h-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('cookieStatementPage.whatAreCookies.title')}</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>{t('cookieStatementPage.whatAreCookies.p1')}</p>
                  <p>{t('cookieStatementPage.whatAreCookies.p2')}</p>
                </div>
              </section>

              {/* Types of Cookies */}
              <section>
                <div className="flex items-center mb-6">
                  <Settings className="w-8 h-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('cookieStatementPage.types.title')}</h2>
                </div>
                <div className="space-y-6">
                  <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-700 mb-2">{t('cookieStatementPage.types.essential.title')}</h3>
                    <p className="text-gray-700">{t('cookieStatementPage.types.essential.text')}</p>
                    <p className="text-sm text-gray-600 mt-2"><strong>{t('cookieStatementPage.examplesLabel')}</strong> {t('cookieStatementPage.types.essential.examples')}</p>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-700 mb-2">{t('cookieStatementPage.types.functional.title')}</h3>
                    <p className="text-gray-700">{t('cookieStatementPage.types.functional.text')}</p>
                    <p className="text-sm text-gray-600 mt-2"><strong>{t('cookieStatementPage.examplesLabel')}</strong> {t('cookieStatementPage.types.functional.examples')}</p>
                  </div>

                  <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-700 mb-2">{t('cookieStatementPage.types.analytics.title')}</h3>
                    <p className="text-gray-700">{t('cookieStatementPage.types.analytics.text')}</p>
                    <p className="text-sm text-gray-600 mt-2"><strong>{t('cookieStatementPage.examplesLabel')}</strong> {t('cookieStatementPage.types.analytics.examples')}</p>
                  </div>

                  <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-orange-700 mb-2">{t('cookieStatementPage.types.performance.title')}</h3>
                    <p className="text-gray-700">{t('cookieStatementPage.types.performance.text')}</p>
                    <p className="text-sm text-gray-600 mt-2"><strong>{t('cookieStatementPage.examplesLabel')}</strong> {t('cookieStatementPage.types.performance.examples')}</p>
                  </div>
                </div>
              </section>

              {/* How We Use Cookies */}
              <section>
                <div className="flex items-center mb-6">
                  <Eye className="w-8 h-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('cookieStatementPage.howWeUse.title')}</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>{t('cookieStatementPage.howWeUse.intro')}</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t('cookieStatementPage.howWeUse.items.1')}</li>
                    <li>{t('cookieStatementPage.howWeUse.items.2')}</li>
                    <li>{t('cookieStatementPage.howWeUse.items.3')}</li>
                    <li>{t('cookieStatementPage.howWeUse.items.4')}</li>
                    <li>{t('cookieStatementPage.howWeUse.items.5')}</li>
                    <li>{t('cookieStatementPage.howWeUse.items.6')}</li>
                    <li>{t('cookieStatementPage.howWeUse.items.7')}</li>
                  </ul>
                </div>
              </section>

              {/* Third-Party Cookies */}
              <section>
                <div className="flex items-center mb-6">
                  <BarChart className="w-8 h-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('cookieStatementPage.thirdParty.title')}</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>{t('cookieStatementPage.thirdParty.intro')}</p>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <ul className="space-y-3">
                      <li><strong>{t('cookieStatementPage.thirdParty.items.googleAnalytics.label')}</strong> {t('cookieStatementPage.thirdParty.items.googleAnalytics.text')}</li>
                      <li><strong>{t('cookieStatementPage.thirdParty.items.openStreetMap.label')}</strong> {t('cookieStatementPage.thirdParty.items.openStreetMap.text')}</li>
                      <li><strong>{t('cookieStatementPage.thirdParty.items.weatherApis.label')}</strong> {t('cookieStatementPage.thirdParty.items.weatherApis.text')}</li>
                      <li><strong>{t('cookieStatementPage.thirdParty.items.cdn.label')}</strong> {t('cookieStatementPage.thirdParty.items.cdn.text')}</li>
                    </ul>
                  </div>
                  <p>{t('cookieStatementPage.thirdParty.outro')}</p>
                </div>
              </section>

              {/* Managing Cookies */}
              <section>
                <div className="flex items-center mb-6">
                  <Shield className="w-8 h-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('cookieStatementPage.managing.title')}</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>{t('cookieStatementPage.managing.intro')}</p>
                  
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-blue-700 mb-2">{t('cookieStatementPage.managing.browser.title')}</h3>
                    <p>{t('cookieStatementPage.managing.browser.intro')}</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>{t('cookieStatementPage.managing.browser.items.1')}</li>
                      <li>{t('cookieStatementPage.managing.browser.items.2')}</li>
                      <li>{t('cookieStatementPage.managing.browser.items.3')}</li>
                      <li>{t('cookieStatementPage.managing.browser.items.4')}</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-green-700 mb-2">{t('cookieStatementPage.managing.ourSettings.title')}</h3>
                    <p>{t('cookieStatementPage.managing.ourSettings.text')}</p>
                  </div>

                  <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
                    <p><strong>{t('cookieStatementPage.managing.importantLabel')}</strong> {t('cookieStatementPage.managing.importantText')}</p>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <div className="flex items-center mb-6">
                  <Info className="w-8 h-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('cookieStatementPage.questions.title')}</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>{t('cookieStatementPage.questions.intro')}</p>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p><strong>{t('cookieStatementPage.questions.privacyTeam')}</strong> <a href="mailto:support@hydrobeacon.org" className="text-primary hover:underline">support@hydrobeacon.org</a></p>
                    <p><strong>{t('cookieStatementPage.questions.generalContact')}</strong> <a href="mailto:support@hydrobeacon.org" className="text-primary hover:underline">support@hydrobeacon.org</a></p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieStatement;



