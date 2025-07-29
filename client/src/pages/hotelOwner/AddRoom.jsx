import React from 'react'
import { useState } from 'react'
import Title from '../../components/Title';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddRoom = () => {
  const {axios,getToken}=useAppContext();
  const [images, setImages] = useState({1:null, 2:null, 3:null, 4:null});
  const [inputs, setInputs] = useState({roomType: '', pricePerNight: 0, amenities: {
    'Free WiFi': false, 'Free Breakfast': false, 'Room Service': false, 'Mountain View': false, 'Pool Access': false}});
const [loading,setLoading]=useState(false);
    const onSubmitHandler=async(e)=>{
        e.preventDefault();
        if(!inputs.roomType || !inputs.pricePerNight || !inputs.amenities ||!Object.values(images).some(image => image)){
          toast.error("fill in the details carefully to add a new room to your hotel");
          return;
        }
        setLoading(true);
        try{
          const formData=new FormData();
          formData.append("roomType",inputs.roomType);
          formData.append("pricePerNight",inputs.pricePerNight);
          const amenities=Object.keys(inputs.amenities).filter(key => inputs.amenities[key]);
          formData.append("amenities",JSON.stringify(amenities));
          Object.keys(images).forEach((key) => {
           images[key] && formData.append("images", images[key]);
          });
          const {data}=await axios.post(`/api/rooms`,formData,{headers:{authorization:`Bearer ${await getToken()}`}});
          if(data.success){
            toast.success(data.message);
            setLoading(false);
            setInputs({roomType: '', pricePerNight: 0, amenities: {
              'Free WiFi': false, 'Free Breakfast': false, 'Room Service': false, 'Mountain View': false, 'Pool Access': false}});
            setImages({1:null, 2:null, 3:null, 4:null});
          }else{
            toast.error(data.message);
          }
          
      }catch(error){
        toast.error(error.message);

      }finally{
        setLoading(false);
      }
    }
  return (
    <form action="" onSubmit={onSubmitHandler}>
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
          <select className='border opacity-70 border-gray-300 mt-1 rounded p-2 w-full' onChange={(e) => setInputs({...inputs, roomType: e.target.value})} value={inputs.roomType}>
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
          <input type="number" placeholder='0' className='border border-gray-300 mt-1 rounded p-2 w-24' onChange={(e) => setInputs({...inputs, pricePerNight: e.target.value})} value={inputs.pricePerNight} />
        </div>
      </div>
      <p className='text-gray-800 mt-4'>Amenities</p>
      <div className='flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm'>
        {Object.keys(inputs.amenities).map((key,index) => (
            <div key={index} >
              <input type="checkbox" id={`amenities${index+1}`} checked={inputs.amenities[key]} onChange={() => setInputs({...inputs, amenities: {...inputs.amenities, [key]: !inputs.amenities[key]}})} />
              <label htmlFor={`amenities${index+1}`} className='ml-2 cursor-pointer'>{key}</label>
            
            </div>          

        ))}
      </div>
      <button disabled={loading} type='submit' className='bg-blue-600 text-white px-4 py-2 rounded mt-6 hover:bg-blue-500'>{loading ? "Adding Room..." : "Add Room"}</button>
    </form>
  )
}

export default AddRoom