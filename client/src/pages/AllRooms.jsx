import React, { useMemo, useState } from 'react'
import {  assets, facilityIcons, roomsDummyData } from '../assets/assets'
import {  useSearchParams } from 'react-router-dom'
import StarRaiting from '../components/StarRaiting'
import { useAppContext } from '../context/AppContext'
import { useTranslation } from '../hooks/useTranslation';

const CheckBox=({label,selected=false,onChange=()=>{}})=>{
  const { isRTL } = useTranslation();
  
  return(
    <label className={`flex gap-3 items-center cursor-pointer mt-2 text-sm ${isRTL ? 'rtl-flex-row-reverse font-arabic' : ''}`}>
        <input type="checkbox" checked={selected} onChange={(e) => onChange(e.target.checked,label)} className='w-4 h-4 accent-gray-800' />
        <span className={`font-light select-none ${isRTL ? 'font-arabic' : ''}`}>{label}</span>
    </label>
  )
}

const RadioButton=({label,selected=false,onChange=()=>{}})=>{
  const { isRTL } = useTranslation();
  
  return(
    <label className={`flex gap-3 items-center cursor-pointer mt-2 text-sm ${isRTL ? 'rtl-flex-row-reverse font-arabic' : ''}`}>
        <input type="radio" name='sortOptions' checked={selected} onChange={(e) => onChange(label)}  />
        <span className={`font-light select-none ${isRTL ? 'font-arabic' : ''}`}>{label}</span>
    </label>
  )
}

const AllRooms = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const {rooms,navigate,currency}=useAppContext();
    const { t, isRTL } = useTranslation();
    const [openFilters, setOpenFilters] = useState(false)
    const [selectedFilters, setSelectedFilters] = useState({
        roomType: [],
        priceRange: [],
    })
    const [selectedSort, setSelectedSort] = useState("")
    
    const roomTypes = [
      t('allRooms.roomTypes.singleBed'),
      t('allRooms.roomTypes.doubleBed'), 
      t('allRooms.roomTypes.familySuite'), 
      t('allRooms.roomTypes.luxuryRoom')
    ]
    const priceRanges = ["$0 - $500", "$500 - $1000", "$1000 - $1500", "$1500 - $2000", "$2000 - $3000"]
    const sortOptions = [
      t('allRooms.priceLowToHigh'),
      t('allRooms.priceHighToLow'), 
      t('allRooms.newestFirst')
    ]

    const handleFilterChange = (checked,value,type) => {
        setSelectedFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters };
            if (checked) {
                updatedFilters[type].push(value);
            }else{
                updatedFilters[type] = updatedFilters[type].filter((filter) => filter !== value);
            }
            return updatedFilters;
        })
        
    }
    const handleSortChange = (sortOptions) => {
            setSelectedSort(sortOptions);
        }
        const matchesRoomType=(room)=>{
            return selectedFilters.roomType.length === 0 || selectedFilters.roomType.includes(room.roomType)
        }
        const matchesPriceRange = (room) => {
  return (
    selectedFilters.priceRange.length === 0 ||
    selectedFilters.priceRange.some((range) => {
      const [min, max] = range
        .replace(/[^0-9\-]/g, '') // remove $ or any symbols if needed
        .split('-')
        .map(Number);
      return room.pricePerNight >= min && room.pricePerNight <= max;
    })
  );
};
        const sortRooms=(a,b)=>{
            if (selectedSort === t('allRooms.priceLowToHigh')) {
                return a.pricePerNight - b.pricePerNight;
            }  if (selectedSort === t('allRooms.priceHighToLow')) {
                return b.pricePerNight - a.pricePerNight;
            }  if (selectedSort === t('allRooms.newestFirst')) {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return 0;
        }
        const filterDestination=(room)=>{
            const destination=searchParams.get('destination');
            if(!destination){
                return true;
            }
            return room.hotel.city.toLowerCase().includes(destination.toLowerCase())
        }
        const filteredRooms=useMemo(() => {
            return rooms.filter((room) => matchesRoomType(room) && matchesPriceRange(room) && filterDestination(room)).sort(sortRooms);
        }, [rooms, selectedFilters, selectedSort]);

        const clearAllFilters = () => {
            setSelectedFilters({
                roomType: [],
                priceRange: [],
            });
            setSelectedSort("");
            setSearchParams({});
        };
        
  return (
    <div className={`flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
       <div>
            <div className={`flex flex-col items-start text-left ${isRTL ? 'text-right' : 'text-left'}`}>
                <h1 className={`font-playfair text-4xl md:text-[40px] ${isRTL ? 'font-arabic' : ''}`}>{t('allRooms.title')}</h1>
                <p className={`text-sm md:text-base text-gray-500/90 mt-2 max-w-174 ${isRTL ? 'font-arabic' : ''}`}>{t('allRooms.subtitle')}</p>
            </div>

            {filteredRooms.map((room) => (
                <div key={room._id} className={`flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                    <img src={room.images[0]} alt={room.hotel.name} title='view room details'
                     className='max-h-64 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer'  onClick={() => {navigate(`/rooms/${room._id}`); scrollTo(0, 0);}}/>
                     <div className='md:w-1/2 flex flex-col gap-2'>
                        <p className={`text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>{room.hotel.city}</p>
                        <p  onClick={() => {navigate(`/rooms/${room._id}`); scrollTo(0, 0);}} className={`text-gray-800 text-3xl font-playfair cursor-pointer ${isRTL ? 'font-arabic' : ''}`}>{room.hotel.name}</p>
                        <div className={`flex items-centers ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                            <StarRaiting rating={room.rating} />
                            <p className={`ml-2 ${isRTL ? 'font-arabic mr-2 ml-0' : ''}`}>200+ {t('roomDetails.reviews')}</p>
                        </div>

                        <div className={`flex items-center gap-1 mt-2 text-sm text-gray-500 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                            <img src={assets.locationIcon} alt="location icon" />
                            <span className={isRTL ? 'font-arabic' : ''}>{room.hotel.address}</span>
                        </div>
                        <div  className='flex flex-wrap items-center mt-3 mb-6 gap-4 '>
                            {room.amenities.map((item, index) => (
                                <div key={index} className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f5f5f5]/70 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                                    <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                                    <p className={`text-xs ${isRTL ? 'font-arabic' : ''}`}>{item}</p>
                                </div>
                                ))}
                        </div>
                        <p className={`text-gray-800 font-medium text-xl ${isRTL ? 'font-arabic' : ''}`}>${room.pricePerNight}/{t('roomDetails.perNight')}</p>
                        
                     </div>


                </div>
            ))}

       </div>
       {/* filters */}
       <div className={`bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${openFilters &&"border-b"} ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                <p className={`text-base font-medium text-gray-800 ${isRTL ? 'font-arabic' : ''}`}>{t('allRooms.filters')}</p>
                <div className='text-xs cursor-pointer'>
                    <span onClick={() => setOpenFilters(!openFilters)} className='lg:hidden'>{openFilters ? t('common.hide') || 'Hide' : t('common.show') || 'Show'}</span>
                    <span className='hidden lg:block'>{t('common.clear')}</span>
                </div>

            </div>
            <div className={`${openFilters ? "h-auto" : "h-0 lg:h-auto"} overflow-hidden transition-all duration-60000`}>
                <div className='px-5 pt-5'>
                    <p className={`font-medium text-gray-800 pb-2 ${isRTL ? 'font-arabic' : ''}`}>{t('allRooms.popularFilters')}</p>
                    {roomTypes.map((room, index) => (
                        <CheckBox key={index} label={room} selected={selectedFilters.roomType.includes(room)} onChange={(checked) => handleFilterChange(checked, room, 'roomType')} />
                    ))}

                </div>
                <div className='px-5 pt-5'>
                    <p className={`font-medium text-gray-800 pb-2 ${isRTL ? 'font-arabic' : ''}`}>{t('allRooms.priceRange')}</p>
                    {priceRanges.map((range, index) => (
                        <CheckBox key={index} label={`${currency} ${range}`} selected={selectedFilters.priceRange.includes(range)} onChange={(checked) => handleFilterChange(checked, range, 'priceRange')}  />
                    ))}

                </div>
                <div className='px-5 pt-5 pb-7'>
                    <p className={`font-medium text-gray-800 pb-2 ${isRTL ? 'font-arabic' : ''}`}>{t('allRooms.sortBy')}</p>
                    {sortOptions.map((option, index) => (
                        <RadioButton key={index} label={option} selected={selectedSort === option} onChange={() => handleSortChange(option)} />
                    ))}

                </div>


            </div>

       </div>
    </div>
  )
}

export default AllRooms