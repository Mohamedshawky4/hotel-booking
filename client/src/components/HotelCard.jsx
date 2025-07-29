import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useTranslation } from '../hooks/useTranslation';

const HotelCard = ({ room, index }) => {
  const { t, isRTL } = useTranslation();
  
  return (
    <Link
      to={`/rooms/${room._id}`}
      onClick={() => scrollTo(0, 0)}
      key={room._id}
      className={`relative w-full max-w-[280px] bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 ${isRTL ? 'font-arabic' : ''}`}
    >
      <img
        src={room.images[0]}
        alt={room.name}
        className="w-full h-48 object-cover"
      />

      {index % 2 === 0 && (
        <p className={`absolute top-3 left-3 px-3 py-1 text-xs bg-white text-gray-800 font-medium rounded-full shadow-sm ${isRTL ? 'font-arabic' : ''}`}>
          {t('common.bestSeller') || 'Best Seller'}
        </p>
      )}

      <div className="p-4">
        <div className={`flex items-center justify-between ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
          <p className={`font-playfair text-lg font-semibold text-gray-800 ${isRTL ? 'font-arabic' : ''}`}>
            {room.hotel.name}
          </p>
          <div className={`flex items-center gap-1 text-sm text-gray-600 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
            <img src={assets.starIconFilled} alt="star icon" className="w-4 h-4" />
            4.5
          </div>
        </div>

        <div className={`flex items-center gap-2 mt-1 text-sm text-gray-500 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
          <img src={assets.locationIcon} alt="location icon" className="w-4 h-4" />
          <span className={isRTL ? 'font-arabic' : ''}>{room.hotel.address}</span>
        </div>

        <div className={`flex items-center justify-between mt-4 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
          <p className={`text-gray-800 font-medium ${isRTL ? 'font-arabic' : ''}`}>
            <span className="text-xl">{room.pricePerNight}</span>/night
          </p>
          <button className={`px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-100 transition-all ${isRTL ? 'font-arabic' : ''}`}>
            {t('common.bookNow')}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
