import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Clock, Send, Check } from 'lucide-react';
import { OptimizedImage } from '../components/OptimizedImage';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { submitContact } from '../firebase/firestore';

import heroImage from '../assets/hero-images/pages/contact-hero.jpg';
import heroImageWebp from '../assets/hero-images/pages/contact-hero.webp';
import contactBg from '../assets/contact-form-bg.jpeg';
import faqImage from '../assets/faq-image.png';
import ScrollIndicator from '../components/ScrollIndicator';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t('contactPage.validation.nameRequired');
    if (!formData.email) newErrors.email = t('contactPage.validation.emailRequired');
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('contactPage.validation.emailInvalid');
    if (!formData.subject.trim()) newErrors.subject = t('contactPage.validation.subjectRequired');
    if (!formData.message.trim()) newErrors.message = t('contactPage.validation.messageRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      await submitContact(formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }, 5000);
    } catch (err) {
      console.error('Error submitting contact:', err);
      setSubmitError(t('contactPage.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative text-white h-[480px] overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <OptimizedImage 
            webpSrc={heroImageWebp}
            fallbackSrc={heroImage} 
            alt={t('contactPage.hero.alt')} 
            className="w-full h-full object-cover" 
            fetchPriority="high" 
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">{t('contactPage.hero.title')}</h1>
          <p className="text-xl max-w-2xl mx-auto drop-shadow-md">
            {t('contactPage.hero.descriptionLine1')}<br />
            {t('contactPage.hero.descriptionLine2')}
          </p>
        </div>
      </section>

      {/* Contact Information (Cards) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Email */}
          <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary/30 transition-all duration-300">
            <div className="bg-primary/10 p-5 rounded-full mb-5">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('contactPage.cards.email.title')}</h3>
            <p className="text-gray-600 mb-2">{t('contactPage.cards.email.subtitle')}</p>
            <a
              href="mailto:support@hydrobeacon.org"
              className="text-primary hover:underline font-medium text-base break-all"
            >
              support@hydrobeacon.org
            </a>
          </div>

          {/* Online Support */}
          <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary/30 transition-all duration-300">
            <div className="bg-primary/10 p-5 rounded-full mb-5">
              <Phone className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('contactPage.cards.support.title')}</h3>
            <p className="text-gray-600">{t('contactPage.cards.support.platformLabel')}</p>
            <p className="text-primary font-medium mb-2">{t('contactPage.cards.support.platformValue')}</p>
            <p className="text-gray-600">{t('contactPage.cards.support.responseLabel')}</p>
            <p className="text-primary font-medium">{t('contactPage.cards.support.responseValue')}</p>
          </div>

          {/* Online Platform */}
          <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary/30 transition-all duration-300">
            <div className="bg-primary/10 p-5 rounded-full mb-5">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('contactPage.cards.platform.title')}</h3>
            <ul className="text-gray-600 space-y-1">
              <li>{t('contactPage.cards.platform.item1')}</li>
              <li>{t('contactPage.cards.platform.item2')}</li>
              <li>{t('contactPage.cards.platform.item3')}</li>
              <li>{t('contactPage.cards.platform.item4')}</li>
            </ul>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary/30 transition-all duration-300">
            <div className="bg-primary/10 p-5 rounded-full mb-5">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('contactPage.cards.hours.title')}</h3>
            <div className="space-y-1 text-gray-600">
              <p>{t('contactPage.cards.hours.weekdays')}: <span className="text-primary font-semibold">{t('contactPage.cards.hours.weekdaysTime')}</span></p>
              <p>{t('contactPage.cards.hours.saturday')}: <span className="text-primary font-semibold">{t('contactPage.cards.hours.saturdayTime')}</span></p>
              <p>{t('contactPage.cards.hours.sunday')}: <span className="text-primary font-semibold">{t('contactPage.cards.hours.closed')}</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section
        className="relative py-24 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${contactBg})` }}
      >
        {/* Overlay branco com 50% de opacidade */}
        <div className="absolute inset-0 bg-white opacity-50"></div>
        
        <div className="relative z-10 container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            {t('contactPage.form.title')}
          </h2>

          <div className="max-w-3xl mx-auto">
            {showSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  {t('contactPage.form.successTitle')}
                </h3>
                <p className="text-green-700">{t('contactPage.form.successSubtitle')}</p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white p-10 rounded-xl border border-white/30 shadow-[0_0_15px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
              >
                {submitError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {submitError}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      {t('contactPage.form.fields.name')} *
                    </Label>
                    <Input
                      id="name" name="name" type="text"
                      value={formData.name} onChange={handleChange}
                      className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
                      placeholder={t('contactPage.form.placeholders.name')}
                    />
                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      {t('contactPage.form.fields.email')} *
                    </Label>
                    <Input
                      id="email" name="email" type="email"
                      value={formData.email} onChange={handleChange}
                      className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                      placeholder={t('contactPage.form.placeholders.email')}
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-medium">
                      {t('contactPage.form.fields.phone')}
                    </Label>
                    <Input
                      id="phone" name="phone" type="tel"
                      value={formData.phone} onChange={handleChange}
                      placeholder={t('contactPage.form.placeholders.phone')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-gray-700 font-medium">
                      {t('contactPage.form.fields.subject')} *
                    </Label>
                    <Input
                      id="subject" name="subject" type="text"
                      value={formData.subject} onChange={handleChange}
                      className={`mt-1 ${errors.subject ? 'border-red-500' : ''}`}
                      placeholder={t('contactPage.form.placeholders.subject')}
                    />
                    {errors.subject && <p className="text-sm text-red-500 mt-1">{errors.subject}</p>}
                  </div>
                </div>

                <div className="mb-6">
                  <Label htmlFor="message" className="text-gray-700 font-medium">
                    {t('contactPage.form.fields.message')} *
                  </Label>
                  <textarea
                    id="message" name="message" rows={5}
                    value={formData.message} onChange={handleChange}
                    className={`w-full mt-1 rounded-md border ${errors.message ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring-primary`}
                    placeholder={t('contactPage.form.placeholders.message')}
                  />
                  {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>}
                </div>

                <div className="flex items-center mb-6">
                  <input
                    id="privacy-policy" name="privacy-policy" type="checkbox"
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" required
                  />
                  <label htmlFor="privacy-policy" className="ml-2 text-gray-700 text-sm">
                    {t('contactPage.form.privacyPrefix')} <a href="#" className="text-primary hover:underline">{t('contactPage.form.privacyPolicy')}</a>.
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg font-semibold rounded-md transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('contactPage.form.sending') : (<><Send className="w-5 h-5 mr-2 inline" />{t('contactPage.form.sendButton')}</>)}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">
            {t('contactPage.faq.title')}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="flex justify-center lg:justify-start bg-gray-100 p-6 rounded-lg">
              <img
                src={faqImage}
                alt={t('contactPage.faq.imageAlt')}
                className="w-full max-w-md h-auto rounded-lg object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="space-y-10">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {t('contactPage.faq.items.responseTime.question')}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('contactPage.faq.items.responseTime.answer')}
                </p>
              </div>

              <div className="border-t border-gray-300 pt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {t('contactPage.faq.items.onsiteTraining.question')}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('contactPage.faq.items.onsiteTraining.answer')}
                </p>
              </div>

              <div className="border-t border-gray-300 pt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {t('contactPage.faq.items.scheduleDemo.question')}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('contactPage.faq.items.scheduleDemo.answer')}
                </p>
              </div>

              <div className="border-t border-gray-300 pt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {t('contactPage.faq.items.languages.question')}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('contactPage.faq.items.languages.answer')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ScrollIndicator />
    </div>
  );
};

export default Contact;

