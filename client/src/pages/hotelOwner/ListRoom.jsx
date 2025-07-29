import React, { useEffect, useState } from 'react'

import Title from '../../components/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ListRoom = () => {
  const [rooms, setRooms] = useState([]); 
  const {axios,getToken,user,currency}=useAppContext();
  //fetch rooms
  const fetchRooms=async()=>{ 
    try{
        const {data}=await axios.get('/api/rooms/owner',{headers:{authorization:`Bearer ${await getToken()}`}}); 
       if(data.success){
        setRooms(data.rooms);
       }
       else{
        toast.error(data.message);
       }
            
    }catch(error){
        toast.error(error.message);
    }
  }
  //toggle availability for room 
const toggleRoomAvailability=async(roomId)=>{
  const {data}=await axios.post('/api/rooms/toggle-availability',{roomId},{headers:{authorization:`Bearer ${await getToken()}`}});
  if(data.success){
    toast.success(data.message);
    fetchRooms();
  }
  else{
    toast.error(data.message);
  }

}

  useEffect(()=>{
    if(user){
        fetchRooms();
    }
  },[user])
  return (
    <div>
       <Title title='Room listings' align={"left"} font={"outfit"} subTitle={"Here you can view,edit and manage all the rooms you have added to your hotel"}/>
       <p className='text-gray-500 mt-8'>all rooms</p>
       <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                    <tr>
                        <th className='py-3 px-4 text-gray-800 font-medium'>Name</th>
                        <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Facility</th>
                        <th className='py-3 px-4 text-gray-800 font-medium text-center'>Price per night</th>
                        <th className='py-3 px-4 text-gray-800 font-medium text-center'>Action</th>  
                    </tr>
                </thead>

                <tbody className='text-sm'>
                    {rooms.map((item,index) => (
                        <tr key={index} className='border-b border-gray-200'>
                            <td className='py-3 px-4 text-gray-700 border-t border-gray-200'>{item.roomType}</td>
                            <td className='py-3 px-4 text-gray-800 max-sm:hidden border-t border-gray-200'>{item.amenities.join(", ")}</td>
                            <td className='py-3 px-4 text-gray-800 text-center border-t border-gray-200'>{currency}{item.pricePerNight}</td>
                            <td className='py-3 px-4  text-center border-t border-gray-200'>
                              <label className="relative inline-flex items-center cursor-pointer gap-3">
                                <input
                                  type="checkbox"
                                  onChange={() => toggleRoomAvailability(item._id)}
                                  checked={item.isAvailable}
                                  className="sr-only peer"
                                />

                                {/* Background track */}
                                <div className="w-12 h-7 bg-slate-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-200"></div>

                                {/* Moving dot */}
                                <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                              </label>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

       </div>
    </div>
  )
}

export default ListRoom