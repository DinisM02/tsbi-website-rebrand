import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Users, MapPin, Award, Clock, BarChart, Github } from 'lucide-react';
import { OptimizedImage } from '../components/OptimizedImage';
import hydroBeaconMark from '../assets/hydrobeacon-mark.svg';
import heroImage from '../assets/hero-images/pages/about-hero.jpg';
import heroImageWebp from '../assets/hero-images/pages/about-hero.webp';
import ScrollIndicator from '../components/ScrollIndicator';

import dinisImage from '../assets/team/dinis.jpg';

const AboutUs = () => {
  const { t } = useTranslation();
  const founder = {
    name: 'Dinis',
    position: t('aboutUsPage.team.founder.position'),
    description: t('aboutUsPage.team.founder.description'),
    image: dinisImage,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative text-white">
        <div className="absolute inset-0 z-0 h-[550px]">
          <OptimizedImage
            webpSrc={heroImageWebp}
            fallbackSrc={heroImage}
            alt={t('aboutUsPage.hero.alt')}
            className="w-full h-full object-cover"
            fetchPriority="high"
            style={{ objectPosition: 'center 30%' }}
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-[550px] flex flex-col justify-center items-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 drop-shadow-lg">{t('aboutUsPage.hero.title')}</h1>
          <p className="text-lg sm:text-xl text-center max-w-3xl mx-auto drop-shadow-md">
            {t('aboutUsPage.hero.description')}
          </p>
        </div>
      </div>

      {/* Mission Section - LOGO ALINHADA ?? ALTURA DO TEXTO */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-stretch gap-20">
            
            {/* LOGO AJUSTADA */}
            <div className="md:w-1/2 flex justify-center items-stretch">
              <div className="flex items-center justify-center w-full h-full">
                <img 
                  src={hydroBeaconMark} 
                  alt={t('aboutUsPage.mission.logoAlt')} 
                  className="w-full max-w-md h-full object-contain"
                  loading="lazy"
                  decoding="async"
                  style={{ maxHeight: '450px' }}
                />
              </div>
            </div>

            <div className="md:w-1/2 flex flex-col justify-center">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-6 drop-shadow-lg">{t('aboutUsPage.mission.title')}</h2>
              <p className="text-xl text-left max-w-3xl mx-auto text-gray-600 drop-shadow-md mb-4">
                {t('aboutUsPage.mission.paragraph1')}
              </p>
              <p className="text-xl text-left max-w-3xl mx-auto text-gray-600 drop-shadow-md">
                {t('aboutUsPage.mission.paragraph2')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12 drop-shadow-lg">{t('aboutUsPage.impact.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "11", text: t('aboutUsPage.impact.stats.provinces') },
              { number: "9", text: t('aboutUsPage.impact.stats.riverBasins') },
              { number: "PT", text: t('aboutUsPage.impact.stats.language') },
              { number: "24/7", text: t('aboutUsPage.impact.stats.plannedMonitoring') },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12 drop-shadow-lg">{t('aboutUsPage.values.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Shield className="w-16 h-16 text-primary mr-4" />, title: t('aboutUsPage.values.items.safetyFirst.title'), text: t('aboutUsPage.values.items.safetyFirst.text') },
              { icon: <Award className="w-16 h-16 text-primary mr-4" />, title: t('aboutUsPage.values.items.excellence.title'), text: t('aboutUsPage.values.items.excellence.text') },
              { icon: <Users className="w-16 h-16 text-primary mr-4" />, title: t('aboutUsPage.values.items.communityFocused.title'), text: t('aboutUsPage.values.items.communityFocused.text') },
              { icon: <Clock className="w-16 h-16 text-primary mr-4" />, title: t('aboutUsPage.values.items.timeliness.title'), text: t('aboutUsPage.values.items.timeliness.text') },
              { icon: <MapPin className="w-16 h-16 text-primary mr-4" />, title: t('aboutUsPage.values.items.localFocus.title'), text: t('aboutUsPage.values.items.localFocus.text') },
              { icon: <BarChart className="w-16 h-16 text-primary mr-4" />, title: t('aboutUsPage.values.items.dataDriven.title'), text: t('aboutUsPage.values.items.dataDriven.text') },
            ].map((value, i) => (
              <div key={i} className="flex flex-col items-start text-left p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  {value.icon}
                  <h3 className="text-2xl font-semibold">{value.title}</h3>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Founder Section */}
      <div className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12 drop-shadow-lg">{t('aboutUsPage.team.title')}</h2>
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-semibold">{founder.name}</h3>
                <p className="text-xl text-primary mb-3">{founder.position}</p>
                <a
                  href="https://github.com/DinisM02"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
                >
                  <Github className="w-5 h-5" />
                  GitHub
                </a>
              </div>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">{founder.description}</p>
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12 drop-shadow-lg">{t('aboutUsPage.partnersTitle')}</h2>
          <div className="flex flex-wrap justify-center gap-12">
            {[
              { icon: "🏛️", label: t('aboutUsPage.partners.items.ingd') },
              { icon: "❤️", label: t('aboutUsPage.partners.items.redCross') },
              { icon: "🌊", label: t('aboutUsPage.partners.items.ara') },
              { icon: "🚨", label: t('aboutUsPage.partners.items.emergencyManagement') },
              { icon: "⛈️", label: t('aboutUsPage.partners.items.weatherService') },
              { icon: "🏙️", label: t('aboutUsPage.partners.items.localAuthorities') },
            ].map((partner, i) => (
              <div key={i} className="text-center bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl font-bold mb-2">{partner.icon}</div>
                <div className="text-xl">{partner.label}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-8 max-w-2xl mx-auto">{t('aboutUsPage.partnersNote')}</p>
        </div>
      </div>

      <ScrollIndicator />
    </div>
  );
};

export default AboutUs;


