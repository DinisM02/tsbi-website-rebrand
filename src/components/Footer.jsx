import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Facebook, Twitter, Linkedin, Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import tsbiLogo from '../assets/TSBI logo4.png';
import LegalModal from './LegalModal';

const Footer = () => {
  const { t } = useTranslation();
  const [modalState, setModalState] = useState({
    isOpen: false,
    contentType: '',
    title: ''
  });

  const openModal = (contentType, title) => {
    setModalState({
      isOpen: true,
      contentType,
      title
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      contentType: '',
      title: ''
    });
  };

  return (
    <footer className="text-white border-t-4 border-primary" style={{ backgroundColor: 'var(--primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Logo, Description, and Social */}
          <div className="space-y-4">
            <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg flex items-center justify-center w-fit mx-auto md:mx-0">
              <img 
                src={tsbiLogo} 
                alt="HydroBeacon Logo" 
                className="h-16 sm:h-20 md:h-22 w-auto object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="space-y-3 text-center md:text-left">
              <h3 className="text-lg font-semibold">{t('heroSection.empoweringCommunities')}</h3>
              <p className="text-gray-200 max-w-md leading-relaxed mx-auto md:mx-0">
                {t('footer.description')}
              </p>

              <div className="flex justify-center md:justify-start space-x-3 pt-2">
                <a href="#" className="text-white bg-blue-600 hover:bg-blue-700 p-2 rounded-full transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="https://x.com/thesafetybeacon?s=09" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white bg-black hover:bg-gray-800 p-2 rounded-full transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.instagram.com/thesafetybeaconinitiative?igsh=MTIxM3V5dWZpdXVvdw==" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white bg-pink-500 hover:bg-pink-600 p-2 rounded-full transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.linkedin.com/company/thesafetybeacon-tsbi/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white bg-blue-500 hover:bg-blue-600 p-2 rounded-full transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                {/* Email Icon - Corrigido para escuro */}
                <a 
                  href="mailto:support@hydrobeacon.org" 
                  className="text-white bg-gray-800 hover:bg-gray-900 p-2 rounded-full transition-colors"
                  title={t('footer.emailUs')}
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Columns */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Legal */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('footer.legal')}</h3>
                <ul className="space-y-2">
                  <li>
                    <button 
                      onClick={() => openModal('privacy-policy', t('footer.links.privacyPolicy'))}
                      className="text-gray-200 hover:text-white transition-colors text-left text-sm"
                    >
                      {t('footer.links.privacyPolicy')}
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => openModal('terms-of-service', t('footer.links.termsOfService'))}
                      className="text-gray-200 hover:text-white transition-colors text-left text-sm"
                    >
                      {t('footer.links.termsOfService')}
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => openModal('community-guidelines', t('footer.links.communityGuidelines'))}
                      className="text-gray-200 hover:text-white transition-colors text-left text-sm"
                    >
                      {t('footer.links.communityGuidelines')}
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => openModal('cookie-statement', t('footer.links.cookieStatement'))}
                      className="text-gray-200 hover:text-white transition-colors text-left text-sm"
                    >
                      {t('footer.links.cookieStatement')}
                    </button>
                  </li>
                </ul>
              </div>

              {/* Explore */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('footer.explore')}</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-200 hover:text-white transition-colors text-sm">{t('footer.links.home')}</Link></li>
                  <li><Link to="/about" className="text-gray-200 hover:text-white transition-colors text-sm">{t('footer.links.aboutUs')}</Link></li>
                  <li><Link to="/training" className="text-gray-200 hover:text-white transition-colors text-sm">{t('footer.links.trainingPrograms')}</Link></li>
                  <li><Link to="/blog" className="text-gray-200 hover:text-white transition-colors text-sm">{t('footer.links.blogNews')}</Link></li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('footer.resources')}</h3>
                <ul className="space-y-2">
                  <li><Link to="/resources" className="text-gray-200 hover:text-white transition-colors text-sm">{t('footer.links.resourceLibrary')}</Link></li>
                  <li><Link to="/dashboard" className="text-gray-200 hover:text-white transition-colors text-sm">{t('footer.links.safetyDashboard')}</Link></li>
                  <li><Link to="/training" className="text-gray-200 hover:text-white transition-colors text-sm">{t('footer.links.trainingDemo')}</Link></li>
                  <li><Link to="/contact" className="text-gray-200 hover:text-white transition-colors text-sm">{t('footer.links.requestMaterials')}</Link></li>
                </ul>
              </div>

              {/* Get Involved */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('footer.getInvolved')}</h3>
                <ul className="space-y-2">
                  <li><Link to="/volunteer-opportunities" className="text-gray-200 hover:text-white transition-colors text-sm">{t('footer.links.volunteerOpportunities')}</Link></li>
                  <li><Link to="/partner-with-us" className="text-gray-200 hover:text-white transition-colors text-sm">{t('footer.links.partnerWithUs')}</Link></li>
                  <li><Link to="/report-hazard" className="text-gray-200 hover:text-white transition-colors text-sm">{t('footer.links.reportHazard')}</Link></li>
                  <li><Link to="/contact" className="text-gray-200 hover:text-white transition-colors text-sm">{t('footer.links.feedbackForm')}</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-500 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-3">
          <p className="text-gray-200 text-sm">
            {t('footer.copyright')}
          </p>
          <div className="md:mt-0">
            <p className="text-gray-200 text-sm">
              {t('footer.tagline')}
            </p>
          </div>
        </div>
      </div>

      {/* Legal Modal */}
      <LegalModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        contentType={modalState.contentType}
        title={modalState.title}
      />
    </footer>
  );
};

export default Footer;

