import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Handshake, Building, Users, Globe, Target, ArrowRight, CheckCircle, X, Mail, User, MessageSquare } from 'lucide-react';
import { submitPartnerInquiry } from '../firebase/firestore';

const PartnerWithUs = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (submitStatus.message) {
      setSubmitStatus({ type: '', message: '' });
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitting(true);
    setSubmitStatus({ type: '', message: '' });
    try {
      await submitPartnerInquiry(formData);
      setSubmitStatus({ type: 'success', message: t('partnerWithUsPage.form.status.success') });
      setIsModalOpen(false);
      setFormData({ name: '', email: '', organization: '', message: '' });
    } catch (err) {
      console.error('Error submitting partnership inquiry:', err);
      setSubmitStatus({ type: 'error', message: t('partnerWithUsPage.form.status.error') });
    } finally {
      setSubmitting(false);
    }
  };

  const partnerTypes = [
    {
      title: t('partnerWithUsPage.partnerTypes.items.government.title'),
      description: t('partnerWithUsPage.partnerTypes.items.government.description'),
      benefits: [
        t('partnerWithUsPage.partnerTypes.items.government.benefits.1'),
        t('partnerWithUsPage.partnerTypes.items.government.benefits.2'),
        t('partnerWithUsPage.partnerTypes.items.government.benefits.3'),
        t('partnerWithUsPage.partnerTypes.items.government.benefits.4')
      ],
      icon: <Building className="w-8 h-8 text-blue-600" />
    },
    {
      title: t('partnerWithUsPage.partnerTypes.items.education.title'),
      description: t('partnerWithUsPage.partnerTypes.items.education.description'),
      benefits: [
        t('partnerWithUsPage.partnerTypes.items.education.benefits.1'),
        t('partnerWithUsPage.partnerTypes.items.education.benefits.2'),
        t('partnerWithUsPage.partnerTypes.items.education.benefits.3'),
        t('partnerWithUsPage.partnerTypes.items.education.benefits.4')
      ],
      icon: <Users className="w-8 h-8 text-green-600" />
    },
    {
      title: t('partnerWithUsPage.partnerTypes.items.technology.title'),
      description: t('partnerWithUsPage.partnerTypes.items.technology.description'),
      benefits: [
        t('partnerWithUsPage.partnerTypes.items.technology.benefits.1'),
        t('partnerWithUsPage.partnerTypes.items.technology.benefits.2'),
        t('partnerWithUsPage.partnerTypes.items.technology.benefits.3'),
        t('partnerWithUsPage.partnerTypes.items.technology.benefits.4')
      ],
      icon: <Globe className="w-8 h-8 text-purple-600" />
    },
    {
      title: t('partnerWithUsPage.partnerTypes.items.nonProfit.title'),
      description: t('partnerWithUsPage.partnerTypes.items.nonProfit.description'),
      benefits: [
        t('partnerWithUsPage.partnerTypes.items.nonProfit.benefits.1'),
        t('partnerWithUsPage.partnerTypes.items.nonProfit.benefits.2'),
        t('partnerWithUsPage.partnerTypes.items.nonProfit.benefits.3'),
        t('partnerWithUsPage.partnerTypes.items.nonProfit.benefits.4')
      ],
      icon: <Target className="w-8 h-8 text-orange-600" />
    }
  ];

  const partnershipLevels = [
    {
      level: t('partnerWithUsPage.levels.items.community.level'),
      description: t('partnerWithUsPage.levels.items.community.description'),
      features: [
        t('partnerWithUsPage.levels.items.community.features.1'),
        t('partnerWithUsPage.levels.items.community.features.2'),
        t('partnerWithUsPage.levels.items.community.features.3'),
        t('partnerWithUsPage.levels.items.community.features.4')
      ],
      commitment: t('partnerWithUsPage.levels.items.community.commitment')
    },
    {
      level: t('partnerWithUsPage.levels.items.strategic.level'),
      description: t('partnerWithUsPage.levels.items.strategic.description'),
      features: [
        t('partnerWithUsPage.levels.items.strategic.features.1'),
        t('partnerWithUsPage.levels.items.strategic.features.2'),
        t('partnerWithUsPage.levels.items.strategic.features.3'),
        t('partnerWithUsPage.levels.items.strategic.features.4')
      ],
      commitment: t('partnerWithUsPage.levels.items.strategic.commitment')
    },
    {
      level: t('partnerWithUsPage.levels.items.enterprise.level'),
      description: t('partnerWithUsPage.levels.items.enterprise.description'),
      features: [
        t('partnerWithUsPage.levels.items.enterprise.features.1'),
        t('partnerWithUsPage.levels.items.enterprise.features.2'),
        t('partnerWithUsPage.levels.items.enterprise.features.3'),
        t('partnerWithUsPage.levels.items.enterprise.features.4')
      ],
      commitment: t('partnerWithUsPage.levels.items.enterprise.commitment')
    }
  ];

  const steps = [
    {
      step: 1,
      title: t('partnerWithUsPage.steps.items.1.title'),
      description: t('partnerWithUsPage.steps.items.1.description')
    },
    {
      step: 2,
      title: t('partnerWithUsPage.steps.items.2.title'),
      description: t('partnerWithUsPage.steps.items.2.description')
    },
    {
      step: 3,
      title: t('partnerWithUsPage.steps.items.3.title'),
      description: t('partnerWithUsPage.steps.items.3.description')
    },
    {
      step: 4,
      title: t('partnerWithUsPage.steps.items.4.title'),
      description: t('partnerWithUsPage.steps.items.4.description')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Handshake className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('partnerWithUsPage.hero.title')}</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {t('partnerWithUsPage.hero.description')}
            </p>
            {submitStatus.message && (
              <div className={`mt-6 mx-auto max-w-2xl rounded-lg px-4 py-3 text-sm font-medium ${submitStatus.type === 'success' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}>
                {submitStatus.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Why Partner Section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('partnerWithUsPage.whyPartner.title')}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('partnerWithUsPage.whyPartner.description')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col items-center h-full">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 flex-shrink-0">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('partnerWithUsPage.whyPartner.cards.expandedReach.title')}</h3>
              <p className="text-gray-600 flex-grow">{t('partnerWithUsPage.whyPartner.cards.expandedReach.text')}</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col items-center h-full">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 flex-shrink-0">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('partnerWithUsPage.whyPartner.cards.sharedExpertise.title')}</h3>
              <p className="text-gray-600 flex-grow">{t('partnerWithUsPage.whyPartner.cards.sharedExpertise.text')}</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col items-center h-full">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('partnerWithUsPage.whyPartner.cards.provenImpact.title')}</h3>
              <p className="text-gray-600 flex-grow">{t('partnerWithUsPage.whyPartner.cards.provenImpact.text')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Types Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('partnerWithUsPage.partnerTypes.title')}</h2>
            <p className="text-lg text-gray-600">
              {t('partnerWithUsPage.partnerTypes.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {partnerTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    {type.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 ml-3">{type.title}</h3>
                </div>
                
                <p className="text-gray-700 mb-4 flex-grow">{type.description}</p>
                
                <div className="flex-grow">
                  <h4 className="font-semibold text-gray-900 mb-3">{t('partnerWithUsPage.partnerTypes.benefitsTitle')}</h4>
                  <ul className="space-y-2">
                    {type.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partnership Levels Section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('partnerWithUsPage.levels.title')}</h2>
            <p className="text-lg text-gray-600">
              {t('partnerWithUsPage.levels.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {partnershipLevels.map((level, index) => (
              <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-primary transition-colors flex flex-col h-full">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{level.level}</h3>
                  <p className="text-gray-600">{level.description}</p>
                </div>
                
                <div className="space-y-3 mb-6 flex-grow">
                  {level.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-auto">
                  <p className="text-sm text-gray-500 mb-4">{t('partnerWithUsPage.levels.commitmentLabel')} {level.commitment}</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {t('partnerWithUsPage.levels.learnMore')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Stories Section */}
      <div className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('partnerWithUsPage.impact.title')}</h2>
            <p className="text-lg text-gray-600">
              {t('partnerWithUsPage.impact.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
              <div className="flex items-center mb-4">
                <Building className="w-8 h-8 text-blue-600 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold">{t('partnerWithUsPage.impact.cards.government.title')}</h3>
                  <p className="text-sm text-gray-600">{t('partnerWithUsPage.impact.cards.government.subtitle')}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 flex-grow">
                {t('partnerWithUsPage.impact.cards.government.quote')}
              </p>
              <div className="text-sm text-gray-600">
                <strong>{t('partnerWithUsPage.impact.expectedLabel')}</strong> {t('partnerWithUsPage.impact.cards.government.expected')}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 text-green-600 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold">{t('partnerWithUsPage.impact.cards.research.title')}</h3>
                  <p className="text-sm text-gray-600">{t('partnerWithUsPage.impact.cards.research.subtitle')}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 flex-grow">
                {t('partnerWithUsPage.impact.cards.research.quote')}
              </p>
              <div className="text-sm text-gray-600">
                <strong>{t('partnerWithUsPage.impact.expectedLabel')}</strong> {t('partnerWithUsPage.impact.cards.research.expected')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How to Partner Section */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('partnerWithUsPage.steps.title')}</h2>
            <p className="text-lg text-gray-600">
              {t('partnerWithUsPage.steps.description')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="text-center flex flex-col items-center h-full">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold flex-shrink-0">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold mb-3 h-12 flex items-center justify-center text-center px-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 min-h-[60px]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('partnerWithUsPage.cta.title')}</h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('partnerWithUsPage.cta.description')}
          </p>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            {t('partnerWithUsPage.cta.action')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>

      {/* Partnership Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">{t('partnerWithUsPage.form.title')}</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                {t('partnerWithUsPage.form.description')}
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('partnerWithUsPage.form.fields.name')} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={t('partnerWithUsPage.form.placeholders.name')}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('partnerWithUsPage.form.fields.email')} *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={t('partnerWithUsPage.form.placeholders.email')}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('partnerWithUsPage.form.fields.organization')} *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={t('partnerWithUsPage.form.placeholders.organization')}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('partnerWithUsPage.form.fields.message')} *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder={t('partnerWithUsPage.form.placeholders.message')}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={submitting}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    {t('partnerWithUsPage.form.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    {submitting ? t('partnerWithUsPage.form.sending') : t('partnerWithUsPage.form.send')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerWithUs;