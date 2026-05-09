import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Users, Globe, Award, Clock, BarChart, ChevronDown, ChevronUp } from 'lucide-react';
import { OptimizedImage } from '../components/OptimizedImage';
import tsbiLogo from '../assets/TSBI logo4.png';
import heroImage from '../assets/hero-images/pages/about-hero.jpg';
import heroImageWebp from '../assets/hero-images/pages/about-hero.webp';
import ScrollIndicator from '../components/ScrollIndicator';

// Core team images
import viktoriaImage from '../assets/team/viktoria.png';
import viktoriaImageWebp from '../assets/team/viktoria.webp';
import saeeImage from '../assets/team/saee.jpg';
import saeeImageWebp from '../assets/team/saee.webp';
import jineshImage from '../assets/team/jinesh.jpg';
import jineshImageWebp from '../assets/team/jinesh.webp';

// Other team images (no WebP optimization in script)
import francisImage from '../assets/team/francis.png';
import dinisImage from '../assets/team/dinis.jpg';
import vaishnaviImage from '../assets/team/vaishnavi.jpg';
import josephImage from '../assets/team/joseph.png';
import poojaImage from '../assets/team/pooja.jpg';
import aswathyImage from '../assets/team/aswathy.jpeg';

const AboutUs = () => {
  const { t } = useTranslation();
  const [showFullTeam, setShowFullTeam] = useState(false);

  const coreTeam = [
    {
      name: "Aswathy",
      position: t('aboutUsPage.team.core.aswathy.position'),
      description: t('aboutUsPage.team.core.aswathy.description'),
      image: aswathyImage
    },
    {
      name: "Francis",
      position: t('aboutUsPage.team.core.francis.position'),
      description: t('aboutUsPage.team.core.francis.description'),
      image: francisImage
    },
    {
      name: "Joseph",
      position: t('aboutUsPage.team.core.joseph.position'),
      description: t('aboutUsPage.team.core.joseph.description'),
      image: josephImage
    }
  ];

  const fullTeam = [
    ...coreTeam,
    {
      name: "Dinis",
      position: t('aboutUsPage.team.full.dinis.position'),
      description: t('aboutUsPage.team.full.dinis.description'),
      image: dinisImage
    },
    {
      name: "Vaishnavi",
      position: t('aboutUsPage.team.full.vaishnavi.position'),
      description: t('aboutUsPage.team.full.vaishnavi.description'),
      image: vaishnaviImage
    },
    {
      name: "Viktoria",
      position: t('aboutUsPage.team.full.viktoria.position'),
      description: t('aboutUsPage.team.full.viktoria.description'),
      image: viktoriaImage,
      imageWebp: viktoriaImageWebp
    },
    {
      name: "Pooja",
      position: t('aboutUsPage.team.full.pooja.position'),
      description: t('aboutUsPage.team.full.pooja.description'),
      image: poojaImage
    },
    {
      name: "Saee",
      position: t('aboutUsPage.team.full.saee.position'),
      description: t('aboutUsPage.team.full.saee.description'),
      image: saeeImage,
      imageWebp: saeeImageWebp
    },
    {
      name: "Jinesh",
      position: t('aboutUsPage.team.full.jinesh.position'),
      description: t('aboutUsPage.team.full.jinesh.description'),
      image: jineshImage,
      imageWebp: jineshImageWebp
    }
  ];

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
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 drop-shadow-lg">{t('aboutUsPage.hero.title')}</h1>
          <p className="text-xl text-center max-w-3xl mx-auto drop-shadow-md">
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
                  src={tsbiLogo} 
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
              { number: "10,000+", text: t('aboutUsPage.impact.stats.livesToProtect') },
              { number: "500+", text: t('aboutUsPage.impact.stats.communitiesToServe') },
              { number: "95.6%", text: t('aboutUsPage.impact.stats.targetAlertAccuracy') },
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
              { icon: <Globe className="w-16 h-16 text-primary mr-4" />, title: t('aboutUsPage.values.items.globalPerspective.title'), text: t('aboutUsPage.values.items.globalPerspective.text') },
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

      {/* Team Section */}
      <div className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12 drop-shadow-lg">{t('aboutUsPage.team.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(showFullTeam ? fullTeam : coreTeam).map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left">
                <div className="flex items-start mb-4">
                  <div className="w-32 h-32 rounded-full mr-4 overflow-hidden flex-shrink-0">
                    {member.image ? (
                      member.imageWebp ? (
                        <OptimizedImage
                          webpSrc={member.imageWebp}
                          fallbackSrc={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          style={member.name === 'Aswathy' ? { objectPosition: 'center 20%' } : {}}
                        />
                      ) : (
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                          style={member.name === 'Aswathy' ? { objectPosition: 'center 20%' } : {}}
                        />
                      )
                    ) : (
                      <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                        <Users className="w-16 h-16 text-primary" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">{member.name}</h3>
                    <p className="text-xl text-primary mb-2">{member.position}</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => setShowFullTeam(!showFullTeam)}
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 font-semibold shadow-lg hover:shadow-xl"
            >
              {showFullTeam ? (
                <>
                  {t('aboutUsPage.team.showLess')}
                  <ChevronUp className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>
                  {t('aboutUsPage.team.exploreButton')}
                  <ChevronDown className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12 drop-shadow-lg">{t('aboutUsPage.partnersTitle')}</h2>
          <div className="flex flex-wrap justify-center gap-12">
            {[
              { icon: "🏛️", label: t('aboutUsPage.partners.items.fema') },
              { icon: "❤️", label: t('aboutUsPage.partners.items.redCross') },
              { icon: "🌊", label: t('aboutUsPage.partners.items.noaa') },
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
        </div>
      </div>

      <ScrollIndicator />
    </div>
  );
};

export default AboutUs;


