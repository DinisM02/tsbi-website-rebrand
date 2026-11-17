import React from 'react';
import { useTranslation } from 'react-i18next';

const LegalContent = ({ type }) => {
  const { t } = useTranslation();
  const renderPrivacyPolicy = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('legalContent.privacyPolicy.title')}</h2>
      
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('legalContent.privacyPolicy.sections.1.title')}</h3>
        <p className="text-gray-600 mb-4">
          {t('legalContent.privacyPolicy.sections.1.intro')}
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
          <li>{t('legalContent.privacyPolicy.sections.1.items.1')}</li>
          <li>{t('legalContent.privacyPolicy.sections.1.items.2')}</li>
          <li>{t('legalContent.privacyPolicy.sections.1.items.3')}</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('legalContent.privacyPolicy.sections.2.title')}</h3>
        <p className="text-gray-600 mb-4">
          {t('legalContent.privacyPolicy.sections.2.intro')}
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
          <li>{t('legalContent.privacyPolicy.sections.2.items.1')}</li>
          <li>{t('legalContent.privacyPolicy.sections.2.items.2')}</li>
          <li>{t('legalContent.privacyPolicy.sections.2.items.3')}</li>
          <li>{t('legalContent.privacyPolicy.sections.2.items.4')}</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('legalContent.privacyPolicy.sections.3.title')}</h3>
        <p className="text-gray-600 mb-4">
          {t('legalContent.privacyPolicy.sections.3.intro')}
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
          <li>{t('legalContent.privacyPolicy.sections.3.items.1')}</li>
          <li>{t('legalContent.privacyPolicy.sections.3.items.2')}</li>
          <li>{t('legalContent.privacyPolicy.sections.3.items.3')}</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('legalContent.privacyPolicy.sections.4.title')}</h3>
        <p className="text-gray-600 mb-4">
          {t('legalContent.privacyPolicy.sections.4.text')}
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('legalContent.privacyPolicy.sections.5.title')}</h3>
        <p className="text-gray-600 mb-4">
          {t('legalContent.privacyPolicy.sections.5.intro')}
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
          <li>{t('legalContent.privacyPolicy.sections.5.items.1')}</li>
          <li>{t('legalContent.privacyPolicy.sections.5.items.2')}</li>
          <li>{t('legalContent.privacyPolicy.sections.5.items.3')}</li>
          <li>{t('legalContent.privacyPolicy.sections.5.items.4')}</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('legalContent.privacyPolicy.sections.6.title')}</h3>
        <p className="text-gray-600">
          {t('legalContent.privacyPolicy.sections.6.p1')}
          <br />
          {t('legalContent.privacyPolicy.sections.6.email')}
          <br />
          {t('legalContent.privacyPolicy.sections.6.p2')}
        </p>
      </section>
    </div>
  );

  const renderTermsOfService = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('legalContent.termsOfService.title')}</h2>
      
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('legalContent.termsOfService.sections.1.title')}</h3>
        <p className="text-gray-600 mb-4">
          {t('legalContent.termsOfService.sections.1.text')}
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('legalContent.termsOfService.sections.2.title')}</h3>
        <p className="text-gray-600 mb-4">
          {t('legalContent.termsOfService.sections.2.text')}
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('legalContent.termsOfService.sections.3.title')}</h3>
        <p className="text-gray-600 mb-4">
          {t('legalContent.termsOfService.sections.3.intro')}
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
          <li>{t('legalContent.termsOfService.sections.3.items.1')}</li>
          <li>{t('legalContent.termsOfService.sections.3.items.2')}</li>
          <li>{t('legalContent.termsOfService.sections.3.items.3')}</li>
          <li>{t('legalContent.termsOfService.sections.3.items.4')}</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('legalContent.termsOfService.sections.4.title')}</h3>
        <p className="text-gray-600 mb-4">
          {t('legalContent.termsOfService.sections.4.text')}
        </p>
      </section>
    </div>
  );

  const renderCommunityGuidelines = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('legalContent.communityGuidelines.title')}</h2>
      
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('legalContent.communityGuidelines.sections.1.title')}</h3>
        <p className="text-gray-600 mb-4">
          {t('legalContent.communityGuidelines.sections.1.text')}
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('legalContent.communityGuidelines.sections.2.title')}</h3>
        <p className="text-gray-600 mb-4">
          {t('legalContent.communityGuidelines.sections.2.text')}
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('legalContent.communityGuidelines.sections.3.title')}</h3>
        <p className="text-gray-600 mb-4">
          {t('legalContent.communityGuidelines.sections.3.text')}
        </p>
      </section>
    </div>
  );

  const renderCookieStatement = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('legalContent.cookieStatement.title')}</h2>
      
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('legalContent.cookieStatement.sections.1.title')}</h3>
        <p className="text-gray-600 mb-4">
          {t('legalContent.cookieStatement.sections.1.text')}
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('legalContent.cookieStatement.sections.2.title')}</h3>
        <p className="text-gray-600 mb-4">
          {t('legalContent.cookieStatement.sections.2.intro')}
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
          <li>{t('legalContent.cookieStatement.sections.2.items.1')}</li>
          <li>{t('legalContent.cookieStatement.sections.2.items.2')}</li>
          <li>{t('legalContent.cookieStatement.sections.2.items.3')}</li>
          <li>{t('legalContent.cookieStatement.sections.2.items.4')}</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('legalContent.cookieStatement.sections.3.title')}</h3>
        <p className="text-gray-600 mb-4">
          {t('legalContent.cookieStatement.sections.3.text')}
        </p>
      </section>
    </div>
  );

  const imageCredits = [
    { key: 'home', title: 'Bairro de Manganhe, Beira, during ciclone Eloise', author: 'Voice of America (VOA)', license: 'Public domain', url: 'https://commons.wikimedia.org/wiki/File:Bairro_de_Manganhe,_Beira,_during_ciclone_Eloise_VOA.jpg' },
    { key: 'about', title: 'Avenida 24 de Julho, Maputo', author: 'Andrew Moore', license: 'CC BY-SA 2.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/', url: 'https://commons.wikimedia.org/wiki/File:Avenida_24_de_Julho_Maputo_(391897906).jpg' },
    { key: 'contact', title: 'Maputo skyline from cruiseship', author: 'Andrew Moir', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/', url: 'https://commons.wikimedia.org/wiki/File:Maputo_skyline_from_cruiseship_East_Africa_-_Flickr_-_moron_noodle.jpg' },
    { key: 'resources', title: 'Flooded town, Limpopo River', author: 'U.S. Department of Defense', license: 'Public domain', url: 'https://commons.wikimedia.org/wiki/File:Flooded_town_Limpopo_River.jpg' },
    { key: 'training', title: '2000 Mozambique flood – Group waiting', author: 'USAID', license: 'Public domain', url: 'https://commons.wikimedia.org/wiki/File:2000_Mozambique_flood_Group_Waiting_(5687137504).jpg' },
  ];

  const renderImageCredits = () => (
    <div className="space-y-4">
      <p className="text-gray-600">{t('legalContent.imageCredits.intro')}</p>
      <ul className="space-y-3">
        {imageCredits.map((c) => (
          <li key={c.key} className="text-gray-600 text-sm">
            <span className="font-semibold text-gray-700">{t(`legalContent.imageCredits.pages.${c.key}`)}:</span>{' '}
            <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{c.title}</a>
            {' — '}{c.author}{' · '}
            {c.licenseUrl ? (
              <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline">{c.license}</a>
            ) : c.license}
          </li>
        ))}
      </ul>
      <p className="text-gray-500 text-xs">{t('legalContent.imageCredits.note')}</p>
    </div>
  );

  switch (type) {
    case 'image-credits':
      return renderImageCredits();
    case 'privacy-policy':
      return renderPrivacyPolicy();
    case 'terms-of-service':
      return renderTermsOfService();
    case 'community-guidelines':
      return renderCommunityGuidelines();
    case 'cookie-statement':
      return renderCookieStatement();
    default:
      return <div>{t('legalContent.notFound')}</div>;
  }
};

export default LegalContent;

