import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets, dashboardDummyData } from '../../assets/assets'

const Dashboard = () => {
    const [dashboardData,setDashboardData]=useState(dashboardDummyData)
  return (
    <div>
        <Title title='Dashboard' align={'left'} font={'outfit'} subTitle={'Overview of your hotel , track your bookings and manage your rooms all from one place.'} />
        <div className='flex gap-8 my-8'>
            {/* total booking */}
            <div className='bg-blue-600/3 border border-blue-600/10 rounded flex p-4 pr-8'>
                <img src={assets.totalBookingIcon} className='max-sm:hidden h-10' alt="total booking" />
                <div className='flex flex-col sm:ml-4 font-medium'>
                    <p className='text-blue-500 text-lg'>Total Bookings</p>
                    <p className='text-neutral-400 text-base'>{dashboardData.totalBookings}</p>
                </div>
            </div>
            {/* total revenue */}
             <div className='bg-blue-600/3 border border-blue-600/10 rounded flex p-4 pr-8'>
                <img src={assets.totalRevenueIcon} className='max-sm:hidden h-10' alt="total revenue" />
                <div className='flex flex-col sm:ml-4 font-medium'>
                    <p className='text-blue-500 text-lg'>Total Revenue</p>
                    <p className='text-neutral-400 text-base'>$ {dashboardData.totalRevenue}</p>
                </div>
            </div>

        </div>
        {/* recent bookings */}
        <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Recent Bookings</h2>
        <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll'>
            <table className='w-full'>
                <thead className='bg-gray-50'>
                    <tr>
                        <th className='py-3 px-4 text-gray-800 font-medium'>User Name</th>
                        <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Room Name</th>
                        <th className='py-3 px-4 text-gray-800 font-medium text-center'>Total amount</th>
                        <th className='py-3 px-4 text-gray-800 font-medium text-center'>payment status</th>  
                    </tr>
                </thead>

                <tbody className='text-sm'>
                    {
                        dashboardData.bookings.map((booking, index) => (
                            <tr key={index} className='border-b border-gray-200 hover:bg-gray-50'>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>{booking.user.username}</td>
                                <td className='py-3 px-4 max-sm:hidden text-gray-700 border-t border-gray-300'>{booking.room.roomType}</td>
                                <td className='py-3 px-4 text-center text-gray-700 border-t border-gray-300 text-center'>${booking.totalPrice}</td>
                                <td className='py-3 px-4 text-center text-gray-700 border-t border-gray-300'>
                                    <button className={`py-1 px-3 text-xs rounded-full mx-auto ${booking.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {booking.isPaid ? 'Completed' : 'pending'}
                                    </button>
                                </td>
                            </tr>
                        ))
                        
                    }
                    
                </tbody>
            </table>

        </div>
    </div>
  )
}

export default Dashboard