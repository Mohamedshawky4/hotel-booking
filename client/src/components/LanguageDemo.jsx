import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import LanguageToggle from './LanguageToggle';

const LanguageDemo = () => {
  const { t, currentLanguage, isRTL } = useTranslation();

  return (
    <div className={`p-6 bg-gray-50 rounded-lg ${isRTL ? 'text-right' : 'text-left'}`}>
      <h2 className={`text-2xl font-bold mb-4 ${isRTL ? 'font-arabic' : ''}`}>
        {t('common.languageDemo') || 'Language Demo'}
      </h2>
      
      <div className="space-y-4">
        <div>
          <p className={`text-sm text-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
            {t('common.currentLanguage') || 'Current Language'}: <span className="font-semibold">{currentLanguage.toUpperCase()}</span>
          </p>
          <p className={`text-sm text-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
            {t('common.direction') || 'Direction'}: <span className="font-semibold">{isRTL ? 'RTL' : 'LTR'}</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className={`text-sm ${isRTL ? 'font-arabic' : ''}`}>
            {t('common.toggleLanguage') || 'Toggle Language'}:
          </span>
          <LanguageToggle />
        </div>

        <div className="mt-6 p-4 bg-white rounded border">
          <h3 className={`font-semibold mb-2 ${isRTL ? 'font-arabic' : ''}`}>
            {t('hero.title')}
          </h3>
          <p className={`text-sm text-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
            {t('hero.subtitle')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LanguageDemo; 