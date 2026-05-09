import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Heart, MessageCircle, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

const CommunityGuidelines = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Users className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('communityGuidelinesPage.hero.title')}</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {t('communityGuidelinesPage.hero.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <div className="space-y-12">
              {/* Our Mission */}
              <section>
                <div className="flex items-center mb-6">
                  <Heart className="w-8 h-8 text-red-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('communityGuidelinesPage.mission.title')}</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>{t('communityGuidelinesPage.mission.p1')}</p>
                  <p>{t('communityGuidelinesPage.mission.p2')}</p>
                </div>
              </section>

              {/* Core Values */}
              <section>
                <div className="flex items-center mb-6">
                  <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('communityGuidelinesPage.values.title')}</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-primary mb-2">{t('communityGuidelinesPage.values.safetyFirst.title')}</h3>
                    <p className="text-gray-700">{t('communityGuidelinesPage.values.safetyFirst.text')}</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-green-600 mb-2">{t('communityGuidelinesPage.values.mutualSupport.title')}</h3>
                    <p className="text-gray-700">{t('communityGuidelinesPage.values.mutualSupport.text')}</p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-purple-600 mb-2">{t('communityGuidelinesPage.values.inclusivity.title')}</h3>
                    <p className="text-gray-700">{t('communityGuidelinesPage.values.inclusivity.text')}</p>
                  </div>
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-orange-600 mb-2">{t('communityGuidelinesPage.values.continuousLearning.title')}</h3>
                    <p className="text-gray-700">{t('communityGuidelinesPage.values.continuousLearning.text')}</p>
                  </div>
                </div>
              </section>

              {/* Community Standards */}
              <section>
                <div className="flex items-center mb-6">
                  <MessageCircle className="w-8 h-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('communityGuidelinesPage.standards.title')}</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-green-600 mb-3">{t('communityGuidelinesPage.standards.doTitle')}</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>{t('communityGuidelinesPage.standards.doItems.1')}</li>
                      <li>{t('communityGuidelinesPage.standards.doItems.2')}</li>
                      <li>{t('communityGuidelinesPage.standards.doItems.3')}</li>
                      <li>{t('communityGuidelinesPage.standards.doItems.4')}</li>
                      <li>{t('communityGuidelinesPage.standards.doItems.5')}</li>
                      <li>{t('communityGuidelinesPage.standards.doItems.6')}</li>
                      <li>{t('communityGuidelinesPage.standards.doItems.7')}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-red-600 mb-3">{t('communityGuidelinesPage.standards.dontTitle')}</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>{t('communityGuidelinesPage.standards.dontItems.1')}</li>
                      <li>{t('communityGuidelinesPage.standards.dontItems.2')}</li>
                      <li>{t('communityGuidelinesPage.standards.dontItems.3')}</li>
                      <li>{t('communityGuidelinesPage.standards.dontItems.4')}</li>
                      <li>{t('communityGuidelinesPage.standards.dontItems.5')}</li>
                      <li>{t('communityGuidelinesPage.standards.dontItems.6')}</li>
                      <li>{t('communityGuidelinesPage.standards.dontItems.7')}</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Emergency Communication */}
              <section>
                <div className="flex items-center mb-6">
                  <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('communityGuidelinesPage.emergency.title')}</h2>
                </div>
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                  <div className="space-y-4 text-gray-700">
                    <p><strong>{t('communityGuidelinesPage.emergency.critical')}</strong> {t('communityGuidelinesPage.emergency.contactNow')}</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>{t('communityGuidelinesPage.emergency.servicesLabel')}</strong> {t('communityGuidelinesPage.emergency.servicesValue')}</li>
                      <li><strong>{t('communityGuidelinesPage.emergency.hotlineLabel')}</strong> 1-800-HYDRO-911</li>
                      <li><strong>{t('communityGuidelinesPage.emergency.nonEmergencyLabel')}</strong> support@hydrobeacon.org</li>
                    </ul>
                    <p>{t('communityGuidelinesPage.emergency.note')}</p>
                  </div>
                </div>
              </section>

              {/* Reporting and Moderation */}
              <section>
                <div className="flex items-center mb-6">
                  <Shield className="w-8 h-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('communityGuidelinesPage.reporting.title')}</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>{t('communityGuidelinesPage.reporting.intro')}</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t('communityGuidelinesPage.reporting.items.1')}</li>
                    <li>{t('communityGuidelinesPage.reporting.items.2')}</li>
                    <li>{t('communityGuidelinesPage.reporting.items.3')}</li>
                    <li>{t('communityGuidelinesPage.reporting.items.4')}</li>
                    <li>{t('communityGuidelinesPage.reporting.items.5')}</li>
                  </ul>
                  <p>{t('communityGuidelinesPage.reporting.outro')}</p>
                </div>
              </section>

              {/* Consequences */}
              <section>
                <div className="flex items-center mb-6">
                  <AlertTriangle className="w-8 h-8 text-orange-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('communityGuidelinesPage.consequences.title')}</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>{t('communityGuidelinesPage.consequences.intro')}</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>{t('communityGuidelinesPage.consequences.warningLabel')}</strong> {t('communityGuidelinesPage.consequences.warningText')}</li>
                    <li><strong>{t('communityGuidelinesPage.consequences.suspensionLabel')}</strong> {t('communityGuidelinesPage.consequences.suspensionText')}</li>
                    <li><strong>{t('communityGuidelinesPage.consequences.banLabel')}</strong> {t('communityGuidelinesPage.consequences.banText')}</li>
                    <li><strong>{t('communityGuidelinesPage.consequences.legalLabel')}</strong> {t('communityGuidelinesPage.consequences.legalText')}</li>
                  </ul>
                  <p>{t('communityGuidelinesPage.consequences.outro')}</p>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <div className="flex items-center mb-6">
                  <MessageCircle className="w-8 h-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('communityGuidelinesPage.questions.title')}</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>{t('communityGuidelinesPage.questions.intro')}</p>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p><strong>{t('communityGuidelinesPage.questions.communityTeam')}</strong> <a href="mailto:support@hydrobeacon.org" className="text-primary hover:underline">support@hydrobeacon.org</a></p>
                    <p><strong>{t('communityGuidelinesPage.questions.generalContact')}</strong> <a href="mailto:support@hydrobeacon.org" className="text-primary hover:underline">support@hydrobeacon.org</a></p>
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

export default CommunityGuidelines;



