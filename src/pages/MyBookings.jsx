import React, { useEffect, useState, useCallback } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const MyBookings = () => {

  const { axios, user, currency } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [activeTab, setActiveTab] = useState('all')

  const fetchMyBookings = useCallback(async ()=>{
    try {
      const { data } = await axios.get('/api/bookings/user')
      if (data.success){
        setBookings(data.bookings)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }, [axios])

  useEffect(()=>{
    user && fetchMyBookings()
  },[user, fetchMyBookings])

  const filteredBookings = activeTab === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === activeTab)

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 min-h-screen'>
      
      {/* Header Section */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>My Bookings</h1>
        <p className='text-gray-500 mt-2'>Manage and track your vehicle rentals</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
        <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
          <p className='text-gray-500 text-sm'>Total Bookings</p>
          <p className='text-2xl font-bold text-gray-800'>{bookings.length}</p>
        </div>
        <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
          <p className='text-gray-500 text-sm'>Confirmed</p>
          <p className='text-2xl font-bold text-green-600'>{bookings.filter(b => b.status === 'confirmed').length}</p>
        </div>
        <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
          <p className='text-gray-500 text-sm'>Pending</p>
          <p className='text-2xl font-bold text-yellow-600'>{bookings.filter(b => b.status === 'pending').length}</p>
        </div>
        <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
          <p className='text-gray-500 text-sm'>Total Spent</p>
          <p className='text-2xl font-bold text-primary'>{currency}{bookings.reduce((acc, b) => acc + (b.amountPaid || 0), 0)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className='flex gap-2 mb-6 overflow-x-auto pb-2'>
        {['all', 'pending', 'confirmed', 'cancelled'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
              activeTab === tab 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab} {tab !== 'all' && `(${bookings.filter(b => tab === 'all' ? true : b.status === tab).length})`}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className='space-y-4'>
        {filteredBookings.length === 0 ? (
          <div className='text-center py-16 bg-gray-50 rounded-xl'>
            <p className='text-gray-500'>No bookings found</p>
          </div>
        ) : (
          filteredBookings.map((booking, index)=>(
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              key={booking._id} 
              className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow'
            >
              <div className='flex flex-col md:flex-row'>
                {/* Car Image */}
                <div className='md:w-48 h-40 md:h-auto flex-shrink-0'>
                  <img 
                    src={booking.car.images && booking.car.images.length > 0 ? booking.car.images[0] : booking.car.image} 
                    alt="" 
                    className='w-full h-full object-cover'
                  />
                </div>

                {/* Content */}
                <div className='flex-1 p-5'>
                  <div className='flex flex-wrap items-start justify-between gap-4'>
                    <div>
                      <div className='flex items-center gap-3 mb-2'>
                        <h3 className='text-lg font-semibold text-gray-800'>{booking.car.brand} {booking.car.model}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className='text-gray-500 text-sm'>{booking.car.year} • {booking.car.category}</p>
                    </div>
                    <div className='text-right'>
                      <p className='text-2xl font-bold text-primary'>{currency}{booking.price}</p>
                      <p className='text-xs text-gray-400'>Total Price</p>
                    </div>
                  </div>

                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100'>
                    <div>
                      <p className='text-xs text-gray-400 mb-1'>Pickup</p>
                      <p className='text-sm font-medium'>{new Date(booking.pickupDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-400 mb-1'>Return</p>
                      <p className='text-sm font-medium'>{new Date(booking.returnDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-400 mb-1'>Location</p>
                      <p className='text-sm font-medium'>{booking.car.location}</p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-400 mb-1'>Payment</p>
                      <p className='text-sm font-medium text-green-600'>{currency}{booking.amountPaid || 0} paid</p>
                      {booking.price > (booking.amountPaid || 0) && (
                        <p className='text-xs text-red-500'>{currency}{booking.price - (booking.amountPaid || 0)} due</p>
                      )}
                    </div>
                  </div>

                  {/* Owner Contact */}
                  {booking.owner && (
                    <div className='mt-4 pt-4 border-t border-gray-100 flex items-center gap-4'>
                      <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm'>
                        {booking.owner.name?.charAt(0)}
                      </div>
                      <div>
                        <p className='text-sm font-medium'>{booking.owner.name}</p>
                        <p className='text-xs text-gray-500'>{booking.owner.phone}</p>
                      </div>
                      <a href={`tel:${booking.owner.phone}`} className='ml-auto px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors'>
                        Call Owner
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

export default MyBookings
