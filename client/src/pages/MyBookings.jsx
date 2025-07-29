import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import { useTranslation } from '../hooks/useTranslation';
import toast from 'react-hot-toast'

const MyBookings = () => {
    const {user,getToken,axios}=useAppContext();
    const { t, isRTL } = useTranslation();
    const [bookings,setBookings]=useState([]);
    
    const fetchUserBookings=async()=>{
        try{
            const {data}=await axios.get('/api/bookings/user',{headers:{authorization:`Bearer ${await getToken()}`}});
            if(data.success){
                setBookings(data.bookings);
            }
            else{
                toast.error(data.message);
            }
        }
        catch(error){
            toast.error(error.message);
        }
    }
    useEffect(() => {
        if(user){
            fetchUserBookings();
        }
    }, [user])
  return (
    <div className={`py-28 md:pb-36 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32 ${isRTL ? 'text-right' : 'text-left'}`}>
        <Title 
          title={t('myBookings.title')} 
          subTitle={t('myBookings.subtitle')} 
          align="left" 
        />
        <div className='max-w-6xl mt-8 w-full text-gray-800'>
            <div className={`hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3 ${isRTL ? 'font-arabic' : ''}`}>
                <div className='w-1/3'>{t('myBookings.hotels')}</div>
                <div className='w-1/3'>{t('myBookings.dateTime')}</div>
                <div className='w-1/3'>{t('myBookings.payment')}</div>
            </div>
            {/* Booking items will be mapped here */}
            {bookings.map((booking) => (
                <div key={booking._id} className={`grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t ${isRTL ? 'rtl-grid-cols-reverse' : ''}`}>
                    {/* hotel details */}
                    <div className={`flex flex-col md:flex-row gap-2 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                        <img src={booking.room.images[0]} alt={booking.room.name} className='min-md:w-32 w-16 h-16 rounded shadow object-cover' />
                        
                            <div className={`flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4 ${isRTL ? 'min-md:mr-4 min-md:ml-0' : ''}`}>
                                <p className={`font-playfair text-2xl ${isRTL ? 'font-arabic' : ''}`}>{booking.hotel.name}
                                    <span className={`font-inter text-sm ml-2 ${isRTL ? 'font-arabic mr-2 ml-0' : ''}`}>({booking.room.roomType})</span>
                                </p>

                                <div className={`flex items-center gap-1 text-sm text-gray-500 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                                    <img src={assets.locationIcon} alt="location" />
                                    <span className={`text-sm text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>{booking.hotel.address}</span>
                                </div>
                                
                            </div>
                        
                    </div>
                    {/* date and time */}
                    <div className={`flex flex-col justify-center items-start pt-3 ${isRTL ? 'rtl-items-end' : ''}`}>
                        <div className={`flex items-center gap-4 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                            <div>
                                <p className={isRTL ? 'font-arabic' : ''}>{t('myBookings.checkIn')}</p>
                                <p className={`text-gray-500 text-sm ${isRTL ? 'font-arabic' : ''}`}>{new Date(booking.checkInDate).toDateString()}</p>
                            </div>
                            <div>
                                <p className={isRTL ? 'font-arabic' : ''}>{t('myBookings.checkOut')}</p>
                                <p className={`text-gray-500 text-sm ${isRTL ? 'font-arabic' : ''}`}>{new Date(booking.checkOutDate).toDateString()}</p>
                            </div>

                            
                        </div>
                    
                    </div>
                    {/* payment details */}
                    <div className={`flex flex-col justify-center items-start pt-3 ${isRTL ? 'rtl-items-end' : ''}`}>
                        <div className={`flex items-center gap-2 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                            <div className={`h-3 w-3 rounded-full ${booking.isPaid ? "bg-green-500" : "bg-red-500"}`}></div>
                            <p className={`text-sm ${booking.isPaid ? "text-green-500" : "text-red-500"} ${isRTL ? 'font-arabic' : ''}`}>{booking.isPaid ? t('myBookings.paid') : t('myBookings.notPaid')}</p>
                        </div>
                        { !booking.isPaid && (
                            <button className={`px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer ${isRTL ? 'font-arabic' : ''}`}>{t('myBookings.payNow')}</button>
                        )}
                    </div>
                </div>
            ))}
            
        </div>
    </div>
  )
}

export default MyBookings