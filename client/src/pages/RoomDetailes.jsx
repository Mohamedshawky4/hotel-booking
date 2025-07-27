import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets, facilityIcons, roomCommonData, roomsDummyData } from '../assets/assets'
import StarRaiting from '../components/StarRaiting'

const RoomDetailes = () => {
    const {id}= useParams()
    const [room, setRoom] = useState(null)
    const [mainImage, setMainImage] = useState(null)
    useEffect(() => {
       const room = roomsDummyData.find(room =>room._id===id)
       room && setRoom(room)
       room&& setMainImage(room.images[0])
    }, [id])

  return room && (
    <div className='py-28 md:py-36 px-4 md:px-16 lg:px-24 xl:px-32'>
       <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
            <h1 className='text-3xl md:text-4xl font-playfair'>{room.hotel.name} <span className='font-inter text-sm'>{room.roomType}</span></h1>
            <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>20% off</p>
        </div> 
        <div className='flex items-center gap-1 mt-2'>
            <StarRaiting rating={room.rating} />
            <p className='text-sm text-gray-500 ml-2'>200+ reviews</p>
        </div>
        <div className='flex items-center gap-1 text-gray-500 mt-2'>
            <img src={assets.locationIcon} alt="Location Icon"  />
            <span>{room.hotel.address}</span>
        </div>
        {/* room images */}
        <div className='flex flex-col lg:flex-row mt-6 gap-6'>
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
        <div className='flex flex-col md:flex-row  md:justify-between mt-8'>
            <div className='flex flex-col'>
                <h1 className='text-3xl md:text-4xl font-playfair'>Experience Luxury like never before</h1>
                <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                    {room.amenities.map((item, index) => (
                        <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100'>
                           <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                           <p className='text-xs'>{item}</p>
                        </div>
                    ))}
                </div>
            </div>
                    {/*  price*/}
            <p className='text-2xl font-medium'>${room.pricePerNight}/night</p>

        </div>
        {/* checkin checkout */}
        <form className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl' action="">
                <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500'>
                    <div className='flex flex-col'>
                        <label htmlFor="checkInDate" className='font-medium'>Check-in </label>
                        <input type="date" id='checkInDate' placeholder='Check-in Date' className='w-full rounded border
                         border-gray-300 px-3 py-2 mt-1.5 outline-none' required/>

                    </div>
                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                    <div className='flex flex-col'>
                        <label htmlFor="checkOutDate" className='font-medium'>Check-out </label>
                        <input type="date" id='checkOutDate' placeholder='Check-out Date' className='w-full rounded border
                         border-gray-300 px-3 py-2 mt-1.5 outline-none' required/>

                    </div>
                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                    <div className='flex flex-col'>
                        <label htmlFor="guests" className='font-medium'>Guests </label>
                        <input type="number" id='guests' placeholder='0' className='max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required/>

                    </div>

                </div>
                <button type='submit' className='w-1/4 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer'>
                    check availability
                </button>
        </form>
        {/* common specs */}
        <div className=' mt-24 space-y-4'>
            {roomCommonData.map((item, index) => (
                <div key={index} className='flex items-center gap-2'>
                    <img src={item.icon} alt={item.title} className='w-6 h-6' />
                    <div>
                        <p className='text-base'>{item.title}</p>
                        <p className=' text-gray-500'>{item.description}</p>
                    </div>
                </div>
            ))}
        </div>
        <div className='max-w-3xl border-y border-gray-300 my-14 py-10 text-gray-500'>
            <p >Guests will be allocated in ground floor according to availability.
                you get a comfortable two bedroom apartment with a large living room, kitchen and bathroom.
                the price quoted is for the entire apartment, not per person, at the guest slot please enter the number of guests that will be staying in the apartment.
            </p>
        </div>
        {/* host */}
        <div className='flex flex-col items-start gap-4'>
            <div className='flex gap-4'>
                <img src={room.hotel.owner.image} alt="host" className='h-14 w-14 md:h-18 md:w-18 rounded-full'/>
                <div>
                    <p className='text-lg md:text-xl'>Hosted by {room.hotel.name}</p>
                    <div className='flex items-center mt-1'>
                        <StarRaiting/>
                        <p className='ml-2'>200+ reviews</p>
                    </div>
                </div>
            </div>
            <button className='bg-blue-600 hover:bg-blue-500 transition-all cursor-pointer text-white rounded px-6 py-2 mt-4'>Contact Now</button>
        </div>
    </div>
  )
}

export default RoomDetailes