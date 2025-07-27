import React from 'react'
import { useState } from 'react'
import Title from '../../components/Title';
import { assets } from '../../assets/assets';

const AddRoom = () => {
  const [images, setImages] = useState({1:null, 2:null, 3:null, 4:null});
  const [input, setInput] = useState({roomType: '', pricePerNight: 0, amenities: {
    'Free WiFi': false, 'Free Breakfast': false, 'Room Service': false, 'Mountain View': false, 'Pool Access': false}});
  return (
    <form action="">
      <Title title='Add Room'  align={"left"} font={"outfit"} subTitle={"fill in the details carefully to add a new room to your hotel"}/>
      {/* images */}
      <p className='text-gray-800 mt-10'>images</p>
      <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
        {Object.keys(images).map((key) => (
          <label htmlFor={`roomImage${key}`} key={key}>
              <img className='max-h-20 cursor-pointer opacity-100' src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea} alt="" />
              <input type="file"accept='image/*' id={`roomImage${key}`} hidden onChange={(e) => setImages({...images, [key]: e.target.files[0]})} />
              
          </label>
        ))}
      </div>
      <div className='flex w-full max-sm:flex-col sm:gap-4 mt-4'>
        <div className='flex-1 max-w-48'>
          <p className='text-gray-800 mt-4'>Room Type</p>
          <select className='border opacity-70 border-gray-300 mt-1 rounded p-2 w-full' onChange={(e) => setInput({...input, roomType: e.target.value})} value={input.roomType}>
            <option value="">Select Room Type</option>
            {['Single Bed', 'Double Bed', 'Luxury Room', 'Family Suite'].map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <p className='mt-4 text-gray-800'>
            Price <span className='text-xs'>/night</span>
          </p>
          <input type="number" placeholder='0' className='border border-gray-300 mt-1 rounded p-2 w-24' onChange={(e) => setInput({...input, pricePerNight: e.target.value})} value={input.pricePerNight} />
        </div>
      </div>
      <p className='text-gray-800 mt-4'>Amenities</p>
      <div className='flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm'>
        {Object.keys(input.amenities).map((key,index) => (
            <div key={index} >
              <input type="checkbox" id={`amenities${index+1}`} checked={input.amenities[key]} onChange={() => setInput({...input, amenities: {...input.amenities, [key]: !input.amenities[key]}})} />
              <label htmlFor={`amenities${index+1}`} className='ml-2 cursor-pointer'>{key}</label>
            
            </div>          

        ))}
      </div>
      <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded mt-6 hover:bg-blue-500'>Add Room</button>
    </form>
  )
}

export default AddRoom