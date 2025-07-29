import { useLanguage } from '../context/LanguageContext';
import { t } from '../translations';

export const useTranslation = () => {
  const { currentLanguage, isRTL, toggleLanguage, setLanguage } = useLanguage();

  const translate = (key) => {
    return t(key, currentLanguage);
  };

  return {
    t: translate,
    currentLanguage,
    isRTL,
    toggleLanguage,
    setLanguage,
  };
}; 