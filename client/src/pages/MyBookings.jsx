import React, { useState } from 'react'
import Title from '../components/Title'
import { assets, userBookingsDummyData } from '../assets/assets'

const MyBookings = () => {
    const [bookings, setBookings] = useState(userBookingsDummyData)
  return (
    <div className='py-28 md:pb-36 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
        <Title title="My Bookings" subTitle="View and manage your bookings with just a few clicks" align="left" />
        <div className='max-w-6xl mt-8 w-full text-gray-800'>
            <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
                <div className='w-1/3'>Hotels</div>
                <div className='w-1/3'>Date & Time</div>
                <div className='w-1/3'>Payment</div>
            </div>
            {/* Booking items will be mapped here */}
            {bookings.map((booking) => (
                <div key={booking._id} className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t'>
                    {/* hotel details */}
                    <div className='flex flex-col md:flex-row gap-2 '>
                        <img src={booking.room.images[0]} alt={booking.room.name} className='min-md:w-32 w-16 h-16 rounded shadow object-cover' />
                        
                            <div className='flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4'>
                                <p className='font-playfair text-2xl'>{booking.hotel.name}
                                    <span className='font-inter text-sm ml-2'>({booking.room.roomType})</span>
                                </p>

                                <div className='flex items-center gap-1 text-sm text-gray-500'>
                                    <img src={assets.locationIcon} alt="location" />
                                    <span className='text-sm text-gray-500'>{booking.hotel.address}</span>
                                </div>
                                
                                <div className='flex items-center gap-1 text-sm text-gray-500'>
                                    <img src={assets.guestsIcon } alt="guests" />
                                    <span className='text-sm text-gray-500'>{booking.guests}</span>
                                </div>
                                <p className='text-base'>total: ${booking.totalPrice}</p>

                            </div>

                    </div>
                    {/* date and time */}

                    <div className='flex flex-row md:items-center md:gap-12 mt-3 gap-8'>
                        <div>
                            <p>check-in</p>
                            <p className='text-gray-500 text-sm'>{new Date(booking.checkInDate).toDateString()}</p>
                        </div>
                        <div>
                            <p>check-out</p>
                            <p className='text-gray-500 text-sm'>{new Date(booking.checkOutDate).toDateString()}</p>
                        </div>

                        
                    
                    </div>
                    {/* payment details */}
                    <div className='flex flex-col justify-center items-start pt-3'>
                        <div className='flex items-center gap-2'>
                            <div className={`h-3 w-3 rounded-full ${booking.isPaid ? "bg-green-500" : "bg-red-500"}`}></div>
                            <p className={`text-sm ${booking.isPaid ? "text-green-500" : "text-red-500"}`  }>{booking.isPaid ? "Paid" : "Not Paid"}</p>
                        </div>
                        { !booking.isPaid && (
                            <button className='px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer'>pay now</button>
                        )}
                    </div>
                </div>
            ))}
            
        </div>
    </div>
  )
}

export default MyBookings