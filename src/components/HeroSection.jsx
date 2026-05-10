import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Play, ArrowRight, Shield, AlertTriangle, MapPin, X } from 'lucide-react';
import { Button } from './ui/button';
import { OptimizedImage } from './OptimizedImage';
import heroImageWebp from '../assets/hero-images/new-hero-main.webp';
import heroImage from '../assets/hero-images/new-hero-main.png';

const HeroSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showDemoVideo, setShowDemoVideo] = useState(false);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Demo Video Modal */}
      {showDemoVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">{t('heroSection.platformDemo')}</h3>
              <Button
                onClick={() => setShowDemoVideo(false)}
                variant="ghost"
                size="sm"
                className="hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="aspect-video bg-black">
              <video
                controls
                autoPlay
                className="w-full h-full"
                src="/watch demo.mp4"
                poster={heroImage}
              >
                {t('heroSection.videoUnsupported')}
              </video>
            </div>
            <div className="p-4">
              <p className="text-gray-600">
                {t('heroSection.demoDescription')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Background Image - Updated */}
      <div className="absolute inset-0 z-0">
        <OptimizedImage
          webpSrc={heroImageWebp}
          fallbackSrc={heroImage}
          alt={t('heroSection.imageAlt')}
          className="w-full h-full object-cover object-[20%_center]"
          fetchPriority="high"
        />
      </div>
      
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <div className="max-w-4xl mx-auto">

          {/* Main Headline */}
          <h1 className="font-bold text-white mb-8 leading-tight drop-shadow-md">
            <span className="block text-5xl md:text-7xl lg:text-8xl">{t('heroSection.title')}</span><br/>
            <span className="block text-accent text-4xl md:text-6xl lg:text-7xl">{t('heroSection.subtitle')}</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white mb-8 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
            {t('heroSection.description')}
          </p>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30 shadow-lg transition-transform duration-300 hover:scale-105 md:hover:scale-110">
              <Shield className="w-8 h-8 text-accent mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">{t('heroSection.realTimeAlerts')}</h3>
              <p className="text-white/90 text-sm">{t('heroSection.realTimeAlertsDesc')}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30 shadow-lg transition-transform duration-300 hover:scale-105 md:hover:scale-110">
              <MapPin className="w-8 h-8 text-accent mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">{t('heroSection.interactiveMaps')}</h3>
              <p className="text-white/90 text-sm">{t('heroSection.interactiveMapsDesc')}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30 shadow-lg transition-transform duration-300 hover:scale-105 md:hover:scale-110">
              <Play className="w-8 h-8 text-accent mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">{t('heroSection.vrArTraining')}</h3>
              <p className="text-white/90 text-sm">{t('heroSection.vrArTrainingDesc')}</p>
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
              onClick={() => setShowDemoVideo(true)}
            >
              {t('heroSection.watchDemo')}
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white bg-white/10 hover:bg-white hover:text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
              onClick={() => navigate('/role-selection?next=signup')}
            >
              {t('heroSection.getStarted')}
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center bg-black/30 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{t('heroSection.stats.values.livesToProtect')}</div>
              <div className="text-white/90 text-sm">{t('heroSection.stats.livesToProtect')}</div>
            </div>
            <div className="text-center bg-black/30 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{t('heroSection.stats.values.communitiesToServe')}</div>
              <div className="text-white/90 text-sm">{t('heroSection.stats.communitiesToServe')}</div>
            </div>
            <div className="text-center bg-black/30 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{t('heroSection.stats.values.plannedMonitoring')}</div>
              <div className="text-white/90 text-sm">{t('heroSection.stats.plannedMonitoring')}</div>
            </div>
            <div className="text-center bg-black/30 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{t('heroSection.stats.values.uptime')}</div>
              <div className="text-white/90 text-sm">{t('heroSection.stats.uptime')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;