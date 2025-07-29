import React from 'react'
import { assets } from '../assets/assets'
import { useTranslation } from '../hooks/useTranslation';

const Footer = () => {
  const { t, isRTL } = useTranslation();
  
  return (
     <div className={`text-gray-500/80 pt-8 px-6 md:px-16 lg:px-24 xl:px-32 bg-[#F6F9FC] mt-20 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`flex flex-wrap justify-between gap-12 md:gap-6 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                <div className='max-w-80'>
                    <img src={assets.logo} alt="logo" className='mb-4 h-8 md:h-9 invert opacity-80'  />
                    <p className={`text-sm ${isRTL ? 'font-arabic' : ''}`}>
                        {t('footer.discoverWorld')}
                         </p>
                    <div className={`flex items-center gap-3 mt-4 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                        {/* Instagram */}
                        <img src={assets.instagramIcon} alt="instagram icon" className='w-6' />
                        {/* Facebook */}
                       <img src={assets.facebookIcon} alt="facebook icon" className='w-6'/>
                        {/* Twitter */}
                                               <img src={assets.twitterIcon} alt="twitter icon" className='w-6'/>

                        {/* LinkedIn */}
                                               <img src={assets.linkendinIcon} alt="linkedin icon" className='w-6'/>

                    </div>
                </div>

                <div>
                    <p className={`font-playfair text-lg text-gray-800 ${isRTL ? 'font-arabic' : ''}`}>{t('footer.company')}</p>
                    <ul className={`mt-3 flex flex-col gap-2 text-sm ${isRTL ? 'font-arabic' : ''}`}>
                        <li><a href="#">{t('footer.about')}</a></li>
                        <li><a href="#">{t('footer.careers')}</a></li>
                        <li><a href="#">{t('footer.press')}</a></li>
                        <li><a href="#">{t('footer.blog')}</a></li>
                        <li><a href="#">{t('footer.partners')}</a></li>
                    </ul>
                </div>

                <div>
                    <p className={`font-playfair text-lg text-gray-800 ${isRTL ? 'font-arabic' : ''}`}>{t('footer.support')}</p>
                    <ul className={`mt-3 flex flex-col gap-2 text-sm ${isRTL ? 'font-arabic' : ''}`}>
                        <li><a href="#">{t('footer.helpCenter')}</a></li>
                        <li><a href="#">{t('footer.contactUs')}</a></li>
                        <li><a href="#">{t('footer.privacyPolicy')}</a></li>
                        <li><a href="#">{t('footer.termsOfService')}</a></li>
                    </ul>
                </div>

                <div>
                    <p className={`font-playfair text-lg text-gray-800 ${isRTL ? 'font-arabic' : ''}`}>{t('footer.legal')}</p>
                    <ul className={`mt-3 flex flex-col gap-2 text-sm ${isRTL ? 'font-arabic' : ''}`}>
                        <li><a href="#">{t('footer.privacy')}</a></li>
                        <li><a href="#">{t('footer.terms')}</a></li>
                        <li><a href="#">{t('footer.cookies')}</a></li>
                        <li><a href="#">{t('footer.licenses')}</a></li>
                    </ul>
                </div>

                <div>
                    <p className={`font-playfair text-lg text-gray-800 ${isRTL ? 'font-arabic' : ''}`}>{t('footer.settings')}</p>
                    <ul className={`mt-3 flex flex-col gap-2 text-sm ${isRTL ? 'font-arabic' : ''}`}>
                        <li><a href="#">{t('footer.preferences')}</a></li>
                        <li><a href="#">{t('footer.yourData')}</a></li>
                        <li><a href="#">{t('footer.cookiesSettings')}</a></li>
                    </ul>
                </div>
            </div>
            <div className={`border-t border-gray-300 mt-8 pt-8 text-center ${isRTL ? 'font-arabic' : ''}`}>
                <p className='text-sm'>&copy; 2024 Hotel Booking. {t('footer.allRightsReserved') || 'All rights reserved.'}</p>
            </div>
        </div>
  )
}

export default Footer