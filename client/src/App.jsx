import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import AllRooms from './pages/AllRooms'
import RoomDetailes from './pages/RoomDetailes'
import MyBookings from './pages/MyBookings'
import HotelReg from './components/HotelReg'
import Layout from './pages/hotelOwner/Layout'
import Dashboard from './pages/hotelOwner/Dashboard'
import AddRoom from './pages/hotelOwner/AddRoom'
import ListRoom from './pages/hotelOwner/ListRoom'
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './context/AppContext'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'

const App = () => {
  const isOwnerPath=useLocation().pathname.includes('owner')
  const isAdminPath=useLocation().pathname.includes('admin')
  const {showHotelReg}=useAppContext();
  return (
    <div>
      <Toaster />
      {!isOwnerPath && !isAdminPath && <Navbar />}
      {showHotelReg && <HotelReg />}
      <div className='min-h-[70vh]'>
       <Routes>
         <Route path='/' element={<Home />} />
        <Route path='/rooms' element={<AllRooms />} />
        <Route path='/rooms/:id' element={<RoomDetailes />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/owner' element={<Layout />} >
          <Route index element={<Dashboard />} />
          <Route path='add-room' element={<AddRoom />} />
          <Route path='list-room' element={<ListRoom />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/users' element={<UserManagement />} />

       </Routes>
      </div>
      {!isAdminPath && <Footer />}
    </div>
  )
}

export default App