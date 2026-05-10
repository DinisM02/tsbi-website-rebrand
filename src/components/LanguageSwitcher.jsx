import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Button } from './ui/button';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || i18n.language || 'pt').toLowerCase();
  const isEnglish = currentLang.startsWith('en');

  const toggleLanguage = () => {
    const newLang = isEnglish ? 'pt' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="ghost"
      size="sm"
      className="flex items-center gap-2 text-sm hover:bg-gray-100"
      title={isEnglish ? 'Português' : 'English'}
    >
      <Globe className="w-4 h-4" />
      <span className="font-medium">
        {isEnglish ? 'PT' : 'EN'}
      </span>
    </Button>
  );
};

export default LanguageSwitcher;
