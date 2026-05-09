import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Smartphone, Users, X } from 'lucide-react';
import { Button } from './ui/button';

const CTASection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showTrialVideo, setShowTrialVideo] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white relative overflow-hidden">
      
      {/* =========================
          Trial Video Modal
      ========================= */}
      {showTrialVideo && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('ctaSection.modal.title')}
              </h3>
              <Button
                onClick={() => setShowTrialVideo(false)}
                variant="ghost"
                size="sm"
                className="hover:bg-gray-100 text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="aspect-video bg-black">
              <video
                controls
                autoPlay
                className="w-full h-full"
                src="/start free trial.mp4"
                poster="/start free trial.mp4"
              >
                {t('ctaSection.modal.videoUnsupported')}
              </video>
            </div>

            <div className="p-4">
              <p className="text-gray-600 mb-4">
                {t('ctaSection.modal.description')}
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">
                  {t('ctaSection.modal.includesTitle')}
                </h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>{t('ctaSection.modal.includes.access')}</li>
                  <li>{t('ctaSection.modal.includes.alerts')}</li>
                  <li>{t('ctaSection.modal.includes.maps')}</li>
                  <li>{t('ctaSection.modal.includes.training')}</li>
                  <li>{t('ctaSection.modal.includes.support')}</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-white py-3"
                  onClick={() => {
                    setShowTrialVideo(false);
                    navigate('/role-selection?next=signup');
                  }}
                >
                  {t('ctaSection.modal.startNow')}
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 py-3"
                  onClick={() => {
                    setShowTrialVideo(false);
                    navigate('/resources');
                  }}
                >
                  {t('ctaSection.modal.learnMore')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          Background Pattern
      ========================= */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">

          {/* =========================
              Main CTA
          ========================= */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {t('ctaSection.title')}
            </h2>

            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              {t('ctaSection.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              
              {/* Start Free Trial */}
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-lg font-semibold group shadow-xl border-2 border-accent"
                onClick={() => navigate('/role-selection?next=signup')}
              >
                {t('ctaSection.startFreeTrial')}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-primary px-8 py-6 text-lg font-semibold shadow-xl"
                onClick={() => setShowTrialVideo(true)}
              >
                {t('ctaSection.watchOverview')}
              </Button>

              {/* Schedule Demo â€” OPÃ‡ÃƒO A */}
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-primary px-8 py-6 text-lg font-semibold shadow-xl"
                onClick={() => {
                  window.open(
                    'https://calendly.com/aswathyjose86',
                    '_blank',
                    'noopener,noreferrer'
                  );
                }}
              >
                {t('ctaSection.scheduleDemo')}
              </Button>

            </div>
          </div>

          {/* =========================
              Features Grid
          ========================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-6 border border-white/30 shadow-lg">
              <Shield className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">
                {t('ctaSection.cards.instantProtection.title')}
              </h3>
              <p className="text-white/90">
                {t('ctaSection.cards.instantProtection.description')}
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-6 border border-white/30 shadow-lg">
              <Smartphone className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">
                {t('ctaSection.cards.mobileReady.title')}
              </h3>
              <p className="text-white/90">
                {t('ctaSection.cards.mobileReady.description')}
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-6 border border-white/30 shadow-lg">
              <Users className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">
                {t('ctaSection.cards.communitySupport.title')}
              </h3>
              <p className="text-white/90">
                {t('ctaSection.cards.communitySupport.description')}
              </p>
            </div>
          </div>

          {/* =========================
              Contact Info
          ========================= */}
          <div className="mt-16 pt-8 border-t border-white/30">
            <p className="text-white/95 mb-4">
              {t('ctaSection.contactText')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
              <a href="mailto:support@hydrobeacon.org" className="bg-white/20 px-4 py-2 rounded-full text-white border border-white/30 hover:bg-white/30 transition-colors">
                {t('ctaSection.contactEmail', { email: 'support@hydrobeacon.org' })}
              </a>
              <span className="bg-white/20 px-4 py-2 rounded-full text-white border border-white/30">
                {t('ctaSection.available')}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CTASection;


