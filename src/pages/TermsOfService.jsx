import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, AlertTriangle, Scale, Users, Shield, CheckCircle } from 'lucide-react';

const TermsOfService = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Scale className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('termsOfServicePage.hero.title')}</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {t('termsOfServicePage.hero.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              <strong>{t('termsOfServicePage.lastUpdatedLabel')}</strong> {t('termsOfServicePage.lastUpdatedValue')}
            </p>

            <div className="space-y-12">
              {/* Acceptance of Terms */}
              <section>
                <div className="flex items-center mb-6">
                  <CheckCircle className="w-8 h-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('termsOfServicePage.acceptance.title')}</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>{t('termsOfServicePage.acceptance.text')}</p>
                </div>
              </section>

              {/* Service Description */}
              <section>
                <div className="flex items-center mb-6">
                  <Shield className="w-8 h-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('termsOfServicePage.serviceDescription.title')}</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>{t('termsOfServicePage.serviceDescription.intro')}</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t('termsOfServicePage.serviceDescription.items.1')}</li>
                    <li>{t('termsOfServicePage.serviceDescription.items.2')}</li>
                    <li>{t('termsOfServicePage.serviceDescription.items.3')}</li>
                    <li>{t('termsOfServicePage.serviceDescription.items.4')}</li>
                    <li>{t('termsOfServicePage.serviceDescription.items.5')}</li>
                    <li>{t('termsOfServicePage.serviceDescription.items.6')}</li>
                  </ul>
                  <p>{t('termsOfServicePage.serviceDescription.outro')}</p>
                </div>
              </section>

              {/* User Responsibilities */}
              <section>
                <div className="flex items-center mb-6">
                  <Users className="w-8 h-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('termsOfServicePage.userResponsibilities.title')}</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>{t('termsOfServicePage.userResponsibilities.intro')}</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t('termsOfServicePage.userResponsibilities.items.1')}</li>
                    <li>{t('termsOfServicePage.userResponsibilities.items.2')}</li>
                    <li>{t('termsOfServicePage.userResponsibilities.items.3')}</li>
                    <li>{t('termsOfServicePage.userResponsibilities.items.4')}</li>
                    <li>{t('termsOfServicePage.userResponsibilities.items.5')}</li>
                    <li>{t('termsOfServicePage.userResponsibilities.items.6')}</li>
                  </ul>
                </div>
              </section>

              {/* Emergency Disclaimer */}
              <section>
                <div className="flex items-center mb-6">
                  <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('termsOfServicePage.emergencyDisclaimer.title')}</h2>
                </div>
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                  <div className="space-y-4 text-gray-700">
                    <p><strong>{t('termsOfServicePage.emergencyDisclaimer.importantLabel')}</strong> {t('termsOfServicePage.emergencyDisclaimer.intro')}</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>{t('termsOfServicePage.emergencyDisclaimer.items.1')}</li>
                      <li>{t('termsOfServicePage.emergencyDisclaimer.items.2')}</li>
                      <li>{t('termsOfServicePage.emergencyDisclaimer.items.3')}</li>
                      <li>{t('termsOfServicePage.emergencyDisclaimer.items.4')}</li>
                      <li>{t('termsOfServicePage.emergencyDisclaimer.items.5')}</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section>
                <div className="flex items-center mb-6">
                  <Scale className="w-8 h-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('termsOfServicePage.liability.title')}</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>{t('termsOfServicePage.liability.intro')}</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t('termsOfServicePage.liability.items.1')}</li>
                    <li>{t('termsOfServicePage.liability.items.2')}</li>
                    <li>{t('termsOfServicePage.liability.items.3')}</li>
                    <li>{t('termsOfServicePage.liability.items.4')}</li>
                    <li>{t('termsOfServicePage.liability.items.5')}</li>
                  </ul>
                  <p>{t('termsOfServicePage.liability.outro')}</p>
                </div>
              </section>

              {/* Privacy and Data */}
              <section>
                <div className="flex items-center mb-6">
                  <FileText className="w-8 h-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('termsOfServicePage.privacyData.title')}</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>{t('termsOfServicePage.privacyData.p1')} <a href="/privacy-policy" className="text-primary hover:underline">{t('termsOfServicePage.privacyData.privacyPolicyLink')}</a> {t('termsOfServicePage.privacyData.p1End')}</p>
                  <p>{t('termsOfServicePage.privacyData.p2')}</p>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <div className="flex items-center mb-6">
                  <FileText className="w-8 h-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('termsOfServicePage.contact.title')}</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>{t('termsOfServicePage.contact.intro')}</p>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p><strong>{t('termsOfServicePage.contact.emailLabel')}</strong> <a href="mailto:support@hydrobeacon.org" className="text-primary hover:underline">support@hydrobeacon.org</a></p>
                    <p><strong>{t('termsOfServicePage.contact.generalContact')}</strong> <a href="mailto:support@hydrobeacon.org" className="text-primary hover:underline">support@hydrobeacon.org</a></p>
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

export default TermsOfService;



