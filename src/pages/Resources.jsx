import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Video, Download, Book, Map, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OptimizedImage } from '../components/OptimizedImage';
import heroImage from '../assets/hero-images/pages/resources-hero.jpg';
import heroImageWebp from '../assets/hero-images/pages/resources-hero.webp';
import ScrollIndicator from '../components/ScrollIndicator';

const ResourceCard = ({ icon, title, description, link, learnMore }) => {
  const Icon = icon;
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 h-full flex flex-col">
      <div className="flex flex-col items-start text-left mb-4 flex-grow">
        <Icon className="w-8 h-8 text-primary mb-3" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-base leading-relaxed">
          {description}
        </p>
      </div>
      <div className="mt-auto pt-4 border-t border-gray-100">
        <Link to={link} className="text-primary hover:text-primary/80 font-semibold inline-flex items-center text-sm">
          {learnMore} →
        </Link>
      </div>
    </div>
  );
};

const Resources = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative text-white">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0 h-[500px]">
          <OptimizedImage
            webpSrc={heroImageWebp}
            fallbackSrc={heroImage}
            alt={t('resourcesPage.hero.alt')}
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-[500px] flex flex-col justify-center items-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 drop-shadow-lg">{t('resourcesPage.hero.title')}</h1>
          <p className="text-lg sm:text-xl text-center max-w-3xl mx-auto drop-shadow-md">
            {t('resourcesPage.hero.description')}
          </p>
        </div>
      </div>

      {/* Resource Categories */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{t('resourcesPage.categories.title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ResourceCard 
              icon={FileText}
              title={t('resourcesPage.categories.items.preparedness.title')}
              description={t('resourcesPage.categories.items.preparedness.description')}
              link="/blog"
              learnMore={t('resourcesPage.learnMore')}
            />
            
            <ResourceCard 
              icon={Book}
              title={t('resourcesPage.categories.items.education.title')}
              description={t('resourcesPage.categories.items.education.description')}
              link="/about"
              learnMore={t('resourcesPage.learnMore')}
            />
            
            <ResourceCard 
              icon={Video}
              title={t('resourcesPage.categories.items.trainingVideos.title')}
              description={t('resourcesPage.categories.items.trainingVideos.description')}
              link="/training"
              learnMore={t('resourcesPage.learnMore')}
            />
            
            <ResourceCard 
              icon={Map}
              title={t('resourcesPage.categories.items.maps.title')}
              description={t('resourcesPage.categories.items.maps.description')}
              link="/dashboard"
              learnMore={t('resourcesPage.learnMore')}
            />
            
            <ResourceCard 
              icon={Download}
              title={t('resourcesPage.categories.items.checklists.title')}
              description={t('resourcesPage.categories.items.checklists.description')}
              link="/contact"
              learnMore={t('resourcesPage.learnMore')}
            />
            
            <ResourceCard 
              icon={Headphones}
              title={t('resourcesPage.categories.items.podcasts.title')}
              description={t('resourcesPage.categories.items.podcasts.description')}
              link="/blog"
              learnMore={t('resourcesPage.learnMore')}
            />
          </div>
        </div>
      </div>

      {/* Featured Resources */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{t('resourcesPage.featured.title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col h-full">
              <h3 className="text-lg font-semibold mb-3">{t('resourcesPage.featured.items.familyPlan.title')}</h3>
              <p className="text-gray-600 mb-4 text-sm">
                {t('resourcesPage.featured.items.familyPlan.description')}
              </p>
              <div className="flex flex-col gap-2 mt-auto">
                <span className="text-sm text-gray-500">{t('resourcesPage.featured.items.familyPlan.meta')}</span>
                <Link to="/contact" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 text-sm h-10">
                  <Download className="w-4 h-4" />
                  {t('resourcesPage.actions.requestAccess')}
                </Link>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col h-full">
              <h3 className="text-lg font-semibold mb-3">{t('resourcesPage.featured.items.completeGuide.title')}</h3>
              <p className="text-gray-600 mb-4 text-sm">
                {t('resourcesPage.featured.items.completeGuide.description')}
              </p>
              <div className="flex flex-col gap-2 mt-auto">
                <span className="text-sm text-gray-500">{t('resourcesPage.featured.items.completeGuide.meta')}</span>
                <Link to="/blog" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 text-sm h-10">
                  <Download className="w-4 h-4" />
                  {t('resourcesPage.actions.openGuide')}
                </Link>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col h-full">
              <h3 className="text-lg font-semibold mb-3">{t('resourcesPage.featured.items.vrDemo.title')}</h3>
              <p className="text-gray-600 mb-4 text-sm">
                {t('resourcesPage.featured.items.vrDemo.description')}
              </p>
              <div className="flex flex-col gap-2 mt-auto">
                <span className="text-sm text-gray-500">{t('resourcesPage.featured.items.vrDemo.meta')}</span>
                <Link to="/training" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 text-sm h-10">
                  <Download className="w-4 h-4" />
                  {t('resourcesPage.actions.openDemo')}
                </Link>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col h-full">
              <h3 className="text-lg font-semibold mb-3">{t('resourcesPage.featured.items.toolkit.title')}</h3>
              <p className="text-gray-600 mb-4 text-sm">
                {t('resourcesPage.featured.items.toolkit.description')}
              </p>
              <div className="flex flex-col gap-2 mt-auto">
                <span className="text-sm text-gray-500">{t('resourcesPage.featured.items.toolkit.meta')}</span>
                <Link to="/partner-with-us" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 text-sm h-10">
                  <Download className="w-4 h-4" />
                  {t('resourcesPage.actions.requestToolkit')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Library */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{t('resourcesPage.library.title')}</h2>
          
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="py-3 px-4 text-left border-b">{t('resourcesPage.library.columns.resourceName')}</th>
                  <th className="py-3 px-4 text-left border-b">{t('resourcesPage.library.columns.type')}</th>
                  <th className="py-3 px-4 text-left border-b">{t('resourcesPage.library.columns.dateAdded')}</th>
                  <th className="py-3 px-4 text-left border-b">{t('resourcesPage.library.columns.size')}</th>
                  <th className="py-3 px-4 text-left border-b">{t('resourcesPage.library.columns.action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4">{t('resourcesPage.library.rows.row1.name')}</td>
                  <td className="py-3 px-4">{t('resourcesPage.library.rows.row1.type')}</td>
                  <td className="py-3 px-4">{t('resourcesPage.library.rows.row1.date')}</td>
                  <td className="py-3 px-4">4.2 MB</td>
                  <td className="py-3 px-4">
                    <Link to="/contact" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 text-sm h-10 w-32">
                      <Download className="w-4 h-4" />
                      {t('resourcesPage.actions.request')}
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4">{t('resourcesPage.library.rows.row2.name')}</td>
                  <td className="py-3 px-4">{t('resourcesPage.library.rows.row2.type')}</td>
                  <td className="py-3 px-4">{t('resourcesPage.library.rows.row2.date')}</td>
                  <td className="py-3 px-4">3.8 MB</td>
                  <td className="py-3 px-4">
                    <Link to="/blog" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 text-sm h-10 w-32">
                      <Download className="w-4 h-4" />
                      {t('resourcesPage.actions.open')}
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4">{t('resourcesPage.library.rows.row3.name')}</td>
                  <td className="py-3 px-4">{t('resourcesPage.library.rows.row3.type')}</td>
                  <td className="py-3 px-4">{t('resourcesPage.library.rows.row3.date')}</td>
                  <td className="py-3 px-4">245 MB</td>
                  <td className="py-3 px-4">
                    <Link to="/training" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 text-sm h-10 w-32">
                      <Video className="w-4 h-4" />
                      {t('resourcesPage.actions.watch')}
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4">{t('resourcesPage.library.rows.row4.name')}</td>
                  <td className="py-3 px-4">{t('resourcesPage.library.rows.row4.type')}</td>
                  <td className="py-3 px-4">{t('resourcesPage.library.rows.row4.date')}</td>
                  <td className="py-3 px-4">6.7 MB</td>
                  <td className="py-3 px-4">
                    <Link to="/blog" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 text-sm h-10 w-32">
                      <Download className="w-4 h-4" />
                      {t('resourcesPage.actions.open')}
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4">{t('resourcesPage.library.rows.row5.name')}</td>
                  <td className="py-3 px-4">{t('resourcesPage.library.rows.row5.type')}</td>
                  <td className="py-3 px-4">{t('resourcesPage.library.rows.row5.date')}</td>
                  <td className="py-3 px-4">2.1 MB</td>
                  <td className="py-3 px-4">
                    <Link to="/contact" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 text-sm h-10 w-32">
                      <Download className="w-4 h-4" />
                      {t('resourcesPage.actions.request')}
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4">{t('resourcesPage.library.rows.row6.name')}</td>
                  <td className="py-3 px-4">{t('resourcesPage.library.rows.row6.type')}</td>
                  <td className="py-3 px-4">{t('resourcesPage.library.rows.row6.date')}</td>
                  <td className="py-3 px-4">1.5 MB</td>
                  <td className="py-3 px-4">
                    <Link to="/blog" className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 text-sm h-10 w-32">
                      <FileText className="w-4 h-4" />
                      {t('resourcesPage.actions.view')}
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/blog" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl inline-flex">
              {t('resourcesPage.actions.viewAllResources')}
            </Link>
          </div>
        </div>
      </div>

      {/* Request Resources */}
      <div className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{t('resourcesPage.custom.title')}</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
            {t('resourcesPage.custom.description')}
          </p>
          <div className="text-center">
            <Link to="/contact" className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:shadow-xl inline-flex">
              {t('resourcesPage.custom.action')}
            </Link>
          </div>
        </div>
      </div>
      <ScrollIndicator />
    </div>
  );
};

export default Resources;