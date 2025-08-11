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
    
    // Enhanced filter state
    const [selectedFilters, setSelectedFilters] = useState({
        roomType: [],
        priceRange: [],
        amenities: [],
        guestCount: 1,
        checkInDate: '',
        checkOutDate: '',
        rating: 0,
        location: ''
    })
    const [selectedSort, setSelectedSort] = useState("")
    
    const roomTypes = [
      t('allRooms.roomTypes.singleBed'),
      t('allRooms.roomTypes.doubleBed'), 
      t('allRooms.roomTypes.familySuite'), 
      t('allRooms.roomTypes.luxuryRoom')
    ]
    
    const priceRanges = ["$0 - $500", "$500 - $1000", "$1000 - $1500", "$1500 - $2000", "$2000 - $3000"]
    
    const amenities = [
      'Free WiFi',
      'Free Breakfast', 
      'Pool',
      'Room Service',
      'Air Conditioning',
      'TV',
      'Mini Bar',
      'Balcony'
    ]
    
    const sortOptions = [
      t('allRooms.priceLowToHigh'),
      t('allRooms.priceHighToLow'), 
      t('allRooms.newestFirst'),
      'Rating High to Low',
      'Distance from City Center'
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

    const handleDateChange = (date, type) => {
        setSelectedFilters(prev => ({
            ...prev,
            [type]: date
        }));
    }

    const handleGuestCountChange = (count) => {
        setSelectedFilters(prev => ({
            ...prev,
            guestCount: count
        }));
    }

    const handleLocationChange = (location) => {
        setSelectedFilters(prev => ({
            ...prev,
            location: location
        }));
    }

    const handleRatingChange = (rating) => {
        setSelectedFilters(prev => ({
            ...prev,
            rating: rating
        }));
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
                    .replace(/[^0-9\-]/g, '')
                    .split('-')
                    .map(Number);
                return room.pricePerNight >= min && room.pricePerNight <= max;
            })
        );
    };

    const matchesAmenities = (room) => {
        return selectedFilters.amenities.length === 0 || 
               selectedFilters.amenities.every(amenity => 
                   room.amenities.includes(amenity)
               );
    };

    const matchesGuestCount = (room) => {
        // Assuming room has a maxGuests property, if not we'll need to add it
        return room.maxGuests >= selectedFilters.guestCount;
    };

    const matchesLocation = (room) => {
        if (!selectedFilters.location) return true;
        return room.hotel.city.toLowerCase().includes(selectedFilters.location.toLowerCase()) ||
               room.hotel.address.toLowerCase().includes(selectedFilters.location.toLowerCase());
    };

    const matchesRating = (room) => {
        if (selectedFilters.rating === 0) return true;
        return room.rating >= selectedFilters.rating;
    };

    const sortRooms=(a,b)=>{
        if (selectedSort === t('allRooms.priceLowToHigh')) {
            return a.pricePerNight - b.pricePerNight;
        }  
        if (selectedSort === t('allRooms.priceHighToLow')) {
            return b.pricePerNight - a.pricePerNight;
        }  
        if (selectedSort === t('allRooms.newestFirst')) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (selectedSort === 'Rating High to Low') {
            return b.rating - a.rating;
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
        return rooms.filter((room) => 
            matchesRoomType(room) && 
            matchesPriceRange(room) && 
            matchesAmenities(room) &&
            matchesGuestCount(room) &&
            matchesLocation(room) &&
            matchesRating(room) &&
            filterDestination(room)
        ).sort(sortRooms);
    }, [rooms, selectedFilters, selectedSort]);

    const clearAllFilters = () => {
        setSelectedFilters({
            roomType: [],
            priceRange: [],
            amenities: [],
            guestCount: 1,
            checkInDate: '',
            checkOutDate: '',
            rating: 0,
            location: ''
        });
        setSelectedSort("");
        setSearchParams({});
    };

    const activeFiltersCount = Object.values(selectedFilters).reduce((count, filter) => {
        if (Array.isArray(filter)) {
            return count + filter.length;
        }
        if (typeof filter === 'string' && filter !== '') {
            return count + 1;
        }
        if (typeof filter === 'number' && filter > 0) {
            return count + 1;
        }
        return count;
    }, 0);
        
    return (
        <div className={`flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
            <div className="flex-1">
                {/* Search Results Header */}
                <div className={`flex flex-col items-start text-left mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h1 className={`font-playfair text-4xl md:text-[40px] ${isRTL ? 'font-arabic' : ''}`}>{t('allRooms.title')}</h1>
                    <p className={`text-sm md:text-base text-gray-500/90 mt-2 max-w-174 ${isRTL ? 'font-arabic' : ''}`}>
                        {filteredRooms.length} {t('allRooms.resultsFound') || 'results found'}
                    </p>
                    
                    {/* Active Filters Display */}
                    {activeFiltersCount > 0 && (
                        <div className={`flex flex-wrap items-center gap-2 mt-4 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                            <span className={`text-sm text-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
                                {t('allRooms.activeFilters') || 'Active filters:'}
                            </span>
                            {selectedFilters.roomType.map(type => (
                                <span key={type} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                    {type}
                                </span>
                            ))}
                            {selectedFilters.amenities.map(amenity => (
                                <span key={amenity} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    {amenity}
                                </span>
                            ))}
                            {selectedFilters.location && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                    {selectedFilters.location}
                                </span>
                            )}
                            {selectedFilters.rating > 0 && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                    {selectedFilters.rating}+ stars
                                </span>
                            )}
                            <button 
                                onClick={clearAllFilters}
                                className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full hover:bg-red-200"
                            >
                                {t('common.clearAll') || 'Clear All'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Rooms List */}
                {filteredRooms.length === 0 ? (
                    <div className={`text-center py-20 ${isRTL ? 'font-arabic' : ''}`}>
                        <p className="text-gray-500 text-lg mb-4">
                            {t('allRooms.noResults') || 'No rooms found matching your criteria'}
                        </p>
                        <button 
                            onClick={clearAllFilters}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {t('allRooms.clearFilters') || 'Clear Filters'}
                        </button>
                    </div>
                ) : (
                    filteredRooms.map((room) => (
                        <div key={room._id} className={`flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                            <img src={room.images[0]} alt={room.hotel.name} title='view room details'
                                className='max-h-64 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer'  
                                onClick={() => {navigate(`/rooms/${room._id}`); scrollTo(0, 0);}}
                            />
                            <div className='md:w-1/2 flex flex-col gap-2'>
                                <p className={`text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>{room.hotel.city}</p>
                                <p onClick={() => {navigate(`/rooms/${room._id}`); scrollTo(0, 0);}} 
                                   className={`text-gray-800 text-3xl font-playfair cursor-pointer ${isRTL ? 'font-arabic' : ''}`}>
                                    {room.hotel.name}
                                </p>
                                <div className={`flex items-centers ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                                    <StarRaiting rating={room.rating} />
                                    <p className={`ml-2 ${isRTL ? 'font-arabic mr-2 ml-0' : ''}`}>
                                        {room.rating} ({room.reviewCount || 200}+ {t('roomDetails.reviews')})
                                    </p>
                                </div>

                                <div className={`flex items-center gap-1 mt-2 text-sm text-gray-500 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                                    <img src={assets.locationIcon} alt="location icon" />
                                    <span className={isRTL ? 'font-arabic' : ''}>{room.hotel.address}</span>
                                </div>
                                
                                <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                                    {room.amenities.slice(0, 4).map((item, index) => (
                                        <div key={index} className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f5f5f5]/70 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                                            <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                                            <p className={`text-xs ${isRTL ? 'font-arabic' : ''}`}>{item}</p>
                                        </div>
                                    ))}
                                    {room.amenities.length > 4 && (
                                        <span className="text-xs text-gray-500">
                                            +{room.amenities.length - 4} more
                                        </span>
                                    )}
                                </div>
                                
                                <div className={`flex items-center justify-between ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                                    <p className={`text-gray-800 font-medium text-xl ${isRTL ? 'font-arabic' : ''}`}>
                                        ${room.pricePerNight}/{t('roomDetails.perNight')}
                                    </p>
                                    <button 
                                        onClick={() => {navigate(`/rooms/${room._id}`); scrollTo(0, 0);}}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        {t('common.viewDetails') || 'View Details'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Enhanced Filters Sidebar */}
            <div className={`bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16 rounded-lg shadow-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center justify-between px-5 py-3 border-b border-gray-300 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                    <p className={`text-base font-medium text-gray-800 ${isRTL ? 'font-arabic' : ''}`}>
                        {t('allRooms.filters')} {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                    </p>
                    <div className='text-xs cursor-pointer'>
                        <span onClick={() => setOpenFilters(!openFilters)} className='lg:hidden'>
                            {openFilters ? t('common.hide') || 'Hide' : t('common.show') || 'Show'}
                        </span>
                        <span onClick={clearAllFilters} className='hidden lg:block text-blue-600 hover:text-blue-800'>
                            {t('common.clearAll') || 'Clear All'}
                        </span>
                    </div>
                </div>

                <div className={`${openFilters ? "h-auto" : "h-0 lg:h-auto"} overflow-hidden transition-all duration-300`}>
                    {/* Date Range Filter */}
                    <div className='px-5 pt-5 border-b border-gray-100'>
                        <p className={`font-medium text-gray-800 pb-2 ${isRTL ? 'font-arabic' : ''}`}>
                            {t('allRooms.checkInOut') || 'Check-in/Check-out'}
                        </p>
                        <div className="space-y-2">
                            <input
                                type="date"
                                value={selectedFilters.checkInDate}
                                onChange={(e) => handleDateChange(e.target.value, 'checkInDate')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                min={new Date().toISOString().split('T')[0]}
                            />
                            <input
                                type="date"
                                value={selectedFilters.checkOutDate}
                                onChange={(e) => handleDateChange(e.target.value, 'checkOutDate')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                min={selectedFilters.checkInDate || new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>

                    {/* Guest Count Filter */}
                    <div className='px-5 pt-5 border-b border-gray-100'>
                        <p className={`font-medium text-gray-800 pb-2 ${isRTL ? 'font-arabic' : ''}`}>
                            {t('allRooms.guests') || 'Guests'}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleGuestCountChange(Math.max(1, selectedFilters.guestCount - 1))}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                                -
                            </button>
                            <span className="w-8 text-center">{selectedFilters.guestCount}</span>
                            <button
                                onClick={() => handleGuestCountChange(selectedFilters.guestCount + 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Location Filter */}
                    <div className='px-5 pt-5 border-b border-gray-100'>
                        <p className={`font-medium text-gray-800 pb-2 ${isRTL ? 'font-arabic' : ''}`}>
                            {t('allRooms.location') || 'Location'}
                        </p>
                        <input
                            type="text"
                            placeholder={t('allRooms.searchLocation') || 'Search by city or address'}
                            value={selectedFilters.location}
                            onChange={(e) => handleLocationChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                    </div>

                    {/* Rating Filter */}
                    <div className='px-5 pt-5 border-b border-gray-100'>
                        <p className={`font-medium text-gray-800 pb-2 ${isRTL ? 'font-arabic' : ''}`}>
                            {t('allRooms.minimumRating') || 'Minimum Rating'}
                        </p>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map(rating => (
                                <button
                                    key={rating}
                                    onClick={() => handleRatingChange(rating)}
                                    className={`px-2 py-1 rounded text-sm ${
                                        selectedFilters.rating === rating 
                                            ? 'bg-yellow-100 text-yellow-800' 
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {rating}+
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Room Type Filter */}
                    <div className='px-5 pt-5 border-b border-gray-100'>
                        <p className={`font-medium text-gray-800 pb-2 ${isRTL ? 'font-arabic' : ''}`}>
                            {t('allRooms.popularFilters')}
                        </p>
                        {roomTypes.map((room, index) => (
                            <CheckBox 
                                key={index} 
                                label={room} 
                                selected={selectedFilters.roomType.includes(room)} 
                                onChange={(checked) => handleFilterChange(checked, room, 'roomType')} 
                            />
                        ))}
                    </div>

                    {/* Amenities Filter */}
                    <div className='px-5 pt-5 border-b border-gray-100'>
                        <p className={`font-medium text-gray-800 pb-2 ${isRTL ? 'font-arabic' : ''}`}>
                            {t('allRooms.amenities') || 'Amenities'}
                        </p>
                        {amenities.map((amenity, index) => (
                            <CheckBox 
                                key={index} 
                                label={amenity} 
                                selected={selectedFilters.amenities.includes(amenity)} 
                                onChange={(checked) => handleFilterChange(checked, amenity, 'amenities')} 
                            />
                        ))}
                    </div>

                    {/* Price Range Filter */}
                    <div className='px-5 pt-5 border-b border-gray-100'>
                        <p className={`font-medium text-gray-800 pb-2 ${isRTL ? 'font-arabic' : ''}`}>
                            {t('allRooms.priceRange')}
                        </p>
                        {priceRanges.map((range, index) => (
                            <CheckBox 
                                key={index} 
                                label={`${currency} ${range}`} 
                                selected={selectedFilters.priceRange.includes(range)} 
                                onChange={(checked) => handleFilterChange(checked, range, 'priceRange')}  
                            />
                        ))}
                    </div>

                    {/* Sort Options */}
                    <div className='px-5 pt-5 pb-7'>
                        <p className={`font-medium text-gray-800 pb-2 ${isRTL ? 'font-arabic' : ''}`}>
                            {t('allRooms.sortBy')}
                        </p>
                        {sortOptions.map((option, index) => (
                            <RadioButton 
                                key={index} 
                                label={option} 
                                selected={selectedSort === option} 
                                onChange={() => handleSortChange(option)} 
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllRooms