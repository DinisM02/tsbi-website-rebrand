import React from 'react';
import { useTranslation } from 'react-i18next';
import { Home, Users, HeartHandshake, MapPin } from 'lucide-react';

const useCaseIcons = { resident: Home, leader: Users, volunteer: HeartHandshake };

const TestimonialsSection = () => {
  const { t } = useTranslation();
  // Illustrative use cases (not real testimonials)
  const useCases = ['resident', 'leader', 'volunteer'].map((key) => ({
    id: key,
    name: t(`testimonialsSection.items.${key}.name`),
    location: t(`testimonialsSection.items.${key}.location`),
    content: t(`testimonialsSection.items.${key}.content`),
  }));

  const partners = [
    { name: t('testimonialsSection.partners.items.ingd'), icon: "🏛️" },
    { name: t('testimonialsSection.partners.items.redCross'), icon: "🏥" },
    { name: t('testimonialsSection.partners.items.ara'), icon: "🌊" },
    { name: t('testimonialsSection.partners.items.emergencyManagement'), icon: "🚨" },
    { name: t('testimonialsSection.partners.items.weatherService'), icon: "⛈️" },
    { name: t('testimonialsSection.partners.items.localAuthorities'), icon: "🏢" }
  ];

  const stats = [
    { number: t('testimonialsSection.stats.values.livesToProtect'), label: t('testimonialsSection.stats.livesToProtect') },
    { number: t('testimonialsSection.stats.values.communitiesToServe'), label: t('testimonialsSection.stats.communitiesToServe') },
    { number: t('testimonialsSection.stats.values.targetAlertAccuracy'), label: t('testimonialsSection.stats.targetAlertAccuracy') },
    { number: t('testimonialsSection.stats.values.plannedMonitoring'), label: t('testimonialsSection.stats.plannedMonitoring') }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('testimonialsSection.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('testimonialsSection.description')}
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {useCases.map((useCase) => {
            const Icon = useCaseIcons[useCase.id];
            return (
              <div key={useCase.id} className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{useCase.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {useCase.location}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{useCase.content}</p>
              </div>
            );
          })}
        </div>

        {/* Partners Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            {t('testimonialsSection.partnersTitle')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{partner.icon}</div>
                <div className="text-sm font-medium text-gray-600">{partner.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="bg-primary/5 rounded-xl p-6">
              <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

