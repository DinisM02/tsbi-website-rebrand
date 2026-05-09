import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Users, MapPin, Clock, Star, ArrowRight, X } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { submitVolunteerApplication } from '../firebase/firestore';

const VolunteerOpportunities = () => {
  const { t } = useTranslation();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [applyForm, setApplyForm] = useState({ name: '', email: '', phone: '', experience: '', availability: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleApply = (title) => {
    setSelectedRole(title);
    setShowApplyModal(true);
    setSubmitted(false);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyForm.name || !applyForm.email) return;
    setSubmitting(true);
    try {
      await submitVolunteerApplication({ ...applyForm, opportunity: selectedRole });
      setSubmitted(true);
      setApplyForm({ name: '', email: '', phone: '', experience: '', availability: '', message: '' });
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const opportunities = [
    {
      id: 1,
      title: t('volunteerOpportunitiesPage.opportunities.items.1.title'),
      location: t('volunteerOpportunitiesPage.opportunities.items.1.location'),
      time: t('volunteerOpportunitiesPage.opportunities.items.1.time'),
      urgency: 'high',
      description: t('volunteerOpportunitiesPage.opportunities.items.1.description'),
      requirements: [
        t('volunteerOpportunitiesPage.opportunities.items.1.requirements.1'),
        t('volunteerOpportunitiesPage.opportunities.items.1.requirements.2'),
        t('volunteerOpportunitiesPage.opportunities.items.1.requirements.3')
      ],
      icon: "🚨"
    },
    {
      id: 2,
      title: t('volunteerOpportunitiesPage.opportunities.items.2.title'),
      location: t('volunteerOpportunitiesPage.opportunities.items.2.location'),
      time: t('volunteerOpportunitiesPage.opportunities.items.2.time'),
      urgency: 'medium',
      description: t('volunteerOpportunitiesPage.opportunities.items.2.description'),
      requirements: [
        t('volunteerOpportunitiesPage.opportunities.items.2.requirements.1'),
        t('volunteerOpportunitiesPage.opportunities.items.2.requirements.2'),
        t('volunteerOpportunitiesPage.opportunities.items.2.requirements.3')
      ],
      icon: "🥽"
    },
    {
      id: 3,
      title: t('volunteerOpportunitiesPage.opportunities.items.3.title'),
      location: t('volunteerOpportunitiesPage.opportunities.items.3.location'),
      time: t('volunteerOpportunitiesPage.opportunities.items.3.time'),
      urgency: 'high',
      description: t('volunteerOpportunitiesPage.opportunities.items.3.description'),
      requirements: [
        t('volunteerOpportunitiesPage.opportunities.items.3.requirements.1'),
        t('volunteerOpportunitiesPage.opportunities.items.3.requirements.2'),
        t('volunteerOpportunitiesPage.opportunities.items.3.requirements.3')
      ],
      icon: "📢"
    },
    {
      id: 4,
      title: t('volunteerOpportunitiesPage.opportunities.items.4.title'),
      location: t('volunteerOpportunitiesPage.opportunities.items.4.location'),
      time: t('volunteerOpportunitiesPage.opportunities.items.4.time'),
      urgency: 'medium',
      description: t('volunteerOpportunitiesPage.opportunities.items.4.description'),
      requirements: [
        t('volunteerOpportunitiesPage.opportunities.items.4.requirements.1'),
        t('volunteerOpportunitiesPage.opportunities.items.4.requirements.2'),
        t('volunteerOpportunitiesPage.opportunities.items.4.requirements.3')
      ],
      icon: "📊"
    },
    {
      id: 5,
      title: t('volunteerOpportunitiesPage.opportunities.items.5.title'),
      location: t('volunteerOpportunitiesPage.opportunities.items.5.location'),
      time: t('volunteerOpportunitiesPage.opportunities.items.5.time'),
      urgency: 'low',
      description: t('volunteerOpportunitiesPage.opportunities.items.5.description'),
      requirements: [
        t('volunteerOpportunitiesPage.opportunities.items.5.requirements.1'),
        t('volunteerOpportunitiesPage.opportunities.items.5.requirements.2'),
        t('volunteerOpportunitiesPage.opportunities.items.5.requirements.3')
      ],
      icon: "✍️"
    },
    {
      id: 6,
      title: t('volunteerOpportunitiesPage.opportunities.items.6.title'),
      location: t('volunteerOpportunitiesPage.opportunities.items.6.location'),
      time: t('volunteerOpportunitiesPage.opportunities.items.6.time'),
      urgency: 'medium',
      description: t('volunteerOpportunitiesPage.opportunities.items.6.description'),
      requirements: [
        t('volunteerOpportunitiesPage.opportunities.items.6.requirements.1'),
        t('volunteerOpportunitiesPage.opportunities.items.6.requirements.2'),
        t('volunteerOpportunitiesPage.opportunities.items.6.requirements.3')
      ],
      icon: "💻"
    }
  ];

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="w-16 h-16 mx-auto mb-6 text-red-300" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('volunteerOpportunitiesPage.hero.title')}</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {t('volunteerOpportunitiesPage.hero.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Why Volunteer Section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('volunteerOpportunitiesPage.whyVolunteer.title')}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('volunteerOpportunitiesPage.whyVolunteer.description')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('volunteerOpportunitiesPage.whyVolunteer.cards.saveLives.title')}</h3>
              <p className="text-gray-600">{t('volunteerOpportunitiesPage.whyVolunteer.cards.saveLives.text')}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('volunteerOpportunitiesPage.whyVolunteer.cards.developSkills.title')}</h3>
              <p className="text-gray-600">{t('volunteerOpportunitiesPage.whyVolunteer.cards.developSkills.text')}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('volunteerOpportunitiesPage.whyVolunteer.cards.buildCommunity.title')}</h3>
              <p className="text-gray-600">{t('volunteerOpportunitiesPage.whyVolunteer.cards.buildCommunity.text')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Opportunities Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('volunteerOpportunitiesPage.opportunities.title')}</h2>
            <p className="text-lg text-gray-600">
              {t('volunteerOpportunitiesPage.opportunities.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opportunity) => (
              <div key={opportunity.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <span className="text-2xl flex-shrink-0 mt-1">{opportunity.icon}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{opportunity.title}</h3>
                      <div className="flex flex-wrap items-center text-sm text-gray-600 mt-1 gap-2">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{opportunity.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{opportunity.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Urgency Badge */}
                <div className="mb-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(opportunity.urgency)}`}>
                    {t(`volunteerOpportunitiesPage.opportunities.urgency.${opportunity.urgency}`)} {t('volunteerOpportunitiesPage.opportunities.prioritySuffix')}
                  </span>
                </div>
                
                {/* Description */}
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">{opportunity.description}</p>
                
                {/* Requirements */}
                <div className="mb-6 flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm mb-2">{t('volunteerOpportunitiesPage.opportunities.requirementsLabel')}</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {opportunity.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">???</span>
                        <span className="flex-1">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Button */}
                <button
                  onClick={() => handleApply(opportunity.title)}
                  className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center mt-auto"
                >
                  {t('volunteerOpportunitiesPage.opportunities.applyNow')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How to Apply Section */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('volunteerOpportunitiesPage.howToApply.title')}</h2>
            <p className="text-lg text-gray-600">
              {t('volunteerOpportunitiesPage.howToApply.description')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('volunteerOpportunitiesPage.howToApply.steps.1.title')}</h3>
              <p className="text-gray-600">{t('volunteerOpportunitiesPage.howToApply.steps.1.text')}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('volunteerOpportunitiesPage.howToApply.steps.2.title')}</h3>
              <p className="text-gray-600">{t('volunteerOpportunitiesPage.howToApply.steps.2.text')}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('volunteerOpportunitiesPage.howToApply.steps.3.title')}</h3>
              <p className="text-gray-600">{t('volunteerOpportunitiesPage.howToApply.steps.3.text')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('volunteerOpportunitiesPage.contact.title')}</h2>
          <p className="text-lg text-gray-600 mb-8">
            {t('volunteerOpportunitiesPage.contact.description')}
          </p>
          
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('volunteerOpportunitiesPage.contact.coordinatorLabel')}</h3>
                <p className="text-gray-600 mb-2">{t('volunteerOpportunitiesPage.contact.coordinatorName')}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('volunteerOpportunitiesPage.contact.generalContactLabel')}</h3>
                <p className="text-primary">support@hydrobeacon.org</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Volunteer Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowApplyModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {submitted ? t('volunteerOpportunitiesPage.modal.submittedTitle') : t('volunteerOpportunitiesPage.modal.applyTitle', { role: selectedRole })}
              </h2>
              <button onClick={() => setShowApplyModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-gray-600">{t('volunteerOpportunitiesPage.modal.submittedMessage')}</p>
                <Button onClick={() => setShowApplyModal(false)} className="mt-4 bg-primary text-white">{t('volunteerOpportunitiesPage.modal.close')}</Button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">{t('volunteerOpportunitiesPage.modal.fields.fullName')} *</Label>
                  <Input value={applyForm.name} onChange={(e) => setApplyForm(p => ({...p, name: e.target.value}))} className="mt-1" placeholder={t('volunteerOpportunitiesPage.modal.placeholders.fullName')} />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">{t('volunteerOpportunitiesPage.modal.fields.email')} *</Label>
                  <Input type="email" value={applyForm.email} onChange={(e) => setApplyForm(p => ({...p, email: e.target.value}))} className="mt-1" placeholder={t('volunteerOpportunitiesPage.modal.placeholders.email')} />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">{t('volunteerOpportunitiesPage.modal.fields.phone')}</Label>
                  <Input value={applyForm.phone} onChange={(e) => setApplyForm(p => ({...p, phone: e.target.value}))} className="mt-1" placeholder={t('volunteerOpportunitiesPage.modal.placeholders.phone')} />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">{t('volunteerOpportunitiesPage.modal.fields.experience')}</Label>
                  <textarea value={applyForm.experience} onChange={(e) => setApplyForm(p => ({...p, experience: e.target.value}))} className="mt-1 w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" rows={2} placeholder={t('volunteerOpportunitiesPage.modal.placeholders.experience')} />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">{t('volunteerOpportunitiesPage.modal.fields.availability')}</Label>
                  <Input value={applyForm.availability} onChange={(e) => setApplyForm(p => ({...p, availability: e.target.value}))} className="mt-1" placeholder={t('volunteerOpportunitiesPage.modal.placeholders.availability')} />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">{t('volunteerOpportunitiesPage.modal.fields.motivation')}</Label>
                  <textarea value={applyForm.message} onChange={(e) => setApplyForm(p => ({...p, message: e.target.value}))} className="mt-1 w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" rows={3} placeholder={t('volunteerOpportunitiesPage.modal.placeholders.motivation')} />
                </div>
                <Button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-primary/90 text-white">
                  {submitting ? t('volunteerOpportunitiesPage.modal.submitting') : t('volunteerOpportunitiesPage.modal.submit')}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerOpportunities;

