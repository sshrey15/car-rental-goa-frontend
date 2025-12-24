import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import CarDetails from './pages/CarDetails'
import Cars from './pages/Cars'
import MyBookings from './pages/MyBookings'
import Footer from './components/Footer'
import Layout from './pages/owner/Layout'
import Dashboard from './pages/owner/Dashboard'
import AddCar from './pages/owner/AddCar'
import ManageCars from './pages/owner/ManageCars'
import ManageBookings from './pages/owner/ManageBookings'
import Login from './components/Login'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'
import HostLanding from './pages/HostLanding'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCars from './pages/admin/AdminCars'
import AdminBookings from './pages/admin/AdminBookings'
import AdminUsers from './pages/admin/AdminUsers'
import AdminCoupons from './pages/admin/AdminCoupons'
import AdminLocations from './pages/admin/AdminLocations'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import PaymentSuccess from './pages/PaymentSuccess'

const App = () => {

  const {showLogin} = useAppContext()
  const isOwnerPath = useLocation().pathname.startsWith('/owner')
  const isAdminPath = useLocation().pathname.startsWith('/admin')

  return (
    <>
     <Toaster />
      {showLogin && <Login/>}

      {!isOwnerPath && !isAdminPath && <Navbar/>}

    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/host' element={<HostLanding/>}/>
      <Route path='/car-details/:id' element={<CarDetails/>}/>
      <Route path='/cars' element={<Cars/>}/>
      <Route path='/my-bookings' element={<MyBookings/>}/>
      <Route path='/terms' element={<Terms/>}/>
      <Route path='/privacy' element={<Privacy/>}/>
      <Route path='/payment-success/:bookingId' element={<PaymentSuccess/>}/>
      
      <Route path='/owner' element={<Layout />}>
        <Route index element={<Dashboard />}/>
        <Route path="add-car" element={<AddCar />}/>
        <Route path="manage-cars" element={<ManageCars />}/>
        <Route path="manage-bookings" element={<ManageBookings />}/>
      </Route>

      <Route path='/admin' element={<AdminLayout />}>
        <Route index element={<AdminDashboard />}/>
        <Route path="cars" element={<AdminCars />}/>
        <Route path="bookings" element={<AdminBookings />}/>
        <Route path="users" element={<AdminUsers />}/>
        <Route path="coupons" element={<AdminCoupons />}/>
        <Route path="locations" element={<AdminLocations />}/>
      </Route>
    </Routes>

    {!isOwnerPath && !isAdminPath && <Footer />}
    
    </>
  )
}

export default App
