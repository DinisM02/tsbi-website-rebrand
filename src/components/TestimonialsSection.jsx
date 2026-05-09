import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const { t } = useTranslation();
  const testimonials = [
    {
      id: 1,
      name: t('testimonialsSection.items.sarah.name'),
      role: t('testimonialsSection.items.sarah.role'),
      location: t('testimonialsSection.items.sarah.location'),
      avatar: "SJ",
      content: t('testimonialsSection.items.sarah.content'),
      rating: 5
    },
    {
      id: 2,
      name: t('testimonialsSection.items.chen.name'),
      role: t('testimonialsSection.items.chen.role'),
      location: t('testimonialsSection.items.chen.location'),
      avatar: "MC",
      content: t('testimonialsSection.items.chen.content'),
      rating: 5
    },
    {
      id: 3,
      name: t('testimonialsSection.items.maria.name'),
      role: t('testimonialsSection.items.maria.role'),
      location: t('testimonialsSection.items.maria.location'),
      avatar: "MR",
      content: t('testimonialsSection.items.maria.content'),
      rating: 5
    }
  ];

  const partners = [
    { name: t('testimonialsSection.partners.items.fema'), icon: "🏛️" },
    { name: t('testimonialsSection.partners.items.redCross'), icon: "🏥" },
    { name: t('testimonialsSection.partners.items.noaa'), icon: "🌊" },
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

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 rounded-xl p-8 relative">
              <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-gray-500">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
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

