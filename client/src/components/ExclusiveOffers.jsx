import React from 'react'
import Title from './Title'
import { assets, exclusiveOffers } from '../assets/assets'
import { useTranslation } from '../hooks/useTranslation';

const ExclusiveOffers = () => {
  const { t, isRTL } = useTranslation();
  
  return (
    <div className={`flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 pt-20 pb-28 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className={`flex flex-col items-center justify-between md:flex-row w-full ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
            <Title 
              title={t('components.exclusiveOffers.title')}  
              align="left" 
              subTitle={t('components.exclusiveOffers.subtitle')} 
            />
            <button className={`group flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
              <span className={isRTL ? 'font-arabic' : ''}>{t('common.viewAll')}</span>
              <img src={assets.arrowIcon} alt="arrow icon" className="group-hover:translate-x-1 transition-all" />
            </button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12'>
            {exclusiveOffers.map((offer) => (
                <div key={offer.id} className={`bg-white rounded-xl shadow-md overflow-hidden ${isRTL ? 'font-arabic' : ''}`}>
                    <img src={offer.image} alt={offer.title} className="w-full h-48 object-cover" />
                    <div className="p-6">
                        <h3 className={`text-xl font-semibold mb-2 ${isRTL ? 'font-arabic' : ''}`}>{offer.title}</h3>
                        <p className={`text-gray-600 mb-4 ${isRTL ? 'font-arabic' : ''}`}>{offer.description}</p>
                        <div className="flex items-center justify-between">
                            <span className={`text-2xl font-bold text-blue-600 ${isRTL ? 'font-arabic' : ''}`}>{offer.price}</span>
                            <button className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ${isRTL ? 'font-arabic' : ''}`}>
                                {t('common.bookNow')}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default ExclusiveOffers