import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('privacyPolicyPage.hero.title')}</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {t('privacyPolicyPage.hero.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              <strong>{t('privacyPolicyPage.lastUpdatedLabel')}</strong> {t('privacyPolicyPage.lastUpdatedValue')}
            </p>

            <div className="space-y-12">
              {/* Information We Collect */}
              <section>
                <div className="flex items-center mb-6">
                  <Database className="w-8 h-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('privacyPolicyPage.informationCollected.title')}</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>{t('privacyPolicyPage.informationCollected.intro')}</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t('privacyPolicyPage.informationCollected.items.1')}</li>
                    <li>{t('privacyPolicyPage.informationCollected.items.2')}</li>
                    <li>{t('privacyPolicyPage.informationCollected.items.3')}</li>
                    <li>{t('privacyPolicyPage.informationCollected.items.4')}</li>
                    <li>{t('privacyPolicyPage.informationCollected.items.5')}</li>
                  </ul>
                  <p>{t('privacyPolicyPage.informationCollected.outro')}</p>
                </div>
              </section>

              {/* How We Use Information */}
              <section>
                <div className="flex items-center mb-6">
                  <Eye className="w-8 h-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('privacyPolicyPage.howWeUse.title')}</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>{t('privacyPolicyPage.howWeUse.intro')}</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t('privacyPolicyPage.howWeUse.items.1')}</li>
                    <li>{t('privacyPolicyPage.howWeUse.items.2')}</li>
                    <li>{t('privacyPolicyPage.howWeUse.items.3')}</li>
                    <li>{t('privacyPolicyPage.howWeUse.items.4')}</li>
                    <li>{t('privacyPolicyPage.howWeUse.items.5')}</li>
                    <li>{t('privacyPolicyPage.howWeUse.items.6')}</li>
                  </ul>
                </div>
              </section>

              {/* Data Protection */}
              <section>
                <div className="flex items-center mb-6">
                  <Lock className="w-8 h-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('privacyPolicyPage.security.title')}</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>{t('privacyPolicyPage.security.intro')}</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t('privacyPolicyPage.security.items.1')}</li>
                    <li>{t('privacyPolicyPage.security.items.2')}</li>
                    <li>{t('privacyPolicyPage.security.items.3')}</li>
                    <li>{t('privacyPolicyPage.security.items.4')}</li>
                    <li>{t('privacyPolicyPage.security.items.5')}</li>
                  </ul>
                </div>
              </section>

              {/* Your Rights */}
              <section>
                <div className="flex items-center mb-6">
                  <UserCheck className="w-8 h-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('privacyPolicyPage.rights.title')}</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>{t('privacyPolicyPage.rights.intro')}</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t('privacyPolicyPage.rights.items.1')}</li>
                    <li>{t('privacyPolicyPage.rights.items.2')}</li>
                    <li>{t('privacyPolicyPage.rights.items.3')}</li>
                    <li>{t('privacyPolicyPage.rights.items.4')}</li>
                    <li>{t('privacyPolicyPage.rights.items.5')}</li>
                    <li>{t('privacyPolicyPage.rights.items.6')}</li>
                  </ul>
                  <p>{t('privacyPolicyPage.rights.contactPrefix')} <a href="mailto:support@hydrobeacon.org" className="text-primary hover:underline">support@hydrobeacon.org</a></p>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <div className="flex items-center mb-6">
                  <FileText className="w-8 h-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('privacyPolicyPage.contact.title')}</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>{t('privacyPolicyPage.contact.intro')}</p>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p><strong>{t('privacyPolicyPage.contact.emailLabel')}</strong> <a href="mailto:support@hydrobeacon.org" className="text-primary hover:underline">support@hydrobeacon.org</a></p>
                    <p><strong>{t('privacyPolicyPage.contact.generalContact')}</strong> <a href="mailto:support@hydrobeacon.org" className="text-primary hover:underline">support@hydrobeacon.org</a></p>
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

export default PrivacyPolicy;



