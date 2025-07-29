import React, { useState } from 'react'
import { assets, cities } from '../assets/assets'
import heroImage from '../assets/heroImage.png'
import { useAppContext } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../translations';

const Hero = () => {
  const { navigate,getToken ,axios,setSearchedCities } = useAppContext();
  const { currentLanguage, isRTL } = useLanguage();
  const [destination, setDestination] = useState('');

  const onSearch = async (e) => {
    e.preventDefault();
    navigate(`/rooms?destination=${destination}`);
    await axios.post("/api/user/store-recent-search", { recentSearchedCity: destination }, { headers: { authorization: `Bearer ${await getToken()}` } });
    setSearchedCities((prev) =>{ 
      const updatedSearchedCities = [...prev, destination];
      if(updatedSearchedCities.length>3){
        updatedSearchedCities.shift();
      }
      return updatedSearchedCities
    });
  }

  return (
    <div
      className={`flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-no-repeat bg-cover bg-center h-screen ${isRTL ? 'text-right' : 'text-left'}`}
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <p className={`bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20 ${isRTL ? 'font-arabic' : ''}`}>
        {t('hero.tagline', currentLanguage)}
      </p>
      <h1 className={`font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4 ${isRTL ? 'font-arabic' : ''}`}>
        {t('hero.title', currentLanguage)}
      </h1>
      <p className={`max-w-130 mt-2 text-sm md:text-base ${isRTL ? 'font-arabic' : ''}`}>
        {t('hero.subtitle', currentLanguage)}
      </p>

      <form onSubmit={onSearch} className={`bg-white text-gray-500 rounded-lg mt-8 px-6 py-4 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>

        <div>
          <div className={`flex items-center gap-2 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
            <img src={assets.calenderIcon} alt="" className='h-4' />
            <label htmlFor="destinationInput">{t('hero.destination', currentLanguage)}</label>
          </div>
          <input 
            onChange={(e) => setDestination(e.target.value)} 
            value={destination} 
            list='destinations' 
            id="destinationInput" 
            type="text" 
            className={`rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none ${isRTL ? 'font-arabic text-right' : ''}`} 
            placeholder={t('hero.typeHere', currentLanguage)} 
            required 
          />
          <datalist id='destinations'>
            {cities.map((city, index) => (
              <option key={index} value={city}></option>
            ))}
          </datalist>
        </div>

        <div>
          <div className={`flex items-center gap-2 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
            <img src={assets.calenderIcon} alt="" className='h-4' />
            <label htmlFor="checkIn">{t('hero.checkIn', currentLanguage)}</label>
          </div>
          <input 
            id="checkIn" 
            type="date" 
            className={`rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none ${isRTL ? 'text-right' : ''}`} 
          />
        </div>

        <div>
          <div className={`flex items-center gap-2 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
            <svg className="w-4 h-4 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 10h16M8 14h8m-4-7V4M7 7V4m10 3V4M5 20h14a1 1 0 001-1V7a1 1 0 00-1-1H5a1 1 0 00-1 1v12a1 1 0 001 1Z" />
            </svg>
            <label htmlFor="checkOut">{t('hero.checkOut', currentLanguage)}</label>
          </div>
          <input 
            id="checkOut" 
            type="date" 
            className={`rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none ${isRTL ? 'text-right' : ''}`} 
          />
        </div>

        <div className={`flex md:flex-col max-md:gap-2 max-md:items-center ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
          <label htmlFor="guests">{t('hero.guests', currentLanguage)}</label>
          <input 
            min={1} 
            max={4} 
            id="guests" 
            type="number" 
            className={`rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-16 ${isRTL ? 'text-right' : ''}`} 
            placeholder="0" 
          />
        </div>

        <button className={`flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
          <img src={assets.searchIcon} alt="Search" className='h-7' />
          <span className={isRTL ? 'font-arabic' : ''}>{t('hero.search', currentLanguage)}</span>
        </button>

      </form>
    </div>
  )
}

export default Hero
