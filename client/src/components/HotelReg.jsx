import React from 'react'
import { assets, cities } from '../assets/assets'

const HotelReg = () => {
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70 '>
        <form action="" className='flex bg-white rounded-xl maw-w-4xl max-md:mx-2 h-[600px]'>
            <img src={assets.regImage} alt="reg image" className='w-1/2 rounded-xl hidden md:block' />
            <div className='relative flex flex-col items-center md:w-1/2 p-8 md:p-10'>
                <img src={assets.closeIcon} alt="close icon" className='absolute top-4 right-4 w-4 h-4 cursor-pointer' />
                <p className='text-2xl font-semibold mt-6'>Register your hotel</p>
                {/* hotel name  */}
                <div className='w-full mt-4'>
                    <label htmlFor="name" className='font-medium text-gray-500'>Hotel Name</label>
                    <input type="text" placeholder='Type your hotel name' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required id='name' />
                </div>

                {/* phone  */}
                <div className='w-full mt-4'>
                    <label htmlFor="contact" className='font-medium text-gray-500'>Phone</label>
                    <input type="text" placeholder='Type your phone number' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required id='contact' />
                </div>

                {/* address  */}
                <div className='w-full mt-4'>
                    <label htmlFor="address" className='font-medium text-gray-500'>Address</label>
                    <input type="text" placeholder='Type your address' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required id='address' />
                </div>

                {/* select city drop down */}
                <div className='w-full mt-4 max-w-60 mr-auto'>
                    <label htmlFor="city" className='font-medium text-gray-500'>City</label>
                    <select id="city" className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required>
                        <option value="">Select your city</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>
                <button className='bg-indigo-500 hover:bg-indigo-600 transiton-all text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6'>Register</button>
            </div>

        </form>
    </div>
  )
}

export default HotelReg