import React from 'react'
import HotelCard from './HotelCard'
import Title from './Title'
import { useAppContext } from '../context/AppContext'
import { useTranslation } from '../hooks/useTranslation';

const FeaturedDestination = () => {
    const {rooms,navigate}=useAppContext();
    const { t, isRTL } = useTranslation();
    
  return rooms.length>0 && (
    <div className={`flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20 ${isRTL ? 'text-right' : 'text-left'}`}>
        <Title 
          title={t('components.featuredDestinations.title')} 
          subTitle={t('components.featuredDestinations.subtitle')} 
          align="center" 
        />
        <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
            {rooms.slice(0,4).map((room, index) => (
                <HotelCard room={room} key={room._id} index={index} />
            ))}
        </div>
        <button 
          onClick={()=>{navigate('/rooms') ; scrollTo(0,0)}} 
          className={`my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer ${isRTL ? 'font-arabic' : ''}`}
        >
          {t('components.featuredDestinations.viewAllDestinations')}
        </button>
    </div>
  )
}

export default FeaturedDestination