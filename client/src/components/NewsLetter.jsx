import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets'
import { useTranslation } from '../hooks/useTranslation';

const NewsLetter = () => {
  const { t, isRTL } = useTranslation();
  
  return (
    <div className={`flex flex-col items-center w-full max-w-5xl lg:w-full rounded-2xl px-4 py-12 md:py-16 mx-2 lg:mx-auto my-30 bg-gray-900 text-white ${isRTL ? 'text-right' : 'text-left'}`}>
            <Title 
              title={t('components.newsletter.title')} 
              subTitle={t('components.newsletter.subtitle')} 
              align="center" 
            />
            <div className={`flex flex-col md:flex-row items-center justify-center gap-4 mt-6 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                <input 
                  type="text" 
                  className={`bg-white/10 px-4 py-2.5 border border-white/20 rounded outline-none max-w-66 w-full ${isRTL ? 'font-arabic text-right' : ''}`} 
                  placeholder={t('components.newsletter.enterEmail')} 
                />
                <button className={`flex items-center justify-center gap-2 group bg-black px-4 md:px-7 py-2.5 rounded active:scale-95 transition-all ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                  <span className={isRTL ? 'font-arabic' : ''}>{t('components.newsletter.subscribe')}</span>
                  <img src={assets.arrowIcon} alt="arrow icon" className="w-3.5 invert group-hover:translate-x-1 transition-all" />     
                </button>
            </div>
            <p className={`text-gray-500 mt-6 text-xs text-center ${isRTL ? 'font-arabic' : ''}`}>{t('components.newsletter.privacyNotice')}</p>
        </div>
  )
}

export default NewsLetter