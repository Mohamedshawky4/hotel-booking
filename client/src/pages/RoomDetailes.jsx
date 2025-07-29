import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets, facilityIcons, roomCommonData } from '../assets/assets'
import StarRaiting from '../components/StarRaiting'
import { useAppContext } from '../context/AppContext'
import { useTranslation } from '../hooks/useTranslation';
import toast from 'react-hot-toast'

const RoomDetailes = () => {
    const {id}= useParams()
    const {rooms,getToken,axios,navigate}=useAppContext();
    const { t, isRTL } = useTranslation();
    const [room, setRoom] = useState(null)
    const [mainImage, setMainImage] = useState(null)
    const [checkInDate, setCheckInDate] = useState(null)
    const [checkOutDate, setCheckOutDate] = useState(null)
    const [guests, setGuests] = useState(1)
    const [isAvailable, setIsAvailable] = useState(false)

    const checkAvailability = async () => {
        try {
         if(checkInDate>=checkOutDate){
            toast.error(t('roomDetails.checkInBeforeCheckOut'));
            return;
         }
         const {data}=await axios.post(`/api/bookings/check-availability`,{room:id,checkInDate,checkOutDate},{headers:{authorization:`Bearer ${await getToken()}`}});
        if(data.success){
            if(data.isAvailable){
                setIsAvailable(true);
                toast.success(t('roomDetails.roomAvailable'));
            }
            else{
                setIsAvailable(false);
                toast.error(t('roomDetails.roomNotAvailable'));
            }
        }else{
            toast.error(data.message);
        }
        } catch (error) {
          toast.error(error.message);
        }
      };
      
      const onSubmitHandler=async(e)=>{
          try{
              e.preventDefault();
            //   const {data}=await axios.post(`/api/bookings`,{room:id,checkInDate,checkOutDate,guests},{headers:{authorization:`Bearer ${await getToken()}`}}); 
             if(!isAvailable){
                 return checkAvailability();
             }
             else{
                const {data}=await axios.post(`/api/bookings/book`,{room:id,checkInDate,checkOutDate,guests,paymentMethod:"Pay At Hotel"},{headers:{authorization:`Bearer ${await getToken()}`}});
                if(data.success){
                    toast.success(t('roomDetails.bookingCreated'));
                    navigate("/my-bookings");
                    scrollTo(0,0);
                }
                else{
                    toast.error(data.message);
                }
             }

          }
          catch(error){
              toast.error(error.message);
          }
      }

    useEffect(() => {
       const room = rooms.find(room =>room._id===id)
       room && setRoom(room)
       room&& setMainImage(room.images[0])
    }, [rooms])

  return room && (
    <div className={`py-28 md:py-36 px-4 md:px-16 lg:px-24 xl:px-32 ${isRTL ? 'text-right' : 'text-left'}`}>
       <div className={`flex flex-col md:flex-row items-start md:items-center gap-2 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
            <h1 className={`text-3xl md:text-4xl font-playfair ${isRTL ? 'font-arabic' : ''}`}>{room.hotel.name} <span className={`font-inter text-sm ${isRTL ? 'font-arabic' : ''}`}>{room.roomType}</span></h1>
            <p className={`text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full ${isRTL ? 'font-arabic' : ''}`}>20% off</p>
        </div> 
        <div className={`flex items-center gap-1 mt-2 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
            <StarRaiting rating={room.rating} />
            <p className={`text-sm text-gray-500 ml-2 ${isRTL ? 'font-arabic mr-2 ml-0' : ''}`}>200+ {t('roomDetails.reviews')}</p>
        </div>
        <div className={`flex items-center gap-1 text-gray-500 mt-2 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
            <img src={assets.locationIcon} alt="Location Icon"  />
            <span className={isRTL ? 'font-arabic' : ''}>{room.hotel.address}</span>
        </div>
        {/* room images */}
        <div className={`flex flex-col lg:flex-row mt-6 gap-6 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
            <div className='lg:w-1/2 w-full'>
                <img src={mainImage} alt={room.hotel.name} className='w-full rounded-xl shadow-lg object-cover cursor-pointer' onClick={() => setMainImage(room.images[0])} />
            
            </div>
            <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
                {room?.images.length > 1 && room.images.map((image,index)=>(
                    <img key={index} src={image} alt={room.hotel.name} className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${mainImage === image ? 'opacity-60 outline outline-2 outline-orange-500' : ''}`} onClick={() => setMainImage(image)} />

                ))}
            </div>
        </div>
        {/* room highlights */}
        <div className={`flex flex-col md:flex-row md:justify-between mt-8 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
            <div className='flex flex-col'>
                <h1 className={`text-3xl md:text-4xl font-playfair ${isRTL ? 'font-arabic' : ''}`}>{t('roomDetails.experienceLuxury')}</h1>
                <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                    {room.amenities.map((item, index) => (
                        <div key={index} className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                           <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                           <p className={`text-xs ${isRTL ? 'font-arabic' : ''}`}>{item}</p>
                        </div>
                    ))}
                </div>
            </div>
                    {/*  price*/}
            <p className={`text-2xl font-medium ${isRTL ? 'font-arabic' : ''}`}>${room.pricePerNight}/{t('roomDetails.perNight')}</p>

        </div>
        {/* checkin checkout */}
        <form onSubmit={onSubmitHandler} className={`flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl ${isRTL ? 'rtl-flex-row-reverse' : ''}`} action="">
                <div className={`flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                    <div className='flex flex-col'>
                        <label htmlFor="checkInDate" className={`font-medium ${isRTL ? 'font-arabic' : ''}`}>{t('roomDetails.checkIn')} </label>
                        <input onChange={(e) => setCheckInDate(e.target.value)} value={checkInDate} min={new Date().toISOString().split('T')[0]}  type="date" id='checkInDate' placeholder={t('roomDetails.checkIn')} className={`w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none ${isRTL ? 'text-right' : ''}`} required/>

                    </div>
                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                    <div className='flex flex-col'>
                        <label htmlFor="checkOutDate" className={`font-medium ${isRTL ? 'font-arabic' : ''}`}>{t('roomDetails.checkOut')} </label>
                        <input onChange={(e) => setCheckOutDate(e.target.value)} value={checkOutDate} min={checkInDate} disabled={!checkInDate} type="date" id='checkOutDate' placeholder={t('roomDetails.checkOut')} className={`w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none ${isRTL ? 'text-right' : ''}`} required/>

                    </div>
                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                    <div className='flex flex-col'>
                        <label htmlFor="guests" className={`font-medium ${isRTL ? 'font-arabic' : ''}`}>{t('roomDetails.guests')} </label>
                        <input onChange={(e) => setGuests(e.target.value)} value={guests} type="number" id='guests' placeholder='1' className={`max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none ${isRTL ? 'text-right' : ''}`} required/>

                    </div>

                </div>
                <button type='submit' className={`w-1/4 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer ${isRTL ? 'font-arabic' : ''}`}>
                    {isAvailable ? t('roomDetails.bookNow') : t('roomDetails.checkAvailability')}
                </button>
        </form>
        {/* common specs */}
        <div className=' mt-24 space-y-4'>
            {roomCommonData.map((item, index) => (
                <div key={index} className={`flex items-center gap-2 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                    <img src={item.icon} alt={item.title} className='w-6 h-6' />
                    <div>
                        <p className={`text-base ${isRTL ? 'font-arabic' : ''}`}>{item.title}</p>
                        <p className={`text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>{item.description}</p>
                    </div>
                </div>
            ))}
        </div>
        <div className='max-w-3xl border-y border-gray-300 my-14 py-10 text-gray-500'>
            <p className={isRTL ? 'font-arabic' : ''}>Guests will be allocated in ground floor according to availability.
                you get a comfortable two bedroom apartment with a large living room, kitchen and bathroom.
                the price quoted is for the entire apartment, not per person, at the guest slot please enter the number of guests that will be staying in the apartment.
            </p>
        </div>
        {/* host */}
        <div className={`flex flex-col items-start gap-4 ${isRTL ? 'rtl-items-end' : ''}`}>
            <div className={`flex gap-4 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                <img src={room.hotel.owner.image} alt="host" className='h-14 w-14 md:h-18 md:w-18 rounded-full'/>
                <div>
                    <p className={`text-lg md:text-xl ${isRTL ? 'font-arabic' : ''}`}>{t('roomDetails.hostedBy')} {room.hotel.name}</p>
                    <div className={`flex items-center mt-1 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                        <StarRaiting/>
                        <p className={`ml-2 ${isRTL ? 'font-arabic mr-2 ml-0' : ''}`}>200+ {t('roomDetails.reviews')}</p>
                    </div>
                </div>
            </div>
            <button className={`bg-blue-600 hover:bg-blue-500 transition-all cursor-pointer text-white rounded px-6 py-2 mt-4 ${isRTL ? 'font-arabic' : ''}`}>{t('roomDetails.contactNow')}</button>
        </div>
    </div>
  )
}

export default RoomDetailes