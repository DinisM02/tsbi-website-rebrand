import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Headphones,
  Users,
  Calendar,
  MapPin,
  Clock,
  Award,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { OptimizedImage } from '../components/OptimizedImage';
import { submitTrainingRequest } from '../firebase/firestore';

import heroImage from '../assets/hero-images/pages/training-hero.jpg';
import heroImageWebp from '../assets/hero-images/pages/training-hero.webp';
import ScrollIndicator from '../components/ScrollIndicator';

// ==========================
// TRAINING CARD
// ==========================
const TrainingCard = ({ title, description, level, duration, format, startDate, onEnroll, enrollLabel }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 flex-grow">{description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <Users className="w-5 h-5 text-primary mr-2" />
          <span className="text-sm text-gray-700">{level}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-5 h-5 text-primary mr-2" />
          <span className="text-sm text-gray-700">{duration}</span>
        </div>
        <div className="flex items-center">
          <Headphones className="w-5 h-5 text-primary mr-2" />
          <span className="text-sm text-gray-700">{format}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="w-5 h-5 text-primary mr-2" />
          <span className="text-sm text-gray-700">{startDate}</span>
        </div>
      </div>

      <button onClick={onEnroll} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm w-full mt-auto">
        {enrollLabel}
      </button>
    </div>
  );
};


const EnrollModal = ({ course, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [form, setForm] = React.useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [submitError, setSubmitError] = React.useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const result = await onSubmit({ ...form, courseName: course });
      setDone(true);
      if (result?.message) {
        setSubmitError(result.message);
      }
    } catch(err) {
      console.error(err);
      setSubmitError(t('trainingPage.enrollModal.submitError'));
    }
    finally { setSubmitting(false); }
  };
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">{t('trainingPage.enrollModal.title', { course })}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        {done ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"><span className="text-green-600 text-xl">âœ“</span></div>
            <p className="font-semibold text-gray-900 mb-1">{t('trainingPage.enrollModal.successTitle')}</p>
            <p className="text-sm text-gray-600">{t('trainingPage.enrollModal.successDescription')}</p>
            <button onClick={onClose} className="mt-4 bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium">{t('trainingPage.enrollModal.close')}</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {submitError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('trainingPage.enrollModal.fullName')} *</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder={t('trainingPage.enrollModal.placeholders.name')} value={form.name} onChange={e => setForm(p=>({...p, name:e.target.value}))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('trainingPage.enrollModal.email')} *</label>
              <input type="email" className="w-full border rounded-lg px-3 py-2 text-sm" placeholder={t('trainingPage.enrollModal.placeholders.email')} value={form.email} onChange={e => setForm(p=>({...p, email:e.target.value}))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('trainingPage.enrollModal.phone')}</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder={t('trainingPage.enrollModal.placeholders.phone')} value={form.phone} onChange={e => setForm(p=>({...p, phone:e.target.value}))} />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={onClose} className="flex-1 border rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50">{t('trainingPage.enrollModal.cancel')}</button>
              <button type="submit" disabled={submitting} className="flex-1 bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                {submitting ? t('trainingPage.enrollModal.submitting') : t('trainingPage.enrollModal.enroll')}
              </button>
            </div>
            <a
              href={`mailto:support@hydrobeacon.org?subject=${encodeURIComponent(`Training Enrollment: ${course}`)}&body=${encodeURIComponent(`Course: ${course}\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}`)}`}
              className="block text-center text-sm font-medium text-primary hover:underline"
            >
              {t('trainingPage.enrollModal.emailFallback')}
            </a>
          </form>
        )}
    </div>
    </div>
  );
};

// ==========================
// TESTIMONIAL CAROUSEL
// ==========================
const TestimonialCarousel = () => {
  const { t } = useTranslation();
  const testimonials = [
    {
      id: 1,
      rating: 5,
      content: t('trainingPage.testimonials.items.1.content'),
      author: "John D.",
      role: t('trainingPage.testimonials.items.1.role'),
      location: "Houston, TX",
      initials: "JD",
    },
    {
      id: 2,
      rating: 5,
      content: t('trainingPage.testimonials.items.2.content'),
      author: "Lisa M.",
      role: t('trainingPage.testimonials.items.2.role'),
      location: "Miami, FL",
      initials: "LM",
    },
    {
      id: 3,
      rating: 5,
      content: t('trainingPage.testimonials.items.3.content'),
      author: "Maria S.",
      role: t('trainingPage.testimonials.items.3.role'),
      location: "New Orleans, LA",
      initials: "MS",
    },
    {
      id: 4,
      rating: 5,
      content: t('trainingPage.testimonials.items.4.content'),
      author: "David K.",
      role: t('trainingPage.testimonials.items.4.role'),
      location: "San Francisco, CA",
      initials: "DK",
    },
    {
      id: 5,
      rating: 5,
      content: t('trainingPage.testimonials.items.5.content'),
      author: "Sarah P.",
      role: t('trainingPage.testimonials.items.5.role'),
      location: "Portland, OR",
      initials: "SP",
    },
    {
      id: 6,
      rating: 5,
      content: t('trainingPage.testimonials.items.6.content'),
      author: "Robert L.",
      role: t('trainingPage.testimonials.items.6.role'),
      location: "Austin, TX",
      initials: "RL",
    },
  ];
  const [currentGroup, setCurrentGroup] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonialsPerGroup = 3;
  const totalGroups = Math.ceil(testimonials.length / testimonialsPerGroup);

  const getCurrentTestimonials = () => {
    const startIndex = currentGroup * testimonialsPerGroup;
    return testimonials.slice(startIndex, startIndex + testimonialsPerGroup);
  };

  const [currentTestimonials, setCurrentTestimonials] = useState(getCurrentTestimonials());

  const nextGroup = () => setCurrentGroup((prev) => (prev + 1) % totalGroups);
  const prevGroup = () => setCurrentGroup((prev) => (prev - 1 + totalGroups) % totalGroups);

  useEffect(() => {
    setCurrentTestimonials(getCurrentTestimonials());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGroup]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextGroup, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoPlaying, currentGroup]);

  return (
    <section
      className="py-8 bg-white relative overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">{t('trainingPage.testimonials.title')}</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            {t('trainingPage.testimonials.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentTestimonials.map((t) => (
            <div
              key={t.id}
              className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 flex flex-col h-full min-h-[300px]"
            >
              <Quote className="w-8 h-8 text-primary/20 mb-4 ml-auto" />
              <div className="flex items-center mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-gray-700 mb-6 leading-relaxed text-base md:text-lg flex-grow line-clamp-4">
                {t.content}
              </blockquote>
              <div className="flex items-center pt-4 border-t border-gray-200">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold mr-4 shadow-md">
                  {t.initials}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{t.author}</div>
                  <div className="text-sm text-gray-600">{t.role}</div>
                  <div className="text-sm text-gray-500">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center space-x-8">
          <button
            onClick={prevGroup}
            className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full shadow-md hover:shadow-xl hover:bg-primary/90 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex space-x-3">
            {Array.from({ length: totalGroups }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentGroup(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentGroup ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextGroup}
            className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full shadow-md hover:shadow-xl hover:bg-primary/90 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

// ==========================
// MAIN PAGE
// ==========================
const Training = () => {
  const { t } = useTranslation();
  // Video modal
  const [showTrainingVideo, setShowTrainingVideo] = useState(false);

  // Custom training modal
  const [showCustomTrainingModal, setShowCustomTrainingModal] = useState(false);

  // Enrollment modal
  const [enrollCourse, setEnrollCourse] = useState(null);

  const [customForm, setCustomForm] = useState({
    name: '',
    org: '',
    role: '',
    email: '',
    phone: '',
    regionCity: '',
    areaType: '',
    trainees: [],
    groupSize: '',
    focus: [],
    usageTiming: '',
    devices: '',
    format: '',
    timeline: '',
    biggestRisk: '',
  });

  const areaTypes = [
    t('trainingPage.customModal.areaTypes.urban'),
    t('trainingPage.customModal.areaTypes.coastal'),
    t('trainingPage.customModal.areaTypes.riverBasin'),
    t('trainingPage.customModal.areaTypes.ruralForest'),
    t('trainingPage.customModal.areaTypes.mixed')
  ];
  const traineeOptions = [
    t('trainingPage.customModal.traineeOptions.responders'),
    t('trainingPage.customModal.traineeOptions.disasterTeams'),
    t('trainingPage.customModal.traineeOptions.volunteers'),
    t('trainingPage.customModal.traineeOptions.authorities'),
    t('trainingPage.customModal.traineeOptions.communityMembers'),
  ];
  const groupSizes = ['<10', '10-50', '50-200', '200+'];
  const focusOptions = [
    t('trainingPage.customModal.focusOptions.earlyWarning'),
    t('trainingPage.customModal.focusOptions.evacuation'),
    t('trainingPage.customModal.focusOptions.rescueFirstAid'),
    t('trainingPage.customModal.focusOptions.equipmentUsage'),
    t('trainingPage.customModal.focusOptions.communicationCoordination'),
    t('trainingPage.customModal.focusOptions.crowdManagement'),
  ];
  const usageOptions = [
    t('trainingPage.customModal.usageOptions.beforeSeason'),
    t('trainingPage.customModal.usageOptions.duringFlood'),
    t('trainingPage.customModal.usageOptions.postFlood'),
  ];
  const deviceOptions = [
    t('trainingPage.customModal.deviceOptions.mobilePhones'),
    t('trainingPage.customModal.deviceOptions.tablets'),
    t('trainingPage.customModal.deviceOptions.arGlasses'),
    t('trainingPage.customModal.deviceOptions.notSureYet'),
  ];
  const formatOptions = [
    t('trainingPage.customModal.formatOptions.stepByStep'),
    t('trainingPage.customModal.formatOptions.simulationScenarios'),
    t('trainingPage.customModal.formatOptions.practiceDrills'),
    t('trainingPage.customModal.formatOptions.combination'),
  ];
  const timelineOptions = [
    t('trainingPage.customModal.timelineOptions.immediately'),
    t('trainingPage.customModal.timelineOptions.withinOneMonth'),
    t('trainingPage.customModal.timelineOptions.beforeNextSeason'),
    t('trainingPage.customModal.timelineOptions.exploringOptions'),
  ];
  const trainingCoursesLocalized = [
    { title: t('trainingPage.courses.1.title'), description: t('trainingPage.courses.1.description'), level: t('trainingPage.courses.1.level'), duration: t('trainingPage.courses.1.duration'), format: t('trainingPage.courses.1.format'), startDate: t('trainingPage.courses.1.startDate') },
    { title: t('trainingPage.courses.2.title'), description: t('trainingPage.courses.2.description'), level: t('trainingPage.courses.2.level'), duration: t('trainingPage.courses.2.duration'), format: t('trainingPage.courses.2.format'), startDate: t('trainingPage.courses.2.startDate') },
    { title: t('trainingPage.courses.3.title'), description: t('trainingPage.courses.3.description'), level: t('trainingPage.courses.3.level'), duration: t('trainingPage.courses.3.duration'), format: t('trainingPage.courses.3.format'), startDate: t('trainingPage.courses.3.startDate') },
    { title: t('trainingPage.courses.4.title'), description: t('trainingPage.courses.4.description'), level: t('trainingPage.courses.4.level'), duration: t('trainingPage.courses.4.duration'), format: t('trainingPage.courses.4.format'), startDate: t('trainingPage.courses.4.startDate') },
    { title: t('trainingPage.courses.5.title'), description: t('trainingPage.courses.5.description'), level: t('trainingPage.courses.5.level'), duration: t('trainingPage.courses.5.duration'), format: t('trainingPage.courses.5.format'), startDate: t('trainingPage.courses.5.startDate') },
    { title: t('trainingPage.courses.6.title'), description: t('trainingPage.courses.6.description'), level: t('trainingPage.courses.6.level'), duration: t('trainingPage.courses.6.duration'), format: t('trainingPage.courses.6.format'), startDate: t('trainingPage.courses.6.startDate') },
  ];

  const updateField = (field, value) => setCustomForm((prev) => ({ ...prev, [field]: value }));

  const toggleMulti = (field, value, max = Infinity) => {
    setCustomForm((prev) => {
      const current = prev[field] || [];
      const exists = current.includes(value);
      if (exists) return { ...prev, [field]: current.filter((v) => v !== value) };
      if (current.length >= max) return prev;
      return { ...prev, [field]: [...current, value] };
    });
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitTrainingRequest({
        ...customForm,
        traineeTypes: customForm.traineeTypes?.join(', '),
        focusAreas: customForm.focusAreas?.join(', '),
      });
      setShowCustomTrainingModal(false);
      setCustomForm({});
    } catch (err) {
      console.error('Error submitting training request:', err);
    }
  };

  const handleEnrollSubmit = async (data) => {
    try {
      await submitTrainingRequest({ ...data, type: 'enrollment' });
      return { ok: true };
    } catch (error) {
      console.error('Error submitting enrollment:', error);
      return {
        ok: false,
        message: t('trainingPage.enrollModal.temporaryUnavailable')
      };
    }
  };

  // Close modals with ESC
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowTrainingVideo(false);
        setShowCustomTrainingModal(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ==========================
          VIDEO MODAL
      ========================== */}
      {showTrainingVideo && (
        <div
          className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowTrainingVideo(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Training Video Preview</h3>
              <button
                onClick={() => setShowTrainingVideo(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-black">
              <video
                controls
                autoPlay
                playsInline
                className="w-full h-full"
                src="/Training.mp4"
                poster="/training-poster.jpeg"
              >
                {t('trainingPage.videoModal.unsupported')}
              </video>
            </div>

            <div className="p-4">
              <p className="text-gray-600">
                {t('trainingPage.videoModal.description')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==========================
          CUSTOM TRAINING MODAL
      ========================== */}
      {showCustomTrainingModal && (
        <div
          className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCustomTrainingModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{t('trainingPage.customModal.title')}</h3>
                <p className="text-sm text-gray-500">{t('trainingPage.customModal.subtitle')}</p>
              </div>
              <button
                onClick={() => setShowCustomTrainingModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCustomSubmit} className="p-4 overflow-y-auto max-h-[calc(90vh-72px)]">
              {/* 1) Contact */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">{t('trainingPage.customModal.sections.contact')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    className="border rounded-lg px-3 py-2"
                    placeholder={t('trainingPage.customModal.placeholders.fullName')}
                    value={customForm.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    required
                  />
                  <input
                    className="border rounded-lg px-3 py-2"
                    placeholder={t('trainingPage.customModal.placeholders.organization')}
                    value={customForm.org}
                    onChange={(e) => updateField('org', e.target.value)}
                  />
                  <input
                    className="border rounded-lg px-3 py-2"
                    placeholder={t('trainingPage.customModal.placeholders.roleTitle')}
                    value={customForm.role}
                    onChange={(e) => updateField('role', e.target.value)}
                  />
                  <input
                    className="border rounded-lg px-3 py-2"
                    placeholder={t('trainingPage.customModal.placeholders.email')}
                    type="email"
                    value={customForm.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    required
                  />
                  <input
                    className="border rounded-lg px-3 py-2 md:col-span-2"
                    placeholder={t('trainingPage.customModal.placeholders.phone')}
                    value={customForm.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                </div>
              </div>

              {/* 2) Location & Context */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">{t('trainingPage.customModal.sections.location')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    className="border rounded-lg px-3 py-2"
                    placeholder={t('trainingPage.customModal.placeholders.regionCity')}
                    value={customForm.regionCity}
                    onChange={(e) => updateField('regionCity', e.target.value)}
                    required
                  />
                  <select
                    className="border rounded-lg px-3 py-2"
                    value={customForm.areaType}
                    onChange={(e) => updateField('areaType', e.target.value)}
                    required
                  >
                    <option value="">{t('trainingPage.customModal.select.typeOfArea')}</option>
                    {areaTypes.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3) Who is the training for? */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">{t('trainingPage.customModal.sections.audience')}</h4>

                <p className="text-sm text-gray-600 mb-2">{t('trainingPage.customModal.primaryTrainees')}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {traineeOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => toggleMulti('trainees', opt)}
                      className={`px-3 py-2 rounded-full border text-sm transition ${
                        customForm.trainees.includes(opt)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <select
                  className="border rounded-lg px-3 py-2 w-full"
                  value={customForm.groupSize}
                  onChange={(e) => updateField('groupSize', e.target.value)}
                  required
                >
                  <option value="">{t('trainingPage.customModal.select.groupSize')}</option>
                  {groupSizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* 4) What should the AR training teach? */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">{t('trainingPage.customModal.sections.trainingScope')}</h4>

                <p className="text-sm text-gray-600 mb-2">{t('trainingPage.customModal.mainFocus')}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {focusOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => toggleMulti('focus', opt, 2)}
                      className={`px-3 py-2 rounded-full border text-sm transition ${
                        customForm.focus.includes(opt)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <select
                  className="border rounded-lg px-3 py-2 w-full"
                  value={customForm.usageTiming}
                  onChange={(e) => updateField('usageTiming', e.target.value)}
                  required
                >
                  <option value="">{t('trainingPage.customModal.select.usageTiming')}</option>
                  {usageOptions.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              {/* 5) Technology */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">{t('trainingPage.customModal.sections.technology')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <select
                    className="border rounded-lg px-3 py-2"
                    value={customForm.devices}
                    onChange={(e) => updateField('devices', e.target.value)}
                    required
                  >
                    <option value="">{t('trainingPage.customModal.select.devices')}</option>
                    {deviceOptions.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>

                  <select
                    className="border rounded-lg px-3 py-2"
                    value={customForm.format}
                    onChange={(e) => updateField('format', e.target.value)}
                    required
                  >
                    <option value="">{t('trainingPage.customModal.select.format')}</option>
                    {formatOptions.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 6) Timeline */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">{t('trainingPage.customModal.sections.timeline')}</h4>
                <select
                  className="border rounded-lg px-3 py-2 w-full"
                  value={customForm.timeline}
                  onChange={(e) => updateField('timeline', e.target.value)}
                  required
                >
                  <option value="">{t('trainingPage.customModal.select.timeline')}</option>
                  {timelineOptions.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* 7) Biggest challenge */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">{t('trainingPage.customModal.sections.biggestChallenge')}</h4>
                <textarea
                  className="border rounded-lg px-3 py-2 w-full min-h-[120px]"
                  placeholder={t('trainingPage.customModal.placeholders.biggestRisk')}
                  value={customForm.biggestRisk}
                  onChange={(e) => updateField('biggestRisk', e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowCustomTrainingModal(false)}
                  className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
                >
                  {t('trainingPage.customModal.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold"
                >
                  {t('trainingPage.customModal.submit')}
                </button>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                {t('trainingPage.customModal.directContact')} <span className="font-medium">support@hydrobeacon.org</span> | WhatsApp: <span className="font-medium">+258848087372</span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative text-white">
        <div className="absolute inset-0 z-0 h-[600px]">
          <OptimizedImage 
            webpSrc={heroImageWebp}
            fallbackSrc={heroImage} 
            alt={t('trainingPage.hero.alt')} 
            className="w-full h-full object-cover" 
            fetchPriority="high" 
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 h-[600px] flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            {t('trainingPage.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto drop-shadow-md leading-relaxed">
            {t('trainingPage.hero.description')}
          </p>
        </div>
      </div>

      {/* Training Overview */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">{t('trainingPage.overview.title')}</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {t('trainingPage.overview.description')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Headphones className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('trainingPage.overview.highlights.immersiveAr.title')}</h3>
                    <p className="text-gray-600">{t('trainingPage.overview.highlights.immersiveAr.text')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('trainingPage.overview.highlights.expertInstructors.title')}</h3>
                    <p className="text-gray-600">{t('trainingPage.overview.highlights.expertInstructors.text')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('trainingPage.overview.highlights.locationSpecific.title')}</h3>
                    <p className="text-gray-600">{t('trainingPage.overview.highlights.locationSpecific.text')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('trainingPage.overview.highlights.certification.title')}</h3>
                    <p className="text-gray-600">{t('trainingPage.overview.highlights.certification.text')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* âœ… VIDEO THUMBNAIL (NO HEADPHONES PLACEHOLDER) */}
            <div className="lg:w-1/2 w-full">
              <button
                type="button"
                onClick={() => setShowTrainingVideo(true)}
                className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-blue-200 group focus:outline-none focus:ring-4 focus:ring-primary/20"
                aria-label={t('trainingPage.overview.playAriaLabel')}
              >
                <img
                  src="/training-poster.jpeg"
                  alt={t('trainingPage.overview.previewAlt')}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />

                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-2 bg-white/95 px-6 py-3 rounded-full shadow-lg group-hover:scale-105 transition-transform">
                    <span className="text-gray-900 font-bold text-lg">â–¶</span>
                    <span className="text-gray-900 font-semibold">{t('trainingPage.overview.play')}</span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 text-left">
                  <p className="text-white font-semibold text-lg leading-tight">
                    {t('trainingPage.overview.previewTitle')}
                  </p>
                  <p className="text-white/80 text-sm">
                    {t('trainingPage.overview.previewSubtitle')}
                  </p>
                </div>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Testimonials */}
      <TestimonialCarousel />

      {/* Available Courses */}
      {enrollCourse && (
        <EnrollModal
          course={enrollCourse}
          onClose={() => setEnrollCourse(null)}
          onSubmit={handleEnrollSubmit}
        />
      )}

      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">{t('trainingPage.coursesTitle')}</h2>
          <p className="text-center text-gray-600 mb-10">{t('trainingPage.coursesDescription')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingCoursesLocalized.map((course) => (
              <TrainingCard
                key={course.title}
                {...course}
                onEnroll={() => setEnrollCourse(course.title)}
                enrollLabel={t('trainingPage.enrollNow')}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Custom Training */}
      <div className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">{t('trainingPage.customTraining.title')}</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            {t('trainingPage.customTraining.description')}
          </p>

          <button
            onClick={() => setShowCustomTrainingModal(true)}
            className="bg-accent hover:bg-accent/90 text-white px-10 py-5 rounded-xl font-semibold text-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl"
          >
            {t('trainingPage.customTraining.action')}
          </button>
        </div>
      </div>

      <ScrollIndicator />
    </div>
  );
};

export default Training;


